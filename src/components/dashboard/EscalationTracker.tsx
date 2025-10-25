'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AlertCircle, Clock, User, CheckCircle, TrendingUp, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { EscalationEvent, EscalationStatus, EscalationLevel } from '@/types/escalation';

interface EscalationUIEvent extends EscalationEvent {
  timeAgo?: string;
  priorityScore?: number;
}

/**
 * EscalationTracker Component
 * 
 * Displays all escalations with:
 * - Real-time Firestore updates
 * - Priority-based categorization (Low → High)
 * - Real-time notifications
 * - Status indicators
 */
export const EscalationTracker: React.FC = () => {
  const { user } = useAuth();
  const [escalations, setEscalations] = useState<EscalationUIEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'escalated' | 'resolved'>('all');

  // Calculate priority score for sorting
  const calculatePriority = useCallback((escalation: EscalationEvent): number => {
    const levelScores: Record<EscalationLevel, number> = {
      [EscalationLevel.INDIVIDUAL]: 1,
      [EscalationLevel.FAMILY]: 2,
      [EscalationLevel.COMMUNITY]: 3,
      [EscalationLevel.PROFESSIONAL]: 4,
    };

    const statusScores: Record<EscalationStatus, number> = {
      [EscalationStatus.OPEN]: 10,
      [EscalationStatus.ESCALATED]: 20,
      [EscalationStatus.IN_PROGRESS]: 15,
      [EscalationStatus.AWAITING_RESPONSE]: 12,
      [EscalationStatus.ON_HOLD]: 5,
      [EscalationStatus.RESOLVED]: 0,
      [EscalationStatus.ARCHIVED]: 0,
      [EscalationStatus.CANCELLED]: 0,
    };

    return (levelScores[escalation.currentLevel] || 0) * (statusScores[escalation.status] || 0);
  }, []);

  // Format time ago
  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const intervals: Record<string, number> = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [key, value] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / value);
      if (interval >= 1) return `${interval} ${key}${interval !== 1 ? 's' : ''} ago`;
    }
    return 'just now';
  };

  // Subscribe to escalations
  useEffect(() => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'escalations'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const escalationsList: EscalationUIEvent[] = [];
          let isNew = false;

          snapshot.docs.forEach((doc) => {
            const data = doc.data() as EscalationEvent;
            const escalation: EscalationUIEvent = {
              ...data,
              id: doc.id,
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
              escalatedAt: data.escalatedAt instanceof Timestamp ? data.escalatedAt.toDate() : data.escalatedAt ? new Date(data.escalatedAt) : undefined,
            };

            escalation.timeAgo = getTimeAgo(escalation.createdAt);
            escalation.priorityScore = calculatePriority(escalation);

            // Detect new escalations for notifications
            if (
              escalation.status === EscalationStatus.ESCALATED ||
              escalation.status === EscalationStatus.OPEN
            ) {
              if (!escalationsList.some(e => e.id === escalation.id)) {
                isNew = true;
              }
            }

            escalationsList.push(escalation);
          });

          // Sort by priority (high first)
          escalationsList.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

          setEscalations(escalationsList);
          setLoading(false);
          setError(null);

          // Show notification for new high-priority escalations
          if (isNew && escalationsList.length > 0) {
            const critical = escalationsList.find(
              e =>
                e.status === EscalationStatus.ESCALATED &&
                e.currentLevel === EscalationLevel.PROFESSIONAL
            );

            if (critical) {
              toast.error(
                `🚨 Critical Escalation: ${critical.title || 'Incident escalated to professional level'}`,
                {
                  duration: 5000,
                  icon: '🚨',
                }
              );
            } else {
              const recent = escalationsList[0];
              if (recent && recent.status === EscalationStatus.ESCALATED) {
                toast(
                  `📊 Escalation: ${recent.title || 'New incident escalation'}`,
                  {
                    duration: 4000,
                    icon: '📊',
                  }
                );
              }
            }
          }
        },
        (err) => {
          console.error('Error loading escalations:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [user, calculatePriority]);

  // Filter escalations
  const filteredEscalations = escalations.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'open') return e.status === EscalationStatus.OPEN;
    if (filter === 'escalated') return e.status === EscalationStatus.ESCALATED;
    if (filter === 'resolved')
      return e.status === EscalationStatus.RESOLVED || e.status === EscalationStatus.ARCHIVED;
    return true;
  });

  // Get status badge
  const getStatusBadge = (status: EscalationStatus, level: EscalationLevel) => {
    if (status === EscalationStatus.RESOLVED) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
          <CheckCircle className="w-3 h-3" />
          Resolved
        </div>
      );
    }

    if (status === EscalationStatus.ESCALATED && level === EscalationLevel.PROFESSIONAL) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
          <AlertCircle className="w-3 h-3" />
          Critical
        </div>
      );
    }

    if (status === EscalationStatus.ESCALATED) {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
          <TrendingUp className="w-3 h-3" />
          Escalated
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
        <Bell className="w-3 h-3" />
        Open
      </div>
    );
  };

  // Get level badge
  const getLevelBadge = (level: EscalationLevel) => {
    const badges: Record<EscalationLevel, { label: string; color: string; emoji: string }> = {
      [EscalationLevel.INDIVIDUAL]: { label: 'Individual', color: 'bg-gray-100 text-gray-800', emoji: '👤' },
      [EscalationLevel.FAMILY]: { label: 'Family', color: 'bg-blue-100 text-blue-800', emoji: '👨‍👩‍👧' },
      [EscalationLevel.COMMUNITY]: { label: 'Community', color: 'bg-purple-100 text-purple-800', emoji: '🌐' },
      [EscalationLevel.PROFESSIONAL]: { label: 'Professional', color: 'bg-red-100 text-red-800', emoji: '🏢' },
    };

    const badge = badges[level];
    return (
      <div className={`${badge.color} px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
        <span>{badge.emoji}</span>
        {badge.label}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading escalations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">
          <strong>Error:</strong> {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-gray-200">
        {(['all', 'open', 'escalated', 'resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors capitalize ${
              filter === f
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {f === 'all' ? 'All' : f === 'open' ? 'Open' : f === 'escalated' ? 'Escalated' : 'Resolved'} (
            {escalations.filter(
              (e) =>
                (f === 'all') ||
                (f === 'open' && e.status === EscalationStatus.OPEN) ||
                (f === 'escalated' && e.status === EscalationStatus.ESCALATED) ||
                (f === 'resolved' &&
                  (e.status === EscalationStatus.RESOLVED || e.status === EscalationStatus.ARCHIVED))
            ).length}
            )
          </button>
        ))}
      </div>

      {/* Escalations List */}
      {filteredEscalations.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            {filter === 'all'
              ? 'No escalations'
              : filter === 'resolved'
              ? 'No resolved escalations'
              : 'No active escalations'}
          </p>
          <p className="text-gray-500 text-sm mt-1">Great job keeping things running smoothly!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEscalations.map((escalation) => (
            <div
              key={escalation.id}
              className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                escalation.status === EscalationStatus.RESOLVED
                  ? 'bg-gray-50 border-gray-200'
                  : escalation.currentLevel === EscalationLevel.PROFESSIONAL
                  ? 'bg-red-50 border-red-200'
                  : escalation.status === EscalationStatus.ESCALATED
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    {getStatusBadge(escalation.status, escalation.currentLevel)}
                    {getLevelBadge(escalation.currentLevel)}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 break-words">
                    {escalation.title || 'Untitled Incident'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 break-words">
                    {escalation.description || 'No description provided'}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                    {escalation.location && (
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        {escalation.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {escalation.timeAgo}
                    </div>
                    {escalation.createdBy && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Created by: {escalation.createdBy}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  {escalation.status !== EscalationStatus.RESOLVED && (
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors">
                      Respond
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {escalations.filter(e => e.status === EscalationStatus.ESCALATED && e.currentLevel === EscalationLevel.PROFESSIONAL).length}
          </div>
          <p className="text-xs text-gray-600 mt-1">Critical</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {escalations.filter(e => e.status === EscalationStatus.ESCALATED).length}
          </div>
          <p className="text-xs text-gray-600 mt-1">Escalated</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {escalations.filter(e => e.status === EscalationStatus.OPEN).length}
          </div>
          <p className="text-xs text-gray-600 mt-1">Open</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {escalations.filter(e => e.status === EscalationStatus.RESOLVED || e.status === EscalationStatus.ARCHIVED).length}
          </div>
          <p className="text-xs text-gray-600 mt-1">Resolved</p>
        </div>
      </div>
    </div>
  );
};

export default EscalationTracker;
