**SPRINT 4B: NOTIFICATIONS HUB - DETAILED PLANNING**
**October 25, 2025**

---

## 🎯 **SPRINT OBJECTIVES**

Build comprehensive notification system:
1. ✅ **NotificationService** - Core notification CRUD & queries
2. ✅ **NotificationCenter Component** - UI for viewing notifications
3. ✅ **AlertSystem** - Smart alert generation (critical, reminders, digests)
4. ✅ **NotificationPreferences** - User notification settings

**Timeline**: 4-5 hours
**Deliverables**: 4 new files, 2 modified files, Firestore rules updated
**Status**: Ready to build

---

## 📋 **DETAILED TASK BREAKDOWN**

### **TASK 1: NotificationService (1.5 hours, 450 lines)**

**File**: `src/services/NotificationService.ts`

**Purpose**: Core notification management with CRUD, filtering, and real-time subscriptions

**Methods**:
```typescript
class NotificationService {
  // CRUD Operations
  createNotification(userId: string, input: CreateNotificationInput): Promise<ApiResponse<Notification>>
  getNotification(userId: string, notificationId: string): Promise<ApiResponse<Notification>>
  updateNotification(userId: string, notificationId: string, updates: UpdateNotificationInput): Promise<ApiResponse<Notification>>
  deleteNotification(userId: string, notificationId: string): Promise<ApiResponse<void>>
  markAsRead(userId: string, notificationId: string): Promise<ApiResponse<void>>
  markAsUnread(userId: string, notificationId: string): Promise<ApiResponse<void>>
  markAllAsRead(userId: string): Promise<ApiResponse<void>>
  
  // Queries
  getNotifications(userId: string, filters: NotificationFilters, pagination: PaginationOptions): Promise<ApiResponse<PaginatedResult<Notification>>>
  getUnreadCount(userId: string): Promise<ApiResponse<number>>
  getNotificationsByType(userId: string, type: NotificationType): Promise<ApiResponse<Notification[]>>
  
  // Real-time
  subscribeToNotifications(userId: string, onUpdate: (notifications: Notification[]) => void): () => void
  subscribeToUnreadCount(userId: string, onUpdate: (count: number) => void): () => void
  
  // Batch Operations
  deleteOlderThan(userId: string, days: number): Promise<ApiResponse<void>>
  archiveNotifications(userId: string, notificationIds: string[]): Promise<ApiResponse<void>>
}
```

**Types**:
```typescript
type NotificationType = 'critical' | 'reminder' | 'digest' | 'activity' | 'mention' | 'system';

enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: Timestamp;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
  relatedEventId?: string;
  relatedUserId?: string;
}

interface CreateNotificationInput {
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  data?: Record<string, any>;
  expiresIn?: number; // hours
  relatedEventId?: string;
  relatedUserId?: string;
}
```

**Firestore**:
- Collection: `notifications`
- Indexes:
  - userId, createdAt (desc)
  - userId, read, createdAt (desc)
  - userId, type, createdAt (desc)
  - userId, priority, createdAt (desc)

---

### **TASK 2: AlertSystem (1 hour, 350 lines)**

**File**: `src/services/AlertSystem.ts`

**Purpose**: Intelligent alert generation based on events and rules

**Methods**:
```typescript
class AlertSystem {
  // Critical alerts (incidents)
  generateCriticalAlert(userId: string, eventId: string, incident: IncidentData): Promise<void>
  
  // Reminder alerts
  generateReminderAlert(userId: string, eventId: string, reminder: Reminder): Promise<void>
  
  // Activity notifications
  generateActivityNotification(userId: string, eventId: string, activity: ActivityData): Promise<void>
  
  // Digest notifications
  generateDailyDigest(userId: string): Promise<void>
  generateWeeklyDigest(userId: string): Promise<void>
  
  // Escalation alerts
  generateEscalationAlert(userId: string, eventId: string, escalation: EscalationEntry): Promise<void>
  
  // Mention/tag alerts
  generateMentionAlert(userId: string, mentionedBy: string, context: string): Promise<void>
  
  // System alerts
  generateSystemAlert(title: string, message: string, priority: NotificationPriority): Promise<void>
}
```

