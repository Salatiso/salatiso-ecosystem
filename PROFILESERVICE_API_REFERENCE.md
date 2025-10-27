# ProfileService API Documentation

## Overview

`ProfileService` is a singleton service that manages all profile-related operations including CRUD operations, picture management, profile completion calculation, and LifeSync synchronization. It provides a unified interface for profile management across the MNI Intranet platform.

## Service Architecture

### Singleton Pattern
```typescript
// ProfileService is instantiated once and reused throughout the application
const profile = ProfileService.getProfile();
```

### Core Responsibilities
1. **Profile Persistence**: Load/save profiles to localStorage
2. **Picture Management**: Handle upload, delete, and primary selection
3. **Completion Tracking**: Calculate multi-dimensional progress metrics
4. **Export/Import**: Serialize/deserialize profiles for backup and sync
5. **LifeSync Integration**: Prepare and synchronize with LifeSync platform
6. **Validation**: Verify profile completeness and data integrity

---

## API Methods

### Profile Operations

#### `getProfile(): LifeCVProfile`
Retrieves the current user's profile from localStorage.

**Returns**:
```typescript
{
  personal: PersonalInfo,
  professional: ProfessionalInfo,
  experience: Experience[],
  education: Education[],
  skills: Skill[],
  certifications: Certification[],
  publications: Publication[],
  projects: Project[],
  media: {
    pictures: ProfilePicture[]
  },
  socialProfiles: SocialProfile[],
  metadata: {
    createdAt: string,
    updatedAt: string,
    version: string
  }
}
```

**Usage**:
```typescript
const currentProfile = ProfileService.getProfile();
console.log(currentProfile.personal.fullName);
```

**Error Handling**:
- Returns empty profile structure if not found
- localStorage errors caught silently

---

#### `saveProfile(profile: LifeCVProfile): boolean`
Persists the profile to localStorage with automatic timestamp update.

**Parameters**:
- `profile` (LifeCVProfile): Complete profile object to save

**Returns**: `boolean` - true if successful, false if error

**Usage**:
```typescript
const success = ProfileService.saveProfile(updatedProfile);
if (!success) console.error('Failed to save profile');
```

**Updates Automatically**:
- `updatedAt`: Current timestamp
- `version`: Profile schema version

**Error Handling**:
- Catches storage quota exceeded
- Validates profile structure before saving

---

### Picture Management

#### `addProfilePicture(profile: LifeCVProfile, file: File): Promise<boolean>`
Uploads a profile picture with validation and storage.

**Parameters**:
- `profile` (LifeCVProfile): Current profile
- `file` (File): Image file to upload

**Returns**: `Promise<boolean>` - true if successful

