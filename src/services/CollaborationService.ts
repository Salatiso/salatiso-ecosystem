import { db } from '@/config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  onSnapshot,
  Unsubscribe,
  increment,
} from 'firebase/firestore';

/**
 * CollaborationService
 * Real-time collaboration engine with comments, presence, and activity tracking
 */

// ==================== Types ====================

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  text: string;
  createdAt: Date;
  updatedAt: Date;
  reactions: Reaction[];
  replies: Comment[];
  threadId?: string;
  status: 'active' | 'edited' | 'deleted';
  mentions?: string[];
}

export interface Reaction {
  id: string;
  userId: string;
  userName?: string;
  emoji: string;
  timestamp: Date;
}

export interface PresenceInfo {
  userId: string;
  userName: string;
  userAvatar?: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: Date;
  currentPage?: string;
  isTyping?: boolean;
}

export interface Activity {
  id: string;
  userId: string;
  userName?: string;
  type: 'comment' | 'edit' | 'share' | 'permission' | 'presence' | 'document';
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface PaginatedComments {
  comments: Comment[];
  hasMore: boolean;
  nextCursor?: any;
  total: number;
}

export interface SharedDocument {
  id: string;
  eventId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedByName?: string;
  uploadedAt: Date;
  url: string;
  isPublic: boolean;
  downloads: number;
}

export interface Permission {
  id: string;
  userId: string;
  eventId: string;
  role: 'viewer' | 'editor' | 'manager' | 'owner';
  grantedAt: Date;
  grantedBy: string;
}

// ==================== CollaborationService ====================

class CollaborationService {
  /**
   * Add a new comment to an event
   */
  async addComment(
    eventId: string,
    userId: string,
    text: string,
    threadId?: string
  ): Promise<Comment> {
    try {
      const commentsRef = collection(db, `events/${eventId}/comments`);

      const commentData = {
        eventId,
        userId,
        text,
        threadId: threadId || null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'active',
        reactions: [],
        mentions: this.extractMentions(text),
      };

      const docRef = await addDoc(commentsRef, commentData);

      // Log activity
      await this.logActivity(
        eventId,
        userId,
        'comment',
        `Posted a comment`,
        { commentId: docRef.id }
      );

      return {
        id: docRef.id,
        ...commentData,
        createdAt: commentData.createdAt.toDate(),
        updatedAt: commentData.updatedAt.toDate(),
        replies: [],
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  /**
   * Get paginated comments for an event
   */
  async getComments(
    eventId: string,
    pageSize: number = 20,
    startAfterDoc?: any
  ): Promise<PaginatedComments> {
    try {
      const commentsRef = collection(db, `events/${eventId}/comments`);
      const constraints: QueryConstraint[] = [
        where('status', '!=', 'deleted'),
        orderBy('status'),
        orderBy('createdAt', 'desc'),
        limit(pageSize + 1),
      ];

      if (startAfterDoc) {
        constraints.push(startAfter(startAfterDoc));
      }

      const q = query(commentsRef, ...constraints);
      const snapshot = await getDocs(q);

      const hasMore = snapshot.docs.length > pageSize;
      const comments = snapshot.docs
        .slice(0, pageSize)
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            reactions: data.reactions || [],
            replies: [],
          };
        });

      return {
        comments,
        hasMore,
        nextCursor: hasMore ? snapshot.docs[pageSize] : undefined,
        total: comments.length,
      };
    } catch (error) {
      console.error('Error getting comments:', error);
      return { comments: [], hasMore: false, total: 0 };
    }
  }

