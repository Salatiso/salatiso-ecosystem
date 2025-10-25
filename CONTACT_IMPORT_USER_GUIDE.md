# Contact Management - Quick User Guide

## 🎯 How to Import Contacts

### Step 1: Prepare Your CSV File
Your CSV should have these columns (in any order):
- **Given Name** (First Name)
- **Family Name** (Last Name)  
- **Email 1 Value** (or just "Email")
- **Phone 1 Value** (or just "Phone")
- **Address**
- **Category** (optional: family, friend, business, professional, service)
- **Tags** (optional: comma-separated)
- **Notes** (optional)

### Step 2: Click "Import/Export"
1. Navigate to **Intranet → Contacts**
2. Click the **"Import/Export"** button (top right)
3. Select your CSV file
4. Wait for "Import Complete" message

### Step 3: Verify Import
You'll see a message like:
```
✅ Import Complete

264 new contacts added
14 duplicates detected

All contacts have been saved to your Firestore database.
```

**Important**: Check the console logs (F12 → Console) for `[Import]` messages if anything seems wrong.

---

## 🔤 Sorting Contacts

### Available Sort Options

| Option | Behavior |
|--------|----------|
| **Default (Newest)** | Shows newest contacts first (based on import date) |
| **A-Z (A to Z)** | Alphabetical by first name |
| **Z-A (Z to A)** | Reverse alphabetical by last name |

### How to Sort
1. Find the **"Sort contacts"** dropdown in the filter bar
2. Select your preferred sort order
3. The list updates instantly
4. Pagination resets to page 1

---

## 📄 Pagination

### How It Works
- Shows **20 contacts per page**
- If you have 50+ contacts, pagination controls appear

### Navigation Controls
| Control | Action |
|---------|--------|
| **Previous** | Go to previous page (greyed out on page 1) |
| **Next** | Go to next page (greyed out on last page) |
| **Page Numbers** | Click to jump to specific page |
| **Contact Counter** | Shows "Showing X to Y of Z contacts" |

### Example
- 264 total contacts
- Page 1: Shows 1-20
- Page 2: Shows 21-40
- Page 13: Shows 241-260
- Page 14: Shows 261-264

---

## ✨ Best Practices

### Before Importing
- ✅ Remove duplicate rows from CSV
- ✅ Verify all names are spelled correctly
- ✅ Check for empty rows at the end of file
- ✅ Use consistent formatting (Title Case for names)
- ✅ Include at least first name for each contact

### During Import
- ✅ Wait for the "Import Complete" message
- ✅ Don't close the modal until message appears
- ✅ Note the count of new contacts added
- ✅ Check browser console (F12) if something seems wrong

### After Import
- ✅ Reload page to verify contacts persisted
- ✅ Try logging out and logging back in
- ✅ Check Firebase Console → Firestore to verify
- ✅ Use sorting to organize newly added contacts

---

## 🐛 Troubleshooting

### "No new contacts to import. All contacts appear to be duplicates."
**Cause**: The CSV contains contacts that already exist  
**Solution**: 
1. Check existing contacts in the app
2. Remove duplicates from CSV
3. Try importing again

### "Import Complete" but contacts don't appear
**Cause**: Firestore persistence issue  
**Solution**:
1. Check browser console for `[Import]` logs
2. Reload the page (Ctrl+R)
3. Try logging out and back in
4. Check Firebase Console → Firestore → contacts collection

### CSV import fails silently
**Cause**: File format or permission issue  
**Solution**:
1. Ensure you're logged in
2. Check CSV has proper headers
3. Try with a smaller test file first
4. Check browser console for error messages

### "Line X: Could not parse contact data"
**Cause**: Empty row or missing required fields  
**Solution**:
1. This is normal - the import skips empty rows
2. The import continues processing valid rows
3. Check the count of successfully imported contacts

### Sorting doesn't seem to work
**Cause**: Page needs refresh or there's a UI glitch  
**Solution**:
1. Refresh the page (Ctrl+R)
2. Try selecting a different sort option
3. Check console for JavaScript errors

