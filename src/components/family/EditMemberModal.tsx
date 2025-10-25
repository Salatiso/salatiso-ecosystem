import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Star,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AccessibleModal } from '@/components/accessibility';

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  joinDate: string;
  profileImage?: string;
  responsibilities: string[];
  achievements: string[];
  careerPath: string;
  level: number;
  experiencePoints: number;
  location: string;
  bio: string;
  status: 'active' | 'developing' | 'transitioning' | 'emeritus';
  trustRating: number;
  specializations: string[];
}

interface EditMemberModalProps {
  member: FamilyMember;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<FamilyMember>) => Promise<void>;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({
  member,
  isOpen,
  onClose,
  onSave
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: member.bio,
    phone: member.phone,
    location: member.location,
    responsibilities: [...member.responsibilities],
    achievements: [...member.achievements],
    specializations: [...member.specializations]
  });

  // Reset form when member changes
  useEffect(() => {
    setFormData({
      bio: member.bio,
      phone: member.phone,
      location: member.location,
      responsibilities: [...member.responsibilities],
      achievements: [...member.achievements],
      specializations: [...member.specializations]
    });
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating member:', error);
      // Could add error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const addArrayItem = (field: 'responsibilities' | 'achievements' | 'specializations', value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: 'responsibilities' | 'achievements' | 'specializations', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const canEdit = () => {
    // Allow editing own profile or if user is admin
    return user?.email === member.email || user?.email === 'spiceinc@gmail.com'; // Salatiso as admin
  };

  if (!canEdit()) {
    return null; // Don't render if user can't edit
  }

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Profile - ${member.name}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+27 XX XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Responsibilities
                </label>
                <div className="space-y-2">
                  {formData.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={responsibility}
                        onChange={(e) => {
                          const newResponsibilities = [...formData.responsibilities];
                          newResponsibilities[index] = e.target.value;
                          setFormData(prev => ({ ...prev, responsibilities: newResponsibilities }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('responsibilities', index)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('responsibilities', '')}
                    className="flex items-center space-x-2 px-3 py-2 text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <span className="text-sm">+ Add responsibility</span>
                  </button>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recent Achievements
                </label>
                <div className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => {
                          const newAchievements = [...formData.achievements];
                          newAchievements[index] = e.target.value;
                          setFormData(prev => ({ ...prev, achievements: newAchievements }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('achievements', index)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('achievements', '')}
                    className="flex items-center space-x-2 px-3 py-2 text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <span className="text-sm">+ Add achievement</span>
                  </button>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations
                </label>
                <div className="space-y-2">
                  {formData.specializations.map((specialization, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={specialization}
                        onChange={(e) => {
                          const newSpecializations = [...formData.specializations];
                          newSpecializations[index] = e.target.value;
                          setFormData(prev => ({ ...prev, specializations: newSpecializations }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('specializations', index)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('specializations', '')}
                    className="flex items-center space-x-2 px-3 py-2 text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <span className="text-sm">+ Add specialization</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
    </AccessibleModal>
  );
};

export default EditMemberModal;