**SPRINT 4A: CALENDAR ENHANCEMENTS - DETAILED PLANNING**
**October 25, 2025**

---

## 🎯 **SPRINT OBJECTIVES**

Add 3 major features to calendar system:
1. ✅ **Event Reminders** - Schedule notifications before events
2. ✅ **Recurring Events** - Repeat events on schedule
3. ✅ **Calendar Export** - Export to iCal and PDF

**Timeline**: 3-4 hours
**Deliverables**: 4 new files, 2 modified files, Firestore rules updated
**Status**: Ready to build

---

## 📋 **DETAILED TASK BREAKDOWN**

### **TASK 1: ReminderService (1 hour)**

**File**: `src/services/ReminderService.ts` (350 lines)

**Purpose**: Manage event reminders and scheduling

**Methods**:
```typescript
class ReminderService {
  // Create reminder
  createReminder(userId: string, eventId: string, reminderTime: number): Promise<ApiResponse<Reminder>>
  
  // Get reminders for event
  getReminders(userId: string, eventId: string): Promise<ApiResponse<Reminder[]>>
  
  // Update reminder
  updateReminder(userId: string, reminderId: string, updates: UpdateReminderInput): Promise<ApiResponse<Reminder>>
  
  // Delete reminder
  deleteReminder(userId: string, reminderId: string): Promise<ApiResponse<void>>
  
  // Subscribe to due reminders
  subscribeToDueReminders(userId: string, onUpdate: (reminders: Reminder[]) => void): () => void
  
  // Mark as notified
  markAsNotified(userId: string, reminderId: string): Promise<ApiResponse<void>>
  
  // Get overdue reminders
  getOverdueReminders(userId: string): Promise<ApiResponse<Reminder[]>>
}
```

**Types**:
```typescript
interface Reminder {
  id: string;
  eventId: string;
  userId: string;
  minutesBefore: number; // 15, 60, 1440, etc.
  notificationSent: boolean;
  notificationSentAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type ReminderTime = 15 | 60 | 360 | 1440 | 10080; // minutes
```

**Firestore**:
- Collection: `reminders`
- Indexes:
  - eventId, userId
  - userId, notificationSent
  - eventId, minutesBefore

---

### **TASK 2: RecurrenceService (1 hour)**

**File**: `src/services/RecurrenceService.ts` (400 lines)

**Purpose**: Generate and manage recurring events

**Methods**:
```typescript
class RecurrenceService {
  // Create recurring pattern
  createRecurrence(pattern: RecurrencePattern): RecurrencePattern
  
  // Generate instances for date range
  generateInstances(
    event: EnhancedCalendarEvent,
    pattern: RecurrencePattern,
    fromDate: Date,
    toDate: Date
  ): EnhancedCalendarEvent[]
  
  // Get all instances of recurring event
  getInstances(userId: string, parentEventId: string): Promise<ApiResponse<EnhancedCalendarEvent[]>>
  
  // Update single instance
  updateInstance(
    userId: string,
    instanceId: string,
    updates: any
  ): Promise<ApiResponse<EnhancedCalendarEvent>>
  
  // Delete single instance
  deleteInstance(userId: string, instanceId: string): Promise<ApiResponse<void>>
  
  // Delete all future instances
  deleteFutureInstances(userId: string, eventId: string, fromDate: Date): Promise<ApiResponse<void>>
  
  // Check if event is recurring
  isRecurring(event: EnhancedCalendarEvent): boolean
  
  // Get next occurrence
  getNextOccurrence(event: EnhancedCalendarEvent): Date | null
}
```

**Types**:
```typescript
interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every N days/weeks/months
  endDate?: Date; // Optional end date
  occurrences?: number; // Or max occurrences
  daysOfWeek?: number[]; // For weekly (0=Sun, 6=Sat)
  dayOfMonth?: number; // For monthly (1-31)
  monthOfYear?: number; // For yearly (1-12)
  exceptions?: Date[]; // Dates to skip
}

interface RecurringEvent extends EnhancedCalendarEvent {
  parentEventId: string;
  recurrencePattern: RecurrencePattern;
  instanceIndex: number; // Which occurrence this is
}
```

**Firestore**:
- Add to events collection:
  - `isRecurring: boolean`
  - `parentEventId?: string`
  - `recurrencePattern?: RecurrencePattern`
  - `instanceIndex?: number`

---

### **TASK 3: CalendarExportService (0.5 hours)**

**File**: `src/utils/calendar-export.ts` (250 lines)

**Purpose**: Export calendar data to different formats

