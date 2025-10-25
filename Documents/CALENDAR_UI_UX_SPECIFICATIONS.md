# 📱 Calendar UI/UX Specifications
## Activity & Incident Management System Component Guide

**Prepared:** October 22, 2025  
**Classification:** Design Specifications - Component Library  
**Target Launch:** Phase 1 (Nov 1), Phase 2 (Nov 15), Phase 3 (Nov 29)  

---

## Table of Contents

1. Design Principles
2. Component Specifications (8 core components)
3. Mobile-First Design Guidelines
4. Accessibility Standards
5. State Management & Data Flow
6. User Interaction Patterns
7. Error Handling & Edge Cases
8. Animation & Feedback Patterns

---

## Part 1: Design Principles

### Core Principles

1. **Mobile-First** — All components designed for phone first, then tablet/desktop
2. **Clear & Accessible** — WCAG 2.1 AA compliance, readable fonts, sufficient contrast
3. **Fast & Responsive** — Touch targets ≥44px, 60fps animations, <100ms interaction feedback
4. **Context-Aware** — Show relevant controls based on user's role and permission
5. **Intuitive Defaults** — Safe defaults, clear next steps, no ambiguity
6. **Family-Friendly** — Design for ages 8-80, large text options, simple language
7. **Backup-Ready** — Graceful degradation when offline or low connectivity

### Typography

```css
/* Heading Hierarchy */
H1: 32px, 700 weight, line-height 1.2   /* Page titles */
H2: 24px, 700 weight, line-height 1.3   /* Section headers */
H3: 20px, 600 weight, line-height 1.4   /* Subsection headers */
H4: 18px, 600 weight, line-height 1.4   /* Component titles */

/* Body Text */
Body: 16px, 400 weight, line-height 1.5 /* Primary text */
Small: 14px, 400 weight, line-height 1.4 /* Secondary text */
Extra Small: 12px, 400 weight, line-height 1.3 /* Tertiary text */

/* Font Family */
Primary: Inter, system-ui, sans-serif
Monospace: Fira Code, monospace (for codes/IDs)
```

### Color System

```css
/* Semantic Colors */
--success: #10b981     /* Green - resolved, accepted */
--warning: #f59e0b    /* Amber - in progress, medium severity */
--danger: #ef4444     /* Red - critical, declined */
--info: #3b82f6       /* Blue - information, assistance needed */

/* Context Colors */
--individual: #8b5cf6 /* Purple */
--family: #ec4899     /* Pink */
--community: #06b6d4  /* Cyan */
--professional: #1f2937 /* Gray */

/* Neutral */
--white: #ffffff
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-400: #9ca3af
--gray-500: #6b7280
--gray-600: #4b5563
--gray-700: #374151
--gray-800: #1f2937
--gray-900: #111827
```

### Spacing System

```css
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
xxl: 32px
xxxl: 48px
```

---

## Part 2: Component Specifications

### Component 1: RoleAssignmentCard

**Purpose:** Display and manage roles assigned to an event

**File:** `src/components/calendar/RoleAssignmentCard.tsx`

**Props:**
```typescript
interface RoleAssignmentCardProps {
  event: EnhancedCalendarEvent;
  currentUserId: string;
  onRoleUpdate?: (userId: string, newRole: RoleType) => void;
  onRoleRemove?: (userId: string) => void;
  editable?: boolean;           // Only organizer can edit
  compact?: boolean;            // Compact vs expanded view
  onAddRole?: () => void;      // Open role assignment modal
}
```

**States:**
- **View Mode** — Non-organizers seeing roles (no edit buttons)
- **Edit Mode** — Organizer can change/remove roles
- **Loading** — Updating role assignment
- **Error** — Failed to update role
- **Success** — Role updated successfully

