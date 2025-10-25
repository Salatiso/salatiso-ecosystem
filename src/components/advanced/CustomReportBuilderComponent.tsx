import React, { useState } from 'react';
import { BarChart3, Calendar, Settings, Plus, Trash2, Play, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ReportTemplate {
  id: string;
  name: string;
  type: 'timeline' | 'summary' | 'detailed' | 'custom';
  fields: string[];
  dateRange: { start: Date; end: Date };
  schedule?: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
  lastGenerated?: Date;
}

interface SavedReport {
  id: string;
  templateName: string;
  generatedAt: Date;
  recordCount: number;
  fileSize: string;
}

const CustomReportBuilderComponent: React.FC = () => {
  const [reportType, setReportType] = useState<'timeline' | 'summary' | 'detailed' | 'custom'>('summary');
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(['id', 'title', 'priority', 'status', 'assignedTo', 'createdAt'])
  );
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });
  const [reportName, setReportName] = useState('');
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekly' | 'monthly' | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<SavedReport | null>(null);

  const [savedTemplates, setSavedTemplates] = useState<ReportTemplate[]>([
    {
      id: 'template-1',
      name: 'Weekly Summary',
      type: 'summary',
      fields: ['id', 'title', 'priority', 'status', 'assignedTo'],
      dateRange: {
        start: new Date(new Date().setDate(new Date().getDate() - 7)),
        end: new Date(),
      },
      schedule: 'weekly',
      createdAt: new Date('2025-10-15'),
      lastGenerated: new Date('2025-10-22'),
    },
    {
      id: 'template-2',
      name: 'Monthly Detailed Report',
      type: 'detailed',
      fields: ['id', 'title', 'description', 'priority', 'status', 'assignedTo', 'createdAt', 'updatedAt', 'timeline'],
      dateRange: {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date(),
      },
      schedule: 'monthly',
      createdAt: new Date('2025-10-10'),
      lastGenerated: new Date('2025-10-22'),
    },
  ]);

  const [reportHistory, setReportHistory] = useState<SavedReport[]>([
    {
      id: 'report-1',
      templateName: 'Weekly Summary',
      generatedAt: new Date('2025-10-22T10:30:00'),
      recordCount: 12,
      fileSize: '145 KB',
    },
    {
      id: 'report-2',
      templateName: 'Monthly Detailed Report',
      generatedAt: new Date('2025-10-22T09:00:00'),
      recordCount: 45,
      fileSize: '520 KB',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'builder' | 'templates' | 'history'>('builder');

  const allAvailableFields = [
    { id: 'id', label: 'Escalation ID' },
    { id: 'title', label: 'Title' },
    { id: 'description', label: 'Description' },
    { id: 'priority', label: 'Priority' },
    { id: 'status', label: 'Status' },
    { id: 'assignedTo', label: 'Assigned To' },
    { id: 'createdAt', label: 'Created Date' },
    { id: 'updatedAt', label: 'Updated Date' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'slaStatus', label: 'SLA Status' },
    { id: 'resolutionTime', label: 'Resolution Time' },
  ];

  const reportTypeDescriptions = {
    timeline: 'Show escalation timeline with all events and status changes',
    summary: 'High-level overview with key metrics and statistics',
    detailed: 'Complete records with all available fields',
    custom: 'Select specific fields for your custom report',
  };

  const handleToggleField = (fieldId: string) => {
    const newFields = new Set(selectedFields);
    if (newFields.has(fieldId)) {
      newFields.delete(fieldId);
    } else {
      newFields.add(fieldId);
    }
    setSelectedFields(newFields);
  };

  const handleSelectAllFields = () => {
    if (selectedFields.size === allAvailableFields.length) {
      setSelectedFields(new Set());
    } else {
      setSelectedFields(new Set(allAvailableFields.map(f => f.id)));
    }
  };

  const handleGenerateReport = async () => {
    if (!reportName.trim()) return;

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockReport: SavedReport = {
        id: `report-${Date.now()}`,
        templateName: reportName,
        generatedAt: new Date(),
        recordCount: Math.floor(Math.random() * 50) + 10,
        fileSize: `${Math.floor(Math.random() * 400) + 100} KB`,
      };

      setGeneratedReport(mockReport);
      setReportHistory(prev => [mockReport, ...prev]);

      setTimeout(() => {
        setGeneratedReport(null);
        setReportName('');
      }, 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTemplate = () => {
    if (!reportName.trim()) return;

    const newTemplate: ReportTemplate = {
      id: `template-${Date.now()}`,
      name: reportName,
      type: reportType,
      fields: Array.from(selectedFields),
      dateRange,
      schedule: scheduleType || undefined,
      createdAt: new Date(),
    };

    setSavedTemplates(prev => [newTemplate, ...prev]);
    setReportName('');
    setScheduleType(null);
  };

  const handleLoadTemplate = (template: ReportTemplate) => {
    setReportType(template.type);
    setSelectedFields(new Set(template.fields));
    setDateRange(template.dateRange);
    setScheduleType(template.schedule || null);
  };

  const handleDeleteTemplate = (id: string) => {
    setSavedTemplates(prev => prev.filter(t => t.id !== id));
  };

  const applyPreset = (preset: 'timeline' | 'summary' | 'detailed' | 'custom') => {
    setReportType(preset);
    if (preset === 'timeline') {
      setSelectedFields(new Set(['id', 'title', 'priority', 'status', 'timeline']));
    } else if (preset === 'summary') {
      setSelectedFields(new Set(['id', 'title', 'priority', 'status', 'assignedTo']));
    } else if (preset === 'detailed') {
      setSelectedFields(new Set(['id', 'title', 'description', 'priority', 'status', 'assignedTo', 'createdAt', 'updatedAt']));
    } else if (preset === 'custom') {
      // Custom preset - keep current field selection or default to empty
      setSelectedFields(new Set(['id', 'title', 'priority', 'status']));
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Custom Report Builder</h2>
            <p className="text-sm text-gray-600">Create and schedule custom escalation reports</p>
          </div>
        </div>
      </div>

      {/* Generation Success */}
      {generatedReport && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800">Report Generated Successfully</p>
            <p className="text-sm text-green-700">
              {generatedReport.recordCount} records ({generatedReport.fileSize}) • {format(generatedReport.generatedAt, 'MMM dd, HH:mm')}
            </p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        {(['builder', 'templates', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-amber-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'templates' && ` (${savedTemplates.length})`}
            {tab === 'history' && ` (${reportHistory.length})`}
          </button>
        ))}
      </div>

      {/* Report Builder Tab */}
      {activeTab === 'builder' && (
        <div className="space-y-6">
          {/* Report Name */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Report Name</label>
            <input
              type="text"
              placeholder="Enter report name..."
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Report Type */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-800">Report Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {(['timeline', 'summary', 'detailed', 'custom'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => applyPreset(type)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    reportType === type
                      ? 'bg-amber-100 border-amber-500'
                      : 'bg-white border-gray-300 hover:border-amber-300'
                  }`}
                >
                  <p className="font-medium text-gray-800 capitalize">{type}</p>
                  <p className="text-xs text-gray-600 mt-1">{reportTypeDescriptions[type]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Field Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Select Fields</h3>
              <button
                onClick={handleSelectAllFields}
                className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
              >
                {selectedFields.size === allAvailableFields.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {allAvailableFields.map(field => (
                <label key={field.id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedFields.has(field.id)}
                    onChange={() => handleToggleField(field.id)}
                    className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">{field.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-600">
              {selectedFields.size} field{selectedFields.size !== 1 ? 's' : ''} selected
            </p>
          </div>

          {/* Date Range */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Date Range</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-2">From</label>
                <input
                  type="date"
                  value={format(dateRange.start, 'yyyy-MM-dd')}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-2">To</label>
                <input
                  type="date"
                  value={format(dateRange.end, 'yyyy-MM-dd')}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Schedule (Optional)</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {([null, 'daily', 'weekly', 'monthly'] as const).map(schedule => (
                <button
                  key={schedule || 'none'}
                  onClick={() => setScheduleType(schedule)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    scheduleType === schedule
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {schedule ? schedule.charAt(0).toUpperCase() + schedule.slice(1) : 'None'}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating || !reportName.trim() || selectedFields.size === 0}
              className={`py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
                isGenerating || !reportName.trim() || selectedFields.size === 0
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
            <button
              onClick={handleSaveTemplate}
              disabled={!reportName.trim() || selectedFields.size === 0}
              className={`py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
                !reportName.trim() || selectedFields.size === 0
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Save as Template</span>
            </button>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-3">
          {savedTemplates.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
              <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No saved templates yet</p>
            </div>
          ) : (
            savedTemplates.map(template => (
              <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{template.name}</p>
                    <p className="text-xs text-gray-600 capitalize">
                      Type: {template.type} • Fields: {template.fields.length} • {template.schedule ? `Scheduled: ${template.schedule}` : 'No schedule'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {template.lastGenerated ? `Last: ${format(template.lastGenerated, 'MMM dd')}` : 'Never'}
                  </span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => handleLoadTemplate(template)}
                    className="flex-1 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded text-sm font-medium"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {reportHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No report history yet</p>
            </div>
          ) : (
            reportHistory.map(report => (
              <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{report.templateName}</p>
                    <p className="text-xs text-gray-600">
                      {report.recordCount} records • {report.fileSize}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{format(report.generatedAt, 'MMM dd, HH:mm')}</span>
                </div>
                <button className="w-full px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded text-sm font-medium">
                  Download
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomReportBuilderComponent;
