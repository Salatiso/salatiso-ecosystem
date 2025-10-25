// ============================================================================
// LIFECV DASHBOARD SERVICE
// ============================================================================
// Manages LifeCV status, trust seals, and sync with LifeSync app
// Ecosystem Strategy: LifeSync is home of LifeCV, other apps show summary

import { 
  doc, 
  getDoc, 
  updateDoc,
  onSnapshot,
  Unsubscribe,
  Firestore
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/config/firebase';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface TrustSeal {
  id: string;
  name: string;
  type: 'personal' | 'professional' | 'verified' | 'achievement';
  status: 'active' | 'inactive' | 'pending' | 'expired';
  icon?: string;
  description?: string;
  issuedDate?: Date;
  expiresAt?: Date;
  issuer?: string;
}

export interface LifeCVProfile {
  userId: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  
  // Core LifeCV Status
  completionPercentage: number; // 0-100
  lastUpdatedDate: Date;
  
  // Trust Information
  trustScore: number; // 0-100
  trustTier: 'unknown' | 'emerging' | 'developing' | 'established' | 'exemplary';
  trustSeals: TrustSeal[];
  
  // Status Indicators
  isVerified: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  
  // Sync Information
  lastSyncDate: Date;
  syncStatus: 'synced' | 'syncing' | 'failed' | 'pending';
  syncErrorMessage?: string;
  
  // Sections Completion
  sectionsCompleted: {
    profile: boolean;
    skills: boolean;
    workExperience: boolean;
    education: boolean;
    certifications: boolean;
    projects: boolean;
    languages: boolean;
    achievements: boolean;
  };
  
  // Recent Activity
  recentActivities: LifeCVActivity[];
}

export interface LifeCVActivity {
  id: string;
  type: 'section_updated' | 'seal_earned' | 'verification_changed' | 'sync_completed';
  description: string;
  timestamp: Date;
  icon?: string;
}

