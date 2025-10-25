import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export type AccessLevel = 'public' | 'family' | 'business' | 'private' | 'emergency';
export type RequiredRole = 'founder' | 'administrator' | 'parent_company_lead' | 'general_family_member' | 'youth_member' | 'guest' | 'business_member' | 'emergency_access';

interface AccessControlProps {
  children: ReactNode;
  requiredLevel?: AccessLevel;
  requiredRole?: RequiredRole;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

const ACCESS_LEVEL_HIERARCHY: Record<AccessLevel, number> = {
  public: 0,
  emergency: 1,
  family: 2,
  business: 3,
  private: 4,
};

const hasRequiredAccess = (
  userAccessLevel: AccessLevel | undefined,
  userRole: RequiredRole | undefined,
  requiredLevel: AccessLevel,
  requiredRole?: RequiredRole
): boolean => {
  // Check access level hierarchy
  if (userAccessLevel) {
    const userLevelValue = ACCESS_LEVEL_HIERARCHY[userAccessLevel];
    const requiredLevelValue = ACCESS_LEVEL_HIERARCHY[requiredLevel];
    if (userLevelValue < requiredLevelValue) {
      return false;
    }
  } else if (requiredLevel !== 'public') {
    return false;
  }

  // Check specific role if required
  if (requiredRole && userRole !== requiredRole) {
    return false;
  }

  return true;
};

export const AccessControl: React.FC<AccessControlProps> = ({
  children,
  requiredLevel = 'public',
  requiredRole,
  fallback = null,
  requireAuth = false,
}) => {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !user) {
    return fallback ? <>{fallback}</> : (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
        <p className="text-gray-600 mb-4">Please sign in to access this content.</p>
        <Link href="/intranet/login" className="btn-primary btn">
          Sign In
        </Link>
      </div>
    );
  }

  // Check access permissions
  const hasAccess = hasRequiredAccess(
    user?.accessLevel,
    user?.role,
    requiredLevel,
    requiredRole
  );

  if (!hasAccess) {
    return fallback ? <>{fallback}</> : (
      <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Access Denied</h3>
        <p className="text-red-700 mb-4">
          You don&apos;t have permission to access this content.
          {requiredLevel !== 'public' && ` Required access level: ${requiredLevel}`}
          {requiredRole && ` Required role: ${requiredRole}`}
        </p>
        <p className="text-sm text-red-600">
          Your current access: {user?.accessLevel || 'none'} | Role: {user?.role || 'none'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

AccessControl.displayName = 'AccessControl';

// Higher-order component for protecting entire pages
export const withAccessControl = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AccessControlProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <AccessControl {...options}>
      <Component {...props} />
    </AccessControl>
  );
  WrappedComponent.displayName = `withAccessControl(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for checking access in components
export const useAccessControl = () => {
  const { user } = useAuth();

  const checkAccess = (
    requiredLevel: AccessLevel = 'public',
    requiredRole?: RequiredRole
  ): boolean => {
    return hasRequiredAccess(
      user?.accessLevel,
      user?.role,
      requiredLevel,
      requiredRole
    );
  };

  const canAccess = (level: AccessLevel): boolean => {
    return checkAccess(level);
  };

  const hasRole = (role: RequiredRole): boolean => {
    return user?.role === role;
  };

  const getUserLevel = (): AccessLevel => {
    return user?.accessLevel || 'public';
  };

  return {
    checkAccess,
    canAccess,
    hasRole,
    getUserLevel,
    user,
  };
};

export default AccessControl;