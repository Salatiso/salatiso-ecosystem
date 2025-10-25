# Personalization & Enhancement Plan - October 9, 2025

## Overview
Major enhancement to personalize the Mlandeli Family Intranet with accurate family data, editable profiles, rich media support, and comprehensive contact management.

---

## Phase 1: Family Data Corrections ✅ (IMMEDIATE)

### Birth Years & Ages (2025)
- **Notemba (Nozukile Cynthia Mdeni)**: Born December 16, 1960 → Age 64
- **Mlandeli Nelson Mdeni** (Father, deceased): Born April 10, 1956 → Died 1993 (age 37)
- **Salatiso Mdeni**: Born September 16, 1982 → Age 43
- **Visa Mdeni**: Born May 1985 → Age 40
- **Tina Mdeni**: Born 1990 → Age 35
- **Kwakho Mdeni**: Born September 15, 1992 → Age 33
- **Solo Mdeni**: Born 2010 → Age 15
- **Mila Mdeni**: Born 2018 → Age 7
- **Milande Mdeni**: Born 2017 → Age 8
- **Sazi Mdeni**: Born 2018 → Age 7
- **Azora Mdeni**: Born 2021 → Age 4
- **Milani Mdeni**: Born 2024 → Age 1

### Parent-Child Relationships
- **Salatiso** → Father of **Sazi** (with Mpho, external)
- **Visa** → Mother of **Solo** and **Mila**
- **Tina** → Mother of **Azora**
- **Kwakho** → Mother of **Milande** and **Milani**
- **Notemba & Mlandeli** → Parents of **Salatiso, Visa, Tina, Kwakho**

### Extended Family (Maternal Grandparents)
- **Ndleleni Mgedezi** → Notemba's father
- **Sisiwe Mgedezi** → Notemba's mother

### Cultural Names & Clan Names
**Nozukile Cynthia Mdeni (Notemba)**
- Maiden surname: Mgedezi
- Clan name: Xaba
- Praise names: Nomjoli, Shwabada, Hlubi

**Mlandeli Nelson Mdeni**
- Clan name: Mdeni
- Praise names: Tshezi, Jalamba, Mqalongangenduku, Nkonjane's Bhabhe Mafini, Njilo Njilo

---

## Phase 2: Dashboard Personalization

### Current Issues
❌ Generic greeting: "Good evening, Family Member!"
❌ Shows "Level 1" instead of actual user level
❌ Shows "0 Total XP" instead of actual points
❌ Shows "0 Active Streaks" instead of actual data

### Required Changes
✅ Personalized greeting with **actual user's first name** from Google profile
✅ Display actual gamification data from Firestore
✅ Show user's profile picture from Google
✅ Display role-specific information
✅ Personalized quick actions based on role

---

## Phase 3: Family Directory Enhancements

### Data Accuracy Updates
- ✅ Update all birth years and ages
- ✅ Correct parent-child relationships
- ✅ Add cultural names and clan names

### Icon Changes
❌ Current: Default avatar emojis (not culturally representative)
✅ New: Neutral geometric icons or initials-based avatars
✅ Alternative: User-uploaded photos

### Editable Fields
Each family member can edit:
- ✅ Display name
- ✅ Profile picture/video
- ✅ Contact information (phone, email, address)
- ✅ Skills & interests
- ✅ Clan names & praise names
- ✅ Bio/description
- ✅ Location
- ✅ Role & responsibilities

---

## Phase 4: Profile Picture/Video Upload

### Upload Sources
1. **File Upload**: JPG, PNG, GIF (max 5MB)
2. **Webcam Capture**: Direct capture from PC camera
3. **Mobile Camera**: Direct capture from phone (via file input)
4. **Video Upload**: MP4, WebM (max 50MB, 30 seconds)

### Implementation
- Firebase Storage for media files
- Image optimization (resize to 512x512)
- Video thumbnails for video profiles
- Fallback to Google profile picture if no upload

---

## Phase 5: Family Tree Enhancements

