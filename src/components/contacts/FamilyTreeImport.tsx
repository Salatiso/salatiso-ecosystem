import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  CheckCircle,
  Circle,
  UserCheck,
  AlertCircle,
  Download
} from 'lucide-react';
import { AccessibleModal } from '@/components/accessibility';
import { Contact } from '@/services/ContactsService';

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  status: 'active' | 'emeritus' | 'developing';
}

interface FamilyTreeImportProps {
  existingContacts: Contact[];
  onImport: (contacts: Contact[]) => void;
  onClose: () => void;
  currentUserId: string;
}

// Family tree data - same as in family.tsx
const familyTreeData: FamilyMember[] = [
  {
    id: 'notemba',
    name: 'Nozukile Cynthia Mdeni (Notemba)',
    role: 'Family Matriarch & Trust Beneficiary',
    email: 'mdeninotembac@gmail.com',
    phone: '+27 81 000 0000',
    dateOfBirth: '1960-12-16',
    location: 'Eastern Cape, South Africa',
    status: 'active'
  },
  {
    id: 'salatiso',
    name: 'Salatiso Mdeni',
    role: 'Founder & Chief Visionary',
    email: 'spiceinc@gmail.com',
    phone: '+27 82 123 4567',
    dateOfBirth: '1982-09-16',
    location: 'Cape Town, South Africa',
    status: 'active'
  },
  {
    id: 'visa',
    name: 'Visa Mdeni',
    role: 'Marketing & Global Expansion Lead',
    email: 'visasande@gmail.com',
    phone: '+27 83 234 5678',
    dateOfBirth: '1985-05-15',
    location: 'Johannesburg, South Africa',
    status: 'active'
  },
  {
    id: 'tina',
    name: 'Tina Mdeni',
    role: 'Education & Finance Oversight',
    email: 'tina@salatiso.com',
    phone: '+27 84 345 6789',
    dateOfBirth: '1990-06-15',
    location: 'Durban, South Africa',
    status: 'active'
  },
  {
    id: 'kwakho',
    name: 'Kwakho Mdeni',
    role: 'Community Engagement Lead',
    email: 'kwakhomdeni@gmail.com',
    phone: '+27 85 456 7890',
    dateOfBirth: '1992-09-15',
    location: 'East London, South Africa',
    status: 'active'
  },
  {
    id: 'solo',
    name: 'Solo Mdeni',
    role: 'CTO & Technology Lead',
    email: 'solo@mdeni.family',
    phone: '+27 86 567 8901',
    dateOfBirth: '2010-06-15',
    location: 'Cape Town, South Africa',
    status: 'active'
  },
  {
    id: 'milande',
    name: 'Milande Mdeni',
    role: 'Future Leader in Development',
    email: 'milandep.mdeni@gmail.com',
    phone: '+27 87 678 9012',
    dateOfBirth: '2017-03-12',
    location: 'Cape Town, South Africa',
    status: 'developing'
  },
  {
    id: 'sazi',
    name: 'Sazi Mdeni',
    role: 'Future Leader in Training',
    email: 'sazisimdeni@gmail.com',
    phone: '+27 87 111 2222',
    dateOfBirth: '2018-08-10',
    location: 'Cape Town, South Africa',
    status: 'developing'
  },
  {
    id: 'mila',
    name: 'Mila Mdeni',
    role: 'Future Leader in Training',
    email: 'milamdeni@gmail.com',
    phone: '+27 87 333 4444',
    dateOfBirth: '2019-05-20',
    location: 'Cape Town, South Africa',
    status: 'developing'
  },
  {
    id: 'milani',
    name: 'Milani Mdeni',
    role: 'Next Generation in Training',
    email: '',
    phone: '+27 87 555 6666',
    dateOfBirth: '2020-11-08',
    location: 'Cape Town, South Africa',
    status: 'developing'
  },
  {
    id: 'azora',
    name: 'Azora Mdeni',
    role: 'Next Generation in Training',
    email: 'azoramdeni@gmail.com',
    phone: '+27 87 777 8888',
    dateOfBirth: '2021-04-15',
    location: 'Durban, South Africa',
    status: 'developing'
  }
];

