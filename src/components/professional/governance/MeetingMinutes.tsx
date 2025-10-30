import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Plus,
  Edit3,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Download
} from 'lucide-react';
import { AccessibleInput, AccessibleSelect } from '@/components/accessibility';
import { useGovernance } from '@/hooks/useGovernance';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import type { MeetingMinutes } from '@/contexts/professional/ProfessionalContext';

interface MeetingMinutesProps {
  className?: string;
}

export const MeetingMinutesComponent: React.FC<MeetingMinutesProps> = ({ className }) => {
  const {
    governance,
    loading,
    error,
    loadMeetingMinutes,
    addMeetingMinutes,
    updateMeetingMinutes
  } = useGovernance();

  // Get activity logger
  const { activityLogger } = useBizHelpIntegration('');

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MeetingMinutes>>({
    title: '',
    date: new Date(),
    attendees: [],
    agenda: [],
    decisions: [],
    actionItems: [],
    status: 'draft'
  });

  useEffect(() => {
    loadMeetingMinutes();
  }, [loadMeetingMinutes]);

  const meetingMinutes = governance?.meetings || [];

  const handleInputChange = (field: keyof MeetingMinutes, value: any) => {
    if (field === 'attendees' || field === 'agenda' || field === 'decisions' || field === 'actionItems') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAddAttendee = () => {
    setFormData(prev => ({
      ...prev,
      attendees: [...(prev.attendees || []), '']
    }));
  };

  const handleUpdateAttendee = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees?.map((attendee, i) => i === index ? value : attendee) || []
    }));
  };

  const handleRemoveAttendee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddAgendaItem = () => {
    setFormData(prev => ({
      ...prev,
      agenda: [...(prev.agenda || []), { item: '', discussion: '', status: 'pending' }]
    }));
  };

  const handleUpdateAgendaItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda?.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ) || []
    }));
  };

  const handleRemoveAgendaItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddDecision = () => {
    setFormData(prev => ({
      ...prev,
      decisions: [...(prev.decisions || []), { decision: '', rationale: '' }]
    }));
  };

  const handleUpdateDecision = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      decisions: prev.decisions?.map((decision, i) =>
        i === index ? { ...decision, [field]: value } : decision
      ) || []
    }));
  };

  const handleRemoveDecision = (index: number) => {
    setFormData(prev => ({
      ...prev,
      decisions: prev.decisions?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddActionItem = () => {
    setFormData(prev => ({
      ...prev,
      actionItems: [...(prev.actionItems || []), { item: '', assignee: '', dueDate: new Date(), status: 'pending' }]
    }));
  };

  const handleUpdateActionItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      actionItems: prev.actionItems?.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ) || []
    }));
  };

  const handleRemoveActionItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actionItems: prev.actionItems?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.date) {
      return;
    }

    try {
      await addMeetingMinutes({
        title: formData.title,
        date: formData.date,
        attendees: formData.attendees || [],
        agenda: formData.agenda || [],
        decisions: formData.decisions || [],
        actionItems: formData.actionItems || [],
        status: formData.status || 'draft'
      });

      // Log activity: meeting minutes recorded
      await activityLogger?.log('meeting_minutes_recorded', {
        meetingTitle: formData.title,
        meetingDate: formData.date,
        attendeesCount: formData.attendees?.length || 0,
        agendaItems: formData.agenda?.length || 0,
        decisionsCount: formData.decisions?.length || 0,
        actionItemsCount: formData.actionItems?.length || 0,
        status: formData.status || 'draft'
      });

      setFormData({
        title: '',
        date: new Date(),
        attendees: [],
        agenda: [],
        decisions: [],
        actionItems: [],
        status: 'draft'
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding meeting minutes:', error);
    }
  };

  const handleEdit = (meeting: MeetingMinutes) => {
    setFormData(meeting);
    setEditingId(meeting.id);
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.title || !formData.date) {
      return;
    }

    try {
      await updateMeetingMinutes(editingId, {
        title: formData.title,
        date: formData.date,
        attendees: formData.attendees || [],
        agenda: formData.agenda || [],
        decisions: formData.decisions || [],
        actionItems: formData.actionItems || [],
        status: formData.status || 'draft'
      });

      // Log activity: meeting minutes updated
      await activityLogger?.log('meeting_minutes_updated', {
        meetingTitle: formData.title,
        meetingDate: formData.date,
        attendeesCount: formData.attendees?.length || 0,
        agendaItems: formData.agenda?.length || 0,
        decisionsCount: formData.decisions?.length || 0,
        actionItemsCount: formData.actionItems?.length || 0,
        status: formData.status || 'draft'
      });

      setFormData({
        title: '',
        date: new Date(),
        attendees: [],
        agenda: [],
        decisions: [],
        actionItems: [],
        status: 'draft'
      });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating meeting minutes:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      date: new Date(),
      attendees: [],
      agenda: [],
      decisions: [],
      actionItems: [],
      status: 'draft'
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'final':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'draft':
        return <Edit3 className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'final':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-white rounded-lg shadow p-6 ${className}`}
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading meeting minutes...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-white rounded-lg shadow p-6 ${className}`}
      >
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Meeting Minutes</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Meeting Minutes</h2>
              <p className="text-sm text-gray-600">Record and manage board meeting minutes and decisions</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4" />
            Add Meeting Minutes
          </button>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isAdding ? 'Add Meeting Minutes' : 'Edit Meeting Minutes'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <AccessibleInput
                label="Meeting Title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Board Meeting - Q1 2025"
                className="w-full"
              />

              <AccessibleInput
                label="Meeting Date"
                type="date"
                value={formData.date ? formData.date.toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('date', new Date(e.target.value))}
                className="w-full"
              />

              <AccessibleSelect
                label="Status"
                value={formData.status || 'draft'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'pending', label: 'Pending Approval' },
                  { value: 'final', label: 'Final' }
                ]}
                className="w-full"
              />
            </div>

            {/* Attendees */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-900">Attendees</h4>
                <button
                  onClick={handleAddAttendee}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  + Add Attendee
                </button>
              </div>
              <div className="space-y-2">
                {formData.attendees?.map((attendee, index) => (
                  <div key={index} className="flex gap-2">
                    <AccessibleInput
                      value={attendee}
                      onChange={(e) => handleUpdateAttendee(index, e.target.value)}
                      placeholder="Attendee name"
                      className="flex-1"
                    />
                    <button
                      onClick={() => handleRemoveAttendee(index)}
                      className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Agenda Items */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-900">Agenda Items</h4>
                <button
                  onClick={handleAddAgendaItem}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-3">
                {formData.agenda?.map((item, index) => (
                  <div key={index} className="p-3 bg-white rounded-md border">
                    <div className="flex justify-between items-start mb-2">
                      <AccessibleInput
                        value={item.item}
                        onChange={(e) => handleUpdateAgendaItem(index, 'item', e.target.value)}
                        placeholder="Agenda item"
                        className="flex-1 mr-2"
                      />
                      <button
                        onClick={() => handleRemoveAgendaItem(index)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        ×
                      </button>
                    </div>
                    <AccessibleInput
                      value={item.discussion || ''}
                      onChange={(e) => handleUpdateAgendaItem(index, 'discussion', e.target.value)}
                      placeholder="Discussion notes"
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Decisions */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-900">Decisions Made</h4>
                <button
                  onClick={handleAddDecision}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  + Add Decision
                </button>
              </div>
              <div className="space-y-3">
                {formData.decisions?.map((decision, index) => (
                  <div key={index} className="p-3 bg-white rounded-md border">
                    <div className="flex justify-between items-start mb-2">
                      <AccessibleInput
                        value={decision.decision}
                        onChange={(e) => handleUpdateDecision(index, 'decision', e.target.value)}
                        placeholder="Decision made"
                        className="flex-1 mr-2"
                      />
                      <button
                        onClick={() => handleRemoveDecision(index)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        ×
                      </button>
                    </div>
                    <AccessibleInput
                      value={decision.rationale || ''}
                      onChange={(e) => handleUpdateDecision(index, 'rationale', e.target.value)}
                      placeholder="Rationale"
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-900">Action Items</h4>
                <button
                  onClick={handleAddActionItem}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  + Add Action Item
                </button>
              </div>
              <div className="space-y-3">
                {formData.actionItems?.map((actionItem, index) => (
                  <div key={index} className="p-3 bg-white rounded-md border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                      <AccessibleInput
                        value={actionItem.item}
                        onChange={(e) => handleUpdateActionItem(index, 'item', e.target.value)}
                        placeholder="Action item"
                        className="w-full"
                      />
                      <AccessibleInput
                        value={actionItem.assignee || ''}
                        onChange={(e) => handleUpdateActionItem(index, 'assignee', e.target.value)}
                        placeholder="Assignee"
                        className="w-full"
                      />
                      <AccessibleInput
                        type="date"
                        value={actionItem.dueDate ? actionItem.dueDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => handleUpdateActionItem(index, 'dueDate', new Date(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <AccessibleSelect
                        value={actionItem.status || 'pending'}
                        onChange={(e) => handleUpdateActionItem(index, 'status', e.target.value)}
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'in-progress', label: 'In Progress' },
                          { value: 'completed', label: 'Completed' }
                        ]}
                        className="w-40"
                      />
                      <button
                        onClick={() => handleRemoveActionItem(index)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={isAdding ? handleAdd : handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isAdding ? 'Add Meeting Minutes' : 'Update Meeting Minutes'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Meeting Minutes List */}
        <div className="space-y-4">
          {meetingMinutes.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Meeting Minutes</h3>
              <p className="text-gray-500 mb-4">Start recording your board meeting minutes and decisions</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add First Meeting
              </button>
            </div>
          ) : (
            meetingMinutes.map((meeting) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(meeting.status)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {meeting.date.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {meeting.attendees.length} attendees
                        </div>
                      </div>

                      {meeting.agenda.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Agenda Items</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {meeting.agenda.slice(0, 3).map((item, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-gray-400">•</span>
                                <span className="flex-1">{item.item}</span>
                              </li>
                            ))}
                            {meeting.agenda.length > 3 && (
                              <li className="text-gray-400">... and {meeting.agenda.length - 3} more items</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {meeting.decisions.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Key Decisions</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {meeting.decisions.slice(0, 2).map((decision, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-gray-400">•</span>
                                <span className="flex-1">{decision.decision}</span>
                              </li>
                            ))}
                            {meeting.decisions.length > 2 && (
                              <li className="text-gray-400">... and {meeting.decisions.length - 2} more decisions</li>
                            )}
                          </ul>
                        </div>
                      )}

                      {meeting.actionItems.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Action Items</h5>
                          <div className="flex flex-wrap gap-2">
                            {meeting.actionItems.slice(0, 3).map((item, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 text-xs rounded-full ${
                                  item.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : item.status === 'in-progress'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {item.item}
                              </span>
                            ))}
                            {meeting.actionItems.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                +{meeting.actionItems.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(meeting)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit meeting minutes"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Download minutes"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};