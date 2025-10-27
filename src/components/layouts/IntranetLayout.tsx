import React, { ReactNode } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RondavelIcon, UbuntuIcon } from '@/components/icons';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SkipLink } from '@/components/accessibility';
import Sidebar from '@/components/navigation/Sidebar';
import EcosystemHeader from '@/components/navigation/EcosystemHeader';

interface IntranetLayoutProps {
  children: ReactNode;
  title?: string;
}

const IntranetLayout: React.FC<IntranetLayoutProps> = ({ 
  children, 
  title = "MNI Intranet" 
}) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      router.push('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  // Old Sidebar component replaced with EnhancedSidebar
  const SidebarComponent = () => (
    <Sidebar onLogout={handleLogout} />
  );

  return (
    <>
      <Head>
        <title>{title} - Mlandeli-Notemba Investments</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Skip Navigation Links */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#sidebar-navigation">Skip to navigation</SkipLink>

      <div className="min-h-screen bg-ubuntu-warm-50 flex">
        {/* Sidebar - All responsive behavior handled internally */}
        <Sidebar onLogout={() => {
          logout();
          router.push('/login');
        }} />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Enhanced Header with Ecosystem Navigation */}
          <EcosystemHeader />

          {/* Page Content */}
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default IntranetLayout;