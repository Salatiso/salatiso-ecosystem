import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Tag,
  Shield,
  User,
  Home,
  Users,
  Eye,
  EyeOff,
  ArrowRightLeft,
  Send,
  CheckCircle,
  Badge
} from 'lucide-react';
import { Contact } from '@/services/ContactsService';
import contactsService from '@/services/ContactsService';
import EmailInviteModal from './EmailInviteModal';
import ClassificationModal from './ClassificationModal';
import PresenceIndicator from '@/components/presence/PresenceIndicator';
import SmartSuggestions from './SmartSuggestions';
import ImageUpload from './ImageUpload';
import ContactRelationships, { Relationship } from './ContactRelationships';
import { getTagColor } from '@/config/contactTags';

interface ContactCardProps {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails?: () => void;
  currentUserId: string;
  allContacts?: Contact[];
  onContactClick?: (contact: Contact) => void;
  isSelected?: boolean;
  onSelectChange?: (selected: boolean) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onEdit,
  onDelete,
  onViewDetails,
  currentUserId,
  allContacts = [],
  onContactClick,
  isSelected = false,
  onSelectChange
}) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showClassificationModal, setShowClassificationModal] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>(contact.photoUrls || []);
  const [localRelationships, setLocalRelationships] = useState<Relationship[]>(
    contact.relationships?.map(rel => ({
      type: rel.label.toLowerCase() as any,
      contactId: '',
      contactName: rel.value
    })) || []
  );

  const handleImagesUpdate = async (newImages: string[]) => {
    try {
      setLocalImages(newImages);
      // Update in Firestore
      await contactsService.updateContact(contact.id, {
        ...contact,
        photoUrls: newImages
      });
    } catch (error) {
      console.error('Error updating contact images:', error);
      // Revert on error
      setLocalImages(contact.photoUrls || []);
    }
  };

  const handleAddRelationship = async (relationship: Relationship) => {
    try {
      const newRelationships = [...localRelationships, relationship];
      setLocalRelationships(newRelationships);
      
      // Update in Firestore
      await contactsService.updateContact(contact.id, {
        ...contact,
        relationships: newRelationships.map(r => ({
          label: r.type.charAt(0).toUpperCase() + r.type.slice(1),
          value: r.contactName
        }))
      });
    } catch (error) {
      console.error('Error adding relationship:', error);
      setLocalRelationships(contact.relationships?.map(rel => ({
        type: rel.label.toLowerCase() as any,
        contactId: '',
        contactName: rel.value
      })) || []);
    }
  };

  const handleRemoveRelationship = async (type: string, contactId: string) => {
    try {
      const newRelationships = localRelationships.filter(
        r => !(r.type === type && r.contactId === contactId)
      );
      setLocalRelationships(newRelationships);
      
      // Update in Firestore
      await contactsService.updateContact(contact.id, {
        ...contact,
        relationships: newRelationships.map(r => ({
          label: r.type.charAt(0).toUpperCase() + r.type.slice(1),
          value: r.contactName
        }))
      });
    } catch (error) {
      console.error('Error removing relationship:', error);
      setLocalRelationships(contact.relationships?.map(rel => ({
        type: rel.label.toLowerCase() as any,
        contactId: '',
        contactName: rel.value
      })) || []);
    }
  };
  const getCategoryColor = (category: string) => {
    const colors = {
      family: 'bg-blue-100 text-blue-700 border-blue-200',
      friend: 'bg-green-100 text-green-700 border-green-200',
      business: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      professional: 'bg-purple-100 text-purple-700 border-purple-200',
      service: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'private':
        return <Shield className="w-3 h-3 text-red-500" />;
      case 'family':
        return <User className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const canEdit = contact.addedBy === currentUserId || currentUserId === 'salatiso'; // Allow founder to edit all

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${
        isSelected
          ? 'border-ubuntu-gold border-2 bg-ubuntu-gold/5'
          : 'border-ubuntu-warm-200 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectChange?.(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-ubuntu-gold cursor-pointer"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-ubuntu font-semibold text-ubuntu-warm-900">
              {contact.firstName} {contact.lastName}
            </h3>
            {getPrivacyIcon(contact.privacy)}
            {/* Show presence indicator for Sonny Network members */}
            {(contact.isFamilyMember || contact.isHouseholdMember) && contact.addedBy && (
              <PresenceIndicator userId={contact.addedBy} size="sm" />
            )}
          </div>
          
          {/* Category and Sonny Badges */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(contact.category)}`}>
              {contact.category}
            </div>
            
            {/* Household Member Badge */}
            {contact.isHouseholdMember && (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                <Home className="w-3 h-3 mr-1" />
                Household
              </div>
            )}
            
            {/* Family Member Badge */}
            {contact.isFamilyMember && (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                <Users className="w-3 h-3 mr-1" />
                Family
              </div>
            )}
            
            {/* Sonny Role Badge */}
            {contact.sonnyRole && contact.sonnyRole !== 'none' && (
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                {contact.sonnyRole === 'monitor' && (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    I Monitor
                  </>
                )}
                {contact.sonnyRole === 'monitored' && (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    They Monitor
                  </>
                )}
                {contact.sonnyRole === 'both' && (
                  <>
                    <ArrowRightLeft className="w-3 h-3 mr-1" />
                    Mutual
                  </>
                )}
              </div>
            )}
            
            {/* Invitation Status Badge */}
            {contact.invitationStatus && contact.invitationStatus !== 'not-invited' && (
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                contact.invitationStatus === 'invited' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                contact.invitationStatus === 'accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                contact.invitationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                contact.invitationStatus === 'declined' ? 'bg-red-100 text-red-700 border border-red-200' :
                'bg-gray-100 text-gray-700 border border-gray-200'
              }`}>
                {contact.invitationStatus === 'invited' && (
                  <>
                    <Mail className="w-3 h-3 mr-1" />
                    Invited
                  </>
                )}
                {contact.invitationStatus === 'accepted' && (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Accepted
                  </>
                )}
                {contact.invitationStatus === 'pending' && (
                  <>
                    <Badge className="w-3 h-3 mr-1" />
                    Pending
                  </>
                )}
                {contact.invitationStatus === 'declined' && (
                  <>
                    <Badge className="w-3 h-3 mr-1" />
                    Declined
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        </div>

        <div className="flex items-center space-x-1">
          {/* Classify Button */}
          {canEdit && (
            <button
              onClick={() => setShowClassificationModal(true)}
              className="p-1 text-ubuntu-warm-500 hover:text-ubuntu-gold transition-colors"
              title="Classify contact"
            >
              <Badge className="w-4 h-4" />
            </button>
          )}
          
          {/* Send Email Button - Always visible if contact has email */}
          {contact.emails && contact.emails.length > 0 && (
            <button
              onClick={() => setShowEmailModal(true)}
              className="p-1 text-ubuntu-warm-500 hover:text-ubuntu-orange transition-colors"
              title={contact.invitationSent ? "Send another invitation" : "Send email invitation"}
            >
              <Send className="w-4 h-4" />
            </button>
          )}
          
          {/* View Details Button */}
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="p-1 text-ubuntu-warm-500 hover:text-ubuntu-blue transition-colors"
              title="View full contact details"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {canEdit && (
            <>
              <button
                onClick={onEdit}
                className="p-1 text-ubuntu-warm-500 hover:text-ubuntu-gold transition-colors"
                title="Edit contact"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-1 text-ubuntu-warm-500 hover:text-red-500 transition-colors"
                title="Delete contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3">
        {/* Phone Numbers */}
        {contact.phoneNumbers.length > 0 && (
          <div className="flex items-start space-x-2">
            <Phone className="w-4 h-4 text-ubuntu-warm-500 mt-0.5 flex-shrink-0" />
            <div className="flex flex-col space-y-1">
              {contact.phoneNumbers.map((phone, index) => (
                <a
                  key={index}
                  href={`tel:${phone}`}
                  className="text-ubuntu-warm-700 hover:text-ubuntu-gold transition-colors"
                >
                  {phone}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Emails */}
        {contact.emails.length > 0 && (
          <div className="flex items-start space-x-2">
            <Mail className="w-4 h-4 text-ubuntu-warm-500 mt-0.5 flex-shrink-0" />
            <div className="flex flex-col space-y-1">
              {contact.emails.map((email, index) => (
                <a
                  key={index}
                  href={`mailto:${email}`}
                  className="text-ubuntu-warm-700 hover:text-ubuntu-gold transition-colors break-all"
                >
                  {email}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Addresses */}
        {contact.addresses.length > 0 && (
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-ubuntu-warm-500 mt-0.5 flex-shrink-0" />
            <div className="flex flex-col space-y-1">
              {contact.addresses.map((address, index) => (
                <span key={index} className="text-ubuntu-warm-700 text-sm">
                  {address}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location Coordinates */}
        {contact.coordinates && (
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-ubuntu-orange mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="bg-ubuntu-aubergine/5 border border-ubuntu-aubergine/20 rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-ubuntu-aubergine mb-1">
                  Location on Map
                </p>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Lat: {contact.coordinates.latitude.toFixed(4)}</span>
                  <span>Lng: {contact.coordinates.longitude.toFixed(4)}</span>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${contact.coordinates.latitude},${contact.coordinates.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-ubuntu-orange hover:text-orange-600 font-medium mt-2 inline-block"
                >
                  View on Google Maps →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {contact.tags.length > 0 && (
          <div className="flex items-start space-x-2">
            <Tag className="w-4 h-4 text-ubuntu-warm-500 mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {contact.tags.map(tag => (
                <span
                  key={tag}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {contact.notes && (
          <div className="pt-3 border-t border-ubuntu-warm-100">
            <p className="text-ubuntu-warm-600 text-sm italic">
              {contact.notes}
            </p>
          </div>
        )}

        {/* Image Gallery */}
        <div className="pt-3 border-t border-ubuntu-warm-100">
          <ImageUpload
            contactId={contact.id}
            userId={contact.addedBy}
            images={localImages}
            onImagesUpdate={handleImagesUpdate}
            maxImages={5}
            compact={true}
          />
        </div>

        {/* Relationships */}
        <div className="pt-3 border-t border-ubuntu-warm-100">
          <ContactRelationships
            contact={contact}
            allContacts={allContacts}
            relationships={localRelationships}
            onAddRelationship={handleAddRelationship}
            onRemoveRelationship={handleRemoveRelationship}
            compact={true}
          />
        </div>

        {/* Smart Suggestions */}
        {allContacts.length > 0 && (
          <SmartSuggestions
            contact={contact}
            allContacts={allContacts}
            onContactClick={(suggestedContact) => {
              if (onContactClick) {
                onContactClick(suggestedContact);
              }
            }}
            maxSuggestions={3}
            compact={true}
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-ubuntu-warm-100">
        <div className="flex items-center justify-between text-xs text-ubuntu-warm-500">
          <span>Added {contact.createdAt.toLocaleDateString()}</span>
          {contact.updatedAt > contact.createdAt && (
            <span>Updated {contact.updatedAt.toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {/* Email Invite Modal */}
      {showEmailModal && (
        <EmailInviteModal
          contact={contact}
          onClose={() => setShowEmailModal(false)}
          onSendSuccess={() => {
            // Optional: Could track invitation status here
            console.log(`Email invitation sent to ${contact.firstName} ${contact.lastName}`);
          }}
        />
      )}

      {/* Classification Modal */}
      {showClassificationModal && (
        <ClassificationModal
          contact={contact}
          onClose={() => setShowClassificationModal(false)}
          onSave={(updatedContact) => {
            // Optional: Could refresh contact data here
            console.log(`Contact classified: ${updatedContact.firstName}`);
          }}
        />
      )}
    </motion.div>
  );
};

export default ContactCard;