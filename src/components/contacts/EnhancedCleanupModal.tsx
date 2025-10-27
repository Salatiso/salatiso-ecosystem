import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Trash2,
  X,
  CheckCircle,
  Search,
  ChevronDown,
  Info,
  Database
} from 'lucide-react';
import { Contact } from '@/services/ContactsService';
import contactsService from '@/services/ContactsService';

interface EnhancedCleanupModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  onCleanupComplete: (deletedCount: number) => void;
}

interface CleanupResult {
  category: string;
  label: string;
  contacts: Contact[];
  count: number;
  description: string;
}

const EnhancedCleanupModal: React.FC<EnhancedCleanupModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onCleanupComplete
}) => {
  const [cleanupResults, setCleanupResults] = useState<CleanupResult[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletedCount, setDeletedCount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Analyze contacts on open
  useEffect(() => {
    if (isOpen) {
      analyzeContacts();
    }
  }, [isOpen, contacts]);

  const analyzeContacts = () => {
    setIsAnalyzing(true);
    setDeletedCount(0);

    const results: CleanupResult[] = [];

    // Category 1: Contacts with NO first name
    const noFirstName = contacts.filter(c => !c.firstName || c.firstName.trim() === '');
    if (noFirstName.length > 0) {
      results.push({
        category: 'no_first_name',
        label: '❌ No First Name',
        contacts: noFirstName,
        count: noFirstName.length,
        description: 'Contacts missing first name - likely false entries'
      });
    }

    // Category 2: Contacts with NO last name
    const noLastName = contacts.filter(c => !c.lastName || c.lastName.trim() === '');
    if (noLastName.length > 0) {
      results.push({
        category: 'no_last_name',
        label: '⚠️ No Last Name',
        contacts: noLastName,
        count: noLastName.length,
        description: 'Contacts missing last name'
      });
    }

    // Category 3: Contacts with NO email and NO phone
    const noContactInfo = contacts.filter(
      c => (!c.emails || c.emails.length === 0) && (!c.phoneNumbers || c.phoneNumbers.length === 0)
    );
    if (noContactInfo.length > 0) {
      results.push({
        category: 'no_contact_info',
        label: '⚠️ No Email or Phone',
        contacts: noContactInfo,
        count: noContactInfo.length,
        description: 'Contacts with no email or phone number'
      });
    }

    // Category 4: Uncategorized contacts
    const uncategorized = contacts.filter(
      c => !c.category || c.category === 'uncategorized' || c.category === ''
    );
    if (uncategorized.length > 0) {
      results.push({
        category: 'uncategorized',
        label: '🏷️ Uncategorized',
        contacts: uncategorized,
        count: uncategorized.length,
        description: 'Contacts without a category'
      });
    }

    // Category 5: Friends
    const friends = contacts.filter(c => c.category === 'friends');
    if (friends.length > 0) {
      results.push({
        category: 'friends',
        label: '👥 Friends',
        contacts: friends,
        count: friends.length,
        description: 'All contacts marked as Friends'
      });
    }

    // Category 6: Colleagues
    const colleagues = contacts.filter(c => c.category === 'colleagues');
    if (colleagues.length > 0) {
      results.push({
        category: 'colleagues',
        label: '💼 Colleagues',
        contacts: colleagues,
        count: colleagues.length,
        description: 'All contacts marked as Colleagues'
      });
    }

    // Category 7: Family
    const family = contacts.filter(c => c.category === 'family');
    if (family.length > 0) {
      results.push({
        category: 'family',
        label: '👨‍👩‍👧‍👦 Family',
        contacts: family,
        count: family.length,
        description: 'All contacts marked as Family'
      });
    }

    // Category 8: Business
    const business = contacts.filter(c => c.category === 'business');
    if (business.length > 0) {
      results.push({
        category: 'business',
        label: '🏢 Business',
        contacts: business,
        count: business.length,
        description: 'All contacts marked as Business'
      });
    }

    // Category 9: Service
    const service = contacts.filter(c => c.category === 'service');
    if (service.length > 0) {
      results.push({
        category: 'service',
        label: '⚙️ Service',
        contacts: service,
        count: service.length,
        description: 'All contacts marked as Service'
      });
    }

    // Category 10: Professional
    const professional = contacts.filter(c => c.category === 'professional');
    if (professional.length > 0) {
      results.push({
        category: 'professional',
        label: '👔 Professional',
        contacts: professional,
        count: professional.length,
        description: 'All contacts marked as Professional'
      });
    }

    setCleanupResults(results);
    setIsAnalyzing(false);
    setSelectedCategories(new Set()); // Start with nothing selected
  };

  const toggleCategory = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  const toggleAll = () => {
    if (selectedCategories.size === cleanupResults.length) {
      setSelectedCategories(new Set());
    } else {
      setSelectedCategories(new Set(cleanupResults.map(r => r.category)));
    }
  };

  const getContactsToDelete = (): Contact[] => {
    return cleanupResults
      .filter(r => selectedCategories.has(r.category))
      .flatMap(r => r.contacts)
      // Remove duplicates by ID
      .filter((contact, index, self) => self.findIndex(c => c.id === contact.id) === index);
  };

  const handleCleanup = async () => {
    const contactsToDelete = getContactsToDelete();

    if (contactsToDelete.length === 0) {
      alert('Please select at least one category to delete');
      return;
    }

    const confirmMsg = `⚠️ WARNING: You are about to delete ${contactsToDelete.length} contact(s).\n\nThey will be moved to the Recycle Bin and can be restored for 30 days.\n\nContinue?`;
    if (!confirm(confirmMsg)) {
      return;
    }

    setIsDeleting(true);
    let deleted = 0;
    let failed = 0;

    try {
      for (const contact of contactsToDelete) {
        try {
          // Use soft delete instead of permanent delete - contacts go to recycle bin!
          await contactsService.deleteContact(contact.id, '');
          deleted++;
          console.log(`✅ Soft deleted: ${contact.firstName} ${contact.lastName}`);
        } catch (error) {
          failed++;
          console.error(`❌ Failed to delete ${contact.firstName}:`, error);
        }
      }

      setDeletedCount(deleted);
      setShowResults(true);

      console.log(`✅ Cleanup complete: ${deleted} contacts deleted, ${failed} failed`);
      alert(`✅ Cleanup Complete!\n\n✅ Deleted: ${deleted}\n❌ Failed: ${failed}\n\nDeleted contacts are in the Recycle Bin for 30 days.`);

      setTimeout(() => {
        onCleanupComplete(deleted);
        setShowResults(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error during cleanup:', error);
      alert('❌ Error during cleanup. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  // Show results page
  if (showResults) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-sm w-full p-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">
              Cleanup Complete!
            </h3>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-4">
              {deletedCount} contacts have been moved to the Recycle Bin
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-700 dark:text-green-300">
                💡 Tip: You can restore them from the Recycle Bin for the next 30 days.
              </p>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border-b border-blue-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Clean Database</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select categories to review and delete
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {isAnalyzing ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : cleanupResults.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3 opacity-50" />
                <p className="text-slate-500 dark:text-slate-400">
                  Database is clean! No issues detected.
                </p>
              </div>
            ) : (
              <>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search contact names..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
                  />
                </div>

                {/* Select All */}
                <button
                  onClick={toggleAll}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {selectedCategories.size === cleanupResults.length
                    ? '🔘 Deselect All'
                    : '🔘 Select All'}
                </button>

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-2">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Selected contacts will be soft-deleted and moved to the Recycle Bin where they can be restored for 30 days.
                  </p>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  {cleanupResults.map((result, idx) => {
                    const isExpanded = expandedCategory === result.category;
                    const isSelected = selectedCategories.has(result.category);

                    return (
                      <div key={result.category}>
                        {/* Category Header */}
                        <motion.button
                          onClick={() => toggleCategory(result.category)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-600'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-5 h-5 cursor-pointer"
                          />
                          <div className="flex-1 text-left">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {result.label}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {result.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-600 dark:text-slate-300">
                              {result.count}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-slate-400 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </motion.button>

                        {/* Contact List */}
                        <AnimatePresence>
                          {isExpanded && isSelected && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-slate-50 dark:bg-slate-800 border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-lg p-3 space-y-2">
                                {result.contacts
                                  .filter(c => {
                                    if (!searchTerm) return true;
                                    const fullName =
                                      `${c.firstName} ${c.lastName}`.toLowerCase();
                                    return fullName.includes(searchTerm.toLowerCase());
                                  })
                                  .slice(0, 10)
                                  .map(contact => (
                                    <div
                                      key={contact.id}
                                      className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                                    >
                                      <span className="text-slate-400">•</span>
                                      <span>
                                        {contact.firstName} {contact.lastName}
                                      </span>
                                      {contact.emails.length > 0 && (
                                        <span className="text-xs text-slate-500 ml-auto">
                                          {contact.emails[0]}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                {result.contacts.length > 10 && (
                                  <p className="text-xs text-slate-500 italic text-center mt-2">
                                    +{result.contacts.length - 10} more...
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Stats */}
                {selectedCategories.size > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      🗑️ {getContactsToDelete().length} contact(s) will be deleted
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!isAnalyzing && cleanupResults.length > 0 && (
            <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCleanup}
                disabled={isDeleting || selectedCategories.size === 0}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default EnhancedCleanupModal;
