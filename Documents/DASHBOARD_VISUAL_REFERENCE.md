# The Hub Dashboard - Visual Reference & Component Guide

**Status:** Planning  
**Date:** October 18, 2025  
**Purpose:** Visual guide for dashboard optimization

---

## Dashboard Layout Visualizations

### Desktop Layout (1400px+)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          THE HUB DASHBOARD HEADER                          │
│  [H Logo] The Hub        [Search Bar]              [User Avatar ▼]        │
│  Salatiso Ecosystem                                                         │
│                                                                              │
│  [👤 Personal] [💼 Business] [🏠 Family] [⚙️ Admin]                       │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (280px)     │                MAIN CONTENT (>1120px)               │
│                     │                                                       │
│ 🏠 Dashboard ✓      │  ┌─────────────────────────┬──────────────┐         │
│ 📊 LifeCV           │  │   Welcome Widget        │  Sonny       │         │
│ 🔄 LifeSync    [3]  │  │   (Emphasized in       │  Network     │         │
│ ─────────────────   │  │   Personal Context)    │  Status      │         │
│ 👨‍👩‍👧‍👦 Family Value  │  │                         │              │         │
│ 🔥 Flamea           │  └─────────────────────────┴──────────────┘         │
│ 🏡 eKhaya           │                                                       │
│ 🚗 PigeeBack        │  ┌──────────────┬──────────────┬──────────────┐    │
│ ─────────────────   │  │ Family       │ Quick        │ Learning     │    │
│ 💼 BizHelp          │  │ Activity     │ Actions      │ Progress     │    │
│ 🛡️ SafetyHelp       │  │ (6 cols)     │ (6 cols)     │ (6 cols)     │    │
│ 💰 FinHelp          │  │              │              │              │    │
│ 📄 DocuHelp         │  └──────────────┴──────────────┴──────────────┘    │
│ 👥 HRHelp           │                                                       │
│ ⚖️ LegalHelp         │  ┌──────────────┬──────────────┬──────────────┐    │
│ 📣 PubHelp          │  │ Ecosystem    │ Gamification │ MNI Profile  │    │
│ ─────────────────   │  │ Health       │ (4 cols)     │ (4 cols)     │    │
│ 🎓 Sazi Academy     │  │ (4 cols)     │              │              │    │
│ ─────────────────   │  └──────────────┴──────────────┴──────────────┘    │
│ 🏢 MNI Intranet     │                                                       │
│ ─────────────────   │  ┌────────────────────────────────────────────────┐ │
│                     │  │ Career Progress (6 cols) │ Notifications (6 cols)│ │
│ [SM] Salatiso Mdeni │  │                          │                      │ │
│ salatiso@mni.co.za  │  └────────────────────────────────────────────────┘ │
│                     │                                                       │
└────────────────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (768px - 1399px)

```
┌─────────────────────────────────────────────────────────────────┐
│                   THE HUB DASHBOARD HEADER                      │
│  [H] The Hub                          [User Avatar]             │
│                                                                  │
│  [👤 Personal] [💼 Business] [🏠 Family]                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ [≡] Hamburger (when closed)                                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Welcome Widget (Full Width)                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Sonny Network Status (Full Width)                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Family Activity (Full Width)                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Quick Actions (Full Width)                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌──────────────────────────────────────┐
│ [≡] The Hub       [Search]  [Avatar] │
│                                      │
│ [👤] [💼] [🏠] [⚙️]               │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Welcome Widget                       │
│ (Full Width, Stacked Vertically)     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Sonny Status                         │
│ (Full Width)                         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Family Activity                      │
│ (Full Width)                         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Quick Actions                        │
│ (Full Width, 2x2 Grid)               │
└──────────────────────────────────────┘

[Sidebar Navigation Drawer - Swipeable from left]
```

---

## Context Switching Flow

### Personal Context (Default)

```
┌─ PERSONAL CONTEXT ─────────────────────┐
│ Focus: Individual growth & wellness    │
│                                         │
│ EMPHASIZED Widgets (Large):            │
│ • Welcome (Personalized greeting)      │
│ • Personal Finance                     │
│ • Learning Progress                    │
│ • Safety & Well-being                  │
│                                         │
│ DE-EMPHASIZED (Smaller):               │
│ • Business Performance (0.6 opacity)   │
│ • MNI Ownership (0.6 opacity)          │
│                                         │
│ UNIVERSAL (Always visible):            │
│ • LifeCV Strength                      │
│ • Trust Scores                         │
│ • Quick Actions                        │
│ • Notifications                        │
│ • Sonny Network (if applicable)        │
└─────────────────────────────────────────┘

Animation: 700ms smooth transition
└─> Fade out (200ms) → Reflow (300ms) → Fade in (200ms)
```

