import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  Loader2,
  Check,
  Copy,
  Trash2
} from 'lucide-react';
import { AccessibleModal } from '@/components/accessibility';
import { Contact, contactsService } from '@/services/ContactsService';
import { DuplicateMatch, duplicateDetectionService } from '@/services/DuplicateDetectionService';

interface MergeDialogProps {
  duplicate: DuplicateMatch;
  onMerge?: (mergedContact: Contact) => void;
  onKeepSeparate?: () => void;
  onClose: () => void;
}

const MergeDialog: React.FC<MergeDialogProps> = ({
  duplicate,
  onMerge,
  onKeepSeparate,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set(['emails', 'phoneNumbers']));
  const [fieldsToUpdate, setFieldsToUpdate] = useState<Set<string>>(new Set());

  const existingContact = duplicate.existingContact;
  const newContact = duplicate.newContact;

  const toggleFieldExpanded = (field: string) => {
    const newSet = new Set(expandedFields);
    if (newSet.has(field)) {
      newSet.delete(field);
    } else {
      newSet.add(field);
    }
    setExpandedFields(newSet);
  };

  const toggleFieldForUpdate = (field: string) => {
    const newSet = new Set(fieldsToUpdate);
    if (newSet.has(field)) {
      newSet.delete(field);
    } else {
      newSet.add(field);
    }
    setFieldsToUpdate(newSet);
  };

  const handleMerge = async () => {
    setIsLoading(true);
    try {
      const merged = duplicateDetectionService.mergeContacts(
        existingContact,
        newContact,
        Array.from(fieldsToUpdate)
      );

      await contactsService.updateContact(existingContact.id, merged);
      
      // Delete the duplicate contact if it's a new import
      if (newContact.id && newContact.id !== existingContact.id) {
        try {
          await contactsService.deleteContact(newContact.id);
        } catch (error) {
          console.warn('Could not delete duplicate contact:', error);
        }
      }

      if (onMerge) {
        onMerge(existingContact);
      }
      onClose();
    } catch (error) {
      console.error('Error merging contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AccessibleModal
      isOpen={true}
      onClose={onClose}
      title="Potential Duplicate Contact"
      size="lg"
    >
      <div className="space-y-6">
        {/* Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900 mb-1">Potential Duplicate Found</h4>
            <p className="text-sm text-yellow-800">
              <strong>{duplicate.confidence}% match</strong> based on: {duplicate.matchReasons.join(', ')}
            </p>
          </div>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-4">
          {/* Existing Contact */}
          <div className="border border-ubuntu-warm-200 rounded-lg p-4">
            <h4 className="font-medium text-ubuntu-warm-900 mb-3">Existing Contact</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Name:</span>
                <p className="text-ubuntu-warm-700">{existingContact.firstName} {existingContact.lastName}</p>
              </div>
              <div>
                <span className="font-medium">Category:</span>
                <p className="text-ubuntu-warm-700">{existingContact.category}</p>
              </div>
              {existingContact.emails.length > 0 && (
                <div>
                  <span className="font-medium">Emails ({existingContact.emails.length}):</span>
                  <p className="text-ubuntu-warm-700 text-xs">{existingContact.emails.join(', ')}</p>
                </div>
              )}
              {existingContact.phoneNumbers.length > 0 && (
                <div>
                  <span className="font-medium">Phones ({existingContact.phoneNumbers.length}):</span>
                  <p className="text-ubuntu-warm-700 text-xs">{existingContact.phoneNumbers.join(', ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* New Contact */}
          <div className="border border-ubuntu-warm-200 rounded-lg p-4">
            <h4 className="font-medium text-ubuntu-warm-900 mb-3">New/Imported Contact</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Name:</span>
                <p className="text-ubuntu-warm-700">{newContact.firstName} {newContact.lastName}</p>
              </div>
              <div>
                <span className="font-medium">Category:</span>
                <p className="text-ubuntu-warm-700">{newContact.category}</p>
              </div>
              {newContact.emails.length > 0 && (
                <div>
                  <span className="font-medium">Emails ({newContact.emails.length}):</span>
                  <p className="text-ubuntu-warm-700 text-xs">{newContact.emails.join(', ')}</p>
                </div>
              )}
              {newContact.phoneNumbers.length > 0 && (
                <div>
                  <span className="font-medium">Phones ({newContact.phoneNumbers.length}):</span>
                  <p className="text-ubuntu-warm-700 text-xs">{newContact.phoneNumbers.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conflicting Fields */}
        {duplicate.conflictingFields.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-900 mb-3">Conflicting Information</h4>
            <div className="space-y-3">
              {duplicate.conflictingFields.map((conflict, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={fieldsToUpdate.has(conflict.field)}
                    onChange={() => toggleFieldForUpdate(conflict.field)}
                    className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-orange-900 capitalize">{conflict.field}</p>
                    <div className="mt-1 text-xs space-y-1">
                      <p><span className="font-medium">Existing:</span> {String(conflict.existingValue)}</p>
                      <p><span className="font-medium">New:</span> {String(conflict.newValue)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Merge Options */}
        <div className="space-y-3">
          <h4 className="font-medium text-ubuntu-warm-900">Merge Options</h4>
          
          <motion.label
            whileHover={{ scale: 1.01 }}
            className="flex items-center p-3 border border-green-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors"
          >
            <input
              type="radio"
              name="mergeOption"
              checked={fieldsToUpdate.size === 0}
              onChange={() => setFieldsToUpdate(new Set())}
              className="w-4 h-4 text-green-600"
            />
            <div className="ml-3">
              <p className="font-medium text-ubuntu-warm-900">Keep Existing Contact</p>
              <p className="text-xs text-ubuntu-warm-600">Delete the new/imported contact</p>
            </div>
          </motion.label>

          <motion.label
            whileHover={{ scale: 1.01 }}
            className="flex items-center p-3 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
          >
            <input
              type="radio"
              name="mergeOption"
              checked={fieldsToUpdate.size === duplicate.conflictingFields.length}
              onChange={() => setFieldsToUpdate(new Set(duplicate.conflictingFields.map(f => f.field)))}
              className="w-4 h-4 text-blue-600"
            />
            <div className="ml-3">
              <p className="font-medium text-ubuntu-warm-900">Update All Conflicting Fields</p>
              <p className="text-xs text-ubuntu-warm-600">Use new contact information where different</p>
            </div>
          </motion.label>

          <motion.label
            whileHover={{ scale: 1.01 }}
            className="flex items-center p-3 border border-purple-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors"
          >
            <input
              type="radio"
              name="mergeOption"
              checked={fieldsToUpdate.size > 0 && fieldsToUpdate.size < duplicate.conflictingFields.length}
              onChange={() => {}}
              className="w-4 h-4 text-purple-600"
            />
            <div className="ml-3">
              <p className="font-medium text-ubuntu-warm-900">Custom Merge</p>
              <p className="text-xs text-ubuntu-warm-600">Choose which fields to update</p>
            </div>
          </motion.label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-ubuntu-warm-100">
          <button
            onClick={() => {
              if (onKeepSeparate) onKeepSeparate();
              onClose();
            }}
            className="px-4 py-2 text-ubuntu-warm-700 border border-ubuntu-warm-300 rounded-lg hover:bg-ubuntu-warm-50 transition-colors"
          >
            Keep Separate
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-ubuntu-warm-700 border border-ubuntu-warm-300 rounded-lg hover:bg-ubuntu-warm-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleMerge}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Merging...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Merge Contacts</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AccessibleModal>
  );
};

export default MergeDialog;
