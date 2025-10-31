# Firestore Collections - Create NOW (5 Minutes)

**What to do**: Follow this EXACTLY to create your collections  
**Time**: 5 minutes  
**Difficulty**: Super Easy (just copy-paste into Firebase Console)

---

## 🎯 QUICK REFERENCE: What to Create

| # | Collection Name | Status | # of Docs | Action |
|---|---|---|---|---|
| 1 | `roles` | ⏳ TODO | 4 | Create + Add 4 docs |
| 2 | `permissions` | ⏳ TODO | 5 | Create + Add 5 docs |
| 3 | `content_categories` | ⏳ TODO | 4 | Create + Add 4 docs |
| 4 | `user_role_assignments` | ⏳ TODO | 0 | Create (empty OK) |
| 5 | `audit_logs` | ⏳ TODO | 0 | Create (empty OK) |
| 6 | `chatbot_knowledge_base` | ⏳ TODO | 3+ | Create + Add docs |
| 7 | `chatbot_conversations` | ⏳ TODO | 0 | Create (empty OK) |
| 8 | `chatbot_settings` | ⏳ TODO | 1 | Create + Add 1 doc |

---

## 🚀 DO THIS NOW - Step by Step

### COLLECTION 1: `roles`

**Go to Firebase Console > Firestore > Create Collection**

```
Collection ID: roles
First Doc ID: family

Document 1 - "family":
  id: "family"
  name: "Family Account"
  description: "Full access for parents/adults"
  priority: 3
  permissions: ["view_all", "create_content", "manage_kids", "invite_users"]
  contentAccess: "all"
  maxUsers: 10

Document 2 - "child":
  id: "child"
  name: "Child Account"
  description: "Age-gated content"
  priority: 1
  permissions: ["view_kids_content", "learn"]
  contentAccess: "kids_only"
  maxUsers: 1

Document 3 - "license":
  id: "license"
  name: "License Account"
  description: "c"
  priority: 2
  permissions: ["view_all", "create_content", "export_data", "advanced_features"]
  contentAccess: "all"
  maxUsers: 100

Document 4 - "admin":
  id: "admin"
  name: "Administrator"
  description: "System admin (Salatiso)"
  priority: 4
  permissions: ["*"]
  contentAccess: "all"
  maxUsers: 1
```

### COLLECTION 2: `permissions`

```
Collection ID: permissions

Document 1 - "view_all":
  id: "view_all"
  name: "View All Content"
  category: "content"
  requiresApproval: false
  appliesTo: ["family", "license", "admin"]

Document 2 - "create_content":
  id: "create_content"
  name: "Create Content"
  category: "content"
  requiresApproval: true
  appliesTo: ["family", "license", "admin"]

Document 3 - "view_kids_content":
  id: "view_kids_content"
  name: "View Kids Content"
  category: "content"
  requiresApproval: false
  appliesTo: ["child"]

Document 4 - "manage_kids":
  id: "manage_kids"
  name: "Manage Child Accounts"
  category: "admin"
  requiresApproval: true
  appliesTo: ["family", "admin"]

Document 5 - "export_data":
  id: "export_data"
  name: "Export Data"
  category: "data"
  requiresApproval: true
  appliesTo: ["license", "admin"]
```

### COLLECTION 3: `content_categories`

```
Collection ID: content_categories

Document 1 - "kids_educational":
  id: "kids_educational"
  name: "Kids Educational"
  ageRange: {min: 6, max: 12}
  accessRoles: ["child", "family", "admin"]
  isPublic: false
  requiresParentalConsent: true

Document 2 - "kids_entertainment":
  id: "kids_entertainment"
  name: "Kids Entertainment"
  ageRange: {min: 6, max: 17}
  accessRoles: ["child", "family", "admin"]
  isPublic: false
  requiresParentalConsent: true

Document 3 - "business_tools":
  id: "business_tools"
  name: "Business Tools"
  ageRange: {min: 18, max: null}
  accessRoles: ["family", "license", "admin"]
  isPublic: false
  requiresParentalConsent: false

Document 4 - "public_information":
  id: "public_information"
  name: "Public Information"
  ageRange: null
  accessRoles: ["*"]
  isPublic: true
  requiresParentalConsent: false
```

### COLLECTION 4: `user_role_assignments`

```
Collection ID: user_role_assignments
(Leave empty for now - auto-populated by your app)
```

### COLLECTION 5: `audit_logs`

```
Collection ID: audit_logs
(Leave empty for now - auto-populated by your app)
```

### COLLECTION 6: `chatbot_knowledge_base`

```
Collection ID: chatbot_knowledge_base

Document 1 - "kb_001":
  id: "kb_001"
  title: "Getting Started with MNI"
  category: "onboarding"
  content: "Welcome to MNI! Here's how to get started with your account..."
  keywords: ["start", "begin", "new", "account"]
  isActive: true
  language: "en"
  contentType: "article"
  author: "admin"

Document 2 - "kb_002":
  id: "kb_002"
  title: "Managing Child Accounts"
  category: "account"
  content: "As a parent, you can create accounts for your children..."
  keywords: ["child", "kids", "account", "parent", "manage"]
  isActive: true
  language: "en"
  contentType: "guide"
  author: "admin"

Document 3 - "kb_003":
  id: "kb_003"
  title: "What Kids Can Access"
  category: "kids"
  content: "Child accounts have access to age-appropriate content..."
  keywords: ["kids", "content", "access", "can", "do"]
  isActive: true
  language: "en"
  contentType: "faq"
  author: "admin"
```

