import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  Plus,
  Minus,
  User,
  Users,
  Mail,
  Phone,
  MapPin,
  Tag,
  Shield,
  Loader2,
  Map,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';
import { AccessibleInput, AccessibleTextarea, AccessibleSelect, AccessibleModal } from '@/components/accessibility';
import { Contact } from '@/services/ContactsService';
import TagSelector from './TagSelector';
import { LocationPicker } from './LocationPicker';
import { ContactLocationSelector } from './ContactLocationSelector';

interface ContactFormProps {
  contact?: Contact | null;
  onSave: (contact: Omit<Contact, 'id' | 'addedBy' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  onSave,
  onCancel
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [expandedAddressIndex, setExpandedAddressIndex] = useState<number | null>(null);
  const [addressTypes, setAddressTypes] = useState<('residential' | 'work' | 'vacation' | 'other')[]>([]);
  const [preciseLocations, setPreciseLocations] = useState<Record<number, any>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumbers: [''],
    emails: [''],
    addresses: [''],
    category: 'friend' as Contact['category'],
    tags: [] as string[],
    notes: '',
    privacy: 'family' as Contact['privacy'],
    // Sonny Network fields
    isHouseholdMember: false,
    isFamilyMember: false,
    sonnyRole: 'none' as 'monitor' | 'monitored' | 'both' | 'none',
    // Location coordinates
    coordinates: undefined as { latitude: number; longitude: number } | undefined
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumbers: contact.phoneNumbers.length > 0 ? contact.phoneNumbers : [''],
        emails: contact.emails.length > 0 ? contact.emails : [''],
        addresses: contact.addresses.length > 0 ? contact.addresses : [''],
        category: contact.category,
        tags: contact.tags,
        notes: contact.notes,
        privacy: contact.privacy,
        // Sonny Network fields
        isHouseholdMember: contact.isHouseholdMember || false,
        isFamilyMember: contact.isFamilyMember || false,
        sonnyRole: contact.sonnyRole || 'none',
        // Location coordinates
        coordinates: contact.coordinates
      });
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clean up empty fields
      const cleanedData = {
        ...formData,
        phoneNumbers: formData.phoneNumbers.filter(phone => phone.trim()),
        emails: formData.emails.filter(email => email.trim()),
        addresses: formData.addresses.filter(address => address.trim()),
        tags: formData.tags.filter(tag => tag.trim())
      };

      await onSave(cleanedData);
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addField = (field: 'phoneNumbers' | 'emails' | 'addresses') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeField = (field: 'phoneNumbers' | 'emails' | 'addresses', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: 'phoneNumbers' | 'emails' | 'addresses', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const categories = [
    { value: 'family', label: 'Family' },
    { value: 'friend', label: 'Friend' },
    { value: 'business', label: 'Business' },
    { value: 'professional', label: 'Professional' },
    { value: 'service', label: 'Service' }
  ];

  const privacyOptions = [
    { value: 'public', label: 'Public', description: 'Visible to all family members' },
    { value: 'family', label: 'Family Only', description: 'Visible to family members only' },
    { value: 'private', label: 'Private', description: 'Visible only to you' }
  ];

  return (
    <AccessibleModal
      isOpen={true}
      onClose={onCancel}
      title={contact ? 'Edit Contact' : 'Add New Contact'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <AccessibleInput
                    label="First Name"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ubuntu-warm-400 z-10" />
                </div>

                <AccessibleInput
                  label="Last Name"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                />
              </div>

              {/* Category and Privacy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccessibleSelect
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Contact['category'] }))}
                  options={categories.map(category => ({ value: category.value, label: category.label }))}
                />

                <AccessibleSelect
                  label="Privacy Level"
                  value={formData.privacy}
                  onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value as Contact['privacy'] }))}
                  options={privacyOptions.map(option => ({ value: option.value, label: option.label }))}
                />
              </div>

              {/* Phone Numbers */}
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Phone Numbers
                </label>
                <div className="space-y-2">
                  {formData.phoneNumbers.map((phone, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ubuntu-warm-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => updateField('phoneNumbers', index, e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>
                      {formData.phoneNumbers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField('phoneNumbers', index)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addField('phoneNumbers')}
                    className="inline-flex items-center px-3 py-1 text-sm text-ubuntu-gold hover:text-ubuntu-gold/80 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Phone
                  </button>
                </div>
              </div>

              {/* Emails */}
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Email Addresses
                </label>
                <div className="space-y-2">
                  {formData.emails.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ubuntu-warm-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => updateField('emails', index, e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>
                      {formData.emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField('emails', index)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addField('emails')}
                    className="inline-flex items-center px-3 py-1 text-sm text-ubuntu-gold hover:text-ubuntu-gold/80 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Email
                  </button>
                </div>
              </div>

              {/* Addresses with Precise GPS Location */}
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Addresses (with Precise GPS)
                </label>
                <div className="space-y-3">
                  {formData.addresses.map((address, index) => (
                    <div key={index} className="space-y-2">
                      {/* Address Input */}
                      <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ubuntu-warm-400" />
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => updateField('addresses', index, e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
                            placeholder="Enter address (e.g., 123 Main St, City, Country)"
                          />
                        </div>
                        {formData.addresses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeField('addresses', index)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setExpandedAddressIndex(expandedAddressIndex === index ? null : index)}
                          className="p-2 text-ubuntu-warm-600 hover:text-ubuntu-warm-900 transition-colors"
                          title="Add precise GPS location for this address"
                        >
                          {expandedAddressIndex === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Expanded GPS Location Selector */}
                      {expandedAddressIndex === index && address.trim() && (
                        <div className="ml-2 border-l-4 border-blue-400 pl-3">
                          <ContactLocationSelector
                            address={address}
                            locationType={addressTypes[index] || 'residential'}
                            existingLocation={preciseLocations[index]}
                            onLocationChange={(location) => {
                              const newTypes = [...addressTypes];
                              newTypes[index] = location.locationType;
                              setAddressTypes(newTypes);
                              
                              const newLocations = { ...preciseLocations };
                              newLocations[index] = location;
                              setPreciseLocations(newLocations);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addField('addresses')}
                    className="inline-flex items-center px-3 py-1 text-sm text-ubuntu-gold hover:text-ubuntu-gold/80 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Address
                  </button>
                </div>
                <p className="text-xs text-ubuntu-warm-500 mt-2">
                  💡 <strong>Tip:</strong> Click the expand arrow next to each address to capture precise GPS coordinates, What3Words address, and location type (residential, work, vacation, etc).
                </p>
              </div>

              {/* Location Coordinates */}
              <div>
                <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
                  Location on Map
                </label>
                <div className="space-y-2">
                  {formData.coordinates ? (
                    <div className="bg-ubuntu-aubergine/5 border border-ubuntu-aubergine/20 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-ubuntu-aubergine mb-1">
                            Location Set
                          </p>
                          <p className="text-xs text-gray-600">
                            Latitude: {formData.coordinates.latitude.toFixed(6)}
                          </p>
                          <p className="text-xs text-gray-600">
                            Longitude: {formData.coordinates.longitude.toFixed(6)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, coordinates: undefined }))}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowLocationPicker(true)}
                        className="mt-3 inline-flex items-center px-3 py-1.5 text-sm text-ubuntu-orange hover:text-orange-600 font-medium transition-colors"
                      >
                        <Map className="w-4 h-4 mr-1" />
                        Change Location
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowLocationPicker(true)}
                      className="w-full py-3 border-2 border-dashed border-ubuntu-warm-300 rounded-lg hover:border-ubuntu-orange hover:bg-ubuntu-orange/5 transition-colors flex items-center justify-center text-ubuntu-warm-600 hover:text-ubuntu-orange"
                    >
                      <Map className="w-5 h-5 mr-2" />
                      <span className="font-medium">Add Location on Map</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Tags */}
              <TagSelector
                selectedTags={formData.tags}
                onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                placeholder="Add tags to categorize this contact"
              />

              {/* Notes */}
              <AccessibleTextarea
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                placeholder="Add any additional notes about this contact"
              />

              {/* Sonny Network Settings */}
              <div className="pt-6 border-t border-ubuntu-warm-200">
                <h3 className="text-lg font-semibold text-ubuntu-warm-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                  Sonny Network Settings
                </h3>
                
                <div className="space-y-4 bg-indigo-50 p-4 rounded-lg">
                  {/* Family Member Badge (readonly if from family tree) */}
                  {formData.isFamilyMember && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-indigo-200">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-indigo-100 rounded">
                          <Users className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Family Member</p>
                          <p className="text-sm text-gray-600">Imported from family tree</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                        Family
                      </span>
                    </div>
                  )}

                  {/* Household Member Checkbox */}
                  <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-300 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isHouseholdMember}
                      onChange={(e) => setFormData(prev => ({ ...prev, isHouseholdMember: e.target.checked }))}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Household Member</p>
                      <p className="text-sm text-gray-600">Lives in the same household</p>
                    </div>
                  </label>

                  {/* Sonny Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sonny Network Role
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'none', label: 'None', desc: 'Not on Sonny network' },
                        { value: 'monitor', label: 'I Monitor Them', desc: 'You track their safety' },
                        { value: 'monitored', label: 'They Monitor Me', desc: 'They track your safety' },
                        { value: 'both', label: 'Mutual Monitoring', desc: 'Both track each other' }
                      ].map(role => (
                        <label
                          key={role.value}
                          className={`relative flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.sonnyRole === role.value
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="sonnyRole"
                            value={role.value}
                            checked={formData.sonnyRole === role.value}
                            onChange={(e) => setFormData(prev => ({ ...prev, sonnyRole: e.target.value as any }))}
                            className="sr-only"
                          />
                          <span className="font-medium text-gray-900 text-sm">{role.label}</span>
                          <span className="text-xs text-gray-600 mt-1">{role.desc}</span>
                          {formData.sonnyRole === role.value && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full" />
                          )}
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Configure how this contact appears on the Sonny mesh network for family safety tracking
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-ubuntu-warm-200">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 border border-ubuntu-warm-300 rounded-lg text-ubuntu-warm-700 hover:bg-ubuntu-warm-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-2 bg-ubuntu-gold text-white rounded-lg hover:bg-ubuntu-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  {contact ? 'Update Contact' : 'Save Contact'}
                </button>
              </div>
            </form>

            {/* Location Picker Modal */}
            <AnimatePresence>
              {showLocationPicker && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="max-w-4xl w-full">
                    <LocationPicker
                      initialLocation={formData.coordinates}
                      onLocationSelect={(location) => {
                        setFormData(prev => ({
                          ...prev,
                          coordinates: {
                            latitude: location.latitude,
                            longitude: location.longitude
                          }
                        }));
                        // Optionally add address to addresses array if not already there
                        if (location.address && !formData.addresses.includes(location.address)) {
                          setFormData(prev => ({
                            ...prev,
                            addresses: [...prev.addresses.filter(a => a.trim()), location.address || '']
                          }));
                        }
                        setShowLocationPicker(false);
                      }}
                      onClose={() => setShowLocationPicker(false)}
                    />
                  </div>
                </div>
              )}
            </AnimatePresence>
    </AccessibleModal>
  );
};

export default ContactForm;