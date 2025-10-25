import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  Users,
  MapPin,
  Briefcase,
  Heart,
  ChevronRight,
  Loader2,
  Check,
  X
} from 'lucide-react';
import { Contact } from '@/services/ContactsService';
import { ContactSuggestion, contactSuggestionService } from '@/services/ContactSuggestionService';

interface SuggestionWidgetProps {
  contact: Contact;
  allContacts: Contact[];
  onConnect?: (suggestion: ContactSuggestion) => void;
  onDismiss?: (suggestionId: string) => void;
}

const SuggestionWidget: React.FC<SuggestionWidgetProps> = ({
  contact,
  allContacts,
  onConnect,
  onDismiss
}) => {
  const [suggestions, setSuggestions] = useState<ContactSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const topSuggestions = await contactSuggestionService.getTopSuggestions(
          contact,
          allContacts,
          4 // Show top 4 suggestions
        );
        setSuggestions(topSuggestions);
      } catch (error) {
        console.error('Error loading suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, [contact, allContacts]);

  const getMatchIcon = (matchType: ContactSuggestion['matchType']) => {
    switch (matchType) {
      case 'surname':
        return <Users className="w-4 h-4 text-indigo-500" />;
      case 'address':
        return <MapPin className="w-4 h-4 text-orange-500" />;
      case 'mutual_friend':
        return <Heart className="w-4 h-4 text-pink-500" />;
      case 'same_organization':
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'bg-green-100 text-green-700';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-100 text-blue-700';
  };

  const visibleSuggestions = suggestions.filter(s => !dismissedIds.has(s.suggestedContactId));

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2 text-amber-700">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Finding connection suggestions...</span>
        </div>
      </div>
    );
  }

  if (visibleSuggestions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <Lightbulb className="w-5 h-5 text-amber-600" />
        <h3 className="font-medium text-amber-900">
          Connection Suggestions ({visibleSuggestions.length})
        </h3>
      </div>

      {/* Suggestions List */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-2">
          {visibleSuggestions.map((suggestion) => (
            <motion.div
              key={suggestion.suggestedContactId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white border border-amber-200 rounded-lg p-3 hover:bg-amber-50 transition-colors"
            >
              <div className="flex items-start justify-between space-x-3">
                {/* Suggestion Content */}
                <div className="flex-1 min-w-0">
                  {/* Contact Name and Match Type */}
                  <div className="flex items-center space-x-2 mb-1">
                    {getMatchIcon(suggestion.matchType)}
                    <h4 className="font-medium text-ubuntu-warm-900 truncate">
                      {suggestion.suggestedContact.firstName} {suggestion.suggestedContact.lastName}
                    </h4>
                  </div>

                  {/* Reason */}
                  <p className="text-xs text-ubuntu-warm-600 mb-2">
                    {suggestion.reason}
                  </p>

                  {/* Confidence Badge */}
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                    {suggestion.confidence}% match
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      if (onConnect) onConnect(suggestion);
                    }}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    title="Connect these contacts"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDismissedIds(prev => new Set(prev).add(suggestion.suggestedContactId));
                      if (onDismiss) onDismiss(suggestion.suggestedContactId);
                    }}
                    className="p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 rounded-lg transition-colors"
                    title="Dismiss this suggestion"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Info Preview */}
              {suggestion.suggestedContact.emails.length > 0 && (
                <div className="mt-2 text-xs text-gray-500 truncate">
                  📧 {suggestion.suggestedContact.emails[0]}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Info Message */}
      <p className="text-xs text-amber-700 mt-3 pt-2 border-t border-amber-200">
        💡 These suggestions are based on shared surnames, locations, interests, and other connection patterns.
      </p>
    </motion.div>
  );
};

export default SuggestionWidget;
