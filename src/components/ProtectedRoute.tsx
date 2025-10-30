import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * 
 * Ensures that only authenticated users can access protected pages.
 * If a user is not authenticated, they are redirected to the login page.
 * 
 * Security Features:
 * - Checks authentication state on mount
 * - Prevents rendering of protected content until auth is verified
 * - Redirects to login if user is not authenticated
 * - Logs security events for audit purposes
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Log access attempt for security audit
    console.log('🔒 ProtectedRoute access attempt:', {
      path: router.asPath,
      authenticated: !!user,
      timestamp: new Date().toISOString(),
    });

    // Wait for auth loading to complete
    if (loading) {
      console.log('⏳ Waiting for authentication check...');
      return;
    }

    // If not authenticated, redirect to login
    if (!user) {
      console.error('❌ SECURITY: Unauthorized access attempt to protected route:', router.asPath);
      toast.error('Please sign in to access this page');
      router.push('/intranet/login');
      return;
    }

    console.log('✅ User authenticated, allowing access:', {
      user: user.email,
      role: user.role,
      path: router.asPath,
    });
  }, [user, loading, router]);

  // Show loading state while auth is being verified
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ubuntu-warm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ubuntu-warm-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Unauthorized Access</p>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
