# Firestore Collections Setup - Step by Step

**Goal**: Create 8 Firestore Collections for Phase 3  
**Time**: 15-20 minutes  
**Date**: October 30, 2025

---

## 🎯 QUICK START

### Step 1: Go to Firebase Console

```
1. Open: https://console.firebase.google.com
2. Select your project (Salatiso)
3. Click: "Firestore Database" in left menu
4. You should see your database created
```

### Step 2: Create First Collection - "roles"

```
1. Click: "+ Create collection"
2. Collection ID: roles
3. Click: "Next"
4. Add first document:
   Document ID: family (auto-generated OR type: family)
   Fields:
   ├─ id (string): family
   ├─ name (string): Family Account
   ├─ description (string): Full access for parents/adults
   ├─ priority (number): 3
   ├─ permissions (array): [view_all, create_content, manage_kids, invite_users]
   ├─ contentAccess (string): all
   └─ maxUsers (number): 10
5. Click: "Save"
```

### Step 3: Add Remaining Role Documents

**Add Document 2 - "child":**
```
Document ID: child
Fields:
├─ id: child
├─ name: Child Account
├─ description: Age-gated content access for children
├─ priority: 1
├─ permissions: [view_kids_content, learn]
├─ contentAccess: kids_only
└─ maxUsers: 1
```

**Add Document 3 - "license":**
```
Document ID: license
Fields:
├─ id: license
├─ name: License Account
├─ description: Commercial/organizational license
├─ priority: 2
├─ permissions: [view_all, create_content, export_data, advanced_features]
├─ contentAccess: all
└─ maxUsers: 100
```

**Add Document 4 - "admin":**
```
Document ID: admin
Fields:
├─ id: admin
├─ name: Administrator
├─ description: System administrator (Salatiso)
├─ priority: 4
├─ permissions: [*] (means all permissions)
├─ contentAccess: all
└─ maxUsers: 1
```

---

## ✅ COLLECTION CHECKLIST

### Collections to Create (in order):

```
☐ Collection 1: roles (4 documents)
  ├─ family
  ├─ child
  ├─ license
  └─ admin

☐ Collection 2: permissions (5+ documents)
  ├─ view_all
  ├─ create_content
  ├─ view_kids_content
  ├─ manage_kids
  └─ export_data

☐ Collection 3: content_categories (4 documents)
  ├─ kids_educational
  ├─ kids_entertainment
  ├─ business_tools
  └─ public_information

☐ Collection 4: user_role_assignments
  └─ (Will be auto-populated - leave empty for now)

☐ Collection 5: audit_logs
  └─ (Will be auto-populated - leave empty for now)

☐ Collection 6: chatbot_knowledge_base
  └─ (Will be auto-populated - leave empty for now)

☐ Collection 7: chatbot_conversations
  └─ (Will be auto-populated - leave empty for now)

☐ Collection 8: chatbot_settings
  └─ 1 document: global_settings
```

---

## 📋 SAMPLE DATA - Copy & Paste Ready

### For "permissions" Collection

**Document 1: view_all**
```
id: view_all
name: View All Content
description: Access to all content types
category: content
requiresApproval: false
appliesTo: [family, license, admin]
```

**Document 2: create_content**
```
id: create_content
name: Create Content
description: Ability to create new content
category: content
requiresApproval: true
appliesTo: [family, license, admin]
```

**Document 3: view_kids_content**
```
id: view_kids_content
name: View Kids Content
description: Access to age-appropriate content
category: content
requiresApproval: false
appliesTo: [child]
```

**Document 4: manage_kids**
```
id: manage_kids
name: Manage Child Accounts
description: Create and manage child profiles
category: admin
requiresApproval: true
appliesTo: [family, admin]
```

**Document 5: export_data**
```
id: export_data
name: Export Data
description: Export system data
category: data
requiresApproval: true
appliesTo: [license, admin]
```

### For "content_categories" Collection

**Document 1: kids_educational**
```
id: kids_educational
name: Kids Educational
description: Educational content for children
ageRange: {min: 6, max: 12}
accessRoles: [child, family, admin]
isPublic: false
requiresParentalConsent: true
```

**Document 2: kids_entertainment**
```
id: kids_entertainment
name: Kids Entertainment
description: Entertainment for children
ageRange: {min: 6, max: 17}
accessRoles: [child, family, admin]
isPublic: false
requiresParentalConsent: true
```

**Document 3: business_tools**
```
id: business_tools
name: Business Tools
description: Professional business tools
ageRange: {min: 18, max: null}
accessRoles: [family, license, admin]
isPublic: false
requiresParentalConsent: false
```

**Document 4: public_information**
```
id: public_information
name: Public Information
description: Publicly available information
ageRange: null
accessRoles: [*]
isPublic: true
requiresParentalConsent: false
```

### For "chatbot_settings" Collection

**Document 1: global_settings**
```
id: global_settings
geminiModel: gemini-pro
maxTokensPerResponse: 1024
temperature: 0.7
topP: 0.95
topK: 40
systemPrompt: You are MNI Assistant, a helpful guide for the MNI platform...
maxMessagesPerSession: 50
sessionTimeoutMinutes: 30
retainHistoryDays: 90
enableFeedback: true
trackInteractions: true
trackSatisfaction: true
languages: [en, zu, xh, af, st, ss, sw, sn, pt, fr]
```

---

## 🔐 Deploy Security Rules

**After creating collections:**

```
1. In Firebase Console, click: "Rules" tab
2. Delete the existing rule
3. Replace with:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAdmin() {
      return get(/databases/$(database)/documents/user_role_assignments/$(request.auth.uid)).data.primaryRole == 'admin';
    }

    match /roles/{document=**} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    match /permissions/{document=**} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    match /content_categories/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /user_role_assignments/{userId} {
      allow read: if request.auth.uid == userId || isAdmin();
      allow write: if isAdmin();
    }

    match /audit_logs/{document=**} {
      allow read: if isAdmin();
      allow create: if true;
      allow update: if false;
      allow delete: if false;
    }

    match /chatbot_knowledge_base/{document=**} {
      allow read: if resource.data.isActive == true;
      allow write: if isAdmin();
    }

    match /chatbot_conversations/{document=**} {
      allow read: if request.auth.uid == resource.data.userId || isAdmin();
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update: if request.auth.uid == resource.data.userId || isAdmin();
    }

    match /chatbot_settings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}

4. Click: "Publish"
```

---

## ✨ VERIFICATION CHECKLIST

After setup, verify:

```
☐ Can see "roles" collection with 4 documents (family, child, license, admin)
☐ Can see "permissions" collection with 5 documents
☐ Can see "content_categories" collection with 4 documents  
☐ Can see "user_role_assignments" collection (empty, that's OK)
☐ Can see "audit_logs" collection (empty, that's OK)
☐ Can see "chatbot_knowledge_base" collection (empty for now)
☐ Can see "chatbot_conversations" collection (empty, that's OK)
☐ Can see "chatbot_settings" collection with 1 document (global_settings)
☐ Security Rules are published
☐ Build still passes (npm run build)
```

---

## 🎯 YOU'RE DONE WHEN:

✅ All 8 collections visible in Firebase Console  
✅ Initial data populated (roles, permissions, categories)  
✅ Security rules deployed  
✅ No errors in Firestore  
✅ Ready to start TypeScript services

---

**Estimated Time**: 15-20 minutes  
**Difficulty**: Easy (UI-based, no coding)  
**Blocker?**: No - this doesn't block development

**Next**: After this is complete, we'll create TypeScript services to interact with these collections.

---

*Status: READY TO EXECUTE*  
*Date: October 30, 2025*
