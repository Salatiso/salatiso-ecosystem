import React, { useState, useMemo } from 'react';
import {
  Info,
  MoreVertical,
  Search,
  RefreshCw,
  Download,
  Eye,
  Edit2,
  X,
  AlertCircle,
  Loader,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useIncidentDashboard } from '@/hooks/useIncidentDashboard';
import { useEscalation } from '@/hooks/useEscalation';
import {
  EscalationLevel,
  EscalationStatus,
  SeverityLevel,
  EscalationContext,
} from '@/types/escalation';

interface FilterOptions {
  status?: EscalationStatus;
  severity?: SeverityLevel;
  context?: EscalationContext;
  level?: EscalationLevel;
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface IncidentDashboardProps {
  onIncidentSelect?: (escalationId: string) => void;
  compact?: boolean;
  maxRows?: number;
}

const getSeverityColor = (severity: SeverityLevel): string => {
  const colors: Record<SeverityLevel, string> = {
    [SeverityLevel.CRITICAL]: 'bg-red-100 border-red-300 text-red-900',
    [SeverityLevel.HIGH]: 'bg-orange-100 border-orange-300 text-orange-900',
    [SeverityLevel.MEDIUM]: 'bg-yellow-100 border-yellow-300 text-yellow-900',
    [SeverityLevel.LOW]: 'bg-green-100 border-green-300 text-green-900',
  };
  return colors[severity] || 'bg-gray-100 border-gray-300 text-gray-900';
};

const getSeverityBgColor = (severity: SeverityLevel): string => {
  const colors: Record<SeverityLevel, string> = {
    [SeverityLevel.CRITICAL]: 'hover:bg-red-50',
    [SeverityLevel.HIGH]: 'hover:bg-orange-50',
    [SeverityLevel.MEDIUM]: 'hover:bg-yellow-50',
    [SeverityLevel.LOW]: 'hover:bg-green-50',
  };
  return colors[severity] || 'hover:bg-gray-50';
};

const getStatusColor = (status: EscalationStatus): string => {
  const colors: Record<EscalationStatus, string> = {
    [EscalationStatus.OPEN]: 'bg-blue-100 text-blue-900',
    [EscalationStatus.ESCALATED]: 'bg-red-100 text-red-900',
    [EscalationStatus.IN_PROGRESS]: 'bg-orange-100 text-orange-900',
    [EscalationStatus.AWAITING_RESPONSE]: 'bg-cyan-100 text-cyan-900',
    [EscalationStatus.ON_HOLD]: 'bg-purple-100 text-purple-900',
    [EscalationStatus.RESOLVED]: 'bg-green-100 text-green-900',
    [EscalationStatus.ARCHIVED]: 'bg-gray-100 text-gray-900',
    [EscalationStatus.CANCELLED]: 'bg-slate-100 text-slate-900',
  };
  return colors[status] || 'bg-gray-100 text-gray-900';
};

const getLevelColor = (level: EscalationLevel): string => {
  const colors: Record<EscalationLevel, string> = {
    [EscalationLevel.INDIVIDUAL]: 'bg-green-100 text-green-900',
    [EscalationLevel.FAMILY]: 'bg-blue-100 text-blue-900',
    [EscalationLevel.COMMUNITY]: 'bg-orange-100 text-orange-900',
    [EscalationLevel.PROFESSIONAL]: 'bg-red-100 text-red-900',
  };
  return colors[level] || 'bg-gray-100 text-gray-900';
};

const formatDate = (date: Date | number): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

interface DetailDialogProps {
  open: boolean;
  escalationId: string | null;
  onClose: () => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ open, escalationId, onClose }) => {
  const { escalation, isLoading, error } = useEscalation(escalationId || '');

  if (!open || !escalationId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Incident Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader className="animate-spin text-blue-600" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {escalation && (
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-gray-700">ID</label>
                <p className="text-gray-600 break-all text-sm">{escalation.id}</p>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Context</label>
                <p className="text-gray-600">{escalation.context}</p>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Severity</label>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getSeverityColor(escalation.severity)}`}>
                  {escalation.severity}
                </span>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Level</label>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getLevelColor(escalation.currentLevel)}`}>
                  {escalation.currentLevel}
                </span>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Status</label>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusColor(escalation.status)}`}>
                  {escalation.status}
                </span>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Created</label>
                <p className="text-gray-600">{formatDate(escalation.createdAt)}</p>
              </div>

              {escalation.description && (
                <div>
                  <label className="font-semibold text-gray-700">Description</label>
                  <p className="text-gray-600">{escalation.description}</p>
                </div>
              )}

              {escalation.responders && escalation.responders.length > 0 && (
                <div>
                  <label className="font-semibold text-gray-700">Responders</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {escalation.responders.map((r) => (
                      <span
                        key={r.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
                      >
                        {r.userId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const IncidentDashboard: React.FC<IncidentDashboardProps> = ({
  onIncidentSelect,
  compact = false,
  maxRows = 50,
}) => {
  const {
    incidents,
    metrics,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalIncidents,
    hasMore,
    nextPage,
    previousPage,
    criticalCount,
    highCount,
    openCount,
    averageResolutionTime,
  } = useIncidentDashboard();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({});
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        incident.id.toLowerCase().includes(searchLower) ||
        incident.context.toLowerCase().includes(searchLower) ||
        incident.title?.toLowerCase().includes(searchLower) ||
        incident.description?.toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  }, [incidents, searchTerm]);

  const displayIncidents = compact ? filteredIncidents.slice(0, maxRows) : filteredIncidents;

  const handleViewDetails = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
    setDetailDialogOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start">
        <AlertCircle className="text-red-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <p className="text-red-900 font-semibold">Failed to load incidents</p>
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Metrics Cards */}
      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Critical Issues</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{criticalCount}</p>
              </div>
              <AlertCircle className="text-red-300" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">High Priority</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{highCount}</p>
              </div>
              <AlertCircle className="text-orange-300" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Open Incidents</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{openCount}</p>
              </div>
              <Info className="text-blue-300" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Resolution</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{averageResolutionTime}</p>
              </div>
              <Info className="text-green-300" size={32} />
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex gap-2 flex-wrap items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`px-4 py-2 rounded font-medium transition ${
              filterOpen
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Filters
          </button>

          <button
            onClick={() => setSelectedFilters({})}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded font-medium transition flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Reset
          </button>

          {!compact && (
            <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded font-medium transition flex items-center gap-2">
              <Download size={18} />
              Export
            </button>
          )}
        </div>

        {/* Filters */}
        {filterOpen && (
          <div className="flex flex-wrap gap-2">
            {Object.values(EscalationStatus).map((status) => (
              <button
                key={status}
                onClick={() =>
                  setSelectedFilters({
                    ...selectedFilters,
                    status: selectedFilters.status === status ? undefined : status,
                  })
                }
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  selectedFilters.status === status
                    ? getStatusColor(status)
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}

        {/* Active Filters Display */}
        {Object.keys(selectedFilters || {}).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedFilters.status && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm">
                <span>Status: {selectedFilters.status}</span>
                <button
                  onClick={() => setSelectedFilters({ ...selectedFilters, status: undefined })}
                  className="hover:opacity-70"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {selectedFilters.severity && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm">
                <span>Severity: {selectedFilters.severity}</span>
                <button
                  onClick={() => setSelectedFilters({ ...selectedFilters, severity: undefined })}
                  className="hover:opacity-70"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading && (
          <div className="h-1 bg-gradient-to-r from-blue-400 to-transparent animate-pulse"></div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                {!compact && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Context
                  </th>
                )}
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                {!compact && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                )}
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading && !displayIncidents.length ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    {!compact && (
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    {!compact && (
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : displayIncidents.length === 0 ? (
                <tr>
                  <td
                    colSpan={compact ? 5 : 7}
                    className="px-6 py-8 text-center text-gray-500 font-medium"
                  >
                    No incidents found
                  </td>
                </tr>
              ) : (
                displayIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    className={`${getSeverityBgColor(incident.severity)} ${
                      incident.status === EscalationStatus.ARCHIVED ? 'opacity-60' : ''
                    } transition`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <span title={incident.id} className="text-sm">
                        {incident.id.substring(0, 8)}...
                      </span>
                    </td>

                    {!compact && (
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="inline-block px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {incident.context}
                        </span>
                      </td>
                    )}

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1.5 rounded text-xs font-semibold ${getSeverityColor(
                          incident.severity
                        )}`}
                      >
                        {incident.severity}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1.5 rounded text-xs font-semibold ${getLevelColor(
                          incident.currentLevel
                        )}`}
                      >
                        {incident.currentLevel}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1.5 rounded text-xs font-semibold ${getStatusColor(
                          incident.status
                        )}`}
                      >
                        {incident.status}
                      </span>
                    </td>

                    {!compact && (
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(incident.createdAt)}
                      </td>
                    )}

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewDetails(incident.id)}
                        className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!compact && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {displayIncidents.length} of {totalIncidents} incidents (Page {currentPage})
          </p>
          <div className="flex gap-2">
            <button
              onClick={previousPage}
              disabled={currentPage === 1 || isLoading}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={!hasMore || isLoading}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <DetailDialog
        open={detailDialogOpen}
        escalationId={selectedIncidentId}
        onClose={() => setDetailDialogOpen(false)}
      />
    </div>
  );
};

export default IncidentDashboard;