---

## 📊 Firestore Verification

### How to Check if Contacts Were Saved

1. **Open Firebase Console**:
   - Go to https://console.firebase.google.com
   - Select project `lifecv-d2724`

2. **Navigate to Firestore**:
   - Click "Firestore Database" in left sidebar
   - Click on `contacts` collection

3. **Verify Your Data**:
   - Should see documents for each contact
   - Each document should have:
     - `firstName` (string)
     - `lastName` (string)
     - `addedBy` (your user ID)
     - `createdAt` (timestamp)
     - `emails` (array)
     - `phoneNumbers` (array)
     - `addresses` (array)

### Expected Firestore Structure
```
contacts collection
├── [doc-id-1]
│   ├── firstName: "John"
│   ├── lastName: "Doe"
│   ├── emails: ["john@example.com"]
│   ├── phoneNumbers: ["+1-555-0123"]
│   ├── addedBy: "your-user-id"
│   └── createdAt: Timestamp(...)
├── [doc-id-2]
│   └── ...
└── [doc-id-3]
    └── ...
```

---

## 🔍 Debugging Tips

### Enable Console Logging
1. Open DevTools: Press **F12**
2. Click on **Console** tab
3. Look for messages with **[Import]** prefix
4. This shows what's happening during import

### Example Console Output
```
[Import] Starting import of 264 contacts
[Import] Found 14 duplicates, 250 new contacts
[Import] Saving 250 contacts to Firestore...
[Import] Successfully saved contacts with IDs: [...]
[Import] Verification: Found 264 total contacts in Firestore
[Import] Import completed successfully. Total contacts now: 264
```

### Check User Authentication
```javascript
// In browser console, check if you're logged in
firebase.auth().currentUser
// Should show your user info, not null
```

---

## 🎯 Common Scenarios

### Scenario 1: Import 500 Contacts
1. Prepare CSV with all 500 contacts
2. Click "Import/Export"
3. Select CSV file
4. Wait for completion (may take 30-60 seconds)
5. Should see message: "500 new contacts added"
6. Pagination controls will appear
7. Use sorting to organize by A-Z

### Scenario 2: Re-import After Error
1. If import failed, contacts are NOT saved
2. Fix the CSV file (remove problematic rows)
3. Try importing again
4. Duplicate detection will skip any already-saved contacts

### Scenario 3: Merge Duplicate Contacts
1. If system detects duplicates, merge dialog appears
2. Choose which information to keep for each field
3. After merge, continue with new contacts import
4. Already-merged contacts won't import again

---

## 📱 Tips for Mobile

### Using Contacts on Mobile
- Pagination still works on small screens
- Sorting dropdown still accessible
- Cards stack vertically (one column)
- Try landscape mode for better layout

### Mobile Import
1. Long-press CSV file from email
2. Select "Open with" → "Browser"
3. Click "Import/Export" on Contacts page
4. Select file and wait for completion

---

## 🔐 Privacy & Security

### Your Data
- All contacts are private to your user account
- Only you can view/edit your contacts
- Data encrypted in Firestore
- Regular backups via Firebase

### Sharing Contacts
- Coming soon: invite other users to view contacts
- Currently: contacts are individual per user

---

## 📞 Help & Support

### If Something Goes Wrong
1. **Check Console Logs** (F12): Look for `[Import]` messages
2. **Verify Authentication**: Make sure you're logged in
3. **Check Firestore**: See if data was actually saved
4. **Try Reloading**: Sometimes just refreshing helps
5. **Report Issue**: Include console logs in error report

### Performance Tips
- Import smaller batches (100-200 contacts) for better performance
- Don't import while doing other heavy operations
- Use A-Z sorting for quickly finding contacts
- Use pagination to avoid loading too many at once

---

**Last Updated**: October 25, 2025  
**Version**: 1.0  
**Status**: ✅ Live
