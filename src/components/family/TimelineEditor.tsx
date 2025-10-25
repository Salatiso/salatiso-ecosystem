import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  Calendar,
  Users,
  Target,
  BookOpen,
  Plus,
  Minus,
  Loader2
} from 'lucide-react';
import { AccessibleInput, AccessibleTextarea, AccessibleSelect, AccessibleModal } from '@/components/accessibility';

interface TimelineEvent {
  id: string;
  year: number;
  month?: number;
  title: string;
  description: string;
  category: 'foundation' | 'financial' | 'family' | 'legal' | 'business' | 'education';
  familyMembers?: string[];
  ubuntuLesson?: string;
  impact: 'low' | 'medium' | 'high';
}

interface TimelineEditorProps {
  event?: TimelineEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<TimelineEvent, 'id'>) => Promise<void>;
  mode: 'add' | 'edit';
}

const TimelineEditor: React.FC<TimelineEditorProps> = ({
  event,
  isOpen,
  onClose,
  onSave,
  mode
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    year: event?.year || new Date().getFullYear(),
    month: event?.month || '',
    title: event?.title || '',
    description: event?.description || '',
    category: event?.category || 'family',
    familyMembers: event?.familyMembers || [],
    ubuntuLesson: event?.ubuntuLesson || '',
    impact: event?.impact || 'medium'
  });

  const [newMember, setNewMember] = useState('');

  const categories = [
    { id: 'foundation', name: 'Foundation', color: 'bg-purple-100 text-purple-800' },
    { id: 'financial', name: 'Financial', color: 'bg-green-100 text-green-800' },
    { id: 'family', name: 'Family', color: 'bg-blue-100 text-blue-800' },
    { id: 'legal', name: 'Legal', color: 'bg-red-100 text-red-800' },
    { id: 'business', name: 'Business', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'education', name: 'Education', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const familyMembersList = [
    'Salatiso', 'Visa', 'Kwakho', 'Tina', 'Solo', 'Mila', 'Milande', 'Azora', 'Milani', 'Sazi', 'Notemba', 'Mpho (External)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave({
        year: formData.year,
        month: formData.month ? parseInt(formData.month.toString()) : undefined,
        title: formData.title,
        description: formData.description,
        category: formData.category as TimelineEvent['category'],
        familyMembers: formData.familyMembers,
        ubuntuLesson: formData.ubuntuLesson,
        impact: formData.impact as TimelineEvent['impact']
      });
      onClose();
    } catch (error) {
      console.error('Error saving timeline event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFamilyMember = (member: string) => {
    if (member && !formData.familyMembers.includes(member)) {
      setFormData(prev => ({
        ...prev,
        familyMembers: [...prev.familyMembers, member]
      }));
    }
  };

  const removeFamilyMember = (member: string) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter(m => m !== member)
    }));
  };

  const addCustomMember = () => {
    if (newMember.trim() && !formData.familyMembers.includes(newMember.trim())) {
      setFormData(prev => ({
        ...prev,
        familyMembers: [...prev.familyMembers, newMember.trim()]
      }));
      setNewMember('');
    }
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Add Timeline Event' : 'Edit Timeline Event'}
      size="xl"
    >

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Year and Month */}
              <div className="grid grid-cols-2 gap-4">
                <AccessibleInput
                  label="Year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  min="1900"
                  max="2030"
                  required
                />
                <AccessibleSelect
                  label="Month (Optional)"
                  value={formData.month}
                  onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                  options={[
                    { value: '', label: 'Select Month' },
                    { value: '1', label: 'January' },
                    { value: '2', label: 'February' },
                    { value: '3', label: 'March' },
                    { value: '4', label: 'April' },
                    { value: '5', label: 'May' },
                    { value: '6', label: 'June' },
                    { value: '7', label: 'July' },
                    { value: '8', label: 'August' },
                    { value: '9', label: 'September' },
                    { value: '10', label: 'October' },
                    { value: '11', label: 'November' },
                    { value: '12', label: 'December' }
                  ]}
                />
              </div>

              {/* Title */}
              <AccessibleInput
                label="Event Title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Birth of Salatiso"
                required
              />

              {/* Description */}
              <AccessibleTextarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Describe what happened..."
                required
              />

              {/* Category and Impact */}
              <div className="grid grid-cols-2 gap-4">
                <AccessibleSelect
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as TimelineEvent['category'] }))}
                  options={categories.map(category => ({
                    value: category.id,
                    label: category.name
                  }))}
                  required
                />

                <AccessibleSelect
                  label="Impact Level"
                  value={formData.impact}
                  onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value as TimelineEvent['impact'] }))}
                  options={[
                    { value: 'low', label: 'Low Impact' },
                    { value: 'medium', label: 'Medium Impact' },
                    { value: 'high', label: 'High Impact' }
                  ]}
                  required
                />
              </div>

              {/* Family Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Members Involved
                </label>
                <div className="space-y-3">
                  {/* Selected Members */}
                  {formData.familyMembers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.familyMembers.map(member => (
                        <span
                          key={member}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700"
                        >
                          <Users className="w-3 h-3 mr-1" />
                          {member}
                          <button
                            type="button"
                            onClick={() => removeFamilyMember(member)}
                            className="ml-2 text-primary-600 hover:text-primary-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Add from predefined list */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Add from family:</label>
                    <div className="flex flex-wrap gap-2">
                      {familyMembersList
                        .filter(member => !formData.familyMembers.includes(member))
                        .map(member => (
                          <button
                            key={member}
                            type="button"
                            onClick={() => addFamilyMember(member)}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            + {member}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Add custom member */}
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <AccessibleInput
                        label="Add custom member"
                        type="text"
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                        placeholder="Add custom member..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomMember())}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addCustomMember}
                      className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Ubuntu Lesson */}
              <AccessibleTextarea
                label="Ubuntu Wisdom (Optional)"
                value={formData.ubuntuLesson}
                onChange={(e) => setFormData(prev => ({ ...prev, ubuntuLesson: e.target.value }))}
                rows={2}
                placeholder="What Ubuntu lesson does this event teach?"
              />

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
                      <span>{mode === 'add' ? 'Create Event' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
    </AccessibleModal>
  );
};

export default TimelineEditor;