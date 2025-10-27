import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  RotateCcw,
  X,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  Mail,
  Phone,
  Clock,
  Search
} from 'lucide-react';
import { Contact } from '@/services/ContactsService';
import contactsService from '@/services/ContactsService';

interface RecycleBinProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onContactRestored: (contact: Contact) => void;
}

const RECYCLE_BIN_RETENTION_DAYS = 30;

const RecycleBin: React.FC<RecycleBinProps> = ({ userId, isOpen, onClose, onContactRestored }) => {
  const [deletedContacts, setDeletedContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [permanentlyDeletingId, setPermanentlyDeletingId] = useState<string | null>(null);
  const [filterExpired, setFilterExpired] = useState(false);

  // Load deleted contacts
  useEffect(() => {
    if (!isOpen) return;

    const loadDeletedContacts = async () => {
      try {
        setLoading(true);
        const deleted = await contactsService.getDeletedContacts(userId);
        setDeletedContacts(deleted);
      } catch (error) {
        console.error('Error loading deleted contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDeletedContacts();
  }, [isOpen, userId]);

  // Calculate days remaining
  const getDaysRemaining = (deletedAt?: Date): number => {
    if (!deletedAt) return RECYCLE_BIN_RETENTION_DAYS;
    const now = new Date();
    const deletedDate = new Date(deletedAt);
    const daysElapsed = Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, RECYCLE_BIN_RETENTION_DAYS - daysElapsed);
  };

  const isExpired = (deletedAt?: Date): boolean => getDaysRemaining(deletedAt) === 0;

  // Filter contacts
  const filteredContacts = deletedContacts.filter(contact => {
    const matchesSearch =
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.emails.some(email => email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      contact.phoneNumbers.some(phone => phone.includes(searchTerm));

    if (filterExpired) {
      return matchesSearch && isExpired(contact.deletedAt);
    }
    return matchesSearch;
  });

  // Restore contact
  const handleRestore = async (contactId: string) => {
    try {
      setRestoringId(contactId);
      await contactsService.restoreContact(contactId);
      
      const restoredContact = deletedContacts.find(c => c.id === contactId);
      if (restoredContact) {
        onContactRestored(restoredContact);
      }

      // Remove from deleted list
      setDeletedContacts(prev => prev.filter(c => c.id !== contactId));
    } catch (error) {
      console.error('Error restoring contact:', error);
      alert('Failed to restore contact. Please try again.');
    } finally {
      setRestoringId(null);
    }
  };

  // Permanently delete contact
  const handlePermanentlyDelete = async (contactId: string, contactName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${contactName}"? This action CANNOT be undone.`)) {
      return;
    }

    try {
      setPermanentlyDeletingId(contactId);
      await contactsService.permanentlyDeleteContact(contactId);
      setDeletedContacts(prev => prev.filter(c => c.id !== contactId));
    } catch (error) {
      console.error('Error permanently deleting contact:', error);
      alert('Failed to permanently delete contact. Please try again.');
    } finally {
      setPermanentlyDeletingId(null);
    }
  };

  // Empty recycle bin
  const handleEmptyRecycleBin = async () => {
    if (!confirm('Are you sure you want to permanently delete ALL deleted contacts? This action CANNOT be undone.')) {
      return;
    }

    try {
      for (const contact of deletedContacts) {
        await contactsService.permanentlyDeleteContact(contact.id);
      }
      setDeletedContacts([]);
      alert('✅ Recycle bin emptied successfully.');
    } catch (error) {
      console.error('Error emptying recycle bin:', error);
      alert('Failed to empty recycle bin. Please try again.');
    }
  };

  if (!isOpen) return null;

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
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-red-50 dark:from-slate-800 dark:to-slate-800 border-b border-orange-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recycle Bin</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Contacts deleted here can be restored for {RECYCLE_BIN_RETENTION_DAYS} days
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
          {/* Search and Filter */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search deleted contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex gap-2 items-center">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterExpired}
                  onChange={(e) => setFilterExpired(e.target.checked)}
                  className="rounded"
                />
                Show only expiring soon
              </label>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Deleted</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{deletedContacts.length}</p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-xs text-slate-500 dark:text-slate-400">Available</p>
              <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {deletedContacts.filter(c => !isExpired(c.deletedAt)).length}
              </p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-xs text-slate-500 dark:text-slate-400">Expiring</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {deletedContacts.filter(c => isExpired(c.deletedAt)).length}
              </p>
            </div>
          </div>

          {/* Deleted Contacts List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3 opacity-50" />
              <p className="text-slate-500 dark:text-slate-400">No deleted contacts found</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredContacts.map((contact, index) => {
                  const daysLeft = getDaysRemaining(contact.deletedAt);
                  const isExpiredContact = isExpired(contact.deletedAt);
                  const isRemoving = restoringId === contact.id || permanentlyDeletingId === contact.id;

                  return (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 border rounded-lg transition-all ${
                        isExpiredContact
                          ? 'border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                      } ${isRemoving ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Contact Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {contact.firstName} {contact.lastName}
                          </h3>

                          <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                            {contact.emails.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{contact.emails[0]}</span>
                              </div>
                            )}
                            {contact.phoneNumbers.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{contact.phoneNumbers[0]}</span>
                              </div>
                            )}
                            {contact.addresses.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="truncate text-xs">{contact.addresses[0]}</span>
                              </div>
                            )}
                          </div>

                          {/* Deletion Info */}
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <Clock className="w-3.5 h-3.5" />
                              {contact.deletedAt && (
                                <>
                                  Deleted {new Date(contact.deletedAt).toLocaleDateString()} •{' '}
                                  {daysLeft > 0 ? (
                                    <span className={isExpiredContact ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-orange-600 dark:text-orange-400'}>
                                      {daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
                                    </span>
                                  ) : (
                                    <span className="text-red-600 dark:text-red-400 font-semibold">Expiring today</span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleRestore(contact.id)}
                            disabled={isRemoving || restoringId !== null}
                            className="p-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Restore this contact"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePermanentlyDelete(contact.id, `${contact.firstName} ${contact.lastName}`)}
                            disabled={isRemoving}
                            className="p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Permanently delete this contact"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Footer Actions */}
          {deletedContacts.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex gap-3">
              <button
                onClick={handleEmptyRecycleBin}
                className="flex-1 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Empty Recycle Bin
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default RecycleBin;
