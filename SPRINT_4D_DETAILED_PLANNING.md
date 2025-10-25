**SPRINT 4D: COLLABORATIVE FEATURES - DETAILED PLANNING**
**October 25, 2025**

---

## 🎯 **SPRINT OBJECTIVES**

Build real-time collaboration engine for family/business events:
1. ✅ **CollaborationService** - Core collaboration logic
2. ✅ **CommentsComponent** - Thread-based commenting
3. ✅ **PresenceTracker** - Real-time user presence
4. ✅ **DocumentSharing** - File upload & sharing
5. ✅ **PermissionManager** - Access control
6. ✅ **Firestore Rules** - Collaboration security
7. ✅ **Integration** - Connect with calendar & events

**Timeline**: 4-6 hours
**Deliverables**: 5 new files, 2 modified files, Firestore rules updated
**Status**: Ready to build

---

## 📋 **DETAILED TASK BREAKDOWN**

### **TASK 1: CollaborationService (1.5 hours, 450 lines)**

**File**: `src/services/CollaborationService.ts`

**Purpose**: Core collaboration engine with real-time subscriptions

**Methods**:
```typescript
class CollaborationService {
  // Comments
  addComment(eventId, userId, text): Promise<Comment>
  getComments(eventId, pagination): Promise<PaginatedComments>
  updateComment(commentId, text): Promise<Comment>
  deleteComment(commentId): Promise<void>
  subscribeToComments(eventId, onUpdate): Unsubscribe
  
  // Reactions
  addReaction(commentId, userId, emoji): Promise<Reaction>
  removeReaction(commentId, userId): Promise<void>
  getReactions(commentId): Promise<Reaction[]>
  
  // Presence
  setUserPresence(eventId, userId, status): Promise<void>
  getUsersPresence(eventId): Promise<PresenceInfo[]>
  subscribeToPresence(eventId, onUpdate): Unsubscribe
  
  // Collaboration Metadata
  getCollaborators(eventId): Promise<User[]>
  addCollaborator(eventId, userId): Promise<void>
  removeCollaborator(eventId, userId): Promise<void>
  
  // Activity Log
  logActivity(eventId, activity): Promise<void>
  getActivityLog(eventId): Promise<Activity[]>
  subscribeToActivity(eventId, onUpdate): Unsubscribe
}
```

**Types**:
```typescript
interface Comment {
  id: string;
  eventId: string;
  userId: string;
  author: User;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  reactions: Reaction[];
  replies: Comment[];
  threadId?: string;
  status: 'active' | 'edited' | 'deleted';
}

interface Reaction {
  id: string;
  userId: string;
  emoji: string;
  timestamp: Date;
}

interface PresenceInfo {
  userId: string;
  userName: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: Date;
  currentPage?: string;
}

interface Activity {
  id: string;
  userId: string;
  type: 'comment' | 'edit' | 'share' | 'permission' | 'presence';
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
```

**Features**:
- ✅ Real-time comment threading
- ✅ Emoji reactions
- ✅ User presence tracking
- ✅ Activity logging
- ✅ Pagination support
- ✅ Soft deletes for audit trail

---

### **TASK 2: CommentsComponent (1 hour, 380 lines)**

**File**: `src/components/collaboration/CommentsComponent.tsx`

**Purpose**: Rich comment UI with threading and reactions

**Features**:
```typescript
interface CommentsProps {
  eventId: string;
  userId: string;
  maxDepth?: number;
  allowAnonymous?: boolean;
}

// Display
- Comment list with avatars
- User names and timestamps
- Relative time formatting
- Threaded replies (collapsible)
- Soft-deleted indicators
- Rich text formatting preview

// Interactions
- Add comment form
- Edit/Delete buttons (owner only)
- Reply to comment
- Add emoji reactions
- Reaction count display
- Mention support (@username)
- Markdown preview

// Real-time
- Live comment streams
- Typing indicators (optional)
- Presence avatars
- Activity feed
```

