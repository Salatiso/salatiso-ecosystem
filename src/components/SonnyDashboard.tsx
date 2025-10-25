// Sonny Dashboard Component - Integrated Services Display
// Phase 4: Cross-Ecosystem Integration
// Mlandeli-Notemba Investments Ecosystem

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { useSonnyServices, useSonnyBridge, useSafetyManager, useConsentManager, useTrustNetwork } from '@/hooks/useSonnyServices';
import { TriggerForm, SimpleTrigger } from '@/components/sonny/triggers/TriggerForm';
import { TriggerList } from '@/components/sonny/triggers/TriggerList';
import SafetyExchange from '@/components/sonny/safety-exchange/SafetyExchange';
import TrustRatingsSystem from '@/components/sonny/safety-exchange/TrustRatingsSystem';
import MeshMessagingSystem from '@/components/sonny/safety-exchange/MeshMessagingSystem';

// ============================================================================
// SONNY DASHBOARD MAIN COMPONENT
// ============================================================================

interface SonnyDashboardProps {
  userId: string;
  familyId: string;
  displayName: string;
}

const SonnyDashboard: React.FC<SonnyDashboardProps> = ({ userId, familyId, displayName }) => {
  // Sonny Services Configuration
  const sonnyConfig = {
    nodeId: `node_${userId}`,
    deviceId: `device_${userId}`,
    displayName,
    familyId,
    userId,
    enableBluetooth: true,
    enableWifiDirect: true,
    enableInternetBridge: true,
    debugMode: process.env.NODE_ENV === 'development'
  };

  // Initialize Sonny services - only use the main hook to avoid hook count mismatch
  const { state, familyMembers, safetyStatus, services, sendFamilyMessage, broadcastFamilyStatus, performCheckIn, triggerEmergency, createGeofence, requestConsent, grantConsent, checkConsent, getTrustScore, recordInteraction, updateUbuntuQualities } = useSonnyServices(sonnyConfig);

  // Local state
  const [activeTab, setActiveTab] = useState('overview');
  const [currentStatus, setCurrentStatus] = useState('Available');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Trigger management state
  const [triggers, setTriggers] = useState<SimpleTrigger[]>([]);
  const [showTriggerForm, setShowTriggerForm] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<SimpleTrigger | undefined>();

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.warn('Location access denied:', error),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Handle status broadcast
  const handleStatusBroadcast = async () => {
    await broadcastFamilyStatus(currentStatus);
    alert(`Status "${currentStatus}" broadcast to family network`);
  };

  // Handle emergency trigger
  const handleEmergency = async (type: 'panic' | 'medical' | 'accident') => {
    const confirmed = window.confirm(`Are you sure you want to trigger a ${type} emergency alert?`);
    if (confirmed) {
      await triggerEmergency(type, `${type} emergency triggered from dashboard`);
      alert('Emergency alert sent to family network');
    }
  };

  // Handle check-in
  const handleCheckIn = async () => {
    await performCheckIn(location || undefined);
    alert('Check-in completed successfully');
  };

  // Trigger management handlers
  const handleSaveTrigger = (trigger: SimpleTrigger) => {
    if (editingTrigger) {
      // Update existing
      setTriggers(prev => prev.map(t => t.id === trigger.id ? trigger : t));
    } else {
      // Add new
      setTriggers(prev => [...prev, trigger]);
    }
    setShowTriggerForm(false);
    setEditingTrigger(undefined);
  };

  const handleEditTrigger = (trigger: SimpleTrigger) => {
    setEditingTrigger(trigger);
    setShowTriggerForm(true);
  };

  const handleDeleteTrigger = (triggerId: string) => {
    setTriggers(prev => prev.filter(t => t.id !== triggerId));
  };

  const handleToggleActive = (triggerId: string) => {
    setTriggers(prev => prev.map(t =>
      t.id === triggerId ? { ...t, isActive: !t.isActive } : t
    ));
  };

  const handleTriggerCheckIn = (triggerId: string) => {
    setTriggers(prev => prev.map(t =>
      t.id === triggerId ? { ...t, lastCheckIn: Date.now() } : t
    ));
    alert('Check-in recorded successfully!');
  };

  if (!state.isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Initializing Sonny Services...</h2>
          <p className="text-gray-500 mt-2">Setting up mesh networking and family coordination</p>
          {state.lastError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {state.lastError}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Back to Dashboard Button */}
              <Link 
                href="/intranet/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
                <Home className="h-5 w-5" />
              </Link>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <h1 className="text-2xl font-bold text-gray-900">Sonny Family Network</h1>
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${state.meshStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {state.meshStatus === 'online' ? 'Connected' : 'Offline'} ({state.connectionCount} connections)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={currentStatus} 
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option>Available</option>
                <option>Busy</option>
                <option>Away</option>
                <option>Do Not Disturb</option>
                <option>Emergency</option>
              </select>
              <button 
                onClick={handleStatusBroadcast}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Broadcast Status
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {[
                { id: 'overview', name: 'Overview', icon: '🏠' },
                { id: 'family', name: 'Family Network', icon: '👨‍👩‍👧‍👦' },
                { id: 'safety-exchange', name: 'Safety Exchange', icon: '🔄' },
                { id: 'triggers', name: 'Safety Triggers', icon: '⏰' },
                { id: 'safety', name: 'Safety Center', icon: '🛡️' },
                { id: 'messages', name: 'Messages', icon: '💬' },
                { id: 'trust', name: 'Trust Network', icon: '🤝' },
                { id: 'permissions', name: 'Permissions', icon: '🔐' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab state={state} safetyStatus={safetyStatus} familyMembers={familyMembers} triggers={triggers} />}
          {activeTab === 'family' && <FamilyNetworkTab familyMembers={familyMembers} getTrustScore={getTrustScore} recordInteraction={recordInteraction} />}
          {activeTab === 'triggers' && (
            <TriggerList
              triggers={triggers}
              familyMembers={familyMembers}
              onCreateClick={() => {
                setEditingTrigger(undefined);
                setShowTriggerForm(true);
              }}
              onEdit={handleEditTrigger}
              onDelete={handleDeleteTrigger}
              onToggleActive={handleToggleActive}
              onCheckIn={handleTriggerCheckIn}
            />
          )}
          {activeTab === 'safety-exchange' && (
            <SafetyExchange
              userId={userId}
              familyId={familyId}
              displayName={displayName}
              onExchangeComplete={(profile) => {
                alert(`Safety profile exchanged with ${profile.displayName}`);
              }}
              onTrustUpdate={(userId, newScore) => {
                alert(`Trust score updated for ${userId}: ${newScore}`);
              }}
            />
          )}
          {activeTab === 'safety' && <SafetyCenterTab safetyStatus={safetyStatus} handleCheckIn={handleCheckIn} handleEmergency={handleEmergency} location={location} triggers={triggers} />}
          {activeTab === 'messages' && (
            <MeshMessagingSystem
              familyMembers={familyMembers}
              currentUserId={userId}
              onSendMessage={(message) => {
                console.log('Message sent:', message);
              }}
            />
          )}
          {activeTab === 'trust' && (
            <TrustRatingsSystem
              userId={userId}
              onRatingSubmit={(interaction) => {
                alert(`Rating submitted for ${interaction.withUserName}: ${interaction.rating} stars for ${interaction.quality}`);
              }}
            />
          )}
          {activeTab === 'permissions' && <PermissionsTab />}
        </div>
      </div>

      {/* Trigger Form Modal */}
      {showTriggerForm && (
        <TriggerForm
          trigger={editingTrigger}
          familyMembers={familyMembers}
          onSave={handleSaveTrigger}
          onCancel={() => {
            setShowTriggerForm(false);
            setEditingTrigger(undefined);
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// TAB COMPONENTS
// ============================================================================

const OverviewTab: React.FC<any> = ({ state, safetyStatus, familyMembers, triggers }) => {
  const now = Date.now();
  const activeTriggers = triggers.filter((t: SimpleTrigger) => 
    t.isActive && now >= t.startTime && now <= t.endTime
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Network Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Mesh Status:</span>
            <span className={`font-medium ${state.meshStatus === 'online' ? 'text-green-600' : 'text-red-600'}`}>
              {state.meshStatus.charAt(0).toUpperCase() + state.meshStatus.slice(1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Connections:</span>
            <span className="font-medium">{state.connectionCount}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Family Network</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Online Members:</span>
            <span className="font-medium text-green-600">
              {familyMembers.filter((m: any) => m.status === 'online').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Members:</span>
            <span className="font-medium">{familyMembers.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety Triggers</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Active Now:</span>
            <span className={`font-medium ${activeTriggers.length > 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {activeTriggers.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Triggers:</span>
            <span className="font-medium">{triggers.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ubuntu Score</h3>
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-600">
            75
          </div>
          <div className="text-sm text-gray-600">Trust Level</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FamilyNetworkTab: React.FC<any> = ({ familyMembers, getTrustScore, recordInteraction }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
    </div>
    <div className="divide-y divide-gray-200">
      {familyMembers.map((member: any) => (
        <div key={member.id} className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}>
              {member.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-gray-900">{member.name}</div>
              <div className="text-sm text-gray-600">{member.role}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">Trust: {member.trustScore}</div>
              <div className="text-sm text-gray-600">
                Last seen: {member.lastSeen.toLocaleString()}
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              member.status === 'online' ? 'bg-green-100 text-green-800' : 
              member.status === 'away' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {member.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SafetyCenterTab: React.FC<any> = ({ safetyStatus, handleCheckIn, handleEmergency, location, triggers }) => {
  const now = Date.now();
  const activeTriggers = triggers.filter((t: SimpleTrigger) => 
    t.isActive && now >= t.startTime && now <= t.endTime
  );
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Actions</h3>
        <div className="space-y-4">
          <button 
            onClick={handleCheckIn}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            🆗 Perform Check-In
          </button>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => handleEmergency('panic')}
              className="bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 transition-colors text-sm"
            >
              🚨 Panic
            </button>
            <button 
              onClick={() => handleEmergency('medical')}
              className="bg-orange-600 text-white py-2 px-3 rounded hover:bg-orange-700 transition-colors text-sm"
            >
              🏥 Medical
            </button>
            <button 
              onClick={() => handleEmergency('accident')}
              className="bg-purple-600 text-white py-2 px-3 rounded hover:bg-purple-700 transition-colors text-sm"
            >
              🚗 Accident
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Triggers</h3>
        {activeTriggers.length === 0 ? (
          <div className="text-gray-600 text-center py-8">
            <div className="text-2xl mb-2">✅</div>
            <div>All good! No active safety triggers.</div>
            <div className="text-sm mt-2">Go to the Safety Triggers tab to create one</div>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTriggers.map((trigger: SimpleTrigger) => (
              <div key={trigger.id} className="p-3 rounded-lg border-l-4 border-green-500 bg-green-50">
                <div className="font-medium text-gray-900">{trigger.name}</div>
                <div className="text-sm text-gray-600 capitalize">{trigger.type} • Check-in every {trigger.checkInInterval / 60000} min</div>
                {trigger.lastCheckIn && (
                  <div className="text-xs text-green-700 mt-1">
                    Last check-in: {new Date(trigger.lastCheckIn).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PermissionsTab: React.FC<any> = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Management</h3>
    <div className="text-gray-600">
      Permission management interface will be implemented here.
      Features include:
      <ul className="list-disc list-inside mt-2 space-y-1">
        <li>Request permissions from family members</li>
        <li>Grant or deny incoming permission requests</li>
        <li>View active permissions and their conditions</li>
        <li>Set time and location-based restrictions</li>
        <li>Manage emergency overrides</li>
      </ul>
    </div>
  </div>
);

export default SonnyDashboard;