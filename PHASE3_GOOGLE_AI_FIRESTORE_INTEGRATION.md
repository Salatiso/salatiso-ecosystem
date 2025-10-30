# Phase 3: Google AI + Firebase Integration Plan

**Status**: 🔄 IN PROGRESS - Firestore Collections Setup  
**Date**: October 30, 2025  
**API**: Google Gemini (Vertex AI) + Firebase Firestore  

---

## ✅ FIRESTORE COLLECTIONS - YOUR PHASE 3 FOUNDATION

### 5 Required Collections for Phase 3

```
Firebase Project Root
│
├─ roles (Collection)
│  └─ Role documents (Family, Child, License, Admin)
│
├─ permissions (Collection)
│  └─ Permission rule documents
│
├─ content_categories (Collection)
│  └─ Content category definitions
│
├─ user_role_assignments (Collection)
│  └─ User-to-role mappings
│
├─ audit_logs (Collection)
│  └─ System audit trail
│
├─ chatbot_knowledge_base (Collection) ⭐ NEW
│  └─ Knowledge articles & FAQs
│
├─ chatbot_conversations (Collection) ⭐ NEW
│  └─ User conversation history
│
└─ chatbot_settings (Collection) ⭐ NEW
   └─ Chatbot configuration & response templates
```

---

## 📊 COLLECTION SCHEMAS - FIRESTORE STRUCTURE

### 1. `roles` Collection

```typescript
// Document: "family", "child", "license", "admin"

{
  id: "family",
  name: "Family Account",
  description: "Full access for parents/adults",
  priority: 3,
  permissions: ["view_all", "create_content", "manage_kids", "invite_users"],
  ageRange: null,
  contentAccess: "all",
  maxUsers: 10,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

{
  id: "child",
  name: "Child Account",
  description: "Age-gated content access for children",
  priority: 1,
  permissions: ["view_kids_content", "learn"],
  ageRange: { min: 6, max: 17 },
  contentAccess: "kids_only",
  maxUsers: 1,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

{
  id: "license",
  name: "License Account",
  description: "Commercial/organizational license",
  priority: 2,
  permissions: ["view_all", "create_content", "export_data", "advanced_features"],
  ageRange: null,
  contentAccess: "all",
  maxUsers: 100,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

{
  id: "admin",
  name: "Administrator",
  description: "System administrator (Salatiso)",
  priority: 4,
  permissions: ["*"], // All permissions
  ageRange: null,
  contentAccess: "all",
  maxUsers: 1,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 2. `permissions` Collection

```typescript
// Documents: One per permission type

{
  id: "view_all",
  name: "View All Content",
  description: "Access to all content types",
  category: "content",
  requiresApproval: false,
  appliesTo: ["family", "license", "admin"]
}

{
  id: "create_content",
  name: "Create Content",
  description: "Ability to create new content",
  category: "content",
  requiresApproval: true,
  appliesTo: ["family", "license", "admin"]
}

{
  id: "view_kids_content",
  name: "View Kids Content",
  description: "Access to age-appropriate content",
  category: "content",
  requiresApproval: false,
  appliesTo: ["child"]
}

{
  id: "manage_kids",
  name: "Manage Child Accounts",
  description: "Create and manage child profiles",
  category: "admin",
  requiresApproval: true,
  appliesTo: ["family", "admin"]
}

{
  id: "export_data",
  name: "Export Data",
  description: "Export system data",
  category: "data",
  requiresApproval: true,
  appliesTo: ["license", "admin"]
}
```

### 3. `content_categories` Collection

```typescript
// Documents: One per content category

{
  id: "kids_educational",
  name: "Kids Educational",
  description: "Educational content for children",
  ageRange: { min: 6, max: 12 },
  accessRoles: ["child", "family", "admin"],
  isPublic: false,
  requiresParentalConsent: true,
  createdAt: Timestamp
}

