'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, AlertCircle, TrendingDown } from 'lucide-react';
import { SLAStatus } from '@/types/teamAssignment';
import { slaTrackingService } from '@/services/slaTrackingService';
import toast from 'react-hot-toast';

interface SLATracker {
  id: string;
  escalationId: string;
  escalationTitle: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: SLAStatus;
  responseDeadline: number;
  resolutionDeadline: number;
  responseTime?: number;
  resolutionTime?: number;
  createdAt: Date;
  responseAt?: Date;
  resolvedAt?: Date;
}

interface SLABreachAlert {
  escalationId: string;
  escalationTitle: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  minutesUntilBreach: number;
  slaType: 'response' | 'resolution';
  breached: boolean;
}

interface SLATrackingComponentProps {
  teamId?: string;
  escalationId?: string;
  onBreach?: (escalationId: string) => void;
}

export const SLATrackingComponent: React.FC<SLATrackingComponentProps> = ({
  teamId = 'default-team',
  escalationId,
  onBreach,
}) => {
  const [activeSLAs, setActiveSLAs] = useState<SLATracker[]>([]);
  const [breachAlerts, setBreachAlerts] = useState<SLABreachAlert[]>([]);
  const [complianceRate, setComplianceRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'at-risk' | 'breached'>('all');

  // Load SLA data and set up refresh interval
  useEffect(() => {
    loadSLAData();
    const interval = setInterval(loadSLAData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [teamId]);

  const loadSLAData = async () => {
    try {
      setLoading(true);

      // Mock SLA data - in production, fetch from SLATrackingService
      const mockSLAs: SLATracker[] = [
        {
          id: 'sla-1',
          escalationId: 'esc-001',
          escalationTitle: 'Database performance degradation',
          priority: 'critical',
          status: SLAStatus.IN_PROGRESS,
          responseDeadline: 15 * 60 * 1000, // 15 minutes
          resolutionDeadline: 60 * 60 * 1000, // 60 minutes
          responseTime: 5 * 60 * 1000, // 5 minutes
          createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
          responseAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        },
        {
          id: 'sla-2',
          escalationId: 'esc-002',
          escalationTitle: 'API rate limit exceeded',
          priority: 'high',
          status: SLAStatus.IN_PROGRESS,
          responseDeadline: 30 * 60 * 1000, // 30 minutes
          resolutionDeadline: 4 * 60 * 60 * 1000, // 4 hours
          responseTime: undefined,
          createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
        },
        {
          id: 'sla-3',
          escalationId: 'esc-003',
          escalationTitle: 'Payment processing failure',
          priority: 'critical',
          status: SLAStatus.BREACHED,
          responseDeadline: 15 * 60 * 1000,
          resolutionDeadline: 60 * 60 * 1000,
          responseTime: 35 * 60 * 1000, // 35 minutes - BREACHED
          createdAt: new Date(Date.now() - 40 * 60 * 1000), // 40 minutes ago
          responseAt: new Date(Date.now() - 5 * 60 * 1000),
        },
        {
          id: 'sla-4',
          escalationId: 'esc-004',
          escalationTitle: 'User account locked',
          priority: 'medium',
          status: SLAStatus.RESOLVED,
          responseDeadline: 60 * 60 * 1000, // 60 minutes
          resolutionDeadline: 4 * 60 * 60 * 1000, // 4 hours
          responseTime: 12 * 60 * 1000, // 12 minutes
          resolutionTime: 45 * 60 * 1000, // 45 minutes
          createdAt: new Date(Date.now() - 50 * 60 * 1000),
          responseAt: new Date(Date.now() - 38 * 60 * 1000),
          resolvedAt: new Date(Date.now() - 5 * 60 * 1000),
        },
      ];

      // Filter by escalationId if provided
      const filteredSLAs = escalationId
        ? mockSLAs.filter(s => s.escalationId === escalationId)
        : mockSLAs.filter(s => s.status !== SLAStatus.RESOLVED);

      setActiveSLAs(filteredSLAs);

      // Calculate compliance rate
      const total = mockSLAs.length;
      const compliant = mockSLAs.filter(
        s => s.status === SLAStatus.RESOLVED || (s.status === SLAStatus.IN_PROGRESS && !isNearBreach(s))
      ).length;
      setComplianceRate((compliant / total) * 100);

      // Identify breach alerts
      const alerts = filteredSLAs
        .map(sla => {
          const timeSinceCreation = Date.now() - sla.createdAt.getTime();
          const responseBreachTime = sla.responseDeadline;
          const resolutionBreachTime = sla.resolutionDeadline;

          const alerts: SLABreachAlert[] = [];

          // Check response SLA
          if (!sla.responseAt) {
            const minutesUntilResponseBreach = Math.ceil((responseBreachTime - timeSinceCreation) / 1000 / 60);
            if (minutesUntilResponseBreach < 0) {
              alerts.push({
                escalationId: sla.escalationId,
                escalationTitle: sla.escalationTitle,
                priority: sla.priority,
                minutesUntilBreach: 0,
                slaType: 'response',
                breached: true,
              });
            } else if (minutesUntilResponseBreach < 10) {
              alerts.push({
                escalationId: sla.escalationId,
                escalationTitle: sla.escalationTitle,
                priority: sla.priority,
                minutesUntilBreach: minutesUntilResponseBreach,
                slaType: 'response',
                breached: false,
              });
            }
          }

          // Check resolution SLA
          if (sla.status === SLAStatus.IN_PROGRESS) {
            const minutesUntilResolutionBreach = Math.ceil((resolutionBreachTime - timeSinceCreation) / 1000 / 60);
            if (minutesUntilResolutionBreach < 0) {
              alerts.push({
                escalationId: sla.escalationId,
                escalationTitle: sla.escalationTitle,
                priority: sla.priority,
                minutesUntilBreach: 0,
                slaType: 'resolution',
                breached: true,
              });
            } else if (minutesUntilResolutionBreach < 30) {
              alerts.push({
                escalationId: sla.escalationId,
                escalationTitle: sla.escalationTitle,
                priority: sla.priority,
                minutesUntilBreach: minutesUntilResolutionBreach,
                slaType: 'resolution',
                breached: false,
              });
            }
          }

          return alerts;
        })
        .flat();

      setBreachAlerts(alerts);

      // Trigger breach callbacks
      alerts.forEach(alert => {
        if (alert.breached && onBreach) {
          onBreach(alert.escalationId);
        }
      });
    } catch (error) {
      console.error('Error loading SLA data:', error);
      toast.error('Failed to load SLA data');
    } finally {
      setLoading(false);
    }
  };

  const isNearBreach = (sla: SLATracker): boolean => {
    const timeSinceCreation = Date.now() - sla.createdAt.getTime();
    return timeSinceCreation > (sla.resolutionDeadline * 0.8 || sla.responseDeadline * 0.8);
  };

  const formatTimeRemaining = (deadline: number, createdAt: Date): string => {
    const elapsed = Date.now() - createdAt.getTime();
    const remaining = deadline - elapsed;

    if (remaining <= 0) {
      return 'Breached';
    }

    const minutes = Math.floor(remaining / 1000 / 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h ${minutes % 60}m`;
    }

    return `${minutes}m ${seconds}s`;
  };

  const getSLAStatusColor = (status: SLAStatus): string => {
    switch (status) {
      case SLAStatus.BREACHED:
        return 'bg-red-100 border-red-300';
      case SLAStatus.RESOLVED:
        return 'bg-green-100 border-green-300';
      case SLAStatus.FAILED:
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-blue-100 border-blue-300';
    }
  };

  const getSLAStatusIcon = (status: SLAStatus) => {
    switch (status) {
      case SLAStatus.BREACHED:
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case SLAStatus.RESOLVED:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case SLAStatus.FAILED:
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const filteredSLAs = activeSLAs.filter(sla => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'at-risk')
      return breachAlerts.some(alert => alert.escalationId === sla.escalationId && !alert.breached);
    if (selectedFilter === 'breached') return sla.status === SLAStatus.BREACHED;
    return true;
  });

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading SLA data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">SLA Tracking</h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{complianceRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">compliance rate</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{activeSLAs.length}</div>
            <div className="text-xs text-gray-600">Active SLAs</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-600">
              {breachAlerts.filter(a => a.breached).length}
            </div>
            <div className="text-xs text-gray-600">Breached</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-600">
              {breachAlerts.filter(a => !a.breached).length}
            </div>
            <div className="text-xs text-gray-600">At Risk</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">
              {activeSLAs.filter(s => s.status === SLAStatus.RESOLVED).length}
            </div>
            <div className="text-xs text-gray-600">Resolved</div>
          </div>
        </div>
      </div>

      {/* Breach Alerts */}
      {breachAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Immediate Alerts</h3>
          {breachAlerts.map(alert => (
            <div
              key={`${alert.escalationId}-${alert.slaType}`}
              className={`p-4 rounded-lg border-l-4 ${
                alert.breached ? 'border-l-red-600 bg-red-50' : 'border-l-orange-600 bg-orange-50'
              }`}
            >
              <div className="flex items-start gap-3">
                {alert.breached ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getPriorityColor(alert.priority)}`}>
                      {alert.priority.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {alert.slaType === 'response' ? 'RESPONSE SLA' : 'RESOLUTION SLA'}
                    </span>
                  </div>
                  <h4 className={`font-medium ${alert.breached ? 'text-red-900' : 'text-orange-900'}`}>
                    {alert.escalationTitle}
                  </h4>
                  <p className={`text-sm mt-1 ${alert.breached ? 'text-red-700' : 'text-orange-700'}`}>
                    {alert.breached
                      ? 'SLA BREACHED - Immediate action required'
                      : `${alert.minutesUntilBreach} minutes until breach`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'at-risk', 'breached'].map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')} ({filteredSLAs.length})
            </button>
          ))}
        </div>
      </div>

      {/* SLA List */}
      <div className="space-y-3">
        {filteredSLAs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-gray-600">No escalations matching this filter</p>
          </div>
        ) : (
          filteredSLAs.map(sla => (
            <div
              key={sla.id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${getSLAStatusColor(sla.status)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {getSLAStatusIcon(sla.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{sla.escalationTitle}</h4>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getPriorityColor(sla.priority)}`}>
                        {sla.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">ID: {sla.escalationId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-gray-600 uppercase">{sla.status}</div>
                </div>
              </div>

              {/* SLA Deadlines */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-xs text-gray-600 font-medium mb-1">Response SLA</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {sla.responseTime
                        ? `${Math.floor(sla.responseTime / 1000 / 60)}m`
                        : formatTimeRemaining(sla.responseDeadline, sla.createdAt)}
                    </span>
                    <span className="text-xs text-gray-600">{Math.floor(sla.responseDeadline / 1000 / 60)}m SLA</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="text-xs text-gray-600 font-medium mb-1">Resolution SLA</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {sla.resolutionTime
                        ? `${Math.floor(sla.resolutionTime / 1000 / 60)}m`
                        : formatTimeRemaining(sla.resolutionDeadline, sla.createdAt)}
                    </span>
                    <span className="text-xs text-gray-600">{Math.floor(sla.resolutionDeadline / 1000 / 60)}m SLA</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Created: {sla.createdAt.toLocaleString()}</span>
                {sla.responseAt && <span>→ Responded: {sla.responseAt.toLocaleString()}</span>}
                {sla.resolvedAt && <span>→ Resolved: {sla.resolvedAt.toLocaleString()}</span>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700 flex items-start gap-2">
        <TrendingDown className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p>
          SLA compliance is calculated based on response and resolution times. Escalations breaching SLAs trigger
          notifications and escalations to management. Monitor at-risk items closely to prevent breaches.
        </p>
      </div>
    </div>
  );
};

export default SLATrackingComponent;
