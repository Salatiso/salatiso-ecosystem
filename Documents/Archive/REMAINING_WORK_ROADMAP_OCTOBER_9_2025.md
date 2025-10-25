# REMAINING WORK ROADMAP - October 9, 2025

## 📋 What's Left to Do

---

## 🔧 MEDIUM PRIORITY - Finish These Next

### Item #4: Profile Picture Upload - **10% REMAINING** ⚠️

**What's Complete** ✅:
- Upload UI component (`ProfileUploader.tsx`)
- Storage helper functions (`storage.ts`)
- Security rules (`storage.rules`)
- Settings page integration
- Webcam capture support
- Mobile camera support
- Drag & drop support

**What's Needed** ⚠️:
```
SINGLE ACTION: Enable Firebase Storage
1. Go to: https://console.firebase.google.com/project/salatiso-lifecv/storage
2. Click "Get Started"
3. Accept default rules (we'll override with our rules)
4. Run: firebase deploy --only storage
5. DONE! Upload will work immediately
```

**Time Required**: 2 minutes (manual enable) + 1 minute (deploy)

---

### Item #5: Editable Family Profiles - **NOT STARTED** 📋

**What to Build**:
1. **Edit Modal Component** (`src/components/family/EditMemberModal.tsx`)
   ```typescript
   - Form fields for all editable data
   - Validation
   - Save/Cancel buttons
   - Loading states
   - Success/Error messages
   ```

2. **Integration Points**:
   - Add "Edit" button to each family card
   - Check permissions (own profile vs admin)
   - Update Firestore on save
   - Refresh UI after edit

3. **Editable Fields**:
   - Display name ✏️
   - Bio/description ✏️
   - Phone number ✏️
   - Email (view only, from auth)
   - Location ✏️
   - Cultural names (clan, praise names) ✏️
   - Skills & interests ✏️
   - Role (admin only) 🔒

**Files to Create**:
- `src/components/family/EditMemberModal.tsx`
- `src/components/family/CulturalNamesInput.tsx` (for praise names array)

**Files to Modify**:
- `src/pages/intranet/family.tsx` - Add edit buttons
- `firestore.rules` - Add edit permissions

**Code Snippet - Modal Structure**:
```typescript
interface EditMemberModalProps {
  member: FamilyMember;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<FamilyMember>) => Promise<void>;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ member, isOpen, onClose, onSave }) => {
  // Form state
  const [formData, setFormData] = useState({
    displayName: member.name,
    bio: member.bio,
    phone: member.phone,
    location: member.location,
    // ... other fields
  });

  const handleSubmit = async () => {
    await onSave(formData);
    onClose();
  };

  // Return modal with form...
};
```

**Time Required**: 1-1.5 hours

---

### Item #6: Timeline Collaborative Editing - **NOT STARTED** 📋

**What to Build**:
1. **Timeline Editor Component** (`src/components/family/TimelineEditor.tsx`)
   ```typescript
   - Add event form
   - Edit event form
   - Delete event (with confirmation)
   - Proposal submission
   - Validation (dates, required fields)
   ```

2. **Voting System** (`src/components/family/VotingInterface.tsx`)
   ```typescript
   - Proposal card showing changes
   - Vote buttons (Approve/Reject)
   - Vote count display
   - Auto-apply at 60% approval
   - Vote history
   ```

3. **Firestore Collections**:
   ```
   timeline-events/{eventId}
     - eventData
     - addedBy: userId
     - lastEditedBy: userId
     - editedAt: timestamp
     - status: 'approved' | 'pending'
     - votes: { userId: 'approve'|'reject' }
   
   timeline-proposals/{proposalId}
     - eventId (null for new events)
     - originalData
     - proposedChanges
     - proposedBy: userId
     - proposedAt: timestamp
     - votes: { userId: 'approve'|'reject' }
     - voteCount: { approve: number, reject: number }
     - status: 'pending' | 'approved' | 'rejected'
     - requiredApprovals: number (calculated as 60% of family)
   ```

4. **Features**:
   - "Edit" button on each timeline event
   - "Add Event" button at top
   - Proposal queue (show pending edits)
   - Vote notifications
   - Edit history log
   - "Last updated by [Name]" badge

**Code Snippet - Voting Logic**:
```typescript
const voteOnProposal = async (proposalId: string, vote: 'approve' | 'reject') => {
  const proposalRef = doc(db, 'timeline-proposals', proposalId);
  const proposalSnap = await getDoc(proposalRef);
  const proposal = proposalSnap.data();
  
  // Update votes
  const newVotes = { ...proposal.votes, [user.id]: vote };
  const approveCount = Object.values(newVotes).filter(v => v === 'approve').length;
  const totalFamily = 11; // Or query from family collection
  const requiredApprovals = Math.ceil(totalFamily * 0.6); // 60%
  
  await setDoc(proposalRef, {
    ...proposal,
    votes: newVotes,
    voteCount: { approve: approveCount, reject: Object.keys(newVotes).length - approveCount }
  }, { merge: true });
  
  // Check if approved
  if (approveCount >= requiredApprovals) {
    // Apply changes
    if (proposal.eventId) {
      // Edit existing event
      await setDoc(doc(db, 'timeline-events', proposal.eventId), proposal.proposedChanges, { merge: true });
    } else {
      // Create new event
      await addDoc(collection(db, 'timeline-events'), proposal.proposedChanges);
    }
    
    // Mark proposal as approved
    await setDoc(proposalRef, { status: 'approved' }, { merge: true });
  }
};
```

