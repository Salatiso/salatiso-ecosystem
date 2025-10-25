// Sonny Network Page - Family Mesh Networking and Coordination
// Phase 4: Cross-Ecosystem Integration
// Mlandeli-Notemba Investments Ecosystem

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import SonnyDashboard from '@/components/SonnyDashboard';
import IntranetLayout from '@/components/layouts/IntranetLayout';

const SonnyNetworkPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/intranet/login?redirect=/sonny');
    }
  }, [user, loading, router]);

  // Set up user profile for Sonny services
  useEffect(() => {
    if (user) {
      setUserProfile({
        userId: (user as any).id || (user as any).uid,
        familyId: (user as any).familyId || `family_${(user as any).id || (user as any).uid}`,
        displayName: (user as any).displayName || (user as any).email?.split('@')[0] || 'Family Member',
        email: (user as any).email,
        role: (user as any).role || 'member'
      });
    }
  }, [user]);

  if (loading) {
    return (
      <IntranetLayout title="Sonny Network">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </IntranetLayout>
    );
  }

  if (!user || !userProfile) {
    return (
      <IntranetLayout title="Sonny Network">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please log in to access the Sonny Family Network.</p>
            <button 
              onClick={() => router.push('/intranet/login')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </IntranetLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Sonny Family Network - Salatiso Ecosystem</title>
        <meta 
          name="description" 
          content="Ubuntu-inspired family mesh networking for safety, coordination, and trust building within the Salatiso ecosystem." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://app.salatiso.co.za/sonny" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sonny Family Network - Ubuntu Mesh Networking" />
        <meta property="og:description" content="Connect your family through Ubuntu-inspired mesh networking, safety automation, and trust-based coordination." />
        <meta property="og:image" content="https://app.salatiso.co.za/images/sonny-network-preview.jpg" />
        <meta property="og:url" content="https://app.salatiso.co.za/sonny" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sonny Family Network" />
        <meta name="twitter:description" content="Ubuntu-inspired family coordination and safety networking" />
        
        {/* Additional Meta */}
        <meta name="keywords" content="family network, mesh networking, Ubuntu philosophy, safety automation, trust framework, family coordination" />
        <meta name="author" content="Mlandeli-Notemba Investments" />
        <meta name="robots" content="index, follow" />
      </Head>

      <IntranetLayout title="Sonny Family Network">
        <SonnyDashboard 
          userId={userProfile.userId}
          familyId={userProfile.familyId}
          displayName={userProfile.displayName}
        />
      </IntranetLayout>
    </>
  );
};

export default SonnyNetworkPage;