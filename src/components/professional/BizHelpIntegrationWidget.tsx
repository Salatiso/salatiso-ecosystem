/**
 * BizHelp Integration Widget
 * 
 * Displays real-time BizHelp business data and provides
 * navigation links to detailed operations in BizHelp
 * 
 * @component BizHelpIntegrationWidget
 */

import React, { useMemo } from 'react';
import {
  ExternalLink,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Users,
  FileCheck,
  Briefcase,
  Clock,
  Link as LinkIcon,
} from 'lucide-react';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import { getBizHelpLink } from '@/services/bizHelpIntegration';
import { AccessibleButton } from '@/components/accessibility';

interface BizHelpIntegrationWidgetProps {
  companyId: string;
  compact?: boolean;
  onNavigate?: (url: string) => void;
}

/**
 * Status badge component
 */
const StatusBadge: React.FC<{ 
  status: string; 
  label: string;
  icon?: React.ReactNode;
}> = ({ status, label, icon }) => {
  const statusColor: Record<string, string> = {
    registered: 'bg-green-100 text-green-800',
    applying: 'bg-blue-100 text-blue-800',
    formalized: 'bg-purple-100 text-purple-800',
    planning: 'bg-gray-100 text-gray-800',
    overdue: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusColor[status] || 'bg-gray-100 text-gray-800'}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

/**
 * Deep link card component
 */
const DeepLinkCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  params?: Record<string, string>;
  onClick: (url: string) => void;
}> = ({ title, description, icon, action, params, onClick }) => {
  const handleClick = () => {
    const url = getBizHelpLink(action, params);
    onClick(url);
  };

  return (
    <AccessibleButton
      onClick={handleClick}
      className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
      ariaLabel={`Navigate to ${title} in BizHelp`}
    >
      <div className="text-blue-600 mt-1 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 truncate">{description}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
    </AccessibleButton>
  );
};

/**
 * BizHelp Integration Widget
 */
export const BizHelpIntegrationWidget: React.FC<BizHelpIntegrationWidgetProps> = ({
  companyId,
  compact = false,
  onNavigate,
}) => {
  const { business, activities, loading, error } = useBizHelpIntegration(companyId);

  const stats = useMemo(() => {
    if (!business) return null;

    return {
      stage: business.stage,
      entityType: business.type,
      teamSize: business.operations?.activeTeam || 0,
      projects: business.operations?.projects || 0,
      complianceIssues: business.compliance?.obligations?.filter(
        (o) => o.status === 'overdue'
      ).length || 0,
      totalObligations: business.compliance?.obligations?.length || 0,
    };
  }, [business]);

  const handleNavigation = (url: string) => {
    if (onNavigate) {
      onNavigate(url);
    } else {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">BizHelp Data Not Available</h3>
            <p className="text-sm text-red-700 mt-1">
              {error || 'Unable to load BizHelp business data. Please try again.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (compact && stats) {
    return (
      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            {business.name}
          </h3>
          <StatusBadge status={stats.stage} label={stats.stage} icon={<CheckCircle className="w-3 h-3" />} />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.projects}</div>
            <div className="text-xs text-gray-600">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.teamSize}</div>
            <div className="text-xs text-gray-600">Team Members</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${stats.complianceIssues > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.complianceIssues}
            </div>
            <div className="text-xs text-gray-600">Overdue</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <AccessibleButton
            onClick={() => handleNavigation(getBizHelpLink('dashboard'))}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            ariaLabel="Open BizHelp Dashboard"
          >
            <ExternalLink className="w-3 h-3" />
            BizHelp Dashboard
          </AccessibleButton>
          <AccessibleButton
            onClick={() => handleNavigation(getBizHelpLink('operations-dashboard'))}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
            ariaLabel="Open Operations Dashboard"
          >
            <TrendingUp className="w-3 h-3" />
            Operations
          </AccessibleButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">{business.name}</h2>
            <p className="text-blue-100">
              {business.type} • {business.stage === 'registered' ? 'Registered & Active' : `Status: ${business.stage}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100 mb-1">Registration</p>
            <p className="font-mono text-lg">{business.registration?.cipcNumber || 'Pending'}</p>
          </div>
        </div>
        {business.registration?.registeredDate && (
          <p className="text-sm text-blue-100">
            Registered: {new Date(business.registration.registeredDate).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Statistics Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Active Projects</p>
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.projects}</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Team Members</p>
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.teamSize}</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Compliance Items</p>
              <FileCheck className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalObligations}</p>
          </div>

          <div className={`rounded-lg p-4 border-2 ${stats.complianceIssues > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm ${stats.complianceIssues > 0 ? 'text-red-700' : 'text-green-700'}`}>
                Overdue Items
              </p>
              {stats.complianceIssues > 0 ? (
                <AlertCircle className="w-4 h-4 text-red-600" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            <p className={`text-3xl font-bold ${stats.complianceIssues > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.complianceIssues}
            </p>
          </div>
        </div>
      )}

      {/* Compliance Summary */}
      {business.compliance?.obligations && business.compliance.obligations.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Upcoming Compliance Obligations
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {business.compliance.obligations.slice(0, 5).map((obligation) => (
              <div key={obligation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{obligation.name}</p>
                  <p className="text-xs text-gray-600">
                    Due: {new Date(obligation.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={obligation.status} label={obligation.status} />
              </div>
            ))}
          </div>
          <AccessibleButton
            onClick={() => handleNavigation(getBizHelpLink('compliance-calendar'))}
            className="mt-4 w-full px-4 py-2 text-center text-sm font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
            ariaLabel="View all compliance obligations"
          >
            View All Obligations →
          </AccessibleButton>
        </div>
      )}

      {/* Deep Links Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-indigo-600" />
          Quick Access to BizHelp Operations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <DeepLinkCard
            title="Projects & Delivery"
            description="Manage projects, milestones, and deliverables"
            icon={<Briefcase className="w-5 h-5" />}
            action="projects"
            onClick={handleNavigation}
          />

          <DeepLinkCard
            title="Compliance Calendar"
            description="Track regulatory obligations and deadlines"
            icon={<Clock className="w-5 h-5" />}
            action="compliance-calendar"
            onClick={handleNavigation}
          />

          <DeepLinkCard
            title="Organization Chart"
            description="View team structure and responsibilities"
            icon={<Users className="w-5 h-5" />}
            action="org-chart"
            onClick={handleNavigation}
          />

          <DeepLinkCard
            title="Partnerships"
            description="Manage strategic partnerships and agreements"
            icon={<Briefcase className="w-5 h-5" />}
            action="partnerships"
            onClick={handleNavigation}
          />

          <DeepLinkCard
            title="Governance"
            description="Board registry, policies, and meeting minutes"
            icon={<FileCheck className="w-5 h-5" />}
            action="governance"
            onClick={handleNavigation}
          />

          <DeepLinkCard
            title="Risk Register"
            description="Track and manage identified risks"
            icon={<AlertCircle className="w-5 h-5" />}
            action="risks"
            onClick={handleNavigation}
          />
        </div>
      </div>

      {/* Recent Activities */}
      {activities.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activities.slice(0, 8).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 capitalize">
                    {activity.type.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <span className="inline-block px-2 py-0.5 rounded-full text-white bg-blue-500 text-xs">
                      {activity.source}
                    </span>
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BizHelpIntegrationWidget;