{
  id: "kids_entertainment",
  name: "Kids Entertainment",
  description: "Entertainment for children",
  ageRange: { min: 6, max: 17 },
  accessRoles: ["child", "family", "admin"],
  isPublic: false,
  requiresParentalConsent: true,
  createdAt: Timestamp
}

{
  id: "business_tools",
  name: "Business Tools",
  description: "Professional business tools",
  ageRange: { min: 18, max: null },
  accessRoles: ["family", "license", "admin"],
  isPublic: false,
  requiresParentalConsent: false,
  createdAt: Timestamp
}

{
  id: "public_information",
  name: "Public Information",
  description: "Publicly available information",
  ageRange: null,
  accessRoles: ["*"], // All users
  isPublic: true,
  requiresParentalConsent: false,
  createdAt: Timestamp
}
```

### 4. `user_role_assignments` Collection

```typescript
// Document ID: {userId}

{
  userId: "user_12345",
  email: "parent@example.com",
  primaryRole: "family",
  assignedRoles: ["family"],
  roleAssignments: {
    family: {
      assignedAt: Timestamp,
      assignedBy: "admin_user",
      expiresAt: null,
      metadata: { reason: "Primary account holder" }
    }
  },
  ageGroup: null,
  permissions: ["view_all", "create_content", "manage_kids", "invite_users"],
  lastModified: Timestamp,
  modifiedBy: "admin_user",
  status: "active"
}

{
  userId: "user_12345_child1",
  email: null, // Children may not have email
  parentId: "user_12345",
  primaryRole: "child",
  assignedRoles: ["child"],
  roleAssignments: {
    child: {
      assignedAt: Timestamp,
      assignedBy: "user_12345",
      expiresAt: null,
      metadata: { birthDate: "2015-05-10", autoAssigned: true }
    }
  },
  ageGroup: "6-12",
  permissions: ["view_kids_content", "learn"],
  lastModified: Timestamp,
  modifiedBy: "user_12345",
  status: "active"
}

{
  userId: "org_company123",
  email: "org@company.com",
  primaryRole: "license",
  assignedRoles: ["license"],
  roleAssignments: {
    license: {
      assignedAt: Timestamp,
      assignedBy: "admin_user",
      expiresAt: Timestamp, // License expiration date
      metadata: { licenseKey: "LIC-XXXX", licenseTier: "professional" }
    }
  },
  ageGroup: null,
  permissions: ["view_all", "create_content", "export_data", "advanced_features"],
  lastModified: Timestamp,
  modifiedBy: "admin_user",
  status: "active"
}
```

### 5. `audit_logs` Collection

```typescript
// Document ID: Auto-generated

{
  id: "audit_001",
  timestamp: Timestamp,
  userId: "user_12345",
  action: "role_assignment_changed",
  actionType: "admin", // admin, user, system
  target: "user_child_001",
  changes: {
    before: { roles: ["child"] },
    after: { roles: ["child", "family"] }
  },
  status: "success", // success, failure, pending
  errorMessage: null,
  metadata: {
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
    sessionId: "sess_xxx"
  },
  createdAt: Timestamp
}

{
  id: "audit_002",
  timestamp: Timestamp,
  userId: "user_12345",
  action: "permission_check",
  actionType: "system",
  target: "view_kids_content",
  changes: null,
  status: "success",
  errorMessage: null,
  metadata: {
    allowed: true,
    userRole: "family",
    contentCategory: "kids_educational"
  },
  createdAt: Timestamp
}
```

### 6. `chatbot_knowledge_base` Collection ⭐ GOOGLE AI SPECIFIC

```typescript
// Document ID: Auto-generated

{
  id: "kb_001",
  title: "Getting Started with MNI",
  category: "onboarding",
  subcategory: "first_steps",
  content: "Welcome to MNI! Here's how to get started...",
  contentMarkdown: "# Getting Started\n\n...",
  keywords: ["start", "begin", "new", "account"],
  aiEmbeddings: null, // Will be generated by Gemini
  contentType: "article", // article, faq, guide, tutorial
  relatedTopics: ["account_setup", "creating_profiles"],
  author: "admin_user",
  version: 1,
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  accessLevel: "public",
  targetAudience: ["family", "child", "license", "admin"],
  language: "en"
}

