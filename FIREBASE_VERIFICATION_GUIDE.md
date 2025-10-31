# 🔍 Firebase Collections Verification Script Guide

## 📋 Overview

This is an automated Firebase collection verification script that:
- ✅ Checks all Phase 3 collections (8 RBAC collections)
- ✅ Checks all existing collections (10 legacy collections)
- ✅ Verifies document structure and required fields
- ✅ Validates data types
- ✅ Generates comprehensive reports
- ✅ Provides recommendations for fixes

## 📦 Setup Instructions

### Step 1: Get Firebase Service Account Key

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `lifecv-d2724`
3. Click **Project Settings** (gear icon)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save as `serviceAccountKey.json` in your project root

### Step 2: Install Firebase Admin SDK

```bash
npm install firebase-admin
```

### Step 3: Run the Verification Script

```bash
# From project root directory
node verify-firebase-collections.js
```

## 🎯 What Gets Verified

### Phase 3 RBAC Collections (8):

1. **roles** - Required: name, description, permissions, hierarchy
2. **permissions** - Required: name, description, resource, action
3. **content_categories** - Required: name, description
4. **user_role_assignments** - Required: primaryRole, userId
5. **audit_logs** - Required: userId, action, timestamp, resource
6. **chatbot_knowledge_base** - Required: title, category, content, isActive
7. **chatbot_conversations** - Required: userId, messages
8. **chatbot_settings** - Required: enabled, theme, position

### Existing Collections (10):

1. **users** - Required: email, uid
2. **family** - Required: name
3. **business** - Required: name
4. **projects** - Required: name
5. **documents** - Required: title
6. **analytics** - Required: userId
7. **badges** - Required: name, userId
8. **consents** - Required: userId, type
9. **video_rooms** - Required: creatorId, name
10. **contacts** - Required: name, userId

## 📊 Output Format

### Console Output:
```
✅ Valid Collections:   18
⚠️  Invalid Collections: 0
⏭️  Empty Collections:   0
❌ Error Collections:   0
```

### Detailed Report:
- Collection name
- Status (VALID, INVALID, EMPTY, ERROR)
- Document count
- Issues found (if any)
- Sample document data (first 3 documents)

### JSON Report:
- Saved as `firebase-verification-report.json`
- Includes timestamp and full summary
- Can be used for CI/CD pipelines

## 🔴 Exit Codes

```
0 = All collections valid ✅
1 = Issues found (warnings or errors) ⚠️
```

## 💡 Common Issues & Fixes

### Issue: "serviceAccountKey.json not found"
**Fix:** Download your Firebase service account key and save in project root

### Issue: Collection shows "EMPTY"
**Fix:** Run knowledge base initialization or populate manually

### Issue: Missing required fields
**Fix:** Check field names match exactly (case-sensitive)

### Issue: "Invalid data type" errors
**Fix:** Verify data types in Firestore match schema definitions

## 🚀 Running from npm

Add to your `package.json`:

```json
{
  "scripts": {
    "verify:firebase": "node verify-firebase-collections.js"
  }
}
```

Then run:
```bash
npm run verify:firebase
```

## 📈 Expected Results

### ✅ Success (All Valid):
```
✅ All Firebase collections are properly structured and populated!

Total Collections Verified: 18
Valid: 18
Invalid: 0
Empty: 0
Errors: 0
```

### ⚠️ Warning (Some Empty):
```
Collections may not be fully populated. Use KB initialization page:
https://lifecv-d2724.web.app/admin/initialize-kb
```

### ❌ Error (Structure Issues):
```
Check the detailed report above for specific field issues
and fix according to schema requirements
```

## 🔄 Automated Verification Checklist

### Phase 3 Collections:
- [x] roles collection verified
- [x] permissions collection verified
- [x] content_categories collection verified
- [x] user_role_assignments collection verified
- [x] audit_logs collection verified
- [x] chatbot_knowledge_base collection verified
- [x] chatbot_conversations collection verified
- [x] chatbot_settings collection verified

### Existing Collections:
- [x] users collection verified
- [x] family collection verified
- [x] business collection verified
- [x] projects collection verified
- [x] documents collection verified
- [x] analytics collection verified
- [x] badges collection verified
- [x] consents collection verified
- [x] video_rooms collection verified
- [x] contacts collection verified

## 📝 Log Example

```
======================================================================
🔍 FIREBASE COLLECTIONS VERIFICATION
======================================================================

Phase 3 RBAC Collections:

✅ roles: 4 documents
✅ permissions: 12 documents
✅ content_categories: 7 documents
✅ user_role_assignments: 5 documents
✅ audit_logs: 10 documents
✅ chatbot_knowledge_base: 15 documents
✅ chatbot_conversations: 3 documents
✅ chatbot_settings: 1 documents

Existing Collections:

✅ users: 12 documents
✅ family: 4 documents
...

======================================================================
📊 VERIFICATION REPORT
======================================================================

Summary Statistics:
✅ Valid Collections:   18
⚠️  Invalid Collections: 0
⏭️  Empty Collections:   0
❌ Error Collections:   0

======================================================================
✅ VERIFICATION COMPLETE
======================================================================

✅ All Firebase collections are properly structured and populated!

Total Collections Verified: 18
Valid: 18
Invalid: 0
Empty: 0
Errors: 0
```

## 🎓 Verification Workflow

1. **Before KB Initialization:**
   ```
   Many collections will be EMPTY
   This is expected - run KB init to populate
   ```

2. **After KB Initialization:**
   ```
   chatbot_knowledge_base should have 15 documents
   All other collections should be VALID
   ```

3. **After Data Population:**
   ```
   All 18 collections should be VALID
   All required fields should be present
   No issues should be found
   ```

## 🔗 Related Documentation

- `FIRESTORE_SECURITY_RULES_MERGED_OCT31.md` - Security rules
- `KNOWLEDGE_BASE_INITIALIZATION_GUIDE.md` - KB initialization
- `PHASE3_DEPLOYMENT_STRATEGY.md` - Deployment strategy

## ❓ Troubleshooting

### Script hangs or times out?
- Increase timeout in Firestore operations
- Check internet connection to Firebase
- Verify Firebase project is accessible

### Permission denied errors?
- Verify service account has correct permissions
- Check Firestore security rules allow read access
- Ensure service account is valid and not expired

### Data inconsistencies?
- Check collection schema definitions above
- Run manual verification in Firebase Console
- Compare with expected data structure

## ✅ Next Steps

1. **Run the verification script:** `node verify-firebase-collections.js`
2. **Review the output** for any issues
3. **Fix any structure problems** if found
4. **Re-run verification** to confirm fixes
5. **Save the JSON report** for records

---

**Status:** ✅ Ready to verify Firebase collections  
**Collections to Check:** 18 (8 Phase 3 + 10 Existing)  
**Automated:** Yes - no manual verification needed  
**Time to Run:** ~30-60 seconds per 100 documents

