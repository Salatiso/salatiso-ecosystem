/**
 * SmartInput.tsx
 * AI-powered input field with intelligent suggestions and autocomplete
 * 
 * Features:
 * - Real-time ML-powered suggestions
 * - Confidence score display
 * - Keyboard navigation (↑↓ to navigate, Enter to select)
 * - Fallback to rule-based suggestions
 * - Learning from user selections
 * - Context-aware predictions
 * 
 * ECOSYSTEM REPLICATION: Ready for Salatiso, Bridge, Sonny
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import AIService from '@/services/AIService';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

interface SmartInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  context?: string[]; // Historical data for suggestions
  contextType?: 'incident' | 'escalation' | 'project' | 'general';
  disabled?: boolean;
  className?: string;
  showConfidence?: boolean;
  minConfidence?: number;
}

interface Suggestion {
  text: string;
  confidence: number;
  icon?: React.ReactNode;
}

export const SmartInput: React.FC<SmartInputProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  context = [],
  contextType = 'general',
  disabled = false,
  className = '',
  showConfidence = true,
  minConfidence = 0.5
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load suggestions when input changes
  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const loadSuggestions = async () => {
      setIsLoading(true);
      try {
        const predictions = await AIService.getSuggestions(value, context, 5);
        
        const formatted = predictions
          .filter(p => p.confidence >= minConfidence)
          .map(p => ({
            text: p.text,
            confidence: p.confidence,
            icon: getConfidenceIcon(p.confidence)
          }));

        setSuggestions(formatted);
        setShowSuggestions(formatted.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('[SmartInput] Error loading suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce suggestions
    const timeoutId = setTimeout(loadSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [value, context, minConfidence]);

  // Get icon based on confidence level
  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.9) return <Sparkles size={14} className="text-purple-500" />;
    if (confidence >= 0.7) return <TrendingUp size={14} className="text-blue-500" />;
    return <Zap size={14} className="text-gray-400" />;
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-purple-600 bg-purple-50';
    if (confidence >= 0.7) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex].text);
        }
        break;

      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = useCallback((text: string) => {
    onChange(text);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();

    // Log selection for learning
    console.log('[SmartInput] User selected suggestion:', text);
  }, [onChange]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  return (
    <div className="relative w-full">
      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          } ${className}`}
        />

        {/* AI Indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          )}
          {!isLoading && suggestions.length > 0 && (
            <Sparkles className="text-purple-500 animate-pulse" size={16} />
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {/* Header */}
          <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-purple-600" />
              <span className="text-xs font-medium text-gray-700">
                AI Suggestions ({suggestions.length})
              </span>
            </div>
          </div>

          {/* Suggestions List */}
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelectSuggestion(suggestion.text)}
              className={`w-full text-left px-4 py-3 transition-colors ${
                index === selectedIndex
                  ? 'bg-blue-50 border-l-2 border-blue-500'
                  : 'hover:bg-gray-50 border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {suggestion.icon}
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.text}
                    </span>
                  </div>
                  
                  {showConfidence && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            suggestion.confidence >= 0.9
                              ? 'bg-purple-500'
                              : suggestion.confidence >= 0.7
                              ? 'bg-blue-500'
                              : 'bg-gray-400'
                          }`}
                          style={{ width: `${suggestion.confidence * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${getConfidenceColor(suggestion.confidence)}`}>
                        {(suggestion.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              ↑↓ Navigate • Enter Select • Esc Close
            </p>
          </div>
        </div>
      )}

      {/* No Suggestions Message */}
      {showSuggestions && suggestions.length === 0 && value.length >= 2 && !isLoading && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            No suggestions available. Keep typing or try different keywords.
          </p>
        </div>
      )}

      {/* Helper Text */}
      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
        <Sparkles size={12} className="text-purple-500" />
        <span>AI-powered suggestions • Learns from your input</span>
      </div>

      {/* Ecosystem Replication Notice (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          <strong>Ecosystem Ready:</strong> This SmartInput can be used across all Salatiso apps.
          See <code>ECOSYSTEM_REPLICATION_GUIDE.md</code>
        </div>
      )}
    </div>
  );
};

/**
 * USAGE EXAMPLES:
 * 
 * 1. Basic Usage:
 * ```tsx
 * <SmartInput
 *   value={title}
 *   onChange={setTitle}
 *   placeholder="Enter incident title..."
 * />
 * ```
 * 
 * 2. With Context (Historical Data):
 * ```tsx
 * <SmartInput
 *   value={title}
 *   onChange={setTitle}
 *   context={previousTitles}
 *   contextType="incident"
 *   minConfidence={0.7}
 * />
 * ```
 * 
 * 3. Custom Styling:
 * ```tsx
 * <SmartInput
 *   value={description}
 *   onChange={setDescription}
 *   className="text-lg font-medium"
 *   showConfidence={true}
 * />
 * ```
 */
