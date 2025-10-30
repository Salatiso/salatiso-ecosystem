# PHASE 3.1: ROLE-BASED ACCESS CONTROL (RBAC) - DETAILED SPECIFICATION

**Status**: Specification Phase  
**Estimated Duration**: 2-3 weeks  
**Target Start**: Week 11  
**Last Updated**: October 30, 2025

---

## 📋 EXECUTIVE SUMMARY

This specification outlines the implementation of a comprehensive Role-Based Access Control system that supports **4 distinct user types** with **hierarchical permissions**, **age-based automatic content routing**, **license-scoped access**, and **administrator configuration capabilities**.

---

## 🎯 REQUIREMENTS

### Functional Requirements

#### FR-1: User Type Classification
- System must support exactly 4 user types:
  - Family Member (full access)
  - Child (age-based auto-routing)
  - License User (license-scoped access)
  - Administrator (unrestricted + config rights)

#### FR-2: Permission Enforcement
- All CRUD operations must check permissions before execution
- Denied operations return appropriate HTTP errors
- Audit log all admin actions

#### FR-3: Age-Based Content Routing
- Automatically redirect users based on age
- Age ranges: 0-5, 6-12, 13-17, 18+
- Content categorized by minimum/maximum age
- Parental controls available for families

#### FR-4: License Management
- License types: Basic, Professional, Enterprise
- Scoped module access per license
- License expiry handling with graceful degradation
- Upgrade path support

#### FR-5: Administrator Privileges
- Salatiso (admin) has unrestricted access
- Can manage all users, roles, and permissions
- Can create/edit content categories
- Can set system-wide policies

### Non-Functional Requirements

#### NFR-1: Performance
- Permission checks: <50ms
- Role resolution: <100ms
- Content filtering: <200ms
- Admin operations: <500ms

#### NFR-2: Security
- All permissions enforced at database level (Firestore rules)
- No client-side permission bypass possible
- Audit logging mandatory for admin actions
- Encryption for sensitive data

#### NFR-3: Scalability
- Support 10,000+ users
- Support 1,000+ custom content categories
- Real-time permission updates
- Horizontal scaling support

#### NFR-4: Usability
- Non-technical admins can manage permissions
- Clear UI for permission configuration
- Visual permission matrix
- Bulk operations support

---

## 🏗️ SYSTEM ARCHITECTURE

### Database Schema

#### Users Collection Enhancement
```typescript
// Current user document needs these additions:
interface User {
  // Existing fields
  id: string;
  email: string;
  name: string;
  // NEW FIELDS FOR PHASE 3
  userType: 'family' | 'child' | 'license' | 'administrator';
  
  // For children
  dateOfBirth?: Date;
  calculatedAge?: number;
  parentalControls?: {
    screenTimeLimit?: number; // minutes per day
    contentFilter?: boolean;
    activityMonitoring?: boolean;
    approvalRequired?: string[]; // ['external_links', 'premium_content']
  };
  
  // For license users
  licenseType?: 'basic' | 'professional' | 'enterprise';
  licenseExpiryDate?: Date;
  licensedModules?: string[];
  
  // For all users
  roleId?: string;
  permissionIds?: string[];
  contentCategories?: string[]; // accessible categories
  status: 'active' | 'suspended' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Roles Collection (New)
```typescript
interface Role {
  id: string;
  name: 'family' | 'child' | 'license' | 'administrator';
  description: string;
  permissionIds: string[]; // refs to permissions collection
  contentAccessLevel: 'all' | 'family_scope' | 'license_scope' | 'age_gated';
  features: {
    professional: boolean;
    personal: boolean;
    finance: boolean;
    education: boolean;
    health: boolean;
    reporting: boolean;
  };
  isSystem: boolean; // immutable if true
  createdAt: Date;
  updatedAt: Date;
}
```

#### Permissions Collection (New)
```typescript
interface Permission {
  id: string;
  code: string; // e.g., 'view_compliance', 'edit_contract'
  description: string;
  module: string; // 'governance', 'human_capital', 'operations', etc.
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
  resource: string; // 'company', 'contract', 'project', etc.
  restrictions?: {
    dataScope?: 'own' | 'family' | 'organization' | 'all';
    fieldsMask?: string[]; // Only allowed to edit these fields
    timeRestriction?: {
      startTime: string; // HH:mm
      endTime: string;
      daysOfWeek: number[]; // 0-6
    };
  };
  createdAt: Date;
}
```

#### Content Categories Collection (New)
```typescript
interface ContentCategory {
  id: string;
  name: string;
  description: string;
  