**Validation Rules**:
- File type must be image/* (JPG, PNG, GIF)
- File size must be ≤ 10MB
- Maximum 5 pictures per profile
- First picture automatically set as primary

**Usage**:
```typescript
const fileInput = document.getElementById('imageInput');
const success = await ProfileService.addProfilePicture(profile, fileInput.files[0]);
if (success) {
  const updated = ProfileService.getProfile();
  setProfile(updated);
}
```

**Process**:
1. Validates file type and size
2. Checks picture count limit
3. Reads file as base64 data URL
4. Creates ProfilePicture object with metadata
5. Adds to profile.media.pictures
6. Auto-saves to localStorage
7. Returns success status

---

#### `deleteProfilePicture(profile: LifeCVProfile, pictureId: string): boolean`
Removes a picture from the profile.

**Parameters**:
- `profile` (LifeCVProfile): Current profile
- `pictureId` (string): ID of picture to delete

**Returns**: `boolean` - true if successful

**Usage**:
```typescript
const success = ProfileService.deleteProfilePicture(profile, 'pic-12345');
if (success) {
  const updated = ProfileService.getProfile();
  setProfile(updated);
}
```

**Automatic Handling**:
- If deleted picture was primary, reassigns primary to first remaining picture
- If no pictures remain, media section resets

---

#### `setPrimaryPicture(profile: LifeCVProfile, pictureId: string): boolean`
Sets a specific picture as the primary/avatar picture.

**Parameters**:
- `profile` (LifeCVProfile): Current profile
- `pictureId` (string): ID of picture to set as primary

**Returns**: `boolean` - true if successful

**Usage**:
```typescript
const success = ProfileService.setPrimaryPicture(profile, 'pic-67890');
if (success) {
  const updated = ProfileService.getProfile();
  setProfile(updated); // Triggers re-render with new primary
}
```

**Side Effects**:
- Unsets previous primary picture
- Updates all pictures' isPrimary flags
- Auto-saves to localStorage

---

### Completion Tracking

#### `calculateCompletion(profile: LifeCVProfile): CompletionMetrics`
Calculates multi-dimensional profile completion percentages.

**Returns**:
```typescript
{
  personal: {
    completed: number,     // Fields filled
    total: number,         // Required fields
    percentage: number     // 0-100
  },
  professional: {
    completed: number,
    total: number,
    percentage: number
  },
  media: {
    completed: number,
    total: number,
    percentage: number
  },
  documents: {
    completed: number,
    total: number,
    percentage: number
  },
  overall: {
    completed: number,     // Total items filled
    total: number,         // Total possible items
    percentage: number     // 0-100 overall
  }
}
```

**Usage**:
```typescript
const completion = ProfileService.calculateCompletion(profile);
console.log(`Profile is ${completion.overall.percentage}% complete`);
console.log(`Personal: ${completion.personal.percentage}%`);
console.log(`Professional: ${completion.professional.percentage}%`);
console.log(`Media: ${completion.media.percentage}%`);
```

**Calculation Logic**:
- Personal: 5 fields (fullName, email, phone, location, bio)
- Professional: 4 fields (position, organization, title, joinDate)
- Media: 5 possible pictures (1 uploaded = 20%)
- Documents: 3 possible documents (not yet implemented)

---

### Export/Import

#### `exportProfile(profile: LifeCVProfile): ProfileExport`
Serializes profile to JSON export format for backup or LifeSync sync.

**Returns**:
```typescript
{
  personal: { /* copy of personal info */ },
  professional: { /* copy of professional info */ },
  media: {
    pictures: [
      {
        id: string,
        name: string,
        uploadedAt: string,
        isPrimary: boolean,
        metadata: { /* picture details */ }
      }
    ]
  },
  completion: { /* completion metrics */ },
  exportedAt: string,        // ISO timestamp
  version: "1.0",           // Schema version
  platform: "MNI-Intranet"  // Source platform
}
```

**Usage**:
```typescript
const exported = ProfileService.exportProfile(profile);

