/**
 * Phase 6.5 - Security Hardening: RBAC System
 * Role-Based Access Control with permission management
 */

// ============================================================================
// Types
// ============================================================================

export type Permission = string
export type Role = string

export interface RoleDefinition {
  name: Role
  description: string
  permissions: Set<Permission>
  parentRoles?: Role[]
  priority: number
}

export interface User {
  id: string
  email: string
  roles: Set<Role>
  customPermissions?: Set<Permission>
}

export interface ResourceAccess {
  resource: string
  action: 'read' | 'write' | 'delete' | 'share'
}

export interface AccessCheckResult {
  allowed: boolean
  reason?: string
  requiredPermission?: Permission
}

export interface PermissionPolicy {
  name: string
  description: string
  rules: PermissionRule[]
}

export interface PermissionRule {
  roles?: Role[]
  permissions?: Permission[]
  resources?: string[]
  actions?: string[]
  condition?: (user: User, context: Record<string, unknown>) => boolean
  effect: 'allow' | 'deny'
}

// ============================================================================
// Built-in Roles
// ============================================================================

const BUILT_IN_ROLES: Map<Role, RoleDefinition> = new Map([
  [
    'admin',
    {
      name: 'admin',
      description: 'Administrator with full system access',
      permissions: new Set([
        'users:create',
        'users:read',
        'users:update',
        'users:delete',
        'roles:create',
        'roles:read',
        'roles:update',
        'roles:delete',
        'permissions:manage',
        'analytics:view',
        'performance:view',
        'security:audit',
        'system:manage',
      ]),
      priority: 100,
    },
  ],
  [
    'analyst',
    {
      name: 'analyst',
      description: 'Data analyst with read access to analytics',
      permissions: new Set([
        'users:read',
        'analytics:read',
        'analytics:export',
        'performance:read',
        'reports:create',
      ]),
      priority: 50,
    },
  ],
  [
    'manager',
    {
      name: 'manager',
      description: 'Manager with team management capabilities',
      permissions: new Set([
        'users:read',
        'users:update',
        'analytics:read',
        'performance:read',
        'team:manage',
        'reports:read',
      ]),
      parentRoles: ['analyst'],
      priority: 60,
    },
  ],
  [
    'user',
    {
      name: 'user',
      description: 'Regular user with basic access',
      permissions: new Set(['users:read:own', 'analytics:read:own', 'profile:manage:own']),
      priority: 10,
    },
  ],
  [
    'guest',
    {
      name: 'guest',
      description: 'Guest user with minimal access',
      permissions: new Set(['public:read']),
      priority: 1,
    },
  ],
])

// ============================================================================
// RBAC Engine
// ============================================================================

export class RBAC {
  private roles: Map<Role, RoleDefinition>
  private policies: Map<string, PermissionPolicy>
  private defaultRole: Role

  constructor() {
    this.roles = new Map(BUILT_IN_ROLES)
    this.policies = new Map()
    this.defaultRole = 'guest'
  }

  // ========================================================================
  // Role Management
  // ========================================================================

  /**
   * Create a new role
   */
  createRole(
    name: Role,
    description: string,
    permissions: Permission[],
    parentRoles?: Role[],
    priority?: number
  ): void {
    if (this.roles.has(name)) {
      throw new Error(`Role '${name}' already exists`)
    }

    // Validate parent roles exist
    if (parentRoles) {
      for (const parentRole of parentRoles) {
        if (!this.roles.has(parentRole)) {
          throw new Error(`Parent role '${parentRole}' does not exist`)
        }
      }
    }

    const roleDefinition: RoleDefinition = {
      name,
      description,
      permissions: new Set(permissions),
      parentRoles,
      priority: priority ?? this.roles.size,
    }

    this.roles.set(name, roleDefinition)
  }

  /**
   * Update an existing role
   */
  updateRole(name: Role, updates: Partial<RoleDefinition>): void {
    const role = this.roles.get(name)
    if (!role) {
      throw new Error(`Role '${name}' does not exist`)
    }

    if (updates.permissions) {
      role.permissions = new Set(updates.permissions)
    }

    if (updates.parentRoles) {
      for (const parentRole of updates.parentRoles) {
        if (!this.roles.has(parentRole)) {
          throw new Error(`Parent role '${parentRole}' does not exist`)
        }
      }
      role.parentRoles = updates.parentRoles
    }

    if (updates.description) {
      role.description = updates.description
    }

    if (updates.priority !== undefined) {
      role.priority = updates.priority
    }
  }

