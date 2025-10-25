import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, TrendingUp, Award, Users, DollarSign, Target } from 'lucide-react';

const MNIProfileWidget: React.FC = () => {
  const { user } = useAuth();

  if (!user?.mniProfile) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">MNI Profile</h3>
          <p className="text-gray-600">MNI profile not yet configured</p>
        </div>
      </div>
    );
  }

  const { mniProfile } = user;
  const totalOwnership = mniProfile.ownerships.reduce((sum, ownership) => sum + ownership.ownershipPercentage, 0);
  const totalContributions = mniProfile.contributions.reduce((sum, contrib) => sum + contrib.value, 0);
  const activeEligibility = mniProfile.eligibility.filter(e => e.status === 'eligible').length;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">MNI Profile</h3>
        <Briefcase className="h-5 w-5 text-primary-600" />
      </div>

      <div className="space-y-4">
        {/* Ownership Summary */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Ownership Stake</span>
          </div>
          <span className="text-sm font-bold text-blue-600">{totalOwnership.toFixed(1)}%</span>
        </div>

        {/* Contributions Summary */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Total Contributions</span>
          </div>
          <span className="text-sm font-bold text-green-600">${totalContributions.toLocaleString()}</span>
        </div>

        {/* Eligibility Status */}
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center">
            <Award className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Active Eligibility</span>
          </div>
          <span className="text-sm font-bold text-purple-600">{activeEligibility}</span>
        </div>

        {/* Business Role */}
        {mniProfile.businessRole && (
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">Business Role</span>
            </div>
            <span className="text-sm font-bold text-orange-600">{mniProfile.businessRole.name}</span>
          </div>
        )}

        {/* Development Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Development Progress</span>
            <span className="text-sm text-gray-600">{mniProfile.developmentPlan.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full"
              style={{ width: `${mniProfile.developmentPlan.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2 mt-4">
          <button className="flex-1 px-3 py-2 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
            View Details
          </button>
          <button className="flex-1 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            Add Contribution
          </button>
        </div>
      </div>
    </div>
  );
};

export default MNIProfileWidget;