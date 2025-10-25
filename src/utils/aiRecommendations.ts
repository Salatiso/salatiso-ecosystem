import type { Document } from '@/types';

interface UserReadingHistory {
  documentId: string;
  category: string;
  type: string;
  difficulty: string;
  timestamp: number;
  completionRate: number;
  timeSpent: number;
}

export interface DocumentRecommendation {
  document: Document;
  score: number;
  reasons: string[];
}

interface AIAnalysis {
  summary: string;
  keyPoints: string[];
  relatedTopics: string[];
  estimatedDifficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prerequisites: string[];
}

/**
 * AI-powered document recommendation engine
 * Uses collaborative filtering and content-based recommendations
 */
export class AIRecommendationEngine {
  /**
   * Generate personalized document recommendations based on user history
   */
  static generateRecommendations(
    allDocuments: Document[],
    userHistory: UserReadingHistory[],
    currentDocument?: Document,
    limit: number = 5
  ): DocumentRecommendation[] {
    if (userHistory.length === 0) {
      // For new users, recommend beginner-friendly high-XP documents
      return this.getNewUserRecommendations(allDocuments, limit);
    }

    const recommendations: DocumentRecommendation[] = [];

    // Analyze user preferences
    const preferences = this.analyzeUserPreferences(userHistory);

    for (const doc of allDocuments) {
      // Skip if already read
      if (userHistory.some(h => h.documentId === doc.id)) {
        continue;
      }

      // Skip current document
      if (currentDocument && doc.id === currentDocument.id) {
        continue;
      }

      const score = this.calculateRecommendationScore(doc, preferences, currentDocument);
      const reasons = this.generateRecommendationReasons(doc, preferences, currentDocument);

      recommendations.push({
        document: doc,
        score,
        reasons
      });
    }

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Analyze user reading preferences from history
   */
  private static analyzeUserPreferences(history: UserReadingHistory[]) {
    const categories: Record<string, number> = {};
    const types: Record<string, number> = {};
    const difficulties: Record<string, number> = {};
    let totalTimeSpent = 0;
    let totalCompletionRate = 0;

    for (const item of history) {
      categories[item.category] = (categories[item.category] || 0) + 1;
      types[item.type] = (types[item.type] || 0) + 1;
      difficulties[item.difficulty] = (difficulties[item.difficulty] || 0) + 1;
      totalTimeSpent += item.timeSpent;
      totalCompletionRate += item.completionRate;
    }

    const avgTimeSpent = totalTimeSpent / history.length;
    const avgCompletionRate = totalCompletionRate / history.length;

    // Find most preferred category, type, and difficulty
    const preferredCategory = Object.keys(categories).reduce((a, b) => 
      categories[a] > categories[b] ? a : b
    );
    const preferredType = Object.keys(types).reduce((a, b) => 
      types[a] > types[b] ? a : b
    );
    const preferredDifficulty = Object.keys(difficulties).reduce((a, b) => 
      difficulties[a] > difficulties[b] ? a : b
    );

    return {
      preferredCategory,
      preferredType,
      preferredDifficulty,
      avgTimeSpent,
      avgCompletionRate,
      categoryDistribution: categories,
      typeDistribution: types,
      difficultyDistribution: difficulties
    };
  }

  /**
   * Calculate recommendation score for a document
   */
  private static calculateRecommendationScore(
    doc: Document,
    preferences: ReturnType<typeof AIRecommendationEngine.analyzeUserPreferences>,
    currentDocument?: Document
  ): number {
    let score = 0;

    // Category match (40% weight)
    if (doc.category === preferences.preferredCategory) {
      score += 40;
    } else if (preferences.categoryDistribution[doc.category]) {
      score += 20;
    }

    // Type match (20% weight)
    if (doc.type === preferences.preferredType) {
      score += 20;
    } else if (preferences.typeDistribution[doc.type]) {
      score += 10;
    }

    // Difficulty progression (20% weight)
    const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    const userLevel = difficultyOrder[preferences.preferredDifficulty as keyof typeof difficultyOrder] || 1;
    const docLevel = difficultyOrder[doc.difficulty];

    // Recommend slightly harder content for progression
    if (docLevel === userLevel + 1) {
      score += 20; // Perfect progression
    } else if (docLevel === userLevel) {
      score += 15; // Same level
    } else if (docLevel === userLevel - 1) {
      score += 10; // Easier content
    }

    // Related to current document (20% weight)
    if (currentDocument) {
      if (doc.category === currentDocument.category) {
        score += 15;
      }
      if (doc.type === currentDocument.type) {
        score += 5;
      }
      // Check for common tags
      const commonTags = doc.tags.filter(tag => currentDocument.tags.includes(tag));
      score += Math.min(commonTags.length * 2, 10);
    }

    // XP reward factor (bonus for high-value content)
    score += Math.min(doc.xpReward / 50, 10);

    return score;
  }

  /**
   * Generate human-readable reasons for recommendation
   */
  private static generateRecommendationReasons(
    doc: Document,
    preferences: ReturnType<typeof AIRecommendationEngine.analyzeUserPreferences>,
    currentDocument?: Document
  ): string[] {
    const reasons: string[] = [];

    if (doc.category === preferences.preferredCategory) {
      reasons.push(`Matches your interest in ${doc.category}`);
    }

    if (doc.type === preferences.preferredType) {
      reasons.push(`${doc.type} format you prefer`);
    }

    const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    const userLevel = difficultyOrder[preferences.preferredDifficulty as keyof typeof difficultyOrder] || 1;
    const docLevel = difficultyOrder[doc.difficulty];

    if (docLevel === userLevel + 1) {
      reasons.push('Great for skill progression');
    } else if (docLevel === userLevel) {
      reasons.push('Matches your current level');
    }

    if (currentDocument && doc.category === currentDocument.category) {
      reasons.push(`Related to "${currentDocument.title}"`);
    }

    if (doc.xpReward >= 200) {
      reasons.push('High XP reward');
    }

    if (doc.estimatedReadTime <= 30) {
      reasons.push('Quick read');
    }

    if (doc.featured) {
      reasons.push('Featured content');
    }

    return reasons.slice(0, 3); // Return top 3 reasons
  }

  /**
   * Get recommendations for new users
   */
  private static getNewUserRecommendations(
    allDocuments: Document[],
    limit: number
  ): DocumentRecommendation[] {
    return allDocuments
      .filter(doc => doc.difficulty === 'beginner' || doc.featured)
      .sort((a, b) => {
        // Prioritize featured beginner content with high XP
        const scoreA = (a.featured ? 100 : 0) + (a.difficulty === 'beginner' ? 50 : 0) + a.xpReward;
        const scoreB = (b.featured ? 100 : 0) + (b.difficulty === 'beginner' ? 50 : 0) + b.xpReward;
        return scoreB - scoreA;
      })
      .slice(0, limit)
      .map(doc => ({
        document: doc,
        score: 100,
        reasons: [
          doc.featured ? 'Featured content' : 'Great for beginners',
          'Recommended starting point',
          `Earn ${doc.xpReward} XP`
        ]
      }));
  }

  /**
   * Analyze document content and generate insights
   * (Simulated AI analysis - in production, this would use actual AI/ML models)
   */
  static analyzeDocument(doc: Document): AIAnalysis {
    const keyPoints: string[] = [];
    const relatedTopics: string[] = [];

    // Extract key points from tags
    doc.tags.forEach(tag => {
      keyPoints.push(`Understanding ${tag}`);
    });

    // Generate related topics based on category and type
    relatedTopics.push(doc.category);
    if (doc.type !== 'guide') {
      relatedTopics.push(`${doc.type} documentation`);
    }

    // Estimate prerequisites based on difficulty
    const prerequisites: string[] = [];
    if (doc.difficulty === 'intermediate') {
      prerequisites.push('Basic understanding of ecosystem concepts');
    } else if (doc.difficulty === 'advanced') {
      prerequisites.push('Intermediate knowledge required');
      prerequisites.push('Prior document completion recommended');
    } else if (doc.difficulty === 'expert') {
      prerequisites.push('Advanced expertise required');
      prerequisites.push('Multiple prerequisite documents');
    }

    return {
      summary: doc.description,
      keyPoints: keyPoints.slice(0, 5),
      relatedTopics: relatedTopics.slice(0, 4),
      estimatedDifficulty: doc.difficulty,
      prerequisites
    };
  }

  /**
   * Search documents using semantic similarity
   * (Simulated semantic search - in production, this would use embeddings)
   */
  static semanticSearch(
    query: string,
    allDocuments: Document[],
    limit: number = 10
  ): Document[] {
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/).filter(term => term.length > 2);

    const scoredDocs = allDocuments.map(doc => {
      let score = 0;

      // Title match (highest weight)
      if (doc.title.toLowerCase().includes(queryLower)) {
        score += 100;
      }
      queryTerms.forEach(term => {
        if (doc.title.toLowerCase().includes(term)) {
          score += 20;
        }
      });

      // Description match
      if (doc.description.toLowerCase().includes(queryLower)) {
        score += 50;
      }
      queryTerms.forEach(term => {
        if (doc.description.toLowerCase().includes(term)) {
          score += 10;
        }
      });

      // Tag match
      doc.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          score += 30;
        }
        queryTerms.forEach(term => {
          if (tag.toLowerCase().includes(term)) {
            score += 5;
          }
        });
      });

