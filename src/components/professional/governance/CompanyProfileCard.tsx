import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Loader2
} from 'lucide-react';
import { AccessibleInput, AccessibleTextarea, AccessibleSelect } from '@/components/accessibility';
import { useGovernance } from '@/hooks/useGovernance';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';
import type { CompanyProfile } from '@/contexts/professional/ProfessionalContext';

interface CompanyProfileCardProps {
  className?: string;
}

/**
 * CompanyProfileCard Component
 * Displays and allows editing of company profile information
 */
export const CompanyProfileCard: React.FC<CompanyProfileCardProps> = ({ className }) => {
  const {
    company,
    loading,
    error,
    loadCompanyProfile,
    createCompanyProfile,
    updateCompanyProfile
  } = useGovernance();

  // Get activity logger for logging company profile changes
  const { activityLogger } = useBizHelpIntegration(company?.id || '');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({});
  const [newDirector, setNewDirector] = useState('');
  const [newShareholder, setNewShareholder] = useState('');

  // Initialize form data when company data loads
  useEffect(() => {
    if (company) {
      setFormData(company);
    }
  }, [company]);

  // Load company data on mount
  useEffect(() => {
    loadCompanyProfile();
  }, [loadCompanyProfile]);

  const handleInputChange = (field: keyof CompanyProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: keyof CompanyProfile['address'], value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      } as CompanyProfile['address']
    }));
  };

  const handleContactChange = (field: keyof CompanyProfile['contact'], value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      } as CompanyProfile['contact']
    }));
  };

  const addDirector = () => {
    if (newDirector.trim()) {
      const directors = formData.directors || [];
      setFormData(prev => ({
        ...prev,
        directors: [...directors, newDirector.trim()]
      }));
      setNewDirector('');
    }
  };

  const removeDirector = (index: number) => {
    const directors = formData.directors || [];
    setFormData(prev => ({
      ...prev,
      directors: directors.filter((_, i) => i !== index)
    }));
  };

  const addShareholder = () => {
    if (newShareholder.trim()) {
      const shareholders = formData.shareholders || [];
      setFormData(prev => ({
        ...prev,
        shareholders: [...shareholders, newShareholder.trim()]
      }));
      setNewShareholder('');
    }
  };

  const removeShareholder = (index: number) => {
    const shareholders = formData.shareholders || [];
    setFormData(prev => ({
      ...prev,
      shareholders: shareholders.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      if (!company) {
        // Create new company profile
        await createCompanyProfile(formData as Omit<CompanyProfile, 'id' | 'createdAt' | 'updatedAt'>);
        
        // Log creation activity
        if (activityLogger) {
          await activityLogger.log('company_profile_created', {
            companyName: formData.name || 'Unnamed',
            jurisdiction: formData.jurisdiction || 'Unknown',
            registrationNumber: formData.registrationNumber || 'N/A'
          });
        }
      } else {
        // Update existing company profile
        const oldName = company.name;
        const oldJurisdiction = company.jurisdiction;
        const oldStatus = company.status;
        
        await updateCompanyProfile(formData);
        
        // Log update activity with change tracking
        if (activityLogger) {
          const changes: Record<string, any> = {};
          if (oldName !== formData.name) changes.name = { from: oldName, to: formData.name };
          if (oldJurisdiction !== formData.jurisdiction) changes.jurisdiction = { from: oldJurisdiction, to: formData.jurisdiction };
          if (oldStatus !== formData.status) changes.status = { from: oldStatus, to: formData.status };
          
          await activityLogger.log('company_profile_updated', {
            companyName: formData.name,
            jurisdiction: formData.jurisdiction,
            registrationNumber: formData.registrationNumber,
            status: formData.status,
            changes: Object.keys(changes).length > 0 ? changes : { status: 'profile_updated' }
          });
        }
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving company profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData(company || {});
    setIsEditing(false);
    setNewDirector('');
    setNewShareholder('');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          <p>Error loading company profile: {error}</p>
          <button
            onClick={loadCompanyProfile}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Company Profile
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AccessibleInput
            label="Company Name"
            id="name"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter company name"
            className="w-full"
          />

          <AccessibleInput
            label="Registration Number"
            id="registrationNumber"
            value={formData.registrationNumber || ''}
            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
            placeholder="Enter registration number"
            className="w-full"
          />

          <AccessibleInput
            label="Tax ID"
            id="taxId"
            value={formData.taxId || ''}
            onChange={(e) => handleInputChange('taxId', e.target.value)}
            placeholder="Enter tax ID"
            className="w-full"
          />

          <AccessibleInput
            label="Jurisdiction"
            id="jurisdiction"
            value={formData.jurisdiction || ''}
            onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
            placeholder="Enter jurisdiction"
            className="w-full"
          />

          <AccessibleInput
            label="Incorporation Date"
            id="incorporationDate"
            type="date"
            value={formData.incorporationDate ? new Date(formData.incorporationDate).toISOString().split('T')[0] : ''}
            onChange={(e) => handleInputChange('incorporationDate', new Date(e.target.value))}
            className="w-full"
          />

          <AccessibleSelect
            label="Status"
            value={formData.status || 'active'}
            onChange={(e) => handleInputChange('status', e.target.value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'dormant', label: 'Dormant' },
              { value: 'dissolved', label: 'Dissolved' }
            ]}
            className="w-full"
          />
        </div>

        <hr className="border-gray-200" />

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AccessibleInput
              label="Street Address"
              id="street"
              value={formData.address?.street || ''}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="Enter street address"
              className="w-full"
            />

            <AccessibleInput
              label="City"
              id="city"
              value={formData.address?.city || ''}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="Enter city"
              className="w-full"
            />

            <AccessibleInput
              label="State/Province"
              id="state"
              value={formData.address?.state || ''}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              placeholder="Enter state/province"
              className="w-full"
            />

            <AccessibleInput
              label="Country"
              id="country"
              value={formData.address?.country || ''}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              placeholder="Enter country"
              className="w-full"
            />

            <div className="md:col-span-2">
              <AccessibleInput
                label="Postal Code"
                id="postalCode"
                value={formData.address?.postalCode || ''}
                onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                placeholder="Enter postal code"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AccessibleInput
              label="Email"
              id="email"
              type="email"
              value={formData.contact?.email || ''}
              onChange={(e) => handleContactChange('email', e.target.value)}
              placeholder="Enter email address"
              className="w-full"
            />

            <AccessibleInput
              label="Phone"
              id="phone"
              value={formData.contact?.phone || ''}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              placeholder="Enter phone number"
              className="w-full"
            />

            <div className="md:col-span-2">
              <AccessibleInput
                label="Website"
                id="website"
                type="url"
                value={formData.contact?.website || ''}
                onChange={(e) => handleContactChange('website', e.target.value)}
                placeholder="Enter website URL"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Directors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Directors</h3>

          <div className="flex flex-wrap gap-2">
            {(formData.directors || []).map((director, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-sm">{director}</span>
                {isEditing && (
                  <button
                    onClick={() => removeDirector(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <input
                value={newDirector}
                onChange={(e) => setNewDirector(e.target.value)}
                placeholder="Add director name"
                onKeyPress={(e) => e.key === 'Enter' && addDirector()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addDirector}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Shareholders */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Shareholders</h3>

          <div className="flex flex-wrap gap-2">
            {(formData.shareholders || []).map((shareholder, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-sm">{shareholder}</span>
                {isEditing && (
                  <button
                    onClick={() => removeShareholder(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <input
                value={newShareholder}
                onChange={(e) => setNewShareholder(e.target.value)}
                placeholder="Add shareholder name"
                onKeyPress={(e) => e.key === 'Enter' && addShareholder()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addShareholder}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4 mr-2 inline" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2 inline" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};