### Business Context

```
┌─ BUSINESS CONTEXT ────────────────────┐
│ Focus: Business operations & revenue  │
│                                        │
│ EMPHASIZED Widgets (Large):           │
│ • Welcome (Business perspective)      │
│ • Business Performance                │
│ • Recent Documents                    │
│ • MNI Ownership (if applicable)       │
│                                        │
│ DE-EMPHASIZED (Smaller):              │
│ • Personal Finance (0.6 opacity)      │
│ • Learning Progress (0.6 opacity)     │
│                                        │
│ UNIVERSAL (Always visible):           │
│ • LifeCV Strength                     │
│ • Trust Scores                        │
│ • Quick Actions                       │
│ • Notifications                       │
└────────────────────────────────────────┘
```

### Family Context

```
┌─ FAMILY CONTEXT ──────────────────────┐
│ Focus: Family coordination & goals    │
│                                        │
│ EMPHASIZED Widgets (Large):           │
│ • Welcome (Family perspective)        │
│ • Family Dashboard                    │
│ • Family Governance                   │
│ • MNI Ownership (if applicable)       │
│                                        │
│ DE-EMPHASIZED (Smaller):              │
│ • Business Performance (0.6 opacity)  │
│ • Personal Finance (0.6 opacity)      │
│                                        │
│ UNIQUE (Family only):                 │
│ • Family Activity                     │
│ • Shared Goals Progress               │
│ • Family Governance Calendar          │
└────────────────────────────────────────┘
```

### Admin Context (Superuser)

```
┌─ ADMIN CONTEXT ───────────────────────┐
│ Focus: Ecosystem management           │
│                                        │
│ VISIBLE: ALL WIDGETS                  │
│ (100% of features for superuser)      │
│                                        │
│ ADDITIONAL ADMIN WIDGETS:             │
│ • System Health Monitor               │
│ • User Management                     │
│ • Subscription Management             │
│ • Audit Logs                          │
│ • Database Status                     │
│                                        │
│ ACCESS: Full read/write to all data   │
└────────────────────────────────────────┘
```

---

## Widget Composition Reference

### Universal Widgets (All Contexts)

```
WIDGET 1: Welcome Widget
┌────────────────────────────────────────┐
│ Welcome back, Salatiso! 👋              │
│                                         │
│ You have 5 pending actions and 3 new   │
│ notifications across your ecosystem     │
│                                         │
│ Ubuntu: "I am because we are"         │
└────────────────────────────────────────┘
Data: User name, time-based greeting, motivational message
Update: Real-time, every load

WIDGET 2: LifeCV Strength
┌────────────────────────────────────────┐
│ LifeCV Strength      📊                │
│                                         │
│         ┌─────────────┐                │
│         │    75%      │                │
│         │   Strong    │                │
│         └─────────────┘                │
│                                         │
│ Complete 3 more sections to reach      │
│ Expert level                           │
│                                         │
│ [Update LifeCV Button]                │
└────────────────────────────────────────┘
Data: Strength %, label, next milestone
Update: Real-time from LifeCV service

WIDGET 3: Trust Scores
┌────────────────────────────────────────┐
│ Trust Scores      🛡️                   │
│                                         │
│ Ecosystem  [████████░░░░░░]  85        │
│ Family     [██████████░░░░░]  92        │
│ Business   [██████░░░░░░░░░░]  78      │
│ Learning   [████████░░░░░░░░]  88      │
│                                         │
│ [View Details Button]                 │
└────────────────────────────────────────┘
Data: 4 trust scores with labels
Update: Real-time from trust service

WIDGET 4: Quick Actions
┌────────────────────────────────────────┐
│ Quick Actions      ⚡                  │
│                                         │
│ [📝 Update]  [📄 Create]              │
│ [LifeCV]      [Document]              │
│                                         │
│ [💼 New]     [🎓 Start]               │
│ [Business]   [Course]                 │
│                                         │
│ [+ Add Custom Action]                 │
└────────────────────────────────────────┘
Data: Context-aware action list
Update: Static unless customized

WIDGET 5: Notifications
┌────────────────────────────────────────┐
│ Notifications      🔔                  │
│                                         │
│ LifeSync Invitation [2h ago]          │
│ Sarah sent you a business sync request │
│                                         │
│ Document Signature [5h ago]            │
│ Partnership agreement needs review     │
│                                         │
│ Family Council [1d ago]                │
│ Meeting agenda published               │
│                                         │
│ [Load More]                           │
└────────────────────────────────────────┘
Data: Recent notifications with timestamps
Update: Real-time from notification service

WIDGET 6: Sonny Network
┌────────────────────────────────────────┐
│ Sonny Network      🌐                  │
│                                         │
│ 🟢 YOU ARE ONLINE                     │
│ Status: Visible to all contacts       │
│                                         │
│ Family Members:                        │
│ 🟢 Mom - Online (2h ago)              │
│ 🔴 Dad - Offline (12h ago)            │
│ 🔴 Sister - Offline (1d ago)          │
│                                         │
│ [Safety Settings]                     │
└────────────────────────────────────────┘
Data: User status + contacts' presence
Update: Real-time from Sonny service
```