// Convert to JSON and download
const json = JSON.stringify(exported, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `profile-${profile.personal.fullName}-${Date.now()}.json`;
a.click();
```

**What's Included**:
- All personal information
- All professional details
- Picture metadata (but not base64 data URLs)
- Completion status
- Export timestamp
- Platform and version info

**What's Excluded**:
- Picture base64 data (metadata only)
- Application-specific data
- Sync logs

---

#### `importProfile(importData: ProfileExport): LifeCVProfile`
Parses and imports a previously exported profile.

**Parameters**:
- `importData` (ProfileExport): Exported profile object from exportProfile()

**Returns**: `LifeCVProfile` - Imported profile

**Usage**:
```typescript
// Read file from input
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

const reader = new FileReader();
reader.onload = (event) => {
  const imported = JSON.parse(event.target.result);
  const profile = ProfileService.importProfile(imported);
  ProfileService.saveProfile(profile);
  setProfile(profile);
};
reader.readAsText(file);
```

**Validation**:
- Checks for required fields
- Validates JSON structure
- Verifies version compatibility
- Returns error if invalid

**Merge Behavior**:
- Updates personal information
- Updates professional details
- Replaces picture metadata
- Updates completion tracking

---

### LifeSync Integration

#### `syncWithLifeSync(profile: LifeCVProfile): Promise<SyncResult>`
Prepares and initiates synchronization with LifeSync platform.

**Returns**:
```typescript
{
  success: boolean,
  timestamp: string,
  platform: "lifesync",
  syncedItems: {
    personal: boolean,
    professional: boolean,
    pictures: number,
    lastSyncTime: string
  },
  message: string
}
```

**Usage**:
```typescript
const result = await ProfileService.syncWithLifeSync(profile);
if (result.success) {
  console.log(`Synced ${result.syncedItems.pictures} pictures`);
  alert('Profile synced with LifeSync!');
}
```

**Framework Status**:
- ✅ Export format prepared
- ✅ Sync data structured
- ✅ LocalStorage tracking enabled
- ⏳ API endpoint integration pending

---

#### `getSyncStatus(): SyncStatus`
Retrieves the last sync status and timestamps.

**Returns**:
```typescript
{
  lastSyncTime: string | null,    // ISO timestamp or null
  lastPlatform: string | null,    // "lifesync" or null
  syncCount: number,              // Total sync operations
  isUpToDate: boolean            // Based on lastUpdated vs lastSyncTime
}
```

**Usage**:
```typescript
const status = ProfileService.getSyncStatus();
if (status.lastSyncTime) {
  console.log(`Last synced: ${status.lastSyncTime}`);
}
```

---

### Validation & Analytics

#### `validateProfile(profile: LifeCVProfile): ValidationError[]`
Checks profile for required fields and data integrity.

**Returns**: Array of validation errors
```typescript
[
  {
    field: "personal.email",
    error: "Invalid email format",
    severity: "error" | "warning"
  }
]
```

**Usage**:
```typescript
const errors = ProfileService.validateProfile(profile);
if (errors.length > 0) {
  console.error('Profile has validation errors:', errors);
  errors.forEach(e => console.log(`${e.field}: ${e.error}`));
}
```

**Validation Rules**:
- `fullName`: required, minLength 3
- `email`: required, valid email format
- `phone`: required, minLength 5
- `location`: optional, maxLength 100
- `pictures`: max 5, each must be valid image

---

#### `getProfileStats(profile: LifeCVProfile): ProfileStats`
Generates comprehensive statistics about profile contents.

**Returns**:
```typescript
{
  pictures: number,              // Count of pictures
  experience: number,            // Count of work experience
  education: number,             // Count of education entries
  skills: number,                // Count of skills
  certifications: number,        // Count of certifications
  publications: number,          // Count of publications
  projects: number,              // Count of projects
  socialProfiles: number,        // Count of social links
  totalEntries: number,          // Sum of all entries
  completionPercentage: number   // Overall completion
}
```

**Usage**:
```typescript
const stats = ProfileService.getProfileStats(profile);
console.log(`Total skills: ${stats.skills}`);
console.log(`Work experiences: ${stats.experience}`);
console.log(`Profile has ${stats.totalEntries} entries`);
```

---

#### `exportAnalytics(profile: LifeCVProfile): ProfileAnalytics`
Exports analytics data suitable for dashboard or reporting.

**Returns**:
```typescript
{
  totalYearsExperience: number,
  skillsByCategory: {
    [category: string]: number
  },
  topSkills: string[],
  completionMetrics: CompletionMetrics,
  lastUpdated: string,
  exportFormat: "analytics",
  timestamp: string
}
```

**Usage**:
```typescript
const analytics = ProfileService.exportAnalytics(profile);
console.log(`Total experience: ${analytics.totalYearsExperience} years`);
console.log(`Top skills: ${analytics.topSkills.join(', ')}`);
```

---

## Data Types

### LifeCVProfile
```typescript
interface LifeCVProfile {
  personal: PersonalInfo;
  professional: ProfessionalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  publications: Publication[];
  projects: Project[];
  media: {
    pictures: ProfilePicture[];
  };
  socialProfiles: SocialProfile[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
  };
}
```

### ProfilePicture
```typescript
interface ProfilePicture {
  id: string;
  url: string;                    // Data URL or CDN URL
  name: string;                   // Original filename
  uploadedAt: string;             // Date string
  isPrimary: boolean;             // Avatar flag
  metadata?: {
    size?: number;                // Bytes
    mimeType?: string;            // image/jpeg, etc
    width?: number;               // Pixels
    height?: number;              // Pixels
  };
}
```

### PersonalInfo
```typescript
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  dateOfBirth?: string;
  nationality?: string;
  languages?: string[];
}
```

### ProfessionalInfo
```typescript
interface ProfessionalInfo {
  position: string;               // Current position/title
  organization: string;           // Company/organization name
  title: string;                  // Professional designation
  joinDate: string;              // Start date
  department?: string;
  reportsTo?: string;
  specialties?: string[];
}
```

---

## Error Handling

### Common Errors

```typescript
// Picture upload errors
try {
  await ProfileService.addProfilePicture(profile, file);
} catch (error) {
  if (error.code === 'PICTURE_LIMIT_EXCEEDED') {
    console.error('Maximum 5 pictures allowed');
  } else if (error.code === 'INVALID_FILE_TYPE') {
    console.error('Only JPG, PNG, GIF allowed');
  } else if (error.code === 'FILE_SIZE_EXCEEDED') {
    console.error('File must be under 10MB');
  }
}

