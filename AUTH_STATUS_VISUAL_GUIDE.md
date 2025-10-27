# 👁️ Visual Guide - Authentication Status Display

## What Users Will See

### SCENARIO 1: Not Logged In (Anonymous User)

#### Desktop View
```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  [MNI]  About  Journey  Templates  Sonny  Training  Testing  Kids     │
│  Mlandeli-Notemba                              Not logged in  [Login →] │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

Main Content Area...
```

**Header Details**:
- **Left**: Logo with company name
- **Center**: Navigation menu (About, Journey, Templates, etc.)
- **Right**: Gray text "Not logged in" + Blue "Login" button

**User Action**: Click "Login" button
- Routes to `/intranet/login`
- User can authenticate with email/Google

---

#### Mobile View
```
┌──────────────────────────────────────────┐
│ [MNI] Mlandeli-Notemba          [≡]    │
└──────────────────────────────────────────┘

// After clicking [≡] menu:

┌──────────────────────────────────────────┐
│ About                                    │
│ Journey                                  │
│ Templates                                │
│ Sonny Network                            │
│ Training Academy                         │
│ Testing Hub                              │
│ Kids Zone                                │
│ ────────────────────────────────────    │
│ Not logged in                            │
│ [Login →]                                │
└──────────────────────────────────────────┘

Main Content Area...
```

**Menu Details**:
- Shows all navigation items
- At bottom: "Not logged in" with blue Login button
- Full width for easy tapping

---

### SCENARIO 2: Logged In (Authenticated User)

#### Desktop View
```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  [MNI]  About  Journey  Templates  Sonny  Training  Testing  Kids     │
│  Mlandeli-Notemba                John Doe | Developer  [🎯] [🚪]    │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

Main Content Area...
```

**Header Details**:
- **Left**: Logo with company name (unchanged)
- **Center**: Navigation menu (unchanged)
- **Right**: 
  - User name: "John Doe"
  - User role: "Developer" (or founder, parent_company_lead, etc.)
  - Green button with dashboard icon [🎯]
  - Red button with logout icon [🚪]

**User Actions**:
- Click "[🎯]" → Instant navigation to `/intranet/simple-dashboard`
- Click "[🚪]" → Logs out, redirects to home, status changes to "Not logged in"

---

#### Mobile View
```
┌──────────────────────────────────────────┐
│ [MNI] Mlandeli-Notemba          [≡]    │
└──────────────────────────────────────────┘

// After clicking [≡] menu:

┌──────────────────────────────────────────┐
│ About                                    │
│ Journey                                  │
│ Templates                                │
│ Sonny Network                            │
│ Training Academy                         │
│ Testing Hub                              │
│ Kids Zone                                │
│ ────────────────────────────────────    │
│ John Doe                                 │
│ Developer                                │
│ [🎯 Dashboard]                           │
│ [🚪 Logout]                              │
└──────────────────────────────────────────┘

Main Content Area...
```

**Menu Details**:
- All navigation items visible
- At bottom: User name "John Doe"
- Role displayed: "Developer"
- Green full-width Dashboard button
- Red full-width Logout button

**User Actions**:
- Tap "[🎯 Dashboard]" → Goes to dashboard
- Menu closes automatically
- Tap "[🚪 Logout]" → Signs out, menu closes, redirected to home

---

### SCENARIO 3: During Loading (Page Initializing)

