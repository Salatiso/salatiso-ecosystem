import { 
  doc, 
  setDoc, 
  getDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ref, onValue, onDisconnect, set, serverTimestamp as rtdbServerTimestamp } from 'firebase/database';

export type PresenceStatus = 'online' | 'offline' | 'invisible';

export interface UserPresence {
  status: PresenceStatus;
  lastSeen: Date;
  userId: string;
  displayName?: string;
}

export interface PresenceSettings {
  defaultStatus: PresenceStatus;
  showOnlineStatus: boolean;
  allowFamilyToSee: boolean;
  allowContactsToSee: boolean;
}

class PresenceService {
  private presenceCollection = 'presence';
  private settingsCollection = 'userSettings';
  private unsubscribers: Map<string, () => void> = new Map();

  /**
   * Initialize presence tracking for the current user
   * Sets up automatic online/offline detection
   */
  async initializePresence(userId: string, displayName?: string): Promise<void> {
    try {
      const presenceRef = doc(db, this.presenceCollection, userId);
      
      // Get user's presence settings
      const settings = await this.getPresenceSettings(userId);
      const status = settings?.defaultStatus || 'online';

      // Set initial presence
      await setDoc(presenceRef, {
        status: status,
        lastSeen: serverTimestamp(),
        userId: userId,
        displayName: displayName || 'User',
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Set up visibility change detection (when tab becomes active/inactive)
      const handleVisibilityChange = async () => {
        if (document.hidden) {
          // Tab is hidden - don't change status
          await this.updateLastSeen(userId);
        } else {
          // Tab is visible - ensure online status
          if (status !== 'invisible') {
            await this.setUserStatus(userId, status);
          }
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Store cleanup function
      this.unsubscribers.set(userId, () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      });

      // Set up periodic heartbeat (every 30 seconds)
      const heartbeatInterval = setInterval(async () => {
        if (!document.hidden) {
          await this.updateLastSeen(userId);
        }
      }, 30000);

      // Add heartbeat cleanup
      const existingCleanup = this.unsubscribers.get(userId);
      this.unsubscribers.set(userId, () => {
        existingCleanup?.();
        clearInterval(heartbeatInterval);
      });

    } catch (error) {
      console.error('Error initializing presence:', error);
      throw error;
    }
  }

  /**
   * Set user to offline when they leave
   */
  async cleanupPresence(userId: string): Promise<void> {
    try {
      // Run cleanup functions
      const cleanup = this.unsubscribers.get(userId);
      if (cleanup) {
        cleanup();
        this.unsubscribers.delete(userId);
      }

      // Set status to offline
      const presenceRef = doc(db, this.presenceCollection, userId);
      await updateDoc(presenceRef, {
        status: 'offline',
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error cleaning up presence:', error);
    }
  }

  /**
   * Update user's online status
   */
  async setUserStatus(userId: string, status: PresenceStatus): Promise<void> {
    try {
      const presenceRef = doc(db, this.presenceCollection, userId);
      await updateDoc(presenceRef, {
        status: status,
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error setting user status:', error);
      throw error;
    }
  }

  /**
   * Update last seen timestamp
   */
  async updateLastSeen(userId: string): Promise<void> {
    try {
      const presenceRef = doc(db, this.presenceCollection, userId);
      await updateDoc(presenceRef, {
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last seen:', error);
    }
  }

  /**
   * Get user's current presence
   */
  async getUserPresence(userId: string): Promise<UserPresence | null> {
    try {
      const presenceRef = doc(db, this.presenceCollection, userId);
      const presenceDoc = await getDoc(presenceRef);
      
      if (!presenceDoc.exists()) {
        return null;
      }

      const data = presenceDoc.data();
      return {
        status: data.status as PresenceStatus,
        lastSeen: data.lastSeen?.toDate() || new Date(),
        userId: data.userId,
        displayName: data.displayName
      };
    } catch (error) {
      console.error('Error getting user presence:', error);
      return null;
    }
  }

  /**
   * Subscribe to user presence changes (real-time)
   */
  subscribeToPresence(userId: string, callback: (presence: UserPresence | null) => void): () => void {
    try {
      const presenceRef = doc(db, this.presenceCollection, userId);
      
      const unsubscribe = onSnapshot(presenceRef, (snapshot) => {
        if (!snapshot.exists()) {
          callback(null);
          return;
        }

        const data = snapshot.data();
        callback({
          status: data.status as PresenceStatus,
          lastSeen: data.lastSeen?.toDate() || new Date(),
          userId: data.userId,
          displayName: data.displayName
        });
      }, (error) => {
        console.error('Error in presence subscription:', error);
        callback(null);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to presence:', error);
      return () => {};
    }
  }

  /**
   * Get presence settings for a user
   */
  async getPresenceSettings(userId: string): Promise<PresenceSettings | null> {
    try {
      const settingsRef = doc(db, this.settingsCollection, userId);
      const settingsDoc = await getDoc(settingsRef);
      
      if (!settingsDoc.exists()) {
        // Return default settings
        return {
          defaultStatus: 'online',
          showOnlineStatus: true,
          allowFamilyToSee: true,
          allowContactsToSee: true
        };
      }

      const data = settingsDoc.data();
      return {
        defaultStatus: data.defaultStatus || 'online',
        showOnlineStatus: data.showOnlineStatus !== false,
        allowFamilyToSee: data.allowFamilyToSee !== false,
        allowContactsToSee: data.allowContactsToSee !== false
      };
    } catch (error) {
      console.error('Error getting presence settings:', error);
      return null;
    }
  }

  /**
   * Update presence settings
   */
  async updatePresenceSettings(userId: string, settings: Partial<PresenceSettings>): Promise<void> {
    try {
      const settingsRef = doc(db, this.settingsCollection, userId);
      await setDoc(settingsRef, {
        ...settings,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // If default status changed, update current status
      if (settings.defaultStatus) {
        await this.setUserStatus(userId, settings.defaultStatus);
      }
    } catch (error) {
      console.error('Error updating presence settings:', error);
      throw error;
    }
  }

  /**
   * Check if user can see another user's presence
   */
  async canSeePresence(viewerId: string, targetUserId: string, relationship: 'family' | 'contact'): Promise<boolean> {
    try {
      const settings = await this.getPresenceSettings(targetUserId);
      
      if (!settings || !settings.showOnlineStatus) {
        return false;
      }

      if (relationship === 'family') {
        return settings.allowFamilyToSee;
      }

      if (relationship === 'contact') {
        return settings.allowContactsToSee;
      }

      return false;
    } catch (error) {
      console.error('Error checking presence visibility:', error);
      return false;
    }
  }

  /**
   * Format last seen time (e.g., "2 minutes ago", "Active now")
   */
  formatLastSeen(lastSeen: Date, currentStatus: PresenceStatus): string {
    if (currentStatus === 'online') {
      return 'Active now';
    }

    if (currentStatus === 'invisible') {
      return 'Offline';
    }

    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return lastSeen.toLocaleDateString();
    }
  }

  /**
   * Batch get presence for multiple users
   */
  async getBatchPresence(userIds: string[]): Promise<Map<string, UserPresence>> {
    const presenceMap = new Map<string, UserPresence>();
    
    try {
      const promises = userIds.map(async (userId) => {
        const presence = await this.getUserPresence(userId);
        if (presence) {
          presenceMap.set(userId, presence);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error getting batch presence:', error);
    }

    return presenceMap;
  }
}

export const presenceService = new PresenceService();
export default presenceService;