// Profile save errors
try {
  ProfileService.saveProfile(profile);
} catch (error) {
  if (error.code === 'STORAGE_QUOTA_EXCEEDED') {
    console.error('Browser storage full');
  } else if (error.code === 'INVALID_PROFILE') {
    console.error('Profile structure invalid');
  }
}
```

---

## Usage Examples

### Complete Profile Workflow

```typescript
// 1. Get current profile
let profile = ProfileService.getProfile();

// 2. Add a profile picture
await ProfileService.addProfilePicture(profile, imageFile);
profile = ProfileService.getProfile();

// 3. Check completion
const completion = ProfileService.calculateCompletion(profile);
console.log(`Completion: ${completion.overall.percentage}%`);

// 4. Validate before sync
const errors = ProfileService.validateProfile(profile);
if (errors.length === 0) {
  // 5. Export for backup/sync
  const exported = ProfileService.exportProfile(profile);
  
  // 6. Save to file
  downloadAsJson(exported, `profile-${profile.personal.fullName}.json`);
  
  // 7. Sync with LifeSync
  const syncResult = await ProfileService.syncWithLifeSync(profile);
  console.log('Sync complete:', syncResult);
}
```

### Picture Management Workflow

```typescript
// Upload picture
await ProfileService.addProfilePicture(profile, file);
let updated = ProfileService.getProfile();
console.log(`Now have ${updated.media.pictures.length} pictures`);

// Set different picture as primary
const primaryId = updated.media.pictures[2].id;
ProfileService.setPrimaryPicture(updated, primaryId);
updated = ProfileService.getProfile();

// Delete a picture
const pictureToDelete = updated.media.pictures[1].id;
ProfileService.deleteProfilePicture(updated, pictureToDelete);
updated = ProfileService.getProfile();
```

---

## Performance Considerations

### localStorage Limits
- Browser localStorage typically ~5-10MB
- Base64 encoded pictures consume more space (~1.3x original)
- Recommend keeping profile data organized

### Optimization Tips
1. Export profiles periodically to backup
2. Keep only necessary pictures (max 5)
3. Clear old/unused profile data
4. Use CDN for cloud pictures (upcoming)

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| FileReader | ✅ 13+ | ✅ 10+ | ✅ 10+ | ✅ 12+ |
| localStorage | ✅ All | ✅ All | ✅ 4+ | ✅ All |
| Blob API | ✅ All | ✅ 19+ | ✅ 10+ | ✅ 12+ |
| Promise | ✅ 32+ | ✅ 29+ | ✅ 8+ | ✅ 12+ |

---

## Future Enhancements

- [ ] Firebase Cloud Storage integration
- [ ] Real-time sync with LifeSync API
- [ ] Image compression/optimization
- [ ] Bidirectional sync conflict resolution
- [ ] Profile version history
- [ ] Advanced permission/sharing controls

---

**Version**: 1.0  
**Last Updated**: October 26, 2025  
**Status**: Active & Fully Functional