**Layout (Mobile):**
```
┌─────────────────────────────────────────┐
│ 👥 EVENT ROLES & RESPONSIBILITIES       │
├─────────────────────────────────────────┤
│                                         │
│ 📋 Organizer                            │
│ Mukurwe                                 │
│ Plans meeting, assigns roles            │
│ Status: Accepted ✓                      │
│ [Edit] [Remove]  (if organizer editing)│
│                                         │
│ 👥 Participant                          │
│ Solo                                    │
│ Attends & contributes                   │
│ Status: Assigned (awaiting)             │
│ [• Pending] [Remind]                    │
│                                         │
│ 🤝 Supporter                            │
│ Flamea                                  │
│ Provides resources                      │
│ Status: Accepted ✓                      │
│ [Edit] [Remove]                         │
│                                         │
│ [+ Add Another Role]  (if organizer)    │
│                                         │
└─────────────────────────────────────────┘
```

**Compact View:**
```
┌─────────────────────────────────────┐
│ Roles: 3 assigned                   │
│                                     │
│ 📋 Mukurwe (Organizer) ✓           │
│ 👥 Solo (Participant) ⏳            │
│ 🤝 Flamea (Supporter) ✓            │
│                                     │
└─────────────────────────────────────┘
```

**Interactions:**
- Tap role to see details
- Tap [Edit] to change role assignment
- Tap [Remove] to unassign role
- Tap [+ Add Role] to open assignment modal
- [Remind] sends notification to pending person

**Responsive Design:**
- **Mobile (< 640px):** Stacked layout, full-width
- **Tablet (640-1024px):** 2-column layout
- **Desktop (> 1024px):** 3-column layout

---

### Component 2: IncidentLogForm

**Purpose:** Quick form to log incidents with auto-escalation

**File:** `src/components/calendar/IncidentLogForm.tsx`

**Props:**
```typescript
interface IncidentLogFormProps {
  eventId?: string;              // If logging within existing event
  context: ContextLevel;         // Individual/Family/Community/Professional
  onSubmit: (data: IncidentFormData) => Promise<void>;
  onCancel?: () => void;
  autoFocus?: boolean;           // Focus first field on open
  readOnly?: boolean;            // View-only mode
}

interface IncidentFormData {
  type: 'incident';
  category: IncidentCategory;
  severity: SeverityLevel;
  title: string;
  description: string;
  location: string;
  context: ContextLevel;
  firstResponder?: string;
}
```

**States:**
- **Empty** — Initial form
- **Filling** — User entering data
- **Validating** — Checking required fields
- **Submitting** — Sending to server
- **Success** — Incident logged
- **Error** — Validation or submission error

**Mobile Layout (< 640px):**
```
┌──────────────────────────────┐
│ 🚨 LOG INCIDENT              │
├──────────────────────────────┤
│                              │
│ Category *                   │
│ [Select Category ▼]          │
│ ├─ Health                    │
│ ├─ Safety                    │
│ ├─ Property                  │
│ ├─ Emotional Support         │
│ └─ Other                     │
│                              │
│ Severity *                   │
│ [Critical ▼]                 │
│ ├─ Critical 🔴              │
│ ├─ High 🟠                  │
│ ├─ Medium 🟡                │
│ └─ Low 🟢                   │
│                              │
│ Title *                      │
│ [____________________]       │
│ (e.g., "Small fire in kit")  │
│                              │
│ Description * (required)     │
│ [____________________]       │
│ [____________________]       │
│ [____________________]       │
│ (What happened, details)     │
│                              │
│ Location *                   │
│ [____________________]       │
│ (Kitchen, 123 Main St)       │
│                              │
│ Context                      │
│ [Family ▼]                   │
│                              │
│ 📋 Will escalate:            │
│ Family (notified in 0 min)   │
│ ┌─ If not resolved in        │
│ │  30 min → Community        │
│                              │
│ [🚨 CRITICAL ESCALATE]       │
│ [Save & Notify Family]       │
│ [Cancel]                     │
│                              │
└──────────────────────────────┘
```