{
  id: "kb_002",
  title: "Managing Child Accounts",
  category: "account",
  subcategory: "child_management",
  content: "Learn how to create and manage child accounts...",
  contentMarkdown: "# Managing Child Accounts\n\n...",
  keywords: ["child", "kids", "account", "parental", "control"],
  aiEmbeddings: null,
  contentType: "guide",
  relatedTopics: ["age_gating", "parental_controls", "permissions"],
  author: "admin_user",
  version: 1,
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  accessLevel: "restricted",
  targetAudience: ["family", "admin"],
  language: "en"
}

{
  id: "kb_003",
  title: "What can I do in Kids Content?",
  category: "kids",
  subcategory: "content_access",
  content: "As a child user, you have access to...",
  contentMarkdown: "# What I Can Do\n\n...",
  keywords: ["kids", "content", "can", "access", "do"],
  aiEmbeddings: null,
  contentType: "faq",
  relatedTopics: ["content_categories", "learning_paths"],
  author: "admin_user",
  version: 1,
  isActive: true,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  accessLevel: "public",
  targetAudience: ["child"],
  language: "en"
}
```

### 7. `chatbot_conversations` Collection ⭐ GOOGLE AI SPECIFIC

```typescript
// Document ID: Auto-generated

{
  id: "conv_001",
  userId: "user_12345",
  startTime: Timestamp,
  endTime: null,
  status: "active", // active, closed, archived
  topic: "account_setup",
  messages: [
    {
      id: "msg_001",
      role: "user", // user, assistant
      content: "How do I create a child account?",
      timestamp: Timestamp,
      contentType: "text"
    },
    {
      id: "msg_002",
      role: "assistant",
      content: "To create a child account, follow these steps...",
      timestamp: Timestamp,
      contentType: "text",
      sources: ["kb_001", "kb_002"], // Knowledge base references
      confidence: 0.95
    }
  ],
  messageCount: 2,
  resolvedAt: null,
  resolvedStatus: null, // resolved, escalated, abandoned
  satisfaction: null,
  metadata: {
    userRole: "family",
    language: "en",
    device: "web",
    ipAddress: "192.168.1.1"
  },
  createdAt: Timestamp,
  lastModified: Timestamp
}

{
  id: "conv_002",
  userId: "user_12345_child1",
  startTime: Timestamp,
  endTime: Timestamp,
  status: "closed",
  topic: "content_access",
  messages: [
    {
      id: "msg_003",
      role: "user",
      content: "What games can I play?",
      timestamp: Timestamp,
      contentType: "text"
    },
    {
      id: "msg_004",
      role: "assistant",
      content: "Based on your age, you can access these educational games...",
      timestamp: Timestamp,
      contentType: "text",
      sources: ["kb_003"],
      confidence: 0.88
    }
  ],
  messageCount: 2,
  resolvedAt: Timestamp,
  resolvedStatus: "resolved",
  satisfaction: 5,
  metadata: {
    userRole: "child",
    language: "en",
    device: "mobile",
    ipAddress: "192.168.1.2"
  },
  createdAt: Timestamp,
  lastModified: Timestamp
}
```

### 8. `chatbot_settings` Collection ⭐ GOOGLE AI SPECIFIC

```typescript
// Document ID: "global_settings"

