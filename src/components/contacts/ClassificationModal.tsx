import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Users,
  Eye,
  EyeOff,
  ArrowRightLeft,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { AccessibleModal, AccessibleSelect } from '@/components/accessibility';
import { Contact } from '@/services/ContactsService';
import { contactsService } from '@/services/ContactsService';

interface ClassificationModalProps {
  contact: Contact;
  onClose: () => void;
  onSave?: (updatedContact: Contact) => void;
}

const ClassificationModal: React.FC<ClassificationModalProps> = ({
  contact,
  onClose,
  onSave
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    isHouseholdMember: contact.isHouseholdMember || false,
    isFamilyMember: contact.isFamilyMember || false,
    sonnyRole: contact.sonnyRole || 'none' as 'monitor' | 'monitored' | 'both' | 'none'
  });

  const sonnyRoleOptions = [
    {
      value: 'none',
      label: 'No Monitoring',
      description: 'Standard contact'
    },
    {
      value: 'monitor',
      label: 'I Monitor Them',
      description: 'You watch this contact'
    },
    {
      value: 'monitored',
      label: 'They Monitor Me',
      description: 'This contact watches you'
    },
    {
      value: 'both',
      label: 'Mutual Monitoring',
      description: 'Bidirectional monitoring'
    }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedContact = {
        ...contact,
        ...formData,
        updatedAt: new Date()
      };

      await contactsService.updateContact(contact.id, {
        isHouseholdMember: formData.isHouseholdMember,
        isFamilyMember: formData.isFamilyMember,
        sonnyRole: formData.sonnyRole
      });

      if (onSave) {
        onSave(updatedContact);
      }
      onClose();
    } catch (error) {
      console.error('Error updating contact classification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AccessibleModal
      isOpen={true}
      onClose={onClose}
      title={`Classify ${contact.firstName} ${contact.lastName}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Relationship Classification */}
        <div className="space-y-4">
          <h3 className="font-medium text-ubuntu-warm-900">Relationship Classification</h3>
          
          {/* Family Member Checkbox */}
          <motion.label
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 border border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors"
          >
            <input
              type="checkbox"
              checked={formData.isFamilyMember}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                isFamilyMember: e.target.checked
              }))}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <div className="ml-3 flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="font-medium text-ubuntu-warm-900">Family Member</p>
                <p className="text-sm text-ubuntu-warm-600">This person is part of your family</p>
              </div>
            </div>
          </motion.label>

          {/* Household Member Checkbox */}
          <motion.label
            whileHover={{ scale: 1.02 }}
            className="flex items-center p-4 border border-orange-200 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors"
          >
            <input
              type="checkbox"
              checked={formData.isHouseholdMember}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                isHouseholdMember: e.target.checked
              }))}
              className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
            />
            <div className="ml-3 flex items-center space-x-2">
              <Home className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-ubuntu-warm-900">Household Member</p>
                <p className="text-sm text-ubuntu-warm-600">This person lives in your household</p>
              </div>
            </div>
          </motion.label>
        </div>

        {/* Monitoring Role */}
        <div className="space-y-4">
          <h3 className="font-medium text-ubuntu-warm-900">Monitoring Role (Sonny)</h3>
          <p className="text-sm text-ubuntu-warm-600">Set how you interact with this contact in the Sonny Network</p>

          <div className="space-y-2">
            {sonnyRoleOptions.map(option => (
              <motion.label
                key={option.value}
                whileHover={{ scale: 1.01 }}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.sonnyRole === option.value
                    ? 'border-ubuntu-gold bg-ubuntu-gold/5'
                    : 'border-ubuntu-warm-200 hover:border-ubuntu-gold/50'
                }`}
              >
                <input
                  type="radio"
                  name="sonnyRole"
                  value={option.value}
                  checked={formData.sonnyRole === option.value}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sonnyRole: e.target.value as 'monitor' | 'monitored' | 'both' | 'none'
                  }))}
                  className="w-4 h-4 text-ubuntu-gold focus:ring-2 focus:ring-ubuntu-gold"
                />
                <div className="ml-3 flex items-center space-x-2 flex-1">
                  {option.value === 'none' && <Eye className="w-5 h-5 text-gray-400" />}
                  {option.value === 'monitor' && <Eye className="w-5 h-5 text-ubuntu-gold" />}
                  {option.value === 'monitored' && <EyeOff className="w-5 h-5 text-purple-600" />}
                  {option.value === 'both' && <ArrowRightLeft className="w-5 h-5 text-ubuntu-orange" />}
                  <div>
                    <p className="font-medium text-ubuntu-warm-900">{option.label}</p>
                    <p className="text-sm text-ubuntu-warm-600">{option.description}</p>
                  </div>
                </div>
              </motion.label>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-ubuntu-aubergine/5 border border-ubuntu-aubergine/20 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-ubuntu-aubergine">Classification Summary</h4>
          <ul className="text-sm text-ubuntu-warm-700 space-y-1">
            {formData.isFamilyMember && <li>✓ Marked as family member</li>}
            {formData.isHouseholdMember && <li>✓ Marked as household member</li>}
            {formData.sonnyRole !== 'none' && (
              <li>✓ Sonny role: {sonnyRoleOptions.find(o => o.value === formData.sonnyRole)?.label}</li>
            )}
            {!formData.isFamilyMember && !formData.isHouseholdMember && formData.sonnyRole === 'none' && (
              <li className="text-gray-400">• No classification set</li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-ubuntu-warm-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-ubuntu-warm-700 border border-ubuntu-warm-300 rounded-lg hover:bg-ubuntu-warm-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-ubuntu-gold text-white rounded-lg hover:bg-ubuntu-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Classification</span>
              </>
            )}
          </button>
        </div>
      </div>
    </AccessibleModal>
  );
};

export default ClassificationModal;