export interface LifeCVSyncResult {
  success: boolean;
  message: string;
  profile?: LifeCVProfile;
  error?: string;
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class LifeCVDashboardService {
  private static instance: LifeCVDashboardService;
  private lifecvCache: Map<string, LifeCVProfile> = new Map();
  private syncListeners: Map<string, Unsubscribe> = new Map();
  private lastSyncAttempt: Map<string, number> = new Map();

  private constructor() {}

  public static getInstance(): LifeCVDashboardService {
    if (!LifeCVDashboardService.instance) {
      LifeCVDashboardService.instance = new LifeCVDashboardService();
    }
    return LifeCVDashboardService.instance;
  }

  // ========================================================================
  // PROFILE FETCHING
  // ========================================================================

  /**
   * Fetch LifeCV profile for current user from Firestore
   * Attempts to fetch from LifeSync's shared Firestore
   */
  async getLifeCVProfile(userId?: string): Promise<LifeCVProfile | null> {
    try {
      const auth = getAuth();
      const currentUser = userId || auth.currentUser?.uid;

      if (!currentUser) {
        console.warn('No authenticated user found');
        return null;
      }

      // Check cache first
      if (this.lifecvCache.has(currentUser)) {
        return this.lifecvCache.get(currentUser)!;
      }

      // Fetch from Firestore - try LifeCV collection
      const lifecvDocRef = doc(db, 'lifecv', currentUser);
      const lifecvDocSnap = await getDoc(lifecvDocRef);

      if (lifecvDocSnap.exists()) {
        const data = lifecvDocSnap.data();
        const profile = this.normalizeLifeCVData(currentUser, data);
        
        // Cache it
        this.lifecvCache.set(currentUser, profile);
        
        return profile;
      }

      // If no LifeCV doc, create a minimal profile
      return this.createDefaultProfile(currentUser);
    } catch (error) {
      console.error('Error fetching LifeCV profile:', error);
      return null;
    }
  }

  /**
   * Normalize and transform LifeCV data from Firestore
   */
  private normalizeLifeCVData(userId: string, data: any): LifeCVProfile {
    return {
      userId,
      displayName: data.displayName || data.fullName || 'Unnamed User',
      email: data.email,
      avatarUrl: data.avatarUrl || data.profilePicture,
      
      // Completion tracking
      completionPercentage: data.completionPercentage || this.calculateCompletion(data),
      lastUpdatedDate: data.lastUpdatedDate ? new Date(data.lastUpdatedDate) : new Date(),
      
      // Trust
      trustScore: data.trustScore || 50,
      trustTier: data.trustTier || 'unknown',
      trustSeals: (data.trustSeals || []).map(this.normalizeTrustSeal),
      
      // Verification
      isVerified: data.isVerified || false,
      verificationStatus: data.verificationStatus || 'unverified',
      
      // Sync Info
      lastSyncDate: data.lastSyncDate ? new Date(data.lastSyncDate) : new Date(),
      syncStatus: 'synced',
      
      // Sections
      sectionsCompleted: this.calculateSectionCompletion(data),
      
      // Recent activities
      recentActivities: (data.recentActivities || [])
        .slice(0, 5)
        .map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        }))
    };
  }

  /**
   * Calculate completion percentage based on completed sections
   */
  private calculateCompletion(data: any): number {
    const sections = [
      'profile',
      'skills',
      'workExperience',
      'education',
      'certifications',
      'projects',
      'languages',
      'achievements'
    ];

    const completed = sections.filter(section => {
      const sectionData = data[section];
      return sectionData && Object.keys(sectionData).length > 0;
    }).length;

    return Math.round((completed / sections.length) * 100);
  }

  /**
   * Calculate which sections are completed
   */
  private calculateSectionCompletion(data: any) {
    return {
      profile: !!(data.profile && Object.keys(data.profile).length > 2),
      skills: !!(data.skills && Array.isArray(data.skills) && data.skills.length > 0),
      workExperience: !!(data.workExperience && Array.isArray(data.workExperience) && data.workExperience.length > 0),
      education: !!(data.education && Array.isArray(data.education) && data.education.length > 0),
      certifications: !!(data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0),
      projects: !!(data.projects && Array.isArray(data.projects) && data.projects.length > 0),
      languages: !!(data.languages && Array.isArray(data.languages) && data.languages.length > 0),
      achievements: !!(data.achievements && Array.isArray(data.achievements) && data.achievements.length > 0),
    };
  }

  /**
   * Create a default profile for new users
   */
  private createDefaultProfile(userId: string): LifeCVProfile {
    const now = new Date();
    return {
      userId,
      displayName: 'New User',
      completionPercentage: 0,
      lastUpdatedDate: now,
      trustScore: 50,
      trustTier: 'unknown',
      trustSeals: [],
      isVerified: false,
      verificationStatus: 'unverified',
      lastSyncDate: now,
      syncStatus: 'pending',
      sectionsCompleted: {
        profile: false,
        skills: false,
        workExperience: false,
        education: false,
        certifications: false,
        projects: false,
        languages: false,
        achievements: false,
      },
      recentActivities: [
        {
          id: 'init',
          type: 'section_updated',
          description: 'Profile created - get started by visiting LifeSync',
          timestamp: now,
        }
      ]
    };
  }

  /**
   * Normalize trust seal data
   */
  private normalizeTrustSeal(seal: any): TrustSeal {
    return {
      id: seal.id || Math.random().toString(36),
      name: seal.name || 'Trust Seal',
      type: seal.type || 'personal',
      status: seal.status || 'active',
      icon: seal.icon,
      description: seal.description,
      issuedDate: seal.issuedDate ? new Date(seal.issuedDate) : undefined,
      expiresAt: seal.expiresAt ? new Date(seal.expiresAt) : undefined,
      issuer: seal.issuer,
    };
  }

  // ========================================================================
  // REAL-TIME SYNC
  // ========================================================================

  /**
   * Setup real-time listener for LifeCV changes
   * Automatically updates component when user updates LifeCV in LifeSync
   */
  setupRealtimeSync(userId: string, onUpdate: (profile: LifeCVProfile) => void): Unsubscribe {
    if (this.syncListeners.has(userId)) {
      // Already listening
      return this.syncListeners.get(userId)!;
    }

    try {
      const lifecvDocRef = doc(db, 'lifecv', userId);
      
      const unsubscribe = onSnapshot(
        lifecvDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const profile = this.normalizeLifeCVData(userId, data);
            
            // Update cache
            this.lifecvCache.set(userId, profile);
            
            // Update component
            onUpdate(profile);
          }
        },
        (error) => {
          console.error('Error in LifeCV real-time sync:', error);
        }
      );

      this.syncListeners.set(userId, unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up real-time sync:', error);
      return () => {}; // Return no-op unsubscribe
    }
  }

  /**
   * Stop listening for real-time updates
   */
  stopRealtimeSync(userId: string): void {
    const unsubscribe = this.syncListeners.get(userId);
    if (unsubscribe) {
      unsubscribe();
      this.syncListeners.delete(userId);
    }
  }

  /**
   * Stop all listeners
   */
  stopAllListeners(): void {
    this.syncListeners.forEach(unsubscribe => unsubscribe());
    this.syncListeners.clear();
  }

  // ========================================================================
  // SYNC MANAGEMENT
  // ========================================================================

  /**
   * Trigger manual sync with LifeSync
   * This updates the lastSyncDate and pulls latest data
   */
  async triggerSync(userId: string): Promise<LifeCVSyncResult> {
    try {
      // Prevent rapid consecutive syncs
      const lastSync = this.lastSyncAttempt.get(userId) || 0;
      if (Date.now() - lastSync < 5000) {
        return {
          success: false,
          message: 'Sync already in progress. Please wait.',
          error: 'SYNC_THROTTLED'
        };
      }

      this.lastSyncAttempt.set(userId, Date.now());

      // Fetch fresh data
      const profile = await this.getLifeCVProfile(userId);
      
      if (!profile) {
        return {
          success: false,
          message: 'Failed to fetch LifeCV profile',
          error: 'FETCH_FAILED'
        };
      }

      // Update sync timestamp in cache
      profile.syncStatus = 'synced';
      profile.lastSyncDate = new Date();
      
      this.lifecvCache.set(userId, profile);

      return {
        success: true,
        message: 'LifeCV synced successfully',
        profile
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        message: 'Sync failed',
        error: errorMessage
      };
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus(userId: string): { status: string; lastSync: Date } {
    const profile = this.lifecvCache.get(userId);
    return {
      status: profile?.syncStatus || 'unknown',
      lastSync: profile?.lastSyncDate || new Date()
    };
  }

  /**
   * Clear cache for a user
   */
  clearCache(userId: string): void {
    this.lifecvCache.delete(userId);
  }

  /**
   * Clear all caches
   */
  clearAllCache(): void {
    this.lifecvCache.clear();
  }

  // ========================================================================
  // TRUST SEALS
  // ========================================================================

  /**
   * Get active trust seals
   */
  getActiveTrustSeals(profile: LifeCVProfile): TrustSeal[] {
    return profile.trustSeals.filter(seal => 
      seal.status === 'active' && 
      (!seal.expiresAt || seal.expiresAt > new Date())
    );
  }

  /**
   * Get trust seal by type
   */
  getTrustSealsByType(profile: LifeCVProfile, type: string): TrustSeal[] {
    return profile.trustSeals.filter(seal => seal.type === type);
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  /**
   * Get completion status message
   */
  getCompletionStatusMessage(completionPercentage: number): string {
    if (completionPercentage === 0) return 'Profile not started';
    if (completionPercentage < 25) return 'Getting started';
    if (completionPercentage < 50) return 'Profile in progress';
    if (completionPercentage < 75) return 'Profile mostly complete';
    if (completionPercentage < 100) return 'Nearly complete';
    return 'Profile complete';
  }

  /**
   * Get trust tier color
   */
  getTrustTierColor(trustTier: string): string {
    const colors: Record<string, string> = {
      'unknown': 'bg-gray-100 text-gray-700',
      'emerging': 'bg-blue-100 text-blue-700',
      'developing': 'bg-cyan-100 text-cyan-700',
      'established': 'bg-green-100 text-green-700',
      'exemplary': 'bg-amber-100 text-amber-700',
    };
    return colors[trustTier] || colors['unknown'];
  }

  /**
   * Get trust tier icon/badge
   */
  getTrustTierBadge(trustTier: string): string {
    const badges: Record<string, string> = {
      'unknown': '○',
      'emerging': '◐',
      'developing': '◑',
      'established': '◕',
      'exemplary': '●',
    };
    return badges[trustTier] || '○';
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | undefined): string {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
}

// Export singleton instance
export const lifecvDashboardService = LifeCVDashboardService.getInstance();

export default LifeCVDashboardService;
