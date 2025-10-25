/**
 * ParticipantGrid Component - Video Call Participant Layout
 * 
 * Smart grid layout for video participants with Ubuntu-aligned features:
 * - Responsive grid (2x2, 3x3, 4x3 depending on count)
 * - Active speaker highlighting
 * - Role badges (elder, member, guest)
 * - Audio/video status indicators
 * - Elder priority positioning
 * 
 * @module ParticipantGrid
 */

'use client';

import React, { useMemo } from 'react';
import { DailyParticipant } from '@daily-co/daily-js';
import { useTranslation } from '@/contexts/I18nContext';

interface ParticipantGridProps {
  /** List of call participants */
  participants: DailyParticipant[];
  /** Current view mode */
  viewMode?: 'grid' | 'speaker';
  /** Active speaker session ID */
  activeSpeaker?: string;
}

type ParticipantRole = 'elder' | 'member' | 'guest';

interface ParticipantInfo {
  participant: DailyParticipant;
  role: ParticipantRole;
  displayName: string;
  isLocal: boolean;
}

/**
 * Calculate optimal grid layout based on participant count
 */
function getGridLayout(count: number): { cols: number; rows: number } {
  if (count <= 1) return { cols: 1, rows: 1 };
  if (count <= 4) return { cols: 2, rows: 2 };
  if (count <= 6) return { cols: 3, rows: 2 };
  if (count <= 9) return { cols: 3, rows: 3 };
  if (count <= 12) return { cols: 4, rows: 3 };
  return { cols: 4, rows: 4 };
}

/**
 * Extract participant role from userData
 */
function getParticipantRole(participant: DailyParticipant): ParticipantRole {
  if (participant.userData && typeof participant.userData === 'object' && 'role' in participant.userData) {
    return participant.userData.role as ParticipantRole;
  }
  return 'member';
}

/**
 * Sort participants with elders first (Ubuntu priority)
 */
function sortParticipants(participants: ParticipantInfo[]): ParticipantInfo[] {
  return [...participants].sort((a, b) => {
    // Elders first
    if (a.role === 'elder' && b.role !== 'elder') return -1;
    if (a.role !== 'elder' && b.role === 'elder') return 1;
    
    // Local participant second (after elders)
    if (a.isLocal && !b.isLocal) return -1;
    if (!a.isLocal && b.isLocal) return 1;
    
    // Then alphabetically
    return a.displayName.localeCompare(b.displayName);
  });
}

/**
 * Participant grid component
 */
export default function ParticipantGrid({
  participants,
  viewMode = 'grid',
  activeSpeaker
}: ParticipantGridProps) {
  const { t } = useTranslation();

  // Process participants
  const participantInfos = useMemo((): ParticipantInfo[] => {
    return Object.values(participants).map(p => ({
      participant: p,
      role: getParticipantRole(p),
      displayName: p.user_name || 'Unknown',
      isLocal: p.local || false
    }));
  }, [participants]);

  // Sort with Ubuntu priority (elders first)
  const sortedParticipants = useMemo(() => {
    return sortParticipants(participantInfos);
  }, [participantInfos]);

  // Calculate grid layout
  const layout = useMemo(() => {
    return getGridLayout(sortedParticipants.length);
  }, [sortedParticipants.length]);

  // Speaker view: show only active speaker (or first participant)
  if (viewMode === 'speaker') {
    const speakerInfo = sortedParticipants.find(
      p => p.participant.session_id === activeSpeaker
    ) || sortedParticipants[0];

    if (!speakerInfo) return null;

    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 relative bg-gray-900">
          <ParticipantTile 
            info={speakerInfo} 
            isActiveSpeaker={true}
            size="large"
          />
        </div>
        
        {/* Thumbnail strip */}
        {sortedParticipants.length > 1 && (
          <div className="h-32 bg-gray-800 flex items-center space-x-2 px-4 overflow-x-auto">
            {sortedParticipants
              .filter(p => p.participant.session_id !== speakerInfo.participant.session_id)
              .map(info => (
                <div key={info.participant.session_id} className="w-40 h-24 flex-shrink-0">
                  <ParticipantTile 
                    info={info}
                    isActiveSpeaker={info.participant.session_id === activeSpeaker}
                    size="small"
                  />
                </div>
              ))
            }
          </div>
        )}
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className="w-full h-full grid gap-2 p-2"
      style={{
        gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
        gridTemplateRows: `repeat(${layout.rows}, 1fr)`
      }}
    >
      {sortedParticipants.map(info => (
        <div key={info.participant.session_id} className="relative">
          <ParticipantTile 
            info={info}
            isActiveSpeaker={info.participant.session_id === activeSpeaker}
            size="medium"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Individual participant tile
 */
interface ParticipantTileProps {
  info: ParticipantInfo;
  isActiveSpeaker: boolean;
  size: 'small' | 'medium' | 'large';
}

function ParticipantTile({ info, isActiveSpeaker, size }: ParticipantTileProps) {
  const { t } = useTranslation();
  const { participant, role, displayName, isLocal } = info;

  const hasAudio = participant.audio;
  const hasVideo = participant.video;

  // Role badge configuration
  const roleConfig = {
    elder: {
      label: t('video.role.elder', 'Elder'),
      bgColor: 'bg-yellow-600',
      icon: '👑'
    },
    member: {
      label: t('video.role.member', 'Member'),
      bgColor: 'bg-blue-600',
      icon: '👤'
    },
    guest: {
      label: t('video.role.guest', 'Guest'),
      bgColor: 'bg-gray-600',
      icon: '👥'
    }
  };

  const roleInfo = roleConfig[role];

  return (
    <div 
      className={`
        relative w-full h-full bg-gray-900 rounded-lg overflow-hidden
        ${isActiveSpeaker ? 'ring-4 ring-green-500' : ''}
        ${role === 'elder' ? 'ring-2 ring-yellow-500' : ''}
      `}
    >
      {/* Video placeholder or actual video stream */}
      {hasVideo ? (
        <div className="w-full h-full flex items-center justify-center">
          {/* Video element would be rendered here by Daily SDK */}
          <div className="text-gray-500 text-sm">Video Active</div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">{roleInfo.icon}</span>
            </div>
            <p className="text-white text-sm font-medium">{displayName}</p>
          </div>
        </div>
      )}

      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top bar: Role badge + active speaker indicator */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
          <div className={`${roleInfo.bgColor} px-2 py-1 rounded text-white text-xs font-medium flex items-center space-x-1`}>
            <span>{roleInfo.icon}</span>
            <span>{roleInfo.label}</span>
          </div>
          
          {isActiveSpeaker && (
            <div className="bg-green-500 px-2 py-1 rounded text-white text-xs font-medium flex items-center space-x-1 animate-pulse">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              <span>{t('video.speaking', 'Speaking')}</span>
            </div>
          )}
        </div>

        {/* Bottom bar: Name + status indicators */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-white text-sm font-medium truncate">
                {displayName}
                {isLocal && <span className="text-green-400 ml-1">({t('video.you', 'You')})</span>}
              </p>
            </div>
            
            <div className="flex items-center space-x-1">
              {/* Muted indicator */}
              {!hasAudio && (
                <div className="bg-red-600 p-1 rounded">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                </div>
              )}
              
              {/* Video off indicator */}
              {!hasVideo && (
                <div className="bg-gray-700 p-1 rounded">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