**Features**:
- ✅ Priority-based alert generation
- ✅ Event-triggered notifications
- ✅ Scheduled digest generation
- ✅ Escalation tracking
- ✅ Mention notifications
- ✅ System-wide alerts

**Alert Rules**:
- CRITICAL: High/CRITICAL incidents → immediate alert
- REMINDER: Event reminders → scheduled alert
- ACTIVITY: New activities → digest (configurable)
- ESCALATION: Incident escalation → high priority alert
- MENTION: User mentioned → immediate alert
- DIGEST: Daily/weekly summary → scheduled

---

### **TASK 3: NotificationCenter Component (1 hour, 400 lines)**

**File**: `src/components/notifications/NotificationCenter.tsx`

**Purpose**: UI for viewing and managing notifications

**Features**:
- ✅ Paginated notification list
- ✅ Filter by type/priority/read status
- ✅ Mark as read/unread
- ✅ Delete notifications
- ✅ Batch actions (mark all read, delete old)
- ✅ Real-time updates
- ✅ Notification detail modal
- ✅ Action buttons (click to navigate)
- ✅ Unread count badge
- ✅ Empty state message

**Props**:
```typescript
interface NotificationCenterProps {
  userId: string;
  onNotificationClick?: (notification: Notification) => void;
  maxItems?: number;
  autoRefresh?: boolean;
}
```

**Layout**:
```
┌─ NotificationCenter ─────────────────────┐
│ Title: Notifications                      │
│ Filters: [All] [Critical] [Reminders]    │
│ Sort: [Newest First] [Mark All Read]     │
├──────────────────────────────────────────┤
│ 🔴 CRITICAL: Incident Escalated          │
│    Family incident needs attention       │
│    [Just now] [Mark Read] [x Delete]     │
│                                          │
│ 🟡 REMINDER: Event in 1 Hour             │
│    Meeting with team at 3 PM             │
│    [1 hour ago] [Mark Read] [x Delete]   │
│                                          │
│ ⚪ ACTIVITY: New event created           │
│    John created team event               │
│    [2 hours ago] [Mark Read] [x Delete]  │
├──────────────────────────────────────────┤
│ [← Previous] Page 1 of 3 [Next →]        │
│ Showing 10 of 45 notifications           │
└──────────────────────────────────────────┘
```

---

### **TASK 4: NotificationPreferences Component (0.5 hours, 250 lines)**

**File**: `src/components/settings/NotificationPreferences.tsx`

**Purpose**: User notification settings and preferences

