/**
 * useTemplateRecommendations Hook - AI-Powered Template Suggestions
 * 
 * React hook for managing template recommendations with loading states,
 * feedback collection, and recommendation refresh.
 * 
 * @module useTemplateRecommendations
 */

import { useState, useEffect, useCallback } from 'react';
import {
  AIRecommendationService,
  getAIRecommendationService,
  Recommendation,
  FamilyContext,
  RecommendationFeedback
} from '@/services/AIRecommendationService';

interface UseTemplateRecommendationsReturn {
  // State
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  context: FamilyContext | null;
  
  // Actions
  loadRecommendations: (familyId: string) => Promise<void>;
  refreshRecommendations: () => Promise<void>;
  acceptRecommendation: (templateId: string) => Promise<void>;
  rejectRecommendation: (templateId: string) => Promise<void>;
  rateRecommendation: (templateId: string, rating: number, comments?: string) => Promise<void>;
  explainRecommendation: (recommendation: Recommendation) => string;
}

/**
 * Custom hook for AI template recommendations
 */
export function useTemplateRecommendations(familyId?: string): UseTemplateRecommendationsReturn {
  const [service] = useState<AIRecommendationService>(() => getAIRecommendationService());
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<FamilyContext | null>(null);

  /**
   * Load recommendations for a family
   */
  const loadRecommendations = useCallback(async (targetFamilyId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Analyze family context
      const familyContext = await service.analyzeContext(targetFamilyId);
      setContext(familyContext);

      // Generate recommendations
      const recs = await service.generateRecommendations(familyContext);
      setRecommendations(recs);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load recommendations';
      setError(errorMsg);
      console.error('Recommendation error:', err);
    } finally {
      setLoading(false);
    }
  }, [service]);

  /**
   * Refresh recommendations with current context
   */
  const refreshRecommendations = useCallback(async () => {
    if (!context) return;
    await loadRecommendations(context.familyId);
  }, [context, loadRecommendations]);

  /**
   * Accept a recommendation (user clicked to use template)
   */
  const acceptRecommendation = useCallback(async (templateId: string) => {
    if (!context) return;

    const feedback: RecommendationFeedback = {
      recommendationId: `rec-${Date.now()}`,
      familyId: context.familyId,
      templateId,
      accepted: true,
      completed: false,
      timestamp: new Date()
    };

    await service.refineWithFeedback(feedback);

    // Remove from recommendations list (they're using it now)
    setRecommendations(prev => prev.filter(r => r.templateId !== templateId));
  }, [context, service]);

  /**
   * Reject a recommendation (not interested)
   */
  const rejectRecommendation = useCallback(async (templateId: string) => {
    if (!context) return;

    const feedback: RecommendationFeedback = {
      recommendationId: `rec-${Date.now()}`,
      familyId: context.familyId,
      templateId,
      accepted: false,
      completed: false,
      timestamp: new Date()
    };

    await service.refineWithFeedback(feedback);

    // Remove from recommendations list
    setRecommendations(prev => prev.filter(r => r.templateId !== templateId));
  }, [context, service]);

  /**
   * Rate a recommendation after completing template
   */
  const rateRecommendation = useCallback(async (
    templateId: string,
    rating: number,
    comments?: string
  ) => {
    if (!context) return;

    const feedback: RecommendationFeedback = {
      recommendationId: `rec-${Date.now()}`,
      familyId: context.familyId,
      templateId,
      accepted: true,
      completed: true,
      helpfulRating: rating,
      comments,
      timestamp: new Date()
    };

    await service.refineWithFeedback(feedback);
  }, [context, service]);

  /**
   * Get explanation for a recommendation
   */
  const explainRecommendation = useCallback((recommendation: Recommendation): string => {
    return service.explainRecommendation(recommendation);
  }, [service]);

  // Auto-load on mount if familyId provided
  useEffect(() => {
    if (familyId) {
      loadRecommendations(familyId);
    }
  }, [familyId, loadRecommendations]);

  return {
    // State
    recommendations,
    loading,
    error,
    context,
    
    // Actions
    loadRecommendations,
    refreshRecommendations,
    acceptRecommendation,
    rejectRecommendation,
    rateRecommendation,
    explainRecommendation
  };
}

export default useTemplateRecommendations;
