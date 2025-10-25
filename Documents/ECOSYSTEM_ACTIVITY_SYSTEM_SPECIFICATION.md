# 🔄 Ecosystem Activity System Specification
**Real-Time Cross-App Activity Synchronization**

**Version:** 1.0  
**Date:** October 24, 2025  
**Status:** Design Complete - Ready for Implementation  
**Foundation Document:** ECOSYSTEM_STRATEGY_AND_ARCHITECTURE.md  

---

## 📌 Executive Summary

The **Ecosystem Activity System** ensures that activity from any app is instantly visible in all other apps. Users never feel isolated in a single app—they always see the complete picture of what's happening across their entire ecosystem.

### Core Features
- ✅ Real-time activity propagation (< 500ms across all apps)
- ✅ Unified activity feed in every app dashboard
- ✅ Deep linking to source app for details
- ✅ Activity filtering by app or type
- ✅ Privacy-aware activity visibility
- ✅ Scalable to unlimited activities
- ✅ Offline-safe (syncs when online)

### Example User Experience

```
User in BizHelp sees:
├─ "You just received $500 payment in FinHelp" (2 seconds ago)
├─ "Sarah joined your Ekhaya group" (5 minutes ago)
├─ "New course available in Sazi Academy" (15 minutes ago)
├─ "Your profile updated in LifeSync" (2 hours ago)
└─ "Incident reported in SafetyHelp" (1 day ago)

Each item has [View Details] button → deep links to source app
```

---

## 🏗️ Architecture

### System Components

