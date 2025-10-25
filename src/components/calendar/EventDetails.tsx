/**
 * @file EventDetails.tsx
 * @description Displays event details with roles, links, poll results, and incident escalation
 * 
 * @author Salatiso Ecosystem - Sprint 3.1 Task 3
 * @created October 25, 2025
 */

import React, { useState } from 'react';
import { EnhancedCalendarEvent, EventStatus, ContextLevel, SeverityLevel, isIncident } from '@/types/calendar';

interface EventDetailsProps {
  event: EnhancedCalendarEvent;
  onEdit?: () => void;
  onEscalate?: (toLevel: ContextLevel) => void;
  onResolve?: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event, onEdit, onEscalate, onResolve }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  const statusColors: Record<EventStatus, string> = {
    [EventStatus.PLANNED]: 'bg-blue-100 text-blue-800',
    [EventStatus.OPEN]: 'bg-yellow-100 text-yellow-800',
    [EventStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-800',
    [EventStatus.RESOLVED]: 'bg-green-100 text-green-800',
    [EventStatus.ARCHIVED]: 'bg-gray-100 text-gray-800'
  };

  const severityColors: Record<SeverityLevel, string> = {
    [SeverityLevel.CRITICAL]: 'bg-red-100 text-red-800 border-l-4 border-red-500',
    [SeverityLevel.HIGH]: 'bg-orange-100 text-orange-800 border-l-4 border-orange-500',
    [SeverityLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500',
    [SeverityLevel.LOW]: 'bg-green-100 text-green-800 border-l-4 border-green-500'
  };

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="border-b">
      <button
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        className="w-full flex justify-between items-center p-4 hover:bg-gray-50 font-semibold text-gray-700"
      >
        {title}
        <span>{expandedSection === id ? '▼' : '▶'}</span>
      </button>
      {expandedSection === id && <div className="px-4 pb-4 bg-gray-50">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[event.status]}`}>
                {event.status.toUpperCase()}
              </span>
              {isIncident(event) && event.incidentData?.severity && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${severityColors[event.incidentData.severity]}`}>
                  {event.incidentData.severity.toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100 font-medium text-sm"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="divide-y">
        {/* Overview */}
        <Section id="overview" title="Overview">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="text-gray-800 mt-1">{event.description || 'No description'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Date & Time</label>
                <p className="text-gray-800 mt-1">{formatDate(event.dateTime)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <p className="text-gray-800 mt-1">{event.location || 'No location'}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <p className="text-gray-800 mt-1">{event.type.toUpperCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <p className="text-gray-800 mt-1">{String(event.category).replace(/_/g, ' ').toUpperCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Context</label>
                <p className="text-gray-800 mt-1">{event.context.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Roles */}
        <Section id="roles" title={`Roles (${event.roles?.length || 0})`}>
          <div className="space-y-3">
            {event.roles && event.roles.length > 0 ? (
              event.roles.map(role => (
                <div key={role.id} className="p-3 bg-white border border-gray-200 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{role.role}</p>
                      <p className="text-sm text-gray-600">User: {role.userId}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      role.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      role.status === 'declined' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {role.status}
                    </span>
                  </div>
                  {role.notes && <p className="text-sm text-gray-600">Notes: {role.notes}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No roles assigned</p>
            )}
          </div>
        </Section>

        {/* Incident Data */}
        {isIncident(event) && event.incidentData && (
          <Section id="incident" title="Incident Details">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Severity</label>
                <p className="text-gray-800 mt-1 font-semibold">{event.incidentData.severity?.toUpperCase()}</p>
              </div>
              {event.incidentData.injuries && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Injuries/Damage</label>
                  <p className="text-gray-800 mt-1">{event.incidentData.injuries}</p>
                </div>
              )}
              {event.incidentData.assignedResponders && event.incidentData.assignedResponders.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Assigned Responders</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {event.incidentData.assignedResponders.map(responder => (
                      <span key={responder} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                        {responder}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Escalation Path */}
        {event.escalationPath && event.escalationPath.length > 0 && (
          <Section id="escalation" title="Escalation History">
            <div className="space-y-3">
              {event.escalationPath.map((entry, idx) => (
                <div key={entry.id || idx} className="p-3 bg-white border border-gray-200 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">
                        {entry.fromLevel?.toUpperCase()} → {entry.toLevel?.toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">By: {entry.escalatedBy}</p>
                      <p className="text-sm text-gray-600">Reason: {entry.reason}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(entry.escalatedAt as any)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Entity Links */}
        {event.customData && Object.keys(event.customData).length > 0 && (
          <Section id="links" title="Linked Items">
            <div className="space-y-4">
              {(['contacts', 'assets', 'projects', 'timelines'] as const).map(key => {
                const items = event.customData?.[key] || [];
                if (items.length === 0) return null;

                return (
                  <div key={key}>
                    <h4 className="font-medium text-gray-700 mb-2 capitalize">{key}</h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item: any, idx: number) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded border border-gray-300"
                        >
                          {item.entityId} ({item.linkType})
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Metadata */}
        <Section id="metadata" title="Metadata">
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2">
              <div>
                <label className="text-gray-600 font-medium">Created</label>
                <p className="text-gray-800">{formatDate(event.createdAt)}</p>
              </div>
              <div>
                <label className="text-gray-600 font-medium">By</label>
                <p className="text-gray-800">{event.createdBy}</p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <label className="text-gray-600 font-medium">Updated</label>
                <p className="text-gray-800">{formatDate(event.updatedAt)}</p>
              </div>
              <div>
                <label className="text-gray-600 font-medium">By</label>
                <p className="text-gray-800">{event.lastModifiedBy}</p>
              </div>
            </div>
            {event.resolvedAt && (
              <div className="grid grid-cols-2">
                <div>
                  <label className="text-gray-600 font-medium">Resolved</label>
                  <p className="text-gray-800">{formatDate(event.resolvedAt)}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-medium">By</label>
                  <p className="text-gray-800">{event.resolvedBy}</p>
                </div>
              </div>
            )}
          </div>
        </Section>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 border-t flex gap-2 justify-end">
        {isIncident(event) && event.status !== EventStatus.RESOLVED && (
          <>
            <button
              onClick={() => onEscalate?.(ContextLevel.FAMILY)}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 font-medium text-sm"
            >
              Escalate
            </button>
            <button
              onClick={onResolve}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm"
            >
              Resolve
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