### Personal Context Widgets

```
WIDGET 7: Personal Finance
┌────────────────────────────────────────┐
│ Personal Finance   💰                  │
│                                         │
│ Net Worth: R125,000    Savings: R8,500 │
│                                         │
│ Budget Health: 92%                     │
│ [████████████░░░░░░░░░░░░░░░░]       │
│                                         │
│ Recent Transactions (3):               │
│ • Salary Deposit +R50,000 (Oct 15)    │
│ • Grocery Shopping -R1,200 (Oct 14)   │
│ • Electricity Bill -R850 (Oct 12)     │
│                                         │
│ [View Full Details]                   │
└────────────────────────────────────────┘

WIDGET 8: Learning Progress
┌────────────────────────────────────────┐
│ Learning Progress   📚                 │
│                                         │
│ Business Fundamentals     75%           │
│ [██████████████░░░░░░░░░░░░]          │
│                                         │
│ Financial Literacy        60%           │
│ [████████░░░░░░░░░░░░░░░░░░░░░░]     │
│                                         │
│ Ubuntu Leadership         90%           │
│ [██████████████████░░░░]               │
│                                         │
│ [Continue Learning]                   │
└────────────────────────────────────────┘

WIDGET 9: Safety & Well-being
┌────────────────────────────────────────┐
│ Safety & Well-being   🛡️               │
│                                         │
│ Active Geofences: 3                    │
│ Last Check-in: 2 hours ago             │
│ SEAL Events: None                      │
│                                         │
│ Emergency Contacts: 5                  │
│ Follow Me Home: Not active             │
│                                         │
│ Status: ✅ You're safe                 │
│ [Enable Follow Me Home] [Settings]    │
└────────────────────────────────────────┘
```

### Business Context Widgets

```
WIDGET 10: Business Performance
┌────────────────────────────────────────┐
│ Business Performance   📈               │
│                                         │
│ Revenue (YTD): R450,000  |  Clients: 12 │
│                                         │
│ Business Health: 85%                   │
│ [████████████░░░░░░░░░░░░░░░░]       │
│                                         │
│ Key Metrics:                           │
│ • Average Deal Size: R37,500           │
│ • Win Rate: 65%                        │
│ • Pipeline: R1.2M                      │
│                                         │
│ [View Full Dashboard]                 │
└────────────────────────────────────────┘

WIDGET 11: Recent Documents
┌────────────────────────────────────────┐
│ Recent Documents   📁                  │
│                                         │
│ Business Plan 2025                     │
│ Modified 3 days ago [Download]        │
│                                         │
│ Client Contract - XYZ Corp             │
│ Modified 1 week ago [Review]          │
│                                         │
│ IP Assignment Agreement                │
│ Modified 2 weeks ago [Sign]           │
│                                         │
│ [Browse All Documents]                │
└────────────────────────────────────────┘

WIDGET 12: MNI Ownership (Business)
┌────────────────────────────────────────┐
│ MNI Ownership   🏢                      │
│                                         │
│ Your Holdings:    40% | Company: 60%  │
│                                         │
│ Buy-back Progress: 35%                 │
│ [███████░░░░░░░░░░░░░░░░░░░░░░]     │
│                                         │
│ Next Milestone: R1.2M contribution     │
│ Target Date: Dec 31, 2025              │
│                                         │
│ [View Contribution History]            │
└────────────────────────────────────────┘
```