**Files to Create**:
- `src/components/family/TimelineEditor.tsx`
- `src/components/family/EventForm.tsx`
- `src/components/family/ProposalCard.tsx`
- `src/components/family/VotingInterface.tsx`

**Files to Modify**:
- `src/components/family/FamilyTimeline.tsx` - Add edit mode toggle
- `firestore.rules` - Add timeline collections permissions

**Time Required**: 2-3 hours

---

## 📋 LOW PRIORITY - Future Enhancements

### Item #7: Contact Management System - **NOT STARTED** 📋

**Scope**: Full family CRM

**Features**:
1. **Contact List Page** (`src/pages/intranet/contacts.tsx`)
   - Grid/List view toggle
   - Search bar
   - Filter by category
   - Sort options
   - Add contact button

2. **Contact Card/Modal** (`src/components/contacts/ContactCard.tsx`)
   - Display all contact info
   - Edit button
   - Delete button
   - Share toggle (private/family)

3. **Add/Edit Form** (`src/components/contacts/ContactForm.tsx`)
   - First & Last name
   - Phone numbers (multiple)
   - Email addresses (multiple)
   - Physical address
   - Organization
   - Category (family, friend, business, professional, service, other)
   - Tags (free-form)
   - Notes
   - Privacy toggle

4. **Smart Features**:
   - **Duplicate Detection**:
     ```typescript
     - Check phone/email against existing
     - Show "Similar contact found: [Name]"
     - Offer to merge
     - Show which family member added the similar contact
     ```
   
   - **Auto-Categorization**:
     ```typescript
     - Email domain detection:
       - @gmail.com, @yahoo.com → Personal
       - Company domains → Business
       - .gov, .org → Professional
     - Phone number patterns:
       - Mobile → Personal
       - Landline + organization → Business
     ```
   
   - **Import/Export**:
     ```typescript
     - Import VCF (vCard) files
     - Export selected contacts to VCF
     - Import CSV
     - Export to CSV
     - Bulk operations
     ```

5. **Firestore Collection**:
   ```
   contacts/{contactId}
     - addedBy: userId
     - firstName: string
     - lastName: string
     - phone: string[]
     - email: string[]
     - address: string
     - organization?: string
     - category: 'family'|'friend'|'business'|'professional'|'service'|'other'
     - tags: string[]
     - isPrivate: boolean
     - sharedWith: string[] (if not private)
     - notes: string
     - lastContacted?: timestamp
     - createdAt: timestamp
     - updatedAt: timestamp
     - metadata: {
       source: 'manual'|'import'|'duplicate-merge'
       duplicateOf?: contactId
       relatedContacts?: contactId[]
     }
   ```

**Files to Create**:
- `src/pages/intranet/contacts.tsx`
- `src/components/contacts/ContactCard.tsx`
- `src/components/contacts/ContactForm.tsx`
- `src/components/contacts/ContactList.tsx`
- `src/components/contacts/DuplicateDetector.tsx`
- `src/components/contacts/ImportExport.tsx`
- `src/utils/vcfParser.ts` (VCF file parser)
- `src/utils/csvParser.ts` (CSV parser)

**Time Required**: 3-4 hours

---

### Item #8: Ubuntu Screensavers - **NOT STARTED** 📋

**Scope**: Downloadable screensavers with family content

**What to Build**:
1. **Screensaver Page** (`src/pages/screensaver.tsx`)
   - Currently shows "Coming Soon"
   - Convert to download center

2. **Desktop Screensavers**:
   - **Windows (.scr)**:
     ```
     - HTML5 screensaver wrapper
     - Package as .scr file
     - Installer included
     - Customization wizard
     ```
   
   - **macOS (.saver)**:
     ```
     - WebView-based screensaver
     - Package as .saver bundle
     - Install instructions
     - System Preferences integration
     ```

3. **Mobile Wallpapers**:
   - **Android Live Wallpaper**:
     ```
     - APK with live wallpaper service
     - Quote rotation
     - Photo slideshow
     - Battery-efficient
     ```
   
   - **iOS Dynamic Wallpaper**:
     ```
     - Shortcut automation
     - Photo album slideshow
     - Lock screen widget (iOS 16+)
     ```

4. **Web Fullscreen Version**:
   - `/screensaver/live` route
   - Fullscreen mode
   - Keyboard shortcuts (ESC to exit)
   - Mouse movement detection
   - Automatic activation after idle

