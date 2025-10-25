# Complete Testing Guide - Phase 2 Sprint 2 ✅

**Test Environment**: https://lifecv-d2724.web.app/intranet/contacts  
**Status**: All 5 features live and ready to test  
**Duration**: ~30-45 minutes for full testing

---

## 🧪 Feature Testing Matrix

### TEST 1: Bulk Operations ✅

**Location**: Intranet → Contacts (any view)

#### Step 1: Multi-Select Contacts
```
1. Go to contacts page
2. Look for checkboxes on each contact card
3. Click 3-4 checkboxes to select contacts
4. ✓ Selection counter should show (e.g., "3 selected")
5. ✓ Toolbar should appear with bulk action buttons
```

**Expected Result**: ✅ Checkboxes work, counter updates, toolbar visible

#### Step 2: Bulk Delete
```
1. With 2+ contacts selected
2. Click "Delete" button in bulk toolbar
3. Confirmation dialog appears
4. Click "Cancel" first (test safety)
5. ✓ Contacts should still be there
6. Click "Delete" button again
7. Click "Confirm Delete"
8. ✓ Selected contacts removed from list
```

**Expected Result**: ✅ Confirmation prevents accidents, deletion works

#### Step 3: Export CSV
```
1. Select 2-3 contacts
2. Click "Export CSV" button
3. File downloads: contacts-export-YYYY-MM-DD.csv
4. Open file in text editor or Excel
5. ✓ Should contain headers and contact data
6. ✓ Selected contacts should be in file
```

**Expected Result**: ✅ CSV downloads correctly with proper format

#### Step 4: Bulk Tag
```
1. Select 2+ contacts
2. Click "Add Tag" button
3. Popup asks for tag name
4. Enter: "imported" or "vip"
5. Click OK
6. ✓ Reload page or check contact cards
7. ✓ New tag should appear on all selected contacts
```

**Expected Result**: ✅ Tag applied to all selected contacts, persists after reload

#### Step 5: Test in All View Formats
```
1. Switch to List View (button at top)
   ✓ Checkboxes visible
   ✓ Bulk operations work same as grid
2. Switch to Table View
   ✓ Checkboxes visible
   ✓ Bulk operations work same as grid
```

**Expected Result**: ✅ Bulk operations consistent across all views

---

### TEST 2: Image Upload ✅

**Location**: Any contact card → "Add Photos" button

#### Step 1: Upload Images (Drag & Drop)
```
1. On contact card, click "Add Photos"
2. ImageUpload component appears
3. Drag 2-3 images onto upload area
4. ✓ Images should appear in gallery below
5. ✓ Each image shows thumbnail
6. ✓ Counter shows current count (e.g., "2/5")
```

**Expected Result**: ✅ Drag-drop works, images display in gallery

#### Step 2: Upload Images (File Picker)
```
1. Click "Click to browse" in upload area
2. File picker dialog opens
3. Select 1-2 image files
4. ✓ Images appear in gallery
5. ✓ Counter updates (e.g., "3/5")
```

**Expected Result**: ✅ File picker works, images added to gallery

#### Step 3: Remove Images
```
1. In gallery, hover over an image
2. Click X button on image
3. ✓ Image removed from gallery
4. ✓ Counter decreases (e.g., "2/5")
5. Repeat for another image
```

**Expected Result**: ✅ Individual image removal works

#### Step 4: Image Persistence
```
1. Upload 2-3 images to contact
2. Close contact card or modal
3. Navigate away from contacts page
4. Come back to contacts page
5. Open same contact card
6. ✓ All images should still be there
```

**Expected Result**: ✅ Images persist in Firestore

#### Step 5: Upload Limit
```
1. Upload 5 images
2. Try to drag/upload 6th image
3. ✓ Should show error or prevent upload
4. ✓ Counter should stay at "5/5"
```

**Expected Result**: ✅ 5-image limit enforced

#### Step 6: Image Validation
```
1. Try uploading a non-image file (txt, pdf)
2. ✓ Should show error message
3. Try uploading very large file (>10MB)
4. ✓ Should show size error
```

**Expected Result**: ✅ File validation working

---

### TEST 3: Contact Relationships ✅

**Location**: Any contact card → "Add Relationships" button

#### Step 1: View Existing Relationships
```
1. On contact card, click "Add Relationships"
2. Widget appears (might be collapsed)
3. ✓ If contact has relationships, they should show
4. ✓ Each relationship shows icon and type
```

**Expected Result**: ✅ Existing relationships display correctly

#### Step 2: Add Relationship
```
1. In relationships widget, click "+" button
2. Relationship selector appears
3. Select from dropdown: "Spouse", "Child", "Parent", etc.
4. Contact picker shows below
5. Click a contact from the list
6. ✓ Relationship added to list
7. ✓ Icon and color show type (❤️ for spouse, etc.)
```

