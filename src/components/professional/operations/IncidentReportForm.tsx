import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Plus,
  FileText,
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit
} from 'lucide-react';
import { AccessibleButton, AccessibleSelect } from '@/components/accessibility';
import { useOperations } from '@/hooks/useOperations';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';

interface IncidentReportFormProps {
  className?: string;
}

interface IncidentReport {
  id: string;
  title: string;
  description: string;
  incidentType: 'safety' | 'security' | 'environmental' | 'operational' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  reportedBy: string;
  reportedDate: Date;
  incidentDate: Date;
  location: string;
  affectedParties: string[];
  immediateActions: string;
  investigationFindings: string;
  correctiveActions: string;
  preventionMeasures: string;
  projectId?: string;
  attachments?: string[];
}

export const IncidentReportForm: React.FC<IncidentReportFormProps> = ({ className = '' }) => {
  const {
    operations,
    loading,
    error
  } = useOperations();

  const { activityLogger } = useBizHelpIntegration('');

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Mock incident reports - in real implementation, this would come from operations.incidents
  const mockIncidents: IncidentReport[] = [
    {
      id: '1',
      title: 'Minor Equipment Malfunction',
      description: 'Development server experienced temporary outage due to network connectivity issues',
      incidentType: 'operational',
      severity: 'medium',
      status: 'resolved',
      reportedBy: 'System Administrator',
      reportedDate: new Date('2024-01-10'),
      incidentDate: new Date('2024-01-10'),
      location: 'Data Center',
      affectedParties: ['Development Team', 'Operations Team'],
      immediateActions: 'Restarted network equipment and monitored system recovery',
      investigationFindings: 'Network switch firmware needed updating',
      correctiveActions: 'Updated firmware and implemented monitoring alerts',
      preventionMeasures: 'Scheduled regular firmware updates and enhanced monitoring',
      projectId: 'project-1'
    },
    {
      id: '2',
      title: 'Data Backup Failure',
      description: 'Automated backup process failed for three consecutive days',
      incidentType: 'security',
      severity: 'high',
      status: 'investigating',
      reportedBy: 'IT Security Officer',
      reportedDate: new Date('2024-01-15'),
      incidentDate: new Date('2024-01-12'),
      location: 'Backup Server Room',
      affectedParties: ['IT Department', 'Data Protection Team'],
      immediateActions: 'Initiated manual backup procedures and verified data integrity',
      investigationFindings: '',
      correctiveActions: '',
      preventionMeasures: '',
      projectId: 'project-2'
    }
  ];

  const filteredIncidents = mockIncidents.filter(incident => {
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    const matchesType = filterType === 'all' || incident.incidentType === filterType;
    return matchesStatus && matchesType;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-gray-100 text-gray-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'safety': return '🛡️';
      case 'security': return '🔒';
      case 'environmental': return '🌱';
      case 'operational': return '⚙️';
      default: return '📋';
    }
  };

  const handleCreateIncident = async (incidentData: Omit<IncidentReport, 'id' | 'reportedDate'>) => {
    try {
      // Log activity: incident reported
      await activityLogger?.log('incident_reported', {
        incidentTitle: incidentData.title,
        incidentType: incidentData.incidentType,
        severity: incidentData.severity,
        reportedBy: incidentData.reportedBy,
        location: incidentData.location,
        affectedPartiesCount: incidentData.affectedParties.length
      });

      // In real implementation, this would call operations service
      console.log('Creating incident:', incidentData);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create incident:', err);
    }
  };

  const handleUpdateIncident = async (incidentId: string, updates: Partial<IncidentReport>) => {
    try {
      // Log activity: investigation started
      if (updates.status === 'investigating' || updates.investigationFindings) {
        await activityLogger?.log('investigation_started', {
          incidentId,
          incidentTitle: updates.title,
          status: updates.status,
          investigationFindings: updates.investigationFindings
        });
      }

      // In real implementation, this would call operations service
      console.log('Updating incident:', incidentId, updates);
      setSelectedIncident(null);
    } catch (err) {
      console.error('Failed to update incident:', err);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Error loading incident reports: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Incident Reports</h2>
          <p className="text-gray-600">Track and manage safety and operational incidents</p>
        </div>
        <AccessibleButton
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Report Incident
        </AccessibleButton>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-64">
          <AccessibleSelect
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'reported', label: 'Reported' },
              { value: 'investigating', label: 'Investigating' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'closed', label: 'Closed' }
            ]}
          />
        </div>
        <div className="sm:w-64">
          <AccessibleSelect
            label="Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'safety', label: 'Safety' },
              { value: 'security', label: 'Security' },
              { value: 'environmental', label: 'Environmental' },
              { value: 'operational', label: 'Operational' },
              { value: 'other', label: 'Other' }
            ]}
          />
        </div>
      </div>

      {/* Incident Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockIncidents.filter(i => i.severity === 'critical').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">High</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockIncidents.filter(i => i.severity === 'high').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Investigating</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockIncidents.filter(i => i.status === 'investigating').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockIncidents.filter(i => i.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident, index) => {
          const projectName = operations.projects?.find(p => p.id === incident.projectId)?.name || 'Unknown Project';

          return (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(incident.incidentType)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getSeverityColor(incident.severity)}`}>
                      {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(incident.status)}`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{incident.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Reported by: {incident.reportedBy}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        Incident: {incident.incidentDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Location: {incident.location}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 capitalize">{incident.incidentType}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {projectName}
                    </span>
                    <span>
                      Affected: {incident.affectedParties.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <AccessibleButton
                    onClick={() => setSelectedIncident(incident)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <Eye className="h-4 w-4" />
                  </AccessibleButton>
                  <AccessibleButton
                    onClick={() => setSelectedIncident(incident)}
                    className="p-2 text-gray-400 hover:text-green-600"
                  >
                    <Edit className="h-4 w-4" />
                  </AccessibleButton>
                </div>
              </div>

              {incident.immediateActions && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Immediate Actions Taken</h4>
                  <p className="text-yellow-800">{incident.immediateActions}</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filteredIncidents.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No incident reports found</h3>
          <p className="text-gray-600 mb-4">
            {filterStatus !== 'all' || filterType !== 'all'
              ? 'Try adjusting your filters'
              : 'No incidents have been reported yet'}
          </p>
          <AccessibleButton
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Report First Incident
          </AccessibleButton>
        </div>
      )}

      {/* Create Incident Modal */}
      {showCreateForm && (
        <IncidentForm
          onSubmit={handleCreateIncident}
          onCancel={() => setShowCreateForm(false)}
          projects={operations.projects || []}
        />
      )}

      {/* View/Edit Incident Modal */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onUpdate={(updates) => handleUpdateIncident(selectedIncident.id, updates)}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
};