  /**
   * Delete a role
   */
  deleteRole(name: Role): void {
    if (!this.roles.has(name)) {
      throw new Error(`Role '${name}' does not exist`)
    }

    this.roles.delete(name)
  }

  /**
   * Get role definition
   */
  getRole(name: Role): RoleDefinition | undefined {
    return this.roles.get(name)
  }

  /**
   * List all roles
   */
  listRoles(): RoleDefinition[] {
    return Array.from(this.roles.values())
  }

  // ========================================================================
  // Permission Management
  // ========================================================================

  /**
   * Add permission to role
   */
  addPermissionToRole(role: Role, permission: Permission): void {
    const roleDefinition = this.roles.get(role)
    if (!roleDefinition) {
      throw new Error(`Role '${role}' does not exist`)
    }

    roleDefinition.permissions.add(permission)
  }

  /**
   * Remove permission from role
   */
  removePermissionFromRole(role: Role, permission: Permission): void {
    const roleDefinition = this.roles.get(role)
    if (!roleDefinition) {
      throw new Error(`Role '${role}' does not exist`)
    }

    roleDefinition.permissions.delete(permission)
  }

  /**
   * Get all permissions for a role (including inherited)
   */
  getPermissionsForRole(role: Role): Set<Permission> {
    const roleDefinition = this.roles.get(role)
    if (!roleDefinition) {
      return new Set()
    }

    const permissions = new Set(roleDefinition.permissions)

    // Add inherited permissions from parent roles
    if (roleDefinition.parentRoles) {
      for (const parentRole of roleDefinition.parentRoles) {
        const parentPermissions = this.getPermissionsForRole(parentRole)
        for (const perm of parentPermissions) {
          permissions.add(perm)
        }
      }
    }

    return permissions
  }

  /**
   * Get all permissions for a user (from all their roles)
   */
  getUserPermissions(user: User): Set<Permission> {
    const permissions = new Set<Permission>()

    // Add permissions from all roles
    for (const role of user.roles) {
      const rolePermissions = this.getPermissionsForRole(role)
      for (const perm of rolePermissions) {
        permissions.add(perm)
      }
    }

    // Add custom permissions
    if (user.customPermissions) {
      for (const perm of user.customPermissions) {
        permissions.add(perm)
      }
    }

    return permissions
  }

  // ========================================================================
  // Access Control
  // ========================================================================

