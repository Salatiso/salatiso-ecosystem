import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// Import types from ProfessionalContext
import type {
  CompanyProfile,
  Policy,
  PolicyAcknowledgment,
  ComplianceRecord,
  BoardMember,
  BoardMeeting
} from '../professional/ProfessionalContext';

/**
 * Governance Service
 * Handles all Firebase operations for company governance data
 */
export class GovernanceService {
  private companyId: string;

  constructor(companyId: string) {
    this.companyId = companyId;
  }

  // Company Profile Operations
  async getCompanyProfile(): Promise<CompanyProfile | null> {
    try {
      const companyRef = doc(db, 'companies', this.companyId);
      const companySnap = await getDoc(companyRef);

      if (companySnap.exists()) {
        const data = companySnap.data();
        return {
          ...data,
          incorporationDate: data.incorporationDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as CompanyProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting company profile:', error);
      throw new Error('Failed to get company profile');
    }
  }

  async createCompanyProfile(profile: Omit<CompanyProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const companyRef = doc(db, 'companies', this.companyId);
      const companyData = {
        ...profile,
        id: this.companyId,
        incorporationDate: Timestamp.fromDate(profile.incorporationDate),
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      };

      await setDoc(companyRef, companyData);
    } catch (error) {
      console.error('Error creating company profile:', error);
      throw new Error('Failed to create company profile');
    }
  }

  async updateCompanyProfile(updates: Partial<CompanyProfile>): Promise<void> {
    try {
      const companyRef = doc(db, 'companies', this.companyId);
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      // Convert dates to Firestore Timestamps
      if (updates.incorporationDate) {
        updateData.incorporationDate = Timestamp.fromDate(updates.incorporationDate);
      }

      await updateDoc(companyRef, updateData);
    } catch (error) {
      console.error('Error updating company profile:', error);
      throw new Error('Failed to update company profile');
    }
  }

  // Constitution Operations
  async getConstitution() {
    try {
      const constitutionRef = doc(db, 'companies', this.companyId, 'governance', 'constitution');
      const constitutionSnap = await getDoc(constitutionRef);

      if (constitutionSnap.exists()) {
        const data = constitutionSnap.data();
        return {
          ...data,
          lastUpdated: data.lastUpdated?.toDate() || new Date(),
        };
      }

      return {
        content: '',
        lastUpdated: new Date(),
        approvedBy: []
      };
    } catch (error) {
      console.error('Error getting constitution:', error);
      throw new Error('Failed to get constitution');
    }
  }

  async updateConstitution(content: string, approvedBy: string[]): Promise<void> {
    try {
      const constitutionRef = doc(db, 'companies', this.companyId, 'governance', 'constitution');
      await setDoc(constitutionRef, {
        content,
        lastUpdated: Timestamp.fromDate(new Date()),
        approvedBy
      });
    } catch (error) {
      console.error('Error updating constitution:', error);
      throw new Error('Failed to update constitution');
    }
  }

  // Policy Operations
  async getPolicies(): Promise<Policy[]> {
    try {
      const policiesRef = collection(db, 'companies', this.companyId, 'policies');
      const q = query(policiesRef, orderBy('effectiveDate', 'desc'));
      const querySnapshot = await getDoc(doc(db, 'companies', this.companyId, 'governance', 'policies'));

      if (querySnapshot.exists()) {
        const data = querySnapshot.data();
        return (data.policies || []).map((policy: any) => ({
          ...policy,
          effectiveDate: policy.effectiveDate?.toDate() || new Date(),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error getting policies:', error);
      throw new Error('Failed to get policies');
    }
  }

  async createPolicy(policy: Omit<Policy, 'id'>): Promise<string> {
    try {
      const policiesRef = collection(db, 'companies', this.companyId, 'policies');
      const policyData = {
        ...policy,
        id: `policy_${Date.now()}`,
        effectiveDate: Timestamp.fromDate(policy.effectiveDate),
      };

      await addDoc(policiesRef, policyData);
      return policyData.id;
    } catch (error) {
      console.error('Error creating policy:', error);
      throw new Error('Failed to create policy');
    }
  }

  async updatePolicy(policyId: string, updates: Partial<Policy>): Promise<void> {
    try {
      const policyRef = doc(db, 'companies', this.companyId, 'policies', policyId);
      const updateData: any = { ...updates };

      if (updates.effectiveDate) {
        updateData.effectiveDate = Timestamp.fromDate(updates.effectiveDate);
      }

      await updateDoc(policyRef, updateData);
    } catch (error) {
      console.error('Error updating policy:', error);
      throw new Error('Failed to update policy');
    }
  }

  async acknowledgePolicy(policyId: string, userId: string, userName: string, version: number): Promise<void> {
    try {
      const acknowledgment: PolicyAcknowledgment = {
        userId,
        userName,
        acknowledgedAt: new Date(),
        version
      };

      const policyRef = doc(db, 'companies', this.companyId, 'policies', policyId);
      const policySnap = await getDoc(policyRef);

      if (policySnap.exists()) {
        const policy = policySnap.data() as Policy;
        const acknowledgments = policy.acknowledgments || [];
        acknowledgments.push(acknowledgment);

        await updateDoc(policyRef, { acknowledgments });
      }
    } catch (error) {
      console.error('Error acknowledging policy:', error);
      throw new Error('Failed to acknowledge policy');
    }
  }

  // Compliance Operations
  async getComplianceRecords(): Promise<ComplianceRecord[]> {
    try {
      const complianceRef = collection(db, 'companies', this.companyId, 'compliance');
      const q = query(complianceRef, orderBy('dueDate', 'asc'));
      const querySnapshot = await getDoc(doc(db, 'companies', this.companyId, 'governance', 'compliance'));

      if (querySnapshot.exists()) {
        const data = querySnapshot.data();
        return (data.records || []).map((record: any) => ({
          ...record,
          dueDate: record.dueDate?.toDate() || new Date(),
          completedAt: record.completedAt?.toDate(),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error getting compliance records:', error);
      throw new Error('Failed to get compliance records');
    }
  }

  async createComplianceRecord(record: Omit<ComplianceRecord, 'id'>): Promise<string> {
    try {
      const complianceRef = collection(db, 'companies', this.companyId, 'compliance');
      const recordData = {
        ...record,
        id: `compliance_${Date.now()}`,
        dueDate: Timestamp.fromDate(record.dueDate),
        completedAt: record.completedAt ? Timestamp.fromDate(record.completedAt) : null,
      };

      await addDoc(complianceRef, recordData);
      return recordData.id;
    } catch (error) {
      console.error('Error creating compliance record:', error);
      throw new Error('Failed to create compliance record');
    }
  }

  async updateComplianceRecord(recordId: string, updates: Partial<ComplianceRecord>): Promise<void> {
    try {
      const recordRef = doc(db, 'companies', this.companyId, 'compliance', recordId);
      const updateData: any = { ...updates };

      if (updates.dueDate) {
        updateData.dueDate = Timestamp.fromDate(updates.dueDate);
      }
      if (updates.completedAt) {
        updateData.completedAt = Timestamp.fromDate(updates.completedAt);
      }

      await updateDoc(recordRef, updateData);
    } catch (error) {
      console.error('Error updating compliance record:', error);
      throw new Error('Failed to update compliance record');
    }
  }

  // Board Operations
  async getBoardMembers(): Promise<BoardMember[]> {
    try {
      const boardRef = collection(db, 'companies', this.companyId, 'board');
      const q = query(boardRef, orderBy('appointedDate', 'desc'));
      const querySnapshot = await getDoc(doc(db, 'companies', this.companyId, 'governance', 'board'));

      if (querySnapshot.exists()) {
        const data = querySnapshot.data();
        return (data.members || []).map((member: any) => ({
          ...member,
          appointedDate: member.appointedDate?.toDate() || new Date(),
          termEnd: member.termEnd?.toDate(),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error getting board members:', error);
      throw new Error('Failed to get board members');
    }
  }

  async addBoardMember(member: Omit<BoardMember, 'id'>): Promise<string> {
    try {
      const boardRef = collection(db, 'companies', this.companyId, 'board');
      const memberData = {
        ...member,
        id: `board_${Date.now()}`,
        appointedDate: Timestamp.fromDate(member.appointedDate),
        termEnd: member.termEnd ? Timestamp.fromDate(member.termEnd) : null,
      };

      await addDoc(boardRef, memberData);
      return memberData.id;
    } catch (error) {
      console.error('Error adding board member:', error);
      throw new Error('Failed to add board member');
    }
  }

  async updateBoardMember(memberId: string, updates: Partial<BoardMember>): Promise<void> {
    try {
      const memberRef = doc(db, 'companies', this.companyId, 'board', memberId);
      const updateData: any = { ...updates };

      if (updates.appointedDate) {
        updateData.appointedDate = Timestamp.fromDate(updates.appointedDate);
      }
      if (updates.termEnd) {
        updateData.termEnd = Timestamp.fromDate(updates.termEnd);
      }

      await updateDoc(memberRef, updateData);
    } catch (error) {
      console.error('Error updating board member:', error);
      throw new Error('Failed to update board member');
    }
  }

  // Meeting Operations
  async getBoardMeetings(): Promise<BoardMeeting[]> {
    try {
      const meetingsRef = collection(db, 'companies', this.companyId, 'meetings');
      const q = query(meetingsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDoc(doc(db, 'companies', this.companyId, 'governance', 'meetings'));

      if (querySnapshot.exists()) {
        const data = querySnapshot.data();
        return (data.meetings || []).map((meeting: any) => ({
          ...meeting,
          date: meeting.date?.toDate() || new Date(),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error getting board meetings:', error);
      throw new Error('Failed to get board meetings');
    }
  }

  async createBoardMeeting(meeting: Omit<BoardMeeting, 'id'>): Promise<string> {
    try {
      const meetingsRef = collection(db, 'companies', this.companyId, 'meetings');
      const meetingData = {
        ...meeting,
        id: `meeting_${Date.now()}`,
        date: Timestamp.fromDate(meeting.date),
      };

      await addDoc(meetingsRef, meetingData);
      return meetingData.id;
    } catch (error) {
      console.error('Error creating board meeting:', error);
      throw new Error('Failed to create board meeting');
    }
  }

  async updateBoardMeeting(meetingId: string, updates: Partial<BoardMeeting>): Promise<void> {
    try {
      const meetingRef = doc(db, 'companies', this.companyId, 'meetings', meetingId);
      const updateData: any = { ...updates };

      if (updates.date) {
        updateData.date = Timestamp.fromDate(updates.date);
      }

      await updateDoc(meetingRef, updateData);
    } catch (error) {
      console.error('Error updating board meeting:', error);
      throw new Error('Failed to update board meeting');
    }
  }

  // Real-time listeners
  subscribeToCompanyProfile(callback: (profile: CompanyProfile | null) => void) {
    const companyRef = doc(db, 'companies', this.companyId);
    return onSnapshot(companyRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const profile: CompanyProfile = {
          ...data,
          incorporationDate: data.incorporationDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as CompanyProfile;
        callback(profile);
      } else {
        callback(null);
      }
    });
  }

  subscribeToPolicies(callback: (policies: Policy[]) => void) {
    const policiesRef = collection(db, 'companies', this.companyId, 'policies');
    const q = query(policiesRef, orderBy('effectiveDate', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
      const policies: Policy[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        policies.push({
          ...data,
          effectiveDate: data.effectiveDate?.toDate() || new Date(),
        } as Policy);
      });
      callback(policies);
    });
  }

  subscribeToComplianceRecords(callback: (records: ComplianceRecord[]) => void) {
    const complianceRef = collection(db, 'companies', this.companyId, 'compliance');
    const q = query(complianceRef, orderBy('dueDate', 'asc'));

    return onSnapshot(q, (querySnapshot) => {
      const records: ComplianceRecord[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        records.push({
          ...data,
          dueDate: data.dueDate?.toDate() || new Date(),
          completedAt: data.completedAt?.toDate(),
        } as ComplianceRecord);
      });
      callback(records);
    });
  }

  subscribeToBoardMembers(callback: (members: BoardMember[]) => void) {
    const boardRef = collection(db, 'companies', this.companyId, 'board');
    const q = query(boardRef, orderBy('appointedDate', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
      const members: BoardMember[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        members.push({
          ...data,
          appointedDate: data.appointedDate?.toDate() || new Date(),
          termEnd: data.termEnd?.toDate(),
        } as BoardMember);
      });
      callback(members);
    });
  }

  subscribeToBoardMeetings(callback: (meetings: BoardMeeting[]) => void) {
    const meetingsRef = collection(db, 'companies', this.companyId, 'meetings');
    const q = query(meetingsRef, orderBy('date', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
      const meetings: BoardMeeting[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        meetings.push({
          ...data,
          date: data.date?.toDate() || new Date(),
        } as BoardMeeting);
      });
      callback(meetings);
    });
  }
}

// Factory function to create governance service instance
export const createGovernanceService = (companyId: string): GovernanceService => {
  return new GovernanceService(companyId);
};