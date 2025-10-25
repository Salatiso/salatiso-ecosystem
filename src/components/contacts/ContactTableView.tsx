/**
 * Contact Table View Component
 * Displays contacts in a spreadsheet-like table format
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
  Calendar,
  Tag
} from 'lucide-react';
import { Contact } from '@/services/ContactsService';
import { getTagColor } from '@/config/contactTags';

interface ContactTableViewProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
  currentUserId: string;
  isSelected?: (contactId: string) => boolean;
  onSelect?: (contactId: string, selected: boolean) => void;
}

const ContactTableView: React.FC<ContactTableViewProps> = ({
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
      className="bg-white rounded-lg shadow-sm border border-ubuntu-warm-200 overflow-x-auto"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-ubuntu-warm-50 to-ubuntu-warm-100 border-b border-ubuntu-warm-200">
            {onSelect && (
              <th className="px-6 py-3 text-left font-semibold text-ubuntu-warm-900 w-12">
                <input
                  type="checkbox"
                  checked={contacts.length > 0 && contacts.every(c => isSelected?.(c.id))}
                  onChange={(e) => {
                    contacts.forEach(c => onSelect(c.id, e.target.checked));
                  }}
                  className="w-4 h-4 rounded border-ubuntu-warm-300 cursor-pointer"
                />
              </th>
            )}
            <th className="px-6 py-3 text-left font-semibold text-ubuntu-warm-900">Name</th>
            <th className="px-6 py-3 text-left font-semibold text-ubuntu-warm-900">Email</th>
            <th className="px-6 py-3 text-left font-semibold text-ubuntu-warm-900">Phone</th>
            <th className="px-6 py-3 text-left font-semibold text-ubuntu-warm-900">Address</th>
            <th className="px-6 py-3 text-left font-semibold text-ubuntu-warm-900">Category</th>
            <th className="px-6 py-3 text-left font-semibold text-ubuntu-warm-900">Tags</th>
            <th className="px-6 py-3 text-left font-semibold text-ubuntu-warm-900">Added</th>
            <th className="px-6 py-3 text-right font-semibold text-ubuntu-warm-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ubuntu-warm-100">
          {contacts.map((contact, idx) => (
            <motion.tr
              key={contact.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.02 }}
              className="hover:bg-ubuntu-warm-50 transition-colors"
            >
              {onSelect && (
                <td className="px-6 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={isSelected?.(contact.id) || false}
                    onChange={(e) => onSelect(contact.id, e.target.checked)}
                    className="w-4 h-4 rounded border-ubuntu-warm-300 cursor-pointer"
                  />
                </td>
              )}
              
              {/* Name */}
              <td className="px-6 py-3 font-medium text-ubuntu-warm-900">
                <div>{contact.firstName} {contact.lastName}</div>
              </td>

              {/* Email */}
              <td className="px-6 py-3 text-ubuntu-warm-600">
                {contact.emails.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate text-xs">{contact.emails[0]}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">—</span>
                )}
              </td>

              {/* Phone */}
              <td className="px-6 py-3 text-ubuntu-warm-600">
                {contact.phoneNumbers.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate text-xs">{contact.phoneNumbers[0]}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">—</span>
                )}
              </td>

              {/* Address */}
              <td className="px-6 py-3 text-ubuntu-warm-600">
                {contact.addresses.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate text-xs max-w-xs">
                      {contact.addresses[0]}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">—</span>
                )}
              </td>

              {/* Category */}
              <td className="px-6 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  contact.category === 'family' ? 'bg-blue-100 text-blue-700' :
                  contact.category === 'friend' ? 'bg-green-100 text-green-700' :
                  contact.category === 'business' ? 'bg-yellow-100 text-yellow-700' :
                  contact.category === 'professional' ? 'bg-purple-100 text-purple-700' :
                  contact.category === 'service' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {contact.category || 'Other'}
                </span>
              </td>

              {/* Tags */}
              <td className="px-6 py-3">
                {contact.tags.length > 0 ? (
                  <div className="flex items-center gap-1 flex-wrap">
                    {contact.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${getTagColor(tag)}`}
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
                ) : (
                  <span className="text-gray-400 text-xs">—</span>
                )}
              </td>

              {/* Added Date */}
              <td className="px-6 py-3 text-ubuntu-warm-600 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {contact.createdAt.toLocaleDateString()}
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
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
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

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

export default ContactTableView;
