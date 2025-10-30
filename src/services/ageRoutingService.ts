/**
 * Age Routing Service - Age-Based Content Routing
 * Automatically routes users to age-appropriate sections
 * 
 * Age Bands:
 * - 0-5: Toddler (simple interface)
 * - 6-12: Kid (educational content)
 * - 13-17: Teen (intermediate content)
 * - 18+: Adult (full access)
 */

import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import roleService from './roleService';

export type AgeBand = 'toddler' | 'kid' | 'teen' | 'adult';

export interface AgeGroupConfig {
  band: AgeBand;
  minAge: number;
  maxAge: number;
  label: string;
  description: string;
  contentPath: string; // Navigation path
  icon: string;
  features: string[]; // Available features
  restrictions: string[]; // Feature restrictions
  interfaceComplexity: 'simple' | 'moderate' | 'advanced';
}

export interface UserAgeAssignment {
  userId: string;
  ageBand: AgeBand;
  age: number;
  birthDate: string;
  assignedAt: Timestamp;
  autoAssigned: boolean; // true if system determined, false if manual
  lastVerified: Timestamp;
}

const AGE_BAND_CONFIG: Record<AgeBand, AgeGroupConfig> = {
  toddler: {
    band: 'toddler',
    minAge: 0,
    maxAge: 5,
    label: 'Toddler (0-5)',
    description: 'Simplified interface for toddlers',
    contentPath: '/kids/toddler',
    icon: '👶',
    features: ['basic_learning', 'stories', 'games', 'parental_monitoring'],
    restrictions: ['no_social', 'no_messaging', 'no_complex_features'],
    interfaceComplexity: 'simple',
  },
  kid: {
    band: 'kid',
    minAge: 6,
    maxAge: 12,
    label: 'Kid (6-12)',
    description: 'Educational content for children',
    contentPath: '/kids/content',
    icon: '👧',
    features: [
      'learning_modules',
      'games',
      'stories',
      'basic_messaging',
      'progress_tracking',
      'parental_controls',
    ],
    restrictions: ['limited_messaging', 'no_payments', 'content_filtered'],
    interfaceComplexity: 'moderate',
  },
  teen: {
    band: 'teen',
    minAge: 13,
    maxAge: 17,
    label: 'Teen (13-17)',
    description: 'Content for teenagers',
    contentPath: '/intranet/learning',
    icon: '👦',
    features: [
      'all_learning_content',
      'social_features',
      'messaging',
      'project_collaboration',
      'portfolio_building',
      'parental_oversight',
    ],
    restrictions: ['limited_payment_features', 'age_verified_content'],
    interfaceComplexity: 'advanced',
  },
  adult: {
    band: 'adult',
    minAge: 18,
    maxAge: 150,
    label: 'Adult (18+)',
    description: 'Full platform access',
    contentPath: '/intranet/dashboard',
    icon: '👨',
    features: [
      'all_features',
      'business_tools',
      'advanced_settings',
      'payments',
      'licensing',
      'team_management',
    ],
    restrictions: [],
    interfaceComplexity: 'advanced',
  },
};

class AgeRoutingService {
  private static instance: AgeRoutingService;
  private ageAssignmentCache: Map<string, UserAgeAssignment> = new Map();
  private cacheTimeout: number = 86400000; // 24 hours

  private constructor() {}

  static getInstance(): AgeRoutingService {
    if (!AgeRoutingService.instance) {
      AgeRoutingService.instance = new AgeRoutingService();
    }
    return AgeRoutingService.instance;
  }

  /**
   * Determine age group from age
   */
  determineAgeGroup(age: number): AgeBand {
    if (age < 6) return 'toddler';
    if (age < 13) return 'kid';
    if (age < 18) return 'teen';
    return 'adult';
  }

  /**
   * Get age group configuration
   */
  getAgeGroupConfig(ageBand: AgeBand): AgeGroupConfig {
    return AGE_BAND_CONFIG[ageBand];
  }

  /**
   * Calculate age from birth date
   */
  calculateAge(birthDate: string | Date): number {
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return Math.max(0, age);
  }

  /**
   * Get user's age band
   */
  async getUserAgeBand(userId: string): Promise<AgeBand> {
    try {
      // Check cache first
      if (this.ageAssignmentCache.has(userId)) {
        const cached = this.ageAssignmentCache.get(userId);
        if (cached && Date.now() - cached.lastVerified.toMillis() < this.cacheTimeout) {
          return cached.ageBand;
        }
      }

      // Get from Firestore
      const assignmentDoc = await getDoc(doc(db, 'user_role_assignments', userId));

      if (!assignmentDoc.exists()) {
        return 'adult'; // Default to adult if no assignment
      }

      const data = assignmentDoc.data();
      const birthDate = data.metadata?.birthDate;

      if (!birthDate) {
        return 'adult'; // Default if no birth date
      }

      const age = this.calculateAge(birthDate);
      const ageBand = this.determineAgeGroup(age);

      // Cache assignment
      const assignment: UserAgeAssignment = {
        userId,
        ageBand,
        age,
        birthDate,
        assignedAt: data.assignedAt || Timestamp.now(),
        autoAssigned: true,
        lastVerified: Timestamp.now(),
      };

      this.ageAssignmentCache.set(userId, assignment);

      return ageBand;
    } catch (error) {
      console.error('Error getting user age band:', error);
      return 'adult'; // Fail safely to adult
    }
  }

