/**
 * RecommendationPanel - AI Recommendation & Insights Display
 * Shows AI-generated recommendations, insights, and predictions
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  Calendar,
  Users,
  Clock,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  aiService,
  AIRecommendation,
  AIInsight,
  AIPrediction,
} from '@/services/AIService';

interface RecommendationPanelProps {
  userId: string;
  compact?: boolean;
  onAction?: (action: string, data?: any) => void;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  userId,
  compact = false,
  onAction,
}) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'insights' | 'predictions'>('recommendations');
  const [loading, setLoading] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Load recommendations, insights, and predictions
  useEffect(() => {
    const loadAIData = async () => {
      try {
        setLoading(true);
        const [recs, insi, preds] = await Promise.all([
          aiService.generateRecommendations(userId),
          aiService.generateInsights(userId),
          aiService.generatePredictions(userId),
        ]);

        setRecommendations(recs);
        setInsights(insi);
        setPredictions(preds);

        // Store to Firestore
        for (const rec of recs) {
          await aiService.storeRecommendation(userId, rec);
        }
        for (const insight of insi) {
          await aiService.storeInsight(userId, insight);
        }
        for (const pred of preds) {
          await aiService.storePrediction(userId, pred);
        }
      } catch (error) {
        console.error('Error loading AI data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAIData();
  }, [userId]);

  /**
   * Dismiss a recommendation
   */
  const dismissRecommendation = async (id: string) => {
    try {
      await aiService.dismissRecommendation(id);
      setDismissedIds(prev => new Set([...prev, id]));
      setRecommendations(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error dismissing recommendation:', error);
    }
  };

  /**
   * Handle recommendation action
   */
  const handleRecommendationAction = (rec: AIRecommendation) => {
    if (onAction) {
      onAction('recommendation', rec);
    }
    if (rec.actionUrl) {
      // Navigate to action URL
      window.location.href = rec.actionUrl;
    }
  };

  // Compact view
  if (compact) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg border border-blue-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900">Smart Recommendations</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        ) : recommendations.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-4">No recommendations at this time</p>
        ) : (
          <div className="space-y-3">
            {recommendations.slice(0, 3).map(rec => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg p-3 border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer group"
                onClick={() => handleRecommendationAction(rec)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900 group-hover:text-indigo-600">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{rec.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-indigo-600">{rec.confidence}%</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissRecommendation(rec.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full panel view
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">AI Intelligence Hub</h2>
              <p className="text-sm text-blue-100">Smart recommendations & insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex-1 px-6 py-3 font-medium text-center transition-colors ${
            activeTab === 'recommendations'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Target className="w-4 h-4" />
            Recommendations
            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
              {recommendations.length}
            </span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 px-6 py-3 font-medium text-center transition-colors ${
            activeTab === 'insights'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Insights
            <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded-full">
              {insights.length}
            </span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`flex-1 px-6 py-3 font-medium text-center transition-colors ${
            activeTab === 'predictions'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Predictions
            <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-1 rounded-full">
              {predictions.length}
            </span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin mb-3">
                <Sparkles className="w-8 h-8 text-indigo-600 mx-auto" />
              </div>
              <p className="text-gray-600 font-medium">Loading recommendations...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {recommendations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p>All caught up! No new recommendations.</p>
                  </div>
                ) : (
                  recommendations.map((rec, idx) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md cursor-pointer ${
                        rec.priority === 'high'
                          ? 'border-red-500 bg-red-50 hover:bg-red-100'
                          : rec.priority === 'medium'
                          ? 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                          : 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                      }`}
                      onClick={() => handleRecommendationAction(rec)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            {rec.type === 'contact' && <Users className="w-4 h-4" />}
                            {rec.type === 'event' && <Calendar className="w-4 h-4" />}
                            {rec.type === 'time' && <Clock className="w-4 h-4" />}
                            {rec.title}
                          </h4>
                          <p className="text-sm text-gray-700 mt-2">{rec.description}</p>
                          <p className="text-xs text-gray-600 mt-2">💡 {rec.reason}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="inline-block bg-white rounded-full px-3 py-1 text-sm font-bold text-indigo-600">
                            {rec.confidence}%
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissRecommendation(rec.id);
                            }}
                            className="block mt-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {/* Insights Tab */}
            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {insights.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p>Insights will appear as data is collected.</p>
                  </div>
                ) : (
                  insights.map((insight, idx) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                        <div className="flex items-center gap-1">
                          {insight.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                          {insight.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                          {insight.trend === 'stable' && <div className="w-4 h-4 text-gray-500">—</div>}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{insight.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-white rounded px-3 py-1">
                            <span className="text-lg font-bold text-indigo-600">{insight.metric.toFixed(0)}</span>
                            <span className="text-xs text-gray-600 ml-1">%</span>
                          </div>
                          <span className="text-xs text-gray-600">{insight.timeframe}</span>
                        </div>
                        {insight.actionable && insight.suggestedAction && (
                          <div className="text-xs font-medium text-indigo-600">
                            💡 {insight.suggestedAction}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {/* Predictions Tab */}
            {activeTab === 'predictions' && (
              <motion.div
                key="predictions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {predictions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p>Predictions will appear as patterns are detected.</p>
                  </div>
                ) : (
                  predictions.map((pred, idx) => (
                    <motion.div
                      key={pred.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {pred.subject.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Prediction:</span>
                          <span className="font-bold text-indigo-600 bg-white rounded px-3 py-1">{pred.prediction}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Timeframe:</span>
                          <span className="text-sm text-gray-600">{pred.timeframe}</span>
                        </div>
                        <div className="mt-3 bg-white rounded p-2">
                          <p className="text-xs text-gray-600">{pred.explanation}</p>
                        </div>
                        <div className="flex gap-2">
                          <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                            Confidence: {pred.confidence}%
                          </div>
                          <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            Probability: {pred.probability}%
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default RecommendationPanel;