  /**
   * Update a comment
   */
  async updateComment(
    eventId: string,
    commentId: string,
    text: string
  ): Promise<Comment> {
    try {
      const commentRef = doc(db, `events/${eventId}/comments/${commentId}`);

      const updateData = {
        text,
        updatedAt: Timestamp.now(),
        status: 'edited',
      };

      await updateDoc(commentRef, updateData);

      const updated = await getDoc(commentRef);
      const data = updated.data() || {};

      return {
        id: updated.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        reactions: data.reactions || [],
        replies: [],
      };
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(eventId: string, commentId: string): Promise<void> {
    try {
      const commentRef = doc(db, `events/${eventId}/comments/${commentId}`);

      // Soft delete
      await updateDoc(commentRef, {
        status: 'deleted',
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time comments for an event
   */
  subscribeToComments(
    eventId: string,
    onUpdate: (comments: Comment[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const commentsRef = collection(db, `events/${eventId}/comments`);
      const q = query(
        commentsRef,
        where('status', '!=', 'deleted'),
        orderBy('status'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      return onSnapshot(
        q,
        (snapshot) => {
          const comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              reactions: data.reactions || [],
              replies: [],
            } as Comment;
          });
          onUpdate(comments);
        },
        (error) => {
          console.error('Error subscribing to comments:', error);
          if (onError) onError(error as Error);
        }
      );
    } catch (error) {
      console.error('Error setting up comment subscription:', error);
      return () => {};
    }
  }

  /**
   * Add reaction to a comment
   */
  async addReaction(
    eventId: string,
    commentId: string,
    userId: string,
    emoji: string
  ): Promise<Reaction> {
    try {
      const commentRef = doc(db, `events/${eventId}/comments/${commentId}`);

      const reaction: Reaction = {
        id: `${userId}-${emoji}`,
        userId,
        emoji,
        timestamp: new Date(),
      };

      const comment = await getDoc(commentRef);
      const reactions = comment.data()?.reactions || [];

      // Check if user already reacted with this emoji
      const existingIndex = reactions.findIndex(
        (r: any) => r.userId === userId && r.emoji === emoji
      );

      if (existingIndex === -1) {
        reactions.push(reaction);
        await updateDoc(commentRef, { reactions });
      }

      return reaction;
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }

  /**
   * Remove reaction from a comment
   */
  async removeReaction(
    eventId: string,
    commentId: string,
    userId: string,
    emoji: string
  ): Promise<void> {
    try {
      const commentRef = doc(db, `events/${eventId}/comments/${commentId}`);
      const comment = await getDoc(commentRef);
      const reactions = (comment.data()?.reactions || []).filter(
        (r: any) => !(r.userId === userId && r.emoji === emoji)
      );

      await updateDoc(commentRef, { reactions });
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw error;
    }
  }

  /**
   * Set user presence for an event
   */
  async setUserPresence(
    eventId: string,
    userId: string,
    status: 'online' | 'away' | 'offline',
    userName?: string,
    currentPage?: string
  ): Promise<void> {
    try {
      const presenceRef = doc(db, `events/${eventId}/presence/${userId}`);

      const presenceData = {
        userId,
        userName: userName || 'Anonymous',
        status,
        lastSeen: Timestamp.now(),
        currentPage: currentPage || 'event-detail',
        isTyping: false,
      };

      await updateDoc(presenceRef, presenceData);
    } catch (error) {
      // Create if doesn't exist
      try {
        const presenceRef = doc(db, `events/${eventId}/presence/${userId}`);
        await updateDoc(presenceRef, {
          userId,
          userName: userName || 'Anonymous',
          status,
          lastSeen: Timestamp.now(),
          currentPage: currentPage || 'event-detail',
        });
      } catch (innerError) {
        console.error('Error setting presence:', innerError);
      }
    }
  }

  /**
   * Get users currently viewing an event
   */
  async getUsersPresence(eventId: string): Promise<PresenceInfo[]> {
    try {
      const presenceRef = collection(db, `events/${eventId}/presence`);
      const q = query(presenceRef, where('status', '==', 'online'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          userId: data.userId,
          userName: data.userName || 'User',
          userAvatar: data.userAvatar,
          status: data.status,
          lastSeen: data.lastSeen?.toDate() || new Date(),
          currentPage: data.currentPage,
          isTyping: data.isTyping || false,
        };
      });
    } catch (error) {
      console.error('Error getting presence:', error);
      return [];
    }
  }

  /**
   * Subscribe to real-time presence updates
   */
  subscribeToPresence(
    eventId: string,
    onUpdate: (presence: PresenceInfo[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const presenceRef = collection(db, `events/${eventId}/presence`);
      const q = query(presenceRef, where('status', '==', 'online'));

      return onSnapshot(
        q,
        (snapshot) => {
          const presence = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              userId: data.userId,
              userName: data.userName || 'User',
              userAvatar: data.userAvatar,
              status: data.status,
              lastSeen: data.lastSeen?.toDate() || new Date(),
              currentPage: data.currentPage,
              isTyping: data.isTyping || false,
            } as PresenceInfo;
          });
          onUpdate(presence);
        },
        (error) => {
          console.error('Error subscribing to presence:', error);
          if (onError) onError(error as Error);
        }
      );
    } catch (error) {
      console.error('Error setting up presence subscription:', error);
      return () => {};
    }
  }

  /**
   * Get collaborators for an event
   */
  async getCollaborators(eventId: string): Promise<any[]> {
    try {
      const permissionsRef = collection(
        db,
        `events/${eventId}/permissions`
      );
      const snapshot = await getDocs(permissionsRef);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          grantedAt: data.grantedAt?.toDate() || new Date(),
        };
      });
    } catch (error) {
      console.error('Error getting collaborators:', error);
      return [];
    }
  }

  /**
   * Add collaborator to an event
   */
  async addCollaborator(
    eventId: string,
    userId: string,
    role: string = 'editor'
  ): Promise<void> {
    try {
      const permissionsRef = doc(
        db,
        `events/${eventId}/permissions/${userId}`
      );

      await updateDoc(permissionsRef, {
        userId,
        role,
        grantedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error adding collaborator:', error);
      throw error;
    }
  }

  /**
   * Log activity in event
   */
  async logActivity(
    eventId: string,
    userId: string,
    type: string,
    description: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const activityRef = collection(db, `events/${eventId}/activityLog`);

      const activityData = {
        userId,
        type,
        description,
        timestamp: Timestamp.now(),
        metadata: metadata || {},
      };

      await addDoc(activityRef, activityData);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  /**
   * Get activity log for event
   */
  async getActivityLog(eventId: string, limit_: number = 50): Promise<Activity[]> {
    try {
      const activityRef = collection(db, `events/${eventId}/activityLog`);
      const q = query(
        activityRef,
        orderBy('timestamp', 'desc'),
        limit(limit_)
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as Activity;
      });
    } catch (error) {
      console.error('Error getting activity log:', error);
      return [];
    }
  }

  /**
   * Subscribe to real-time activity log
   */
  subscribeToActivity(
    eventId: string,
    onUpdate: (activities: Activity[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const activityRef = collection(db, `events/${eventId}/activityLog`);
      const q = query(
        activityRef,
        orderBy('timestamp', 'desc'),
        limit(25)
      );

      return onSnapshot(
        q,
        (snapshot) => {
          const activities = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              timestamp: data.timestamp?.toDate() || new Date(),
            } as Activity;
          });
          onUpdate(activities);
        },
        (error) => {
          console.error('Error subscribing to activity:', error);
          if (onError) onError(error as Error);
        }
      );
    } catch (error) {
      console.error('Error setting up activity subscription:', error);
      return () => {};
    }
  }

  // ==================== Private Helpers ====================

  private extractMentions(text: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  }
}

// ==================== Export ====================

const collaborationService = new CollaborationService();
export default collaborationService;