**Methods**:
```typescript
class CalendarExportService {
  // Export to iCal format
  static exportToICalFormat(events: EnhancedCalendarEvent[]): string
  
  // Export to JSON
  static exportToJSON(events: EnhancedCalendarEvent[]): string
  
  // Export to CSV
  static exportToCSV(events: EnhancedCalendarEvent[]): string
  
  // Generate PDF (requires external lib)
  static exportToPDF(events: EnhancedCalendarEvent[]): Promise<Blob>
  
  // Download file
  static downloadFile(content: string, filename: string, mimeType: string): void
  
  // Generate iCal event
  private static generateICalEvent(event: EnhancedCalendarEvent): string
}
```

**Features**:
- iCalendar (RFC 5545) standard compliance
- Support for recurring events
- Event properties: title, description, date, attendees
- Auto-download functionality

---

### **TASK 4: Update EventForm Component (0.5 hours)**

**File**: `src/components/calendar/EventForm.tsx` (Modified)

**Changes**:
1. Add "Reminders" section in Advanced mode
   - Radio buttons: None, 15 min, 1 hour, 1 day, custom
   - Multiple reminders support

2. Add "Recurrence" section in Advanced mode
   - Dropdown: None, Daily, Weekly, Monthly, Yearly
   - Interval picker
   - End date/Occurrences option
   - Days of week selector (for weekly)

3. Add export button to event details
   - "Export Event" button
   - "Export All Events" button in calendar page

---

### **TASK 5: Update Firestore Rules (0.5 hours)**

**File**: `firestore.rules` (Modified)

**Changes**:
```firestore
match /reminders/{reminderId} {
  allow read: if request.auth.uid == resource.data.userId;
  allow create: if request.auth.uid == request.resource.data.userId
    && get(/databases/$(database)/documents/events/$(request.resource.data.eventId)).data.userId == request.auth.uid;
  allow update: if request.auth.uid == resource.data.userId;
  allow delete: if request.auth.uid == resource.data.userId;
}
```

---

### **TASK 6: Build & Deploy (0.5 hours)**

**Steps**:
1. npm run build (verify 0 errors)
2. firebase deploy --only firestore:rules
3. firebase deploy --only hosting
4. Verify on staging URL

---

## 📊 **FILES SUMMARY**

### New Files
1. `src/services/ReminderService.ts` - 350 lines
2. `src/services/RecurrenceService.ts` - 400 lines
3. `src/utils/calendar-export.ts` - 250 lines
4. `SPRINT_4A_COMPLETION_REPORT.md` - Summary

### Modified Files
1. `src/components/calendar/EventForm.tsx` - Add UI sections
2. `firestore.rules` - Add reminders collection rules

### Total New Code
- Lines: 1,000+
- Services: 2
- Utilities: 1
- Components: 1 (modified)
- Type Definitions: 6+ new interfaces

---

## 🔧 **TECHNICAL DETAILS**

### Reminder Timing
- Triggers when: `now >= eventTime - reminderTime`
- Status: Pending → Sent → Completed
- Notification: Toast + optional browser notification

### Recurrence Logic
- Generate instances on-demand (not stored)
- Parent event stores pattern
- Instances created as needed for calendar view
- Update/delete affects pattern or single instance

### Export Format (iCal)
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Salatiso//Calendar//EN
BEGIN:VEVENT
UID:event-id@salatiso.com
DTSTAMP:20251025T120000Z
DTSTART:20251025T140000Z
DTEND:20251025T150000Z
SUMMARY:Event Title
DESCRIPTION:Event Description
RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE
END:VEVENT
END:VCALENDAR
```

---

## ✅ **VALIDATION CHECKLIST**

Before deployment:
- [ ] All TypeScript: 0 errors
- [ ] ReminderService methods tested (locally)
- [ ] RecurrenceService generates correct instances
- [ ] Export produces valid iCal format
- [ ] EventForm UI renders correctly
- [ ] Firestore rules allow/deny correctly
- [ ] Build succeeds: `npm run build`
- [ ] No linting warnings
- [ ] Reminders appear on calendar
- [ ] Recurring events expand in calendar view
- [ ] Export downloads files

---

## 🚀 **SUCCESS CRITERIA**

Sprint 4A Complete when:
1. ✅ ReminderService fully implemented (350+ lines, 0 errors)
2. ✅ RecurrenceService fully implemented (400+ lines, 0 errors)
3. ✅ Export utility works for iCal format
4. ✅ EventForm updated with reminder/recurrence UI
5. ✅ Firestore rules deployed
6. ✅ Build: 0 errors
7. ✅ Deploy to staging
8. ✅ Calendar page shows recurring events
9. ✅ Reminders appear in calendar
10. ✅ Export functionality working

---

## 📝 **NEXT STEPS**

After Sprint 4A approval:
1. Build ReminderService
2. Build RecurrenceService
3. Build ExportService
4. Update EventForm
5. Update Firestore rules
6. Build & Deploy
7. Create completion report
8. Move to Sprint 4B

---

**Ready to start? Let's build Sprint 4A! 🚀**
