# LifeSync Integration Guide

## Overview

This guide explains how to integrate the MNI Intranet profile system with LifeSync for comprehensive LifeCV management. LifeSync serves as the home for your complete professional identity, while MNI Intranet provides quick access to profile management and tracking.

## Architecture

### Platform Relationship

```
┌─────────────────────────────────────────────────────────────┐
│                    MNI Intranet                              │
│  Profile Management & Quick Access                          │
│  ├─ Picture Upload (5 max)                                  │
│  ├─ Completion Tracking                                     │
│  ├─ Export/Import JSON                                      │
│  └─ Sync Status Dashboard                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ Export/Import JSON
                       │ (Bidirectional Sync)
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    LifeSync                                  │
│  Comprehensive LifeCV Home                                  │
│  ├─ Career History                                          │
│  ├─ Education Timeline                                      │
│  ├─ Skills & Certifications                                 │
│  ├─ Publications & Projects                                 │
│  ├─ Media Gallery (unlimited)                               │
│  └─ Professional Identity                                   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
MNI Intranet Profile Page
        ↓
   User Updates/Uploads
        ↓
   [Export JSON]
        ↓
   profile-[name]-[timestamp].json
        ↓
   LifeSync Import
        ↓
   Complete LifeCV Updated
        ↓
   View Stats Back in MNI
```

---

## Step-by-Step Integration

### Phase 1: Initial Setup

#### 1.1 - Complete MNI Profile
**Location**: MNI Intranet → Profile  
**Duration**: 5-15 minutes

**Steps**:
1. Navigate to Profile page in MNI Intranet
2. Fill in Personal Information:
   - Full Name
   - Email Address
   - Phone Number
   - Location
   - Professional Bio

3. Fill in Professional Information:
   - Current Position/Title
   - Organization Name
   - Professional Designation
   - Join Date

4. Upload Profile Pictures:
   - Select up to 5 professional photos
   - Set one as primary (avatar)

5. Check Completion Status:
   - Personal: Target 80%+
   - Professional: Target 75%+
   - Media: Increase with pictures
   - Overall target: 50%+

**Example Profile**:
```
Personal: Salatiso Lonwabo Mdeni
Email: salatiso@salatiso.com
Phone: 084 652 9115
Location: Johannesburg, South Africa

Professional:
Title: Founder & Social Entrepreneur
Organization: Salatiso Ecosystem
Designation: OHS Specialist, Risk Expert
Joined: January 2023
```

---

#### 1.2 - Export from MNI
**Action**: Download JSON backup

**Steps**:
1. In Profile page, scroll to "Profile File Management"
2. Click [Export Profile] button
3. File downloads: `profile-[YourName]-[timestamp].json`
4. Save safely for backup

**File Structure**:
```json
{
  "personal": {
    "fullName": "Salatiso Lonwabo Mdeni",
    "email": "salatiso@salatiso.com",
    "phone": "084 652 9115",
    "location": "Johannesburg, South Africa",
    "bio": "..."
  },
  "professional": {
    "position": "Founder & Social Entrepreneur",
    "organization": "Salatiso Ecosystem",
    "title": "OHS Specialist, Risk Expert",
    "joinDate": "January 2023"
  },
  "media": {
    "pictures": [
      {
        "id": "pic-...",
        "name": "profile.jpg",
        "uploadedAt": "10/26/2025",
        "isPrimary": true
      }
    ]
  },
  "completion": {
    "personal": { "completed": 5, "total": 5, "percentage": 100 },
    "professional": { "completed": 4, "total": 4, "percentage": 100 },
    "media": { "completed": 1, "total": 5, "percentage": 20 },
    "overall": { "completed": 10, "total": 17, "percentage": 59 }
  },
  "exportedAt": "2025-10-26T10:30:00Z",
  "version": "1.0",
  "platform": "MNI-Intranet"
}
```

---

### Phase 2: LifeSync Import

#### 2.1 - Access LifeSync
**Location**: https://lifesync.example.com

**Steps**:
1. Open LifeSync in web browser
2. Log in with same credentials as MNI Intranet
3. Navigate to Profile or Import section
4. Look for "Import Profile" or "Sync from Another Platform"

---

#### 2.2 - Import Profile
**Action**: Upload JSON file to LifeSync

**Steps**:
1. In LifeSync, click [Import Profile] button
2. Select profile JSON file from your computer
3. Click "Upload" or "Import"
4. Wait for import to complete
5. Review imported data

**What Gets Imported**:
✅ Personal information (Name, email, phone, location)  
✅ Professional details (Position, organization, title, join date)  
✅ Picture metadata and filenames  
✅ Completion status and percentages  
✅ Export timestamp and version info  

**What Doesn't Get Imported** (Picture Handling):
- Picture data URLs are metadata only
- You may need to re-upload pictures in LifeSync
- OR: Use cloud storage integration (coming soon)

