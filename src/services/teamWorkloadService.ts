import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Team Workload Service
 * Simple workload tracking and balancing for team members
 * Tracks active assignments and helps with fair distribution
 */
class TeamWorkloadService {
  private readonly WORKLOAD_COLLECTION = 'team_workload_snapshots';

  /**
   * Get current team workload snapshot
   */
  async getTeamWorkload(teamId: string): Promise<any> {
    try {
      const q = query(
        collection(db, this.WORKLOAD_COLLECTION),
        where('teamId', '==', teamId),
        orderBy('timestamp', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(q);
      return snapshot.empty ? null : snapshot.docs[0].data();
    } catch (error) {
      console.error('Error fetching team workload:', error);
      return null;
    }
  }

  /**
   * Record a new assignment for a member
   */
  async recordAssignment(teamId: string, memberId: string, escalationId: string): Promise<void> {
    try {
      const now = new Date();
      const assignment = {
        teamId,
        memberId,
        escalationId,
        createdAt: now,
        completed: false,
      };

      await addDoc(collection(db, `${this.WORKLOAD_COLLECTION}/assignments`), assignment);

      // Update team workload snapshot
      await this.updateWorkloadSnapshot(teamId);
    } catch (error) {
      console.error('Error recording assignment:', error);
    }
  }

  /**
   * Mark an assignment as completed
   */
  async completeAssignment(escalationId: string, teamId: string): Promise<void> {
    try {
      const q = query(
        collection(db, `${this.WORKLOAD_COLLECTION}/assignments`),
        where('escalationId', '==', escalationId),
        where('teamId', '==', teamId),
        where('completed', '==', false)
      );

      const snapshot = await getDocs(q);
      for (const doc_ref of snapshot.docs) {
        await updateDoc(doc_ref.ref, {
          completed: true,
          completedAt: new Date(),
        });
      }

      // Update team workload snapshot
      await this.updateWorkloadSnapshot(teamId);
    } catch (error) {
      console.error('Error completing assignment:', error);
    }
  }

  /**
   * Get current workload for a member
   */
  async getMemberWorkload(teamId: string, memberId: string): Promise<number> {
    try {
      const q = query(
        collection(db, `${this.WORKLOAD_COLLECTION}/assignments`),
        where('teamId', '==', teamId),
        where('memberId', '==', memberId),
        where('completed', '==', false)
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error fetching member workload:', error);
      return 0;
    }
  }

  /**
   * Get member with least workload
   */
  async getLeastBusyMember(teamId: string, memberIds: string[]): Promise<string | null> {
    try {
      let leastBusy = memberIds[0] || null;
      let minLoad = Infinity;

      for (const memberId of memberIds) {
        const load = await this.getMemberWorkload(teamId, memberId);
        if (load < minLoad) {
          minLoad = load;
          leastBusy = memberId;
        }
      }

      return leastBusy;
    } catch (error) {
      console.error('Error finding least busy member:', error);
      return memberIds[0] || null;
    }
  }

  /**
   * Check if member is overloaded (>5 active assignments)
   */
  async isMemberOverloaded(teamId: string, memberId: string, maxCapacity: number = 5): Promise<boolean> {
    try {
      const load = await this.getMemberWorkload(teamId, memberId);
      return load >= maxCapacity;
    } catch (error) {
      console.error('Error checking member overload:', error);
      return false;
    }
  }

  /**
   * Update team workload snapshot
   */
  private async updateWorkloadSnapshot(teamId: string): Promise<void> {
    try {
      // Get all active assignments for team
      const q = query(
        collection(db, `${this.WORKLOAD_COLLECTION}/assignments`),
        where('teamId', '==', teamId),
        where('completed', '==', false)
      );

      const snapshot = await getDocs(q);
      const assignments = snapshot.docs.map(d => d.data());

      // Calculate member workloads
      const memberLoads: { [key: string]: number } = {};
      assignments.forEach(a => {
        memberLoads[a.memberId] = (memberLoads[a.memberId] || 0) + 1;
      });

      // Create workload snapshot
      const workloadSnapshot = {
        teamId,
        timestamp: new Date(),
        totalActive: assignments.length,
        memberLoads: Object.entries(memberLoads).map(([memberId, load]) => ({
          memberId,
          currentAssignments: load,
        })),
      };

      // Find or create snapshot doc
      const snapQuery = query(
        collection(db, this.WORKLOAD_COLLECTION),
        where('teamId', '==', teamId),
        orderBy('timestamp', 'desc'),
        limit(1)
      );

      const snapSnapshot = await getDocs(snapQuery);
      if (snapSnapshot.empty) {
        await addDoc(collection(db, this.WORKLOAD_COLLECTION), workloadSnapshot);
      } else {
        await updateDoc(snapSnapshot.docs[0].ref, workloadSnapshot);
      }
    } catch (error) {
      console.error('Error updating workload snapshot:', error);
    }
  }

  /**
   * Get workload balance analysis
   */
  async getWorkloadBalance(teamId: string, memberIds: string[]): Promise<any> {
    try {
      const loads = [];
      for (const memberId of memberIds) {
        const load = await this.getMemberWorkload(teamId, memberId);
        loads.push(load);
      }

      if (loads.length === 0) {
        return { balanced: true, maxLoad: 0, minLoad: 0, variance: 0 };
      }

      const maxLoad = Math.max(...loads);
      const minLoad = Math.min(...loads);
      const avgLoad = loads.reduce((a, b) => a + b) / loads.length;
      const variance =
        loads.reduce((sum, load) => sum + Math.pow(load - avgLoad, 2), 0) / loads.length;

      return {
        balanced: variance < 2,
        maxLoad,
        minLoad,
        variance: Math.round(variance * 100) / 100,
        loads: memberIds.map((id, i) => ({ memberId: id, load: loads[i] })),
      };
    } catch (error) {
      console.error('Error analyzing workload balance:', error);
      return { balanced: false, maxLoad: 0, minLoad: 0, variance: 0 };
    }
  }

  /**
   * Predict if team will be overloaded
   */
  async predictTeamCapacity(teamId: string, memberIds: string[], newAssignments: number = 1): Promise<any> {
    try {
      let totalLoad = 0;
      for (const memberId of memberIds) {
        totalLoad += await this.getMemberWorkload(teamId, memberId);
      }

      const currentLoad = totalLoad;
      const projectedLoad = currentLoad + newAssignments;
      const capacityThreshold = 20;
      const atCapacity = projectedLoad >= capacityThreshold;

      return {
        currentLoad,
        projectedLoad,
        atCapacity,
        recommendation:
          projectedLoad >= capacityThreshold * 0.9
            ? 'Team approaching capacity'
            : 'Team has available capacity',
      };
    } catch (error) {
      console.error('Error predicting team capacity:', error);
      return {
        currentLoad: 0,
        projectedLoad: 0,
        atCapacity: false,
        recommendation: 'Error calculating capacity',
      };
    }
  }
}

export const teamWorkloadService = new TeamWorkloadService();
