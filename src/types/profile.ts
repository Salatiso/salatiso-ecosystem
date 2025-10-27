/**
 * Profile Types
 * Comprehensive LifeCV Profile Data Structures
 * LifeSync Compatible Format
 */

export interface ProfilePicture {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
  isPrimary: boolean;
  metadata?: {
    size?: number;
    mimeType?: string;
    dimensions?: {
      width: number;
      height: number;
    };
  };
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio?: string;
  dateOfBirth?: string;
  nationality?: string;
  languages?: string[];
}

export interface ProfessionalInfo {
  position: string;
  organization: string;
  title: string;
  joinDate: string;
  department?: string;
  reportsTo?: string;
  specialties?: string[];
}

export interface Experience {
  id: string;
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  completionDate: string;
  grade?: string;
  activities?: string[];
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'other';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements?: number;
  yearsOfExperience?: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Publication {
  id: string;
  title: string;
  description?: string;
  publicationDate: string;
  url?: string;
  type: 'article' | 'book' | 'research' | 'podcast' | 'video' | 'other';
  publisher?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  url?: string;
  technologies?: string[];
  impact?: string;
  role?: string;
}

export interface SocialProfile {
  platform: string; // 'linkedin', 'github', 'twitter', 'medium', 'youtube', etc.
  username?: string;
  url: string;
  followers?: number;
}

export interface ProfileCompletion {
  personal: { completed: number; total: number; percentage: number };
  professional: { completed: number; total: number; percentage: number };
  media: { completed: number; total: number; percentage: number };
  documents: { completed: number; total: number; percentage: number };
  overall: { completed: number; total: number; percentage: number };
}

export interface ProfileMetadata {
  createdAt: string;
  updatedAt: string;
  version: string;
  platform: 'MNI-Intranet' | 'LifeSync' | 'Hub' | 'Other';
  visibility: 'private' | 'friends' | 'public';
}

export interface LifeCVProfile {
  // Core Identity
  personal: PersonalInfo;
  professional: ProfessionalInfo;
  pictures: ProfilePicture[];

  // Career & Education
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];

  // Achievements & Impact
  publications: Publication[];
  projects: Project[];
  socialProfiles: SocialProfile[];

  // Additional Information
  bio?: string;
  values?: string[];
  interests?: string[];
  languages?: string[];

  // Metadata
  completion: ProfileCompletion;
  metadata: ProfileMetadata;
}

/**
 * Export Format for Backup/Sync
 */
export interface ProfileExport {
  personal: PersonalInfo;
  professional: ProfessionalInfo;
  media: {
    pictures: Array<{
      id: string;
      name: string;
      uploadedAt: string;
      isPrimary: boolean;
    }>;
  };
  completion: ProfileCompletion;
  exportedAt: string;
  version: string;
  platform: string;
}

/**
 * Profile Validation Schema
 */
export const ProfileValidation = {
  personal: {
    fullName: { required: true, type: 'string', minLength: 3 },
    email: { required: true, type: 'email' },
    phone: { required: true, type: 'string' },
    location: { required: true, type: 'string' },
    bio: { required: false, type: 'string', maxLength: 1000 },
  },
  professional: {
    position: { required: true, type: 'string' },
    organization: { required: true, type: 'string' },
    title: { required: true, type: 'string' },
    joinDate: { required: true, type: 'date' },
  },
  media: {
    pictures: {
      required: false,
      maxFiles: 5,
      allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
      maxFileSize: 10485760, // 10MB
    },
  },
};