**Expected Result**: ✅ Relationship added and displays with correct icon

#### Step 3: Test All Relationship Types
```
Repeat adding relationships:
  ✓ Spouse ❤️ (red)
  ✓ Child 👶 (blue)
  ✓ Parent 👤 (green)
  ✓ Sibling 👫 (purple)
  ✓ Friend 👥 (yellow)
  ✓ Colleague 💼 (orange)
  ✓ Other 🔗 (gray)
```

**Expected Result**: ✅ All 7 types work with correct colors/icons

#### Step 4: Remove Relationship
```
1. In relationships list, find a relationship
2. Click X button next to it
3. ✓ Relationship removed immediately
4. ✓ List updates
```

**Expected Result**: ✅ Relationship removal works

#### Step 5: Relationship Persistence
```
1. Add several relationships to contact
2. Close card/modal
3. Navigate away
4. Come back to contacts
5. Open same contact
6. ✓ All relationships should still be there
```

**Expected Result**: ✅ Relationships persist in Firestore

#### Step 6: Relationship Grouping
```
1. Add multiple relationships of same type
2. Expand "Relationships" section in detail modal
3. ✓ Relationships should be grouped by type
4. ✓ Each group shows count
```

**Expected Result**: ✅ Relationships grouped logically in display

---

### TEST 4: Contact Detail Modal ✅

**Location**: Click eye 👁️ icon on any contact card

#### Step 1: Open Detail Modal
```
1. Find any contact card
2. Click eye (👁️) icon button
3. ✓ Modal slides in smoothly
4. ✓ Shows full contact details
5. ✓ Modal background darkens
```

**Expected Result**: ✅ Modal opens with animation

#### Step 2: Explore Expandable Sections
```
1. Modal displays several sections:
   - Overview (always expanded)
   - Images
   - Notes
   - Relationships
   - Suggestions
   - Information
2. Click each section header
3. ✓ Sections expand and collapse smoothly
4. ✓ Content displays/hides
```

**Expected Result**: ✅ Expandable sections work smoothly

#### Step 3: Copy to Clipboard
```
1. In Overview section, look for email
2. Click on email address
3. ✓ Toast/message appears: "Copied!"
4. Paste somewhere (Ctrl+V)
5. ✓ Email should be in clipboard
6. Repeat with phone number
```

**Expected Result**: ✅ Copy-to-clipboard works with feedback

#### Step 4: Download vCard
```
1. Click "Download vCard" button in header
2. File downloads: {firstname}-{lastname}.vcf
3. Open file in text editor
4. ✓ Should contain contact data in vCard format
5. ✓ File should be importable to Outlook/Apple Contacts
```

**Expected Result**: ✅ vCard exports correctly

#### Step 5: Share Contact
```
1. Click "Share" button
2. Share dialog appears (native browser share or copy dialog)
3. ✓ Should show option to copy or share
4. Try copying
5. Paste somewhere
6. ✓ Contact info should be available
```

**Expected Result**: ✅ Share functionality works

#### Step 6: View Images in Modal
```
1. Open contact with photos
2. Expand "Images" section
3. ✓ All images display in gallery
4. ✓ Thumbnails show clearly
5. ✓ Can scroll if many images
```

**Expected Result**: ✅ Image gallery works in modal

#### Step 7: View Relationships in Modal
```
1. Open contact with relationships
2. Expand "Relationships" section
3. ✓ All relationships display grouped by type
4. ✓ Each shows icon, type, and contact name
```

**Expected Result**: ✅ Relationships display properly in modal

#### Step 8: View Suggestions
```
1. Expand "Suggestions" section
2. ✓ Smart suggestions appear (AI-detected family, colleagues)
3. ✓ Shows up to 10 suggestions
```

**Expected Result**: ✅ Smart suggestions display

#### Step 9: Edit from Modal
```
1. Click "Edit" button in modal header
2. ✓ Modal closes
3. ✓ Edit form opens with contact data
4. Make a change (e.g., add note)
5. Save
6. ✓ Contact updated
7. Re-open modal to verify change
```

**Expected Result**: ✅ Edit transition works smoothly

#### Step 10: Close Modal
```
1. Click X button or click outside modal
2. ✓ Modal closes smoothly
3. ✓ Returns to contact list
```

**Expected Result**: ✅ Modal close works both ways

---

### TEST 5: Backup & Restore ✅

**Location**: Top toolbar → "Backup/Restore" button

#### Step 1: Open Backup Panel
```
1. In contacts page, find "Backup/Restore" button (purple)
2. Click button
3. ✓ Panel opens showing backup options
4. ✓ Shows total contacts count
5. ✓ Shows "Last Backup" date (or "Never")
```

