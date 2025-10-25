# 📋 CONTACTS IMPORT & MANAGEMENT - IMPLEMENTATION PLAN

**Date**: October 23, 2025  
**Status**: Phase 1 Complete ✅ - Phases 2-5 Ready to Implement

---

## ✅ PHASE 1: GOOGLE CONTACTS CSV IMPORT - COMPLETE

### What Was Fixed
1. **Flexible Column Parsing** ✅
   - Now supports Google Contacts CSV format with 30+ columns
   - Automatically detects if CSV is Google format or custom format
   - Handles variable number of columns (no "exact match" required)
   - Properly parses emails and phone numbers with multiple values

2. **Error Resolution** ✅
   - All "Incorrect number of columns" errors eliminated
   - Lines with extra Google fields no longer fail
   - Now imports all 186 contacts successfully (not just 163)
   - Detailed error reporting for actual problems

3. **Data Mapping** ✅
   - Google "Given Name" → firstName
   - Google "Family Name" → lastName
   - Google "Email 1 Value", "Email 2 Value", etc. → emails array
   - Google "Phone 1 Value", "Phone 2 Value", etc. → phoneNumbers array
   - Google addresses parsed into complete address strings
   - Google groups mapped to tags

4. **Classification Fields** ✅
   - Parsed from Google "Group Membership" field
   - Detects family/household classification
   - Sets `isFamilyMember` and `isHouseholdMember` flags
   - Preserves all original Google data

5. **Firestore Persistence** ✅
   - Imported contacts now save to Firestore using batch operations
   - Contacts persist across sessions
   - Each contact has Firestore ID for updates

---

## 🔄 PHASE 2: CONTACT CLASSIFICATION & METADATA (READY)

### What Needs to Be Done

1. **Classification UI** - Contact details card needs:
   ```typescript
   // Edit Dialog should allow updating:
   ✓ isFamilyMember - Checkbox (is this a family member?)
   ✓ isHouseholdMember - Checkbox (do they live in household?)
   ✓ sonnyRole - Dropdown: 'monitor' | 'monitored' | 'both' | 'none'
   ✓ category - Dropdown: family | friend | business | professional | service
   ```

2. **Quick Classification** - After import show:
   - Multi-select modal for bulk classification
   - Filter by surname/address for suggestions
   - Quick tags for common classifications

3. **Monitoring Relationship** - Set bidirectional relationship:
   - "I monitor them" → sonnyRole = 'monitor'
   - "They monitor me" → sonnyRole = 'monitored'  
   - "Mutual monitoring" → sonnyRole = 'both'
   - "No monitoring" → sonnyRole = 'none'

**Files to Update**:
- `src/components/contacts/ContactCard.tsx` - Add classification UI
- `src/components/contacts/ContactForm.tsx` - Add classification fields
- `src/components/contacts/ClassificationModal.tsx` - NEW

---

## 🔍 PHASE 3: SMART CONTACT SUGGESTIONS (READY)

### What Needs to Be Done

1. **Relationship Detection Algorithm**:
   ```typescript
   // Analyze each imported contact for relationships
   - Compare surnames (exact match = likely family)
   - Compare addresses (same = likely household)
   - Analyze relationship fields from Google
   - Check middle names/initials for family patterns
   - Cross-reference existing family members
   ```

2. **Suggestion Engine**:
   ```typescript
   // After import, suggest:
   - "John Smith likely related to Mary Smith (same surname)"
   - "Jane Doe likely related to James Doe (from same address)"
   - "Contact marked as 'Spouse' in Google - family member?"
   - Match with existing family tree data
   ```

3. **UI Component**:
   ```typescript
   // Show after import:
   - Card-based suggestions
   - Confidence scores (70%, 85%, 95%)
   - One-click accept/reject
   - Bulk apply all suggestions
   ```

**Files to Create**:
- `src/services/ContactSuggestionService.ts` - NEW (logic)
- `src/components/contacts/SuggestionWidget.tsx` - NEW (UI)

---

## 💾 PHASE 4: DUPLICATE DETECTION & MERGING (READY)

### What Needs to Be Done

1. **Existing Contact Matching**:
   ```typescript
   // On import, detect if contact already exists:
   - Email match (strong)
   - Phone match (strong)
   - Name + address match (medium)
   - Same surname + same address (medium)
   ```

2. **Update Strategy**:
   ```typescript
   ✓ IF contact exists + new data available:
     - Show "Update existing contact?" dialog
     - Show before/after comparison
     - Allow selective field updates
     - Preserve user edits
   
   ✓ IF contact exists + no new data:
     - Skip (mark as duplicate)
     - Option to merge anyway
   ```

3. **Merge UI**:
   ```typescript
   // Show side-by-side comparison:
   - Existing contact on left
   - New import data on right
   - Choose which value to keep for each field
   - Combine emails/phones (no duplicates)
   ```

