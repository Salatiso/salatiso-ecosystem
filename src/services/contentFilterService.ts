/**
 * Content Filter Service - Content Visibility Management
 * Filters content based on user role, age, and permissions
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  DocumentData,
  Query,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import roleService from './roleService';
import permissionService from './permissionService';

export interface ContentCategory {
  id: string;
  name: string;
  description: string;
  ageRange?: { min?: number; max?: number };
  accessRoles: string[]; // Role IDs that can access
  isPublic: boolean;
  requiresParentalConsent: boolean;
  createdAt?: Timestamp;
}

export interface FilteredContent {
  contentId: string;
  title: string;
  category: string;
  accessLevel: 'public' | 'restricted' | 'private';
  ageAppropriate: boolean;
  requiresConsent: boolean;
}

interface FilterOptions {
  includePublic?: boolean;
  includeRestricted?: boolean;
  includePrivate?: boolean;
  sortBy?: 'name' | 'date' | 'relevance';
}

class ContentFilterService {
  private static instance: ContentFilterService;
  private categoryCache: Map<string, ContentCategory> = new Map();
  private cacheTimeout: number = 3600000; // 1 hour
  private lastCacheUpdate: number = 0;

  private constructor() {}

  static getInstance(): ContentFilterService {
    if (!ContentFilterService.instance) {
      ContentFilterService.instance = new ContentFilterService();
    }
    return ContentFilterService.instance;
  }

  /**
   * Get accessible categories for user
   */
  async getAccessibleCategories(userId: string): Promise<ContentCategory[]> {
    try {
      const userRole = await roleService.getUserPrimaryRole(userId);
      if (!userRole) {
        return [];
      }

      const allCategories = await this.getAllCategories();

      // Filter categories accessible to user's role
      return allCategories.filter(category => {
        if (category.accessRoles.includes('*')) {
          return true; // Public to all
        }

        if (category.accessRoles.includes(userRole.id)) {
          return true; // Specific role has access
        }

        return false;
      });
    } catch (error) {
      console.error('Error getting accessible categories:', error);
      return [];
    }
  }

  /**
   * Filter content by user's role
   */
  async filterContentByRole(
    userId: string,
    content: any[]
  ): Promise<FilteredContent[]> {
    try {
      const accessibleCategories = await this.getAccessibleCategories(userId);
      const accessibleCategoryIds = accessibleCategories.map(c => c.id);

      return content.filter(item => {
        if (!item.category) {
          return false; // No category = no access
        }

        return accessibleCategoryIds.includes(item.category);
      });
    } catch (error) {
      console.error('Error filtering content by role:', error);
      return [];
    }
  }

  /**
   * Filter content by age
   * Checks if content is appropriate for user's age
   */
  async filterContentByAge(
    userId: string,
    content: any[],
    userAge?: number
  ): Promise<any[]> {
    try {
      // Get user's age from assignment or parameter
      let age = userAge;

      if (!age) {
        age = await this.getUserAge(userId);
      }

      if (!age) {
        return content; // No age restriction
      }

      // Filter by age range
      return content.filter(item => {
        if (!item.ageRange) {
          return true; // No age restriction on content
        }

        const { min = 0, max = 120 } = item.ageRange;
        return age >= min && age <= max;
      });
    } catch (error) {
      console.error('Error filtering content by age:', error);
      return content;
    }
  }

  /**
   * Combined filter: role + age + permissions
   */
  async filterAccessibleContent(
    userId: string,
    content: any[],
    options?: FilterOptions
  ): Promise<FilteredContent[]> {
    try {
      // Step 1: Filter by role
      const roleFiltered = await this.filterContentByRole(userId, content);

      // Step 2: Filter by age
      const ageFiltered = await this.filterContentByAge(userId, roleFiltered);

      // Step 3: Filter by access level if specified
      let finalContent = ageFiltered;

      if (options?.includePublic === false) {
        finalContent = finalContent.filter(c => c.accessLevel !== 'public');
      }

      if (options?.includeRestricted === false) {
        finalContent = finalContent.filter(c => c.accessLevel !== 'restricted');
      }

      if (options?.includePrivate === false) {
        finalContent = finalContent.filter(c => c.accessLevel !== 'private');
      }

      // Step 4: Check permissions if required
      const permissionFiltered = await Promise.all(
        finalContent.map(async (item) => {
          const hasPermission = await permissionService.hasPermission(
            userId,
            item.requiredPermission || 'view_all'
          );

          return hasPermission ? item : null;
        })
      );

      return permissionFiltered.filter(Boolean);
    } catch (error) {
      console.error('Error filtering accessible content:', error);
      return [];
    }
  }

  /**
   * Get content appropriate for specific age group
   */
  async getAgeAppropriateContent(
    age: number,
    category?: string
  ): Promise<ContentCategory[]> {
    try {
      const allCategories = await this.getAllCategories();

      return allCategories.filter(cat => {
        // Filter by category if specified
        if (category && cat.id !== category) {
          return false;
        }

        // Filter by age range
        if (cat.ageRange) {
          const { min = 0, max = 120 } = cat.ageRange;
          if (age < min || age > max) {
            return false;
          }
        }

        return true;
      });
    } catch (error) {
      console.error('Error getting age appropriate content:', error);
      return [];
    }
  }

  /**
   * Check if user can access specific category
   */
  async canAccessCategory(userId: string, categoryId: string): Promise<boolean> {
    try {
      const accessibleCategories = await this.getAccessibleCategories(userId);
      return accessibleCategories.some(cat => cat.id === categoryId);
    } catch (error) {
      console.error('Error checking category access:', error);
      return false;
    }
  }

  /**
   * Check if content requires parental consent
   */
  async requiresParentalConsent(categoryId: string): Promise<boolean> {
    try {
      const category = await this.getCategoryById(categoryId);
      if (!category) {
        return false;
      }

      return category.requiresParentalConsent;
    } catch (error) {
      console.error('Error checking parental consent:', error);
      return false;
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(categoryId: string): Promise<ContentCategory | null> {
    try {
      // Check cache
      if (this.categoryCache.has(categoryId)) {
        const cached = this.categoryCache.get(categoryId);
        if (cached && Date.now() - this.lastCacheUpdate < this.cacheTimeout) {
          return cached;
        }
      }

      // Fetch from Firestore
      const catDoc = await getDoc(doc(db, 'content_categories', categoryId));

      if (!catDoc.exists()) {
        return null;
      }

      const category = catDoc.data() as ContentCategory;
      this.categoryCache.set(categoryId, category);
      this.lastCacheUpdate = Date.now();

      return category;
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }

  /**
   * Get all categories
   */
  async getAllCategories(): Promise<ContentCategory[]> {
    try {
      // Check cache
      if (this.categoryCache.size > 0 && Date.now() - this.lastCacheUpdate < this.cacheTimeout) {
        return Array.from(this.categoryCache.values());
      }

      const categoriesRef = collection(db, 'content_categories');
      const snapshot = await getDocs(categoriesRef);

      const categories = snapshot.docs.map(doc => doc.data() as ContentCategory);

      // Update cache
      this.categoryCache.clear();
      categories.forEach(cat => {
        this.categoryCache.set(cat.id, cat);
      });
      this.lastCacheUpdate = Date.now();

      return categories;
    } catch (error) {
      console.error('Error fetching all categories:', error);
      return [];
    }
  }

  /**
   * Get user's age from Firestore
   */
  private async getUserAge(userId: string): Promise<number | null> {
    try {
      const assignmentDoc = await getDoc(doc(db, 'user_role_assignments', userId));

      if (!assignmentDoc.exists()) {
        return null;
      }

      const data = assignmentDoc.data() as DocumentData;
      const birthDate = data.metadata?.birthDate;

      if (!birthDate) {
        return null;
      }

      // Calculate age from birthDate
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }

      return age;
    } catch (error) {
      console.error('Error getting user age:', error);
      return null;
    }
  }

  /**
   * Check if user is child (based on age)
   */
  async isChildUser(userId: string): Promise<boolean> {
    try {
      const age = await this.getUserAge(userId);
      return age !== null && age < 18;
    } catch (error) {
      console.error('Error checking child user status:', error);
      return false;
    }
  }

  /**
   * Get parent's user ID for child account
   */
  async getParentUserId(childUserId: string): Promise<string | null> {
    try {
      const assignmentDoc = await getDoc(doc(db, 'user_role_assignments', childUserId));

      if (!assignmentDoc.exists()) {
        return null;
      }

      const data = assignmentDoc.data() as DocumentData;
      return data.parentId || null;
    } catch (error) {
      console.error('Error getting parent user ID:', error);
      return null;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.categoryCache.clear();
    this.lastCacheUpdate = 0;
  }
}

export default ContentFilterService.getInstance();