      // Category/Type match
      if (doc.category.toLowerCase().includes(queryLower)) {
        score += 15;
      }
      if (doc.type.toLowerCase().includes(queryLower)) {
        score += 15;
      }

      return { doc, score };
    });

    return scoredDocs
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.doc);
  }

  /**
   * Generate learning path recommendations
   */
  static generateLearningPath(
    allDocuments: Document[],
    targetCategory: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'beginner'
  ): Document[] {
    const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    const targetLevel = difficultyOrder[userLevel];

    // Filter documents in the target category
    const categoryDocs = allDocuments.filter(doc => doc.category === targetCategory);

    // Sort by difficulty and XP
    const sortedDocs = categoryDocs.sort((a, b) => {
      const diffA = difficultyOrder[a.difficulty];
      const diffB = difficultyOrder[b.difficulty];

      // First sort by difficulty
      if (diffA !== diffB) {
        return diffA - diffB;
      }

      // Then by XP (higher first within same difficulty)
      return b.xpReward - a.xpReward;
    });

    // Filter to include current level and slightly above
    return sortedDocs.filter(doc => {
      const docLevel = difficultyOrder[doc.difficulty];
      return docLevel >= targetLevel && docLevel <= targetLevel + 1;
    }).slice(0, 8);
  }
}

export default AIRecommendationEngine;