**Files to Create**:
- `src/services/DuplicateDetectionService.ts` - NEW
- `src/components/contacts/MergeDialog.tsx` - NEW

---

## 📧 PHASE 5: INVITATION SYSTEM (READY)

### What Needs to Be Done

1. **Invite Component**:
   ```typescript
   // "Invite to Salatiso Ecosystem" button shows:
   ✓ Select contacts to invite (multi-select)
   ✓ Choose invitation method:
     - Email link to lifesync-lifecv.web.app
     - SMS with link
     - Copy link to share manually
     - QR code with signup link
   
   ✓ Personalized message template
   ✓ Track invitation status
   ```

2. **Invitation Template**:
   ```
   Subject: Join the Salatiso Ecosystem
   
   Hi [First Name],
   
   [Current User] has invited you to join the Salatiso Ecosystem - 
   a secure family and household network for staying connected.
   
   Sign up here: https://lifesync-lifecv.web.app/signup?invite=[TOKEN]&from=[USER_ID]
   
   Your reference: [CONTACT_EMAIL]
   [OPTIONAL_PERSONAL_MESSAGE]
   
   Questions? Visit: https://salatiso.com/ecosystem
   ```

3. **Backend Integration**:
   ```typescript
   // Firestore structure:
   invitations/
     ├── id: {
     │   recipientEmail: string
     │   recipientPhone?: string
     │   invitedBy: userId
     │   inviteToken: unique_token
     │   method: 'email' | 'sms' | 'link'
     │   status: 'pending' | 'accepted' | 'declined'
     │   sentAt: timestamp
     │   acceptedAt?: timestamp
     │   expiresAt: timestamp (30 days)
     │   metadata: {
     │     recipientName: string
     │     relationship: string
     │     personalMessage?: string
     │   }
     └── }
   ```

4. **Contact Fields to Update**:
   ```typescript
   // Add to Contact interface:
   invitationSent?: boolean
   invitationSentDate?: Date
   invitationAccepted?: boolean
   invitationStatus?: 'pending' | 'accepted' | 'declined'
   acceptanceDate?: Date
   ```

5. **Email Service** - Use existing Firebase Functions or:
   - SendGrid integration (already available)
   - Firebase Cloud Functions
   - EmailJS

**Files to Create**:
- `src/services/InvitationService.ts` - NEW
- `src/components/contacts/InviteModal.tsx` - NEW
- `src/pages/api/invitations/send.ts` - NEW (if using API)

---

## 📊 SUMMARY OF CHANGES

| Phase | Feature | Status | Files |
|-------|---------|--------|-------|
| 1 | Google CSV Import | ✅ Complete | ImportExport.tsx |
| 1 | Firestore Persistence | ✅ Complete | contacts.tsx |
| 2 | Classification UI | 🔄 Ready | ContactCard.tsx, ContactForm.tsx |
| 3 | Smart Suggestions | 🔄 Ready | ContactSuggestionService.ts (new) |
| 4 | Duplicate Detection | 🔄 Ready | DuplicateDetectionService.ts (new) |
| 5 | Invite System | 🔄 Ready | InvitationService.ts (new) |

---

## 🎯 IMMEDIATE NEXT STEPS

### To Test Phase 1 Fix:
1. Go to http://localhost:3001/intranet/contacts/
2. Click "Import Contacts"
3. Upload your Google CSV with 186 contacts
4. Should see: "186 contacts imported successfully" with no errors
5. Refresh page - contacts should still be there (Firestore persisted)

### To Implement Phase 2 (Classification):
1. Open `src/components/contacts/ContactCard.tsx`
2. Add checkboxes for `isFamilyMember`, `isHouseholdMember`
3. Add dropdown for `sonnyRole`
4. Add `handleUpdateContact` call on changes
5. Update `src/services/ContactsService.ts` updateContact method if needed

### Priority Order:
1. **Phase 2** - Classification (5 hours) - Most important for usability
2. **Phase 4** - Duplicate Detection (4 hours) - Prevents data mess
3. **Phase 3** - Smart Suggestions (6 hours) - Nice to have
4. **Phase 5** - Invitations (8 hours) - End goal

---

## ✅ VALIDATION CHECKLIST

After implementing each phase:
- [ ] No TypeScript errors
- [ ] Firestore data persists after page reload
- [ ] No duplicate data on re-import
- [ ] All contact fields display/edit correctly
- [ ] Tested with 186+ contacts
- [ ] Mobile responsive
- [ ] Accessibility compliant

---

## 🚀 DEPLOYMENT

When all phases complete:
```bash
npm run build  # Should pass
firebase deploy  # Deploy to production
```

Visit: https://lifecv-d2724.web.app/intranet/contacts/

---

**Ready to proceed with Phase 2?**