**Key Features:**
- Pre-filled context (auto-detect user's context level)
- Category icons for quick scanning
- Severity indicator with auto-escalation warning
- Character counter for description
- Location with map picker (optional)
- Real-time validation feedback
- Auto-save draft to localStorage

**Validation Rules:**
```
Title:           1-100 characters, required
Description:     10-2000 characters, required
Location:        1-200 characters, required
Category:        Required
Severity:        Required
Context:         Required
```

**Auto-Escalation Message:**
```
┌─────────────────────────────┐
│ ⚠️ AUTO-ESCALATION WARNING  │
│                             │
│ Severity: CRITICAL          │
│                             │
│ This will:                  │
│ ✓ Notify family immediately│
│ ✓ Escalate to community    │
│   if not resolved in 30 min │
│ ✓ Alert professional help  │
│   if still unresolved      │
│                             │
│ Are you sure? [Yes] [Edit] │
│                             │
└─────────────────────────────┘
```

---

### Component 3: AssistanceRequestCard

**Purpose:** Display and respond to assistance requests

**File:** `src/components/calendar/AssistanceRequestCard.tsx`

**Props:**
```typescript
interface AssistanceRequestCardProps {
  request: AssistanceRequest;
  event: EnhancedCalendarEvent;
  currentUserId: string;
  userRole: RoleType;
  onRespond: (status: 'offered' | 'declined', comment?: string) => Promise<void>;
  onComplete?: (request: AssistanceRequest) => Promise<void>;
}
```

**States:**
- **Open** — Request active, waiting for responses
- **Offered** — Someone offered to help
- **Accepted** — Help accepted by requestor
- **In Progress** — Help being provided
- **Completed** — Help provided, task done
- **Declined** — Request declined

**Mobile Layout:**
```
┌─────────────────────────────────┐
│ 🆘 ASSISTANCE NEEDED            │
├─────────────────────────────────┤
│                                 │
│ Who: Mukurwe                    │
│ When: Today by 3:00 PM          │
│ What: Setup/Decorations         │
│                                 │
│ "Need help with balloons and    │
│  streamers for the party"       │
│                                 │
│ Priority: HIGH                  │
│ Status: 🟡 Open (2 hours left)  │
│                                 │
│ Responses:                      │
│ Flamea: "I can help! ✓"        │
│ Solo: "Can help until 3pm"     │
│ Other: "Not available"         │
│                                 │
│ [✓ Offer Help] [✗ Can't Help]  │
│                                 │
│ Your Response (if not responded):
│ [_________________]             │
│ (Optional comment)              │
│                                 │
│ [Send Response]                 │
│                                 │
└─────────────────────────────────┘
```

**Responder View (When helping):**
```
┌─────────────────────────────────┐
│ 🆘 Helping with: Decorations    │
├─────────────────────────────────┤
│                                 │
│ Status: ✓ Accepted by Mukurwe   │
│                                 │
│ What to do:                     │
│ • Bring balloons (blue & green) │
│ • Bring streamers & ribbons     │
│ • Arrive by 2:00 PM             │
│                                 │
│ Contact: [Call] [Message]       │
│                                 │
│ [Mark Complete]                 │
│                                 │
│ When done:                      │
│ Mukurwe will be notified        │
│ and can thank you!              │
│                                 │
└─────────────────────────────────┘
```

---

### Component 4: PollCreationForm

**Purpose:** Create voting polls attached to events

**File:** `src/components/calendar/PollCreationForm.tsx`

**Props:**
```typescript
interface PollCreationFormProps {
  eventId: string;
  onSubmit: (poll: Poll) => Promise<void>;
  onCancel?: () => void;
  defaultType?: PollType;
}
```

**Mobile Layout:**
```
┌──────────────────────────────┐
│ 📊 CREATE POLL               │
├──────────────────────────────┤
│                              │
│ Question *                   │
│ [____________________]       │
│ e.g., "Which date works?"   │
│                              │
│ Poll Type *                  │
│ ○ Single Choice              │
│   (Only one answer)          │
│                              │
│ ○ Multiple Choice            │
│   (Many answers)             │
│                              │
│ ○ Ranking                    │
│   (Order by preference)      │
│                              │
│ Add Options                  │
│ [____________________] ✕     │
│ Option 1: "Saturday Nov 15"  │
│                              │
│ [____________________] ✕     │
│ Option 2: "Sunday Nov 16"    │
│                              │
│ [____________________] ✕     │
│ Option 3: "Saturday Nov 22"  │
│                              │
│ [+ Add Option]               │
│ (Max 10 options)             │
│                              │
│ Voting Deadline              │
│ Date: [Nov 8, 2025]          │
│ Time: [5:00 PM]              │
│                              │
│ Anonymous Voting             │
│ [☑] Hide who voted           │
│                              │
│ [Create Poll] [Cancel]       │
│                              │
└──────────────────────────────┘
```

**Features:**
- Drag-to-reorder options
- Character limit per option (100 chars)
- Date/time picker for deadline
- Preview of poll before creation
- Template suggestions ("When?", "Theme?", etc.)

---

### Component 5: PollVotingCard

**Purpose:** Interface for users to vote on polls

**File:** `src/components/calendar/PollVotingCard.tsx`

**Props:**
```typescript
interface PollVotingCardProps {
  poll: Poll;
  currentUserId: string;
  onVote: (choice: string | string[]) => Promise<void>;
  onShowResults?: () => void;
}
```

**Single Choice View:**
```
┌────────────────────────────┐
│ 📊 When should we party?   │
├────────────────────────────┤
│                            │
│ ○ Saturday, Nov 15         │
│   3 votes (42%)            │
│                            │
│ ○ Sunday, Nov 16           │
│   5 votes (70%) ← WINNING  │
│                            │
│ ○ Saturday, Nov 22         │
│   1 vote (14%)             │
│                            │
│ Your vote: Sunday ✓        │
│                            │
│ [Change Vote] [Results]    │
│                            │
│ Deadline: Sat, Nov 8, 5pm  │
│ 3 people haven't voted yet │
│                            │
└────────────────────────────┘
```

**Multiple Choice View:**
```
┌────────────────────────────┐
│ 📊 Party Activities        │
├────────────────────────────┤
│ (Select all that apply)    │
│                            │
│ ☐ Cake & food (5 votes)   │
│ ☐ Music/DJ (4 votes)      │
│ ☑ Games (6 votes)         │
│ ☐ Sports (2 votes)        │
│ ☐ Movie (1 vote)          │
│                            │
│ Your votes: Games ✓        │
│                            │
│ [Submit] [Clear] [Results] │
│                            │
└────────────────────────────┘
```

**Ranking View:**
```
┌────────────────────────────┐
│ 📊 Rank Activities         │
├────────────────────────────┤
│ (Drag to reorder)          │
│                            │
│ 1st ≡ Games                │
│ 2nd ≡ Cake                 │
│ 3rd ≡ Music                │
│ 4th ≡ Sports               │
│                            │
│ [Saved] [Change] [Results] │
│                            │
└────────────────────────────┘
```

---

### Component 6: PollResultsDisplay

**Purpose:** Show poll results and voting statistics

**File:** `src/components/calendar/PollResultsDisplay.tsx`

**Props:**
```typescript
interface PollResultsDisplayProps {
  poll: Poll;
  showWinner?: boolean;        // Highlight winning option
  showPercentages?: boolean;   // Show % vs vote count
  currentUserVote?: string;    // Highlight user's vote
  allowChangeVote?: boolean;   // Can user change vote?
}
```

**Single Choice Results:**
```
┌──────────────────────────────┐
│ 📊 Results: When?            │
├──────────────────────────────┤
│                              │
│ ✓ Sunday, Nov 16 [WINNER]   │
│ ████████████████████ 71%     │
│ 5 out of 7 votes             │
│                              │
│ Saturday, Nov 15             │
│ ███████░░░░░░░░░░░░ 29%     │
│ 2 out of 7 votes             │
│                              │
│ Saturday, Nov 22             │
│ ░░░░░░░░░░░░░░░░░░░░ 0%     │
│ 0 votes                      │
│                              │
│ Final Results!               │
│ Voting ended Nov 8, 5pm      │
│ Participation: 71% (5 of 7)  │
│                              │
│ [Change My Vote] [Done]      │
│                              │
└──────────────────────────────┘
```

**Visual Elements:**
- Progress bar for each option
- Vote count and percentage
- Visual indication of winning option
- Participation rate
- Anonymous voting indicator
- Date/time poll closed

---

### Component 7: EventStatusDashboard

**Purpose:** Overview of event status, progress, and next steps

**File:** `src/components/calendar/EventStatusDashboard.tsx`

**Props:**
```typescript
interface EventStatusDashboardProps {
  event: EnhancedCalendarEvent;
  currentUserId: string;
  compact?: boolean;           // Full or card view
  onStatusUpdate?: (newStatus: EventStatus) => void;
}
```

**Full Dashboard (Activity):**
```
┌────────────────────────────────────┐
│ FAMILY DINNER PARTY - Nov 22       │
├────────────────────────────────────┤
│                                    │
│ STATUS                             │
│ ▓▓▓▓░░░░ PLANNED (3 days)         │
│ Created Oct 19 | Updated Oct 22    │
│                                    │
│ ROLES                              │
│ ✓ Organizer: Mukurwe              │
│ ⏳ Participant: Solo               │
│ ✓ Supporter: Flamea                │
│ 2/3 Roles Confirmed                │
│                                    │
│ DECISIONS                          │
│ ✓ Date: Sunday Nov 16              │
│ ✓ Theme: Sports                    │
│ ✓ Location: Home                   │
│ All Polls Closed                   │
│                                    │
│ HELP NEEDED                        │
│ 🆘 Decorations (2 offered)         │
│ 🆘 Music (1 offered)               │
│ 🆘 Cake (1 offered)                │
│ 3/3 Help Requests Covered          │
│                                    │
│ NEXT STEPS                         │
│ 1. Solo to confirm participation   │
│ 2. Finalize guest list             │
│ 3. Confirm catering                │
│                                    │
│ [Mark Ready] [View Checklist]      │
│                                    │
└────────────────────────────────────┘
```

**Incident Dashboard:**
```
┌────────────────────────────────────┐
│ 🚨 KITCHEN FIRE - Oct 22, 2:30 PM │
├────────────────────────────────────┤
│                                    │
│ STATUS                             │
│ 🔴 CRITICAL - IN PROGRESS          │
│ Logged 2:30 PM | Still Active      │
│                                    │
│ SEVERITY                           │
│ ▓▓▓▓▓░░░░ CRITICAL                │
│                                    │
│ ESCALATION                         │
│ ✓ Individual (reported)            │
│ ✓ Family (notified)                │
│ → Community (if not resolved      │
│    in 30 min)                      │
│                                    │
│ RESPONDERS                         │
│ ✓ Flamea (First Aider)             │
│ 📞 Standing by                     │
│                                    │
│ ACTIONS TAKEN                      │
│ ✓ Power cut off (2:31 PM)         │
│ ✓ Family notified (2:32 PM)       │
│ ✓ Electrician called (2:45 PM)    │
│                                    │
│ RESOLUTION                         │
│ 🟡 In Progress...                  │
│ Waiting for electrician            │
│ Estimated time: 15 min             │
│                                    │
│ [Mark Resolved] [Add Update]       │
│                                    │
└────────────────────────────────────┘
```

---

### Component 8: EscalationPathTracker

**Purpose:** Show incident escalation history and current level

**File:** `src/components/calendar/EscalationPathTracker.tsx`

**Props:**
```typescript
interface EscalationPathTrackerProps {
  event: EnhancedCalendarEvent;
  currentLevel: ContextLevel;
  escalationPath: EscalationEntry[];
  canEscalate?: boolean;
  onEscalate?: (reason: string) => Promise<void>;
}
```

**Timeline View:**
```
┌──────────────────────────────────┐
│ ESCALATION TIMELINE              │
├──────────────────────────────────┤
│                                  │
│ 2:30 PM                          │
│ ● Incident Logged (Individual)   │
│   "Kitchen fire - power cut"     │
│   by Mukurwe                     │
│                                  │
│ 2:32 PM ↓ ESCALATE              │
│ ● Family Notified                │
│   "Fire detected, family alerted"│
│   Auto-escalated (Critical)      │
│   Responders: Flamea, Solo       │
│                                  │
│ 2:45 PM ↓ STATUS UPDATE         │
│ ● In Progress                    │
│   "Electrician called"           │
│   by Flamea                      │
│                                  │
│ 🔄 CURRENT LEVEL: Family         │
│ Next Escalation: Community       │
│ If not resolved by: 3:00 PM     │
│ Time remaining: 12 minutes       │
│                                  │
│ [Manual Escalate] [Add Note]     │
│                                  │
└──────────────────────────────────┘
```

**Visual Hierarchy:**
```
INDIVIDUAL ──→ FAMILY ──→ COMMUNITY ──→ PROFESSIONAL
  ●            ●          ◯            ◯
  ✓ Logged    ✓ Active   - Standby    - Standby
```

---

### Component 9: IncidentResolutionForm

**Purpose:** Record how an incident was resolved

**File:** `src/components/calendar/IncidentResolutionForm.tsx`

**Props:**
```typescript
interface IncidentResolutionFormProps {
  event: EnhancedCalendarEvent;
  onSubmit: (notes: string, followUpRequired: boolean) => Promise<void>;
  onCancel?: () => void;
}
```

**Mobile Layout:**
```
┌────────────────────────────────┐
│ ✓ INCIDENT RESOLVED            │
├────────────────────────────────┤
│                                │
│ Incident: Kitchen Fire         │
│ Duration: 27 minutes           │
│ Severity: Critical             │
│ Status: Resolved               │
│                                │
│ How was it resolved?           │
│ Outlet was defective.          │
│ Electrician replaced it.       │
│ All safe now.                  │
│                                │
│ Resolution Notes *             │
│ [____________________]         │
│ [____________________]         │
│ [____________________]         │
│ (What was done, outcome)       │
│                                │
│ Resolved By                    │
│ [Select Person ▼]              │
│ ├─ Flamea (First Aider)        │
│ ├─ Electrician (Contractor)    │
│ └─ Other                       │
│                                │
│ Follow-Up Required?            │
│ ☑ Schedule outlet inspection   │
│ ☐ Contact insurance            │
│ ☐ File report                  │
│                                │
│ Next Steps                     │
│ [____________________]         │
│ (e.g., "Schedule Monday")      │
│                                │
│ [Mark Resolved] [Cancel]       │
│                                │
└────────────────────────────────┘
```

---

## Part 3: Mobile-First Design Guidelines

### Touch Targets
- Minimum: 44px × 44px (WCAG AAA)
- Comfortable: 56px × 56px (preferred)
- Spacing between targets: ≥8px

### Responsive Breakpoints
```css
Small (< 640px):      Mobile phones, single column
Medium (640-1024px):  Tablets, 2-column layout
Large (> 1024px):     Desktops, 3-column layout
```

### Safe Areas (notch-aware)
```css
/* Safe insets for phone notch */
padding: env(safe-area-inset-top) env(safe-area-inset-right) 
         env(safe-area-inset-bottom) env(safe-area-inset-left);
```

### Thumb Zone (Mobile)
```
┌─────────────────────┐
│ ▒ Hard to reach     │  Top (hard)
│                     │
│ ░ Easy to reach     │  Middle (easy)
│                     │
│ ░ Thumbs naturally  │  Bottom (natural)
│ ░ reach here        │
└─────────────────────┘
```
Place primary actions in natural/easy zones.

---

## Part 4: Accessibility Standards

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text: ≥4.5:1 ratio (normal text)
- Text: ≥3:1 ratio (large text ≥18px)
- UI Components: ≥3:1 ratio

**Keyboard Navigation:**
- Tab order logical and intuitive
- All interactive elements accessible via keyboard
- Focus indicators visible (≥2px outline)
- Escape key closes modals

**Screen Reader Support:**
- Semantic HTML (button, link, form, etc.)
- ARIA labels for icon-only buttons
- Form labels associated with inputs
- Status updates use aria-live

**Text Readability:**
- Maximum line length: 80 characters
- Line height: ≥1.5 for body text
- Font size: ≥16px for body text
- Option to increase text size: ≤200%

**Color Not Alone:**
- Use icons/text in addition to color
- Status indicated by shape/text, not just color
- Green/red colorblind safe

---

## Part 5: State Management & Data Flow

### Component State Architecture

```typescript
// Local component state
const [formData, setFormData] = useState<IncidentFormData>();
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);

// Global state (Context or Redux)
const { user } = useAuth();
const { event } = useCalendarEvent();
const { roles, permissions } = useCalendarRoles();

// Side effects
useEffect(() => {
  // Load data when component mounts
  loadIncidentData();
}, [eventId]);
```

### Error States

```typescript
// Validation error
{error && (
  <div className="alert alert-danger" role="alert">
    <span aria-label="error">⚠️</span> {error}
    <button onClick={() => setError(null)}>Dismiss</button>
  </div>
)}

// Network error
{networkError && (
  <div className="alert alert-warning">
    Connection lost. Retrying...
    <button onClick={retry}>Retry Now</button>
  </div>
)}
```

---

## Part 6: User Interaction Patterns

### Loading States

```typescript
{isLoading ? (
  <div className="skeleton-loader">
    <div className="skeleton-line"></div>
    <div className="skeleton-line"></div>
    <div className="skeleton-button"></div>
  </div>
) : (
  <div>Content</div>
)}
```

### Empty States

```
┌────────────────────────────┐
│ 📭 No Roles Assigned Yet   │
├────────────────────────────┤
│                            │
│ This event needs roles to  │
│ be organized successfully. │
│                            │
│ Add people to help out:    │
│ • Organizer (plan it)      │
│ • Participants (attend it) │
│ • Supporters (help out)    │
│                            │
│ [+ Assign First Role]      │
│                            │
└────────────────────────────┘
```

### Success Feedback

```
┌────────────────────┐
│ ✓ Incident Logged! │
│                    │
│ Family notified    │
│ Responders alerted │
│                    │
│ [Close] [Details]  │
│                    │
└────────────────────┘
```

---

## Part 7: Error Handling & Edge Cases

### Network Failures

```typescript
// Retry with exponential backoff
const retry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
};
```

### Offline Support

```typescript
// Save draft to localStorage
const saveDraft = (formData) => {
  localStorage.setItem('incident_draft', JSON.stringify(formData));
};

// Restore on reload
const draft = localStorage.getItem('incident_draft');
if (draft) {
  setFormData(JSON.parse(draft));
  showNotification('Draft restored');
}

// Clear after successful submission
localStorage.removeItem('incident_draft');
```

### Permission Edge Cases

```typescript
// User not organizer, can't edit
if (!userHasPermission(event, userId, Permission.EDIT)) {
  return <p>You don't have permission to edit this event.</p>;
}

// Role-based visibility
{userHasPermission(event, userId, Permission.ESCALATE) && (
  <button onClick={escalate}>Escalate Incident</button>
)}
```

---

## Part 8: Animation & Feedback Patterns

### Smooth Transitions

```css
/* Fade in/out */
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms ease-in;
}

/* Slide up */
.slide-up {
  animation: slideUp 400ms ease-out;
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Loading spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.spinner {
  animation: spin 1s linear infinite;
}
```

### Toast Notifications

```typescript
// Success
toast.success('Event created!', {
  duration: 3000,
  position: 'bottom-center'
});

// Error
toast.error('Failed to save incident', {
  duration: 5000,
  action: <button>Retry</button>
});

// Info
toast.info('Syncing with family...', {
  duration: Infinity  // Until dismissed
});
```

---

## Implementation Priority (Phase 1-3)

### Phase 1 (Nov 1)
1. RoleAssignmentCard ✓
2. IncidentLogForm ✓
3. AssistanceRequestCard ✓
4. EventStatusDashboard (basic)

### Phase 2 (Nov 15)
1. PollCreationForm ✓
2. PollVotingCard ✓
3. PollResultsDisplay ✓
4. EventStatusDashboard (advanced)

### Phase 3 (Nov 29)
1. EscalationPathTracker ✓
2. IncidentResolutionForm ✓
3. Advanced animations & transitions

---

## Success Criteria

✅ All components WCAG 2.1 AA compliant  
✅ Touch-friendly on mobile (44px+ targets)  
✅ Zero layout shifts (Cumulative Layout Shift < 0.1)  
✅ < 100ms interaction feedback  
✅ Works offline with graceful degradation  
✅ Family can use without technical training  
✅ All error states handled gracefully  
✅ 95%+ code coverage in components  

---

**Ready to implement components. Let's build! 🚀**