#### Desktop View
```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  [MNI]  About  Journey  Templates  Sonny  Training  Testing  Kids     │
│  Mlandeli-Notemba                  [⟳]  (loading spinner)             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Shows**: Spinning loader while checking authentication status
- Prevents premature content rendering
- Ensures correct state displayed
- Usually takes <1 second

---

## Color Scheme

| Element | Color | Meaning |
|---------|-------|---------|
| Logo Background | Blue (#3B82F6) | Primary brand color |
| Active Nav Item | Light Blue (#DBEAFE) | Current page |
| Login Button | Blue (#3B82F6) | Primary action |
| Dashboard Button | Green (#10B981) | Positive/Go action |
| Logout Button | Red (#EF4444) | Destructive/Leave action |
| User Text | Dark Gray (#111827) | Neutral/Information |
| Role Text | Light Gray (#6B7280) | Secondary information |

---

## Interactive Elements

### Desktop Elements (appear side-by-side):
- **User Info**: Name on first line, role on second line (right-aligned)
- **Dashboard Button**: Green circle with dashboard icon
- **Logout Button**: Red circle with logout icon
- All have hover effects for visibility

### Mobile Elements (stack vertically):
- **User Info**: Centered, two lines (name + role)
- **Dashboard Button**: Full-width green button with text + icon
- **Logout Button**: Full-width red button with text + icon
- Tap-friendly size for touch devices

---

## States & Transitions

### State 1: Page Load
```
Starting → Loading (spinner shown) → Determined → Rendered
```

### State 2: User Logs In
```
"Not logged in" view → (navigates to login) → logs in 
→ redirects to previous page → Page reloads with "Logged in" view
```

### State 3: User Logs Out
```
"Logged in" view → User clicks logout → Signs out
→ Page updates → Shows "Not logged in" view
```

---

## Icons Used

| Icon | Name | Where | Meaning |
|------|------|-------|---------|
| 🎯 | LayoutDashboard | Dashboard button | Navigate to dashboard |
| 🚪 | LogOut | Logout button | Sign out |
| ≡ | Menu | Mobile menu toggle | Open/close menu |
| ✕ | X | Mobile menu close | Close menu |

---

## Responsive Breakpoints

### Desktop (≥768px)
- Navigation visible inline
- Buttons visible in header
- User info on right side
- All interactive elements visible at once

### Mobile (<768px)
- Navigation hidden in menu
- Buttons in dropdown menu
- Hamburger icon for menu toggle
- Optimized for touch interaction

---

## User Workflows

### Login Flow
```
1. Visit public page
2. See "Not logged in" header
3. Click blue "Login" button
4. Navigate to login page
5. Enter credentials or use Google
6. Authentication succeeds
7. Redirected back to original page
8. Header now shows name + role + Dashboard button
```

### Dashboard Access Flow
```
1. Already logged in on a public page
2. See name displayed in header
3. Click green "Dashboard" button
4. Instantly navigate to /intranet/simple-dashboard
5. See all personal data and features
```

### Logout Flow
```
1. Logged in on any public page
2. Click red "Logout" button
3. Session ends immediately
4. Redirected to home page
5. Header updates to show "Not logged in"
6. Can log back in if desired
```

---

## Benefits

✅ **Always Clear**: Users know their login status at a glance
✅ **One Click**: Access dashboard with single button
✅ **Professional**: Shows user information in header
✅ **Mobile Friendly**: Works perfectly on all devices
✅ **Fast**: Real-time auth state detection
✅ **Secure**: No sensitive data exposed
✅ **Intuitive**: Color coding indicates actions
✅ **Accessible**: Icons + text for clarity

---

## Testing Checklist

- [ ] Visit home page while not logged in → See "Not logged in"
- [ ] Click Login button → Goes to login page
- [ ] Log in with valid credentials → Redirected back to home
- [ ] See your name displayed in header ✅
- [ ] See your role displayed in header ✅
- [ ] Click Dashboard button → Goes to dashboard page ✅
- [ ] Click Logout button → Signs out ✅
- [ ] Header shows "Not logged in" again ✅
- [ ] Test on mobile - Menu opens ✅
- [ ] Test auth status in menu ✅
- [ ] Test Dashboard button in menu ✅
- [ ] Test Logout button in menu ✅

---

## Document Information

- **Version**: 1.0.0
- **Date**: October 26, 2025
- **Feature**: Authentication Status Display Visual Guide
- **Status**: ✅ COMPLETE

Enjoy the improved user experience! 🎉