const FamilyTreeImport: React.FC<FamilyTreeImportProps> = ({
  existingContacts,
  onImport,
  onClose,
  currentUserId
}) => {
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [importStatus, setImportStatus] = useState<'selecting' | 'importing' | 'complete'>('selecting');
  const [importedCount, setImportedCount] = useState(0);

  // Filter out family members who already exist as contacts
  const existingFamilyIds = new Set(
    existingContacts
      .filter(c => c.familyTreeId)
      .map(c => c.familyTreeId)
  );

  const availableMembers = familyTreeData.filter(
    member => !existingFamilyIds.has(member.id) && member.email // Only import members with email
  );

  // Pre-select active family members
  useEffect(() => {
    const activeMembers = availableMembers
      .filter(m => m.status === 'active')
      .map(m => m.id);
    setSelectedMembers(new Set(activeMembers));
  }, []);

  const toggleMember = (memberId: string) => {
    const newSelection = new Set(selectedMembers);
    if (newSelection.has(memberId)) {
      newSelection.delete(memberId);
    } else {
      newSelection.add(memberId);
    }
    setSelectedMembers(newSelection);
  };

  const selectAll = () => {
    setSelectedMembers(new Set(availableMembers.map(m => m.id)));
  };

  const selectNone = () => {
    setSelectedMembers(new Set());
  };

  const handleImport = () => {
    setImportStatus('importing');

    const membersToImport = availableMembers.filter(m => selectedMembers.has(m.id));
    
    const newContacts: Contact[] = membersToImport.map(member => {
      // Split name into first and last
      const nameParts = member.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      return {
        id: `family_${member.id}_${Date.now()}`,
        firstName,
        lastName,
        phoneNumbers: member.phone ? [member.phone] : [],
        emails: member.email ? [member.email] : [],
        addresses: member.location ? [member.location] : [],
        category: 'family' as const,
        tags: ['Family Member', member.role],
        notes: `Imported from family tree. Role: ${member.role}`,
        privacy: 'family' as const,
        addedBy: currentUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Sonny network fields
        isHouseholdMember: false,
        isFamilyMember: true,
        sonnyRole: 'none' as const,
        familyTreeId: member.id
      };
    });

    setImportedCount(newContacts.length);
    
    // Simulate import delay
    setTimeout(() => {
      onImport(newContacts);
      setImportStatus('complete');
      setTimeout(onClose, 2000);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-700',
      emeritus: 'bg-purple-100 text-purple-700',
      developing: 'bg-blue-100 text-blue-700'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Import from Family Tree</h2>
              <p className="text-sm text-gray-600 mt-1">
                Select family members to add as contacts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={importStatus === 'importing'}
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {importStatus === 'selecting' && (
            <>
              {/* Stats and Actions */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{selectedMembers.size}</span> of{' '}
                    <span className="font-semibold text-gray-900">{availableMembers.length}</span> selected
                  </div>
                  {existingFamilyIds.size > 0 && (
                    <div className="text-sm text-gray-500">
                      ({existingFamilyIds.size} already imported)
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={selectAll}
                    className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={selectNone}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {availableMembers.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">All Family Members Imported</h3>
                  <p className="text-gray-600">
                    All available family members have already been added to your contacts.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableMembers.map(member => (
                    <motion.button
                      key={member.id}
                      onClick={() => toggleMember(member.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedMembers.has(member.id)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Checkbox */}
                        <div className="pt-1">
                          {selectedMembers.has(member.id) ? (
                            <CheckCircle className="h-6 w-6 text-indigo-600" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-300" />
                          )}
                        </div>

                        {/* Member Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                              <p className="text-sm text-indigo-600 font-medium">{member.role}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(member.status)}`}>
                              {member.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            {member.email && (
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400">📧</span>
                                <span className="truncate">{member.email}</span>
                              </div>
                            )}
                            {member.phone && (
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400">📱</span>
                                <span>{member.phone}</span>
                              </div>
                            )}
                            {member.location && (
                              <div className="flex items-center space-x-1 col-span-2">
                                <span className="text-gray-400">📍</span>
                                <span className="truncate">{member.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </>
          )}

          {importStatus === 'importing' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Importing Contacts...</h3>
              <p className="text-gray-600">
                Adding {selectedMembers.size} family member{selectedMembers.size !== 1 ? 's' : ''} to your contacts
              </p>
            </div>
          )}

          {importStatus === 'complete' && (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Import Complete!</h3>
              <p className="text-gray-600">
                Successfully imported {importedCount} family member{importedCount !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {importStatus === 'selecting' && availableMembers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedMembers.size > 0 ? (
                <>
                  <UserCheck className="inline h-4 w-4 mr-1 text-green-600" />
                  Ready to import {selectedMembers.size} contact{selectedMembers.size !== 1 ? 's' : ''}
                </>
              ) : (
                <>
                  <AlertCircle className="inline h-4 w-4 mr-1 text-gray-400" />
                  Select at least one family member to import
                </>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={selectedMembers.size === 0}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Import {selectedMembers.size > 0 ? `${selectedMembers.size}` : ''} Contact{selectedMembers.size !== 1 ? 's' : ''}</span>
              </button>
            </div>
          </div>
        )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FamilyTreeImport;