### Timeline Expansion
**New Historical Events:**
- 1956, April 10: Birth of Mlandeli Nelson Mdeni
- 1960, December 16: Birth of Nozukile Cynthia Mdeni (Notemba)
- (Expand to include all family members' births)

### Collaborative Editing
- ✅ Any family member can propose edits
- ✅ Show "Last updated by [Name] on [Date]"
- ✅ Approval system: 60% family vote required
- ✅ Pending edits section
- ✅ Edit history/audit trail

### Rich Cultural Data
- ✅ Clan names field
- ✅ Praise names field (multiple entries)
- ✅ Maiden surnames
- ✅ Cultural affiliations
- ✅ Language preferences

---

## Phase 6: Contact Management System

### Contact Structure
```typescript
interface FamilyContact {
  id: string;
  addedBy: string; // User ID
  firstName: string;
  lastName: string;
  phone: string[];
  email: string[];
  address: string;
  organization?: string;
  
  // Categorization
  category: 'family' | 'friend' | 'business' | 'professional' | 'service' | 'other';
  tags: string[];
  
  // Privacy
  isPrivate: boolean; // If false, shared with family
  sharedWith: string[]; // Specific family members
  
  // Metadata
  notes: string;
  lastContacted?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Features
1. **Duplicate Detection**: Suggest merge when same contact found
2. **Categorization**: Auto-suggest based on domain/organization
3. **Privacy Control**: Private vs. Family-shared
4. **Relationship Tracking**: How contact relates to multiple family members
5. **Import/Export**: VCF, CSV support
6. **Search & Filter**: By category, name, organization

---

## Phase 7: Settings Functionality

### Current Issue
❌ Clicking Settings redirects to landing page

### Required Settings Sections
1. **Profile Settings**
   - Edit display name
   - Upload profile picture/video
   - Update contact information
   - Edit bio
   - Clan names & praise names

2. **Privacy Settings**
   - Control what information is visible to family
   - Contact sharing preferences
   - Activity visibility

3. **Notification Settings**
   - Email notifications
   - Push notifications (future)
   - Family announcements
   - Project updates

4. **Language & Localization**
   - Preferred language (15 options)
   - Date format
   - Time zone

5. **Gamification Settings**
   - Enable/disable gamification
   - Streak notifications
   - Achievement alerts

6. **Account Settings**
   - Change password (email/password users)
   - Connected accounts
   - Two-factor authentication (future)

---

## Phase 8: Ubuntu Screensavers

### Screensaver Types
1. **Ubuntu Wisdom Quotes**: Rotating wisdom with family photos
2. **Family Timeline**: Scrolling historical events
3. **Achievement Showcase**: Family members' accomplishments
4. **Photo Gallery**: Family moments slideshow

### Formats & Downloads
- **Desktop**: Windows (.scr), macOS (.saver)
- **Mobile**: Live wallpaper (Android), Slideshow (iOS)
- **Web**: Fullscreen web version

### Customization
- Select quote collections
- Choose photo albums
- Set transition speed
- Add background music (optional)

---

## Implementation Priority

### IMMEDIATE (This Session)
1. ✅ Fix COOP warnings in firebase.json
2. ✅ Update WelcomeWidget with real user data
3. ✅ Update Family Directory with correct ages
4. ✅ Fix Settings navigation
5. ✅ Add neutral avatar icons

### PHASE 2 (Next Session)
1. Profile picture/video upload
2. Editable family profiles
3. Timeline collaborative editing
4. Contact management foundation

### PHASE 3 (Future)
1. Advanced contact features (duplicate detection, import/export)
2. Screensaver generation & downloads
3. Mobile camera integration
4. Family voting system for edits

---

## Technical Stack

### New Dependencies Needed
```json
{
  "react-avatar-editor": "^13.0.0",  // Image cropping
  "react-webcam": "^7.2.0",           // Camera capture
  "react-dropzone": "^14.2.3",        // File uploads
  "firebase/storage": "^10.7.0"       // Media storage
}
```

### Firestore Collections
```
users/{userId}
  - profile data
  - gamification stats
  - preferences

family-tree/{nodeId}
  - family member data
  - clan names
  - edit history
  - pending edits

contacts/{contactId}
  - contact details
  - privacy settings
  - duplicate links

timeline-events/{eventId}
  - historical events
  - added by
  - approval status
```

---

## Success Metrics

✅ All family members can see their accurate data
✅ Dashboard shows personalized greetings with real names
✅ Family directory displays correct ages and relationships
✅ Settings page functional (not redirecting)
✅ Neutral icons replace culturally inappropriate emojis
✅ Users can upload profile pictures
✅ Timeline includes parents' birth dates (1956, 1960)

**Next Milestone**: Contact management system with 50+ contacts added by family

---

## Notes

- **Cultural Sensitivity**: Use neutral geometric icons or initials, not emoji faces
- **Privacy First**: Default to private contacts, opt-in to share
- **Collaborative**: 60% approval for family tree edits prevents single-person control
- **Ubuntu Philosophy**: "I am because we are" - emphasize family contribution over individual achievement
