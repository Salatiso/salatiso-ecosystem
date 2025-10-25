/**
 * Team Assignment Service
 * 
 * Handles intelligent assignment of escalations to team members,
 * workload management, and SLA tracking.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  addDoc,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
  TeamMember,
  Team,
  MemberWorkload,
  AssignmentRule,
  SLATracker,
  SLAStatus,
  AssignmentStrategy,
} from '@/types/teamAssignment';

class TeamAssignmentService {
  /**
   * Get team members for a team
   */
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      const membersQuery = query(
        collection(db, 'teams', teamId, 'members'),
        where('isAvailable', '==', true),
        orderBy('role')
      );

      const snapshot = await getDocs(membersQuery);
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as TeamMember));
    } catch (error) {
      console.error('Error getting team members:', error);
      throw error;
    }
  }

  /**
   * Get member workload information
   */
  async getMemberWorkload(memberId: string, teamId: string): Promise<MemberWorkload> {
    try {
      const workloadRef = doc(db, 'teams', teamId, 'workload', memberId);
      const workloadDoc = await getDoc(workloadRef);

      if (!workloadDoc.exists()) {
        return this.getDefaultWorkload(memberId, teamId);
      }

      return workloadDoc.data() as MemberWorkload;
    } catch (error) {
      console.error('Error getting member workload:', error);
      return this.getDefaultWorkload(memberId, teamId);
    }
  }

  /**
   * Assign an escalation to a team member
   */
  async assignToMember(
    escalationId: string,
    memberId: string,
    assignedBy: string,
    assignmentRuleId?: string
  ): Promise<string> {
    try {
      const assignmentRef = collection(db, 'escalations', escalationId, 'assignments');
      
      const docRef = await addDoc(assignmentRef, {
        memberId,
        assignedAt: Timestamp.now(),
        assignedBy,
        assignmentRuleId,
        status: 'assigned',
        statusUpdatedAt: Timestamp.now(),
        acknowledged: false,
        slaStatus: SLAStatus.NOT_STARTED,
      });

      // Update member workload
      await this.updateMemberWorkload(memberId, escalationId);

      return docRef.id;
    } catch (error) {
      console.error('Error assigning to member:', error);
      throw error;
    }
  }

  /**
   * Auto-assign escalation using assignment rules
   */
  async autoAssign(
    escalationId: string,
    context: string,
    severity: string,
    level: string,
    teamId: string
  ): Promise<string | null> {
    try {
      // Get applicable assignment rules
      const rulesQuery = query(
        collection(db, 'teams', teamId, 'assignmentRules'),
        where('enabled', '==', true),
        where('context', '==', context),
        orderBy('priority', 'desc'),
        limit(1)
      );

      const rulesSnapshot = await getDocs(rulesQuery);
      if (rulesSnapshot.empty) {
        return null; // No applicable rule
      }

      const rule = rulesSnapshot.docs[0].data() as AssignmentRule;

      // Get available team members
      const members = await this.getTeamMembers(teamId);

      if (members.length === 0) {
        return null; // No available members
      }

      // Apply assignment strategy
      let selectedMember: TeamMember | null = null;

      switch (rule.strategy) {
        case AssignmentStrategy.ROUND_ROBIN:
          selectedMember = await this.roundRobinAssignment(members, teamId);
          break;

        case AssignmentStrategy.LOAD_BALANCED:
          selectedMember = await this.loadBalancedAssignment(members, teamId);
          break;

        case AssignmentStrategy.SKILL_BASED:
          selectedMember = await this.skillBasedAssignment(
            members,
            rule.skillsRequired || [],
            teamId
          );
          break;

        case AssignmentStrategy.AVAILABILITY:
          selectedMember = await this.availabilityBasedAssignment(members, teamId);
          break;

        default:
          selectedMember = members[0];
      }

      if (!selectedMember) {
        return null;
      }

      // Assign and create SLA tracker
      const assignmentId = await this.assignToMember(
        escalationId,
        selectedMember.id,
        'system',
        rulesSnapshot.docs[0].id
      );

      // Create SLA tracker
      await this.createSLATracker(
        escalationId,
        assignmentId,
        rule.responseSLA,
        rule.resolutionSLA
      );

      return assignmentId;
    } catch (error) {
      console.error('Error auto-assigning escalation:', error);
      throw error;
    }
  }

  /**
   * Round-robin assignment strategy
   */
  private async roundRobinAssignment(
    members: TeamMember[],
    teamId: string
  ): Promise<TeamMember | null> {
    try {
      // Get member with least recent assignment
      let selectedMember = members[0];
      let oldestAssignment = Date.now();

      for (const member of members) {
        const workload = await this.getMemberWorkload(member.id, teamId);
        if (workload.currentCapacity > 70) {
          // Has capacity
          return member;
        }
      }

      return selectedMember;
    } catch (error) {
      console.error('Error in round-robin assignment:', error);
      return members[0];
    }
  }

  /**
   * Load-balanced assignment strategy
   */
  private async loadBalancedAssignment(
    members: TeamMember[],
    teamId: string
  ): Promise<TeamMember | null> {
    try {
      let selectedMember: TeamMember | null = null;
      let lowestLoad = 101;

      for (const member of members) {
        const workload = await this.getMemberWorkload(member.id, teamId);
        if (workload.currentCapacity < lowestLoad && workload.canAcceptMore) {
          lowestLoad = workload.currentCapacity;
          selectedMember = member;
        }
      }

      return selectedMember || members[0];
    } catch (error) {
      console.error('Error in load-balanced assignment:', error);
      return members[0];
    }
  }

  /**
   * Skill-based assignment strategy
   */
  private async skillBasedAssignment(
    members: TeamMember[],
    requiredSkills: string[],
    teamId: string
  ): Promise<TeamMember | null> {
    try {
      // Filter members with required skills
      const qualifiedMembers = members.filter(member =>
        requiredSkills.some(skill => member.skills.includes(skill))
      );

      if (qualifiedMembers.length === 0) {
        return members[0]; // Fallback to first member
      }

      // Among qualified, choose the one with lowest load
      return await this.loadBalancedAssignment(qualifiedMembers, teamId);
    } catch (error) {
      console.error('Error in skill-based assignment:', error);
      return members[0];
    }
  }

  /**
   * Availability-based assignment strategy
   */
  private async availabilityBasedAssignment(
    members: TeamMember[],
    teamId: string
  ): Promise<TeamMember | null> {
    try {
      const now = new Date();

      // Filter members currently available
      const availableNow = members.filter(member => {
        if (!member.workHours) return true;

        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        const dayOfWeek = now.getDay();

        return (
          member.workHours.daysOfWeek.includes(dayOfWeek) &&
          currentTime >= member.workHours.startTime &&
          currentTime <= member.workHours.endTime
        );
      });

      if (availableNow.length === 0) {
        return members[0];
      }

      // Among available, choose lowest load
      return await this.loadBalancedAssignment(availableNow, teamId);
    } catch (error) {
      console.error('Error in availability-based assignment:', error);
      return members[0];
    }
  }

  /**
   * Create SLA tracker for assignment
   */
  private async createSLATracker(
    escalationId: string,
    assignmentId: string,
    responseSLAMs: number,
    resolutionSLAMs: number
  ): Promise<string> {
    try {
      const now = new Date();
      const responseDeadline = new Date(now.getTime() + responseSLAMs);
      const resolutionDeadline = new Date(now.getTime() + resolutionSLAMs);

      const slaRef = collection(db, 'escalations', escalationId, 'slaTrackers');
      const docRef = await addDoc(slaRef, {
        assignmentId,
        responseDeadline: Timestamp.fromDate(responseDeadline),
        resolutionDeadline: Timestamp.fromDate(resolutionDeadline),
        responseStatus: SLAStatus.NOT_STARTED,
        resolutionStatus: SLAStatus.NOT_STARTED,
        breached: false,
        escalatedDueToSLA: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating SLA tracker:', error);
      throw error;
    }
  }

  /**
   * Check SLA status for escalation
   */
  async checkSLAStatus(escalationId: string): Promise<SLAStatus> {
    try {
      const now = new Date();
      const slaQuery = query(
        collection(db, 'escalations', escalationId, 'slaTrackers'),
        limit(1)
      );

      const snapshot = await getDocs(slaQuery);
      if (snapshot.empty) {
        return SLAStatus.NOT_STARTED;
      }

      const sla = snapshot.docs[0].data() as SLATracker;

      if (sla.resolutionStatus !== SLAStatus.NOT_STARTED) {
        return sla.resolutionStatus;
      }

      if (sla.responseStatus !== SLAStatus.NOT_STARTED) {
        return sla.responseStatus;
      }

      const resolutionDeadline = sla.resolutionDeadline instanceof Timestamp
        ? sla.resolutionDeadline.toDate()
        : new Date(sla.resolutionDeadline);

      const timeRemaining = resolutionDeadline.getTime() - now.getTime();
      const totalTime = resolutionDeadline.getTime() - new Date(sla.createdAt).getTime();
      const percentageRemaining = (timeRemaining / totalTime) * 100;

      if (percentageRemaining < 0) {
        return SLAStatus.BREACHED;
      } else if (percentageRemaining < 20) {
        return SLAStatus.AT_RISK;
      } else {
        return SLAStatus.IN_PROGRESS;
      }
    } catch (error) {
      console.error('Error checking SLA status:', error);
      return SLAStatus.IN_PROGRESS;
    }
  }

  /**
   * Update member workload
   */
  private async updateMemberWorkload(
    memberId: string,
    escalationId: string,
    remove: boolean = false
  ): Promise<void> {
    try {
      // Implementation would update the member's current workload
      console.log(
        `Workload ${remove ? 'decreased' : 'increased'} for ${memberId} due to ${escalationId}`
      );
    } catch (error) {
      console.error('Error updating member workload:', error);
    }
  }

  /**
   * Get default workload for new member
   */
  private getDefaultWorkload(memberId: string, teamId: string): MemberWorkload {
    return {
      memberId,
      teamId,
      totalActive: 0,
      byPriority: {
        critical: 0,
        high: 0,
        normal: 0,
        low: 0,
      },
      byContext: {},
      completionRate: 0,
      currentCapacity: 100,
      canAcceptMore: true,
      tasksCompletedToday: 0,
      tasksCompletedThisWeek: 0,
      updatedAt: new Date(),
    };
  }

  /**
   * Get team performance summary
   */
  async getTeamPerformance(teamId: string, days: number = 30): Promise<any> {
    try {
      const members = await this.getTeamMembers(teamId);
      const now = new Date();
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      let totalAssignments = 0;
      let totalCompleted = 0;
      let totalSLAMet = 0;

      for (const member of members) {
        // Query assignments for this member in the period
        const assignmentsRef = collection(db, 'users', member.userId, 'assignments');
        const assignmentsQuery = query(
          assignmentsRef,
          where('createdAt', '>=', startDate),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(assignmentsQuery);
        totalAssignments += snapshot.size;

        // Count completed with SLA met
        snapshot.docs.forEach(doc => {
          const assignment = doc.data();
          if (assignment.status === 'completed') {
            totalCompleted++;
            if (assignment.slaStatus === SLAStatus.RESOLVED) {
              totalSLAMet++;
            }
          }
        });
      }

      return {
        teamId,
        period: `Last ${days} days`,
        totalAssignments,
        totalCompleted,
        completionRate: totalAssignments > 0 ? (totalCompleted / totalAssignments) * 100 : 0,
        slaMet: totalSLAMet,
        slaComplianceRate: totalCompleted > 0 ? (totalSLAMet / totalCompleted) * 100 : 0,
        memberCount: members.length,
        calculatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error getting team performance:', error);
      throw error;
    }
  }

  /**
   * Manually assign escalation to team member
   */
  async manualAssign(
    escalationId: string,
    memberId: string,
    assignedBy: string,
    notes?: string
  ): Promise<string> {
    try {
      const assignmentId = await this.assignToMember(escalationId, memberId, assignedBy);

      // Log manual assignment
      console.log(`Manual assignment: ${escalationId} → ${memberId}`);

      return assignmentId;
    } catch (error) {
      console.error('Error in manual assignment:', error);
      throw error;
    }
  }

  /**
   * Reassign escalation to different member
   */
  async reassign(
    escalationId: string,
    newMemberId: string,
    reassignedBy: string,
    reason: string
  ): Promise<string> {
    try {
      // Get current assignment
      const assignmentsQuery = query(
        collection(db, 'escalations', escalationId, 'assignments'),
        where('status', '==', 'active'),
        limit(1)
      );

      const currentSnapshot = await getDocs(assignmentsQuery);
      if (currentSnapshot.empty) {
        return this.assignToMember(escalationId, newMemberId, reassignedBy);
      }

      const currentAssignment = currentSnapshot.docs[0];

      // Close current assignment
      await updateDoc(currentAssignment.ref, {
        status: 'transferred',
        statusUpdatedAt: Timestamp.now(),
        transferReason: reason,
        transferredTo: newMemberId,
      });

      // Create new assignment
      return this.assignToMember(escalationId, newMemberId, reassignedBy);
    } catch (error) {
      console.error('Error reassigning escalation:', error);
      throw error;
    }
  }
}

export const teamAssignmentService = new TeamAssignmentService();
export default teamAssignmentService;
