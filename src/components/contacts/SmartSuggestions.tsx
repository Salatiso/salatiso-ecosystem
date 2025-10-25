/**
 * Smart Suggestions Component
 * Displays suggested related contacts based on:
 * - Shared surname (potential family)
 * - Shared address (potential household)
 * - Shared email domain (potential colleagues)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Home, 
  Briefcase, 
  ChevronDown, 
  ChevronUp,
  Heart,
  Building2,
  AlertCircle
} from 'lucide-react';
import { Contact } from '@/services/ContactsService';
import { contactSuggestionService, ContactSuggestion } from '@/services/ContactSuggestionService';

interface SmartSuggestionsProps {
  contact: Contact;
  allContacts: Contact[];
  onContactClick: (contact: Contact) => void;
  maxSuggestions?: number;
  compact?: boolean;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  contact,
  allContacts,
  onContactClick,
  maxSuggestions = 3,
  compact = false
}) => {
  const [suggestions, setSuggestions] = useState<ContactSuggestion[]>([]);
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setLoading(true);
        const allSuggestions = await contactSuggestionService.getSuggestions(
          contact,
          allContacts
        );
        setSuggestions(allSuggestions.slice(0, maxSuggestions));
      } catch (error) {
        console.error('Error loading suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, [contact, allContacts, maxSuggestions]);

  if (loading || suggestions.length === 0) {
    return null;
  }

  const getSuggestionIcon = (matchType: string) => {
    switch (matchType) {
      case 'surname':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'address':
        return <Home className="w-4 h-4 text-blue-500" />;
      case 'mutual_friend':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'same_organization':
        return <Briefcase className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSuggestionLabel = (matchType: string) => {
    switch (matchType) {
      case 'surname':
        return 'Family';
      case 'address':
        return 'Household';
      case 'mutual_friend':
        return 'Shared Interest';
      case 'same_organization':
        return 'Organization';
      default:
        return 'Connection';
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-3 pt-3 border-t border-gray-100"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-ubuntu-gold" />
            <p className="text-xs font-medium text-ubuntu-warm-700">
              {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-ubuntu-warm-500 hover:text-ubuntu-warm-700 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              {suggestions.map((suggestion, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => onContactClick(suggestion.suggestedContact)}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-ubuntu-warm-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getSuggestionIcon(suggestion.matchType)}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-ubuntu-warm-900 truncate">
                          {suggestion.suggestedContact.firstName} {suggestion.suggestedContact.lastName}
                        </p>
                        <p className="text-xs text-ubuntu-warm-500">
                          {getSuggestionLabel(suggestion.matchType)} • {suggestion.confidence}%
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Full view
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100"
    >
      <div className="flex items-center space-x-2 mb-3">
        <Users className="w-5 h-5 text-ubuntu-gold" />
        <h3 className="font-medium text-ubuntu-warm-900">You might know</h3>
        <span className="text-xs bg-ubuntu-gold text-white px-2 py-0.5 rounded-full">
          {suggestions.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {suggestions.map((suggestion, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            onClick={() => onContactClick(suggestion.suggestedContact)}
            className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-ubuntu-gold hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ubuntu-warm-900 truncate">
                  {suggestion.suggestedContact.firstName} {suggestion.suggestedContact.lastName}
                </p>
                <div className="flex items-center space-x-1.5 mt-1">
                  {getSuggestionIcon(suggestion.matchType)}
                  <span className="text-xs text-ubuntu-warm-600">
                    {getSuggestionLabel(suggestion.matchType)}
                  </span>
                </div>
              </div>
              <div className="ml-2 text-xs font-semibold text-ubuntu-gold bg-ubuntu-warm-50 px-2 py-1 rounded">
                {suggestion.confidence}%
              </div>
            </div>
            <p className="text-xs text-ubuntu-warm-500 mt-2 line-clamp-2">
              {suggestion.reason}
            </p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default SmartSuggestions;
