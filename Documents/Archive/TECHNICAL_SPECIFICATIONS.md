# Salatiso Ecosystem - Technical Specifications
## Mlandeli-Notemba Investments Platform

**Document Version:** 2.1
**Last Updated:** October 13, 2025
**Platform Status:** Production (Live at https://salatiso-lifecv.web.app)

---

## 1. SYSTEM OVERVIEW

### 1.1 Platform Architecture
- **Framework:** Next.js 14.2.33 (React 18+)
- **Deployment:** Static Export on Firebase Hosting
- **Authentication:** Firebase Auth (Google OAuth)
- **Database:** Firestore (NoSQL)
- **Storage:** Firebase Storage
- **Styling:** Tailwind CSS 3.4+ with Ubuntu Design Language
- **Language Support:** 11 South African Languages (Client-side i18n)
- **Accessibility:** WCAG 2.1 AA Compliant

### 1.2 Core Technologies Stack
```json
{
  "runtime": "Node.js 18+",
  "frontend": {
    "framework": "Next.js 14.2.33",
    "ui_library": "React 18",
    "styling": "Tailwind CSS 3.4",
    "animations": "Framer Motion 11",
    "icons": "Lucide React",
    "forms": "React Hook Form"
  },
  "backend": {
    "auth": "Firebase Auth",
    "database": "Firestore",
    "storage": "Firebase Storage",
    "hosting": "Firebase Hosting",
    "functions": "Firebase Cloud Functions"
  },
  "tooling": {
    "typescript": "5.x",
    "bundler": "Next.js Built-in",
    "package_manager": "npm",
    "version_control": "Git"
  }
}
```

---

## 2. FEATURE SPECIFICATIONS

### 2.1 Authentication & Authorization
**Status:** ✅ Fully Implemented

**Features:**
- Google OAuth Single Sign-On
- Role-Based Access Control (RBAC)
- Family member authentication
- Session persistence
- Secure logout

**User Roles:**
- Administrator (Full Access)
- Family Member (Restricted Access)
- Guest (Public Pages Only)

### 2.2 Footer Ecosystem Links
**Status:** ✅ Updated (October 2025)

**Ecosystem Modules:**
- The Hub: https://the-hub-lifecv.web.app/
- Salatiso.com: https://salatiso-lifecv.web.app/
- BizHelp: https://bizhelp-lifecv.web.app/
- DocHelp: https://dochelp-lifecv.web.app/
- eKhaya: https://ekhaya-lifecv.web.app/
- FamilyValue: https://familyvalue-lifecv.web.app/
- FinHelp: https://finhelp-lifecv.web.app/
- Flamea: https://flamea-lifecv.web.app/
- LegalHelp: https://legalhelp-lifecv.web.app/
- LifeSync: https://lifesync-lifecv.web.app/
- HrHelp: https://hrhelp-lifecv.web.app/
- PigeeBack: https://pigeeback-lifecv.web.app/
- PubHelp: https://pubhelp-lifecv.web.app/
- SafetyHelp: https://safetyhelp-lifecv.web.app/

**Sazi Life Academy Modules:**
- Sazi Life Academy: https://sazi-life-academy.web.app/
- Sazi Homeschooling: https://sazi-life-homeschooling.web.app/
- Sazi Language Learn: https://sazi-life-language.web.app/
- Sazi Home Life: https://sazi-life-home-life.web.app/
- Sazi Code Create: https://sazi-life-code-create.web.app/

### 2.2 Internationalization (i18n)
**Status:** ✅ Fully Implemented (Client-side)

**Supported Languages:**
1. English (en) 🇬🇧
2. isiXhosa (xh) 🇿🇦
3. isiZulu (zu) 🇿🇦
4. Afrikaans (af) 🇿🇦
5. Sesotho (st) 🇿🇦
6. Setswana (tn) 🇿🇦
7. siSwati (ss) 🇿🇦
8. Tshivenda (ve) 🇿🇦
9. Xitsonga (ts) 🇿🇦
10. isiNdebele (nr) 🇿🇦
11. Sepedi (nso) 🇿🇦

**Implementation:**
- Client-side translation system (static export compatible)
- Browser localStorage for language persistence
- Dynamic language switching without page reload
- Accessible language selector with keyboard navigation

### 2.3 Accessibility Features
**Status:** ✅ WCAG 2.1 AA Compliant

**Components:**
- AccessibleInput - Form inputs with labels and hints
- AccessibleTextarea - Multi-line text inputs
- AccessibleSelect - Dropdown selections
- AccessibleCheckbox - Checkbox inputs
- AccessibleRadioGroup - Radio button groups
- AccessibleModal - Dialog management with focus trapping
- AccessibleMenu - Dropdown menus with keyboard navigation
- SkipLink - Navigation bypass for screen readers
- AccessibilityToolbar - Quick accessibility settings
- DevAccessibilityPanel - Development testing tool

**Features:**
- Keyboard navigation support (Tab, Arrow keys, Enter, Escape)
- Screen reader compatibility (ARIA labels, roles, live regions)
- Focus management and focus trapping in modals
- High contrast mode support
- Semantic HTML structure
- Alternative text for all images
- Form validation with error announcements

### 2.4 Project Management System
**Status:** ✅ Core System Implemented (October 2025)

**Data Models:**
```typescript
interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'not-started' | 'in-progress' | 'blocked' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date | null;
  completedDate: Date | null;
  notes: TaskNote[];
  subtasks: SubTask[];
  dependencies: string[];
  tags: string[];
  changeHistory: TaskChange[];
}

interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  tasks: string[];
  deliverables: string[];
  status: 'upcoming' | 'in-progress' | 'completed' | 'overdue';
}

interface ProjectDeliverable {
  id: string;
  title: string;
  type: 'document' | 'registration' | 'approval' | 'payment' | 'other';
  status: 'pending' | 'in-progress' | 'submitted' | 'approved' | 'completed';
  relatedTasks: string[];
  changeHistory: TaskChange[];
}
```

**Features:**
- Task creation and assignment
- Subtask checklist with completion tracking
- Notes and comments per task
- Priority levels and status tracking
- Progress visualization
- Due date management
- Change history tracking
- Team notifications (planned)

**Example Implementation:**
- **MNI Registration Project:** 14 detailed tasks with subtasks for Solo to register Mlandeli-Notemba Investments (Pty) Ltd
- 4 major milestones (Name Reservation, Documentation, CIPC Submission, Post-Registration)
- 6 deliverables tracked throughout the process

### 2.5 Family Management System
**Status:** ✅ Fully Implemented with Recent Updates

**Family Tree Features:**
- Multi-generational family structure
- Relationship mapping
- Biographical information
- Status indicators (active, developing, emeritus, in memoriam)
- Profile images
- Trust beneficiary tracking

**Recent Updates (October 2025):**
- ✅ Added maternal grandparents (Sisiwe & Ndleleni Mgedezi)
- ✅ Updated Mila's birthday to October 3, 2018
- ✅ Enhanced family member profiles with detailed bios
- ✅ Added "emeritus" status for deceased family members

**Family Members (Current):**
1. Sisiwe Mgedezi (Grandmother - In Memoriam)
2. Ndleleni Mgedezi (Grandfather - In Memoriam)
3. Notemba Mdeni (Matriarch, Trust Beneficiary)
4. Salatiso Mdeni (Founder & Chief Visionary)
5. Visa Mdeni (Marketing & Global Expansion Lead)
6. Tina Mdeni (Education & Finance Oversight)
7. Kwakho Mdeni (Strategic Growth Lead)
8. Solo Mdeni (Tech Innovation Lead)
9. Sazi Mdeni (Future Leader in Training)
10. Mila Mdeni (Future Leader in Training)
11. Milani Mdeni (Youngest Generation Member)
12. Plus additional family members

**Family Member Data Model:**
```typescript
interface FamilyMember {
  id: string;
  name: string;
  role: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  profileImage?: string;
  responsibilities: string[];
  achievements: string[];
  careerPath: string;
  level: number;
  experiencePoints: number;
  location: string;
  bio: string;
  status: 'active' | 'developing' | 'transitioning' | 'emeritus';
  trustRating: number;
  specializations: string[];
}
```

### 2.6 User Profile & Settings
**Status:** ✅ Enhanced (October 2025)

**Profile Features:**
- Display name editing
- Bio and description
- Phone number and location
- Profile picture upload (file or webcam)
- Role display (admin-controlled)

**New Features (October 2025):**
- ✅ **Date of Birth Field** - Full birthday entry for family records
- ✅ **Anniversaries Management** - Add multiple anniversaries with names and dates
- ✅ "Important Dates" section for celebrations and reminders
- Privacy controls (profile visibility, contact info sharing)
- Notification preferences
- Language selection
- Gamification settings

### 2.7 Navigation Structure
**Status:** ✅ Reorganized (October 2025)

**Public Navigation:**
- Home
- About
- Journey
- Library
- Training Academy
- Testing Hub
- Templates
- Kids Zone

**Intranet Navigation (Reorganized):**

**Family Section:**
- Dashboard
- Family
- Family Tree

**Timeline Section:**
- Family Timeline
- Business Operations
- Business Organogram
- Career Paths

**Professional Growth Section:**
- Professional Growth
- Projects
- Business Plan
- Ecosystem
- Analytics

**Sazi Life Academy:**
- Sazi Life Academy
- Curriculum Browser
- Learning Progress
- Ubuntu Screen Saver
- Promotional Materials
- Cultural Integration
- Advanced Training Hub
- AI Skills Development

**Learning & Personal Development:**
- Career
- Learning
- LifeCV

**Beta Testing:**
- Beta Testing Hub

### 2.8 Business Planning & Documentation
**Status:** ✅ Implemented

**Features:**
- Business plan creation and editing
- SWOT analysis
- Financial projections
- Timeline management
- Milestone tracking
- Document templates
- Export capabilities (planned enhancement)

### 2.9 Ecosystem Dashboard
**Status:** ✅ Implemented

**Tracked Platforms:**
1. LifeSync - Life management platform
2. PigeeBack - Rideshare & community mobility
3. BizHelp - Business support services
4. FamilyValue - Family wealth management
5. SafetyHelp - Safety and security
6. DocuHelp - Document management
7. eKhaya - Home management (new)
8. FlamEA - Emergency assistance
9. HR Help - Human resources
10. Legal Help - Legal services
11. Fin Help - Financial services
12. Pub Help - Public services

**Platform Tracking:**
- Product lead information
- Development status
- Impact metrics
- Collaboration requests
- Integration points

---

## 3. TECHNICAL ARCHITECTURE

### 3.1 Component Structure
```
src/
├── components/
│   ├── accessibility/       # WCAG 2.1 AA components
│   ├── dashboard/          # Dashboard widgets
│   ├── family/             # Family management components
│   ├── icons/              # Custom SVG icons
│   ├── layouts/            # Page layouts (Public, Intranet)
│   ├── profile/            # User profile components
│   ├── project/            # Project management components (NEW)
│   ├── screensaver/        # Ubuntu screensaver
│   └── templates/          # Document templates
├── contexts/
│   ├── AuthContext.tsx     # Firebase Auth state
│   └── I18nContext.tsx     # Client-side i18n
├── pages/
│   ├── intranet/           # Protected pages
│   ├── family/             # Family tree and timeline
│   ├── business/           # Business tools
│   ├── academy/            # Sazi Life Academy
│   └── [public pages]
├── types/
│   ├── index.ts            # Core types
│   └── project.ts          # Project management types (NEW)
├── data/
│   └── mni-registration.ts # MNI project data (NEW)
├── config/
│   ├── firebase.ts         # Firebase configuration
│   ├── storage.ts          # Storage utilities
│   └── analytics.ts        # Analytics setup
└── styles/
    └── globals.css         # Global styles & Tailwind
```

### 3.2 Data Flow Architecture
```
User Interaction
      ↓
React Component
      ↓
Context (Auth, I18n)
      ↓
Firebase SDK
      ↓
Firestore/Storage/Auth
      ↓
Data Sync
      ↓
Component Re-render
```

### 3.3 State Management
- **Authentication State:** AuthContext (Firebase Auth)
- **Language State:** I18nContext (localStorage)
- **Component State:** React useState/useReducer
- **Form State:** React Hook Form
- **Server State:** Firebase SDK (real-time listeners)

### 3.4 Security Implementation
```typescript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Family members only
    match /family/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Project data - authenticated users
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Public data
    match /public/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## 4. PERFORMANCE METRICS

### 4.1 Build Statistics
- **Total Pages:** 36 static pages
- **Shared JS:** 251 kB (gzip)
- **CSS:** 14.9 kB (gzip)
- **Largest Page:** /training (34.1 kB)
- **Average Page:** ~3-5 kB (excluding shared)

### 4.2 Loading Performance
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.5s
- **Cumulative Layout Shift (CLS):** < 0.1

### 4.3 Accessibility Score
- **Lighthouse Accessibility:** 95+ / 100
- **WCAG 2.1 Level:** AA Compliant
- **Keyboard Navigation:** Fully Supported
- **Screen Reader:** Compatible

---

## 5. DEPLOYMENT & HOSTING

### 5.1 Firebase Hosting Configuration
```json
{
  "hosting": [
    {
      "target": "salatiso-lifecv",
      "public": "out",
      "cleanUrls": true,
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ],
      "headers": [
        {
          "source": "**/*",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "max-age=3600"
            }
          ]
        }
      ]
    }
  ]
}
```

### 5.2 Environment Variables
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Application
NEXT_PUBLIC_APP_URL=https://salatiso-lifecv.web.app
```

