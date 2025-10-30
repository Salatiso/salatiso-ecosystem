import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Project {
  id: string;
  companyId: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  endDate?: Date;
  budget?: number;
  currency?: string;
  managerId: string;
  teamMembers: string[];
  milestones: Milestone[];
  deliverables: string[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  startDate?: Date;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  dependencies?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed';
  completedAt?: Date;
}

export interface Risk {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: 'operational' | 'financial' | 'compliance' | 'reputational' | 'technical';
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  riskScore: number;
  ownerId?: string;
  mitigationStrategy: string;
  status: 'active' | 'mitigated' | 'closed';
  reviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class OperationsService {
  private companyId: string;

  constructor(companyId: string) {
    this.companyId = companyId;
  }

  // Project Management
  async createProject(projectData: Omit<Project, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const projectsRef = collection(db, `companies/${this.companyId}/projects`);
      const docRef = await addDoc(projectsRef, {
        ...projectData,
        companyId: this.companyId,
        startDate: Timestamp.fromDate(projectData.startDate),
        endDate: projectData.endDate ? Timestamp.fromDate(projectData.endDate) : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
    try {
      const projectRef = doc(db, `companies/${this.companyId}/projects`, projectId);

      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      if (updates.startDate) {
        updateData.startDate = Timestamp.fromDate(updates.startDate);
      }
      if (updates.endDate) {
        updateData.endDate = Timestamp.fromDate(updates.endDate);
      }

      await updateDoc(projectRef, updateData);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      const projectRef = doc(db, `companies/${this.companyId}/projects`, projectId);
      await deleteDoc(projectRef);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  async getProjects(): Promise<Project[]> {
    try {
      const projectsRef = collection(db, `companies/${this.companyId}/projects`);
      const q = query(projectsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startDate: data.startDate?.toDate() || new Date(),
          endDate: data.endDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Project;
      });
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  }

  // Task Management
  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const tasksRef = collection(db, `companies/${this.companyId}/tasks`);
      const docRef = await addDoc(tasksRef, {
        ...taskData,
        startDate: taskData.startDate ? Timestamp.fromDate(taskData.startDate) : null,
        dueDate: taskData.dueDate ? Timestamp.fromDate(taskData.dueDate) : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const taskRef = doc(db, `companies/${this.companyId}/tasks`, taskId);

      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      if (updates.startDate) {
        updateData.startDate = Timestamp.fromDate(updates.startDate);
      }
      if (updates.dueDate) {
        updateData.dueDate = Timestamp.fromDate(updates.dueDate);
      }

      await updateDoc(taskRef, updateData);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      const taskRef = doc(db, `companies/${this.companyId}/tasks`, taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async getTasks(projectId?: string): Promise<Task[]> {
    try {
      const tasksRef = collection(db, `companies/${this.companyId}/tasks`);
      let q = query(tasksRef, orderBy('createdAt', 'desc'));

      if (projectId) {
        q = query(tasksRef, where('projectId', '==', projectId), orderBy('createdAt', 'desc'));
      }

      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startDate: data.startDate?.toDate(),
          dueDate: data.dueDate?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Task;
      });
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  }

  // Milestone Management
  async createMilestone(milestoneData: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const milestoneRef = doc(collection(db, 'companies', this.companyId, 'operations', 'milestones', 'items'));
      const milestoneId = milestoneRef.id;

      const milestone: Milestone = {
        ...milestoneData,
        id: milestoneId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(milestoneRef, {
        ...milestone,
        dueDate: Timestamp.fromDate(milestone.dueDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return milestoneId;
    } catch (error) {
      console.error('Error creating milestone:', error);
      throw error;
    }
  }

  async updateMilestone(milestoneId: string, updates: Partial<Milestone>): Promise<void> {
    try {
      const milestoneRef = doc(db, 'companies', this.companyId, 'operations', 'milestones', 'items', milestoneId);

      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      if (updates.dueDate) {
        updateData.dueDate = Timestamp.fromDate(updates.dueDate);
      }

      await updateDoc(milestoneRef, updateData);
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  }

  async deleteMilestone(milestoneId: string): Promise<void> {
    try {
      const milestoneRef = doc(db, 'companies', this.companyId, 'operations', 'milestones', 'items', milestoneId);
      await deleteDoc(milestoneRef);
    } catch (error) {
      console.error('Error deleting milestone:', error);
      throw error;
    }
  }

  async getMilestones(projectId?: string): Promise<Milestone[]> {
    try {
      const milestonesRef = collection(db, 'companies', this.companyId, 'operations', 'milestones', 'items');
      let q = query(milestonesRef, orderBy('dueDate', 'asc'));

      if (projectId) {
        q = query(milestonesRef, where('projectId', '==', projectId), orderBy('dueDate', 'asc'));
      }

      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          dueDate: data.dueDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Milestone;
      });
    } catch (error) {
      console.error('Error getting milestones:', error);
      throw error;
    }
  }

  // Risk Management
  async createRisk(riskData: Omit<Risk, 'id' | 'riskScore' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const riskRef = doc(collection(db, 'companies', this.companyId, 'operations', 'risks', 'items'));
      const riskId = riskRef.id;
      const riskScore = riskData.probability * riskData.impact;

      const risk: Risk = {
        ...riskData,
        id: riskId,
        riskScore,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(riskRef, {
        ...risk,
        reviewDate: Timestamp.fromDate(risk.reviewDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return riskId;
    } catch (error) {
      console.error('Error creating risk:', error);
      throw error;
    }
  }

  async updateRisk(riskId: string, updates: Partial<Risk>): Promise<void> {
    try {
      const riskRef = doc(db, 'companies', this.companyId, 'operations', 'risks', 'items', riskId);

      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      if (updates.probability && updates.impact) {
        updateData.riskScore = updates.probability * updates.impact;
      } else if (updates.probability || updates.impact) {
        // Need to recalculate risk score
        const currentDoc = await getDoc(riskRef);
        if (currentDoc.exists()) {
          const currentData = currentDoc.data() as Risk;
          const newProbability = updates.probability || currentData.probability;
          const newImpact = updates.impact || currentData.impact;
          updateData.riskScore = newProbability * newImpact;
        }
      }

      if (updates.reviewDate) {
        updateData.reviewDate = Timestamp.fromDate(updates.reviewDate);
      }

      await updateDoc(riskRef, updateData);
    } catch (error) {
      console.error('Error updating risk:', error);
      throw error;
    }
  }

  async deleteRisk(riskId: string): Promise<void> {
    try {
      const riskRef = doc(db, 'companies', this.companyId, 'operations', 'risks', 'items', riskId);
      await deleteDoc(riskRef);
    } catch (error) {
      console.error('Error deleting risk:', error);
      throw error;
    }
  }

  async getRisks(projectId?: string): Promise<Risk[]> {
    try {
      const risksRef = collection(db, 'companies', this.companyId, 'operations', 'risks', 'items');
      let q = query(risksRef, orderBy('riskScore', 'desc'));

      if (projectId) {
        q = query(risksRef, where('projectId', '==', projectId), orderBy('riskScore', 'desc'));
      }

      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          reviewDate: data.reviewDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Risk;
      });
    } catch (error) {
      console.error('Error getting risks:', error);
      throw error;
    }
  }
}