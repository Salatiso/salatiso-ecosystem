import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ChevronDown, Search } from 'lucide-react';
import { PREDEFINED_TAGS, TAG_CATEGORIES, getTagColor, isPredefinedTag, TagOption } from '@/config/contactTags';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChange,
  placeholder = 'Add tags...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCustomInput(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTag = (tagLabel: string) => {
    if (!selectedTags.includes(tagLabel)) {
      onChange([...selectedTags, tagLabel]);
    }
  };

  const handleRemoveTag = (tagLabel: string) => {
    onChange(selectedTags.filter(tag => tag !== tagLabel));
  };

  const handleAddCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      onChange([...selectedTags, trimmed]);
      setCustomTag('');
      setShowCustomInput(false);
      setIsOpen(false);
    }
  };

  const filteredTags = PREDEFINED_TAGS.filter(tag => {
    const matchesSearch = tag.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tag.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !activeCategory || tag.category === activeCategory;
    const notSelected = !selectedTags.includes(tag.label);
    return matchesSearch && matchesCategory && notSelected;
  });

  const groupedTags = TAG_CATEGORIES.map(category => ({
    ...category,
    tags: filteredTags.filter(tag => tag.category === category.id)
  })).filter(group => group.tags.length > 0);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Tags Display */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
          Tags
        </label>
        
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map(tag => (
              <motion.span
                key={tag}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getTagColor(tag)}`}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 hover:text-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </div>
        )}

        {/* Add Tag Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-ubuntu-orange hover:text-ubuntu-orange transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {placeholder}
        </button>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden"
          >
            {/* Search Bar */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tags..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-orange focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="p-2 border-b border-gray-200 flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === null
                    ? 'bg-ubuntu-orange text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {TAG_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-ubuntu-orange text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>

            {/* Tags List */}
            <div className="max-h-64 overflow-y-auto">
              {showCustomInput ? (
                <div className="p-3 border-b border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                      placeholder="Enter custom tag..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-orange focus:border-transparent"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTag}
                      className="px-4 py-2 bg-ubuntu-orange text-white rounded-lg hover:bg-ubuntu-orange-dark transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomTag('');
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {groupedTags.map(group => (
                    <div key={group.id} className="border-b border-gray-100 last:border-b-0">
                      <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-600 flex items-center gap-2">
                        <span>{group.icon}</span>
                        {group.label}
                      </div>
                      <div className="p-2">
                        {group.tags.map(tag => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleAddTag(tag.label)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${tag.color} mb-1`}>
                                  {tag.label}
                                </div>
                                {tag.description && (
                                  <p className="text-xs text-gray-500 mt-1">{tag.description}</p>
                                )}
                              </div>
                              <Plus className="w-4 h-4 text-gray-400 group-hover:text-ubuntu-orange flex-shrink-0 mt-1" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {filteredTags.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No tags found
                    </div>
                  )}

                  {/* Custom Tag Option */}
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(true)}
                    className="w-full px-4 py-3 text-left border-t border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 text-ubuntu-orange font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Custom Tag
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TagSelector;
