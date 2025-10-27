# Enhanced Profile System - LifeCV Integration

## Overview

The enhanced profile system is a comprehensive LifeCV (Life Curriculum Vitae) implementation that enables seamless profile management and synchronization with LifeSync. Users can manage their complete professional and personal identity with advanced features for media management, file uploads, and cross-platform synchronization.

## Features

### 1. **Profile Information Management**
- **Personal Information**
  - Full Name
  - Email Address
  - Phone Number
  - Location
  - Biography/Bio

- **Professional Information**
  - Position/Title
  - Organization
  - Professional Title/Designation
  - Join Date

### 2. **Profile Picture Management**
- Upload up to 5 profile pictures
- Supported formats: JPG, PNG, GIF
- Maximum file size: 10MB per picture
- Set primary picture for display
- Easy-to-use gallery interface
- Drag-and-drop upload support
- Real-time upload progress tracking

### 3. **Profile Completion Tracking**
- Visual progress indicators for each section:
  - Personal Information (up to 80%)
  - Professional Information (up to 75%)
  - Media/Pictures (0-100%)
  - Documents (0-100%)
- Overall completion percentage
- Section-by-section breakdown

### 4. **File Management**
- **Export Profile**: Download profile as JSON
  - Includes personal info, professional info, media metadata
  - Suitable for backup and synchronization
  - Version control included
  - Timestamp and platform information

- **Import Profile**: Upload previously exported profiles
  - Merge existing data
  - Restore from backup
  - Cross-platform synchronization

### 5. **LifeSync Integration**
- One-click export functionality
- Seamless synchronization with LifeSync platform
- LifeSync serves as the home for comprehensive LifeCV
- Profile data portability across ecosystem platforms
- Real-time sync status tracking

## User Experience

### Profile Completion Status
Users see visual feedback about their profile progress:
```
Personal Info: 80% (4/5 fields)
Professional: 75% (3/4 fields)
Media: 0% (0/5 pictures)
Documents: 0% (0/3 files)
Overall: 41% (7/17 items)
```

### Upload Guidelines
Three-step process with clear instructions:
1. **Upload Photos** - Add up to 5 profile pictures
2. **Export Profile** - Download as JSON for backup
3. **Sync with LifeSync** - Import/update comprehensive LifeCV

### Picture Management
- Click to upload or drag-and-drop pictures
- Hover actions on each picture:
  - Set as primary (checkmark icon)
  - Delete (trash icon)
- Display date uploaded and filename
- Visual primary indicator badge

### Profile Export/Import
- Export: One-click download as JSON file
- Import: Upload previously exported JSON files
- Format: `profile-[FullName]-[timestamp].json`
- Includes all personal and professional information

## Data Structure

### Profile Export Format
```json
{
  "personal": {
    "fullName": "Salatiso Lonwabo Mdeni",
    "email": "salatiso@salatiso.com",
    "phone": "084 652 9115",
    "location": "Johannesburg, Gauteng, South Africa",
    "bio": "..."
  },
  "professional": {
    "position": "Founder & Social Entrepreneur",
    "organization": "Salatiso Ecosystem",
    "title": "OHS Specialist, Risk Management Expert, Author & Advocate",
    "joinDate": "January 2023"
  },
  "media": {
    "pictures": [
      {
        "id": "pic-xxx",
        "name": "profile-pic.jpg",
        "uploadedAt": "10/26/2025",
        "isPrimary": true
      }
    ]
  },
  "completion": {
    "personal": { "completed": 5, "total": 5, "percentage": 100 },
    "professional": { "completed": 4, "total": 4, "percentage": 100 },
    "media": { "completed": 1, "total": 5, "percentage": 20 },
    "documents": { "completed": 0, "total": 3, "percentage": 0 },
    "overall": { "completed": 10, "total": 17, "percentage": 59 }
  },
  "exportedAt": "2025-10-26T10:30:00Z",
  "version": "1.0",
  "platform": "MNI-Intranet"
}
```

## Technical Implementation

### Components
- `src/pages/intranet/profile.tsx` - Main profile page component
- Uses React hooks for state management
- Client-side file handling with FileReader API
- localStorage for profile persistence

### Services
- `src/services/ProfileService.ts` - Core profile operations
  - Profile CRUD operations
  - Picture management
  - Completion calculations
  - Export/import functionality
  - LifeSync synchronization

