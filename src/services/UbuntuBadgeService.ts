/**
 * Ubuntu Achievement Badge Service
 * 
 * Tracks and awards badges for demonstrating Ubuntu principles:
 * - Respect (Respecting elders, listening actively)
 * - Community (Participating in family decisions)
 * - Leadership (Guiding others, mentoring)
 * - Sharing (Contributing knowledge, resources)
 * - Harmony (Building consensus, resolving conflicts)
 * 
 * Badges encourage positive behaviors and celebrate Ubuntu values.
 * 
 * @module UbuntuBadgeService
 */

import { doc, collection, setDoc, getDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Ubuntu Principle Categories
 */
export enum UbuntuPrinciple {
  RESPECT = 'respect',
  COMMUNITY = 'community',
  LEADERSHIP = 'leadership',
  SHARING = 'sharing',
  HARMONY = 'harmony'
}

/**
 * Badge Levels
 */
export enum BadgeLevel {
  BRONZE = 'bronze',   // 1-3 achievements
  SILVER = 'silver',   // 4-7 achievements
  GOLD = 'gold',       // 8-15 achievements
  PLATINUM = 'platinum' // 16+ achievements
}

/**
 * Badge Definition
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  principle: UbuntuPrinciple;
  level: BadgeLevel;
  icon: string;
  criteria: BadgeCriteria;
  points: number;
}

/**
 * Badge Criteria
 */
export interface BadgeCriteria {
  /** Action type that triggers badge */
  actionType: string;
  /** Minimum count of actions */
  minCount: number;
  /** Time period in days (optional) */
  withinDays?: number;
  /** Additional conditions */
  conditions?: Record<string, any>;
}

/**
 * User Badge Achievement
 */
export interface UserBadge {
  id: string;
  userId: string;
  familyId: string;
  badgeId: string;
  badge: Badge;
  earnedAt: Date;
  progress: number; // 0-100
  actionsCompleted: number;
  actionsRequired: number;
}

/**
 * Badge Action (tracking individual achievements)
 */
export interface BadgeAction {
  id: string;
  userId: string;
  familyId: string;
  actionType: string;
  principle: UbuntuPrinciple;
  metadata: Record<string, any>;
  timestamp: Date;
}

/**
 * Leaderboard Entry
 */
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userRole: string;
  totalBadges: number;
  bronzeBadges: number;
  silverBadges: number;
  goldBadges: number;
  platinumBadges: number;
  totalPoints: number;
  ubuntuScore: number;
}

/**
 * Badge Definitions
 */
