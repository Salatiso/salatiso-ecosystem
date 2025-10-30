/**
 * Role Service - RBAC Role Management
 * Handles role lookups, validation, and hierarchy checking
 * 
 * User Types:
 * - admin: System administrator (Salatiso)
 * - family: Parent/adult with full access
 * - license: Commercial/organizational license
 * - child: Age-gated child account
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Role {
  id: string;
  name: string;
  description: string;
  priority: number; // Higher = more permissions
  permissions: string[];
  ageRange?: { min?: number; max?: number };
  contentAccess: 'all' | 'kids_only' | 'restricted';
  maxUsers: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface RoleHierarchy {
  admin: 4;
  family: 3;
  license: 2;
  child: 1;
}

/**
 * Role hierarchy levels for permission checking
 * Higher priority = more permissions
 */
const ROLE_HIERARCHY: RoleHierarchy = {
  admin: 4,
  family: 3,
  license: 2,
  child: 1,
};

class RoleService {
  private static instance: RoleService;
  private rolesCache: Map<string, Role> = new Map();
  private cacheTimeout: number = 3600000; // 1 hour
  private lastCacheUpdate: number = 0;

  private constructor() {}

  static getInstance(): RoleService {
    if (!RoleService.instance) {
      RoleService.instance = new RoleService();
    }
    return RoleService.instance;
  }

  /**
   * Get role by ID with caching
   */
  async getRoleById(roleId: string): Promise<Role | null> {
    try {
      // Check cache first
      if (this.rolesCache.has(roleId)) {
        const cached = this.rolesCache.get(roleId);
        if (Date.now() - this.lastCacheUpdate < this.cacheTimeout) {
          return cached || null;
        }
      }

      // Fetch from Firestore
      const roleDoc = await getDoc(doc(db, 'roles', roleId));
      
      if (!roleDoc.exists()) {
        return null;
      }

      const role = roleDoc.data() as Role;
      this.rolesCache.set(roleId, role);
      this.lastCacheUpdate = Date.now();

      return role;
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  }

  /**
   * Get all roles
   */
  async getAllRoles(): Promise<Role[]> {
    try {
      // Check cache first
      if (this.rolesCache.size > 0 && Date.now() - this.lastCacheUpdate < this.cacheTimeout) {
        return Array.from(this.rolesCache.values());
      }

      const rolesRef = collection(db, 'roles');
      const snapshot = await getDocs(rolesRef);

      const roles = snapshot.docs.map(doc => doc.data() as Role);

      // Update cache
      this.rolesCache.clear();
      roles.forEach(role => this.rolesCache.set(role.id, role));
      this.lastCacheUpdate = Date.now();

      return roles;
    } catch (error) {
      console.error('Error fetching all roles:', error);
      throw error;
    }
  }

  /**
   * Get user's assigned roles
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    try {
      // Get user role assignment
      const assignmentDoc = await getDoc(
        doc(db, 'user_role_assignments', userId)
      );

      if (!assignmentDoc.exists()) {
        return [];
      }

      const assignmentData = assignmentDoc.data() as DocumentData;
      const assignedRoleIds = assignmentData.assignedRoles || [];

      // Fetch all assigned roles
      const roles: Role[] = [];
      for (const roleId of assignedRoleIds) {
        const role = await this.getRoleById(roleId);
        if (role) {
          roles.push(role);
        }
      }

      return roles;
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
  }

  /**
   * Get user's primary role
   */
  async getUserPrimaryRole(userId: string): Promise<Role | null> {
    try {
      const assignmentDoc = await getDoc(
        doc(db, 'user_role_assignments', userId)
      );

      if (!assignmentDoc.exists()) {
        return null;
      }

      const assignmentData = assignmentDoc.data() as DocumentData;
      const primaryRoleId = assignmentData.primaryRole;

      if (!primaryRoleId) {
        return null;
      }

      return this.getRoleById(primaryRoleId);
    } catch (error) {
      console.error('Error fetching user primary role:', error);
      throw error;
    }
  }

  /**
   * Validate if user has a specific role
   */
  async hasRole(userId: string, roleId: string): Promise<boolean> {
    try {
      const roles = await this.getUserRoles(userId);
      return roles.some(role => role.id === roleId);
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }

  /**
   * Validate if user is admin
   */
  async isAdmin(userId: string): Promise<boolean> {
    try {
      return this.hasRole(userId, 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Check if user has role with minimum priority level
   */
  async hasMinimumPriority(
    userId: string,
    minimumPriority: number
  ): Promise<boolean> {
    try {
      const roles = await this.getUserRoles(userId);

      return roles.some(role => {
        const priority = ROLE_HIERARCHY[role.id as keyof RoleHierarchy];
        return priority >= minimumPriority;
      });
    } catch (error) {
      console.error('Error checking priority:', error);
      return false;
    }
  }

  /**
   * Get highest priority role for user
   */
  async getHighestPriorityRole(userId: string): Promise<Role | null> {
    try {
      const roles = await this.getUserRoles(userId);

      if (roles.length === 0) {
        return null;
      }

      return roles.reduce((highest, current) => {
        const currentPriority = ROLE_HIERARCHY[current.id as keyof RoleHierarchy] || 0;
        const highestPriority = ROLE_HIERARCHY[highest.id as keyof RoleHierarchy] || 0;

        return currentPriority > highestPriority ? current : highest;
      });
    } catch (error) {
      console.error('Error getting highest priority role:', error);
      return null;
    }
  }

  /**
   * Validate access based on role hierarchy
   * Returns true if sourceRole has equal or higher priority than requiredRole
   */
  validateAccess(
    sourceRoleId: string,
    requiredRoleId: string
  ): boolean {
    const sourcePriority = ROLE_HIERARCHY[sourceRoleId as keyof RoleHierarchy] || 0;
    const requiredPriority = ROLE_HIERARCHY[requiredRoleId as keyof RoleHierarchy] || 0;

    return sourcePriority >= requiredPriority;
  }

  /**
   * Clear cache (useful for testing)
   */
  clearCache(): void {
    this.rolesCache.clear();
    this.lastCacheUpdate = 0;
  }

  /**
   * Get role hierarchy level
   */
  getRolePriority(roleId: string): number {
    return ROLE_HIERARCHY[roleId as keyof RoleHierarchy] || 0;
  }

  /**
   * Check if role is child role
   */
  isChildRole(roleId: string): boolean {
    return roleId === 'child';
  }

  /**
   * Check if role is family role
   */
  isFamilyRole(roleId: string): boolean {
    return roleId === 'family';
  }

  /**
   * Check if role is license role
   */
  isLicenseRole(roleId: string): boolean {
    return roleId === 'license';
  }

  /**
   * Check if role is admin role
   */
  isAdminRole(roleId: string): boolean {
    return roleId === 'admin';
  }
}

export default RoleService.getInstance();
