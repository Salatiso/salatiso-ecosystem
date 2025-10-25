/**
 * Contact Relationships Component
 * Manages relationships between contacts (spouse, child, parent, etc.)
 * Supports adding, viewing, and removing bidirectional relationships
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  X,
  Heart,
  Baby,
  User,
  Users2,
  Briefcase,
  Link2,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';
import { Contact } from '@/services/ContactsService';

export interface Relationship {
  type: 'spouse' | 'child' | 'parent' | 'sibling' | 'friend' | 'colleague' | 'other';
  contactId: string;
  contactName: string;
}

interface ContactRelationshipsProps {
  contact: Contact;
  allContacts: Contact[];
  relationships: Relationship[];
  onAddRelationship: (relationship: Relationship) => void;
  onRemoveRelationship: (type: string, contactId: string) => void;
  compact?: boolean;
}

const RELATIONSHIP_TYPES = [
  { id: 'spouse', label: 'Spouse', icon: Heart, color: 'text-red-500' },
  { id: 'child', label: 'Child', icon: Baby, color: 'text-blue-500' },
  { id: 'parent', label: 'Parent', icon: User, color: 'text-purple-500' },
  { id: 'sibling', label: 'Sibling', icon: Users2, color: 'text-green-500' },
  { id: 'friend', label: 'Friend', icon: Users, color: 'text-yellow-500' },
  { id: 'colleague', label: 'Colleague', icon: Briefcase, color: 'text-blue-600' },
  { id: 'other', label: 'Other', icon: Link2, color: 'text-gray-500' }
];

const ContactRelationships: React.FC<ContactRelationshipsProps> = ({
  contact,
  allContacts,
  relationships = [],
  onAddRelationship,
  onRemoveRelationship,
  compact = false
}) => {
  const [expanded, setExpanded] = useState(!compact);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('spouse');
  const [selectedContact, setSelectedContact] = useState<string>('');

  // Filter out current contact from available contacts
  const availableContacts = allContacts.filter(c => c.id !== contact.id);

  // Group relationships by type
  const relationshipsByType = RELATIONSHIP_TYPES.map(type => ({
    ...type,
    relationships: relationships.filter(r => r.type === type.id)
  })).filter(group => group.relationships.length > 0);

  const handleAddRelationship = () => {
    if (!selectedContact) return;

    const selectedContactData = availableContacts.find(c => c.id === selectedContact);
    if (!selectedContactData) return;

    onAddRelationship({
      type: selectedType as any,
      contactId: selectedContact,
      contactName: `${selectedContactData.firstName} ${selectedContactData.lastName}`
    });

    setSelectedContact('');
    setSelectedType('spouse');
    setShowAddForm(false);
  };

  if (compact && relationships.length === 0) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
        title="Add relationships"
      >
        <Users className="w-3 h-3 mr-1" />
        Add Relationships ({relationships.length})
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 font-semibold text-ubuntu-warm-900 hover:text-ubuntu-gold transition-colors"
        >
          <Users className="w-5 h-5" />
          Relationships
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <span className="text-sm font-medium text-ubuntu-warm-600">
          {relationships.length} relationship{relationships.length !== 1 ? 's' : ''}
        </span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Relationships List */}
            {relationshipsByType.length > 0 ? (
              <div className="space-y-2">
                {relationshipsByType.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.id} className="space-y-1">
                      <h4 className="text-xs font-semibold text-ubuntu-warm-700 flex items-center gap-2">
                        <Icon className={`w-3 h-3 ${group.color}`} />
                        {group.label}s
                      </h4>
                      <div className="ml-4 space-y-1">
                        {group.relationships.map((rel) => (
                          <motion.div
                            key={`${rel.type}-${rel.contactId}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center justify-between p-2 bg-ubuntu-warm-50 rounded border border-ubuntu-warm-200 hover:bg-ubuntu-warm-100 transition-colors"
                          >
                            <span className="text-sm text-ubuntu-warm-900 font-medium">
                              {rel.contactName}
                            </span>
                            <button
                              onClick={() => onRemoveRelationship(rel.type, rel.contactId)}
                              className="text-ubuntu-warm-500 hover:text-red-600 transition-colors"
                              title="Remove relationship"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 bg-ubuntu-warm-50 rounded border border-dashed border-ubuntu-warm-300 text-center">
                <p className="text-sm text-ubuntu-warm-600">No relationships added yet</p>
              </div>
            )}

            {/* Add Relationship Form */}
            {showAddForm ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-ubuntu-warm-900 mb-2">
                    Relationship Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-ubuntu-gold"
                  >
                    {RELATIONSHIP_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ubuntu-warm-900 mb-2">
                    Select Contact
                  </label>
                  <select
                    value={selectedContact}
                    onChange={(e) => setSelectedContact(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-ubuntu-gold max-h-48"
                  >
                    <option value="">Choose a contact...</option>
                    {availableContacts.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.firstName} {c.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAddRelationship}
                    disabled={!selectedContact}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                  >
                    <Plus className="w-3 h-3 mr-1 inline" />
                    Add Relationship
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                disabled={availableContacts.length === 0}
                className="w-full px-3 py-2 border border-dashed border-ubuntu-gold text-ubuntu-gold rounded-lg text-sm font-medium hover:bg-ubuntu-gold/5 disabled:border-gray-300 disabled:text-gray-400 transition-colors"
                title={availableContacts.length === 0 ? 'No other contacts available' : 'Add a relationship'}
              >
                <Plus className="w-3 h-3 mr-1 inline" />
                Add Relationship
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactRelationships;
