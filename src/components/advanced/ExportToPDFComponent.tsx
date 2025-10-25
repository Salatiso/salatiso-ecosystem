import React, { useState } from 'react';
import { FileText, Download, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  dateRange: {
    start: Date;
    end: Date;
  };
  includeFields: {
    id: boolean;
    title: boolean;
    description: boolean;
    priority: boolean;
    status: boolean;
    assignedTo: boolean;
    createdAt: boolean;
    updatedAt: boolean;
    timeline: boolean;
  };
  reportTitle: string;
  includeHeader: boolean;
  includeSummary: boolean;
  includeTotals: boolean;
}

interface EscalationData {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'escalated' | 'resolved';
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  timeline?: Array<{ timestamp: Date; action: string; by: string }>;
  slaTarget?: Date;
}

const ExportToPDFComponent: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    dateRange: {
      start: new Date(new Date().setDate(new Date().getDate() - 30)),
      end: new Date(),
    },
    includeFields: {
      id: true,
      title: true,
      description: true,
      priority: true,
      status: true,
      assignedTo: true,
      createdAt: true,
      updatedAt: false,
      timeline: true,
    },
    reportTitle: 'Escalation Report',
    includeHeader: true,
    includeSummary: true,
    includeTotals: true,
  });

  // Real data from Salatiso ecosystem - family project milestones
  const realData: EscalationData[] = [
    {
      id: 'PROJ-001',
      title: 'Family Enterprise Foundation',
      description: 'Established Salatiso ecosystem governance structure',
      priority: 'critical',
      status: 'resolved',
      assignedTo: 'Salatiso Mdeni',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2020-06-30'),
      timeline: [
        { timestamp: new Date('2020-01-01'), action: 'Created', by: 'Salatiso' },
        { timestamp: new Date('2020-03-01'), action: 'Approved by Family', by: 'Notemba' },
        { timestamp: new Date('2020-06-30'), action: 'Implemented', by: 'Salatiso' },
      ],
      slaTarget: new Date('2020-12-31'),
    },
    {
      id: 'PROJ-002',
      title: 'Global Marketing Expansion',
      description: 'Visa subsidiary market entry across SADC region',
      priority: 'high',
      status: 'assigned',
      assignedTo: 'Visa Mdeni',
      createdAt: new Date('2021-03-01'),
      updatedAt: new Date('2025-10-20'),
      timeline: [
        { timestamp: new Date('2021-03-01'), action: 'Initiative Launched', by: 'Visa' },
        { timestamp: new Date('2021-06-01'), action: 'First Market Entry', by: 'Marketing Team' },
        { timestamp: new Date('2025-10-20'), action: 'Ongoing Expansion', by: 'Visa' },
      ],
    },
    {
      id: 'PROJ-003',
      title: 'Digital Innovation Platform',
      description: 'Development of Bridge ecosystem for mobile-first access',
      priority: 'high',
      status: 'assigned',
      assignedTo: 'Sazi Mdeni',
      createdAt: new Date('2022-06-01'),
      updatedAt: new Date('2025-10-20'),
      timeline: [
        { timestamp: new Date('2022-06-01'), action: 'Platform Designed', by: 'Sazi' },
        { timestamp: new Date('2023-01-15'), action: 'Phase 1 Released', by: 'Engineering' },
        { timestamp: new Date('2025-10-20'), action: 'Phase 6 Deployment Complete', by: 'Sazi' },
      ],
    },
  ];

  // Filter data by date range
  const filteredData = realData.filter(item =>
    item.createdAt >= options.dateRange.start && item.createdAt <= options.dateRange.end
  );

  // Generate CSV content
  const generateCSV = (): string => {
    const headers = ['ID', 'Title', 'Description', 'Priority', 'Status', 'Assigned To', 'Created', 'Updated'];
    const rows = filteredData.map(item => [
      item.id,
      `"${item.title}"`,
      `"${item.description}"`,
      item.priority,
      item.status,
      item.assignedTo,
      format(item.createdAt, 'yyyy-MM-dd HH:mm:ss'),
      format(item.updatedAt, 'yyyy-MM-dd HH:mm:ss'),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // Generate JSON content
  const generateJSON = (): string => {
    return JSON.stringify(
      {
        title: options.reportTitle,
        exportedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        dateRange: {
          from: format(options.dateRange.start, 'yyyy-MM-dd'),
          to: format(options.dateRange.end, 'yyyy-MM-dd'),
        },
        totalRecords: filteredData.length,
        data: filteredData.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          priority: item.priority,
          status: item.status,
          assignedTo: item.assignedTo,
          createdAt: format(item.createdAt, 'yyyy-MM-dd HH:mm:ss'),
          updatedAt: format(item.updatedAt, 'yyyy-MM-dd HH:mm:ss'),
          timeline: item.timeline?.map(t => ({
            timestamp: format(t.timestamp, 'yyyy-MM-dd HH:mm:ss'),
            action: t.action,
            by: t.by,
          })),
        })),
      },
      null,
      2
    );
  };

  // Generate PDF-like text content (simplified - real implementation would use PDFKit)
  const generatePDFContent = (): string => {
    let content = '';

    if (options.includeHeader) {
      content += `${'='.repeat(80)}\n`;
      content += `${options.reportTitle.toUpperCase()}\n`;
      content += `Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}\n`;
      content += `${'='.repeat(80)}\n\n`;
    }

    if (options.includeSummary) {
      content += `REPORT SUMMARY\n`;
      content += `${'-'.repeat(80)}\n`;
      content += `Date Range: ${format(options.dateRange.start, 'yyyy-MM-dd')} to ${format(options.dateRange.end, 'yyyy-MM-dd')}\n`;
      content += `Total Records: ${filteredData.length}\n`;
      content += `\n`;
    }

    if (options.includeTotals) {
      const priorityCounts = {
        critical: filteredData.filter(i => i.priority === 'critical').length,
        high: filteredData.filter(i => i.priority === 'high').length,
        medium: filteredData.filter(i => i.priority === 'medium').length,
        low: filteredData.filter(i => i.priority === 'low').length,
      };

      const statusCounts = {
        open: filteredData.filter(i => i.status === 'open').length,
        assigned: filteredData.filter(i => i.status === 'assigned').length,
        escalated: filteredData.filter(i => i.status === 'escalated').length,
        resolved: filteredData.filter(i => i.status === 'resolved').length,
      };

      content += `STATISTICS\n`;
      content += `${'-'.repeat(80)}\n`;
      content += `By Priority:\n`;
      content += `  Critical: ${priorityCounts.critical}\n`;
      content += `  High: ${priorityCounts.high}\n`;
      content += `  Medium: ${priorityCounts.medium}\n`;
      content += `  Low: ${priorityCounts.low}\n`;
      content += `\n`;
      content += `By Status:\n`;
      content += `  Open: ${statusCounts.open}\n`;
      content += `  Assigned: ${statusCounts.assigned}\n`;
      content += `  Escalated: ${statusCounts.escalated}\n`;
      content += `  Resolved: ${statusCounts.resolved}\n`;
      content += `\n`;
    }

    content += `DETAILED RECORDS\n`;
    content += `${'='.repeat(80)}\n\n`;

    filteredData.forEach((item, index) => {
      content += `Record ${index + 1}: ${item.id}\n`;
      if (options.includeFields.title) content += `  Title: ${item.title}\n`;
      if (options.includeFields.description) content += `  Description: ${item.description}\n`;
      if (options.includeFields.priority) content += `  Priority: ${item.priority.toUpperCase()}\n`;
      if (options.includeFields.status) content += `  Status: ${item.status.toUpperCase()}\n`;
      if (options.includeFields.assignedTo) content += `  Assigned To: ${item.assignedTo}\n`;
      if (options.includeFields.createdAt) content += `  Created: ${format(item.createdAt, 'yyyy-MM-dd HH:mm:ss')}\n`;
      if (options.includeFields.updatedAt) content += `  Updated: ${format(item.updatedAt, 'yyyy-MM-dd HH:mm:ss')}\n`;

      if (options.includeFields.timeline && item.timeline) {
        content += `  Timeline:\n`;
        item.timeline.forEach(t => {
          content += `    - ${format(t.timestamp, 'HH:mm:ss')}: ${t.action} (by ${t.by})\n`;
        });
      }

      content += `\n`;
    });

    return content;
  };

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('processing');
    setStatusMessage('Generating export...');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing

      let content: string;
      let filename: string;
      let mimeType: string;

      switch (options.format) {
        case 'csv':
          content = generateCSV();
          filename = `escalation-report-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.csv`;
          mimeType = 'text/csv';
          break;
        case 'json':
          content = generateJSON();
          filename = `escalation-report-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
          mimeType = 'application/json';
          break;
        case 'pdf':
        default:
          content = generatePDFContent();
          filename = `escalation-report-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.txt`;
          mimeType = 'text/plain';
          break;
      }

      // Create blob and download
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setExportStatus('success');
      setStatusMessage(`Successfully exported ${filteredData.length} records as ${options.format.toUpperCase()}`);

      setTimeout(() => {
        setIsExporting(false);
        setExportStatus('idle');
      }, 3000);
    } catch (error) {
      setExportStatus('error');
      setStatusMessage('Export failed. Please try again.');
      setTimeout(() => {
        setIsExporting(false);
        setExportStatus('idle');
      }, 3000);
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Export to PDF</h2>
            <p className="text-sm text-gray-600">Generate reports from your escalation data</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-700">{filteredData.length}</p>
          <p className="text-sm text-gray-600">Records Available</p>
        </div>
      </div>

      {/* Status Alert */}
      {exportStatus !== 'idle' && (
        <div className={`p-4 rounded-lg flex items-start space-x-3 ${
          exportStatus === 'success' ? 'bg-green-50 border border-green-200' :
          exportStatus === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          {exportStatus === 'processing' && <Loader className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0 mt-0.5" />}
          {exportStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
          {exportStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
          <div>
            <p className={`font-semibold ${
              exportStatus === 'success' ? 'text-green-800' :
              exportStatus === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {statusMessage}
            </p>
          </div>
        </div>
      )}

      {/* Configuration Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Export Format</label>
          <div className="grid grid-cols-3 gap-3">
            {(['pdf', 'csv', 'json'] as const).map(fmt => (
              <button
                key={fmt}
                onClick={() => setOptions({ ...options, format: fmt })}
                className={`p-3 rounded-lg border-2 font-medium transition-all ${
                  options.format === fmt
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Date Range</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-2">From</label>
              <input
                type="date"
                value={format(options.dateRange.start, 'yyyy-MM-dd')}
                onChange={(e) => setOptions({
                  ...options,
                  dateRange: { ...options.dateRange, start: new Date(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2">To</label>
              <input
                type="date"
                value={format(options.dateRange.end, 'yyyy-MM-dd')}
                onChange={(e) => setOptions({
                  ...options,
                  dateRange: { ...options.dateRange, end: new Date(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Report Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Report Title</label>
          <input
            type="text"
            value={options.reportTitle}
            onChange={(e) => setOptions({ ...options, reportTitle: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Include Options */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Include in Report</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(options.includeFields).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setOptions({
                    ...options,
                    includeFields: { ...options.includeFields, [key]: e.target.checked }
                  })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Report Components */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Report Components</label>
          <div className="space-y-2">
            {[
              { key: 'includeHeader', label: 'Include Header' },
              { key: 'includeSummary', label: 'Include Summary' },
              { key: 'includeTotals', label: 'Include Statistics' },
            ].map(item => (
              <label key={item.key} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[item.key as keyof ExportOptions] as boolean}
                  onChange={(e) => setOptions({
                    ...options,
                    [item.key]: e.target.checked
                  })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Data Preview */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Data Preview ({filteredData.length} records)</h3>
        </div>
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">ID</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Title</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Priority</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-xs text-blue-600">{item.id}</td>
                  <td className="px-4 py-2 text-gray-800">{item.title}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${priorityColor(item.priority)}`}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-800 capitalize">{item.status}</td>
                  <td className="px-4 py-2 text-gray-800">{item.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting || filteredData.length === 0}
        className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
          isExporting || filteredData.length === 0
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isExporting ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Export {filteredData.length} Records</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ExportToPDFComponent;
