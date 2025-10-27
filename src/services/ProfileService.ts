/**
 * Profile Service
 * Handles profile management and LifeSync synchronization
 */

import { LifeCVProfile, ProfileExport, ProfilePicture } from '@/types/profile';

class ProfileService {
  private static instance: ProfileService;
  private readonly storageKey = 'lifecv-profile';
  private readonly syncKey = 'lifecv-sync-status';

  private constructor() {}

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  /**
   * Get user's complete profile
   */
  getProfile(): LifeCVProfile | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving profile:', error);
      return null;
    }
  }

  /**
   * Save profile to local storage
   */
  saveProfile(profile: LifeCVProfile): void {
    try {
      profile.metadata.updatedAt = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(profile));
      this.updateSyncStatus('local', new Date().toISOString());
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }

  /**
   * Export profile as JSON
   */
  exportProfile(profile: LifeCVProfile): ProfileExport {
    return {
      personal: profile.personal,
      professional: profile.professional,
      media: {
        pictures: profile.pictures.map((p) => ({
          id: p.id,
          name: p.name,
          uploadedAt: p.uploadedAt,
          isPrimary: p.isPrimary,
        })),
      },
      completion: profile.completion,
      exportedAt: new Date().toISOString(),
      version: '1.0',
      platform: 'MNI-Intranet',
    };
  }

  /**
   * Import profile from JSON
   */
  importProfile(data: ProfileExport): Partial<LifeCVProfile> {
    return {
      personal: data.personal,
      professional: data.professional,
      completion: data.completion,
    };
  }

  /**
   * Upload picture to profile
   */
  addProfilePicture(profile: LifeCVProfile, file: File): Promise<ProfilePicture> {
    return new Promise((resolve, reject) => {
      if (profile.pictures.length >= 5) {
        reject(new Error('Maximum 5 pictures allowed'));
        return;
      }

      if (!file.type.startsWith('image/')) {
        reject(new Error('Only image files are allowed'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const imageUrl = event.target?.result as string;
          const picture: ProfilePicture = {
            id: `pic-${Date.now()}-${Math.random()}`,
            url: imageUrl,
            name: file.name,
            uploadedAt: new Date().toLocaleDateString(),
            isPrimary: profile.pictures.length === 0,
            metadata: {
              size: file.size,
              mimeType: file.type,
            },
          };

          profile.pictures.push(picture);
          this.saveProfile(profile);
          resolve(picture);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Delete profile picture
   */
  deleteProfilePicture(profile: LifeCVProfile, pictureId: string): void {
    const index = profile.pictures.findIndex((p) => p.id === pictureId);
    if (index === -1) return;

    profile.pictures.splice(index, 1);

    // If deleted picture was primary and there are remaining pictures, set first as primary
    if (!profile.pictures.some((p) => p.isPrimary) && profile.pictures.length > 0) {
      profile.pictures[0].isPrimary = true;
    }

    this.saveProfile(profile);
  }

  /**
   * Set primary picture
   */
  setPrimaryPicture(profile: LifeCVProfile, pictureId: string): void {
    profile.pictures = profile.pictures.map((p) => ({
      ...p,
      isPrimary: p.id === pictureId,
    }));

    this.saveProfile(profile);
  }

  /**
   * Calculate profile completion percentage
   */
  calculateCompletion(profile: LifeCVProfile) {
    const personal = {
      completed: Object.values(profile.personal).filter((v) => v).length,
      total: Object.keys(profile.personal).length,
    };

    const professional = {
      completed: Object.values(profile.professional).filter((v) => v).length,
      total: Object.keys(profile.professional).length,
    };

    const media = {
      completed: profile.pictures.length,
      total: 5,
    };

    const documents = {
      completed: profile.publications.length + profile.certifications.length,
      total: 3,
    };

    const totalCompleted =
      personal.completed + professional.completed + media.completed + documents.completed;
    const totalItems =
      personal.total + professional.total + media.total + documents.total;

    return {
      personal: {
        ...personal,
        percentage: Math.round((personal.completed / personal.total) * 100),
      },
      professional: {
        ...professional,
        percentage: Math.round((professional.completed / professional.total) * 100),
      },
      media: {
        ...media,
        percentage: Math.round((media.completed / media.total) * 100),
      },
      documents: {
        ...documents,
        percentage: Math.round((documents.completed / documents.total) * 100),
      },
      overall: {
        completed: totalCompleted,
        total: totalItems,
        percentage: Math.round((totalCompleted / totalItems) * 100),
      },
    };
  }

  /**
   * Sync with LifeSync
   */
  async syncWithLifeSync(profile: LifeCVProfile): Promise<{ success: boolean; message: string }> {
    try {
      // Prepare export data
      const exportData = this.exportProfile(profile);

      // In a real implementation, this would call LifeSync API
      // For now, we'll just store the sync status
      this.updateSyncStatus('lifesync', new Date().toISOString());

      return {
        success: true,
        message: 'Profile synced with LifeSync. Ready to be updated on LifeSync platform.',
      };
    } catch (error) {
      return {
        success: false,
        message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus(): { lastSyncTime: string; lastPlatform: string } | null {
    try {
      const stored = localStorage.getItem(this.syncKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  /**
   * Update sync status
   */
  private updateSyncStatus(platform: string, timestamp: string): void {
    try {
      localStorage.setItem(
        this.syncKey,
        JSON.stringify({
          lastSyncTime: timestamp,
          lastPlatform: platform,
        })
      );
    } catch (error) {
      console.error('Error updating sync status:', error);
    }
  }

  /**
   * Validate profile
   */
  validateProfile(profile: Partial<LifeCVProfile>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate personal info
    if (!profile.personal?.fullName || profile.personal.fullName.length < 3) {
      errors.push('Full name must be at least 3 characters');
    }

    if (!profile.personal?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.personal.email)) {
      errors.push('Valid email is required');
    }

    if (!profile.personal?.phone || profile.personal.phone.length < 5) {
      errors.push('Valid phone number is required');
    }

    // Validate professional info
    if (!profile.professional?.position || profile.professional.position.length < 2) {
      errors.push('Position is required');
    }

    if (!profile.professional?.organization || profile.professional.organization.length < 2) {
      errors.push('Organization is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate profile summary statistics
   */
  getProfileStats(profile: LifeCVProfile) {
    return {
      pictures: profile.pictures.length,
      experience: profile.experience.length,
      education: profile.education.length,
      skills: profile.skills.length,
      certifications: profile.certifications.length,
      publications: profile.publications.length,
      projects: profile.projects.length,
      socialProfiles: profile.socialProfiles.length,
    };
  }

  /**
   * Export profile data for analytics
   */
  exportAnalytics(profile: LifeCVProfile) {
    return {
      totalYearsExperience: this.calculateTotalExperience(profile.experience),
      skillsByCategory: this.groupSkillsByCategory(profile.skills),
      topSkills: profile.skills.slice(0, 5),
      completionMetrics: profile.completion,
      lastUpdated: profile.metadata.updatedAt,
    };
  }

  /**
   * Calculate total years of experience
   */
  private calculateTotalExperience(experiences: any[]): number {
    let totalYears = 0;

    experiences.forEach((exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
      totalYears += diffYears;
    });

    return Math.round(totalYears);
  }

  /**
   * Group skills by category
   */
  private groupSkillsByCategory(skills: any[]): Record<string, any[]> {
    return skills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      },
      {} as Record<string, any[]>
    );
  }
}

export default ProfileService.getInstance();