**Features**:
- ✅ Notification channel selection (in-app, email, browser)
- ✅ Notification type toggles (critical, reminders, activity, etc.)
- ✅ Frequency settings (immediate, hourly, daily, weekly)
- ✅ Quiet hours configuration (don't notify 11 PM - 8 AM)
- ✅ Digest preferences (daily/weekly/none)
- ✅ Priority filter (show all, important only)
- ✅ Save/Reset buttons
- ✅ Real-time preference updates

**Settings Structure**:
```typescript
interface NotificationPreferences {
  userId: string;
  
  // Channels
  channels: {
    inApp: boolean;
    email: boolean;
    browser: boolean;
    sms?: boolean;
  };
  
  // Types
  types: {
    critical: boolean;
    reminders: boolean;
    activity: boolean;
    mentions: boolean;
    system: boolean;
    digest: boolean;
  };
  
  // Frequency
  frequency: {
    critical: 'immediate';
    reminders: 'immediate' | 'hourly' | 'daily';
    activity: 'immediate' | 'hourly' | 'daily' | 'weekly';
    digest: 'daily' | 'weekly' | 'never';
  };
  
  // Quiet hours
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:MM
    endTime: string;   // HH:MM
  };
  
  // Digest settings
  digestSettings: {
    sendDigest: boolean;
    digestDay: 'daily' | 'weekly';
    digestTime: string; // HH:MM
    includeAllActivity: boolean;
  };
  
  // Filters
  filters: {
    priorityFilter: 'all' | 'important' | 'critical';
    contextFilter?: ContextLevel[];
  };
  
  updatedAt: Timestamp;
}
```

---

### **TASK 5: Update Firestore Rules (0.5 hours)**

**File**: `firestore.rules` (Modified)

**Changes**:
```firestore
match /notifications/{notificationId} {
  allow read: if request.auth != null && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null;
  allow update: if request.auth != null && request.auth.uid == resource.data.userId;
  allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
}

match /notificationPreferences/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

---

### **TASK 6: Integrate with Calendar Page (0.5 hours)**

**File**: `src/pages/intranet/calendar-v2.tsx` (Modified)

**Changes**:
1. Import NotificationCenter component
2. Add notification triggers for calendar events
3. Display unread notification count
4. Connect AlertSystem for event-triggered alerts

---

### **TASK 7: Build & Deploy (0.5 hours)**

**Steps**:
1. npm run build (verify 0 errors)
2. firebase deploy --only firestore:rules
3. firebase deploy --only hosting
4. Verify on staging URL

---

## 📊 **FILES SUMMARY**

### New Files
1. `src/services/NotificationService.ts` - 450 lines
2. `src/services/AlertSystem.ts` - 350 lines
3. `src/components/notifications/NotificationCenter.tsx` - 400 lines
4. `src/components/settings/NotificationPreferences.tsx` - 250 lines

### Modified Files
1. `firestore.rules` - Add 2 collections
2. `src/pages/intranet/calendar-v2.tsx` - Connect alerts

### Total New Code
- Lines: 1,450+
- Services: 2
- Components: 2
- Collections: 2
- Type Definitions: 8+

---

## 🔧 **TECHNICAL DETAILS**

### Real-time Subscriptions
- `subscribeToNotifications()` - All notifications
- `subscribeToUnreadCount()` - Just the count badge
- Efficient filtering with Firestore indexes

### Smart Alerts
- Alert generated automatically when:
  - Incident created (CRITICAL priority)
  - Event reminder due (REMINDER priority)
  - Event escalated (HIGH priority)
  - User mentioned (MEDIUM priority)
  - Daily digest time reached (LOW priority)

### Digest Strategy
- Daily digest: Summary of day's events
- Weekly digest: Summary of week's events
- Includes only unread notifications from period
- Sent at user's preferred time
- Can be disabled per user

### Performance Optimization
- Pagination (10 items per page default)
- Index on userId, createdAt
- Separate index for read status
- Lazy-load notification detail
- Badge shows unread count (lightweight)

---

## ✅ **VALIDATION CHECKLIST**

Before deployment:
- [ ] All TypeScript: 0 errors
- [ ] NotificationService methods tested (locally)
- [ ] AlertSystem generates correct alerts
- [ ] NotificationCenter renders correctly
- [ ] Preferences persist to Firestore
- [ ] Real-time subscriptions work
- [ ] Firestore rules allow/deny correctly
- [ ] Build succeeds: `npm run build`
- [ ] No linting warnings
- [ ] Calendar page alerts working

---

## 🚀 **SUCCESS CRITERIA**

Sprint 4B Complete when:
1. ✅ NotificationService fully implemented (450+ lines, 0 errors)
2. ✅ AlertSystem fully implemented (350+ lines, 0 errors)
3. ✅ NotificationCenter component working (400+ lines, 0 errors)
4. ✅ NotificationPreferences component working (250+ lines, 0 errors)
5. ✅ Firestore rules deployed for 2 new collections
6. ✅ Calendar-v2 integrated with alert system
7. ✅ Build: 0 errors
8. ✅ Deploy to staging
9. ✅ Notifications appear in real-time
10. ✅ Preferences persist and apply correctly

---

## 📝 **NEXT STEPS**

After Sprint 4B approval:
1. Build NotificationService
2. Build AlertSystem
3. Build NotificationCenter component
4. Build NotificationPreferences component
5. Update Firestore rules
6. Integrate with calendar page
7. Build & Deploy
8. Create completion report
9. Move to Sprint 4C

---

**Ready to start Sprint 4B? Let's build! 🚀**