  // Age gating
  ageGating?: {
    minimum: number;
    maximum?: number;
  };
  
  // Visibility
  visibility: 'public' | 'family' | 'license' | 'admin';
  
  // Access control
  requiredUserTypes?: ('family' | 'child' | 'license' | 'administrator')[];
  requiredLicenses?: ('basic' | 'professional' | 'enterprise')[];
  requiredPermissions?: string[]; // permission IDs
  
  // Content
  contentItems: string[]; // refs to content docs
  
  // Metadata
  createdBy: string; // user ID
  modifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### User Role Assignments Collection (New)
```typescript
interface UserRoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  
  // Scoping
  scope: 'global' | 'family' | 'organization' | 'custom';
  scopeId?: string; // family ID or org ID
  
  // Validity
  isActive: boolean;
  activatedAt: Date;
  expiresAt?: Date;
  
  // Customizations
  customPermissions?: string[]; // additional permissions
  excludedPermissions?: string[]; // removed permissions
  
  // Audit
  assignedBy: string;
  assignedAt: Date;
  updatedAt: Date;
}
```

#### Admin Actions Audit Log Collection (New)
```typescript
interface AuditLog {
  id: string;
  adminId: string;
  action: 'create_user' | 'update_permission' | 'set_age' | 'manage_license' | 'delete_user';
  targetUserId?: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  
  // Context
  ipAddress?: string;
  userAgent?: string;
  
  // Timestamp
  timestamp: Date;
}
```

### Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAdmin(userId) {
      let roleDoc = get(/databases/$(database)/documents/user_role_assignments/$(userId));
      return roleDoc.data.roleId in get(/databases/$(database)/documents/roles/admin).data.userIds;
    }
    
    function hasPermission(userId, permissionCode) {
      let userAssignment = get(/databases/$(database)/documents/user_role_assignments/$(userId));
      let role = get(/databases/$(database)/documents/roles/$(userAssignment.data.roleId));
      return permissionCode in role.data.permissions;
    }
    
    function canAccessContent(userId, contentId) {
      let userDoc = get(/databases/$(database)/documents/users/$(userId));
      let contentDoc = get(/databases/$(database)/documents/content_categories/$(contentId));
      
      // Admin can access everything
      if (isAdmin(userId)) return true;
      
      // Check age gating
      if (contentDoc.data.ageGating != null) {
        let userAge = getCurrentAge(userDoc.data.dateOfBirth);
        if (userAge < contentDoc.data.ageGating.minimum) return false;
        if (contentDoc.data.ageGating.maximum != null && 
            userAge > contentDoc.data.ageGating.maximum) return false;
      }
      
      // Check license requirements
      if (contentDoc.data.requiredLicenses.size() > 0) {
        if (!(userDoc.data.licenseType in contentDoc.data.requiredLicenses)) {
          return false;
        }
      }
      
      return true;
    }
    
    function getCurrentAge(dob) {
      let now = request.time.toMillis();
      let birthTime = dob.toMillis();
      return int((now - birthTime) / (365.25 * 24 * 60 * 60 * 1000));
    }
    
    // Users can read own profile
    match /users/{userId} {
      allow read: if request.auth.uid == userId || isAdmin(request.auth.uid);
      allow update: if request.auth.uid == userId || isAdmin(request.auth.uid);
      allow delete: if isAdmin(request.auth.uid);
    }
    
    // Roles (read-only for non-admins)
    match /roles/{roleId} {
      allow read: if true; // Everyone can see role definitions
      allow write: if isAdmin(request.auth.uid);
    }
    
    // Permissions (read-only for non-admins)
    match /permissions/{permId} {
      allow read: if true;
      allow write: if isAdmin(request.auth.uid);
    }
    
    // Content (read based on access rules)
    match /content_categories/{contentId} {
      allow read: if canAccessContent(request.auth.uid, contentId);
      allow write: if isAdmin(request.auth.uid);
    }
    
    // User role assignments (admin only)
    match /user_role_assignments/{assignmentId} {
      allow read: if request.auth.uid == resource.data.userId || 
                     isAdmin(request.auth.uid);
      allow write: if isAdmin(request.auth.uid);
    }
    
    // Audit logs (admin only)
    match /audit_logs/{logId} {
      allow read: if isAdmin(request.auth.uid);
      allow write: if isAdmin(request.auth.uid);
    }
  }
}
```

---

## 🔧 SERVICE LAYER IMPLEMENTATION

### roleService.ts
```typescript
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface RoleServiceMethods {
  // Query operations
  getRoleById(roleId: string): Promise<Role>;
  getRoleByName(name: string): Promise<Role>;
  getUserRole(userId: string): Promise<Role>;
  
  // Validation
  validateUserCanAccess(userId: string, resourceId: string, action: 'read' | 'write'): Promise<boolean>;
  validateUserAge(userId: string, minimumAge: number): Promise<boolean>;
  validateLicense(userId: string, requiredLicense?: string): Promise<boolean>;
  
  // Admin operations
  createRole(roleData: Partial<Role>): Promise<Role>;
  updateRole(roleId: string, updates: Partial<Role>): Promise<Role>;
  deleteRole(roleId: string): Promise<void>;
  
  // User role assignment
  assignRole(userId: string, roleId: string, scope?: string): Promise<void>;
  removeRole(userId: string, roleId: string): Promise<void>;
  
  // Permissions
  getUserPermissions(userId: string): Promise<Permission[]>;
  hasPermission(userId: string, permissionCode: string): Promise<boolean>;
}