### Family Context Widgets

```
WIDGET 13: Family Dashboard
┌────────────────────────────────────────┐
│ Family Dashboard   👨‍👩‍👧‍👦               │
│                                         │
│ Family Net Worth: R2.8M  |  Members: 8 │
│                                         │
│ Shared Goals Progress: 68%              │
│ [█████████████░░░░░░░░░░░░░░░░░░]   │
│                                         │
│ Recent Activity:                       │
│ • Mom updated Financial Goal           │
│ • Solo registered MNI (completed)      │
│ • Family Council meeting scheduled     │
│                                         │
│ [View Family Page]                    │
└────────────────────────────────────────┘

WIDGET 14: Family Governance
┌────────────────────────────────────────┐
│ Family Governance   ⚖️                  │
│                                         │
│ Next Council Meeting                   │
│ October 25, 2025 - 6:00 PM             │
│ [Add to Calendar]                      │
│                                         │
│ Pending Decisions: 2 items             │
│ • New Business Initiative (voting)     │
│ • Family Charter Amendment (voting)    │
│                                         │
│ [View All Governance Items]            │
└────────────────────────────────────────┘
```

---

## Color Palette (Tailwind + Custom Variables)

```css
:root {
  /* Primary Colors */
  --primary-blue: #1E3A8A;
  --ubuntu-orange: #EA580C;
  --success-green: #10B981;
  --warning-amber: #F59E0B;
  --lifecv-purple: #7C3AED;
  
  /* Backgrounds */
  --bg-primary: #F9FAFB;      /* Light gray background */
  --bg-secondary: #FFFFFF;    /* White for cards */
  
  /* Text */
  --text-primary: #111827;    /* Dark gray for main text */
  --text-secondary: #6B7280;  /* Medium gray for secondary text */
  
  /* Borders */
  --border-color: #E5E7EB;    /* Light gray for borders */
  
  /* Transitions */
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark Mode */
body.dark-mode {
  --bg-primary: #111827;
  --bg-secondary: #1F2937;
  --text-primary: #F9FAFB;
  --text-secondary: #9CA3AF;
  --border-color: #374151;
}

/* Kids Mode */
body.kids-mode {
  --primary-blue: #3B82F6;      /* Brighter blue */
  --ubuntu-orange: #FB923C;     /* Brighter orange */
  --success-green: #34D399;     /* Brighter green */
  font-family: 'Comic Sans MS', cursive, sans-serif;
}
```

---

## Keyboard Shortcuts Reference

```
NAVIGATION:
  Ctrl + B    Toggle Sidebar (collapse/expand)
  Ctrl + D    Toggle Dark Mode
  Ctrl + K    Show Keyboard Shortcuts Guide
  
CONTEXT SWITCHING:
  Ctrl + 1    Switch to Personal Context
  Ctrl + 2    Switch to Business Context
  Ctrl + 3    Switch to Family Context
  Ctrl + 4    Switch to Admin Context (if authorized)

QUICK ACTIONS:
  Ctrl + N    New (context-dependent)
  Ctrl + S    Search
  Ctrl + /    Help/Support
```

---

## Responsive Breakpoints

```
Mobile:     < 640px   (1 column, stacked layout)
Tablet:     640px-1024px (2 columns, adjusted grid)
Desktop:    1025px-1400px (3 columns, full grid)
Full:       > 1400px (4 columns + sidebar + expanded widgets)

Widget Sizing Rules:
Mobile:     All 1 col, 100% width
Tablet:     Mix 1-2 cols
Desktop:    Mix 1-3 cols
Full:       Mix 1-4 cols (with sidebar 280px fixed)

Sidebar:
- Desktop +: 280px fixed (collapsible to 80px)
- Tablet/Mobile: Hidden (hamburger menu)
```

---

## Interaction States

### Button States

```
DEFAULT: Gray border, light background
HOVER:   Darker background, subtle shadow
ACTIVE:  Blue background, white text, indicator
DISABLED: Grayed out, cursor not-allowed

CONTEXT BUTTONS:
┌──────────────────────┐
│ Default State:       │
│ [👤 Personal]        │
│ (Gray border, light) │
│                      │
│ Active State:        │
│ [💼 Business] ✓      │
│ (Blue bg, underline) │
└──────────────────────┘
```

### Widget Emphasis States

