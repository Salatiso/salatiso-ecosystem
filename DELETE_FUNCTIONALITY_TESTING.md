# 🧪 Delete Functionality Testing Guide
**Date**: October 26, 2025  
**Status**: Ready for Manual Browser Testing  
**Dev Server**: http://localhost:3001

---

## ✅ What Has Been Verified (Code Level)

All the code changes have been implemented and verified:

1. ✅ **deleteContact signature** - Now accepts optional userId
   - File: `src/services/ContactsService.ts:334`
   - Soft-deletes with fields: `isDeleted: true`, `deletedAt`, `deletedBy`, `updatedAt`

2. ✅ **getUserContacts filter** - Automatically excludes deleted
   - File: `src/services/ContactsService.ts:170`
   - Query: `where('isDeleted', '!=', true)`

3. ✅ **Delete handlers** - All pass user.id correctly
   - Single delete: `src/pages/intranet/contacts.tsx:232`
   - Bulk delete: `src/pages/intranet/contacts.tsx:272`
   - Merge dialog: `src/components/contacts/MergeDialog.tsx:76`

4. ✅ **MergeDialog hook fix** - useAuth called at top-level
   - No longer violates React hooks rules

5. ✅ **Build** - Compiles successfully
   - 71 pages generated
   - No TypeScript errors

---

## 🧪 Manual Testing Checklist

### Prerequisites
- Dev server running: http://localhost:3001
- Browser console open: F12 → Console tab
- Authenticated user logged in

---

### Test 1: Single Contact Delete ✅

**Steps:**
1. Navigate to http://localhost:3001/intranet/contacts
2. Locate any existing contact in the grid/list view
3. Click the **trash/delete icon** on the contact
4. Confirm the deletion dialog

**Expected Results:**
```
✅ Console logs appear:
   [ContactsService] Soft deleting contact {ID} (requestedBy: {UID})
   [ContactsService] Successfully soft deleted contact {ID}

✅ Contact disappears from the contacts list immediately

✅ UI shows alert or toast: "Contact deleted. You can restore it from the Recycle Bin."

✅ Firestore verification (Firebase Console):
   - Navigate to Firestore → contacts collection
   - Find the contact by ID
   - Verify document has:
     • isDeleted: true
     • deletedAt: {current timestamp}
     • deletedBy: {your user UID}
```

**If it fails:**
- Console error code? (e.g., permission-denied, not-found)
- Check browser console for full error message
- Share the error code from console

---

### Test 2: Bulk Contact Delete ✅

**Steps:**
1. In contacts page, select multiple contacts using checkboxes
2. Click "Delete" button in bulk operations toolbar
3. Confirm the bulk deletion dialog

**Expected Results:**
```
✅ Console shows delete logs for EACH selected contact

✅ Alert message: "✅ Successfully deleted N contacts. 
   You can restore them from the Recycle Bin."

✅ All selected contacts disappear from list

✅ Firestore: All selected contacts have isDeleted: true
```

---

### Test 3: Recycle Bin Display ✅

**Steps:**
1. Click **"Recycle Bin"** button in contacts page header
2. Modal/page should open showing deleted contacts

**Expected Results:**
```
✅ Modal titled "Recycle Bin" or similar

✅ Shows list of deleted contacts with:
   - Contact name
   - Deletion date ("Deleted X days ago")
   - "Restore" button (green)
   - "Delete Permanently" button (red)

✅ Shows count of deleted items

✅ If no deleted contacts: "No deleted contacts"
```

---

### Test 4: Restore Contact from Recycle Bin ✅

**Steps:**
1. Open Recycle Bin (from Test 3)
2. Click **"Restore"** button on a deleted contact
3. Recycle Bin should update

**Expected Results:**
```
✅ Console logs appear:
   [ContactsService] Restoring contact {ID}
   [ContactsService] Successfully restored contact {ID}

✅ Contact disappears from Recycle Bin

✅ Contact reappears in main Contacts list

✅ Firestore verification:
   - Contact now has: isDeleted: false
   - deletedAt: null
   - deletedBy: null

✅ UI shows alert: "Contact restored successfully"
```

---

### Test 5: Permanently Delete from Recycle Bin ✅

**Steps:**
1. Open Recycle Bin
2. Click **"Delete Permanently"** button on a contact
3. Confirm the permanent deletion dialog
4. Contact should be completely removed

**Expected Results:**
```
✅ Console shows:
   [ContactsService] Permanently deleting contact {ID}
   [ContactsService] Successfully permanently deleted contact {ID}

✅ Contact disappears from Recycle Bin

✅ Firestore verification:
   - Navigate to Firestore → contacts collection
   - Search for the contact ID
   - Result: Contact not found (completely deleted)

✅ UI shows alert: "Contact permanently deleted"
```

