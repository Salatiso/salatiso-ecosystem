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
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// Import types from ProfessionalContext
import type {
  RoleDefinition,
  Employee,
  EmploymentContract,
  PerformanceReview,
  DevelopmentPlan,
  SkillInventory
} from '@/contexts/professional/ProfessionalContext';

/**
 * Human Capital Service
 * Handles all Firebase operations for human capital management
 */
export class HumanCapitalService {
  private companyId: string;

  constructor(companyId: string) {
    this.companyId = companyId;
  }

  // Role Management
  async getRoles(): Promise<RoleDefinition[]> {
    try {
      const rolesRef = collection(db, `companies/${this.companyId}/roles`);
      const querySnapshot = await getDocs(rolesRef);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as RoleDefinition;
      });
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  async createRole(roleData: Omit<RoleDefinition, 'id'>): Promise<RoleDefinition> {
    try {
      const rolesRef = collection(db, `companies/${this.companyId}/roles`);
      const roleDoc = {
        ...roleData,
        id: `role_${Date.now()}`,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(rolesRef, roleDoc);
      return {
        ...roleData,
        id: roleDoc.id
      };
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  async updateRole(roleId: string, updates: Partial<RoleDefinition>): Promise<void> {
    try {
      // Find the role document
      const rolesRef = collection(db, `companies/${this.companyId}/roles`);
      const q = query(rolesRef, where('id', '==', roleId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const roleDoc = querySnapshot.docs[0];
        await updateDoc(roleDoc.ref, {
          ...updates,
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  // Employee Management
  async getEmployees(): Promise<Employee[]> {
    try {
      const employeesRef = collection(db, `companies/${this.companyId}/employees`);
      const querySnapshot = await getDocs(employeesRef);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          startDate: data.startDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Employee;
      });
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async createEmployee(employeeData: Omit<Employee, 'id'>): Promise<Employee> {
    try {
      const employeesRef = collection(db, `companies/${this.companyId}/employees`);
      const docRef = await addDoc(employeesRef, {
        ...employeeData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return {
        id: docRef.id,
        ...employeeData
      };
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(employeeId: string, updates: Partial<Employee>): Promise<void> {
    try {
      const employeeRef = doc(db, `companies/${this.companyId}/employees/${employeeId}`);
      await updateDoc(employeeRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  // Contract Management
  async getContracts(): Promise<EmploymentContract[]> {
    try {
      const contractsRef = collection(db, `companies/${this.companyId}/contracts`);
      const querySnapshot = await getDocs(contractsRef);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          startDate: data.startDate?.toDate() || new Date(),
          endDate: data.endDate?.toDate(),
          signedAt: data.signedAt?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as EmploymentContract;
      });
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  }

  async createContract(contractData: Omit<EmploymentContract, 'id'>): Promise<EmploymentContract> {
    try {
      const contractsRef = collection(db, `companies/${this.companyId}/contracts`);
      const docRef = await addDoc(contractsRef, {
        ...contractData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return {
        id: docRef.id,
        ...contractData
      };
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  }

  async updateContract(contractId: string, updates: Partial<EmploymentContract>): Promise<void> {
    try {
      const contractRef = doc(db, `companies/${this.companyId}/contracts/${contractId}`);
      await updateDoc(contractRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  }

  // Performance Management
  async getPerformanceReviews(): Promise<PerformanceReview[]> {
    try {
      const performanceRef = collection(db, `companies/${this.companyId}/performance`);
      const querySnapshot = await getDocs(performanceRef);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          reviewPeriod: {
            start: data.reviewPeriod?.start?.toDate() || new Date(),
            end: data.reviewPeriod?.end?.toDate() || new Date()
          },
          createdAt: data.createdAt?.toDate() || new Date()
        } as PerformanceReview;
      });
    } catch (error) {
      console.error('Error fetching performance reviews:', error);
      throw error;
    }
  }

  async createPerformanceReview(reviewData: Omit<PerformanceReview, 'id' | 'createdAt'>): Promise<PerformanceReview> {
    try {
      const performanceRef = collection(db, `companies/${this.companyId}/performance`);
      const docRef = await addDoc(performanceRef, {
        ...reviewData,
        createdAt: Timestamp.now()
      });

      return {
        id: docRef.id,
        ...reviewData,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error creating performance review:', error);
      throw error;
    }
  }

  async updatePerformanceReview(reviewId: string, updates: Partial<PerformanceReview>): Promise<void> {
    try {
      const reviewRef = doc(db, `companies/${this.companyId}/performance/${reviewId}`);
      await updateDoc(reviewRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating performance review:', error);
      throw error;
    }
  }

  // Development Plans
  async getDevelopmentPlans(): Promise<DevelopmentPlan[]> {
    try {
      const developmentRef = collection(db, `companies/${this.companyId}/development`);
      const querySnapshot = await getDocs(developmentRef);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          timeline: {
            start: data.timeline?.start?.toDate() || new Date(),
            end: data.timeline?.end?.toDate() || new Date()
          },
          activities: data.activities || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as DevelopmentPlan;
      });
    } catch (error) {
      console.error('Error fetching development plans:', error);
      throw error;
    }
  }

  async createDevelopmentPlan(planData: Omit<DevelopmentPlan, 'id'>): Promise<DevelopmentPlan> {
    try {
      const developmentRef = collection(db, `companies/${this.companyId}/development`);
      const docRef = await addDoc(developmentRef, {
        ...planData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return {
        id: docRef.id,
        ...planData
      };
    } catch (error) {
      console.error('Error creating development plan:', error);
      throw error;
    }
  }

  async updateDevelopmentPlan(planId: string, updates: Partial<DevelopmentPlan>): Promise<void> {
    try {
      const planRef = doc(db, `companies/${this.companyId}/development/${planId}`);
      await updateDoc(planRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating development plan:', error);
      throw error;
    }
  }

  // Skills Inventory
  async getSkillsInventory(): Promise<SkillInventory[]> {
    try {
      const skillsRef = collection(db, `companies/${this.companyId}/skills`);
      const querySnapshot = await getDocs(skillsRef);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          employeeId: doc.id,
          skills: data.skills || [],
          certifications: data.certifications || [],
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as SkillInventory;
      });
    } catch (error) {
      console.error('Error fetching skills inventory:', error);
      throw error;
    }
  }

  async updateSkillsInventory(employeeId: string, skillsData: SkillInventory): Promise<void> {
    try {
      const skillsRef = doc(db, `companies/${this.companyId}/skills/${employeeId}`);
      await setDoc(skillsRef, {
        ...skillsData,
        updatedAt: Timestamp.now()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating skills inventory:', error);
      throw error;
    }
  }
}

// Factory function to create service instance
export const createHumanCapitalService = (companyId: string) => {
  return new HumanCapitalService(companyId);
};