import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  Users,
  FolderOpen,
  TrendingUp,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Award,
  Calendar,
  BarChart3,
  Heart,
  GraduationCap,
  Briefcase,
  TestTube,
  Monitor,
  ExternalLink,
  Wifi,
  UserCheck
} from 'lucide-react';
import { RondavelIcon, FamilyIcon, UbuntuIcon, JourneyIcon } from '@/components/icons';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SkipLink } from '@/components/accessibility';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    // Primary Phase 5B Navigation
    { name: 'Dashboard', href: '/intranet/simple-dashboard', icon: RondavelIcon, category: 'primary' },
    { name: 'Contacts', href: '/intranet/contacts', icon: UserCheck, category: 'primary' },
    { name: 'LifeCV', href: '/intranet/lifecv', icon: Award, category: 'primary' },
    { name: 'Assets', href: '/intranet/assets', icon: FolderOpen, category: 'primary' },
    { name: 'Calendar', href: '/intranet/calendar', icon: Calendar, category: 'primary' },
    
    // Phase 5 Advanced Features
    { name: 'Projects', href: '/projects', icon: FolderOpen, category: 'primary' },
    { name: 'Reporting', href: '/reporting', icon: BarChart3, category: 'primary' },
    { name: 'Toolkit', href: '/toolkit', icon: Settings, category: 'primary' },
    { name: 'Sync Control', href: '/sync', icon: Wifi, category: 'primary' },
    
    // Secondary Navigation
    { name: 'Sonny Network', href: '/sonny', icon: Wifi, category: 'secondary' },
    { name: 'Family', href: '/intranet/family', icon: FamilyIcon, category: 'secondary' },
    
    // Extended Navigation (collapsed in sidebar)
    { name: 'Family Tree', href: '/family/tree', icon: FamilyIcon, category: 'extended' },
    { name: 'Family Timeline', href: '/family/timeline', icon: Calendar, category: 'extended' },
    { name: 'Business Operations', href: '/business/operations', icon: Briefcase, category: 'extended' },
    { name: 'Business Organogram', href: '/business/organogram', icon: Users, category: 'extended' },
    { name: 'Career Paths', href: '/business/careers', icon: TrendingUp, category: 'extended' },
    { name: 'Projects', href: '/intranet/projects', icon: FolderOpen, category: 'extended' },
    { name: 'Business Plan', href: '/intranet/business-plan', icon: BarChart3, category: 'extended' },
    { name: 'Ecosystem', href: '/intranet/ecosystem', icon: Briefcase, category: 'extended' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, category: 'extended' },
    
    // Academy (optional)
    { name: 'Sazi Life Academy', href: '/academy', icon: GraduationCap, category: 'academy' },
    { name: 'Curriculum Browser', href: '/academy/curriculum', icon: BookOpen, category: 'academy' },
    { name: 'Learning Progress', href: '/academy/progress', icon: Award, category: 'academy' },
    { name: 'Ubuntu Screen Saver', href: '/screensaver', icon: Monitor, category: 'academy' },
    { name: 'Promotional Materials', href: '/promotional', icon: ExternalLink, category: 'academy' },
    { name: 'Cultural Integration', href: '/cultural', icon: Heart, category: 'academy' },
    { name: 'Advanced Training Hub', href: '/training-hub', icon: Award, category: 'academy' },
    { name: 'AI Skills Development', href: '/ai-learning', icon: Award, category: 'academy' },
    
    // Learning
    { name: 'Career', href: '/intranet/career', icon: GraduationCap, category: 'learning' },
    { name: 'Learning', href: '/intranet/learning', icon: BookOpen, category: 'learning' },
    { name: 'Beta Testing', href: '/testing', icon: TestTube, category: 'beta' },
  ];

  const isActive = (path: string) => router.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      router.push('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const Sidebar = () => (
    <div id="sidebar-navigation" className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-ubuntu-warm-200 bg-gradient-to-r from-ubuntu-warm-50 to-ubuntu-warm-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-ubuntu-purple rounded-lg flex items-center justify-center">
            <RondavelIcon className="h-4 w-4 text-white" />
          </div>
          <span className="font-ubuntu font-bold text-lg text-ubuntu-warm-900">
            Homestead OS
          </span>
        </div>
        <button
          className="lg:hidden p-2 rounded-lg text-ubuntu-warm-600 hover:text-ubuntu-warm-800"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="p-6 border-b border-ubuntu-warm-200 bg-ubuntu-warm-25">
          <div className="flex items-center space-x-3">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'User'}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-ubuntu-gold"
                unoptimized
              />
            ) : (
              <div className="w-10 h-10 bg-ubuntu-warm-200 rounded-full flex items-center justify-center ring-2 ring-ubuntu-gold">
                <User className="h-5 w-5 text-ubuntu-warm-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-ubuntu font-medium text-ubuntu-warm-900 truncate">
                {getGreeting()}, {user?.displayName?.split(' ')[0] || 'Family Member'}
              </p>
              <p className="text-xs text-ubuntu-warm-600 capitalize">
                {user?.role?.replace('_', ' ') || 'Family Member'} • Level {user?.gamification?.level || 1}
              </p>
            </div>
          </div>
          
          {/* XP Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-ubuntu-warm-600 mb-1">
              <span>Ubuntu Journey</span>
              <span>{user.gamification.experiencePoints} XP</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(user.gamification.experiencePoints / 
                    (user.gamification.experiencePoints + user.gamification.pointsToNextLevel)) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
        {/* Primary Phase 5B Navigation */}
        <div>
          <div className="flex items-center space-x-2 px-3 mb-3">
            <RondavelIcon className="h-4 w-4 text-ubuntu-gold" />
            <span className="text-xs font-ubuntu font-semibold text-ubuntu-warm-700 uppercase tracking-wide">
              Core Tools
            </span>
          </div>
          <div className="space-y-1">
            {navigation.filter(item => item.category === 'primary').map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-ubuntu-warm-100 text-ubuntu-warm-900 border-r-2 border-ubuntu-gold'
                    : 'text-ubuntu-warm-700 hover:text-ubuntu-warm-900 hover:bg-ubuntu-warm-50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Secondary Navigation */}
        <div>
          <div className="flex items-center space-x-2 px-3 mb-3">
            <Wifi className="h-4 w-4 text-ubuntu-gold" />
            <span className="text-xs font-ubuntu font-semibold text-ubuntu-warm-700 uppercase tracking-wide">
              Networks
            </span>
          </div>
          <div className="space-y-1">
            {navigation.filter(item => item.category === 'secondary').map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-ubuntu-warm-100 text-ubuntu-warm-900 border-r-2 border-ubuntu-gold'
                    : 'text-ubuntu-warm-700 hover:text-ubuntu-warm-900 hover:bg-ubuntu-warm-50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Extended Navigation */}
        <details className="group">
          <summary className="flex items-center space-x-2 px-3 mb-3 cursor-pointer hover:text-ubuntu-warm-900">
            <FolderOpen className="h-4 w-4 text-ubuntu-gold" />
            <span className="text-xs font-ubuntu font-semibold text-ubuntu-warm-700 uppercase tracking-wide">
              More ▾
            </span>
          </summary>
          <div className="space-y-1 mt-2">
            {navigation.filter(item => item.category === 'extended').map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isActive(item.href)
                    ? 'bg-ubuntu-warm-100 text-ubuntu-warm-900 border-r-2 border-ubuntu-gold'
                    : 'text-ubuntu-warm-700 hover:text-ubuntu-warm-900 hover:bg-ubuntu-warm-50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </details>

        {/* Beta Testing Section */}
        <div>
          <div className="flex items-center space-x-2 px-3 mb-3">
            <TestTube className="h-4 w-4 text-ubuntu-gold" />
            <span className="text-xs font-ubuntu font-semibold text-ubuntu-warm-700 uppercase tracking-wide">
              Innovation Lab
            </span>
          </div>
          <div className="space-y-1">
            {navigation.filter(item => item.category === 'beta').map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-ubuntu-warm-100 text-ubuntu-warm-900 border-r-2 border-ubuntu-gold'
                    : 'text-ubuntu-warm-700 hover:text-ubuntu-warm-900 hover:bg-ubuntu-warm-50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-ubuntu-warm-200 bg-ubuntu-warm-25">
        <div className="space-y-2">
          <Link
            href="/intranet/settings"
            className="flex items-center space-x-3 px-3 py-2 text-ubuntu-warm-600 hover:text-ubuntu-warm-900 hover:bg-ubuntu-warm-50 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-ubuntu-warm-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
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
        {/* Sidebar */}
        <Sidebar />

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-ubuntu-warm-900 bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white shadow-sm border-b border-ubuntu-warm-200">
            <div className="flex items-center justify-between h-16 px-4">
              <button
                className="p-2 rounded-lg text-ubuntu-warm-600 hover:text-ubuntu-warm-900 hover:bg-ubuntu-warm-50"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-ubuntu-purple rounded-lg flex items-center justify-center">
                  <RondavelIcon className="h-4 w-4 text-white" />
                </div>
                <span className="font-ubuntu font-bold text-lg text-ubuntu-warm-900">
                  Homestead OS
                </span>
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block bg-white shadow-sm border-b border-ubuntu-warm-200">
            <div className="flex items-center justify-end h-16 px-6">
              <LanguageSwitcher />
            </div>
          </div>

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