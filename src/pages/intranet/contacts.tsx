import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  UserCheck,
  Home,
  Shield,
  X,
  Settings,
  Grid3x3,
  List,
  Table2,
  Trash2,
  Tag
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import IntranetLayout from '@/components/layouts/IntranetLayout';
import ContactCard from '@/components/contacts/ContactCard';
import ContactListView from '@/components/contacts/ContactListView';
import ContactTableView from '@/components/contacts/ContactTableView';
import ContactForm from '@/components/contacts/ContactForm';
import ImportExport from '@/components/contacts/ImportExport';
import FamilyTreeImport from '@/components/contacts/FamilyTreeImport';
import SuggestionWidget from '@/components/contacts/SuggestionWidget';
import MergeDialog from '@/components/contacts/MergeDialog';
import InviteModal from '@/components/contacts/InviteModal';
import PresenceSettingsModal from '@/components/presence/PresenceSettingsModal';
import ContactDetailModal from '@/components/contacts/ContactDetailModal';
import ContactBackupRestore from '@/components/contacts/ContactBackupRestore';
import RecycleBin from '@/components/contacts/RecycleBin';
import EnhancedCleanupModal from '@/components/contacts/EnhancedCleanupModal';
import { AccessibleInput, AccessibleSelect } from '@/components/accessibility';
import contactsService, { Contact } from '@/services/ContactsService';
import presenceService from '@/services/PresenceService';
import { duplicateDetectionService, DuplicateMatch } from '@/services/DuplicateDetectionService';