  /**
   * Check if user has specific permission
   */
  hasPermission(user: User, permission: Permission): boolean {
    const permissions = this.getUserPermissions(user)
    return permissions.has(permission) || this.matchesWildcard(permission, permissions)
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(user: User, permissions: Permission[]): boolean {
    return permissions.some((perm) => this.hasPermission(user, perm))
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(user: User, permissions: Permission[]): boolean {
    return permissions.every((perm) => this.hasPermission(user, perm))
  }

  /**
   * Check resource access
   */
  canAccess(user: User, resource: ResourceAccess): AccessCheckResult {
    const permission = `${resource.resource}:${resource.action}`

    if (this.hasPermission(user, permission)) {
      return { allowed: true }
    }

    // Check wildcard permissions
    const userPermissions = this.getUserPermissions(user)
    for (const userPerm of userPermissions) {
      if (this.permissionMatches(userPerm, permission)) {
        return { allowed: true }
      }
    }

    return {
      allowed: false,
      reason: `User does not have permission: ${permission}`,
      requiredPermission: permission,
    }
  }

  // ========================================================================
  // Policies
  // ========================================================================

  /**
   * Register a permission policy
   */
  registerPolicy(policy: PermissionPolicy): void {
    this.policies.set(policy.name, policy)
  }

  /**
   * Evaluate policy for user
   */
  evaluatePolicy(policyName: string, user: User, context: Record<string, unknown> = {}): boolean {
    const policy = this.policies.get(policyName)
    if (!policy) {
      return false
    }

    for (const rule of policy.rules) {
      if (this.evaluateRule(rule, user, context)) {
        return rule.effect === 'allow'
      }
    }

    return false
  }

  /**
   * Evaluate multiple policies (all must pass for access)
   */
  evaluatePolicies(policyNames: string[], user: User, context?: Record<string, unknown>): boolean {
    return policyNames.every((policyName) => this.evaluatePolicy(policyName, user, context))
  }

  // ========================================================================
  // Utility Methods
  // ========================================================================

  /**
   * Create a user with roles
   */
  createUser(id: string, email: string, roles: Role[], customPermissions?: Permission[]): User {
    // Validate roles exist
    for (const role of roles) {
      if (!this.roles.has(role)) {
        throw new Error(`Role '${role}' does not exist`)
      }
    }

    return {
      id,
      email,
      roles: new Set(roles),
      customPermissions: customPermissions ? new Set(customPermissions) : undefined,
    }
  }

  /**
   * Grant role to user
   */
  grantRole(user: User, role: Role): void {
    if (!this.roles.has(role)) {
      throw new Error(`Role '${role}' does not exist`)
    }
    user.roles.add(role)
  }

  /**
   * Revoke role from user
   */
  revokeRole(user: User, role: Role): void {
    user.roles.delete(role)
  }

  /**
   * Grant custom permission to user
   */
  grantPermission(user: User, permission: Permission): void {
    if (!user.customPermissions) {
      user.customPermissions = new Set()
    }
    user.customPermissions.add(permission)
  }

  /**
   * Revoke custom permission from user
   */
  revokePermission(user: User, permission: Permission): void {
    if (user.customPermissions) {
      user.customPermissions.delete(permission)
    }
  }

  /**
   * Get user's effective role (highest priority)
   */
  getUserEffectiveRole(user: User): Role | undefined {
    let effectiveRole: Role | undefined
    let maxPriority = -1

    for (const role of user.roles) {
      const roleDefinition = this.roles.get(role)
      if (roleDefinition && roleDefinition.priority > maxPriority) {
        maxPriority = roleDefinition.priority
        effectiveRole = role
      }
    }

    return effectiveRole
  }

  /**
   * Set default role for new users
   */
  setDefaultRole(role: Role): void {
    if (!this.roles.has(role)) {
      throw new Error(`Role '${role}' does not exist`)
    }
    this.defaultRole = role
  }

  /**
   * Get default role
   */
  getDefaultRole(): Role {
    return this.defaultRole
  }

  // ========================================================================
  // Private Helper Methods
  // ========================================================================

  private matchesWildcard(permission: Permission, userPermissions: Set<Permission>): boolean {
    const parts = permission.split(':')

    for (const userPerm of userPermissions) {
      if (this.permissionMatches(userPerm, permission)) {
        return true
      }
    }

    return false
  }

  private permissionMatches(pattern: string, permission: string): boolean {
    if (pattern === '*') {
      return true
    }

    const patternParts = pattern.split(':')
    const permissionParts = permission.split(':')

    if (patternParts.length !== permissionParts.length) {
      return false
    }

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] !== '*' && patternParts[i] !== permissionParts[i]) {
        return false
      }
    }

    return true
  }

  private evaluateRule(rule: PermissionRule, user: User, context: Record<string, unknown>): boolean {
    // Check roles
    if (rule.roles && rule.roles.length > 0) {
      const hasRole = Array.from(user.roles).some((role) => rule.roles!.includes(role))
      if (!hasRole) {
        return false
      }
    }

    // Check permissions
    if (rule.permissions && rule.permissions.length > 0) {
      const hasPermission = rule.permissions.some((perm) => this.hasPermission(user, perm))
      if (!hasPermission) {
        return false
      }
    }

    // Check custom condition
    if (rule.condition && !rule.condition(user, context)) {
      return false
    }

    return true
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let rbacInstance: RBAC | null = null

export function getRBAC(): RBAC {
  if (!rbacInstance) {
    rbacInstance = new RBAC()
  }
  return rbacInstance
}

export function resetRBAC(): void {
  rbacInstance = null
}
