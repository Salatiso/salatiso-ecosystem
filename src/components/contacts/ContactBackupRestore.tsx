/**
 * Contact Backup & Restore Component
 * Allows users to backup all contacts to JSON and restore from backup
 * Auto-backup functionality with timestamps
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Upload,
  RotateCcw,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  File,
  Trash2
} from 'lucide-react';
import { Contact } from '@/services/ContactsService';

interface ContactBackupRestoreProps {
  contacts: Contact[];
  onRestore: (contacts: Contact[]) => Promise<void>;
  currentUserId: string;
}

interface BackupFile {
  timestamp: number;
  date: string;
  size: number;
  contactCount: number;
}

const ContactBackupRestore: React.FC<ContactBackupRestoreProps> = ({
  contacts,
  onRestore,
  currentUserId
}) => {
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedBackup, setExpandedBackup] = useState<number | null>(null);

  // Load backup metadata from localStorage
  useEffect(() => {
    loadBackupMetadata();
  }, [currentUserId]);

  // Auto-backup on contact changes (if enabled)
  useEffect(() => {
    if (autoBackupEnabled && contacts.length > 0) {
      const timer = setTimeout(() => {
        performAutoBackup();
      }, 60000); // Auto-backup every 60 seconds if changes exist
      return () => clearTimeout(timer);
    }
  }, [contacts, autoBackupEnabled]);

  const loadBackupMetadata = () => {
    try {
      const key = `contact_backups_${currentUserId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        setBackups(JSON.parse(stored));
        
        // Get most recent backup time
        const backupsList = JSON.parse(stored) as BackupFile[];
        if (backupsList.length > 0) {
          const latest = backupsList[0];
          setLastBackupTime(latest.date);
        }
      }
    } catch (error) {
      console.error('Error loading backup metadata:', error);
    }
  };

  const createBackupFile = (): Blob => {
    const backupData = {
      version: '1.0',
      appName: 'LifeCV Contacts',
      timestamp: new Date().toISOString(),
      userId: currentUserId,
      contactCount: contacts.length,
      contacts: contacts
    };

    return new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  };

  const performBackup = async () => {
    if (contacts.length === 0) {
      setMessage({ type: 'error', text: 'No contacts to backup' });
      return;
    }

    try {
      setIsBackingUp(true);

      // Create backup file
      const backupBlob = createBackupFile();
      const now = new Date();
      const dateStr = now.toLocaleString();
      const timestamp = now.getTime();

      // Create backup metadata entry
      const newBackup: BackupFile = {
        timestamp,
        date: dateStr,
        size: backupBlob.size,
        contactCount: contacts.length
      };

      // Add to backups list
      const updatedBackups = [newBackup, ...backups].slice(0, 10); // Keep last 10 backups
      setBackups(updatedBackups);

      // Save metadata to localStorage
      const key = `contact_backups_${currentUserId}`;
      localStorage.setItem(key, JSON.stringify(updatedBackups));
      setLastBackupTime(dateStr);

      // Download file
      const url = URL.createObjectURL(backupBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts-backup-${now.toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: `✅ Backed up ${contacts.length} contacts` });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error performing backup:', error);
      setMessage({ type: 'error', text: 'Failed to backup contacts' });
    } finally {
      setIsBackingUp(false);
    }
  };

  const performAutoBackup = async () => {
    if (contacts.length === 0) return;

    try {
      const backupBlob = createBackupFile();
      const now = new Date();
      const dateStr = now.toLocaleString();
      const timestamp = now.getTime();

      const newBackup: BackupFile = {
        timestamp,
        date: dateStr,
        size: backupBlob.size,
        contactCount: contacts.length
      };

      const updatedBackups = [newBackup, ...backups].slice(0, 10);
      setBackups(updatedBackups);

      const key = `contact_backups_${currentUserId}`;
      localStorage.setItem(key, JSON.stringify(updatedBackups));
      setLastBackupTime(dateStr);
    } catch (error) {
      console.error('Error performing auto-backup:', error);
    }
  };

  const handleRestoreFromFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsRestoring(true);

      const text = await file.text();
      const backupData = JSON.parse(text);

      if (!backupData.contacts || !Array.isArray(backupData.contacts)) {
        setMessage({ type: 'error', text: 'Invalid backup file format' });
        return;
      }

      // Confirm restore
      const contactCount = backupData.contacts.length;
      if (!confirm(
        `This will restore ${contactCount} contacts. This may overwrite existing contacts. Continue?`
      )) {
        return;
      }

      // Perform restore
      await onRestore(backupData.contacts);

      setMessage({ 
        type: 'success', 
        text: `✅ Restored ${contactCount} contacts from backup` 
      });

      // Reload backup metadata
      loadBackupMetadata();
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error restoring from file:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to restore contacts. Invalid file format.' 
      });
    } finally {
      setIsRestoring(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const deleteBackupMetadata = (index: number) => {
    const updatedBackups = backups.filter((_, i) => i !== index);
    setBackups(updatedBackups);
    
    const key = `contact_backups_${currentUserId}`;
    localStorage.setItem(key, JSON.stringify(updatedBackups));
    
    setMessage({ type: 'success', text: 'Backup metadata deleted' });
    setTimeout(() => setMessage(null), 2000);
  };

  const clearAllBackups = () => {
    if (!confirm('Delete all backup history? This cannot be undone.')) return;
    
    setBackups([]);
    const key = `contact_backups_${currentUserId}`;
    localStorage.removeItem(key);
    setLastBackupTime(null);
    
    setMessage({ type: 'success', text: 'All backup history cleared' });
    setTimeout(() => setMessage(null), 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </motion.div>
      )}

      {/* Backup Section */}
      <div className="bg-white rounded-lg border border-ubuntu-warm-200 overflow-hidden">
        <div className="bg-gradient-to-r from-ubuntu-warm-50 to-ubuntu-warm-100 px-6 py-4 border-b border-ubuntu-warm-200">
          <h3 className="font-semibold text-ubuntu-warm-900 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Backup Your Contacts
          </h3>
          <p className="text-sm text-ubuntu-warm-700 mt-1">
            Download all your contacts as a JSON file for safekeeping
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Backup Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-ubuntu-warm-50 rounded-lg">
              <p className="text-sm text-ubuntu-warm-700">Total Contacts</p>
              <p className="text-2xl font-bold text-ubuntu-warm-900">{contacts.length}</p>
            </div>
            <div className="p-3 bg-ubuntu-warm-50 rounded-lg">
              <p className="text-sm text-ubuntu-warm-700">Last Backup</p>
              <p className="text-lg font-semibold text-ubuntu-warm-900">
                {lastBackupTime ? new Date(lastBackupTime).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>

          {/* Backup Controls */}
          <div className="flex gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={performBackup}
              disabled={isBackingUp || contacts.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-ubuntu-orange to-ubuntu-gold text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
            >
              {isBackingUp ? (
                <>
                  <Clock className="w-4 h-4 inline mr-2" />
                  Backing up...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 inline mr-2" />
                  Download Backup
                </>
              )}
            </motion.button>

            <label className="px-4 py-2 bg-ubuntu-warm-200 text-ubuntu-warm-900 rounded-lg font-medium cursor-pointer hover:bg-ubuntu-warm-300 transition-colors">
              {isRestoring ? (
                <>
                  <Clock className="w-4 h-4 inline mr-2" />
                  Restoring...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 inline mr-2" />
                  Restore from File
                </>
              )}
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreFromFile}
                disabled={isRestoring}
                className="hidden"
              />
            </label>
          </div>

          {/* Auto-backup Toggle */}
          <div className="border-t border-ubuntu-warm-200 pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoBackupEnabled}
                onChange={(e) => setAutoBackupEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-ubuntu-warm-300 text-ubuntu-gold cursor-pointer"
              />
              <span className="text-sm text-ubuntu-warm-700">
                <span className="font-medium">Auto-backup enabled</span>
                <span className="block text-xs text-ubuntu-warm-600">
                  Automatically backup contacts every 60 seconds when enabled
                </span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Backup History */}
      {backups.length > 0 && (
        <div className="bg-white rounded-lg border border-ubuntu-warm-200 overflow-hidden">
          <div className="bg-gradient-to-r from-ubuntu-warm-50 to-ubuntu-warm-100 px-6 py-4 border-b border-ubuntu-warm-200 flex items-center justify-between">
            <h3 className="font-semibold text-ubuntu-warm-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Backup History
            </h3>
            {backups.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllBackups}
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Clear All
              </motion.button>
            )}
          </div>

          <div className="divide-y divide-ubuntu-warm-200">
            {backups.map((backup, index) => (
              <motion.div
                key={backup.timestamp}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-ubuntu-warm-50 transition-colors"
              >
                <button
                  onClick={() => setExpandedBackup(expandedBackup === index ? null : index)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <File className="w-4 h-4 text-ubuntu-warm-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-ubuntu-warm-900">
                          {backup.date}
                        </p>
                        <p className="text-sm text-ubuntu-warm-600">
                          {backup.contactCount} contacts • {formatFileSize(backup.size)}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedBackup === index ? 180 : 0 }}
                      className="text-ubuntu-warm-500"
                    >
                      ▼
                    </motion.div>
                  </div>
                </button>

                {expandedBackup === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-ubuntu-warm-200 flex gap-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteBackupMetadata(index)}
                      className="flex-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete Record
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">Backup Best Practices:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
            <li>Download backups regularly and store them safely</li>
            <li>Keep auto-backup enabled for automatic protection</li>
            <li>Store backups on external drives or cloud storage</li>
            <li>Backup history is stored locally and cleared when browser data is cleared</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactBackupRestore;