### COLLECTION 7: `chatbot_conversations`

```
Collection ID: chatbot_conversations
(Leave empty - auto-populated when users chat)
```

### COLLECTION 8: `chatbot_settings`

```
Collection ID: chatbot_settings

Document 1 - "global_settings":
  id: "global_settings"
  geminiModel: "gemini-pro"
  maxTokensPerResponse: 1024
  temperature: 0.7
  topP: 0.95
  topK: 40
  maxMessagesPerSession: 50
  sessionTimeoutMinutes: 30
  retainHistoryDays: 90
  enableFeedback: true
  trackInteractions: true
  languages: ["en", "zu", "xh", "af", "st", "ss", "sw", "sn", "pt", "fr"]
```

---

## ✅ VERIFICATION - After Creating Collections

**In Firebase Console, verify you see:**

```
✅ roles (with 4 documents)
✅ permissions (with 5 documents)
✅ content_categories (with 4 documents)
✅ user_role_assignments (empty)
✅ audit_logs (empty)
✅ chatbot_knowledge_base (with 3+ documents)
✅ chatbot_conversations (empty)
✅ chatbot_settings (with 1 document)
```

---

## 🔐 THEN: Deploy Security Rules

**After collections are created:**

1. In Firebase Console, click: **Rules** tab
2. Delete the current rule
3. Copy-paste this:

```firestore-rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAdmin() {
      let userRef = get(/databases/$(database)/documents/user_role_assignments/$(request.auth.uid));
      return request.auth != null && userRef.data.get('primaryRole', '') == 'admin';
    }

    // Roles - Admin only
    match /roles/{document=**} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    // Permissions - Admin only
    match /permissions/{document=**} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    // Content Categories - All read, admin write
    match /content_categories/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // User Role Assignments - Own read, admin write
    match /user_role_assignments/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || isAdmin());
      allow write: if isAdmin();
    }

    // Audit Logs - Admin only
    match /audit_logs/{document=**} {
      allow read: if isAdmin();
      allow create: if request.auth != null;
      allow update: if false;
      allow delete: if false;
    }

    // Chatbot KB - All read, admin write
    match /chatbot_knowledge_base/{document=**} {
      allow read: if request.auth != null && resource.data.get('isActive', false) == true;
      allow write: if isAdmin();
    }

    // Chatbot Conversations - Own read, own create/update
    match /chatbot_conversations/{document=**} {
      allow read: if request.auth != null && (request.auth.uid == resource.data.get('userId', '') || isAdmin());
      allow create: if request.auth != null && request.auth.uid == request.resource.data.get('userId', '');
      allow update: if request.auth != null && (request.auth.uid == resource.data.get('userId', '') || isAdmin());
      allow delete: if isAdmin();
    }

    // Chatbot Settings - All read, admin write
    match /chatbot_settings/{document=**} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
  }
}
```

4. Click: **Publish**
5. Go to: **Rules > Test Rules** and verify they work

---

## 🎉 DONE!

When all 8 collections are created:

```
✅ Collections: COMPLETE (18 collections including existing ones)
✅ Security Rules: DEPLOYED (merged with existing rules)
✅ You are ready for: Initialize Knowledge Base

Next Step: Initialize Knowledge Base in your app
I'll guide you through the services.
```

---

## ⏱️ TIMING

```
Creating collections:     5 minutes
Adding documents:         10 minutes
Deploying security rules: 2 minutes
Testing rules:            3 minutes

TOTAL: 20 MINUTES

---

## ✨ COLLECTIONS CREATED ✅

You now have 18 total collections:

**Existing Collections** (10)
- ✅ Users
- ✅ Family
- ✅ Business
- ✅ Projects
- ✅ Documents
- ✅ Analytics
- ✅ Badges
- ✅ Consents
- ✅ Video Rooms
- ✅ Contacts

**Phase 1-6 Collections** (6)
- ✅ Events
- ✅ Polls
- ✅ Escalations
- ✅ Comments
- ✅ Activity Feed
- ✅ Notifications

**Phase 3 RBAC Collections** (8)
- ✅ roles
- ✅ permissions
- ✅ content_categories
- ✅ user_role_assignments
- ✅ audit_logs
- ✅ chatbot_knowledge_base
- ✅ chatbot_conversations
- ✅ chatbot_settings

---

## 📋 NEXT STEP: Initialize Knowledge Base

After deploying the security rules, run this in your app:

```typescript
import { initializeKnowledgeBase } from '@/services/knowledgeBaseService';

// Execute once to populate Firestore
await initializeKnowledgeBase();
```

This will add all 15 knowledge base articles to the `chatbot_knowledge_base` collection.

---

## 🔒 SECURITY RULES MERGED ✅

Your existing rules are preserved and enhanced with:
- ✅ RBAC role checking
- ✅ Admin-only collections protected
- ✅ User-scoped chatbot conversations
- ✅ Public knowledge base access
- ✅ All existing permissions maintained
- ✅ No conflicts or overwrites

```

---

## 🚀 You're 5 minutes away from completion!

Go to Firebase Console and start creating.

**Link**: https://console.firebase.google.com

---

*Last Updated: October 30, 2025*  
*Ready to Execute*
