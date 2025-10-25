/**
 * Contact Detail Modal Component
 * Expanded view showing all contact information
 * Includes relationships, images, suggestions, and edit/export options
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Edit,
  Share2,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Link,
  Image as ImageIcon,
  Users,
  Heart,
  Settings,
  Copy,
  Check
} from 'lucide-react';
import { Contact } from '@/services/ContactsService';
import SmartSuggestions from './SmartSuggestions';
import ContactRelationships, { Relationship } from './ContactRelationships';

interface ContactDetailModalProps {
  contact: Contact | null;
  allContacts: Contact[];
  onClose: () => void;
  onEdit?: (contact: Contact) => void;
  currentUserId?: string;
}

const ContactDetailModal: React.FC<ContactDetailModalProps> = ({
  contact,
  allContacts,
  onClose,
  onEdit,
  currentUserId
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  if (!contact) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExportContact = () => {
    const vCardContent = generateVCard(contact);
    const blob = new Blob([vCardContent], { type: 'text/vcard' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${contact.firstName}_${contact.lastName}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const text = `Contact: ${contact.firstName} ${contact.lastName}\n${contact.emails.join(', ')}\n${contact.phoneNumbers.join(', ')}`;
    if (navigator.share) {
      navigator.share({
        title: `Contact: ${contact.firstName} ${contact.lastName}`,
        text: text
      });
    } else {
      handleCopy(text, 'share');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-ubuntu-warm-50 to-ubuntu-warm-100 px-6 py-6 border-b border-ubuntu-warm-200 flex items-center justify-between z-10">
              <div>
                <h2 className="text-3xl font-ubuntu font-bold text-ubuntu-warm-900">
                  {contact.firstName} {contact.lastName}
                </h2>
                <p className="text-ubuntu-warm-600 mt-1 text-sm">
                  {contact.category} • Added {contact.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-ubuntu-warm-200 rounded-lg transition-colors"
                  title="Share contact"
                >
                  <Share2 className="w-5 h-5 text-ubuntu-warm-700" />
                </button>
                <button
                  onClick={handleExportContact}
                  className="p-2 hover:bg-ubuntu-warm-200 rounded-lg transition-colors"
                  title="Export as vCard"
                >
                  <Download className="w-5 h-5 text-ubuntu-warm-700" />
                </button>
                <button
                  onClick={() => onEdit(contact)}
                  className="p-2 hover:bg-ubuntu-gold/20 rounded-lg transition-colors"
                  title="Edit contact"
                >
                  <Edit className="w-5 h-5 text-ubuntu-gold" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Overview Section */}
              <DetailSection
                title="Overview"
                section="overview"
                expanded={expandedSection === 'overview'}
                onToggle={() => setExpandedSection(expandedSection === 'overview' ? null : 'overview')}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Emails */}
                  {contact.emails.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-ubuntu-warm-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Emails
                      </h4>
                      <div className="space-y-1">
                        {contact.emails.map((email, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-ubuntu-warm-50 rounded">
                            <a href={`mailto:${email}`} className="text-ubuntu-warm-700 hover:text-ubuntu-gold truncate">
                              {email}
                            </a>
                            <button
                              onClick={() => handleCopy(email, `email-${idx}`)}
                              className="ml-2 p-1 hover:bg-ubuntu-warm-200 rounded transition-colors"
                            >
                              {copied === `email-${idx}` ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-ubuntu-warm-500" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Phone Numbers */}
                  {contact.phoneNumbers.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-ubuntu-warm-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </h4>
                      <div className="space-y-1">
                        {contact.phoneNumbers.map((phone, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-ubuntu-warm-50 rounded">
                            <a href={`tel:${phone}`} className="text-ubuntu-warm-700 hover:text-ubuntu-gold">
                              {phone}
                            </a>
                            <button
                              onClick={() => handleCopy(phone, `phone-${idx}`)}
                              className="ml-2 p-1 hover:bg-ubuntu-warm-200 rounded transition-colors"
                            >
                              {copied === `phone-${idx}` ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-ubuntu-warm-500" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Addresses */}
                  {contact.addresses.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-ubuntu-warm-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Addresses
                      </h4>
                      <div className="space-y-1">
                        {contact.addresses.map((address, idx) => (
                          <div key={idx} className="p-2 bg-ubuntu-warm-50 rounded text-sm text-ubuntu-warm-700">
                            {address}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Birthday */}
                  {contact.birthday && (
                    <div>
                      <h4 className="text-sm font-semibold text-ubuntu-warm-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Birthday
                      </h4>
                      <div className="p-2 bg-ubuntu-warm-50 rounded text-sm text-ubuntu-warm-700">
                        {new Date(contact.birthday).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </DetailSection>

              {/* Images Section */}
              {contact.photoUrls && contact.photoUrls.length > 0 && (
                <DetailSection
                  title={`Images (${contact.photoUrls.length})`}
                  section="images"
                  expanded={expandedSection === 'images'}
                  onToggle={() => setExpandedSection(expandedSection === 'images' ? null : 'images')}
                  icon={<ImageIcon className="w-4 h-4" />}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {contact.photoUrls.map((photo, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group cursor-pointer"
                      >
                        <img
                          src={photo}
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-ubuntu-warm-200 hover:border-ubuntu-gold transition-colors"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                            {idx + 1}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </DetailSection>
              )}

              {/* Notes Section */}
              {contact.notes && (
                <DetailSection
                  title="Notes"
                  section="notes"
                  expanded={expandedSection === 'notes'}
                  onToggle={() => setExpandedSection(expandedSection === 'notes' ? null : 'notes')}
                >
                  <div className="p-4 bg-ubuntu-warm-50 rounded-lg border border-ubuntu-warm-200">
                    <p className="text-ubuntu-warm-700 whitespace-pre-wrap">{contact.notes}</p>
                  </div>
                </DetailSection>
              )}

              {/* Relationships Section */}
              {contact.relationships && contact.relationships.length > 0 && (
                <DetailSection
                  title={`Relationships (${contact.relationships.length})`}
                  section="relationships"
                  expanded={expandedSection === 'relationships'}
                  onToggle={() => setExpandedSection(expandedSection === 'relationships' ? null : 'relationships')}
                  icon={<Heart className="w-4 h-4" />}
                >
                  <ContactRelationships
                    contact={contact}
                    allContacts={allContacts}
                    relationships={
                      contact.relationships?.map(rel => ({
                        type: rel.label.toLowerCase() as any,
                        contactId: '',
                        contactName: rel.value
                      })) || []
                    }
                    onAddRelationship={() => {}}
                    onRemoveRelationship={() => {}}
                  />
                </DetailSection>
              )}

              {/* Suggestions Section */}
              {allContacts.length > 0 && (
                <DetailSection
                  title="Smart Suggestions"
                  section="suggestions"
                  expanded={expandedSection === 'suggestions'}
                  onToggle={() => setExpandedSection(expandedSection === 'suggestions' ? null : 'suggestions')}
                  icon={<Users className="w-4 h-4" />}
                >
                  <SmartSuggestions
                    contact={contact}
                    allContacts={allContacts}
                    onContactClick={() => {}}
                    maxSuggestions={10}
                    compact={false}
                  />
                </DetailSection>
              )}

              {/* Metadata Section */}
              <DetailSection
                title="Information"
                section="metadata"
                expanded={expandedSection === 'metadata'}
                onToggle={() => setExpandedSection(expandedSection === 'metadata' ? null : 'metadata')}
                icon={<Settings className="w-4 h-4" />}
              >
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-ubuntu-warm-50 rounded">
                    <p className="text-ubuntu-warm-600">Category</p>
                    <p className="font-semibold text-ubuntu-warm-900 capitalize">{contact.category}</p>
                  </div>
                  <div className="p-3 bg-ubuntu-warm-50 rounded">
                    <p className="text-ubuntu-warm-600">Added</p>
                    <p className="font-semibold text-ubuntu-warm-900">
                      {contact.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-ubuntu-warm-50 rounded">
                    <p className="text-ubuntu-warm-600">Last Updated</p>
                    <p className="font-semibold text-ubuntu-warm-900">
                      {contact.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-ubuntu-warm-50 rounded">
                    <p className="text-ubuntu-warm-600">Tags</p>
                    <p className="font-semibold text-ubuntu-warm-900">
                      {contact.tags.length > 0 ? contact.tags.join(', ') : 'None'}
                    </p>
                  </div>
                </div>
              </DetailSection>
            </div>
          </motion.div>
        </motion.div>
    </AnimatePresence>
  );
};

// Helper component for collapsible sections
interface DetailSectionProps {
  title: string;
  section: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const DetailSection: React.FC<DetailSectionProps> = ({
  title,
  expanded,
  onToggle,
  children,
  icon
}) => {
  return (
    <div className="border border-ubuntu-warm-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gradient-to-r from-ubuntu-warm-50 to-ubuntu-warm-100 hover:from-ubuntu-warm-100 hover:to-ubuntu-warm-200 transition-colors flex items-center justify-between font-semibold text-ubuntu-warm-900"
      >
        <div className="flex items-center gap-2">
          {icon}
          {title}
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-4 border-t border-ubuntu-warm-200 space-y-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to generate vCard format
function generateVCard(contact: Contact): string {
  const fullName = `${contact.firstName}${contact.middleName ? ' ' + contact.middleName : ''} ${contact.lastName}`;
  
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${fullName}`,
    `N:${contact.lastName};${contact.firstName};;;`,
    ...contact.phoneNumbers.map(phone => `TEL:${phone}`),
    ...contact.emails.map(email => `EMAIL:${email}`),
    ...contact.addresses.map(address => `ADR:;;${address}`),
    contact.birthday ? `BDAY:${contact.birthday}` : '',
    contact.notes ? `NOTE:${contact.notes.replace(/\n/g, '\\n')}` : '',
    'END:VCARD'
  ].filter(line => line.length > 0);

  return lines.join('\r\n');
}

export default ContactDetailModal;
