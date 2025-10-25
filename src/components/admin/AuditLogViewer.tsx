/**
 * AuditLogViewer Component - Phase 4.8 Admin Panel
 * System audit logs and activity tracking
 * Viewing, filtering, searching, and exporting audit logs
 */

'use client';

import React, { useState, useMemo } from 'react';
import { FileText, Download, Search, Filter, Clock, User, Activity } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  resourceType: string;
  status: 'success' | 'error' | 'warning';
  ipAddress: string;
  userAgent: string;
  details?: string;
}

export const AuditLogViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'user' | 'action' | 'resource'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error' | 'warning'>('all');
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sample audit logs
  const sampleLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
      user: 'admin@salatiso.com',
      action: 'User Created',
      resource: 'john.doe@example.com',
      resourceType: 'user',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'New user account created with role: coordinator',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      user: 'manager@salatiso.com',
      action: 'Configuration Changed',
      resource: 'SMTP Settings',
      resourceType: 'config',
      status: 'success',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      details: 'Updated SMTP port from 25 to 587',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      user: 'sarah.johnson@salatiso.com',
      action: 'Failed Login Attempt',
      resource: 'Authentication',
      resourceType: 'auth',
      status: 'error',
      ipAddress: '203.0.113.45',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      details: 'Login failed: Invalid password (attempt 3/5)',
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 32 * 60000).toISOString(),
      user: 'admin@salatiso.com',
      action: 'User Suspended',
      resource: 'old.user@example.com',
      resourceType: 'user',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Account suspended due to inactivity (90+ days)',
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
      user: 'api_service',
      action: 'API Key Generated',
      resource: 'integration_key_prod',
      resourceType: 'api',
      status: 'success',
      ipAddress: '10.0.0.50',
      userAgent: 'ApiClient/2.1.0',
      details: 'New API key generated for integration service',
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      user: 'manager@salatiso.com',
      action: 'Database Backup',
      resource: 'production_db',
      resourceType: 'database',
      status: 'warning',
      ipAddress: '192.168.1.105',
      userAgent: 'MonitoringService/1.0',
      details: 'Backup completed but took longer than expected (45 min)',
    },
    {
      id: '7',
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      user: 'admin@salatiso.com',
      action: 'Role Updated',
      resource: 'mike.chen@salatiso.com',
      resourceType: 'user',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Role changed from user to manager',
    },
    {
      id: '8',
      timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
      user: 'security@salatiso.com',
      action: 'Security Scan',
      resource: 'application',
      resourceType: 'security',
      status: 'success',
      ipAddress: '192.168.1.200',
      userAgent: 'SecurityScanner/3.2.1',
      details: 'Completed vulnerability scan: 0 critical issues found',
    },
    {
      id: '9',
      timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
      user: 'admin@salatiso.com',
      action: 'Bulk Import',
      resource: 'users_batch_001',
      resourceType: 'import',
      status: 'success',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Imported 245 user records from CSV file',
    },
    {
      id: '10',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      user: 'manager@salatiso.com',
      action: 'Report Generated',
      resource: 'monthly_report_oct',
      resourceType: 'report',
      status: 'success',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      details: 'Generated monthly escalation report (847 records)',
    },
  ];

  // Filter logs based on search and filter criteria
  const filteredLogs = useMemo(() => {
    return sampleLogs.filter(log => {
      // Search filter
      const searchMatch =
        searchTerm === '' ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm);

      // Status filter
      const statusMatch = statusFilter === 'all' || log.status === statusFilter;

      // Filter by type
      let filterMatch = true;
      if (filterBy !== 'all') {
        if (filterBy === 'user') filterMatch = log.resourceType === 'user';
        if (filterBy === 'action') filterMatch = ['config', 'auth', 'api'].includes(log.resourceType);
        if (filterBy === 'resource') filterMatch = ['database', 'security', 'import'].includes(log.resourceType);
      }

      return searchMatch && statusMatch && filterMatch;
    });
  }, [searchTerm, filterBy, statusFilter]);

  // Statistics
  const stats = {
    total: sampleLogs.length,
    success: sampleLogs.filter(l => l.status === 'success').length,
    errors: sampleLogs.filter(l => l.status === 'error').length,
    warnings: sampleLogs.filter(l => l.status === 'warning').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return '•';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Status', 'IP Address'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.user,
        log.action,
        log.resource,
        log.status,
        log.ipAddress,
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
            <p className="text-sm text-gray-600 mt-1">System activity and event logs</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="text-sm text-gray-600">Total Logs</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Successful</div>
          <div className="text-2xl font-bold text-green-600">{stats.success}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="text-sm text-gray-600">Errors</div>
          <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600">Warnings</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="User, action, resource, IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Type</label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="user">Users</option>
              <option value="action">Actions</option>
              <option value="resource">Resources</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredLogs.length} of {sampleLogs.length} logs
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <React.Fragment key={log.id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatTime(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {log.user}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.resource}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                        {log.ipAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(log.status)}`}>
                          {getStatusIcon(log.status)} {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                      </td>
                    </tr>

                    {/* Expanded Details */}
                    {expandedId === log.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Full Details</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">User Agent</p>
                                  <p className="text-gray-900 font-mono text-xs">{log.userAgent}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Timestamp</p>
                                  <p className="text-gray-900">{new Date(log.timestamp).toLocaleString()}</p>
                                </div>
                              </div>
                              {log.details && (
                                <div className="mt-4">
                                  <p className="text-gray-600">Description</p>
                                  <p className="text-gray-900 bg-white p-2 rounded border border-gray-200 mt-1">{log.details}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600">No logs found matching your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
