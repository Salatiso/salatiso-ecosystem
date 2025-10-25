import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LayoutProvider } from '@/components/dashboard/useLayoutContext';
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

/**
 * Dashboard Page
 *
 * Main dashboard route that:
 * - Requires authentication
 * - Provides layout and context
 * - Renders the unified dashboard with all contexts
 * - Supports mobile, tablet, and desktop
 * - Manages dark mode and user preferences
 */

const DashboardContent: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (!loading && !user) {
    router.replace('/');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-primary-500 rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Salatiso Ecosystem</title>
        <meta name="description" content="Your unified dashboard with personal, professional, and family contexts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </Head>

      <DashboardLayout>
        <UnifiedDashboard />
      </DashboardLayout>
    </>
  );
};

export default function DashboardPage() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <DashboardContent />
      </LayoutProvider>
    </AuthProvider>
  );
}