// Incident Form Component
interface IncidentFormProps {
  onSubmit: (data: Omit<IncidentReport, 'id' | 'reportedDate'>) => void;
  onCancel: () => void;
  projects: any[];
}

const IncidentForm: React.FC<IncidentFormProps> = ({ onSubmit, onCancel, projects }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    incidentType: 'operational' as IncidentReport['incidentType'],
    severity: 'medium' as IncidentReport['severity'],
    status: 'reported' as IncidentReport['status'],
    reportedBy: '',
    incidentDate: new Date().toISOString().split('T')[0],
    location: '',
    affectedParties: [] as string[],
    immediateActions: '',
    investigationFindings: '',
    correctiveActions: '',
    preventionMeasures: '',
    projectId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      incidentDate: new Date(formData.incidentDate),
      affectedParties: formData.affectedParties.filter(p => p.trim() !== '')
    });
  };

  const addAffectedParty = () => {
    setFormData(prev => ({
      ...prev,
      affectedParties: [...prev.affectedParties, '']
    }));
  };

  const updateAffectedParty = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      affectedParties: prev.affectedParties.map((party, i) => i === index ? value : party)
    }));
  };

  const removeAffectedParty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      affectedParties: prev.affectedParties.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Report New Incident</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reported By *</label>
              <input
                type="text"
                value={formData.reportedBy}
                onChange={(e) => setFormData(prev => ({ ...prev, reportedBy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.incidentType}
                onChange={(e) => setFormData(prev => ({ ...prev, incidentType: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="safety">Safety</option>
                <option value="security">Security</option>
                <option value="environmental">Environmental</option>
                <option value="operational">Operational</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Incident Date *</label>
              <input
                type="date"
                value={formData.incidentDate}
                onChange={(e) => setFormData(prev => ({ ...prev, incidentDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Where did the incident occur?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="reported">Reported</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Affected Parties</label>
            {formData.affectedParties.map((party, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={party}
                  onChange={(e) => updateAffectedParty(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter affected party"
                />
                <AccessibleButton
                  type="button"
                  onClick={() => removeAffectedParty(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <XCircle className="h-5 w-5" />
                </AccessibleButton>
              </div>
            ))}
            <AccessibleButton
              type="button"
              onClick={addAffectedParty}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Affected Party
            </AccessibleButton>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Immediate Actions Taken</label>
            <textarea
              value={formData.immediateActions}
              onChange={(e) => setFormData(prev => ({ ...prev, immediateActions: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What immediate actions were taken to contain the incident?"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <AccessibleButton type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </AccessibleButton>
            <AccessibleButton type="submit">
              Report Incident
            </AccessibleButton>
          </div>
        </form>
      </div>
    </div>
  );
};

// Incident Detail Modal Component
interface IncidentDetailModalProps {
  incident: IncidentReport;
  onUpdate: (updates: Partial<IncidentReport>) => void;
  onClose: () => void;
}

const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({ incident, onUpdate, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<IncidentReport>>({});

  const handleSave = () => {
    onUpdate(editData);
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Incident Details</h3>
          <div className="flex items-center space-x-2">
            <AccessibleButton
              onClick={() => setEditMode(!editMode)}
              className="p-2 text-gray-400 hover:text-blue-600"
            >
              <Edit className="h-5 w-5" />
            </AccessibleButton>
            <AccessibleButton
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </AccessibleButton>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              {editMode ? (
                <input
                  type="text"
                  value={editData.title || incident.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-900">{incident.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              {editMode ? (
                <select
                  value={editData.status || incident.status}
                  onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="reported">Reported</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              ) : (
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(incident.status)}`}>
                  {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            {editMode ? (
              <textarea
                value={editData.description || incident.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-gray-900">{incident.description}</p>
            )}
          </div>

          {/* Investigation and Actions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Immediate Actions</label>
              {editMode ? (
                <textarea
                  value={editData.immediateActions || incident.immediateActions}
                  onChange={(e) => setEditData(prev => ({ ...prev, immediateActions: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-900">{incident.immediateActions || 'No immediate actions recorded'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investigation Findings</label>
              {editMode ? (
                <textarea
                  value={editData.investigationFindings || incident.investigationFindings}
                  onChange={(e) => setEditData(prev => ({ ...prev, investigationFindings: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-900">{incident.investigationFindings || 'Investigation not yet completed'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Corrective Actions</label>
              {editMode ? (
                <textarea
                  value={editData.correctiveActions || incident.correctiveActions}
                  onChange={(e) => setEditData(prev => ({ ...prev, correctiveActions: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-900">{incident.correctiveActions || 'No corrective actions defined'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prevention Measures</label>
              {editMode ? (
                <textarea
                  value={editData.preventionMeasures || incident.preventionMeasures}
                  onChange={(e) => setEditData(prev => ({ ...prev, preventionMeasures: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              ) : (
                <p className="text-gray-900">{incident.preventionMeasures || 'No prevention measures defined'}</p>
              )}
            </div>
          </div>

          {editMode && (
            <div className="flex justify-end space-x-3 pt-4">
              <AccessibleButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditMode(false);
                  setEditData({});
                }}
              >
                Cancel
              </AccessibleButton>
              <AccessibleButton onClick={handleSave}>
                Save Changes
              </AccessibleButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};