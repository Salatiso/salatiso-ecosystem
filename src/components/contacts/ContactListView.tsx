/**
 * Contact List View Component
 * Displays contacts in a compact list format with all key information in rows
 * Supports filtering, sorting, and pagination
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Trash2, 
  Tag,
  Calendar,
  Badge
} from 'lucide-react';
import { Contact } from '@/services/ContactsService';
import { getTagColor } from '@/config/contactTags';

interface ContactListViewProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
  currentUserId: string;
  isSelected?: (contactId: string) => boolean;
  onSelect?: (contactId: string, selected: boolean) => void;
}

const ContactListView: React.FC<ContactListViewProps> = ({
  contacts,
  onEdit,
  onDelete,
  currentUserId,
  isSelected,
  onSelect
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 overflow-hidden"
    >
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-ubuntu-warm-50 to-ubuntu-warm-100 px-6 py-4 border-b border-ubuntu-warm-200">
        <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-ubuntu-warm-900">
          {onSelect && (
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={contacts.length > 0 && contacts.every(c => isSelected?.(c.id))}
                onChange={(e) => {
                  contacts.forEach(c => onSelect(c.id, e.target.checked));
                }}
                className="w-4 h-4 rounded border-ubuntu-warm-300 cursor-pointer"
              />
            </div>
          )}
          <div className={onSelect ? 'col-span-3' : 'col-span-4'}>Name</div>
          <div className="col-span-3">Contact Info</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Added</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-ubuntu-warm-100">
        {contacts.map((contact, idx) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.02 }}
            className="hover:bg-ubuntu-warm-50 transition-colors px-6 py-4"
          >
            <div className="grid grid-cols-12 gap-4 items-center text-sm">
              {onSelect && (
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={isSelected?.(contact.id) || false}
                    onChange={(e) => onSelect(contact.id, e.target.checked)}
                    className="w-4 h-4 rounded border-ubuntu-warm-300 cursor-pointer"
                  />
                </div>
              )}
              
              {/* Name */}
              <div className={onSelect ? 'col-span-3' : 'col-span-4'}>
                <div className="font-medium text-ubuntu-warm-900">
                  {contact.firstName} {contact.lastName}
                </div>
                {contact.tags.length > 0 && (
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    {contact.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {contact.tags.length > 2 && (
                      <span className="text-xs text-ubuntu-warm-500">
                        +{contact.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="col-span-3">
                <div className="space-y-1">
                  {contact.emails.length > 0 && (
                    <div className="flex items-center gap-2 text-ubuntu-warm-600 truncate">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate text-xs">
                        {contact.emails[0]}
                      </span>
                    </div>
                  )}
                  {contact.phoneNumbers.length > 0 && (
                    <div className="flex items-center gap-2 text-ubuntu-warm-600 truncate">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate text-xs">
                        {contact.phoneNumbers[0]}
                      </span>
                    </div>
                  )}
                  {contact.addresses.length > 0 && (
                    <div className="flex items-center gap-2 text-ubuntu-warm-600 truncate">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate text-xs">
                        {contact.addresses[0].split(',')[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="col-span-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  contact.category === 'family' ? 'bg-blue-100 text-blue-700' :
                  contact.category === 'friend' ? 'bg-green-100 text-green-700' :
                  contact.category === 'business' ? 'bg-yellow-100 text-yellow-700' :
                  contact.category === 'professional' ? 'bg-purple-100 text-purple-700' :
                  contact.category === 'service' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {contact.category || 'Other'}
                </span>
              </div>

              {/* Added Date */}
              <div className="col-span-2">
                <div className="flex items-center gap-2 text-ubuntu-warm-600 text-xs">
                  <Calendar className="w-4 h-4" />
                  {contact.createdAt.toLocaleDateString()}
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end gap-2">
                <button
                  onClick={() => onEdit(contact)}
                  className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                  title="Edit contact"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(contact.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                  title="Delete contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {contacts.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-12 h-12 text-ubuntu-warm-300 mx-auto mb-4" />
          <p className="text-ubuntu-warm-600">No contacts to display</p>
        </div>
      )}
    </motion.div>
  );
};

export default ContactListView;
