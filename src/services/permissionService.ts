/**
 * Permission Service - RBAC Permission Checking
 * Validates user permissions with Redis-style caching
 * Target: <50ms latency per check
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
import roleService from './roleService';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'admin' | 'data' | 'system';
  requiresApproval: boolean;
  appliesTo: string[]; // Role IDs this permission applies to
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface CachedPermission {
  permissions: string[];
  timestamp: number;
}

interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  timestamp: number;
  cached: boolean;
}

class PermissionService {
  private static instance: PermissionService;
  private permissionCache: Map<string, CachedPermission> = new Map();
  private permissionDefinitions: Map<string, Permission> = new Map();
  private cacheTimeout: number = 3600000; // 1 hour
  private lastDefinitionUpdate: number = 0;
  private definitionCacheTimeout: number = 3600000; // 1 hour

  private constructor() {}

  static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  /**
   * Check if user has specific permission - MAIN METHOD
   * Target: <50ms latency
   */
  async checkPermission(
    userId: string,
    permissionId: string
  ): Promise<PermissionCheckResult> {
    const startTime = Date.now();

    try {
      // Check cache first (should be <1ms if cached)
      const cachedResult = this.checkPermissionCache(userId, permissionId);
      if (cachedResult !== null) {
        const latency = Date.now() - startTime;
        return {
          allowed: cachedResult,
          cached: true,
          timestamp: Date.now(),
          reason: cachedResult ? 'Cached: permission granted' : 'Cached: permission denied',
        };
      }

      // Get user's primary role
      const userRole = await roleService.getUserPrimaryRole(userId);
      if (!userRole) {
        const latency = Date.now() - startTime;
        return {
          allowed: false,
          reason: 'No role assigned to user',
          timestamp: Date.now(),
          cached: false,
        };
      }

      // Get permission definition
      const permission = await this.getPermissionById(permissionId);
      if (!permission) {
        const latency = Date.now() - startTime;
        return {
          allowed: false,
          reason: 'Permission not found',
          timestamp: Date.now(),
          cached: false,
        };
      }

      // Check if user's role has this permission
      const allowed = permission.appliesTo.includes(userRole.id);

      // Cache result
      this.cachePermission(userId, permissionId, allowed);

      const latency = Date.now() - startTime;
      return {
        allowed,
        reason: allowed
          ? `Permission granted for role ${userRole.id}`
          : `Permission denied for role ${userRole.id}`,
        timestamp: Date.now(),
        cached: false,
      };
    } catch (error) {
      console.error('Error checking permission:', error);
      const latency = Date.now() - startTime;
      return {
        allowed: false,
        reason: `Error checking permission: ${error}`,
        timestamp: Date.now(),
        cached: false,
      };
    }
  }

  /**
   * Shorthand: check if user has permission
   */
  async hasPermission(userId: string, permissionId: string): Promise<boolean> {
    const result = await this.checkPermission(userId, permissionId);
    return result.allowed;
  }

  /**
   * Get all permissions for user
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      // Check cache first
      if (this.permissionCache.has(userId)) {
        const cached = this.permissionCache.get(userId);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
          return cached.permissions;
        }
      }

      // Get user's roles
      const userRoles = await roleService.getUserRoles(userId);
      if (userRoles.length === 0) {
        return [];
      }

      // Get all permissions
      const allPermissions = await this.getAllPermissions();

      // Filter permissions that apply to user's roles
      const userPermissions = allPermissions
        .filter(permission => {
          return userRoles.some(role => permission.appliesTo.includes(role.id));
        })
        .map(p => p.id);

      // Cache result
      this.permissionCache.set(userId, {
        permissions: userPermissions,
        timestamp: Date.now(),
      });

      return userPermissions;
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }

  /**
   * Validate multiple permissions (AND logic)
   * Returns true only if user has ALL permissions
   */
  async validateRolePermissions(
    userId: string,
    requiredPermissions: string[]
  ): Promise<boolean> {
    try {
      for (const permissionId of requiredPermissions) {
        const allowed = await this.hasPermission(userId, permissionId);
        if (!allowed) {
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error validating role permissions:', error);
      return false;
    }
  }

  /**
   * Check if user has any of the permissions (OR logic)
   */
  async hasAnyPermission(
    userId: string,
    permissionIds: string[]
  ): Promise<boolean> {
    try {
      for (const permissionId of permissionIds) {
        const allowed = await this.hasPermission(userId, permissionId);
        if (allowed) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking any permission:', error);
      return false;
    }
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(permissionId: string): Promise<Permission | null> {
    try {
      // Check definition cache
      if (this.permissionDefinitions.has(permissionId)) {
        const cached = this.permissionDefinitions.get(permissionId);
        if (cached && Date.now() - this.lastDefinitionUpdate < this.definitionCacheTimeout) {
          return cached;
        }
      }

      // Fetch from Firestore
      const permDoc = await getDoc(doc(db, 'permissions', permissionId));

      if (!permDoc.exists()) {
        return null;
      }

      const permission = permDoc.data() as Permission;
      this.permissionDefinitions.set(permissionId, permission);
      this.lastDefinitionUpdate = Date.now();

      return permission;
    } catch (error) {
      console.error('Error fetching permission:', error);
      return null;
    }
  }

  /**
   * Get all permissions
   */
  async getAllPermissions(): Promise<Permission[]> {
    try {
      // Check cache
      if (
        this.permissionDefinitions.size > 0 &&
        Date.now() - this.lastDefinitionUpdate < this.definitionCacheTimeout
      ) {
        return Array.from(this.permissionDefinitions.values());
      }

      const permissionsRef = collection(db, 'permissions');
      const snapshot = await getDocs(permissionsRef);

      const permissions = snapshot.docs.map(doc => doc.data() as Permission);

      // Update cache
      this.permissionDefinitions.clear();
      permissions.forEach(perm => {
        this.permissionDefinitions.set(perm.id, perm);
      });
      this.lastDefinitionUpdate = Date.now();

      return permissions;
    } catch (error) {
      console.error('Error fetching all permissions:', error);
      return [];
    }
  }

  /**
   * Check permission from cache
   * Returns null if not cached or expired
   */
  private checkPermissionCache(userId: string, permissionId: string): boolean | null {
    const cacheKey = `${userId}:${permissionId}`;
    const cached = this.permissionCache.get(cacheKey);

    if (!cached) {
      return null;
    }

    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.permissionCache.delete(cacheKey);
      return null;
    }

    return cached.permissions.includes(permissionId);
  }

  /**
   * Cache permission result
   */
  private cachePermission(userId: string, permissionId: string, allowed: boolean): void {
    const cacheKey = `${userId}:${permissionId}`;

    const userPermissions = this.permissionCache.get(userId)?.permissions || [];
    if (allowed && !userPermissions.includes(permissionId)) {
      userPermissions.push(permissionId);
    }

    this.permissionCache.set(userId, {
      permissions: userPermissions,
      timestamp: Date.now(),
    });
  }

  /**
   * Invalidate user's permission cache
   * Call this after role changes
   */
  invalidateUserCache(userId: string): void {
    const keysToDelete = Array.from(this.permissionCache.keys()).filter(key =>
      key.startsWith(`${userId}:`)
    );

    keysToDelete.forEach(key => this.permissionCache.delete(key));
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.permissionCache.clear();
    this.permissionDefinitions.clear();
    this.lastDefinitionUpdate = 0;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    userCacheSize: number;
    definitionCacheSize: number;
    cacheTimeout: number;
  } {
    return {
      userCacheSize: this.permissionCache.size,
      definitionCacheSize: this.permissionDefinitions.size,
      cacheTimeout: this.cacheTimeout,
    };
  }
}

export default PermissionService.getInstance();