const ContactsPage: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showFamilyImport, setShowFamilyImport] = useState(false);
  const [showPresenceSettings, setShowPresenceSettings] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterSonnyRole, setFilterSonnyRole] = useState<string>('all');
  const [filterHousehold, setFilterHousehold] = useState<boolean | null>(null);
  const [filterFamily, setFilterFamily] = useState<boolean | null>(null);
  const [currentDuplicate, setCurrentDuplicate] = useState<DuplicateMatch | null>(null);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedContactForInvite, setSelectedContactForInvite] = useState<Contact | null>(null);
  const [selectedContactForDetail, setSelectedContactForDetail] = useState<Contact | null>(null);
  const [showBackupRestore, setShowBackupRestore] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  
  // Sorting and pagination
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 20;
  
  // View format
  const [viewFormat, setViewFormat] = useState<'grid' | 'list' | 'table'>('grid');

  // Bulk operations
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  // Cleanup operations
  const [showEnhancedCleanup, setShowEnhancedCleanup] = useState(false);
  const [cleanupStats, setCleanupStats] = useState<{ kept: number; deleted: number } | null>(null);

  // Initialize presence tracking
  useEffect(() => {
    if (user) {
      const displayName = user.displayName || user.email || 'User';
      presenceService.initializePresence(user.id, displayName);

      // Cleanup on unmount
      return () => {
        presenceService.cleanupPresence(user.id);
      };
    }
  }, [user]);

  // Load contacts from Firestore
  useEffect(() => {
    const loadContacts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userContacts = await contactsService.getUserContacts(user.id);
        setContacts(userContacts);
      } catch (error) {
        console.error('Error loading contacts:', error);
        // Still set contacts to empty array on error
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [user]);

  // Filter contacts based on search and filters
  useEffect(() => {
    let filtered = contacts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.emails.some(email => email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        contact.phoneNumbers.some(phone => phone.includes(searchTerm)) ||
        contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(contact => contact.category === filterCategory);
    }

    // Tag filter
    if (filterTag !== 'all') {
      filtered = filtered.filter(contact => contact.tags.includes(filterTag));
    }

    // Sonny role filter
    if (filterSonnyRole !== 'all') {
      filtered = filtered.filter(contact => contact.sonnyRole === filterSonnyRole);
    }

    // Household filter
    if (filterHousehold !== null) {
      filtered = filtered.filter(contact => contact.isHouseholdMember === filterHousehold);
    }

    // Family filter
    if (filterFamily !== null) {
      filtered = filtered.filter(contact => contact.isFamilyMember === filterFamily);
    }

    // Apply sorting
    if (sortOrder === 'asc') {
      filtered = [...filtered].sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (sortOrder === 'desc') {
      filtered = [...filtered].sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameB.localeCompare(nameA);
      });
    }
    // default: keep Firestore order (createdAt desc)

    setFilteredContacts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [contacts, searchTerm, filterCategory, filterTag, filterSonnyRole, filterHousehold, filterFamily, sortOrder]);

  const handleAddContact = async (contactData: Omit<Contact, 'id' | 'addedBy' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      // Add to Firestore
      const contactId = await contactsService.addContact({
        ...contactData,
        addedBy: user.id
      });

      // Update local state with the new contact
      const newContact: Contact = {
        ...contactData,
        id: contactId,
        addedBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setContacts(prev => [...prev, newContact]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact. Please try again.');
    }
  };

  const handleEditContact = async (contactData: Omit<Contact, 'id' | 'addedBy' | 'createdAt' | 'updatedAt'>) => {
    if (!editingContact) return;

    try {
      // Update in Firestore
      await contactsService.updateContact(editingContact.id, contactData);

      // Update local state
      const updatedContact: Contact = {
        ...editingContact,
        ...contactData,
        updatedAt: new Date()
      };

      setContacts(prev => prev.map(c => c.id === editingContact.id ? updatedContact : c));
      setEditingContact(null);
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact. Please try again.');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact? You can restore it within 30 days from the Recycle Bin.')) return;
    if (!user) return;

    try {
      // Soft delete from Firestore (moves to recycle bin)
      await contactsService.deleteContact(contactId, user.id);

      // Update local state
      setContacts(prev => prev.filter(c => c.id !== contactId));
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact. Please try again.');
    }
  };

  // Bulk operations
  const toggleSelectContact = (contactId: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.size === 0) return;
    if (!user) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedContacts.size} contacts? They can be restored within 30 days from the Recycle Bin.`)) {
      return;
    }

    try {
      // Soft delete all selected contacts from Firestore
      for (const contactId of selectedContacts) {
        await contactsService.deleteContact(contactId, user.id);
      }

      // Update local state
      setContacts(prev => prev.filter(c => !selectedContacts.has(c.id)));
      setSelectedContacts(new Set());
      setBulkDeleteConfirm(false);
      alert(`✅ Successfully deleted ${selectedContacts.size} contacts. You can restore them from the Recycle Bin.`);
    } catch (error) {
      console.error('Error deleting contacts:', error);
      alert('Failed to delete some contacts. Please try again.');
    }
  };

  const handleCleanupComplete = (deletedCount: number) => {
    // Reload contacts to reflect the deleted ones
    if (user) {
      contactsService.getUserContacts(user.id).then(userContacts => {
        setContacts(userContacts);
        setCleanupStats({ kept: userContacts.length, deleted: deletedCount });
      });
    }
  };

  const handleBulkExport = () => {
    if (selectedContacts.size === 0) {
      alert('Please select at least one contact to export');
      return;
    }

    try {
      const contactsToExport = filteredContacts.filter(c => selectedContacts.has(c.id));
      
      // Convert to CSV
      const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Category', 'Tags', 'Notes'];
      const rows = contactsToExport.map(c => [
        c.firstName,
        c.lastName,
        c.emails.join(';'),
        c.phoneNumbers.join(';'),
        `${c.address?.street || ''} ${c.address?.city || ''} ${c.address?.state || ''} ${c.address?.zip || ''}`.trim(),
        c.category,
        c.tags.join(';'),
        c.notes || ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `contacts-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`✅ Exported ${selectedContacts.size} contacts to CSV`);
      setSelectedContacts(new Set());
    } catch (error) {
      console.error('Error exporting contacts:', error);
      alert('Failed to export contacts. Please try again.');
    }
  };

  const handleBulkAddTag = () => {
    if (selectedContacts.size === 0) return;

    const newTag = prompt('Enter tag name to add to selected contacts:');
    if (!newTag) return;

    try {
      // Add tag to all selected contacts
      const updatedContacts = contacts.map(contact => {
        if (selectedContacts.has(contact.id)) {
          const updatedContact = {
            ...contact,
            tags: Array.from(new Set([...contact.tags, newTag]))
          };
          // Update in Firestore
          contactsService.updateContact(contact.id, updatedContact).catch(err => 
            console.error('Error updating contact tags:', err)
          );
          return updatedContact;
        }
        return contact;
      });

      setContacts(updatedContacts);
      setSelectedContacts(new Set());
      alert(`✅ Added tag "${newTag}" to ${selectedContacts.size} contacts`);
    } catch (error) {
      console.error('Error adding tags:', error);
      alert('Failed to add tags. Please try again.');
    }
  };

  const handleViewDetails = (contact: Contact) => {
    setSelectedContactForDetail(contact);
  };

  const handleRestoreContacts = async (restoredContacts: Contact[]) => {
    try {
      // Add the restored contacts to Firestore
      for (const contact of restoredContacts) {
        // Generate new ID for each restored contact to avoid conflicts
        const newContact = {
          ...contact,
          id: undefined, // Remove old ID to generate new one
          userId: user?.id || ''
        };
        await contactsService.addContact(newContact as any);
      }
      
      // Reload all contacts
      const userContacts = await contactsService.getUserContacts(user?.id || '');
      setContacts(userContacts);
    } catch (error) {
      console.error('Error restoring contacts:', error);
      throw error;
    }
  };

  const handleImportFromFamilyTree = async (importedContacts: Contact[]) => {
    if (!user) {
      alert('Error: User not authenticated. Please log in again.');
      return;
    }

    try {
      console.log(`[Import] Starting import of ${importedContacts.length} contacts`);
      
      // Check for duplicates before importing
      const duplicates: DuplicateMatch[] = [];
      const newContactsToImport: Contact[] = [];
      
      for (const newContact of importedContacts) {
        const dup = duplicateDetectionService.findDuplicates(newContact, contacts);
        if (dup.length > 0) {
          duplicates.push(...dup);
        } else {
          newContactsToImport.push(newContact);
        }
      }

      console.log(`[Import] Found ${duplicates.length} duplicates, ${newContactsToImport.length} new contacts`);

      // If duplicates found, show merge dialog for first one
      if (duplicates.length > 0) {
        setCurrentDuplicate(duplicates[0]);
        setShowMergeDialog(true);
        // Store the remaining contacts for processing after merge
        sessionStorage.setItem('pendingImports', JSON.stringify(newContactsToImport));
        
        if (newContactsToImport.length > 0) {
          console.log(`[Import] Showing merge dialog. Will import ${newContactsToImport.length} new contacts after merge.`);
        }
        return;
      }

      if (newContactsToImport.length === 0) {
        alert('No new contacts to import. All contacts appear to be duplicates.');
        setShowFamilyImport(false);
        return;
      }

      // Prepare contacts with required fields
      const contactsToSave = newContactsToImport.map(c => {
        // Ensure required fields are present
        const prepared = {
          ...c,
          firstName: c.firstName || 'Unknown',
          lastName: c.lastName || '',
          addedBy: user.id,
          // Ensure all addresses are properly set
          addresses: (c.addresses || []).filter(a => a && a.trim()),
          // Ensure all phone numbers are properly set
          phoneNumbers: (c.phoneNumbers || []).filter(a => a && a.trim()),
          // Ensure all emails are properly set
          emails: (c.emails || []).filter(a => a && a.trim()),
          tags: c.tags || [],
          notes: c.notes || '',
          category: c.category || 'other'
        };
        
        // Remove id temporarily as Firestore will generate it
        const { id, ...dataToSave } = prepared;
        return dataToSave;
      });

      console.log(`[Import] Saving ${contactsToSave.length} contacts to Firestore...`);
      
      // Save all imported contacts to Firestore in a batch
      const contactIds = await contactsService.addContactsBatch(contactsToSave as any);
      
      console.log(`[Import] Successfully saved contacts with IDs:`, contactIds);

      // Verify contacts were saved by loading them back
      console.log(`[Import] Verifying saved contacts by reloading from Firestore...`);
      const savedContacts = await contactsService.getUserContacts(user.id);
      console.log(`[Import] Verification: Found ${savedContacts.length} total contacts in Firestore`);

      // Update local state with the new contacts including their Firestore IDs
      const contactsWithIds = newContactsToImport.map((contact, index) => ({
        ...contact,
        id: contactIds[index],
        addedBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      setContacts(savedContacts); // Use freshly loaded contacts to ensure consistency
      setShowFamilyImport(false);
      setShowImportExport(false);
      
      // Show success message with details
      const message = `✅ Import Complete\n\n${newContactsToImport.length} new contacts added\n${duplicates.length} duplicates detected\n\nAll contacts have been saved to your Firestore database.`;
      alert(message);
      
      console.log(`[Import] Import completed successfully. Total contacts now: ${savedContacts.length}`);
    } catch (error) {
      console.error('Error importing contacts from family tree:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Failed to import contacts. Please try again.';
      if (error instanceof Error) {
        errorMessage += `\n\nError details: ${error.message}`;
      }
      alert(errorMessage);
    }
  };

  const categories = [
    { id: 'all', name: 'All Categories', color: 'bg-gray-100 text-gray-700' },
    { id: 'family', name: 'Family', color: 'bg-blue-100 text-blue-700' },
    { id: 'friend', name: 'Friends', color: 'bg-green-100 text-green-700' },
    { id: 'business', name: 'Business', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'professional', name: 'Professional', color: 'bg-purple-100 text-purple-700' },
    { id: 'service', name: 'Services', color: 'bg-red-100 text-red-700' }
  ];

  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags)));

  if (loading) {
    return (
      <IntranetLayout title="Contacts">
        <div className="min-h-screen bg-ubuntu-warm-50 flex items-center justify-center">
          <div className="text-center">
            <Users className="w-12 h-12 text-ubuntu-gold mx-auto mb-4 animate-pulse" />
            <p className="text-ubuntu-warm-700">Loading contacts...</p>
          </div>
        </div>
      </IntranetLayout>
    );
  }

  return (
    <IntranetLayout title="Family Contacts">
      <div className="min-h-screen bg-ubuntu-warm-50">
        {/* Header */}
      <div className="bg-white shadow-sm border-b border-ubuntu-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-ubuntu font-bold text-ubuntu-warm-900">
                Family Contacts
              </h1>
              <p className="text-ubuntu-warm-600 mt-1">
                Manage your family and business contacts in one place
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPresenceSettings(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                title="Presence & Privacy Settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                Privacy
              </button>
              <button
                onClick={() => setShowEnhancedCleanup(true)}
                className="inline-flex items-center px-4 py-2 border border-orange-300 rounded-lg text-orange-700 hover:bg-orange-50 transition-colors font-medium"
                title="Review and clean database - remove false entries, duplicates, and organize by category"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clean Database
              </button>
              <button
                onClick={() => setShowFamilyImport(true)}
                className="inline-flex items-center px-4 py-2 border-2 border-indigo-300 rounded-lg text-indigo-700 hover:bg-indigo-50 transition-colors font-medium"
              >
                <Users className="w-4 h-4 mr-2" />
                Import from Family Tree
              </button>
              <button
                onClick={() => setShowImportExport(true)}
                className="inline-flex items-center px-4 py-2 border border-ubuntu-warm-300 rounded-lg text-ubuntu-warm-700 hover:bg-ubuntu-warm-50 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import/Export
              </button>
              <button
                onClick={() => setShowBackupRestore(true)}
                className="inline-flex items-center px-4 py-2 border border-purple-300 rounded-lg text-purple-700 hover:bg-purple-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Backup/Restore
              </button>
              <button
                onClick={() => setShowRecycleBin(true)}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Recycle Bin
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-6 py-2 bg-ubuntu-gold text-white rounded-lg hover:bg-ubuntu-gold/90 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </button>
            </div>
          </div>
          
          {/* View Format Toggle */}
          <div className="mt-4 flex items-center gap-2 border-t border-ubuntu-warm-200 pt-4">
            <span className="text-sm font-medium text-ubuntu-warm-700">View:</span>
            <button
              onClick={() => setViewFormat('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewFormat === 'grid'
                  ? 'bg-ubuntu-gold text-white'
                  : 'bg-ubuntu-warm-100 text-ubuntu-warm-700 hover:bg-ubuntu-warm-200'
              }`}
              title="Grid View"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setViewFormat('list'); setCurrentPage(1); }}
              className={`p-2 rounded-lg transition-colors ${
                viewFormat === 'list'
                  ? 'bg-ubuntu-gold text-white'
                  : 'bg-ubuntu-warm-100 text-ubuntu-warm-700 hover:bg-ubuntu-warm-200'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setViewFormat('table'); setCurrentPage(1); }}
              className={`p-2 rounded-lg transition-colors ${
                viewFormat === 'table'
                  ? 'bg-ubuntu-gold text-white'
                  : 'bg-ubuntu-warm-100 text-ubuntu-warm-700 hover:bg-ubuntu-warm-200'
              }`}
              title="Table View"
            >
              <Table2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-ubuntu-warm-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ubuntu-warm-400" />
              <AccessibleInput
                label="Search contacts"
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <AccessibleSelect
              label="Filter by category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              options={categories.map(category => ({
                value: category.id,
                label: category.name
              }))}
            />

            {/* Tag Filter */}
            <AccessibleSelect
              label="Filter by tag"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              options={[
                { value: 'all', label: 'All Tags' },
                ...allTags.map(tag => ({ value: tag, label: tag }))
              ]}
            />

            {/* Sort Order */}
            <AccessibleSelect
              label="Sort contacts"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | 'default')}
              options={[
                { value: 'default', label: 'Default (Newest)' },
                { value: 'asc', label: 'A-Z (A to Z)' },
                { value: 'desc', label: 'Z-A (Z to A)' }
              ]}
            />

            {/* Results Count */}
            <div className="flex items-center text-ubuntu-warm-600">
              <Users className="w-4 h-4 mr-2" />
              {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Sonny Network Filters */}
          <div className="mt-4 pt-4 border-t border-ubuntu-warm-200">
            <h4 className="text-sm font-semibold text-ubuntu-warm-700 mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-indigo-600" />
              Sonny Network Filters
            </h4>
            <div className="flex flex-wrap gap-2">
              {/* Household Filter */}
              <button
                onClick={() => setFilterHousehold(filterHousehold === true ? null : true)}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterHousehold === true
                    ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                <Home className="w-4 h-4 mr-1.5" />
                Household Only
                {contacts.filter(c => c.isHouseholdMember).length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-white rounded text-xs">
                    {contacts.filter(c => c.isHouseholdMember).length}
                  </span>
                )}
              </button>

              {/* Family Filter */}
              <button
                onClick={() => setFilterFamily(filterFamily === true ? null : true)}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterFamily === true
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                <UserCheck className="w-4 h-4 mr-1.5" />
                Family Members
                {contacts.filter(c => c.isFamilyMember).length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-white rounded text-xs">
                    {contacts.filter(c => c.isFamilyMember).length}
                  </span>
                )}
              </button>

              {/* Sonny Role Filters */}
              {['monitor', 'monitored', 'both'].map(role => (
                <button
                  key={role}
                  onClick={() => setFilterSonnyRole(filterSonnyRole === role ? 'all' : role)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterSonnyRole === role
                      ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <Shield className="w-4 h-4 mr-1.5" />
                  {role === 'monitor' && 'I Monitor'}
                  {role === 'monitored' && 'They Monitor'}
                  {role === 'both' && 'Mutual'}
                  {contacts.filter(c => c.sonnyRole === role).length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-white rounded text-xs">
                      {contacts.filter(c => c.sonnyRole === role).length}
                    </span>
                  )}
                </button>
              ))}

              {/* Clear Sonny Filters */}
              {(filterHousehold !== null || filterFamily !== null || filterSonnyRole !== 'all') && (
                <button
                  onClick={() => {
                    setFilterHousehold(null);
                    setFilterFamily(null);
                    setFilterSonnyRole('all');
                  }}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Operations Toolbar */}
        {selectedContacts.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-ubuntu-gold mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedContacts.size === filteredContacts.length}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded border-gray-300 text-ubuntu-gold cursor-pointer"
                  />
                  <span className="ml-3 font-medium text-ubuntu-warm-900">
                    {selectedContacts.size} contact{selectedContacts.size !== 1 ? 's' : ''} selected
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkAddTag}
                  className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                  title="Add tag to selected contacts"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Add Tag
                </button>
                <button
                  onClick={handleBulkExport}
                  className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
                  title="Export selected contacts as CSV"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
                <button
                  onClick={() => setBulkDeleteConfirm(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                  title="Delete selected contacts"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedContacts(new Set())}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Deselect all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bulk Delete Confirmation */}
            {bulkDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-800 font-medium mb-3">
                  Are you sure you want to delete {selectedContacts.size} contact{selectedContacts.size !== 1 ? 's' : ''}? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Yes, Delete Permanently
                  </button>
                  <button
                    onClick={() => setBulkDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Contacts Grid */}
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-ubuntu-warm-300 mx-auto mb-4" />
            <h3 className="text-xl font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
              No contacts found
            </h3>
            <p className="text-ubuntu-warm-600 mb-6">
              {searchTerm || filterCategory !== 'all' || filterTag !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start building your contact network'
              }
            </p>
            {!searchTerm && filterCategory === 'all' && filterTag === 'all' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-6 py-3 bg-ubuntu-gold text-white rounded-lg hover:bg-ubuntu-gold/90 transition-colors"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add Your First Contact
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Render Based on View Format */}
            {viewFormat === 'grid' ? (
              <>
                {/* Contacts Grid with Pagination */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredContacts
                    .slice((currentPage - 1) * contactsPerPage, currentPage * contactsPerPage)
                    .map(contact => (
                      <ContactCard
                        key={contact.id}
                        contact={contact}
                        onEdit={() => setEditingContact(contact)}
                        onDelete={() => handleDeleteContact(contact.id)}
                        onViewDetails={() => handleViewDetails(contact)}
                        currentUserId={user?.id || ''}
                        allContacts={contacts}
                        isSelected={selectedContacts.has(contact.id)}
                        onSelectChange={(selected) => {
                          if (selected) {
                            setSelectedContacts(prev => new Set([...prev, contact.id]));
                          } else {
                            setSelectedContacts(prev => {
                              const newSet = new Set(prev);
                              newSet.delete(contact.id);
                              return newSet;
                            });
                          }
                        }}
                        onContactClick={(suggestedContact) => {
                          // Scroll to and highlight the suggested contact
                          setSearchTerm('');
                          setFilterCategory('all');
                          setFilterTag('all');
                          setCurrentPage(1);
                          // Optionally open the contact
                          setEditingContact(suggestedContact);
                        }}
                      />
                    ))}
                </div>
              </>
            ) : viewFormat === 'list' ? (
              <ContactListView
                contacts={filteredContacts
                  .slice((currentPage - 1) * contactsPerPage, currentPage * contactsPerPage)}
                onEdit={(contact) => setEditingContact(contact)}
                onDelete={(contactId) => handleDeleteContact(contactId)}
                currentUserId={user?.id || ''}
                isSelected={(contactId) => selectedContacts.has(contactId)}
                onSelect={(contactId, selected) => {
                  if (selected) {
                    setSelectedContacts(prev => new Set([...prev, contactId]));
                  } else {
                    setSelectedContacts(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(contactId);
                      return newSet;
                    });
                  }
                }}
              />
            ) : (
              <ContactTableView
                contacts={filteredContacts
                  .slice((currentPage - 1) * contactsPerPage, currentPage * contactsPerPage)}
                onEdit={(contact) => setEditingContact(contact)}
                onDelete={(contactId) => handleDeleteContact(contactId)}
                currentUserId={user?.id || ''}
                isSelected={(contactId) => selectedContacts.has(contactId)}
                onSelect={(contactId, selected) => {
                  if (selected) {
                    setSelectedContacts(prev => new Set([...prev, contactId]));
                  } else {
                    setSelectedContacts(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(contactId);
                      return newSet;
                    });
                  }
                }}
              />
            )}

            {/* Pagination Controls */}
            {filteredContacts.length > contactsPerPage && (
              <div className="mt-8 flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-ubuntu-warm-200">
                <div className="text-sm text-ubuntu-warm-600">
                  Showing {(currentPage - 1) * contactsPerPage + 1} to{' '}
                  {Math.min(currentPage * contactsPerPage, filteredContacts.length)} of{' '}
                  {filteredContacts.length} contacts
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-ubuntu-warm-200 text-ubuntu-warm-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ubuntu-warm-50"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.ceil(filteredContacts.length / contactsPerPage) },
                      (_, i) => i + 1
                    ).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-ubuntu-gold text-white'
                            : 'border border-ubuntu-warm-200 text-ubuntu-warm-700 hover:bg-ubuntu-warm-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          Math.ceil(filteredContacts.length / contactsPerPage),
                          currentPage + 1
                        )
                      )
                    }
                    disabled={currentPage === Math.ceil(filteredContacts.length / contactsPerPage)}
                    className="px-4 py-2 rounded-lg border border-ubuntu-warm-200 text-ubuntu-warm-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ubuntu-warm-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Contact Modal */}
      {(showAddForm || editingContact) && (
        <ContactForm
          contact={editingContact}
          onSave={editingContact ? handleEditContact : handleAddContact}
          onCancel={() => {
            setShowAddForm(false);
            setEditingContact(null);
          }}
        />
      )}

      {/* Import/Export Modal */}
      {showImportExport && (
        <ImportExport
          contacts={contacts}
          onImport={(newContacts: Contact[]) => handleImportFromFamilyTree(newContacts)}
          onClose={() => setShowImportExport(false)}
        />
      )}

      {/* Family Tree Import Modal */}
      {showFamilyImport && (
        <FamilyTreeImport
          existingContacts={contacts}
          onImport={handleImportFromFamilyTree}
          onClose={() => setShowFamilyImport(false)}
          currentUserId={user?.id || ''}
        />
      )}

      {/* Presence Settings Modal */}
      {showPresenceSettings && (
        <PresenceSettingsModal
          isOpen={showPresenceSettings}
          onClose={() => setShowPresenceSettings(false)}
        />
      )}

      {/* Contact Detail Modal */}
      {selectedContactForDetail && (
        <ContactDetailModal
          contact={selectedContactForDetail}
          onClose={() => setSelectedContactForDetail(null)}
          onEdit={() => {
            setEditingContact(selectedContactForDetail);
            setSelectedContactForDetail(null);
          }}
          allContacts={contacts}
          currentUserId={user?.id || ''}
        />
      )}

      {/* Backup/Restore Panel */}
      {showBackupRestore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowBackupRestore(false)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-6 border-b border-purple-200 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-purple-900 flex items-center gap-2">
                <Download className="w-6 h-6" />
                Backup & Restore
              </h2>
              <button
                onClick={() => setShowBackupRestore(false)}
                className="p-1 hover:bg-purple-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-purple-900" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <ContactBackupRestore
                contacts={contacts}
                onRestore={handleRestoreContacts}
                currentUserId={user?.id || ''}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Recycle Bin */}
      {user && (
        <RecycleBin
          userId={user.id}
          isOpen={showRecycleBin}
          onClose={() => setShowRecycleBin(false)}
          onContactRestored={(restoredContact) => {
            // Add restored contact back to the main list
            setContacts(prev => [...prev, restoredContact]);
          }}
        />
      )}

      {/* Enhanced Cleanup Modal */}
      <EnhancedCleanupModal
        isOpen={showEnhancedCleanup}
        onClose={() => setShowEnhancedCleanup(false)}
        contacts={contacts}
        onCleanupComplete={handleCleanupComplete}
      />
    </div>
    </IntranetLayout>
  );
};

export default ContactsPage;