5. **Content Types**:
   - **Ubuntu Wisdom Quotes**:
     ```typescript
     - Rotating quotes from timeline
     - Family member quotes
     - African proverbs
     - Beautiful typography
     - Gradient backgrounds
     ```
   
   - **Family Photo Slideshow**:
     ```typescript
     - Pull from family-media storage
     - Smooth transitions
     - Photo metadata (date, people)
     - Ken Burns effect
     ```
   
   - **Timeline Animation**:
     ```typescript
     - Scrolling timeline
     - Event highlights
     - Family milestones
     - Animated transitions
     ```
   
   - **Achievement Showcase**:
     ```typescript
     - Family achievements
     - Badges earned
     - Milestones reached
     - Progress graphs
     ```

6. **Customization**:
   - Choose content type
   - Select photo albums
   - Choose quote collections
   - Transition speed
   - Background music (optional MP3 upload)
   - Color themes

**Files to Create**:
- `src/pages/screensaver/index.tsx` - Download center
- `src/pages/screensaver/live.tsx` - Web fullscreen version
- `src/pages/screensaver/customize.tsx` - Customization wizard
- `src/components/screensaver/UbuntuQuotes.tsx`
- `src/components/screensaver/PhotoSlideshow.tsx`
- `src/components/screensaver/TimelineAnimation.tsx`
- `src/components/screensaver/AchievementShowcase.tsx`
- `src/utils/screensaverBuilder.ts` - Package screensavers

**External Tools Needed**:
- Electron (for Windows .scr packaging)
- Xcode (for macOS .saver packaging)
- Android Studio (for Android APK)
- React Native or Flutter (for cross-platform mobile)

**Time Required**: 2-3 hours (web version), 4-6 hours (desktop/mobile packages)

---

## 📊 COMPLETION ROADMAP

### Session 2 (Next): Complete Medium Priority
**Duration**: 3-4 hours
**Focus**: Items #5 and #6

**Order**:
1. Enable Firebase Storage (2 min) ← USER ACTION
2. Test profile upload (10 min)
3. Build editable profiles (1.5 hours)
4. Build timeline collaborative editing (2.5 hours)
5. Test everything (30 min)
6. Deploy (10 min)

**Deliverables**:
- ✅ Profile upload fully functional
- ✅ Family members can edit own profiles
- ✅ Timeline edits require 60% family vote
- ✅ Proposal queue visible
- ✅ Edit history tracked

---

### Session 3 (Future): Low Priority Features
**Duration**: 6-8 hours
**Focus**: Items #7 and #8

**Order**:
1. Build contact management (3-4 hours)
   - Basic CRUD first
   - Then duplicate detection
   - Finally import/export
2. Build web screensaver (2-3 hours)
   - Fullscreen version
   - Customization
   - Download page
3. (Optional) Package desktop screensavers (4-6 hours)

**Deliverables**:
- ✅ Contact management system live
- ✅ 50+ contacts added by family
- ✅ Web screensaver functional
- ✅ Download center ready
- ⚠️ Desktop/mobile packages (optional)

---

## 🎯 PRIORITY RANKING

### Must Have (Critical):
1. ✅ **Enable Firebase Storage** ← DO THIS FIRST!
2. 📋 **Editable Profiles** - Family members need to update their own info
3. 📋 **Timeline Editing** - Family wants to contribute their memories

### Should Have (Important):
4. 📋 **Contact Management** - Useful for family networking
5. 📋 **Web Screensaver** - Cool showcase feature

### Nice to Have (Optional):
6. 📋 **Desktop Screensavers** - Complex packaging, limited audience
7. 📋 **Mobile Wallpapers** - Requires native development

---

## 🚀 QUICK START - Next Session

### Step 1: Enable Firebase Storage (2 min)
```bash
# In Firebase Console:
# 1. Go to Storage section
# 2. Click "Get Started"
# 3. Accept defaults

# Then deploy:
firebase deploy --only storage
```

### Step 2: Test Upload (5 min)
```
# Test in browser:
1. Go to Settings
2. Click "Change photo"
3. Try upload methods:
   - Drag & drop
   - Webcam
   - Mobile camera
4. Verify photo appears in family directory
```

### Step 3: Build Editable Profiles (1.5 hours)
```bash
# Create modal component
touch src/components/family/EditMemberModal.tsx

# Update family page
# Add edit button to family cards
# Wire up modal
# Test permissions
```

### Step 4: Build Timeline Editing (2.5 hours)
```bash
# Create editor components
touch src/components/family/TimelineEditor.tsx
touch src/components/family/ProposalCard.tsx
touch src/components/family/VotingInterface.tsx

# Add Firestore collections
# Implement voting logic
# Test with multiple users
```

### Step 5: Deploy & Celebrate! (10 min)
```bash
npm run build
firebase deploy --only hosting,firestore
```

---

## 📞 QUESTIONS TO ASK

Before starting next session, confirm:
1. Did Firebase Storage enable successfully?
2. Did profile upload work when you tested?
3. Which features are highest priority for family?
4. Do you want to do contact management or screensavers first?
5. Should we build native desktop/mobile screensavers or just web version?

---

**Status**: Ready for Session 2! 🚀
**Estimated Total Remaining Time**: 6-10 hours (depending on screensaver scope)
**Critical Path**: Enable Storage → Editable Profiles → Timeline Editing → Contact Management → Screensavers