  /**
   * Route user to appropriate path based on age
   */
  async routeByAge(userId: string): Promise<string> {
    try {
      const ageBand = await this.getUserAgeBand(userId);
      const config = this.getAgeGroupConfig(ageBand);
      return config.contentPath;
    } catch (error) {
      console.error('Error routing by age:', error);
      return '/'; // Fallback to home
    }
  }

  /**
   * Check if user should be redirected
   * Returns true if user is at wrong path for their age
   */
  async shouldRedirect(userId: string, currentPath: string): Promise<boolean> {
    try {
      const appropriatePath = await this.routeByAge(userId);
      return !currentPath.startsWith(appropriatePath);
    } catch (error) {
      console.error('Error checking redirect:', error);
      return false;
    }
  }

  /**
   * Get content appropriate for age band
   */
  getAgeAppropriateFeatures(ageBand: AgeBand): string[] {
    const config = this.getAgeGroupConfig(ageBand);
    return config.features;
  }

  /**
   * Check if user has access to feature
   */
  async canAccessFeature(userId: string, featureId: string): Promise<boolean> {
    try {
      const ageBand = await this.getUserAgeBand(userId);
      const config = this.getAgeGroupConfig(ageBand);

      return config.features.includes(featureId) && !config.restrictions.includes(featureId);
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }

  /**
   * Get interface complexity level
   */
  async getInterfaceComplexity(userId: string): Promise<'simple' | 'moderate' | 'advanced'> {
    try {
      const ageBand = await this.getUserAgeBand(userId);
      const config = this.getAgeGroupConfig(ageBand);
      return config.interfaceComplexity;
    } catch (error) {
      console.error('Error getting interface complexity:', error);
      return 'advanced'; // Fail safely to advanced
    }
  }

  /**
   * Get age band label for display
   */
  getAgeBandLabel(ageBand: AgeBand): string {
    const config = this.getAgeGroupConfig(ageBand);
    return config.label;
  }

  /**
   * Get all available age bands
   */
  getAllAgeBands(): AgeGroupConfig[] {
    return Object.values(AGE_BAND_CONFIG);
  }

  /**
   * Check if user is child
   */
  async isChild(userId: string): Promise<boolean> {
    try {
      const ageBand = await this.getUserAgeBand(userId);
      return ageBand === 'toddler' || ageBand === 'kid' || ageBand === 'teen';
    } catch (error) {
      console.error('Error checking child status:', error);
      return false;
    }
  }

  /**
   * Check if user is adult
   */
  async isAdult(userId: string): Promise<boolean> {
    try {
      const ageBand = await this.getUserAgeBand(userId);
      return ageBand === 'adult';
    } catch (error) {
      console.error('Error checking adult status:', error);
      return true; // Fail safely
    }
  }

  /**
   * Get age band for specific age
   */
  getAgeBandForAge(age: number): AgeBand {
    return this.determineAgeGroup(age);
  }

  /**
   * Get age range for age band
   */
  getAgeRangeForBand(ageBand: AgeBand): { min: number; max: number } {
    const config = this.getAgeGroupConfig(ageBand);
    return {
      min: config.minAge,
      max: config.maxAge,
    };
  }

  /**
   * Verify user age (age verification)
   * Should be called with verified data
   */
  async verifyUserAge(userId: string, birthDate: string, verifiedBy: string): Promise<boolean> {
    try {
      const age = this.calculateAge(birthDate);
      const ageBand = this.determineAgeGroup(age);

      // Update in Firestore
      const assignmentRef = doc(db, 'user_role_assignments', userId);
      await setDoc(
        assignmentRef,
        {
          metadata: {
            birthDate,
            ageVerified: true,
            verifiedAt: Timestamp.now(),
            verifiedBy,
          },
        },
        { merge: true }
      );

      // Update cache
      const cached = this.ageAssignmentCache.get(userId);
      if (cached) {
        cached.birthDate = birthDate;
        cached.ageBand = ageBand;
        cached.age = age;
        cached.lastVerified = Timestamp.now();
      }

      return true;
    } catch (error) {
      console.error('Error verifying user age:', error);
      return false;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.ageAssignmentCache.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats(): {
    cacheSize: number;
    cacheTimeout: number;
  } {
    return {
      cacheSize: this.ageAssignmentCache.size,
      cacheTimeout: this.cacheTimeout,
    };
  }
}

export default AgeRoutingService.getInstance();