{
  id: "global_settings",
  geminiApiKey: null, // Set in Cloud Functions (never in Firestore!)
  geminiModel: "gemini-pro", // Google's latest model
  maxTokensPerResponse: 1024,
  temperature: 0.7, // 0 = deterministic, 1 = creative
  topP: 0.95,
  topK: 40,
  
  systemPrompt: `You are MNI Assistant, a helpful guide for the MNI platform...`,
  
  responseTemplates: {
    greeting: "Hello! I'm here to help with questions about MNI. What can I assist you with?",
    farewell: "Thank you for chatting with me! Feel free to reach out anytime.",
    notUnderstand: "I'm not sure I understood that. Could you rephrase your question?",
    escalation: "I think this might be best handled by our support team. Let me connect you..."
  },
  
  knowledgeBaseSettings: {
    enableAutoIndexing: true,
    autoIndexInterval: 3600, // seconds
    maxDocumentsPerQuery: 5,
    relevanceThreshold: 0.7
  },
  
  conversationSettings: {
    maxMessagesPerSession: 50,
    sessionTimeoutMinutes: 30,
    retainHistoryDays: 90,
    enableFeedback: true
  },
  
  analyticsSettings: {
    trackInteractions: true,
    trackSatisfaction: true,
    trackResolutions: true,
    trackEscalations: true
  },
  
  rateLimiting: {
    enabled: true,
    requestsPerMinute: 10,
    requestsPerHour: 100,
    requestsPerDay: 1000
  },
  
  languages: ["en", "zu", "xh", "af", "st", "ss", "sw", "sn", "pt", "fr"],
  
  lastUpdated: Timestamp,
  updatedBy: "admin_user"
}
```

---

## 🎯 YOUR FIRESTORE SETUP CHECKLIST

### ✅ Collections to Create in Firebase Console

```
In Firebase Console > Firestore Database:

☐ Create Collection: roles
   └─ Add 4 documents (family, child, license, admin)

☐ Create Collection: permissions
   └─ Add 5+ permission documents

☐ Create Collection: content_categories
   └─ Add 4 category documents

☐ Create Collection: user_role_assignments
   └─ Will be auto-populated by your app

☐ Create Collection: audit_logs
   └─ Will be auto-populated by your app

☐ Create Collection: chatbot_knowledge_base
   └─ Add your help articles & FAQs

☐ Create Collection: chatbot_conversations
   └─ Will be auto-populated by conversations

☐ Create Collection: chatbot_settings
   └─ Add single "global_settings" document
