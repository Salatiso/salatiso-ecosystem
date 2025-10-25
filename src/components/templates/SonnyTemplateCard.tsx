// Enhanced Template Components with Sonny Integration
// Phase 4: Cross-Ecosystem Integration - Template Library Enhancement
// Mlandeli-Notemba Investments Ecosystem

import React, { useState, useEffect } from 'react';
import { Users, Share2, Edit, Clock, CheckCircle, AlertCircle, MessageSquare, Settings, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSonnyServices, useSonnyBridge, useConsentManager } from '@/hooks/useSonnyServices';
import Link from 'next/link';

// ============================================================================
// SONNY-ENHANCED TEMPLATE INTERFACE
// ============================================================================

interface SonnyTemplateProps {
  templateId: string;
  templateName: string;
  templateCategory: 'family' | 'personal' | 'professional' | 'quickstart';
  templatePath: string;
  requiredParticipants?: string[];
  collaborationMode: 'individual' | 'family' | 'group';
  ubuntuPrinciples: string[];
}

interface TemplateCollaborationSession {
  id: string;
  templateId: string;
  initiator: string;
  participants: Array<{
    userId: string;
    name: string;
    role: string;
    status: 'invited' | 'joined' | 'editing' | 'completed';
    lastActivity: Date;
  }>;
  status: 'preparing' | 'active' | 'review' | 'completed';
  createdAt: Date;
  completedAt?: Date;
  ubuntuCheckpoints: Array<{
    principle: string;
    verified: boolean;
    verifiedBy?: string;
    notes?: string;
  }>;
}

// ============================================================================
// SONNY-ENHANCED TEMPLATE CARD
// ============================================================================