**Layout**:
```
┌─ Comments (42) ────────────────────┐
│                                    │
│ [Your Avatar] You                  │
│ [Comment Input Box]      [Send]    │
│                                    │
│ ─────────────────────────────────  │
│                                    │
│ [User Avatar] Alice @ 2:30 PM      │
│ "Great event setup! Looking..."    │
│ 👍 3  🎉 2  ❤️ 1   [Reply]        │
│                                    │
│ ├─ [User Avatar] Bob @ 2:32 PM    │
│ │  "Thanks! See you there"        │
│ │  👍 1                            │
│ │                                  │
│ └─ [User Avatar] Charlie @ 2:33   │
│    "Count me in!"                  │
│    👍 2  [Reply]                   │
│                                    │
│ [User Avatar] Diana @ 2:45 PM      │
│ "Can we change the time?"          │
│ 🤔 1  [Reply]                      │
│                                    │
│ [Load More] (3 earlier comments)   │
└────────────────────────────────────┘
```

**Features**:
- ✅ Threaded comment display
- ✅ Emoji reactions
- ✅ Reply indentation
- ✅ User avatars
- ✅ Timestamp display
- ✅ Edit/Delete UI
- ✅ Pagination support
- ✅ Real-time updates
- ✅ Responsive layout

---

### **TASK 3: PresenceTracker Component (0.75 hours, 220 lines)**

**File**: `src/components/collaboration/PresenceTracker.tsx`

**Purpose**: Real-time user presence visualization

**Features**:
```typescript
interface PresenceTrackerProps {
  eventId: string;
  currentUserId: string;
  maxDisplayed?: number;
}

// Display
- Active user avatars with status indicators
- Green/yellow/gray status dots
- User names on hover
- "X more viewing" text
- Activity indicators
- Join/Leave notifications

// Integration
- Auto-update on presence changes
- Keyboard activity detection
- Window focus detection
- Idle timeout handling
- Graceful disconnect handling
```

**Layout**:
```
┌─ 5 people viewing ─────────────────┐
│ [A] [B] [C] [D] [+3]               │
│  ●   ●   ●  ◐                      │
│ Alice is viewing...                │
└────────────────────────────────────┘
```

---

### **TASK 4: DocumentSharing Component (1 hour, 290 lines)**

**File**: `src/components/collaboration/DocumentSharing.tsx`

**Purpose**: File upload and sharing UI

**Features**:
```typescript
interface DocumentSharingProps {
  eventId: string;
  userId: string;
  maxFileSize?: number;
  allowedTypes?: string[];
}

// Upload
- Drag-and-drop zone
- File select button
- Progress indicator
- Multiple file support
- Size validation
- Type filtering

// Display
- Document list with icons
- File names and sizes
- Uploader info
- Upload timestamps
- Download buttons
- Delete buttons (owner)
- Share indicators

// Sharing
- Copy share link
- Public/Private toggle
- Permission levels
- Access history
```

**Layout**:
```
┌─ Shared Documents ─────────────────┐
│ [Drag files here or click]          │
│                                    │
│ 📄 meeting-notes.pdf   2.3 MB      │
│    Uploaded by Alice • 2 hours ago  │
│    [Download] [Delete] [Share]     │
│                                    │
│ 🖼️ event-photo.jpg      1.1 MB    │
│    Uploaded by Bob • 30 mins ago    │
│    [Download] [Delete] [Share]     │
│                                    │
│ 📊 budget-proposal.xlsx  456 KB    │
│    Uploaded by Carol • 1 hour ago   │
│    [Download] [Delete] [Share]     │
└────────────────────────────────────┘
```

---

### **TASK 5: PermissionManager Service (1 hour, 280 lines)**

**File**: `src/services/PermissionManager.ts`

**Purpose**: Fine-grained access control for collaborative resources

**Methods**:
```typescript
class PermissionManager {
  // Permission Management
  grantPermission(eventId, userId, role): Promise<void>
  revokePermission(eventId, userId): Promise<void>
  updatePermission(eventId, userId, role): Promise<void>
  
  // Role Management
  createRole(eventId, roleName, permissions): Promise<Role>
  deleteRole(eventId, roleId): Promise<void>
  
  // Permission Checking
  canView(userId, eventId): Promise<boolean>
  canEdit(userId, eventId): Promise<boolean>
  canDelete(userId, eventId): Promise<boolean>
  canShare(userId, eventId): Promise<boolean>
  canManagePermissions(userId, eventId): Promise<boolean>
  
  // Access Audit
  getAccessLog(eventId): Promise<AccessLog[]>
  getUserPermissions(userId, eventId): Promise<Permission[]>
}
```