export class RoleService implements RoleServiceMethods {
  async getRoleById(roleId: string): Promise<Role> {
    const roleRef = doc(db, 'roles', roleId);
    const roleSnap = await getDoc(roleRef);
    if (!roleSnap.exists()) throw new Error('Role not found');
    return roleSnap.data() as Role;
  }
  
  async validateUserCanAccess(
    userId: string, 
    resourceId: string, 
    action: 'read' | 'write'
  ): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      const resource = await this.getResourceById(resourceId);
      
      // Admin has unrestricted access
      if (user.userType === 'administrator') return true;
      
      // License check
      if (resource.requiredLicenses?.includes(user.licenseType)) {
        if (user.licenseExpiryDate && user.licenseExpiryDate < new Date()) {
          return false;
        }
      }
      
      // Age check
      if (resource.ageGating) {
        const userAge = this.calculateAge(user.dateOfBirth);
        if (userAge < resource.ageGating.minimum) return false;
        if (resource.ageGating.maximum && userAge > resource.ageGating.maximum) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Access validation error:', error);
      return false;
    }
  }
  
  async hasPermission(userId: string, permissionCode: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.some(p => p.code === permissionCode);
  }
  
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    return age;
  }
}
```

### permissionService.ts
```typescript
interface PermissionServiceMethods {
  checkPermission(userId: string, permissionCode: string): Promise<boolean>;
  checkBatch(userId: string, permissionCodes: string[]): Promise<Record<string, boolean>>;
  getAccessibleModules(userId: string): Promise<string[]>;
  getAccessibleFields(userId: string, resource: string): Promise<string[]>;
  canPerformAction(userId: string, action: string, resource: string, resourceId?: string): Promise<boolean>;
}

export class PermissionService implements PermissionServiceMethods {
  async checkPermission(userId: string, permissionCode: string): Promise<boolean> {
    const cacheKey = `perm:${userId}:${permissionCode}`;
    
    // Check cache first (TTL: 1 minute)
    const cached = this.getFromCache(cacheKey);
    if (cached !== undefined) return cached;
    
    const permissions = await this.getUserPermissions(userId);
    const hasPermission = permissions.some(p => p.code === permissionCode);
    
    this.setCache(cacheKey, hasPermission, 60000);
    return hasPermission;
  }
  
