/**
 * AIContext - AI Features State Management
 * Provides AI services, recommendations, and insights across the app
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  aiService,
  AIRecommendation,
  AIInsight,
  AIPrediction,
  NLPResult,
} from '@/services/AIService';

interface AIContextType {
  // State
  recommendations: AIRecommendation[];
  insights: AIInsight[];
  predictions: AIPrediction[];
  isLoading: boolean;
  error: string | null;

  // Methods
  generateRecommendations: () => Promise<void>;
  generateInsights: () => Promise<void>;
  generatePredictions: () => Promise<void>;
  processNaturalLanguage: (input: string) => NLPResult;
  dismissRecommendation: (id: string) => Promise<void>;
  refresh: () => Promise<void>;

  // Config
  enableRecommendations: boolean;
  enableInsights: boolean;
  enablePredictions: boolean;
  setEnableRecommendations: (enabled: boolean) => void;
  setEnableInsights: (enabled: boolean) => void;
  setEnablePredictions: (enabled: boolean) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: React.ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const auth = useAuth();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enableRecommendations, setEnableRecommendations] = useState(true);
  const [enableInsights, setEnableInsights] = useState(true);
  const [enablePredictions, setEnablePredictions] = useState(true);

  /**
   * Generate recommendations
   */
  const generateRecommendations = useCallback(async () => {
    if (!auth.user || !enableRecommendations) return;

    try {
      setError(null);
      const recs = await aiService.generateRecommendations(auth.user.uid);
      setRecommendations(recs);

      // Store to Firestore
      for (const rec of recs) {
        await aiService.storeRecommendation(auth.user.uid, rec);
      }
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError('Failed to generate recommendations');
    }
  }, [auth.user, enableRecommendations]);

  /**
   * Generate insights
   */
  const generateInsights = useCallback(async () => {
    if (!auth.user || !enableInsights) return;

    try {
      setError(null);
      const insi = await aiService.generateInsights(auth.user.uid);
      setInsights(insi);

      // Store to Firestore
      for (const insight of insi) {
        await aiService.storeInsight(auth.user.uid, insight);
      }
    } catch (err) {
      console.error('Error generating insights:', err);
      setError('Failed to generate insights');
    }
  }, [auth.user, enableInsights]);

  /**
   * Generate predictions
   */
  const generatePredictions = useCallback(async () => {
    if (!auth.user || !enablePredictions) return;

    try {
      setError(null);
      const preds = await aiService.generatePredictions(auth.user.uid);
      setPredictions(preds);

      // Store to Firestore
      for (const pred of preds) {
        await aiService.storePrediction(auth.user.uid, pred);
      }
    } catch (err) {
      console.error('Error generating predictions:', err);
      setError('Failed to generate predictions');
    }
  }, [auth.user, enablePredictions]);

  /**
   * Process natural language input
   */
  const processNaturalLanguage = useCallback((input: string): NLPResult => {
    return aiService.processNaturalLanguage(input);
  }, []);

  /**
   * Dismiss a recommendation
   */
  const dismissRecommendation = useCallback(async (id: string) => {
    try {
      await aiService.dismissRecommendation(id);
      setRecommendations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error dismissing recommendation:', err);
      setError('Failed to dismiss recommendation');
    }
  }, []);

  /**
   * Refresh all AI data
   */
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        generateRecommendations(),
        generateInsights(),
        generatePredictions(),
      ]);
    } catch (err) {
      console.error('Error refreshing AI data:', err);
      setError('Failed to refresh');
    } finally {
      setIsLoading(false);
    }
  }, [generateRecommendations, generateInsights, generatePredictions]);

  /**
   * Initialize AI service on mount
   */
  useEffect(() => {
    if (auth.user) {
      aiService.init(auth.user.uid);
      // Initial load
      refresh();

      // Refresh every hour
      const interval = setInterval(() => {
        refresh();
      }, 3600000);

      return () => clearInterval(interval);
    }
  }, [auth.user, refresh]);

  const value: AIContextType = {
    recommendations,
    insights,
    predictions,
    isLoading,
    error,
    generateRecommendations,
    generateInsights,
    generatePredictions,
    processNaturalLanguage,
    dismissRecommendation,
    refresh,
    enableRecommendations,
    enableInsights,
    enablePredictions,
    setEnableRecommendations,
    setEnableInsights,
    setEnablePredictions,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

/**
 * Hook to use AI context
 */
export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within AIProvider');
  }
  return context;
};

export default AIContext;