const BADGE_DEFINITIONS: Badge[] = [
  // RESPECT Badges
  {
    id: 'respect-listener-bronze',
    name: 'Active Listener',
    description: 'Participated in 3 video calls and listened to elder wisdom',
    principle: UbuntuPrinciple.RESPECT,
    level: BadgeLevel.BRONZE,
    icon: '👂',
    criteria: {
      actionType: 'video_call_participated',
      minCount: 3,
      conditions: { listenedToElder: true }
    },
    points: 10
  },
  {
    id: 'respect-elder-honor-silver',
    name: 'Elder Honor',
    description: 'Consistently deferred to elder wisdom in 10 decisions',
    principle: UbuntuPrinciple.RESPECT,
    level: BadgeLevel.SILVER,
    icon: '🙏',
    criteria: {
      actionType: 'decision_deferred_to_elder',
      minCount: 10
    },
    points: 25
  },
  {
    id: 'respect-wisdom-keeper-gold',
    name: 'Wisdom Keeper',
    description: 'Documented and shared elder teachings 20 times',
    principle: UbuntuPrinciple.RESPECT,
    level: BadgeLevel.GOLD,
    icon: '📜',
    criteria: {
      actionType: 'elder_wisdom_documented',
      minCount: 20
    },
    points: 50
  },

  // COMMUNITY Badges
  {
    id: 'community-participant-bronze',
    name: 'Community Contributor',
    description: 'Participated in 5 family council meetings',
    principle: UbuntuPrinciple.COMMUNITY,
    level: BadgeLevel.BRONZE,
    icon: '🤝',
    criteria: {
      actionType: 'council_meeting_attended',
      minCount: 5
    },
    points: 10
  },
  {
    id: 'community-decision-maker-silver',
    name: 'Decision Maker',
    description: 'Contributed to 15 collective family decisions',
    principle: UbuntuPrinciple.COMMUNITY,
    level: BadgeLevel.SILVER,
    icon: '⚖️',
    criteria: {
      actionType: 'decision_contributed',
      minCount: 15
    },
    points: 25
  },
  {
    id: 'community-consensus-builder-gold',
    name: 'Consensus Builder',
    description: 'Helped achieve unanimous consent in 25 decisions',
    principle: UbuntuPrinciple.COMMUNITY,
    level: BadgeLevel.GOLD,
    icon: '🌟',
    criteria: {
      actionType: 'consensus_achieved',
      minCount: 25,
      conditions: { unanimousConsent: true }
    },
    points: 50
  },

  // LEADERSHIP Badges
  {
    id: 'leadership-mentor-bronze',
    name: 'Emerging Mentor',
    description: 'Mentored 3 family members in template completion',
    principle: UbuntuPrinciple.LEADERSHIP,
    level: BadgeLevel.BRONZE,
    icon: '🌱',
    criteria: {
      actionType: 'member_mentored',
      minCount: 3
    },
    points: 10
  },
  {
    id: 'leadership-facilitator-silver',
    name: 'Meeting Facilitator',
    description: 'Successfully facilitated 10 family meetings',
    principle: UbuntuPrinciple.LEADERSHIP,
    level: BadgeLevel.SILVER,
    icon: '🎯',
    criteria: {
      actionType: 'meeting_facilitated',
      minCount: 10
    },
    points: 25
  },
  {
    id: 'leadership-visionary-gold',
    name: 'Family Visionary',
    description: 'Led 20 strategic planning sessions',
    principle: UbuntuPrinciple.LEADERSHIP,
    level: BadgeLevel.GOLD,
    icon: '🔭',
    criteria: {
      actionType: 'strategy_session_led',
      minCount: 20
    },
    points: 50
  },

  // SHARING Badges
  {
    id: 'sharing-collaborator-bronze',
    name: 'Team Player',
    description: 'Collaborated on 5 templates with family members',
    principle: UbuntuPrinciple.SHARING,
    level: BadgeLevel.BRONZE,
    icon: '🤲',
    criteria: {
      actionType: 'template_collaborated',
      minCount: 5
    },
    points: 10
  },
  {
    id: 'sharing-knowledge-silver',
    name: 'Knowledge Sharer',
    description: 'Shared expertise in 15 collaborative sessions',
    principle: UbuntuPrinciple.SHARING,
    level: BadgeLevel.SILVER,
    icon: '💡',
    criteria: {
      actionType: 'knowledge_shared',
      minCount: 15
    },
    points: 25
  },
  {
    id: 'sharing-resource-gold',
    name: 'Resource Champion',
    description: 'Contributed resources to 30 family initiatives',
    principle: UbuntuPrinciple.SHARING,
    level: BadgeLevel.GOLD,
    icon: '🎁',
    criteria: {
      actionType: 'resource_contributed',
      minCount: 30
    },
    points: 50
  },

  // HARMONY Badges
  {
    id: 'harmony-peacemaker-bronze',
    name: 'Peacemaker',
    description: 'Helped resolve 3 family disagreements',
    principle: UbuntuPrinciple.HARMONY,
    level: BadgeLevel.BRONZE,
    icon: '☮️',
    criteria: {
      actionType: 'conflict_resolved',
      minCount: 3
    },
    points: 10
  },
  {
    id: 'harmony-mediator-silver',
    name: 'Harmony Mediator',
    description: 'Mediated 10 disputes to peaceful resolution',
    principle: UbuntuPrinciple.HARMONY,
    level: BadgeLevel.SILVER,
    icon: '🕊️',
    criteria: {
      actionType: 'dispute_mediated',
      minCount: 10
    },
    points: 25
  },
  {
    id: 'harmony-unity-gold',
    name: 'Unity Champion',
    description: 'Maintained family harmony through 25 challenging situations',
    principle: UbuntuPrinciple.HARMONY,
    level: BadgeLevel.GOLD,
    icon: '🌈',
    criteria: {
      actionType: 'harmony_maintained',
      minCount: 25
    },
    points: 50
  }
];

/**
 * Ubuntu Badge Service
 */
export class UbuntuBadgeService {
  