**Expected Result**: ✅ Backup panel opens correctly

#### Step 2: Download Backup
```
1. Click "Download Backup" button
2. File downloads: contacts-backup-YYYY-MM-DD.json
3. ✓ File should be several KB
4. Open in text editor
5. ✓ Should contain JSON with all contacts
6. ✓ Should be valid JSON (valid syntax)
```

**Expected Result**: ✅ Backup downloads as JSON

#### Step 3: Auto-Backup Toggle
```
1. In backup panel, find "Auto-backup enabled" checkbox
2. Toggle ON
3. ✓ Checkbox shows enabled
4. ✓ Text shows status
5. Toggle OFF
6. ✓ Checkbox shows disabled
```

**Expected Result**: ✅ Auto-backup toggle works

#### Step 4: Backup History
```
1. After downloading backup, scroll down
2. "Backup History" section should appear
3. ✓ Shows recent backup(s)
4. ✓ Shows date, contact count, file size
5. Click to expand entry
6. ✓ Shows additional info
```

**Expected Result**: ✅ Backup history displays

#### Step 5: Restore from Backup
```
1. In backup panel, click "Restore from File"
2. File picker opens
3. Select a backup JSON file
4. Confirmation asks about restore
5. Click OK to confirm
6. ✓ Success message appears
7. ✓ New contacts added to system
8. ✓ Refresh page - contacts persist
```

**Expected Result**: ✅ Restore works, duplicates handled

#### Step 6: Clear Backup History
```
1. Click "Clear All" button in backup section
2. Confirmation appears
3. Click OK
4. ✓ Backup history cleared
5. ✓ History section disappears
```

**Expected Result**: ✅ Clear all works

---

## 🔄 Cross-Feature Integration Tests

### Integration Test 1: Complete Workflow
```
1. Add new contact
2. Upload image to contact
3. Add relationships to contact
4. View in detail modal
5. Check everything displays correctly
6. Backup all contacts
7. Verify backup contains all data
```

**Expected Result**: ✅ All features work together seamlessly

### Integration Test 2: Bulk + Detail
```
1. Select multiple contacts
2. Click detail on one
3. Modal shows correctly
4. Close modal
5. Original selection still active
6. Bulk delete selected contacts
```

**Expected Result**: ✅ Features don't interfere

### Integration Test 3: Restore + View
```
1. Create backup
2. Delete some contacts
3. Restore from backup
4. Open detail modal on restored contact
5. ✓ All fields, images, relationships present
6. ✓ Everything displays correctly
```

**Expected Result**: ✅ Restored data fully functional

---

## ✅ Final Validation Checklist

### Performance
- [ ] Page loads in < 3 seconds
- [ ] No lag when selecting contacts
- [ ] Modal opens smoothly
- [ ] Images load quickly
- [ ] Backups download without delay

### User Experience
- [ ] All buttons are clickable
- [ ] Confirmations clear and helpful
- [ ] Error messages helpful (if any)
- [ ] Touch-friendly on mobile
- [ ] Animations smooth (not too slow/fast)

### Data Integrity
- [ ] No data lost on refresh
- [ ] Firestore updates visible
- [ ] Backup files valid
- [ ] Restore works correctly
- [ ] No duplicate contacts after restore

### Browser Compatibility
- [ ] Chrome works fine
- [ ] Firefox works fine
- [ ] Safari works fine
- [ ] Edge works fine
- [ ] Mobile browser works fine

### Accessibility
- [ ] Can navigate with keyboard
- [ ] Tab through buttons works
- [ ] Focus indicators visible
- [ ] Read-only text accessible
- [ ] Error messages announce properly

---

## 🎯 Approval Decision

### If All Tests Pass ✅
→ **Ready for Production!**
```bash
firebase deploy --only hosting
```

### If Issues Found ❌
→ **Report the Issue**
1. Describe what happened
2. What did you expect?
3. Steps to reproduce
4. Screenshot/video if possible

---

## 📝 Test Report Template

```
Feature: [Feature Name]
Status: ✅ PASS / ❌ FAIL
Date: October 25, 2025

What Worked Well:
- [Item 1]
- [Item 2]

Issues Found:
- [Issue 1]
- [Issue 2]

Screenshots/Notes:
[Observations]

Overall: Ready / Needs Fixes
```

---

## 🎉 Ready to Test?

**Test URL**: https://lifecv-d2724.web.app/intranet/contacts

**Estimated Time**: 30-45 minutes  
**Complexity**: Easy (clear UI)  
**Risk**: None (staging only)

Start testing whenever ready! 🚀