**Permission Levels**:
- `viewer` - Read-only access
- `editor` - Read + comment + edit own
- `manager` - Full except delete
- `owner` - Full access including delete

---

### **TASK 6: Firestore Rules (0.5 hours)**

**File**: `firestore.rules` (Modified)

**Changes**:
```firestore
match /events/{eventId}/comments/{commentId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null && request.auth.uid in resource.data.allowedUsers;
  allow update: if request.auth != null && request.auth.uid == resource.data.userId;
  allow delete: if request.auth != null && request.auth.uid == resource.data.userId || isOwner(eventId);
}

match /events/{eventId}/presence/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

match /events/{eventId}/documents/{docId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update: if request.auth != null && request.auth.uid == resource.data.uploadedBy;
  allow delete: if request.auth != null && (request.auth.uid == resource.data.uploadedBy || isOwner(eventId));
}

match /events/{eventId}/permissions/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && isOwner(eventId);
}

match /events/{eventId}/activityLog/{logId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow write: if false;
}
```

---

### **TASK 7: Integration (0.75 hours)**

**Files Modified**:
1. `src/pages/intranet/calendar-v2.tsx` - Add CommentsComponent
2. `src/components/calendar/EventDetail.tsx` - Add collaboration UI

**Changes**:
- Import CollaborationService
- Add comments section to event details
- Show presence indicator
- Display shared documents
- Update event with collaboration features

---

## 📊 **FILES SUMMARY**

### New Files
1. `src/services/CollaborationService.ts` - 450 lines
2. `src/components/collaboration/CommentsComponent.tsx` - 380 lines
3. `src/components/collaboration/PresenceTracker.tsx` - 220 lines
4. `src/components/collaboration/DocumentSharing.tsx` - 290 lines
5. `src/services/PermissionManager.ts` - 280 lines

### Modified Files
1. `firestore.rules` - Add 40 lines (5 collections)
2. `src/pages/intranet/calendar-v2.tsx` - Add integration (20 lines)
3. `src/components/calendar/EventDetail.tsx` - Add UI (15 lines)

### Total New Code
- Lines: 1,620+
- Services: 2
- Components: 3
- Type Definitions: 12+

---

## 🔧 **TECHNICAL DETAILS**

### Real-Time Architecture
- **Firestore Listeners**: Comments, presence, activity
- **Batch Operations**: Bulk permission updates
- **Indexed Queries**: Fast comment retrieval
- **Pagination**: Efficient large datasets

### Performance Considerations
- Lazy-load comment threads
- Debounce presence updates
- Cache permission checks
- Stream large document lists

### Security Model
- User-scoped presence data
- Event-level permission checks
- Comment ownership validation
- Activity audit trail

---

## ✅ **VALIDATION CHECKLIST**

Before deployment:
- [ ] All TypeScript: 0 errors
- [ ] All services tested
- [ ] Components render correctly
- [ ] Real-time subscriptions working
- [ ] Permission checks validated
- [ ] Firestore rules allow/deny correctly
- [ ] Build succeeds: `npm run build`
- [ ] No linting warnings
- [ ] Calendar integration complete

---

## 🚀 **SUCCESS CRITERIA**

Sprint 4D Complete when:
1. ✅ CollaborationService fully implemented (450+ lines, 0 errors)
2. ✅ CommentsComponent fully implemented (380+ lines, 0 errors)
3. ✅ PresenceTracker working (220+ lines, 0 errors)
4. ✅ DocumentSharing working (290+ lines, 0 errors)
5. ✅ PermissionManager working (280+ lines, 0 errors)
6. ✅ Firestore rules deployed for 5 new collections
7. ✅ Calendar-v2 & EventDetail pages integrated
8. ✅ Build: 0 errors
9. ✅ Deploy to staging
10. ✅ Comments display in real-time
11. ✅ Presence tracking working
12. ✅ Document sharing functional

---

## 📝 **NEXT STEPS**

After Sprint 4D approval:
1. Build CollaborationService
2. Build CommentsComponent
3. Build PresenceTracker
4. Build DocumentSharing
5. Build PermissionManager
6. Update Firestore rules
7. Integrate with calendar/events
8. Build & Deploy
9. Create completion report
10. Move to Sprint 4E

---

**Ready to start Sprint 4D? Let's build! 🚀**