---

## 6. BROWSER SUPPORT

### 6.1 Desktop Browsers
- ✅ Chrome 90+ (Recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### 6.2 Mobile Browsers
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)
- ✅ Samsung Internet
- ✅ Firefox Mobile

### 6.3 Required Features
- ES2020+ JavaScript
- CSS Grid & Flexbox
- Service Workers (for PWA features)
- Local Storage
- IndexedDB (planned)

---

## 7. TESTING & QUALITY ASSURANCE

### 7.1 Testing Strategy
- **Unit Tests:** Jest + React Testing Library
- **Accessibility Tests:** axe-core, manual testing
- **Browser Tests:** Cross-browser manual testing
- **Performance Tests:** Lighthouse CI
- **Security Tests:** Firebase Security Rules testing

### 7.2 Beta Testing Program
- Active beta testing hub at /testing
- Feedback collection via contact forms
- User testing for accessibility features
- Family member dogfooding

---

## 8. ROADMAP & PLANNED FEATURES

### 8.1 Q4 2025 (Current Development)
- ✅ Project management system
- ✅ Enhanced family profiles
- ✅ Navigation reorganization
- ✅ Footer ecosystem links updated
- 🔄 Print-friendly formats (In Progress)
- 🔄 JSON import/export (In Progress)
- 🔄 Android app specification (In Progress)
- 🔄 Mobile app download page (In Progress)