```

---

## 🔐 FIREBASE SECURITY RULES FOR PHASE 3

### Recommended Rules (Copy to Firestore Console)

```firestore-rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAdmin() {
      return get(/databases/$(database)/documents/user_role_assignments/$(request.auth.uid)).data.primaryRole == 'admin';
    }
    
    function hasRole(role) {
      return resource.data.get(role, false) == true || 
             get(/databases/$(database)/documents/user_role_assignments/$(request.auth.uid)).data.primaryRole == role;
    }
    
    function isOwner(docUserId) {
      return request.auth.uid == docUserId;
    }

    // ROLES COLLECTION - Admin only
    match /roles/{document=**} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    // PERMISSIONS COLLECTION - Admin only
    match /permissions/{document=**} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    // CONTENT_CATEGORIES COLLECTION - Everyone reads, admin writes
    match /content_categories/{document=**} {
      allow read: if true; // All users can see categories
      allow write: if isAdmin();
    }

    // USER_ROLE_ASSIGNMENTS - Users can read own, admin writes
    match /user_role_assignments/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow write: if isAdmin();
    }

    // AUDIT_LOGS - Admin only, no deletes
    match /audit_logs/{document=**} {
      allow read: if isAdmin();
      allow create: if true; // Anyone can create logs
      allow update: if false;
      allow delete: if false;
    }

    // CHATBOT_KNOWLEDGE_BASE - Everyone reads, admin writes
    match /chatbot_knowledge_base/{document=**} {
      allow read: if resource.data.isActive == true;
      allow write: if isAdmin();
      allow delete: if isAdmin();
    }

    // CHATBOT_CONVERSATIONS - Users can read own, create own
    match /chatbot_conversations/{document=**} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isOwner(request.resource.data.userId);
      allow update: if isOwner(resource.data.userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // CHATBOT_SETTINGS - Everyone reads, admin writes
    match /chatbot_settings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## 🚀 NEXT STEPS - YOUR ACTION ITEMS

### Week 1 - THIS WEEK:

```
TASK 1: Create Collections in Firebase Console ✅ IN PROGRESS
├─ Go to: Firebase Console > Your Project > Firestore Database
├─ Click "Create Collection"
├─ Create 8 collections (listed above)
└─ Add initial documents (roles, permissions, content_categories)

TASK 2: Add Security Rules ✅ READY
├─ Go to: Firestore > Rules
├─ Copy the security rules provided above
├─ Deploy rules
└─ Test with security simulator

TASK 3: Create Service Layer for RBAC (TypeScript)
├─ Services needed:
│  ├─ roleService.ts (role checking)
│  ├─ permissionService.ts (permission validation)
│  ├─ contentFilterService.ts (content visibility)
│  └─ ageRoutingService.ts (age-based routing)
└─ All services use Firestore + caching

TASK 4: Create Google AI Service (TypeScript)
├─ Service: googleAiService.ts (Gemini integration)
├─ Methods needed:
│  ├─ initGemini() - Initialize with API key
│  ├─ searchKnowledgeBase() - Find relevant docs
│  ├─ generateResponse() - Call Gemini API
│  ├─ logConversation() - Save to Firestore
│  └─ getRateLimitStatus() - Rate limit tracking
└─ Use Cloud Functions (not frontend)
```

---

## 📈 CURRENT PROGRESS SUMMARY

```
✅ Firebase Configuration: COMPLETE
   └─ Already configured in src/config/firebase.ts

✅ Firestore Initialized: COMPLETE
   └─ db instance exported and available

✅ Collection Schemas: DESIGNED (This Document)
   └─ 8 collections with full schema definitions

⏳ Collections Creation: IN PROGRESS
   └─ What you're doing NOW in Firebase Console

⏳ Security Rules: READY TO DEPLOY
   └─ Provided above, needs your approval

⏳ Service Layer: NEXT
   └─ Will create TypeScript services

⏳ Google Gemini Integration: NEXT
   └─ Will integrate Google AI API

⏳ Chatbot Components: NEXT
   └─ React components for UI
```

---

## 🎯 WEEK 1-2 DELIVERABLES

By end of Week 2, you will have:

✅ All 8 Firestore collections created  
✅ Initial data in roles, permissions, content_categories  
✅ Security rules deployed  
✅ 4 RBAC service files created + tested  
✅ Google AI service created + tested  
✅ Build passing with 0 errors  

---

## 📞 GOOGLE GEMINI SETUP (Next Step)

**Before you integrate Gemini, you'll need:**

```
1. Google Cloud Project (if you don't have one)
   └─ Same Firebase project can be used

2. Enable Vertex AI API
   └─ In Google Cloud Console

3. Get Gemini API Key
   └─ From Google Cloud Console

4. Store in .env.local
   NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=xxx
   
   Note: We'll use Cloud Functions to keep key secure
   └─ Frontend never sees the actual API key
```

---

## ✨ SUMMARY: What You're Building

**Your Phase 3 with Google AI:**

```
┌─────────────────────────────────────────┐
│      MNI Platform - Phase 3             │
├─────────────────────────────────────────┤
│                                         │
│  ✅ RBAC System (Firebase)              │
│     └─ roles, permissions, audit_logs   │
│                                         │
│  ✅ Age-based Content Routing           │
│     └─ Automatic user redirection       │
│                                         │
│  ✅ Google Gemini Chatbot               │
│     └─ Knowledge base + AI responses    │
│     └─ Seamless Firebase integration    │
│                                         │
│  ✅ Multilingual Support                │
│     └─ 15 languages via i18n            │
│                                         │
└─────────────────────────────────────────┘
```

---

**Status**: 🟢 **READY TO START BUILDING**

**Next Document**: PHASE3_GOOGLE_AI_SERVICE_IMPLEMENTATION.md (coming after collections are created)

---

*Last Updated: October 30, 2025*  
*Firestore Integration: IN PROGRESS*  
*Collections: IN YOUR FIREBASE CONSOLE RIGHT NOW*