---

#### 2.3 - Enhance in LifeSync
**Purpose**: Build comprehensive LifeCV

LifeSync provides advanced features for:
- Complete career history (multiple positions)
- Education timeline (schools, degrees, dates)
- Skills with categories and proficiency levels
- Certifications with expiry dates
- Publications and research papers
- Projects with detailed descriptions
- Social media links
- Endorsements and recommendations
- Portfolio links

**Recommended Enhancements**:
1. Add 5-10 years of work experience
2. Add education background (degree, school, year)
3. Add 10-20 relevant skills
4. Add certifications (if applicable)
5. Add 2-5 publications
6. Add 3-5 portfolio projects
7. Link social profiles (LinkedIn, GitHub, Twitter)
8. Upload professional photos to LifeSync

---

#### 2.4 - Generate LifeSync Profile Stats
**Purpose**: Track comprehensive profile quality

LifeSync dashboard shows:
- Overall completion percentage (target: 75%+)
- Experience level (junior/mid/senior)
- Skill endorsements count
- Profile views and profile strength score
- Recommendations from peers
- Industry benchmarks

---

### Phase 3: Sync Cycle

#### 3.1 - Maintain in Both Platforms

**MNI Intranet** - Use for:
- Quick profile status checks
- Picture updates
- Fast personal/professional edits
- Completion tracking
- Regular backups

**LifeSync** - Use for:
- Comprehensive LifeCV building
- Career history details
- Skill development tracking
- Networking and recommendations
- Public profile visibility

---

#### 3.2 - Update Flow

**Scenario 1: Update in MNI, Sync to LifeSync**
```
MNI Profile Updated
        ↓
    [Export] → profile.json
        ↓
    LifeSync [Import]
        ↓
    Data updates in LifeSync
```

**Scenario 2: Update in LifeSync, Keep in Sync**
```
LifeSync Profile Enhanced
        ↓
    [Export] from LifeSync (if available)
        ↓
    MNI [Import] → profile.json
        ↓
    MNI stats updated
```

---

#### 3.3 - Regular Sync Cadence
Recommended schedule:
- **Weekly**: Export from MNI as backup
- **Monthly**: Full sync cycle (export & import)
- **After Major Changes**: Immediate sync
- **Quarterly**: Complete profile review

---

## API Integration (For Developers)

### Backend Requirements

To implement bidirectional sync, backend needs:

```typescript
// Endpoint 1: Sync profile to LifeSync
POST /api/lifesync/sync
Request: {
  profileId: string,
  exportData: ProfileExport,
  action: "sync" | "backup"
}
Response: {
  success: boolean,
  syncId: string,
  timestamp: string,
  message: string
}

// Endpoint 2: Check sync status
GET /api/lifesync/status/:syncId
Response: {
  status: "pending" | "completed" | "failed",
  progress: number,
  message: string
}

// Endpoint 3: Import from LifeSync
POST /api/lifesync/import
Request: {
  lifesyncProfileId: string
}
Response: {
  profile: LifeCVProfile,
  lastSyncTime: string,
  importedFields: string[]
}
```

### ProfileService Integration

Current implementation ready for backend:

```typescript
// Service method (framework ready)
const result = await ProfileService.syncWithLifeSync(profile);

// Returns:
{
  success: true,
  timestamp: "2025-10-26T10:30:00Z",
  platform: "lifesync",
  syncedItems: {
    personal: true,
    professional: true,
    pictures: 3,
    lastSyncTime: "2025-10-26T10:30:00Z"
  },
  message: "Profile synced successfully"
}
```

---

## Conflict Resolution

### Handling Updates

**Scenario 1: Both platforms updated since last sync**
- Priority: Last modified date
- MNI always exports current state
- LifeSync imports with override
- Recommendation: Manual review before import

**Scenario 2: Picture metadata mismatch**
- MNI: Stores metadata only (not actual image)
- LifeSync: May have more picture data
- Resolution: Re-upload pictures after import

**Scenario 3: Completion percentage differs**
- MNI: Strict calculation (5 personal + 4 professional fields)
- LifeSync: May include more fields
- Resolution: LifeSync acts as comprehensive source

---

## Features & Limitations

### MNI Intranet Profile

**Strengths** ✅
- Quick access (integrated in intranet)
- Simple picture upload (5 max)
- Completion tracking
- Regular backups (JSON export)
- Real-time sync status

**Limitations** ⚠️
- Limited to 5 pictures
- No advanced career history
- No skill endorsements
- No networking features
- No public profile option

---

### LifeSync Platform

**Strengths** ✅
- Comprehensive LifeCV
- Unlimited career history
- Skills with endorsements
- Networking features
- Public profile option
- Advanced portfolio
- Professional recommendations

**Limitations** ⚠️
- No intranet integration
- Separate platform to access
- May have different UI
- Could have separate storage