```
┌──────────────────────────────────────────────────────────┐
│              Ecosystem Activity System                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────┐ │
│  │   App A        │  │   App B        │  │  App C    │ │
│  │  (BizHelp)     │  │  (FinHelp)     │  │(LifeSync) │ │
│  └────────────────┘  └────────────────┘  └───────────┘ │
│           │                  │                  │        │
│           ▼                  ▼                  ▼        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Activity Logging Service (Each App)            │  │
│  │  - logActivity()                                 │  │
│  │  - Activity validation                          │  │
│  │  - Privacy checks                               │  │
│  └──────────────────────────────────────────────────┘  │
│           │                  │                  │        │
│           └──────────────────┼──────────────────┘        │
│                              │                          │
│                              ▼                          │
│                   ┌──────────────────────┐             │
│                   │  Firestore           │             │
│                   │  activities/{userId} │             │
│                   │  Collection          │             │
│                   └──────────────────────┘             │
│                              △                          │
│                              │                          │
│           ┌──────────────────┼──────────────────┐       │
│           │                  │                  │       │
│           ▼                  ▼                  ▼       │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────┐ │
│  │   App A        │  │   App B        │  │  App C    │ │
│  │  Activity      │  │  Activity      │  │ Activity  │ │
│  │  Widget        │  │  Widget        │  │ Widget    │ │
│  │ (real-time     │  │ (real-time     │  │(real-time)│ │
│  │  onSnapshot)   │  │  onSnapshot)   │  │           │ │
│  └────────────────┘  └────────────────┘  └───────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Firestore Schema

#### Activities Collection Structure

```
/activities
├─ {userId}
│  ├─ {activityId1}
│  │  ├─ id: string
│  │  ├─ timestamp: Timestamp
│  │  ├─ sourceApp: 'BizHelp' | 'FinHelp' | 'SafetyHelp' | ... 
│  │  ├─ activityType: 'project_created' | 'payment_received' | ...
│  │  ├─ activityTitle: string (human-readable)
│  │  ├─ activityDescription: string (optional, detailed)
│  │  ├─ activityIcon: string (emoji or icon name)
│  │  ├─ appIcon: string (URL to app icon)
│  │  ├─ appColor: string (hex color #FF6B6B)
│  │  ├─ deepLink: string (URL to jump to this activity in source app)
│  │  ├─ userId: string (who did this)
│  │  ├─ affectedUsers: string[] (who else was affected)
│  │  ├─ category: 'profile' | 'business' | 'finance' | 'safety' | 'community' | 'learning' | 'document'
│  │  ├─ priority: 'low' | 'medium' | 'high' | 'critical'
│  │  ├─ visibility: 'private' | 'family' | 'public' (based on user settings)
│  │  ├─ data: object (app-specific data for context)
│  │  │  ├─ projectId?: string
│  │  │  ├─ projectName?: string
│  │  │  ├─ amount?: number
│  │  │  ├─ incidentType?: string
│  │  │  └─ ... (varies by activityType)
│  │  │
│  │  └─ metadata: object
│  │     ├─ source: 'mobile' | 'web'
│  │     ├─ ipAddress?: string
│  │     ├─ readBy: { userId: Timestamp } (who read this)
│  │     └─ deletedAt?: Timestamp (soft delete)
│  │
│  ├─ {activityId2}
│  │  └─ (same structure)
│  │
│  └─ ... (hundreds/thousands of activities)
│
└─ {anotherUserId}
   ├─ {activityId}
   └─ ...
```

### Activity Lifecycle

```
Step 1: Action Occurs
        ↓
    User creates a project in BizHelp
        ↓
Step 2: App Logs Activity
        ↓
    BizHelp calls: activityService.logActivity({
      sourceApp: 'BizHelp',
      activityType: 'project_created',
      activityTitle: 'Project "Website Redesign" created',
      data: { projectId: '123', projectName: 'Website Redesign' },
      ...
    })
        ↓
Step 3: Write to Firestore
        ↓
    Activity saved to: /activities/{userId}/{activityId}
        ↓
Step 4: Real-Time Listeners Trigger
        ↓
    All apps listening on /activities/{userId}/* detect new activity
        ↓
Step 5: UI Updates in All Apps
        ↓
    ├─ BizHelp dashboard: Activity appears (< 100ms)
    ├─ FinHelp dashboard: Activity appears (< 300ms)
    ├─ SafetyHelp dashboard: Activity appears (< 300ms)
    ├─ PigeeBack dashboard: Activity appears (< 300ms)
    ├─ Ekhaya dashboard: Activity appears (< 300ms)
    ├─ DocHelp dashboard: Activity appears (< 300ms)
    ├─ Sazi Academy dashboard: Activity appears (< 300ms)
    └─ Hub dashboard: Activity appears (< 300ms)
        ↓
Step 6: User Interaction
        ↓
    User in FinHelp sees activity about BizHelp project
    User clicks [View Details]
        ↓
Step 7: Deep Link Navigation
        ↓
    Browser navigates to: 
    https://bizhelp.salatiso.com/project/123?referrer=finhelp
        ↓
Step 8: BizHelp Loads Context
        ↓
    BizHelp recognizes referrer and returns to FinHelp after user done
```

---

## 📋 Activity Types Reference

### LifeSync Activities

```typescript
// Profile Updated
{
  activityType: 'profile_updated',
  activityTitle: 'Profile updated: Skills section added',
  activityIcon: '📝',
  category: 'profile',
  priority: 'low',
  data: {
    section: 'skills',
    change: 'added'
  }
}

// Verification Completed
{
  activityType: 'verification_completed',
  activityTitle: 'Identity verification completed',
  activityIcon: '✓',
  category: 'profile',
  priority: 'high',
  data: {
    verificationType: 'identity',
    status: 'approved'
  }
}

// Badge Earned
{
  activityType: 'badge_earned',
  activityTitle: 'Badge earned: Trusted Business Owner',
  activityIcon: '🏆',
  category: 'profile',
  priority: 'high',
  data: {
    badgeId: 'trusted_owner',
    badgeName: 'Trusted Business Owner'
  }
}

// Trust Score Changed
{
  activityType: 'trust_score_changed',
  activityTitle: 'Trust score increased to 85 (Established)',
  activityIcon: '📊',
  category: 'profile',
  priority: 'medium',
  data: {
    oldScore: 78,
    newScore: 85,
    oldTier: 'Developing',
    newTier: 'Established'
  }
}
```

### BizHelp Activities

```typescript
// Project Created
{
  activityType: 'project_created',
  activityTitle: 'Project "Website Redesign" created',
  activityIcon: '📋',
  category: 'business',
  priority: 'medium',
  data: {
    projectId: '123',
    projectName: 'Website Redesign',
    status: 'new'
  }
}

// Milestone Completed
{
  activityType: 'milestone_completed',
  activityTitle: 'Milestone "Design Phase Complete" completed',
  activityIcon: '🎯',
  category: 'business',
  priority: 'high',
  data: {
    projectId: '123',
    milestoneId: '456',
    milestoneName: 'Design Phase Complete'
  }
}

// Client Added
{
  activityType: 'client_added',
  activityTitle: 'Client "Acme Corp" added',
  activityIcon: '🤝',
  category: 'business',
  priority: 'low',
  data: {
    clientId: '789',
    clientName: 'Acme Corp'
  }
}

// Team Member Joined
{
  activityType: 'team_member_joined',
  activityTitle: 'Sarah joined your team',
  activityIcon: '👥',
  category: 'business',
  priority: 'medium',
  data: {
    memberId: 'sarah123',
    memberName: 'Sarah',
    role: 'designer'
  }
}

// Revenue Recorded
{
  activityType: 'revenue_recorded',
  activityTitle: 'Revenue recorded: $5,000',
  activityIcon: '💰',
  category: 'business',
  priority: 'high',
  data: {
    amount: 5000,
    currency: 'USD',
    projectId: '123'
  }
}
```

### FinHelp Activities

```typescript
// Payment Received
{
  activityType: 'payment_received',
  activityTitle: 'Payment received: $500 from Project Invoice',
  activityIcon: '💵',
  category: 'finance',
  priority: 'high',
  data: {
    amount: 500,
    currency: 'USD',
    source: 'Project Invoice',
    sourceId: 'inv123'
  }
}

// Budget Created
{
  activityType: 'budget_created',
  activityTitle: 'Monthly budget created: $5,000',
  activityIcon: '📊',
  category: 'finance',
  priority: 'medium',
  data: {
    budgetName: 'Monthly Budget',
    amount: 5000,
    period: 'monthly'
  }
}

// Goal Created
{
  activityType: 'financial_goal_created',
  activityTitle: 'Goal created: Save $10,000 by year-end',
  activityIcon: '🎯',
  category: 'finance',
  priority: 'medium',
  data: {
    goalName: 'Save $10,000 by year-end',
    targetAmount: 10000,
    deadline: '2025-12-31'
  }
}

// Alert Triggered
{
  activityType: 'financial_alert',
  activityTitle: 'Alert: Budget overspend in "Marketing"',
  activityIcon: '⚠️',
  category: 'finance',
  priority: 'high',
  data: {
    alertType: 'overspend',
    category: 'Marketing',
    amount: 200
  }
}
```

### SafetyHelp Activities

```typescript
// Incident Reported
{
  activityType: 'incident_reported',
  activityTitle: 'Incident reported: Minor injury at worksite',
  activityIcon: '🚨',
  category: 'safety',
  priority: 'critical',
  data: {
    incidentId: '999',
    incidentType: 'injury',
    severity: 'minor',
    location: 'Worksite A'
  }
}

// Training Completed
{
  activityType: 'training_completed',
  activityTitle: 'Safety training completed: Fire Evacuation',
  activityIcon: '🏫',
  category: 'safety',
  priority: 'medium',
  data: {
    trainingId: 'fire_evac_2025',
    trainingName: 'Fire Evacuation',
    completedDate: '2025-10-24'
  }
}

// Protocol Updated
{
  activityType: 'protocol_updated',
  activityTitle: 'Protocol updated: Fire Evacuation Procedure',
  activityIcon: '📋',
  category: 'safety',
  priority: 'medium',
  data: {
    protocolId: 'fire_001',
    protocolName: 'Fire Evacuation Procedure',
    changeType: 'update'
  }
}

// Drill Executed
{
  activityType: 'safety_drill_executed',
  activityTitle: 'Drill executed: Fire Evacuation (All passed)',
  activityIcon: '🔔',
  category: 'safety',
  priority: 'low',
  data: {
    drillId: 'drill_001',
    drillName: 'Fire Evacuation',
    participantsTotal: 25,
    participantsPassed: 25
  }
}
```

### PigeeBack Activities

```typescript
// Ride Offered
{
  activityType: 'ride_offered',
  activityTitle: 'Ride offered: City Center to Airport ($15)',
  activityIcon: '🚗',
  category: 'community',
  priority: 'medium',
  data: {
    rideId: 'ride123',
    from: 'City Center',
    to: 'Airport',
    price: 15,
    seats: 2
  }
}

// Booking Confirmed
{
  activityType: 'booking_confirmed',
  activityTitle: 'Booking confirmed: Airport trip with John',
  activityIcon: '✓',
  category: 'community',
  priority: 'high',
  data: {
    bookingId: 'book123',
    rideId: 'ride123',
    passengerName: 'John'
  }
}

// Rating Given
{
  activityType: 'rating_given',
  activityTitle: 'Gave 5-star rating to John',
  activityIcon: '⭐',
  category: 'community',
  priority: 'low',
  data: {
    ratedUserId: 'john123',
    ratedUserName: 'John',
    rating: 5,
    type: 'driver_rating'
  }
}

// Property Listed
{
  activityType: 'property_listed',
  activityTitle: 'Property listed: 2-Bed Apartment (Downtown)',
  activityIcon: '🏠',
  category: 'community',
  priority: 'medium',
  data: {
    propertyId: 'prop123',
    propertyType: 'apartment',
    beds: 2,
    location: 'Downtown'
  }
}
```

### Ekhaya Activities

```typescript
// Group Joined
{
  activityType: 'group_joined',
  activityTitle: 'Joined group: "Ubuntu Community"',
  activityIcon: '👥',
  category: 'community',
  priority: 'medium',
  data: {
    groupId: 'group123',
    groupName: 'Ubuntu Community',
    membersCount: 156
  }
}

// Event Created
{
  activityType: 'event_created',
  activityTitle: 'Event created: "Community Cleanup Day"',
  activityIcon: '📅',
  category: 'community',
  priority: 'medium',
  data: {
    eventId: 'event123',
    eventName: 'Community Cleanup Day',
    date: '2025-11-10',
    location: 'Central Park'
  }
}

// Event Attended
{
  activityType: 'event_attended',
  activityTitle: 'Attended: "Community Cleanup Day"',
  activityIcon: '✓',
  category: 'community',
  priority: 'low',
  data: {
    eventId: 'event123',
    eventName: 'Community Cleanup Day'
  }
}

// Connection Made
{
  activityType: 'connection_made',
  activityTitle: 'Connected with Sarah (Ubuntu enthusiast)',
  activityIcon: '🤝',
  category: 'community',
  priority: 'low',
  data: {
    connectionId: 'conn123',
    connectedUserName: 'Sarah',
    interest: 'Ubuntu enthusiast'
  }
}
```

### DocHelp Activities

```typescript
// Document Created
{
  activityType: 'document_created',
  activityTitle: 'Document created: "Contract Template v3"',
  activityIcon: '📄',
  category: 'document',
  priority: 'low',
  data: {
    documentId: 'doc123',
    documentName: 'Contract Template v3',
    type: 'template'
  }
}

// Document Shared
{
  activityType: 'document_shared',
  activityTitle: 'Document shared: "Project Proposal" with Sarah',
  activityIcon: '📤',
  category: 'document',
  priority: 'medium',
  data: {
    documentId: 'doc123',
    documentName: 'Project Proposal',
    sharedWithName: 'Sarah',
    permission: 'edit'
  }
}

// Version Updated
{
  activityType: 'document_version_updated',
  activityTitle: 'Document updated: "Meeting Notes" (v5)',
  activityIcon: '✏️',
  category: 'document',
  priority: 'medium',
  data: {
    documentId: 'doc123',
    documentName: 'Meeting Notes',
    version: 5,
    changeType: 'content_update'
  }
}
```

### Sazi Academy Activities

```typescript
// Course Enrolled
{
  activityType: 'course_enrolled',
  activityTitle: 'Enrolled in: "Advanced Business Management"',
  activityIcon: '📚',
  category: 'learning',
  priority: 'medium',
  data: {
    courseId: 'course123',
    courseName: 'Advanced Business Management',
    level: 'advanced'
  }
}

// Lesson Completed
{
  activityType: 'lesson_completed',
  activityTitle: 'Lesson completed: "Financial Planning Basics"',
  activityIcon: '✓',
  category: 'learning',
  priority: 'low',
  data: {
    lessonId: 'lesson123',
    lessonName: 'Financial Planning Basics',
    courseId: 'course123'
  }
}

// Certificate Earned
{
  activityType: 'certificate_earned',
  activityTitle: 'Certificate earned: "Business Administration"',
  activityIcon: '📜',
  category: 'learning',
  priority: 'high',
  data: {
    certificateId: 'cert123',
    certificateName: 'Business Administration',
    issueDate: '2025-10-24'
  }
}

// Quiz Passed
{
  activityType: 'quiz_passed',
  activityTitle: 'Quiz passed: "Module 3 Assessment" (92%)',
  activityIcon: '🎓',
  category: 'learning',
  priority: 'medium',
  data: {
    quizId: 'quiz123',
    quizName: 'Module 3 Assessment',
    score: 92,
    courseId: 'course123'
  }
}
```

---

## 🛠️ Implementation Details

### EcosystemActivityService.ts Structure

```typescript
class EcosystemActivityService {
  // Constructor
  constructor(userId: string)
  
  // Main methods
  async logActivity(
    sourceApp: string,
    activityType: string,
    activityTitle: string,
    options: ActivityOptions
  ): Promise<string>  // returns activityId
  
  // Retrieval methods
  async getRecentActivities(
    limit: number = 10,
    filters?: ActivityFilters
  ): Promise<Activity[]>
  
  async getActivitiesByApp(
    sourceApp: string,
    limit?: number
  ): Promise<Activity[]>
  
  async getActivitiesByCategory(
    category: ActivityCategory,
    limit?: number
  ): Promise<Activity[]>
  
  async getActivitiesByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Activity[]>
  
  // Real-time subscription
  subscribeToActivities(
    callback: (activities: Activity[]) => void,
    filters?: ActivityFilters
  ): Unsubscribe  // returns unsubscribe function
  
  // Utility methods
  async deleteActivity(activityId: string): Promise<void>
  async updateActivityRead(activityId: string): Promise<void>
  async getActivityById(activityId: string): Promise<Activity | null>
  
  // Configuration methods
  setActivityRetention(days: number): void  // auto-delete after N days
  setPrivacyLevel(level: 'private' | 'family' | 'public'): void
  
  // Statistics
  async getActivityStats(): Promise<ActivityStats>
}
```

### EcosystemActivityWidget.tsx Structure

```typescript
interface EcosystemActivityWidgetProps {
  userId: string
  limit?: number  // default 10
  showFilters?: boolean  // default true
  showViewMore?: boolean  // default true
  compact?: boolean  // default false - full view
  filters?: ActivityFilters  // initial filters
  onActivityClick?: (activity: Activity) => void
}

export const EcosystemActivityWidget: React.FC<EcosystemActivityWidgetProps> = ({
  userId,
  limit = 10,
  showFilters = true,
  showViewMore = true,
  compact = false,
  filters = {},
  onActivityClick
}) => {
  // State
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [selectedFilters, setSelectedFilters] = useState<ActivityFilters>(filters)
  const [loading, setLoading] = useState(true)
  const [unsubscribe, setUnsubscribe] = useState<Unsubscribe | null>(null)
  
  // Effects
  useEffect(() => {
    // Subscribe to real-time updates
    const unsub = activityService.subscribeToActivities(
      (newActivities) => {
        setActivities(newActivities)
        filterActivities(newActivities, selectedFilters)
      },
      selectedFilters
    )
    setUnsubscribe(unsub)
    setLoading(false)
    
    return () => unsub?.()
  }, [selectedFilters])
  
  // Handlers
  const handleFilterChange = (newFilters: ActivityFilters) => {
    setSelectedFilters(newFilters)
  }
  
  const handleActivityClick = (activity: Activity) => {
    // Mark as read
    activityService.updateActivityRead(activity.id)
    
    // Callback to parent
    onActivityClick?.(activity)
    
    // Navigate to deep link
    window.open(activity.deepLink, '_blank')
  }
  
  // Render
  return (
    <div className="ecosystem-activity-widget">
      {showFilters && <ActivityFilters {...} />}
      
      {loading ? (
        <ActivitySkeleton limit={limit} />
      ) : filteredActivities.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ActivityList activities={filteredActivities.slice(0, limit)} />
          {showViewMore && (
            <ViewMoreLink to="/activity-feed" />
          )}
        </>
      )}
    </div>
  )
}
```

---

## 📊 Activity Filtering & Querying

### Filter Options

```typescript
interface ActivityFilters {
  // By source app
  sourceApp?: string  // 'BizHelp' | 'FinHelp' | etc.
  sourceApps?: string[]  // Multiple apps
  
  // By type
  activityType?: string  // 'project_created' | 'payment_received' | etc.
  activityTypes?: string[]  // Multiple types
  
  // By category
  category?: ActivityCategory  // 'business' | 'finance' | etc.
  categories?: ActivityCategory[]  // Multiple categories
  
  // By priority
  priority?: 'low' | 'medium' | 'high' | 'critical'
  priorities?: ('low' | 'medium' | 'high' | 'critical')[]
  
  // By date
  dateFrom?: Date
  dateTo?: Date
  
  // By read status
  unreadOnly?: boolean
  
  // By visibility
  visibility?: 'private' | 'family' | 'public'
  visibilities?: ('private' | 'family' | 'public')[]
}

// Examples:
const filters1: ActivityFilters = {
  sourceApp: 'FinHelp',
  priority: 'high'
}  // All high-priority activities from FinHelp

const filters2: ActivityFilters = {
  categories: ['business', 'finance'],
  unreadOnly: true
}  // All unread business and finance activities

const filters3: ActivityFilters = {
  dateFrom: new Date('2025-10-24'),
  dateTo: new Date('2025-10-25')
}  // All activities from today
```

### Query Examples

```typescript
// Get last 10 activities
const recent = await activityService.getRecentActivities(10)

// Get all BizHelp activities
const bizHelpActivities = await activityService.getActivitiesByApp('BizHelp')

// Get all unread high-priority activities
const urgent = await activityService.getRecentActivities(100, {
  unreadOnly: true,
  priority: 'high'
})

// Get all activities from today
const today = await activityService.getActivitiesByDateRange(
  new Date(new Date().setHours(0, 0, 0, 0)),
  new Date()
)

// Subscribe to only FinHelp activities
const unsubscribe = activityService.subscribeToActivities(
  (activities) => {
    console.log('New FinHelp activities:', activities)
  },
  { sourceApp: 'FinHelp' }
)
```

---

## 🔗 Deep Linking Implementation

### Deep Link Format

```
{baseUrl}/{path}?referrer={sourceApp}&returnUrl={encodeURIComponent(currentUrl)}
```

### Examples

**From BizHelp to FinHelp:**
```
https://finhelp.salatiso.com/transaction/trans123
?referrer=bizhelp
&returnUrl=https%3A%2F%2Fbizhelp.salatiso.com%2Fprojects
```

**From Ekhaya to LifeSync:**
```
https://lifesync-lifecv.web.app/profile
?referrer=ekhaya
&returnUrl=https%3A%2F%2Fekhaya.salatiso.com%2Fgroups
```

### Return Navigation Handler

```typescript
// In each app, implement this hook:
export const useDeepLinkReturn = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const returnUrl = params.get('returnUrl')
    
    if (returnUrl) {
      // Store for later use
      sessionStorage.setItem('deepLinkReturnUrl', returnUrl)
    }
  }, [])
  
  // Call this after completing action in this app
  const returnToSourceApp = () => {
    const returnUrl = sessionStorage.getItem('deepLinkReturnUrl')
    if (returnUrl) {
      window.location.href = returnUrl
      sessionStorage.removeItem('deepLinkReturnUrl')
    }
  }
  
  return { returnToSourceApp }
}
```

---

## ⚡ Performance Optimization

### Real-Time Listener Strategy

```typescript
// In each app, setup listener on mount:
useEffect(() => {
  const unsubscribe = activityService.subscribeToActivities(
    (activities) => {
      setActivities(activities)
    },
    { limit: 10 }  // Only listen to last 10
  )
  
  return () => unsubscribe?.()
}, [])
```

### Firestore Query Optimization

```typescript
// Optimize queries with indexes:
// Collection: activities
// Index 1: userId (Ascending), timestamp (Descending)
// Index 2: userId (Ascending), sourceApp (Ascending), timestamp (Descending)
// Index 3: userId (Ascending), category (Ascending), timestamp (Descending)
// Index 4: userId (Ascending), priority (Ascending), timestamp (Descending)

// This allows fast queries like:
// db.collection('activities').doc(userId).collection('items')
//   .where('sourceApp', '==', 'BizHelp')
//   .orderBy('timestamp', 'desc')
//   .limit(10)
```

### Pagination Strategy

```typescript
// For large activity feeds, use pagination:
let query = db.collection('activities').doc(userId).collection('items')
  .orderBy('timestamp', 'desc')
  .limit(20)

const firstPage = await query.get()

// Get next page:
const lastVisible = firstPage.docs[firstPage.docs.length - 1]
const nextPage = await query
  .startAfter(lastVisible)
  .limit(20)
  .get()
```

### Caching Strategy

```typescript
// Client-side cache to reduce Firestore reads:
const activityCache = new Map<string, Activity[]>()

async function getActivitiesWithCache(userId: string, filters: ActivityFilters) {
  const cacheKey = JSON.stringify({ userId, filters })
  
  if (activityCache.has(cacheKey)) {
    return activityCache.get(cacheKey)!
  }
  
  const activities = await fetchActivitiesFromFirestore(userId, filters)
  activityCache.set(cacheKey, activities)
  
  // Clear cache after 5 minutes
  setTimeout(() => activityCache.delete(cacheKey), 5 * 60 * 1000)
  
  return activities
}
```

---

## 🔒 Security & Privacy

### Activity Visibility Rules

```typescript
// Only user's own activities are visible to them
db.collection('activities')
  .doc(userId)
  .collection('items')
  .where('visibility', '==', 'private')

// Family members can see family-level activities
db.collection('activities')
  .doc(userId)
  .collection('items')
  .where('visibility', 'in', ['private', 'family'])
  .where('familyId', '==', currentUserFamilyId)

// Public activities visible to everyone
db.collection('activities')
  .doc(userId)
  .collection('items')
  .where('visibility', '==', 'public')
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Activities collection
    match /activities/{userId}/{document=**} {
      // Only the user can read their own activities
      allow read: if request.auth.uid == userId;
      
      // Only server (backend) can write activities
      allow write: if request.auth.token.email.endsWith('@backend.salatiso.com');
    }
    
    // Activity service permissions
    match /activities/{userId}/{itemId} {
      allow get: if request.auth.uid == userId;
      allow list: if request.auth.uid == userId;
      allow create: if isBackend();
      allow update: if isBackend();
      allow delete: if isBackend() || isAdmin();
    }
  }
  
  function isBackend() {
    return request.auth.token.email.endsWith('@backend.salatiso.com');
  }
  
  function isAdmin() {
    return request.auth.token.admin == true;
  }
}
```

---

## 📈 Monitoring & Analytics

### Activity Stats

```typescript
interface ActivityStats {
  totalActivities: number
  activitiesByApp: { [app: string]: number }
  activitiesByCategory: { [category: string]: number }
  activitiesByDay: { [date: string]: number }
  averageActivitiesPerDay: number
  mostActiveApp: string
  mostActiveCategory: string
  unreadCount: number
  lastActivityTime: Date
}

// Usage:
const stats = await activityService.getActivityStats()
console.log(`Total activities: ${stats.totalActivities}`)
console.log(`Most active: ${stats.mostActiveApp}`)
console.log(`Unread: ${stats.unreadCount}`)
```

### Metrics to Track

- Total activities per user per day
- Activities per app
- Average time to view activity after creation
- Deep link click-through rate
- Filter usage patterns
- Peak activity times
- Activity types distribution
- Real-time sync latency

---

## ✅ Rollout Checklist

### Before Deployment

- [ ] Schema designed and validated
- [ ] Firestore indexes created
- [ ] EcosystemActivityService.ts implemented
- [ ] EcosystemActivityWidget.tsx implemented
- [ ] Deep linking implemented in all apps
- [ ] Security rules configured
- [ ] Unit tests written
- [ ] Integration tests passed
- [ ] Performance testing completed
- [ ] Documentation complete

### During Deployment

- [ ] Deploy to staging environment
- [ ] Test in staging with real data
- [ ] Load testing (1000+ activities)
- [ ] Real-time sync testing
- [ ] Deep linking verification
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing

### After Deployment

- [ ] Monitor Firestore costs
- [ ] Monitor real-time listener count
- [ ] Monitor error rates
- [ ] Collect user feedback
- [ ] Optimize based on usage patterns
- [ ] Document any issues

---

## 📚 Related Documents

- **ECOSYSTEM_STRATEGY_AND_ARCHITECTURE.md** - Overall strategy
- **ECOSYSTEM_INDIVIDUAL_APP_SPECIFICATIONS.md** - Per-app specs
- **ECOSYSTEM_DEEP_LINKING_GUIDE.md** - Deep linking details
- **ECOSYSTEM_ACTIVITY_INTEGRATION_GUIDE.md** - Quick integration guide

---

## 🎓 Conclusion

The Ecosystem Activity System is the connective tissue that transforms 9 individual apps into ONE integrated ecosystem. Every action is visible, every discovery leads to the source, and users always feel connected.

**Key Benefits:**
- ✅ Users never miss important information
- ✅ Navigation between apps is seamless
- ✅ Real-time updates create sense of liveliness
- ✅ Each app stays focused while showing full picture
- ✅ Family members stay informed across all activities

---

**Next Steps:**
1. Implement EcosystemActivityService.ts
2. Implement EcosystemActivityWidget.tsx
3. Deploy to Salatiso (Hub) as proof of concept
4. Test end-to-end with all apps
5. Rollout to all ecosystem apps

---

**Document Version History:**
- **v1.0** (Oct 24, 2025) - Initial specification

**Author:** Ecosystem Architecture Team  
**Last Updated:** October 24, 2025  
**Status:** DESIGN COMPLETE - Ready for Implementation  
**Audience:** Architects, Developers, Technical Leads