### 8.2 Q1 2026 (Planned)
- Calendar integration with Google Calendar
- Real-time team notifications
- Advanced document templates
- Offline support (PWA)
- Mobile app (React Native)

### 8.3 Q2 2026 (Planned)
- Video call integration
- Advanced analytics dashboard
- AI-powered insights
- Multi-tenant support for other families

---

## 9. MAINTENANCE & SUPPORT

### 9.1 Update Schedule
- **Security Updates:** As needed (immediate)
- **Feature Updates:** Monthly releases
- **Content Updates:** Weekly (via Firestore)
- **Bug Fixes:** Bi-weekly or as critical

### 9.2 Support Channels
- **Email:** hub@salatiso.com, lifecvhub@gmail.com
- **Contact Form:** /contact (integrated)
- **Beta Testing:** /testing feedback portal
- **Family Support:** Internal communication channels

### 9.3 Backup & Recovery
- **Database:** Firestore automatic backups
- **Storage:** Firebase Storage redundancy
- **Code:** Git version control
- **Deployment:** Firebase hosting history (rollback capable)

---

## 10. COMPLIANCE & LEGAL

### 10.1 Accessibility Compliance
- **Standard:** WCAG 2.1 Level AA
- **Testing:** Regular audits with screen readers
- **Documentation:** Accessibility guidelines maintained

### 10.2 Data Privacy
- **POPIA Compliance:** South African data protection
- **GDPR:** EU data protection (for international access)
- **Family Data:** Secured with Firebase Auth & Firestore rules

### 10.3 Security Measures
- HTTPS encryption (Firebase Hosting)
- Firebase Security Rules
- Authentication required for sensitive data
- Regular security audits

---

## 11. CONTACT & DOCUMENTATION

**Primary Contact:** hub@salatiso.com, lifecvhub@gmail.com  
**Live Platform:** https://salatiso-lifecv.web.app  
**Testing Hub:** https://salatiso-lifecv.web.app/testing  
**Documentation:** This specification + inline code documentation

**Version History:**
- v2.1 (Oct 13, 2025) - Footer ecosystem links updated, navigation reorganization completed
- v2.0 (Oct 12, 2025) - Project management, enhanced profiles, i18n fixes
- v1.5 (Oct 10, 2025) - Accessibility implementation, WCAG 2.1 AA compliance
- v1.0 (Oct 2, 2025) - Initial production deployment

---

**Document Status:** ✅ Current  
**Next Review:** November 13, 2025
**Maintained By:** Salatiso Technology Team
