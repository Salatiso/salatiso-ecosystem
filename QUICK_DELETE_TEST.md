# ⚡ Quick Start: Testing Delete Functionality
**Date**: October 26, 2025  
**Dev Server**: ✅ Running on http://localhost:3001

---

## 🚀 Quick 5-Minute Test

### 1. Open the App
```
URL: http://localhost:3001/intranet/contacts
```

### 2. Open Browser Console
```
Press: F12
Navigate to: Console tab
```

### 3. Delete a Contact
```
1. Find any contact in the grid
2. Click the trash/delete icon
3. Click "OK" to confirm
4. Watch for console logs
```

### 4. Check Console Logs
```
Look for these messages (green text):
✅ [ContactsService] Soft deleting contact {ID} (requestedBy: {UID})
✅ [ContactsService] Successfully soft deleted contact {ID}

If you see ERROR (red text), copy it and share it
```

### 5. Verify in Firestore
```
1. Go to: https://console.firebase.google.com
2. Project: salatiso-lifecv
3. Firestore Database
4. Collection: contacts
5. Find the contact you just deleted
6. Verify it has:
   - isDeleted: true
   - deletedAt: (current timestamp)
   - deletedBy: (your user ID)
```

### 6. Test Recycle Bin
```
1. Go back to: http://localhost:3001/intranet/contacts
2. Click "Recycle Bin" button (red trash icon in header)
3. Your deleted contact should appear
4. Click "Restore"
5. Contact should reappear in main list
```

---

## 📝 What to Report

If delete fails:
1. **Copy console error** (red text)
2. **Go to Firestore** and check:
   - Does contact have `addedBy` field?
   - Does it match your user ID?
3. **Tell me**:
   - What happened?
   - What's the error code?
   - Does Firestore show isDeleted: true?

---

## 📊 Expected Timeline
- Delete action: 1-2 seconds
- UI update: Instant
- Recycle Bin load: 1-2 seconds
- Restore action: 1-2 seconds

---

## ✅ Success Indicators

Delete worked if:
- ✅ Console shows "[ContactsService] Successfully soft deleted"
- ✅ Contact disappears from list
- ✅ Firestore shows isDeleted: true
- ✅ Recycle Bin shows the contact
- ✅ Restore brings it back

---

## 🆘 If Something Fails

1. **Check console error** (F12 → Console)
2. **Hard refresh page** (Ctrl+Shift+R)
3. **Try again**
4. **Share error code with me**

Common error codes:
- `permission-denied` → Firestore rules issue
- `not-found` → Contact ID not found
- `network-error` → Connection problem
- `invalid-argument` → Data validation error

---

## 📞 Questions?

The system is **code-verified and ready to test**. 

Just let me know what you find!