  async canPerformAction(
    userId: string,
    action: string,
    resource: string,
    resourceId?: string
  ): Promise<boolean> {
    const permissionCode = `${action}_${resource}`;
    
    // Check basic permission
    if (!await this.checkPermission(userId, permissionCode)) {
      return false;
    }
    
    // Check resource-specific restrictions if provided
    if (resourceId) {
      const resourceDoc = await this.getResource(resourceId, resource);
      return this.evaluateRestrictions(userId, resourceDoc);
    }
    
    return true;
  }
  
  private evaluateRestrictions(userId: string, resource: any): boolean {
    // Implement specific restriction evaluation logic
    // e.g., ownership check, field-level restrictions, time-based restrictions
    return true;
  }
}
```

### contentFilterService.ts
```typescript
interface ContentFilterServiceMethods {
  filterContent(userId: string, content: Content[]): Promise<Content[]>;
  getAccessibleCategories(userId: string): Promise<ContentCategory[]>;
  evaluateContentAccess(userId: string, contentId: string): Promise<boolean>;
  getRoutingCategory(userId: string): Promise<string>;
}

export class ContentFilterService implements ContentFilterServiceMethods {
  async filterContent(userId: string, content: Content[]): Promise<Content[]> {
    const user = await this.getUser(userId);
    
    return content.filter(item => {
      // Admin sees everything
      if (user.userType === 'administrator') return true;
      
      // Check license requirements
      if (item.requiredLicenses && !item.requiredLicenses.includes(user.licenseType)) {
        return false;
      }
      
      // Check age requirements
      if (item.ageGating && user.userType === 'child') {
        const userAge = this.calculateAge(user.dateOfBirth);
        if (userAge < item.ageGating.minimum) return false;
        if (item.ageGating.maximum && userAge > item.ageGating.maximum) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  async getRoutingCategory(userId: string): Promise<string> {
    const user = await this.getUser(userId);
    
    if (user.userType === 'administrator') return 'admin_portal';
    if (user.userType === 'license') return `license_${user.licenseType}`;
    if (user.userType === 'family') return 'family_portal';
    
    if (user.userType === 'child' && user.dateOfBirth) {
      const age = this.calculateAge(user.dateOfBirth);
      if (age < 6) return 'kids_portal_primary';
      if (age < 13) return 'kids_portal_extended';
      return 'youth_portal';
    }
    
    return 'default';
  }
}
```

### ageRoutingService.ts
```typescript
interface AgeRoutingServiceMethods {
  getAppropriateRoute(userId: string): Promise<string>;
  shouldBlockContent(userId: string, content: Content): Promise<boolean>;
  getParentalControls(userId: string): Promise<ParentalControl | null>;
  checkParentalApproval(userId: string, contentId: string): Promise<boolean>;
}

export class AgeRoutingService implements AgeRoutingServiceMethods {
  private ageRoutes = {
    '0-5': {
      path: '/kids/primary',
      categories: ['nursery', 'foundation', 'alphabet', 'numbers'],
      maxScreenTime: 60, // minutes
      blockedFeatures: ['messaging', 'payment', 'settings']
    },
    '6-12': {
      path: '/kids/extended',
      categories: ['primary_education', 'age_appropriate_news', 'games', 'learning'],
      maxScreenTime: 120,
      blockedFeatures: ['payment', 'adult_content']
    },
    '13-17': {
      path: '/youth',
      categories: ['secondary_education', 'career_guidance', 'life_skills', 'tech'],
      maxScreenTime: 240,
      blockedFeatures: ['adult_content']
    },
    '18+': {
      path: '/family',
      categories: ['all'],
      maxScreenTime: null,
      blockedFeatures: []
    }
  };
  
  async getAppropriateRoute(userId: string): Promise<string> {
    const user = await this.getUser(userId);
    const ageGroup = this.getAgeGroup(user);
    return this.ageRoutes[ageGroup].path;
  }
  
  private getAgeGroup(user: User): string {
    if (user.userType !== 'child' || !user.dateOfBirth) return '18+';
    
    const age = this.calculateAge(user.dateOfBirth);
    if (age < 6) return '0-5';
    if (age < 13) return '6-12';
    if (age < 18) return '13-17';
    return '18+';
  }
}
```

---

## 🎨 FRONTEND COMPONENTS

### PermissionGuard.tsx
```typescript
interface PermissionGuardProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  fallback = null,
  children
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const checkPermission = async () => {
      if (!user) {
        setHasPermission(false);
        return;
      }
      
      const result = await permissionService.checkPermission(user.id, permission);
      setHasPermission(result);
    };
    
    checkPermission();
  }, [user, permission]);
  
  if (hasPermission === null) return <Spinner />;
  if (!hasPermission) return fallback;
  
  return <>{children}</>;
};
```

### AgeGatedRouter.tsx
```typescript
interface AgeGatedRouterProps {
  children: React.ReactNode;
}

export const AgeGatedRouter: React.FC<AgeGatedRouterProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const routeUser = async () => {
      if (loading || !user) return;
      
      const route = await ageRoutingService.getAppropriateRoute(user.id);
      navigate(route);
    };
    