### Types
- `src/types/profile.ts` - TypeScript interfaces
  - `LifeCVProfile` - Complete profile structure
  - `ProfilePicture` - Picture metadata
  - `PersonalInfo`, `ProfessionalInfo` - Profile sections
  - Validation schemas

## LifeSync Compatibility

### Synchronization Features
1. **Bi-directional Sync**
   - Export from MNI Intranet
   - Import into LifeSync
   - Update on either platform

2. **Data Preservation**
   - All personal information preserved
   - All professional details retained
   - Media metadata synchronized
   - Completion tracking maintained

3. **Version Control**
   - Each export includes version number
   - Timestamp information
   - Platform origin tracking
   - Enable rollback capabilities

### Workflow
```
MNI Intranet Profile
        ↓
   [Export JSON]
        ↓
   LifeSync
        ↓
   [Update & Enhance]
        ↓
   Complete LifeCV Home
```

## Usage Examples

### Uploading Your First Picture
1. Navigate to Profile Pictures section
2. Click the upload area or drag-and-drop
3. Select image (JPG, PNG, GIF up to 10MB)
4. Picture appears in gallery with primary badge
5. Can upload up to 4 more pictures

### Setting a Different Primary Picture
1. Hover over any picture in the gallery
2. Click the checkmark icon
3. Primary badge moves to selected picture

### Exporting Profile for Backup
1. Scroll to Profile File Management section
2. Click "Export Profile" button
3. JSON file downloads automatically
4. File named: `profile-Salatiso-Lonwabo-Mdeni-[timestamp].json`

### Syncing with LifeSync
1. Export profile from MNI Intranet
2. Go to LifeSync platform
3. Import the JSON file
4. Profile data populates in LifeSync
5. Continue updating comprehensive LifeCV there

## Security Considerations

- File size validation (10MB max)
- File type validation (images only)
- Client-side processing for privacy
- localStorage for secure local persistence
- No unencrypted transmission of sensitive data

## Browser Compatibility

- Modern browsers with FileReader API support
- localStorage support required
- Canvas/Image API for picture handling
- ES6 JavaScript support

## Performance Optimizations

- Client-side file processing (no server upload)
- Lazy loading of images
- Efficient state management with React hooks
- Minimal re-renders with proper dependencies
- Base64 encoding for immediate preview

## Future Enhancements

1. **Firebase Integration**
   - Cloud storage for profile backups
   - Real-time sync across devices
   - Multi-device synchronization

2. **Advanced Profile Features**
   - Career history/experience section
   - Education timeline
   - Skills and certifications
   - Publications and projects
   - Social media links

3. **Profile Visibility**
   - Privacy controls
   - Selective field sharing
   - Public profile option
   - Role-based visibility

4. **Notifications**
   - Profile completion reminders
   - LifeSync sync confirmations
   - Profile view analytics

## API Reference

### ProfileService Methods

```typescript
// Get complete profile
const profile = ProfileService.getProfile();

// Save profile
ProfileService.saveProfile(profile);

// Export for backup
const exportData = ProfileService.exportProfile(profile);

// Add picture
await ProfileService.addProfilePicture(profile, file);

// Delete picture
ProfileService.deleteProfilePicture(profile, pictureId);

// Set primary picture
ProfileService.setPrimaryPicture(profile, pictureId);

// Calculate completion
const completion = ProfileService.calculateCompletion(profile);

// Sync with LifeSync
const result = await ProfileService.syncWithLifeSync(profile);

// Validate profile
const validation = ProfileService.validateProfile(profile);

// Get statistics
const stats = ProfileService.getProfileStats(profile);

// Export analytics
const analytics = ProfileService.exportAnalytics(profile);
```

## Support

For issues or feature requests related to the profile system:
1. Check the upload guidelines section
2. Verify file formats (JPG, PNG, GIF)
3. Ensure file size is under 10MB
4. Clear browser cache if experiencing issues
5. Contact support if problems persist

## Related Documentation

- [LifeSync Integration Guide](../docs/lifesync-integration.md)
- [Profile Types Reference](../types/profile.ts)
- [ProfileService API](../services/ProfileService.ts)
- [LifeCV Overview](../docs/lifecv-overview.md)
