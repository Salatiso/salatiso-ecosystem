// Enhanced Dashboard Widgets with Sonny Integration
// Phase 4: Cross-Ecosystem Integration
// Mlandeli-Notemba Investments Ecosystem

import React, { useState, useEffect } from 'react';
import { Sun, Star, Award, TrendingUp, Users, Clock, Wifi, Shield, Heart, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSonnyServices, useSonnyBridge, useSafetyManager } from '@/hooks/useSonnyServices';
import contactsService, { Contact } from '@/services/ContactsService';
import Link from 'next/link';

// ============================================================================
// SONNY NETWORK STATUS WIDGET
// ============================================================================

const SonnyNetworkWidget: React.FC = () => {
  const { user } = useAuth();
  
  // IMPORTANT: Always call hooks at the top level, before any conditions
  const sonnyConfig = {
    nodeId: user?.id ? `node_${user.id}` : 'node_guest',
    deviceId: user?.id ? `device_${user.id}` : 'device_guest',
    displayName: user?.displayName || user?.email?.split('@')[0] || 'Family Member',
    familyId: user?.id ? `family_${user.id}` : 'family_guest',
    userId: user?.id || 'guest',
    enableBluetooth: true,
    enableWifiDirect: true,
    enableInternetBridge: true,
    debugMode: false
  };

  const { state, familyMembers, safetyStatus } = useSonnyServices(sonnyConfig);

  // Now check if we should render (after all hooks are called)
  if (!user || !user.id) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${state.meshStatus === 'online' ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Wifi className={`h-5 w-5 ${state.meshStatus === 'online' ? 'text-green-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Sonny Network</h3>
            <p className="text-sm text-gray-600">
              {state.isInitialized ?
                state.meshStatus === 'online' ? `Connected (${state.connectionCount} peers)` : 'Initializing...'
                : 'Not connected'
              }
            </p>
          </div>
        </div>
        <Link 
          href="/sonny"
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          Open Dashboard →
        </Link>
      </div>

      {state.isInitialized ? (
        <div className="space-y-3">
          {/* Family Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Family Online</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {familyMembers.filter(m => m.status === 'online').length}/{familyMembers.length}
            </span>
          </div>

          {/* Safety Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Safety Status</span>
            </div>
            <div className="flex items-center space-x-1">
              {safetyStatus.activeTriggers.length === 0 ? (
                <>
                  <Heart className="h-3 w-3 text-green-600" />
                  <span className="text-sm font-medium text-green-600">All Good</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-600">
                    {safetyStatus.activeTriggers.length} Active
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <button className="text-xs bg-green-50 text-green-700 py-1.5 px-3 rounded-md hover:bg-green-100 transition-colors">
                Check In
              </button>
              <button className="text-xs bg-indigo-50 text-indigo-700 py-1.5 px-3 rounded-md hover:bg-indigo-100 transition-colors">
                Send Message
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Connecting to family network...</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ENHANCED WELCOME WIDGET WITH SONNY INTEGRATION
// ============================================================================

const EnhancedWelcomeWidget: React.FC = () => {
  const { user } = useAuth();
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    let name = 'Family Member';
    if (user?.displayName) {
      name = user.displayName.split(' ')[0];
    } else if (user?.email) {
      name = user.email.split('@')[0];
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 17) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  const getUbuntuMessage = () => {
    // Return first message for perfect server/client hydration consistency
    // This ensures the same text renders on both server and client
    // Rotation happens on page refresh/revisit (time-based)
    const messages = [
      "Ubuntu: 'I am because we are.' Your family network is stronger together.",
      "Every connection you make strengthens the entire family ecosystem.",
      "Your presence in the Sonny network brings safety and unity to all.",
      "Today is another opportunity to build Ubuntu within your family.",
      "Through Sonny, we create digital bonds that reflect our cultural values."
    ];
    // Use date-based deterministic selection: changes daily, consistent for all users
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return messages[dayOfYear % messages.length];
  };

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full border-2 border-white"></div>
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full border border-white"></div>
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <Sun className="h-8 w-8 text-yellow-300" />
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium">Level {user?.gamification?.level || 1}</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">{getTimeBasedGreeting()}</h2>
        <p className="text-primary-100 mb-4">{getUbuntuMessage()}</p>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Award className="h-4 w-4" />
            <span>Ubuntu Points: {user?.gamification?.experiencePoints || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4" />
            <span>Streak: {user?.gamification?.streaks?.length || 0} active</span>
          </div>
        </div>

        {/* Quick Sonny Actions */}
        <div className="mt-4 pt-4 border-t border-primary-400 border-opacity-30">
          <div className="flex space-x-2">
            <Link 
              href="/sonny"
              className="flex-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg py-2 px-3 text-center text-sm font-medium hover:bg-opacity-30 transition-colors"
            >
              Family Network
            </Link>
            <button className="flex-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg py-2 px-3 text-center text-sm font-medium hover:bg-opacity-30 transition-colors">
              Safety Check
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FAMILY ACTIVITY WIDGET WITH REAL CONTACTS
// ============================================================================

const FamilyActivityWidget: React.FC = () => {
  const { user } = useAuth();
  const [familyContacts, setFamilyContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load real family members from Firestore
  useEffect(() => {
    const loadFamilyMembers = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const members = await contactsService.getFamilyMembers(user.id);
        setFamilyContacts(members);
        setError(null);
      } catch (err) {
        console.error('Error loading family members:', err);
        setError(err instanceof Error ? err.message : 'Failed to load family members');
      } finally {
        setLoading(false);
      }
    };

    loadFamilyMembers();
  }, [user?.id]);
  
  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Family Members</h3>
        <Users className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-600 py-2">{error}</div>
        ) : familyContacts.length > 0 ? (
          familyContacts.slice(0, 4).map((contact) => (
            <div key={contact.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-indigo-600">
                  {contact.firstName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {contact.isHouseholdMember ? 'Household' : 'Family'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {contact.sonnyStatus || 'offline'}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {contact.lastSeen?.toLocaleTimeString() || 'Never'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No family members added yet</p>
            <Link 
              href="/intranet/contacts" 
              className="text-xs text-indigo-600 hover:text-indigo-700"
            >
              Add family members →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// QUICK ACTIONS WIDGET WITH SONNY INTEGRATION
// ============================================================================

const QuickActionsWidget: React.FC = () => {
  const { user } = useAuth();
  
  const actions = [
    {
      title: "Family Network",
      description: "Connect with Sonny mesh",
      icon: Wifi,
      href: "/sonny",
      color: "bg-indigo-500",
      enabled: true
    },
    {
      title: "Safety Check",
      description: "Perform family check-in",
      icon: Shield,
      href: "/sonny?tab=safety",
      color: "bg-green-500",
      enabled: !!user
    },
    {
      title: "Send Message",
      description: "Message family members",
      icon: Users,
      href: "/sonny?tab=messages",
      color: "bg-blue-500",
      enabled: !!user
    },
    {
      title: "Trust Network",
      description: "View Ubuntu scores",
      icon: Heart,
      href: "/sonny?tab=trust",
      color: "bg-purple-500",
      enabled: !!user
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.enabled ? action.href : '#'}
            className={`block p-4 rounded-lg border-2 border-transparent hover:border-gray-200 transition-colors ${
              !action.enabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {action.title}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Export enhanced widgets
export {
  SonnyNetworkWidget,
  EnhancedWelcomeWidget as WelcomeWidget,
  FamilyActivityWidget,
  QuickActionsWidget
};