    routeUser();
  }, [user, loading, navigate]);
  
  if (loading) return <LoadingScreen />;
  return <>{children}</>;
};
```

### AdminPanel.tsx
```typescript
export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.userType !== 'administrator') {
    return <Unauthorized />;
  }
  
  return (
    <div className="space-y-6">
      <UserManagement />
      <PermissionMatrix />
      <ContentCategoryManagement />
      <LicenseManagement />
      <AuditLogs />
    </div>
  );
};

// Sub-components
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">User Management</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.userType}</td>
              <td>{user.status}</td>
              <td>
                <EditUserDialog user={user} />
                <DeleteUserButton user={user} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PermissionMatrix: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Permission Matrix</h2>
      <PermissionMatrixTable />
    </div>
  );
};
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Database & Backend Services
- [ ] Create Firestore collections (roles, permissions, content_categories, assignments)
- [ ] Update user schema with new fields
- [ ] Implement Firebase security rules
- [ ] Create roleService.ts
- [ ] Create permissionService.ts
- [ ] Create contentFilterService.ts
- [ ] Create ageRoutingService.ts
- [ ] Create licenseService.ts
- [ ] Set up audit logging

### Phase 2: Frontend Components & Hooks
- [ ] Create PermissionGuard component
- [ ] Create ContentFilter component
- [ ] Create AgeGatedRouter component
- [ ] Create AdminPanel component
- [ ] Create usePermission hook
- [ ] Create useContentAccess hook
- [ ] Create useUserType hook

### Phase 3: Admin Interface
- [ ] User management dashboard
- [ ] Role assignment interface
- [ ] Permission matrix UI
- [ ] Content category management
- [ ] License management
- [ ] Audit log viewer

### Phase 4: Integration & Testing
- [ ] Integrate with existing components
- [ ] Unit tests for all services
- [ ] Integration tests for permission flows
- [ ] E2E tests for admin operations
- [ ] Security testing

### Phase 5: Documentation & Launch
- [ ] Admin guide
- [ ] API documentation
- [ ] User guides per role type
- [ ] Training materials
- [ ] Soft launch

---

## 🔍 TESTING STRATEGY

### Unit Tests
```typescript
describe('RoleService', () => {
  it('should validate admin access', async () => {
    const admin = { id: 'admin1', userType: 'administrator' };
    const result = await roleService.validateUserCanAccess(admin.id, 'resource1', 'read');
    expect(result).toBe(true);
  });
  
  it('should deny access to expired license', async () => {
    const licenseUser = { 
      id: 'user1', 
      licenseExpiryDate: new Date('2025-01-01')
    };
    const result = await roleService.validateLicense(licenseUser.id, 'professional');
    expect(result).toBe(false);
  });
  
  it('should route child to age-appropriate content', async () => {
    const child = { id: 'child1', dateOfBirth: new Date('2020-01-01') };
    const route = await ageRoutingService.getAppropriateRoute(child.id);
    expect(route).toBe('/kids/extended');
  });
});
```

### Integration Tests
- Test complete permission flow from user login to content access
- Test admin operations (create role, assign permissions)
- Test license expiry handling
- Test age-based routing with content access

### E2E Tests
- Admin creates new role type
- Admin assigns permissions
- Admin manages users
- User logs in and is routed correctly
- Child accesses only age-appropriate content

---

**Next Document**: `PHASE3_CHATBOT_IMPLEMENTATION_GUIDE.md`