---

### Test 6: Empty Recycle Bin ✅

**Steps:**
1. Add multiple deleted contacts (delete 3-5 contacts first)
2. Open Recycle Bin
3. Click **"Empty Recycle Bin"** button (if visible)
4. Confirm the action

**Expected Results:**
```
✅ All deleted contacts are permanently removed

✅ Recycle Bin shows: "No deleted contacts"

✅ Console shows permanent delete logs for each contact

✅ Firestore: All previously deleted contacts are gone

✅ Alert shows: "✅ Recycle bin emptied successfully"
```

---

## 📊 Test Result Template

Copy this and fill it out:

```
Test Date: [DATE]
User Email: [EMAIL]
Test Duration: [TIME]

✅ Test 1 - Single Delete: PASS / FAIL / SKIP
   - Issue (if any): 
   - Console error (if any):

✅ Test 2 - Bulk Delete: PASS / FAIL / SKIP
   - Issue (if any):
   - Console error (if any):

✅ Test 3 - Recycle Bin Display: PASS / FAIL / SKIP
   - Issue (if any):

✅ Test 4 - Restore from Bin: PASS / FAIL / SKIP
   - Issue (if any):
   - Console error (if any):

✅ Test 5 - Permanent Delete: PASS / FAIL / SKIP
   - Issue (if any):
   - Console error (if any):

✅ Test 6 - Empty Recycle Bin: PASS / FAIL / SKIP
   - Issue (if any):
   - Console error (if any):

Overall Status: PASS / FAIL / PARTIAL
Notes: [ANY ADDITIONAL NOTES]
```

---

## 🔍 Console Log Reference

**What you should see on successful delete:**

```javascript
[ContactsService] Soft deleting contact abc123def456 (requestedBy: user-uid-xyz)
[ContactsService] Successfully soft deleted contact abc123def456
```

**If you see errors:**

```javascript
[ContactsService] Error deleting contact abc123def456: [Error object]
[ContactsService] Error code: permission-denied  ← This is what we need
[ContactsService] Error message: Missing or insufficient permissions
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Delete button doesn't work / nothing happens
**Solution:**
1. Check browser console (F12)
2. Look for JavaScript errors (red text)
3. Try again with browser console open
4. Share any error messages

### Issue 2: Contact deleted but still shows in list
**Solution:**
1. Hard refresh page: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Check Firestore - is `isDeleted: true` set?
3. If Firestore shows `isDeleted: true` but UI still shows contact, there's a caching issue

### Issue 3: Recycle Bin button missing or doesn't work
**Solution:**
1. Check if you're logged in
2. Check browser console for errors
3. Verify you have deleted at least one contact
4. Try refreshing the page

### Issue 4: Error: "permission-denied"
**Solution:**
1. This is a Firestore security rules issue
2. Check that contact has `addedBy: your-user-id`
3. Verify Firestore rules allow `addedBy == request.auth.uid`
4. Check browser console for exact error message
5. Share the full error message

### Issue 5: Contact won't restore
**Solution:**
1. Check console for errors
2. Verify Firestore shows `isDeleted: true` before restore
3. After restore, verify `isDeleted: false` in Firestore
4. Try hard refresh
5. Share console error message

---

## 📞 How to Report Issues

When reporting a delete issue, please provide:

1. **Exact steps to reproduce:**
   ```
   1. Open contacts page
   2. Click delete on contact named "John Doe"
   3. Confirm deletion
   4. [What happened?]
   ```

2. **Browser console output (F12):**
   - Copy/paste all red error text
   - Copy/paste all [ContactsService] logs
   - Include error code if present

3. **Firestore state:**
   - Go to Firebase Console → Firestore
   - Find the contact by name
   - Screenshot the document fields
   - Note if `isDeleted`, `deletedAt`, `deletedBy` fields exist

4. **Expected vs Actual:**
   - What should have happened?
   - What actually happened?

---

## 🎯 Success Criteria

All tests pass if:
- ✅ Delete removes contact from main list
- ✅ Console shows [ContactsService] success logs
- ✅ Firestore shows isDeleted: true
- ✅ Recycle Bin shows the contact
- ✅ Restore works and returns contact to main list
- ✅ Permanent delete removes from Recycle Bin

---

## 📈 Performance Notes

- Single delete: ~500-1000ms (network + Firestore write)
- Bulk delete (5 contacts): ~2-3 seconds (5 parallel writes)
- Recycle Bin load: ~500ms (Firestore query)
- Restore: ~500-1000ms (Firestore update)

---

**Ready to test? Start with Test 1 and work through in order. Report any issues!**
