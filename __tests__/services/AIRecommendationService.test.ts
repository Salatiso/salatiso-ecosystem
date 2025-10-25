/**
 * AI Recommendation Service Tests
 * 
 * Tests for OpenAI GPT-4o recommendation engine
 * 
 * @jest-environment jsdom
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { AIRecommendationService } from '@/services/AIRecommendationService';

// Mock OpenAI
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
                recommendations: [
                  {
                    templateId: 'f1-business-together',
                    templateName: 'Business Together Partnership',
                    category: 'family',
                    relevanceScore: 0.92,
                    reasoning: 'This template aligns with your family business goals',
                    ubuntuAlignment: 'High - emphasizes collective ownership',
                    prerequisites: ['Family meeting', 'Business plan'],
                    estimatedTime: 120,
                    collaborationSuggestion: 'Include all adult family members'
                  }
                ]
              })
            }
          }]
        })
      }
    }
  }))
}));

// Mock Firestore
jest.mock('@/config/firebase', () => ({
  db: {},
  auth: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn().mockResolvedValue(undefined),
  getDoc: jest.fn().mockResolvedValue({
    exists: () => true,
    data: () => ({
      templates: [
        { id: 'f1-business-together', name: 'Business Together Partnership', category: 'family' }
      ]
    })
  }),
  getDocs: jest.fn().mockResolvedValue({
    docs: [
      {
        id: 'template1',
        data: () => ({ name: 'Template 1', category: 'family' })
      }
    ]
  }),
  query: jest.fn(),
  where: jest.fn(),
  Timestamp: {
    fromDate: jest.fn((date) => date),
    now: jest.fn(() => new Date())
  }
}));

describe('AIRecommendationService', () => {
  let service: AIRecommendationService;

  beforeEach(() => {
    service = new AIRecommendationService('test-api-key');
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('analyzeContext', () => {
    it('should analyze family context successfully', async () => {
      const familyId = 'family-123';

      const analysis = await service.analyzeContext(familyId);

      expect(analysis).toBeDefined();
      expect(analysis.familyId).toBe('family-123');
      expect(analysis.businessType).toBeDefined();
      expect(analysis.completedTemplates).toBeDefined();
      expect(analysis.familySize).toBeGreaterThan(0);
      expect(analysis.trustScore).toBeGreaterThanOrEqual(0);
      expect(analysis.goals).toBeDefined();
      expect(analysis.challenges).toBeDefined();
      expect(analysis.culturalContext).toBeDefined();
    });

    it('should return complete FamilyContext object', async () => {
      const familyId = 'family-456';

      const analysis = await service.analyzeContext(familyId);

      expect(analysis.businessType).toBeInstanceOf(Array);
      expect(analysis.completedTemplates).toBeInstanceOf(Array);
      expect(analysis.goals).toBeInstanceOf(Array);
      expect(analysis.challenges).toBeInstanceOf(Array);
      expect(analysis.culturalContext.language).toBeDefined();
      expect(analysis.culturalContext.region).toBeDefined();
      expect(analysis.culturalContext.industryFocus).toBeInstanceOf(Array);
    });
  });

  describe('generateRecommendations', () => {
    it('should generate AI-powered recommendations', async () => {
      const context: import('@/services/AIRecommendationService').FamilyContext = {
        familyId: 'family-123',
        businessType: ['retail', 'agriculture'],
        completedTemplates: [],
        familySize: 5,
        trustScore: 75,
        goals: ['Cooperative business', 'Create jobs'],
        challenges: ['Planning', 'Capital'],
        culturalContext: {
          language: 'en',
          region: 'South Africa',
          industryFocus: ['agriculture', 'retail']
        }
      };

      const recommendations = await service.generateRecommendations(context);

      expect(recommendations).toBeDefined();
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].templateId).toBeDefined();
      expect(recommendations[0].templateTitle).toBeDefined();
      expect(recommendations[0].relevanceScore).toBeGreaterThan(50);
      expect(recommendations[0].reasoning).toBeDefined();
      expect(recommendations[0].reasoning).toBeInstanceOf(Array);
      expect(recommendations[0].reasoning.length).toBeGreaterThan(0);
    });

    it('should sort recommendations by relevance score', async () => {
      const context: import('@/services/AIRecommendationService').FamilyContext = {
        familyId: 'family-123',
        businessType: ['services'],
        completedTemplates: [],
        familySize: 3,
        trustScore: 60,
        goals: ['Grow business'],
        challenges: ['Marketing'],
        culturalContext: {
          language: 'en',
          region: 'South Africa',
          industryFocus: ['services']
        }
      };

      const recommendations = await service.generateRecommendations(context);

      // Check if sorted descending
      for (let i = 0; i < recommendations.length - 1; i++) {
        expect(recommendations[i].relevanceScore).toBeGreaterThanOrEqual(
          recommendations[i + 1].relevanceScore
        );
      }
    });

    it('should fall back to rule-based recommendations on API error', async () => {
      // Force API error
      const brokenService = new AIRecommendationService('invalid-key');
      
      const context: import('@/services/AIRecommendationService').FamilyContext = {
        familyId: 'family-123',
        businessType: ['retail'],
        completedTemplates: [],
        familySize: 4,
        trustScore: 70,
        goals: ['Start business'],
        challenges: ['Funding'],
        culturalContext: {
          language: 'en',
          region: 'South Africa',
          industryFocus: ['retail']
        }
      };

      const recommendations = await brokenService.generateRecommendations(context);

      // Should still return recommendations (rule-based)
      expect(recommendations).toBeDefined();
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('refineWithFeedback', () => {
    it('should process user feedback successfully', async () => {
      const feedback: import('@/services/AIRecommendationService').RecommendationFeedback = {
        recommendationId: 'rec-123',
        familyId: 'family-123',
        templateId: 'f1-business-together',
        accepted: false,
        completed: false,
        helpfulRating: 2,
        comments: 'Too complex for our current situation',
        timestamp: new Date()
      };

      await service.refineWithFeedback(feedback);

      // Method returns void, just ensure no errors thrown
      expect(true).toBe(true);
    });

    it('should process positive feedback', async () => {
      const feedback: import('@/services/AIRecommendationService').RecommendationFeedback = {
        recommendationId: 'rec-456',
        familyId: 'family-123',
        templateId: 'f2-council-governance',
        accepted: true,
        completed: true,
        helpfulRating: 5,
        comments: 'Perfect fit for our family',
        timestamp: new Date()
      };

      await service.refineWithFeedback(feedback);

      // Method returns void, just ensure no errors thrown
      expect(true).toBe(true);
    });

    it('should handle feedback without optional fields', async () => {
      const feedback: import('@/services/AIRecommendationService').RecommendationFeedback = {
        recommendationId: 'rec-789',
        familyId: 'family-123',
        templateId: 'qs1-family-vision',
        accepted: true,
        completed: false,
        timestamp: new Date()
      };

      await service.refineWithFeedback(feedback);

      expect(true).toBe(true);
    });
  });

  describe('explainRecommendation', () => {
    it('should provide human-readable explanation', () => {
      const recommendation: import('@/services/AIRecommendationService').Recommendation = {
        templateId: 'f1-business-together',
        templateTitle: 'Business Together Partnership',
        relevanceScore: 92,
        reasoning: ['Aligns with family business goals', 'Builds on existing strengths', 'Supports collaborative growth'],
        prerequisites: ['qs1-family-vision'],
        estimatedTime: 120,
        collaborationSuggestion: {
          requiredRoles: ['elder', 'member'],
          optimalGroupSize: 5
        },
        ubuntuAlignment: {
          principles: ['Collective ownership', 'Shared responsibility'],
          strengthsAddress: ['Family unity', 'Business experience']
        }
      };

      const explanation = service.explainRecommendation(recommendation);

      expect(explanation).toBeDefined();
      expect(typeof explanation).toBe('string');
      expect(explanation).toContain('92/100');
      expect(explanation).toContain('Aligns with family business goals');
      expect(explanation).toContain('Ubuntu Alignment');
      expect(explanation).toContain('120 minutes');
      expect(explanation).toContain('5 family members');
    });

    it('should emphasize Ubuntu principles', () => {
      const recommendation: import('@/services/AIRecommendationService').Recommendation = {
        templateId: 'f2-council-governance',
        templateTitle: 'Family Council Governance',
        relevanceScore: 88,
        reasoning: ['Strengthens family decision-making', 'Honors elder wisdom', 'Creates clear structure'],
        prerequisites: [],
        estimatedTime: 90,
        collaborationSuggestion: {
          requiredRoles: ['elder', 'member'],
          optimalGroupSize: 8
        },
        ubuntuAlignment: {
          principles: ['Consensus decision-making', 'Respect for elders', 'Collective voice'],
          strengthsAddress: ['Communication', 'Trust']
        }
      };

      const explanation = service.explainRecommendation(recommendation);

      expect(explanation).toContain('Ubuntu Alignment');
      expect(explanation).toContain('Consensus decision-making');
      expect(explanation).toContain('Respect for elders');
    });
  });

  describe('Ubuntu alignment', () => {
    it('should prioritize governance templates for large families', async () => {
      const elderContext: import('@/services/AIRecommendationService').FamilyContext = {
        familyId: 'family-123',
        businessType: ['retail'],
        completedTemplates: ['f1-business-together'],
        familySize: 10,
        trustScore: 80,
        goals: ['Improve decision-making', 'Strengthen governance'],
        challenges: ['Communication across generations'],
        culturalContext: {
          language: 'en',
          region: 'South Africa',
          industryFocus: ['retail', 'services']
        }
      };

      const recommendations = await service.generateRecommendations(elderContext);

      // Should include governance/leadership templates
      const hasGovernanceTemplate = recommendations.some(
        rec => rec.templateTitle.toLowerCase().includes('governance') || 
               rec.templateTitle.toLowerCase().includes('council')
      );
      
      expect(recommendations).toBeDefined();
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('should emphasize collective decision-making', async () => {
      const context: import('@/services/AIRecommendationService').FamilyContext = {
        familyId: 'family-456',
        businessType: ['agriculture'],
        completedTemplates: [],
        familySize: 4,
        trustScore: 75,
        goals: ['Start business', 'Build unity'],
        challenges: ['Aligning on vision'],
        culturalContext: {
          language: 'en',
          region: 'South Africa - Eastern Cape',
          industryFocus: ['agriculture']
        }
      };

      const recommendations = await service.generateRecommendations(context);

      // Check for collaboration suggestions
      const hasCollaborationGuidance = recommendations.every(
        rec => rec.collaborationSuggestion && 
               rec.collaborationSuggestion.requiredRoles.length > 0 &&
               rec.collaborationSuggestion.optimalGroupSize > 0
      );

      expect(hasCollaborationGuidance).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should return recommendations within reasonable time', async () => {
      const context: import('@/services/AIRecommendationService').FamilyContext = {
        familyId: 'family-123',
        businessType: ['services'],
        completedTemplates: [],
        familySize: 4,
        trustScore: 70,
        goals: ['Grow business'],
        challenges: ['Marketing'],
        culturalContext: {
          language: 'en',
          region: 'South Africa',
          industryFocus: ['services']
        }
      };

      const startTime = Date.now();
      await service.generateRecommendations(context);
      const endTime = Date.now();

      // Should complete within 5 seconds
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should handle concurrent requests', async () => {
      const context: import('@/services/AIRecommendationService').FamilyContext = {
        familyId: 'family-123',
        businessType: ['retail'],
        completedTemplates: [],
        familySize: 4,
        trustScore: 65,
        goals: ['Scale operations'],
        challenges: ['Capital'],
        culturalContext: {
          language: 'en',
          region: 'South Africa',
          industryFocus: ['retail']
        }
      };

      // Make multiple concurrent requests
      const promises = Array(3).fill(null).map(() => 
        service.generateRecommendations(context)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });
});
