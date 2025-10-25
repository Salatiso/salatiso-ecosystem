/**
 * AI Recommendation Service - Intelligent Template Suggestions
 * 
 * Uses OpenAI GPT-4 to analyze family context and recommend relevant templates.
 * Implements Ubuntu-aligned recommendations that prioritize collective benefit.
 * 
 * Features:
 * - Family context analysis (business type, goals, history)
 * - Template relevance scoring
 * - Human-readable explanations
 * - Feedback loop for continuous improvement
 * - Ubuntu principle alignment checking
 * 
 * @module AIRecommendationService
 */

import OpenAI from 'openai';

export interface FamilyContext {
  /** Family/business identifier */
  familyId: string;
  /** Type of family business(es) */
  businessType: string[];
  /** Previously completed templates */
  completedTemplates: string[];
  /** Number of active family members */
  familySize: number;
  /** Trust framework score (0-100) */
  trustScore: number;
  /** Family goals and aspirations */
  goals: string[];
  /** Challenges mentioned in previous sessions */
  challenges: string[];
  /** Cultural and regional context */
  culturalContext: {
    language: string;
    region: string;
    industryFocus: string[];
  };
}

export interface UbuntuAlignment {
  /** Ubuntu principles this template aligns with */
  principles: string[];
  /** Family strengths this template builds on */
  strengthsAddress: string[];
}

export interface CollaborationSuggestion {
  /** Required roles for optimal completion */
  requiredRoles: string[];
  /** Recommended number of participants */
  optimalGroupSize: number;
}

export interface Recommendation {
  /** Template ID */
  templateId: string;
  /** Template title */
  templateTitle: string;
  /** Relevance score (0-100) */
  relevanceScore: number;
  /** Human-readable reasoning for recommendation */
  reasoning: string[];
  /** Prerequisites (templates to complete first) */
  prerequisites: string[];
  /** Estimated completion time in minutes */
  estimatedTime: number;
  /** Collaboration suggestions */
  collaborationSuggestion: CollaborationSuggestion;
  /** Ubuntu principle alignment */
  ubuntuAlignment: UbuntuAlignment;
}

export interface RecommendationFeedback {
  recommendationId: string;
  familyId: string;
  templateId: string;
  accepted: boolean;
  completed: boolean;
  helpfulRating?: number; // 1-5
  comments?: string;
  timestamp: Date;
}

/**
 * AI Recommendation Engine
 */
export class AIRecommendationService {
  private openai: OpenAI;
  private readonly model = 'gpt-4o'; // Latest GPT-4 optimized model

  constructor(apiKey?: string) {
    const key = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    if (!key) {
      console.warn('OpenAI API key not configured. Recommendations will use fallback logic.');
    }
    this.openai = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
  }

  /**
   * Analyze family context from historical data
   */
  async analyzeContext(familyId: string): Promise<FamilyContext> {
    try {
      // TODO: Fetch real data from Firestore
      // For now, return mock context
      const mockContext: FamilyContext = {
        familyId,
        businessType: ['retail', 'agriculture'],
        completedTemplates: ['f1-business-together', 'f2-council-governance'],
        familySize: 8,
        trustScore: 75,
        goals: [
          'Expand family business to new markets',
          'Improve decision-making processes',
          'Develop next generation leadership'
        ],
        challenges: [
          'Communication between generations',
          'Balancing traditional values with modern business',
          'Financial transparency'
        ],
        culturalContext: {
          language: 'en',
          region: 'South Africa - Eastern Cape',
          industryFocus: ['agriculture', 'tourism', 'retail']
        }
      };

      return mockContext;
    } catch (error) {
      console.error('Error analyzing family context:', error);
      throw new Error('Failed to analyze family context');
    }
  }