  /**
   * Track a badge-worthy action
   */
  async trackAction(
    userId: string,
    familyId: string,
    actionType: string,
    principle: UbuntuPrinciple,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      const actionId = `${userId}_${actionType}_${Date.now()}`;
      const actionRef = doc(db, 'badgeActions', actionId);

      const action: BadgeAction = {
        id: actionId,
        userId,
        familyId,
        actionType,
        principle,
        metadata,
        timestamp: new Date()
      };

      await setDoc(actionRef, {
        ...action,
        timestamp: Timestamp.now()
      });

      // Check if this action triggers any badge achievements
      await this.checkBadgeEligibility(userId, familyId, actionType);

    } catch (error) {
      console.error('Error tracking badge action:', error);
      throw new Error('Failed to track badge action');
    }
  }

  /**
   * Check if user is eligible for any badges
   */
  private async checkBadgeEligibility(
    userId: string,
    familyId: string,
    actionType: string
  ): Promise<void> {
    try {
      // Find badges that match this action type
      const relevantBadges = BADGE_DEFINITIONS.filter(
        badge => badge.criteria.actionType === actionType
      );

      for (const badge of relevantBadges) {
        // Check if user already has this badge
        const userBadgeRef = doc(db, 'userBadges', `${userId}_${badge.id}`);
        const userBadgeSnap = await getDoc(userBadgeRef);

        if (userBadgeSnap.exists()) {
          continue; // Already earned this badge
        }

        // Count relevant actions
        const actionsQuery = query(
          collection(db, 'badgeActions'),
          where('userId', '==', userId),
          where('familyId', '==', familyId),
          where('actionType', '==', actionType)
        );

        const actionsSnap = await getDocs(actionsQuery);
        const actionCount = actionsSnap.size;

        // Check if criteria met
        if (actionCount >= badge.criteria.minCount) {
          // Additional conditions check
          if (badge.criteria.conditions) {
            const meetsConditions = actionsSnap.docs.some(doc => {
              const action = doc.data() as BadgeAction;
              return Object.entries(badge.criteria.conditions!).every(
                ([key, value]) => action.metadata[key] === value
              );
            });

            if (!meetsConditions) {
              continue;
            }
          }

          // Award the badge!
          await this.awardBadge(userId, familyId, badge);
        }
      }
    } catch (error) {
      console.error('Error checking badge eligibility:', error);
    }
  }

  /**
   * Award a badge to a user
   */
  private async awardBadge(
    userId: string,
    familyId: string,
    badge: Badge
  ): Promise<void> {
    try {
      const userBadgeId = `${userId}_${badge.id}`;
      const userBadgeRef = doc(db, 'userBadges', userBadgeId);

      const userBadge: UserBadge = {
        id: userBadgeId,
        userId,
        familyId,
        badgeId: badge.id,
        badge,
        earnedAt: new Date(),
        progress: 100,
        actionsCompleted: badge.criteria.minCount,
        actionsRequired: badge.criteria.minCount
      };

      await setDoc(userBadgeRef, {
        ...userBadge,
        earnedAt: Timestamp.now()
      });

      console.log(`🎉 Badge awarded: ${badge.name} to user ${userId}`);

      // TODO: Send notification to user
      // TODO: Update user's Ubuntu score
      // TODO: Trigger celebration animation in UI

    } catch (error) {
      console.error('Error awarding badge:', error);
      throw new Error('Failed to award badge');
    }
  }

  /**
   * Get user's badges
   */
  async getUserBadges(userId: string, familyId: string): Promise<UserBadge[]> {
    try {
      const badgesQuery = query(
        collection(db, 'userBadges'),
        where('userId', '==', userId),
        where('familyId', '==', familyId),
        orderBy('earnedAt', 'desc')
      );

      const badgesSnap = await getDocs(badgesQuery);
      
      return badgesSnap.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          earnedAt: data.earnedAt.toDate()
        } as UserBadge;
      });

    } catch (error) {
      console.error('Error getting user badges:', error);
      return [];
    }
  }

  /**
   * Get badge progress for a user
   */
  async getBadgeProgress(
    userId: string,
    familyId: string,
    badgeId: string
  ): Promise<{ progress: number; actionsCompleted: number; actionsRequired: number }> {
    try {
      const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
      if (!badge) {
        throw new Error('Badge not found');
      }

      // Count relevant actions
      const actionsQuery = query(
        collection(db, 'badgeActions'),
        where('userId', '==', userId),
        where('familyId', '==', familyId),
        where('actionType', '==', badge.criteria.actionType)
      );

      const actionsSnap = await getDocs(actionsQuery);
      const actionsCompleted = actionsSnap.size;
      const actionsRequired = badge.criteria.minCount;
      const progress = Math.min(100, (actionsCompleted / actionsRequired) * 100);

      return {
        progress,
        actionsCompleted,
        actionsRequired
      };

    } catch (error) {
      console.error('Error getting badge progress:', error);
      return { progress: 0, actionsCompleted: 0, actionsRequired: 0 };
    }
  }

  /**
   * Get all available badges
   */
  getAllBadges(): Badge[] {
    return BADGE_DEFINITIONS;
  }

  /**
   * Get badges by principle
   */
  getBadgesByPrinciple(principle: UbuntuPrinciple): Badge[] {
    return BADGE_DEFINITIONS.filter(badge => badge.principle === principle);
  }

  /**
   * Get badges by level
   */
  getBadgesByLevel(level: BadgeLevel): Badge[] {
    return BADGE_DEFINITIONS.filter(badge => badge.level === level);
  }

  /**
   * Get family leaderboard
   */
  async getLeaderboard(familyId: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      // Get all user badges for this family
      const badgesQuery = query(
        collection(db, 'userBadges'),
        where('familyId', '==', familyId)
      );

      const badgesSnap = await getDocs(badgesQuery);

      // Group by user
      const userBadges = new Map<string, UserBadge[]>();
      badgesSnap.docs.forEach(doc => {
        const badge = { ...doc.data(), earnedAt: doc.data().earnedAt.toDate() } as UserBadge;
        const existing = userBadges.get(badge.userId) || [];
        existing.push(badge);
        userBadges.set(badge.userId, existing);
      });

      // Calculate leaderboard entries
      const entries: LeaderboardEntry[] = [];
      
      for (const [userId, badges] of userBadges.entries()) {
        const bronzeBadges = badges.filter(b => b.badge.level === BadgeLevel.BRONZE).length;
        const silverBadges = badges.filter(b => b.badge.level === BadgeLevel.SILVER).length;
        const goldBadges = badges.filter(b => b.badge.level === BadgeLevel.GOLD).length;
        const platinumBadges = badges.filter(b => b.badge.level === BadgeLevel.PLATINUM).length;
        const totalPoints = badges.reduce((sum, b) => sum + b.badge.points, 0);

        // TODO: Fetch user name and role from users collection
        entries.push({
          userId,
          userName: 'User ' + userId.substring(0, 8), // Placeholder
          userRole: 'member', // Placeholder
          totalBadges: badges.length,
          bronzeBadges,
          silverBadges,
          goldBadges,
          platinumBadges,
          totalPoints,
          ubuntuScore: this.calculateUbuntuScore(badges)
        });
      }

      // Sort by total points
      entries.sort((a, b) => b.totalPoints - a.totalPoints);

      return entries.slice(0, limit);

    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  /**
   * Calculate Ubuntu score based on badges
   */
  private calculateUbuntuScore(badges: UserBadge[]): number {
    // Count badges per principle
    const principleCounts = new Map<UbuntuPrinciple, number>();
    
    for (const badge of badges) {
      const count = principleCounts.get(badge.badge.principle) || 0;
      principleCounts.set(badge.badge.principle, count + 1);
    }

    // Balanced score: reward breadth across all principles
    const principles = Object.values(UbuntuPrinciple);
    const minPrincipleCount = Math.min(...principles.map(p => principleCounts.get(p) || 0));
    const totalBadges = badges.length;

    // Score formula: balance (50%) + total (50%)
    const balanceScore = minPrincipleCount * 10; // Max 50 if 5 badges in each principle
    const totalScore = Math.min(50, totalBadges * 2); // Max 50

    return Math.min(100, balanceScore + totalScore);
  }

  /**
   * Get suggested next badges for user
   */
  async getSuggestedBadges(userId: string, familyId: string): Promise<Badge[]> {
    try {
      // Get user's current badges
      const userBadges = await this.getUserBadges(userId, familyId);
      const earnedBadgeIds = new Set(userBadges.map(b => b.badgeId));

      // Find badges not yet earned
      const availableBadges = BADGE_DEFINITIONS.filter(
        badge => !earnedBadgeIds.has(badge.id)
      );

      // Get progress for each available badge
      const badgesWithProgress = await Promise.all(
        availableBadges.map(async badge => {
          const progress = await this.getBadgeProgress(userId, familyId, badge.id);
          return { badge, progress: progress.progress };
        })
      );

      // Sort by progress (closest to completion first)
      badgesWithProgress.sort((a, b) => b.progress - a.progress);

      // Return top 5 suggestions
      return badgesWithProgress.slice(0, 5).map(item => item.badge);

    } catch (error) {
      console.error('Error getting suggested badges:', error);
      return [];
    }
  }
}

// Export singleton instance
let serviceInstance: UbuntuBadgeService | null = null;

export const getUbuntuBadgeService = (): UbuntuBadgeService => {
  if (!serviceInstance) {
    serviceInstance = new UbuntuBadgeService();
  }
  return serviceInstance;
};

export default UbuntuBadgeService;