export const SonnyTemplateCard: React.FC<SonnyTemplateProps & { onStartCollaboration: (templateId: string) => void }> = ({
  templateId,
  templateName,
  templateCategory,
  templatePath,
  requiredParticipants = [],
  collaborationMode,
  ubuntuPrinciples,
  onStartCollaboration
}) => {
  const { user } = useAuth();
  const [collaborationSession, setCollaborationSession] = useState<TemplateCollaborationSession | null>(null);

  const sonnyConfig = user ? {
    nodeId: `node_${user.id}`,
    deviceId: `device_${user.id}`,
    displayName: user.displayName || 'Family Member',
    familyId: `family_${user.id}`,
    userId: user.id,
    enableBluetooth: false,
    enableWifiDirect: false,
    enableInternetBridge: true,
    debugMode: false
  } : null;

  const { familyMembers } = useSonnyServices(sonnyConfig || {
    nodeId: 'temp', deviceId: 'temp', displayName: 'Guest', familyId: 'temp', userId: 'temp',
    enableBluetooth: false, enableWifiDirect: false, enableInternetBridge: false, debugMode: false
  });
  
  const { sendFamilyMessage } = useSonnyBridge(sonnyConfig || {
    nodeId: 'temp', deviceId: 'temp', displayName: 'Guest', familyId: 'temp', userId: 'temp',
    enableBluetooth: false, enableWifiDirect: false, enableInternetBridge: false, debugMode: false
  });

  const getCategoryIcon = () => {
    switch (templateCategory) {
      case 'family': return '👨‍👩‍👧‍👦';
      case 'personal': return '🧑';
      case 'professional': return '💼';
      case 'quickstart': return '⚡';
      default: return '📄';
    }
  };

  const getCategoryColor = () => {
    switch (templateCategory) {
      case 'family': return 'bg-purple-500';
      case 'personal': return 'bg-blue-500';
      case 'professional': return 'bg-green-500';
      case 'quickstart': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStartCollaboration = async () => {
    if (collaborationMode === 'individual') {
      // Open template directly for individual work
      window.open(templatePath, '_blank');
      return;
    }

    // For family/group collaboration, initiate Sonny session
    const newSession: TemplateCollaborationSession = {
      id: `session_${Date.now()}`,
      templateId,
      initiator: user?.id || 'unknown',
      participants: [{
        userId: user?.id || 'unknown',
        name: user?.displayName || 'Unknown User',
        role: 'initiator',
        status: 'joined',
        lastActivity: new Date()
      }],
      status: 'preparing',
      createdAt: new Date(),
      ubuntuCheckpoints: ubuntuPrinciples.map(principle => ({
        principle,
        verified: false
      }))
    };

    setCollaborationSession(newSession);
    
    // Notify family members
    if (collaborationMode === 'family' && familyMembers.length > 0) {
      for (const member of familyMembers) {
        if (member.id !== user?.id) {
          await sendFamilyMessage(
            member.id, 
            `${user?.displayName} has started a family collaboration session for "${templateName}". Join when ready!`
          );
        }
      }
    }

    onStartCollaboration(templateId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      {/* Template Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${getCategoryColor()} rounded-lg flex items-center justify-center text-white text-lg`}>
              {getCategoryIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{templateName}</h3>
              <p className="text-sm text-gray-600 capitalize">{templateCategory} Template</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {collaborationMode === 'family' && (
              <div className="flex items-center text-purple-600">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Family</span>
              </div>
            )}
            {collaborationMode === 'group' && (
              <div className="flex items-center text-blue-600">
                <Share2 className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Group</span>
              </div>
            )}
          </div>
        </div>

        {/* Ubuntu Principles */}
        {ubuntuPrinciples.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Ubuntu Principles:</p>
            <div className="flex flex-wrap gap-1">
              {ubuntuPrinciples.slice(0, 3).map((principle) => (
                <span key={principle} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  {principle}
                </span>
              ))}
              {ubuntuPrinciples.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{ubuntuPrinciples.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Collaboration Status */}
      {collaborationSession && (
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-900">
                {collaborationSession.status === 'preparing' ? 'Setting up collaboration...' :
                 collaborationSession.status === 'active' ? 'Collaboration in progress' :
                 collaborationSession.status === 'review' ? 'Ready for review' : 'Completed'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-blue-600">
                {collaborationSession.participants.filter(p => p.status === 'joined').length} active
              </span>
            </div>
          </div>

          {/* Participant Status */}
          <div className="mt-2 flex -space-x-1">
            {collaborationSession.participants.slice(0, 4).map((participant) => (
              <div key={participant.userId} className="relative">
                <div className="h-6 w-6 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                  {participant.name.charAt(0)}
                </div>
                {participant.status === 'editing' && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-white"></div>
                )}
              </div>
            ))}
            {collaborationSession.participants.length > 4 && (
              <div className="h-6 w-6 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                +{collaborationSession.participants.length - 4}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4">
        <div className="flex space-x-2">
          <button 
            onClick={handleStartCollaboration}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center justify-center space-x-2"
          >
            {collaborationMode === 'individual' ? (
              <>
                <Edit className="h-4 w-4" />
                <span>Start Template</span>
              </>
            ) : (
              <>
                <Users className="h-4 w-4" />
                <span>Start Collaboration</span>
              </>
            )}
          </button>

          <Link 
            href={templatePath}
            target="_blank"
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Preview template"
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </Link>
        </div>

        {/* Required Participants */}
        {requiredParticipants.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Required Participants:</p>
            <div className="flex flex-wrap gap-1">
              {requiredParticipants.map((participant) => (
                <span key={participant} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  {participant}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SONNY COLLABORATION PANEL
// ============================================================================

interface SonnyCollaborationPanelProps {
  session: TemplateCollaborationSession;
  onUpdateSession: (session: TemplateCollaborationSession) => void;
  onEndSession: () => void;
}

export const SonnyCollaborationPanel: React.FC<SonnyCollaborationPanelProps> = ({
  session,
  onUpdateSession,
  onEndSession
}) => {
  const { user } = useAuth();
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    userId: string;
    userName: string;
    message: string;
    timestamp: Date;
    type: 'message' | 'action' | 'ubuntu-check';
  }>>([]);

  const handleUbuntuVerification = (principle: string, verified: boolean) => {
    const updatedSession = {
      ...session,
      ubuntuCheckpoints: session.ubuntuCheckpoints.map(checkpoint =>
        checkpoint.principle === principle
          ? { ...checkpoint, verified, verifiedBy: user?.id }
          : checkpoint
      )
    };
    onUpdateSession(updatedSession);

    // Add chat message about Ubuntu verification
    const newMessage = {
      id: `msg_${Date.now()}`,
      userId: user?.id || 'system',
      userName: user?.displayName || 'System',
      message: `${verified ? 'Verified' : 'Unverified'} Ubuntu principle: ${principle}`,
      timestamp: new Date(),
      type: 'ubuntu-check' as const
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      userId: user?.id || 'anonymous',
      userName: user?.displayName || 'Anonymous',
      message: chatMessage,
      timestamp: new Date(),
      type: 'message' as const
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');
  };

  const allUbuntuPrinciplesVerified = session.ubuntuCheckpoints.every(c => c.verified);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Session Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-indigo-900">Family Collaboration Session</h3>
            <p className="text-sm text-indigo-600">Ubuntu-guided template completion</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              session.status === 'active' ? 'bg-green-100 text-green-800' :
              session.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
              session.status === 'review' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </div>
            <button 
              onClick={onEndSession}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 p-4">
        {/* Ubuntu Principles Checklist */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-orange-600" />
            <span>Ubuntu Principles</span>
          </h4>
          <div className="space-y-2">
            {session.ubuntuCheckpoints.map((checkpoint) => (
              <div key={checkpoint.principle} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{checkpoint.principle}</span>
                <button
                  onClick={() => handleUbuntuVerification(checkpoint.principle, !checkpoint.verified)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    checkpoint.verified
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {checkpoint.verified ? 'Verified ✓' : 'Verify'}
                </button>
              </div>
            ))}
          </div>

          {allUbuntuPrinciplesVerified && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  All Ubuntu principles verified! Ready to proceed.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Collaboration Chat */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span>Family Discussion</span>
          </h4>
          
          {/* Chat Messages */}
          <div className="h-48 overflow-y-auto bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
            {chatMessages.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">No messages yet. Start the conversation!</p>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className={`text-sm ${
                  msg.type === 'ubuntu-check' ? 'text-orange-600 italic' :
                  msg.type === 'action' ? 'text-blue-600 italic' :
                  'text-gray-700'
                }`}>
                  <span className="font-medium">{msg.userName}:</span> {msg.message}
                  <div className="text-xs text-gray-400 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Share thoughts with family..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Session Actions */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{session.participants.length} participants</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Started {session.createdAt.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              disabled={!allUbuntuPrinciplesVerified}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                allUbuntuPrinciplesVerified
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Complete Session
            </button>
            <button 
              onClick={onEndSession}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SonnyTemplateCard;