  /**
   * Generate template recommendations using AI
   */
  async generateRecommendations(context: FamilyContext): Promise<Recommendation[]> {
    try {
      // Build prompt for GPT-4
      const prompt = this.buildRecommendationPrompt(context);

      // Call OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      // Parse AI response
      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from AI');
      }

      const parsed = JSON.parse(response);
      return this.validateRecommendations(parsed.recommendations || []);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to rule-based recommendations
      return this.getFallbackRecommendations(context);
    }
  }

  /**
   * System prompt defining AI behavior
   */
  private getSystemPrompt(): string {
    return `You are a family business advisor deeply versed in Ubuntu philosophy ("Umuntu Ngumuntu Ngabantu" - I am because we are).

Your role is to analyze family business context and recommend templates that:
1. Build on existing family strengths and completed work
2. Address stated goals collaboratively, not individually
3. Align with Ubuntu values: collective decision-making, respect for elders, intergenerational wisdom
4. Strengthen trust and transparency within the family
5. Honor African cultural values while enabling modern business growth

When recommending templates:
- Prioritize collective benefit over individual gain
- Suggest collaboration with specific family roles
- Explain reasoning in clear, culturally-sensitive language
- Consider prerequisites and logical progression
- Estimate realistic completion times based on complexity

Respond ONLY with valid JSON in this exact format:
{
  "recommendations": [
    {
      "templateId": "template-id",
      "templateTitle": "Template Name",
      "relevanceScore": 85,
      "reasoning": ["First reason", "Second reason", "Third reason"],
      "prerequisites": ["prerequisite-template-id"],
      "estimatedTime": 45,
      "collaborationSuggestion": {
        "requiredRoles": ["elder", "financial-manager"],
        "optimalGroupSize": 4
      },
      "ubuntuAlignment": {
        "principles": ["Collective decision-making", "Intergenerational wisdom"],
        "strengthsAddress": ["Strong family communication", "Shared business vision"]
      }
    }
  ]
}`;
  }

  /**
   * Build user prompt with family context
   */
  private buildRecommendationPrompt(context: FamilyContext): string {
    return `Analyze this family business context and recommend 3-5 templates:

Family Context:
- Family Size: ${context.familySize} active members
- Business Types: ${context.businessType.join(', ')}
- Trust Score: ${context.trustScore}/100
- Region: ${context.culturalContext.region}
- Industry Focus: ${context.culturalContext.industryFocus.join(', ')}

Completed Templates:
${context.completedTemplates.length > 0 ? context.completedTemplates.map(t => `- ${t}`).join('\n') : '- None yet (this is their first time)'}

Family Goals:
${context.goals.map(g => `- ${g}`).join('\n')}

Current Challenges:
${context.challenges.map(c => `- ${c}`).join('\n')}

Available Template Categories:
- Family Business (f1-business-together, f2-council-governance, f3-company-registration, etc.)
- Personal Development (p1-self-discovery, p2-career-planning, etc.)
- Professional Skills (pr1-leadership, pr2-financial-literacy, etc.)
- Quick Start (qs1-family-vision, qs2-business-idea, etc.)

Recommend templates that will help this family achieve their goals while addressing their challenges.
Focus on Ubuntu-aligned templates that strengthen collective decision-making and family bonds.`;
  }

  /**
   * Validate AI recommendations
   */
  private validateRecommendations(recommendations: any[]): Recommendation[] {
    return recommendations
      .filter(r => r.templateId && r.templateTitle && r.relevanceScore)
      .map(r => ({
        templateId: r.templateId,
        templateTitle: r.templateTitle,
        relevanceScore: Math.min(100, Math.max(0, r.relevanceScore)),
        reasoning: Array.isArray(r.reasoning) ? r.reasoning : [],
        prerequisites: Array.isArray(r.prerequisites) ? r.prerequisites : [],
        estimatedTime: r.estimatedTime || 30,
        collaborationSuggestion: {
          requiredRoles: r.collaborationSuggestion?.requiredRoles || ['member'],
          optimalGroupSize: r.collaborationSuggestion?.optimalGroupSize || 3
        },
        ubuntuAlignment: {
          principles: r.ubuntuAlignment?.principles || ['Collective benefit'],
          strengthsAddress: r.ubuntuAlignment?.strengthsAddress || []
        }
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Fallback recommendations (rule-based)
   */
  private getFallbackRecommendations(context: FamilyContext): Recommendation[] {
    // Simple rule-based recommendations when AI is unavailable
    const recommendations: Recommendation[] = [];

    // If no templates completed, suggest starting templates
    if (context.completedTemplates.length === 0) {
      recommendations.push({
        templateId: 'qs1-family-vision',
        templateTitle: 'Family Vision & Values',
        relevanceScore: 95,
        reasoning: [
          'Perfect starting point for new families',
          'Establishes shared vision and Ubuntu values',
          'Quick completion builds momentum'
        ],
        prerequisites: [],
        estimatedTime: 20,
        collaborationSuggestion: {
          requiredRoles: ['elder', 'member'],
          optimalGroupSize: 5
        },
        ubuntuAlignment: {
          principles: ['Collective vision', 'Shared values'],
          strengthsAddress: ['Family unity', 'Clear direction']
        }
      });
    }

    // If governance not established, recommend it
    if (!context.completedTemplates.includes('f2-council-governance')) {
      recommendations.push({
        templateId: 'f2-council-governance',
        templateTitle: 'Family Council Governance',
        relevanceScore: 90,
        reasoning: [
          'Essential for effective decision-making',
          'Addresses communication challenges',
          'Honors elder wisdom while empowering all voices'
        ],
        prerequisites: ['f1-business-together'],
        estimatedTime: 45,
        collaborationSuggestion: {
          requiredRoles: ['elder', 'member'],
          optimalGroupSize: context.familySize
        },
        ubuntuAlignment: {
          principles: ['Collective decision-making', 'Respect for elders'],
          strengthsAddress: ['Improved communication', 'Clear structure']
        }
      });
    }

    // Financial templates for business expansion goals
    if (context.goals.some(g => g.toLowerCase().includes('expand') || g.toLowerCase().includes('financial'))) {
      recommendations.push({
        templateId: 'pr2-financial-literacy',
        templateTitle: 'Financial Literacy & Planning',
        relevanceScore: 85,
        reasoning: [
          'Supports business expansion goals',
          'Addresses financial transparency challenges',
          'Empowers all family members with financial knowledge'
        ],
        prerequisites: [],
        estimatedTime: 60,
        collaborationSuggestion: {
          requiredRoles: ['financial-manager', 'elder', 'member'],
          optimalGroupSize: 4
        },
        ubuntuAlignment: {
          principles: ['Transparency', 'Shared knowledge'],
          strengthsAddress: ['Financial confidence', 'Trust building']
        }
      });
    }

    return recommendations.slice(0, 5);
  }

  /**
   * Refine recommendations based on user feedback
   */
  async refineWithFeedback(feedback: RecommendationFeedback): Promise<void> {
    try {
      // TODO: Store feedback in Firestore
      // TODO: Use feedback to improve future recommendations
      console.log('Feedback received:', feedback);
      
      // In production, this would:
      // 1. Store feedback in database
      // 2. Aggregate feedback for pattern analysis
      // 3. Fine-tune recommendation weights
      // 4. Update AI prompt engineering based on success patterns
    } catch (error) {
      console.error('Error processing feedback:', error);
    }
  }

  /**
   * Explain why a template was recommended
   */
  explainRecommendation(recommendation: Recommendation): string {
    const parts: string[] = [];

    parts.push(`This template scored ${recommendation.relevanceScore}/100 for your family because:`);
    parts.push('');
    
    recommendation.reasoning.forEach((reason, i) => {
      parts.push(`${i + 1}. ${reason}`);
    });

    parts.push('');
    parts.push('Ubuntu Alignment:');
    recommendation.ubuntuAlignment.principles.forEach(principle => {
      parts.push(`- ${principle}`);
    });

    parts.push('');
    parts.push(`Estimated Time: ${recommendation.estimatedTime} minutes`);
    parts.push(`Optimal Participants: ${recommendation.collaborationSuggestion.optimalGroupSize} family members`);

    if (recommendation.prerequisites.length > 0) {
      parts.push('');
      parts.push('Complete these templates first:');
      recommendation.prerequisites.forEach(prereq => {
        parts.push(`- ${prereq}`);
      });
    }

    return parts.join('\n');
  }
}

// Export singleton instance
let serviceInstance: AIRecommendationService | null = null;

export const getAIRecommendationService = (): AIRecommendationService => {
  if (!serviceInstance) {
    serviceInstance = new AIRecommendationService();
  }
  return serviceInstance;
};

export default AIRecommendationService;