---

## Data Security

### Profile Data Protection

**MNI Intranet**:
- localStorage encryption (client-side)
- HTTPS for transmission
- User account authentication
- No third-party sharing

**LifeSync Sync**:
- JSON files encrypted in transit
- Server-side validation
- No unencrypted storage
- Audit logs for all syncs

**Best Practices**:
1. Keep exports (JSON files) in secure location
2. Use strong passwords on both platforms
3. Enable 2FA if available
4. Review sync logs regularly
5. Don't share JSON exports with untrusted parties

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **Import fails** | Invalid JSON format | Export again from MNI, verify format |
| **Pictures missing** | Metadata only imported | Re-upload pictures in LifeSync |
| **Completion % differs** | Different calculation | MNI uses strict fields, LifeSync more comprehensive |
| **Sync slow** | Large file size | Export without pictures first, sync separately |
| **Fields not syncing** | Incompatible versions | Update both platforms to latest version |

### Debug Steps

1. **Check Export File**
   - Open JSON in text editor
   - Verify valid JSON structure
   - Check for required fields

2. **Verify Credentials**
   - Confirm same email/account
   - Ensure logged in both platforms
   - Check authentication status

3. **Check Completion**
   - Fill in more profile fields
   - Upload pictures if available
   - Increase completion before sync

4. **Clear Cache**
   - Browser cache clear
   - localStorage clear
   - Cookies delete
   - Retry sync

---

## Examples

### Example 1: New User Workflow

```
Day 1: Complete MNI Profile
├─ Sign up in MNI Intranet
├─ Fill personal info (10 min)
├─ Fill professional info (5 min)
├─ Upload 3 pictures (5 min)
└─ Completion: ~60%

Day 2: First Sync with LifeSync
├─ Export from MNI
├─ Go to LifeSync
├─ Import JSON file
├─ Review imported data
└─ Completion in LifeSync: ~60%

Day 3: Enhance in LifeSync
├─ Add 5 years experience
├─ Add education
├─ Add 15 skills
├─ Add 2 certifications
└─ Completion in LifeSync: ~85%

Week 2: Back to MNI
├─ Check stats in MNI
├─ See LifeSync metrics
├─ Take actions to improve
└─ Export new version
```

### Example 2: Monthly Sync Process

```
Every Month (1st):
├─ Log in to MNI Profile
├─ Review current info
├─ Update any changes
├─ Upload new pictures if any
├─ Export profile (backup)
└─ [Export Profile] → profile.json

├─ Go to LifeSync
├─ Import latest profile
├─ Review imported changes
└─ Continue building/enhancing

Every Quarter:
├─ Full sync cycle
├─ Update both platforms
├─ Generate analytics
└─ Plan next improvements
```

---

## API Reference

### ProfileService Methods for LifeSync

```typescript
// Export profile
const exported = ProfileService.exportProfile(profile);

// Import profile
const imported = ProfileService.importProfile(jsonData);

// Sync with LifeSync
const result = await ProfileService.syncWithLifeSync(profile);

// Get sync status
const status = ProfileService.getSyncStatus();

// Calculate completion
const completion = ProfileService.calculateCompletion(profile);

// Export analytics
const analytics = ProfileService.exportAnalytics(profile);
```

### File Formats

**MNI Export Format**:
```
profile-[FullName]-[timestamp].json
```

**LifeSync Import Requirements**:
- JSON file format
- Valid UTF-8 encoding
- Max size: 10MB

---

## Future Enhancements

### Planned Features

1. **Real-time Sync**
   - Automatic sync when changes made
   - Bidirectional updates
   - Conflict resolution UI

2. **Cloud Picture Storage**
   - Upload pictures to cloud
   - Access from both platforms
   - CDN delivery

3. **Webhook Integration**
   - LifeSync sends updates to MNI
   - Real-time notification
   - Automatic profile refresh

4. **Advanced Analytics**
   - Profile strength scoring
   - Comparison with peers
   - Improvement recommendations

5. **Permission Control**
   - Selective field sharing
   - Public profile option
   - Visibility controls

---

## Support Resources

### Documentation
- [Profile System Documentation](./PROFILE_SYSTEM_DOCUMENTATION.md)
- [Profile Quick Reference](./PROFILE_QUICK_REFERENCE.md)
- [ProfileService API](./PROFILESERVICE_API_REFERENCE.md)

### Links
- **MNI Intranet**: https://intranet.example.com
- **LifeSync Home**: https://lifesync.example.com
- **Support Email**: support@salatiso.com

### Getting Help
1. Check documentation first
2. Review FAQ section
3. Contact support@salatiso.com
4. File bug report with details

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Oct 26, 2025 | Initial LifeSync integration guide |

---

**Last Updated**: October 26, 2025  
**Status**: Ready for Implementation  
**Maintainer**: Salatiso Ecosystem Team