```
EMPHASIZED (Active Context):
- grid-column: span 2 (on desktop)
- opacity: 1
- border-color: primary-blue
- shadow: elevated (0 8px 24px)

DE-EMPHASIZED (Inactive Context):
- opacity: 0.6
- transform: scale(0.98)
- shadow: normal

HIDDEN (Not relevant to context):
- display: none (removed from flow)
- OR opacity: 0 (kept in flow, based on preference)
```

---

## Animation Timings

```
CONTEXT TRANSITION (Total: 700ms):
1. Fade out        (200ms) - All widgets fade to 0.7 opacity
2. Reflow          (300ms) - Grid reflows, widgets resize
3. Fade in         (200ms) - Widgets fade back to full opacity

WIDGET HOVER:
- Transform: translateY(-2px)
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

SIDEBAR COLLAPSE:
- Width transition: 280px → 80px
- Duration: 300ms
- Labels fade out simultaneously

DARK MODE TOGGLE:
- All color properties: 300ms transition
- No layout shift
- Smooth fade between colors
```

---

## Kids Mode Special Effects

```
WELCOME BANNER (Kids Mode):
- Background: Rainbow gradient (3-color)
- Animation: Rainbow glow effect (3s loop)
  └─> Pulse between blue, purple, pink
- Font: 'Comic Sans MS' or 'Fredoka One'
- Emojis: Larger, more playful

BUTTONS (Kids Mode):
- Border-radius: 20px (very rounded)
- Font-size: 1.1rem (bigger)
- Border-width: 3px (thicker)
- Hover: Scale(1.02) + translateY(-4px)

WIDGETS (Kids Mode):
- Border-radius: 20px
- Hover: Scale(1.02) + translateY(-4px)
- Icons: 1.5rem font-size

INTERACTIONS:
- All clicks have visual feedback
- Animations slightly exaggerated
- Celebratory effects on achievements
```

---

## Error & Loading States

```
LOADING:
┌────────────────────────────────────────┐
│ ⏳ Loading your dashboard...            │
│ [Spinner animation]                    │
└────────────────────────────────────────┘

ERROR:
┌────────────────────────────────────────┐
│ ⚠️ Error Loading Widget                 │
│                                         │
│ Something went wrong. Please try again  │
│                                         │
│ [Retry Button]                         │
└────────────────────────────────────────┘

EMPTY STATE:
┌────────────────────────────────────────┐
│ 📭 No Notifications                     │
│                                         │
│ You're all caught up!                  │
│                                         │
│ [Browse Other Widgets]                 │
└────────────────────────────────────────┘
```

---

## Accessibility Considerations

```
COLOR CONTRAST:
- WCAG AAA compliant (7:1 minimum)
- Dark mode equally accessible
- Color not only indicator of state

KEYBOARD NAVIGATION:
- All interactive elements focusable
- Tab order logical
- Focus indicator visible
- Keyboard shortcuts documented

SCREEN READERS:
- Semantic HTML (nav, main, section, etc.)
- ARIA labels where needed
- Alternative text for icons
- Skip links for navigation

MOTION:
- Respects prefers-reduced-motion
- No auto-playing animations
- Option to disable animations
```

---

## Performance Targets

```
LOAD TIME: < 2 seconds
- Initial dashboard load
- All widgets rendered
- Data fetched and displayed

CONTEXT SWITCH: < 300ms
- User clicks context button
- Grid reflows
- All widgets properly displayed

INTERACTION: < 100ms
- Button clicks
- Widget interactions
- Menu toggles

BUNDLE SIZE: < 150KB (gzipped)
- Core dashboard components
- Widget imports
- Styling

MEMORY: < 50MB
- No memory leaks
- Proper cleanup of subscriptions
- Efficient re-renders
```

---

## Mobile Optimization Checklist

```
✅ Hamburger menu for navigation
✅ Full-width widgets on mobile
✅ Touch-friendly tap targets (48px+)
✅ Swipeable sidebar on mobile
✅ Simplified context switcher on small screens
✅ Stacked layout (1 column)
✅ Optimized images/icons
✅ Fast load time on mobile networks
✅ No horizontal scroll
✅ Safe area padding on notched devices
```

---

**Document Status:** ✅ Complete - Ready for Reference During Implementation  
**Prepared By:** GitHub Copilot  
**Date:** October 18, 2025

This visual guide should be referenced throughout implementation to maintain consistency with the design vision.
