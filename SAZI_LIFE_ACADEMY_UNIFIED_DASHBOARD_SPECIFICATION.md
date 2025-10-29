# Sazi Life Academy - Unified Dashboard Alignment Specification

**Document ID**: SAZI-ACADEMY-UNIFIED-DASH-V1.0  
**Status**: Implementation Blueprint  
**Date**: October 27, 2025  
**Primary URL**: https://sazi-life-academy.web.app/  
**Alignment Target**: MNI Ecosystem Dashboard (Salatiso-React-App)

---

## 📋 Executive Summary

This specification outlines the comprehensive alignment of all five Sazi Life Academy applications into a unified dashboard experience at `sazi-life-academy.web.app`, replicating the proven dashboard architecture, layout, and aesthetics from the MNI Ecosystem (Salatiso-React-App) while preserving 100% of existing functionality across all academy modules.

### Unified Dashboard Goals

1. **Single Entry Point**: `sazi-life-academy.web.app` serves as the central dashboard for all academy features
2. **Consistent UI/UX**: Match MNI ecosystem dashboard's navigation, layout, widgets, and interaction patterns
3. **Preserved Functionality**: Retain all existing features from 5 academy apps
4. **Seamless Navigation**: Unified sidebar and header navigation across all academy modules
5. **Modular Architecture**: Each academy app functions as a "module" within the unified dashboard

---

## 🎯 Source Apps Analysis

### 1. Sazi Life Academy App (Main Hub)
**Current URL**: https://sazi-life-academy.web.app/  
**Framework**: React 18 + Vite + TypeScript  
**Key Features**:
- Learning pathways and curriculum browser
- Progress tracking and achievements
- Community learning hub
- Course creation tools
- Multi-language support (14 languages)
- Theme system (light/dark/high-contrast)

**Components to Preserve**:
- `AcademyDashboard` - Main dashboard with learning stats
- `CurriculumBrowser` - Module exploration
- `ProgressTracker` - Individual progress
- `LearningModule` - Interactive module viewer

### 2. Sazi Online Homeschooling App
**Current URL**: https://sazi-life-homeschooling.web.app/  
**Framework**: React 18 + Vite  
**Key Features**:
- Grade-specific curriculum (Grade R-12)
- Citizen Scientist module
- Civic Education curriculum
- Educator's Toolkit
- Assessment and reporting
- Parent dashboard

**Components to Preserve**:
- Grade-level curriculum viewers
- Citizen Journalist module
- Unbreakable Bond curriculum
- Assessment tools
- Parent/educator dashboards

### 3. Sazi Home Life App
**Current URL**: https://sazi-life-home-life.web.app/  
**Framework**: React 18 + Vite  
**Key Features**:
- Cooking module with recipes
- Cleaning and safety hub
- Gardening and DIY
- Budgeting tools
- Practical assessments
- Family snapshot dashboard

**Components to Preserve**:
- `CookingPage` - Recipe management
- `CleaningPage` - Cleaning guides
- `GardeningPage` - Garden planning
- `BudgetingPage` - Financial tools
- `SafetyHub` - Safety protocols
- `FamilySnapshot` - Family overview widget

### 4. Sazi Code Create App
**Current URL**: https://sazi-life-code-create.web.app/  
**Framework**: React 18 + Vite  
**Key Features**:
- Digital mastery curriculum
- Coding tutorials and exercises
- Project-based learning
- Quiz system with game mechanics
- Offline capability
- LifeCV integration

**Components to Preserve**:
- Coding course modules
- Interactive quiz system
- Project management
- Code editor integration
- Offline learning support

### 5. Sazi Language Learn App
**Current URL**: https://sazi-life-language.web.app/  
**Framework**: React 18 + Vite  
**Key Features**:
- Multi-language vocabulary
- Grammar lessons
- Age-level content
- Kids vocabulary game
- Family story time
- Culture page

**Components to Preserve**:
- `KidsVocabularyGame` - Interactive learning
- `FamilyStoryTime` - Story-based learning
- `VocabularyPage` - Word lists
- `GrammarPage` - Grammar rules
- `CulturePage` - Cultural context

---

## 🏗️ MNI Ecosystem Dashboard Architecture (Source Model)

### Navigation System

#### 1. Enhanced Sidebar Navigation
**Source Files** (from Salatiso-React-App):
- `src/components/navigation/Sidebar.tsx` (244 lines)
- `src/components/navigation/NavSection.tsx` (120 lines)
- `src/components/navigation/NavItem.tsx` (176 lines)
- `src/config/navigation.config.ts` (305 lines)
- `src/hooks/useNavigation.ts` (164 lines)

**Structure**:
```
📊 Dashboard (Standalone)
👤 Personal (Profile, LifeCV, Contacts, Calendar, etc.)
👨‍👩‍👧‍👦 Family (Dashboard, Tree, Timeline, Members, etc.)
💼 Professional (Dashboard, Operations, Organogram, etc.)
🌐 Communities (Networks, Sonny, PigeeBack, etc.)
🔧 Common Tools (Assets, Analytics, Toolkit, Academy, etc.)
```

**Features**:
- Collapsible sections with localStorage persistence
- Badge system (core, mesh, mni, external, new)
- Active state highlighting
- Mobile hamburger menu with drawer
- Desktop always-visible mode (288px)
- Tablet drawer mode with overlay
- WCAG 2.1 AA accessibility

#### 2. Ecosystem Header
**Source File**: `src/components/navigation/EcosystemHeader.tsx`

**Structure**:
```
[Salatiso] [Ecosystem ▼] [Academy ▼]    [🌐 Language]
```

**Features**:
- Dropdown menus for ecosystem modules (13 links)
- Dropdown for academy modules (5 links)
- Click-outside-to-close functionality
- Language switcher integration
- Responsive design

### Dashboard Components

#### 1. Widget System
**Location**: `src/components/dashboard/widgets/`

**Available Widgets**:
- `EcosystemHealthWidget` - System status overview
- `ProjectTimelineWidget` - Project tracking
- `CareerProgressWidget` - Career development
- `GamificationWidget` - Points and achievements
- `SonnyNetworkWidget` - Network activity
- `WelcomeWidget` - Personalized greeting
- `FamilyActivityWidget` - Family updates
- `QuickActionsWidget` - Common actions

#### 2. Dashboard Layout Pattern
**Source**: `src/pages/intranet/simple-dashboard.tsx`

```tsx
export default function Dashboard() {
  return (
    <IntranetLayout title="Dashboard">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard />
        <StatCard />
        <StatCard />
        <StatCard />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <PrimaryWidget />
          <SecondaryWidget />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <SideWidget />
          <SideWidget />
        </div>
      </div>
    </IntranetLayout>
  );
}
```

#### 3. Tab Navigation Pattern
**Used in**: Dashboard, Analytics, Admin panels

```tsx
const tabs = ['overview', 'analytics', 'reports', 'settings'];
const [activeTab, setActiveTab] = useState('overview');

{tabs.map((tab) => (
  <button
    key={tab}
    onClick={() => setActiveTab(tab)}
    className={activeTab === tab ? 'active' : 'inactive'}
  >
    {tab}
  </button>
))}
```

### Layout Components

#### 1. IntranetLayout
**Source**: `src/components/layouts/IntranetLayout.tsx`

**Features**:
- Integrated sidebar navigation
- Ecosystem header
- Main content area
- Footer
- Responsive breakpoints
- SEO meta tags

#### 2. Theme System
**Source**: `src/contexts/ThemeContext.tsx`

**Supported Themes**:
- Light mode
- Dark mode
- High contrast mode
- System preference detection

### Shared Services

#### 1. Firebase Integration
**Pattern**: Consistent across all apps

```typescript
// Firebase config structure
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};
```

#### 2. Authentication Flow
**Source**: `src/contexts/AuthContext.tsx`

**Features**:
- Guest access support
- Google Sign-In
- Session persistence
- Role-based access control

#### 3. Progress Tracking
**Pattern**: Consistent data model

```typescript
interface ProgressData {
  userId: string;
  moduleId: string;
  lessonId?: string;
  progress: number; // 0-100
  completed: boolean;
  lastAccessed: Timestamp;
  achievements: Achievement[];
}
```

---

## 🎨 Unified Dashboard Design

### Navigation Structure for Sazi Life Academy

```
📊 Academy Dashboard
  └─ Overview

📚 Learning Modules
  ├─ All Courses
  ├─ My Learning Paths
  ├─ Homeschooling (Grade R-12)
  ├─ Language Learning
  ├─ Home Life Skills
  ├─ Code & Create
  └─ Community Schools

👨‍🎓 My Progress
  ├─ Achievements
  ├─ Certificates
  ├─ Learning Portfolio
  └─ Assessment Reports

👨‍👩‍👧‍👦 Family Hub
  ├─ Family Dashboard
  ├─ Student Roster
  ├─ Family Snapshot
  ├─ Shared Learning
  └─ Family Calendar

🎯 Specialized Modules
  ├─ 🏠 Home Life (Cooking, Cleaning, Gardening, DIY, Budgeting)
  ├─ 💻 Code Create (Digital Mastery, Projects, Quizzes)
  ├─ 🗣️ Language Learn (Vocabulary, Grammar, Culture, Stories)
  ├─ 🎓 Homeschooling (Curriculum, Assessments, Educator Tools)
  └─ 🌟 Citizen Scientist (Research, Journalism, Civic Ed)

🌐 Community
  ├─ Learning Groups
  ├─ Community Schools
  ├─ Ask Khulu
  ├─ Marketplace
  └─ Forums

🛠️ Tools & Settings
  ├─ Course Builder
  ├─ Content Library
  ├─ Analytics Dashboard
  ├─ Billing & Settings
  └─ Help & Support
```

### Dashboard Layout

#### Main Dashboard View
```
┌─────────────────────────────────────────────────────────────────┐
│ Sazi Life Academy Dashboard                    [🌐 Language]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Active Courses: 12]  [Progress: 68%]  [Certificates: 5]      │
│                                                                  │
│  ┌─────────────────────────────┐  ┌────────────────────────┐   │
│  │  Continue Learning           │  │  Quick Actions         │   │
│  │  ─────────────────           │  │  ─────────────         │   │
│  │  📚 Homeschooling Grade 5    │  │  🎯 Start New Course   │   │
│  │  Progress: 45%               │  │  📝 Take Assessment    │   │
│  │                              │  │  👥 Join Study Group   │   │
│  │  💻 Code Create: Python      │  │  📊 View Reports       │   │
│  │  Progress: 72%               │  │                        │   │
│  │                              │  │  Recent Achievements   │   │
│  │  🗣️ Language: isiZulu        │  │  🏆 Week Streak Badge  │   │
│  │  Progress: 60%               │  │  ⭐ Module Completed   │   │
│  └─────────────────────────────┘  └────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Learning Pathways                                       │  │
│  │  ─────────────────                                       │  │
│  │  [Homeschool] [Language] [Life Skills] [Digital] [...]  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Family Activity Feed                                    │  │
│  │  ────────────────────                                    │  │
│  │  👦 Kwakho completed "Python Basics"                     │  │
│  │  👧 Zoey started "Grade 3 Mathematics"                   │  │
│  │  👨‍👩‍👧‍👦 Family earned "Weekly Learning Badge"              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

#### Module-Specific Dashboards

**Homeschooling Dashboard**:
```
┌─────────────────────────────────────────────────────────────┐
│ Homeschooling Dashboard - Grade 5                          │
├─────────────────────────────────────────────────────────────┤
│  Current Term: Term 3, 2025            Progress: 65%       │
│                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐ │
│  │  Mathematics     │ │  Science        │ │  Language    │ │
│  │  Progress: 70%   │ │  Progress: 60%  │ │  Progress: 75% │
│  └─────────────────┘ └─────────────────┘ └──────────────┘ │
│                                                             │
│  Upcoming Assessments:                                     │
│  • Mathematics Quiz - Oct 30                               │
│  • Science Project - Nov 5                                 │
│                                                             │
│  Educator's Toolkit | Citizen Scientist | Resources       │
└─────────────────────────────────────────────────────────────┘
```

**Home Life Dashboard**:
```
┌─────────────────────────────────────────────────────────────┐
│ Home Life Skills Dashboard                                 │
├─────────────────────────────────────────────────────────────┤
│  [Cooking] [Cleaning] [Gardening] [DIY] [Budgeting]       │
│                                                             │
│  This Week's Plan:                                         │
│  Mon: Chicken Stir Fry (Recipe saved)                     │
│  Wed: Garden Watering Schedule                             │
│  Fri: Monthly Budget Review                                │
│                                                             │
│  Recent Achievements:                                      │
│  🏆 Completed 10 Recipes                                   │
│  🌱 Started Vegetable Garden                               │
│  💰 Saved 15% on groceries                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Implementation Strategy

### Phase 1: Foundation & Infrastructure (Weeks 1-2)

#### 1.1 Create Unified Dashboard Shell
**New Repo Structure**:
```
sazi-life-academy-unified/
├── src/
│   ├── components/
│   │   ├── navigation/          # MNI-style navigation
│   │   ├── dashboard/           # Dashboard widgets
│   │   ├── layouts/             # Layout components
│   │   ├── modules/             # Module-specific components
│   │   │   ├── homeschooling/
│   │   │   ├── home-life/
│   │   │   ├── code-create/
│   │   │   ├── language-learn/
│   │   │   └── academy-core/
│   │   └── shared/              # Shared components
│   ├── pages/
│   │   ├── index.tsx            # Main dashboard
│   │   ├── homeschooling/       # Homeschool pages
│   │   ├── home-life/           # Home Life pages
│   │   ├── code-create/         # Code Create pages
│   │   ├── language-learn/      # Language Learn pages
│   │   └── academy/             # Core academy pages
│   ├── config/
│   │   ├── navigation.config.ts # Unified navigation
│   │   ├── firebase.config.ts   # Firebase setup
│   │   └── modules.config.ts    # Module registration
│   ├── contexts/
│   │   ├── AuthContext.tsx      # Unified auth
│   │   ├── ThemeContext.tsx     # Theme system
│   │   └── ModuleContext.tsx    # Module state
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── progress.service.ts
│   │   ├── achievement.service.ts
│   │   └── modules/             # Module-specific services
│   ├── hooks/
│   │   ├── useNavigation.ts
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   └── useModule.ts
│   └── types/
│       ├── navigation.types.ts
│       ├── module.types.ts
│       └── shared.types.ts
├── public/
│   └── assets/
├── .env
├── .env.example
├── firebase.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

#### 1.2 Copy MNI Navigation System
**Files to Replicate**:
1. `src/components/navigation/Sidebar.tsx` → Adapt for Academy modules
2. `src/components/navigation/NavSection.tsx` → Use as-is
3. `src/components/navigation/NavItem.tsx` → Use as-is
4. `src/components/navigation/EcosystemHeader.tsx` → Customize for Academy
5. `src/config/navigation.config.ts` → Create Academy-specific config
6. `src/hooks/useNavigation.ts` → Use as-is

**Customization Required**:
```typescript
// config/navigation.config.ts
export const ACADEMY_NAV_STRUCTURE: NavSection[] = [
  {
    id: 'dashboard',
    label: 'Academy Dashboard',
    icon: Home,
    path: '/dashboard',
  },
  {
    id: 'learning',
    label: 'Learning Modules',
    icon: BookOpen,
    items: [
      {
        id: 'all-courses',
        label: 'All Courses',
        path: '/courses',
        icon: BookOpen,
      },
      {
        id: 'homeschooling',
        label: 'Homeschooling',
        path: '/homeschooling',
        icon: GraduationCap,
        badge: { type: 'core', label: 'K-12' },
      },
      {
        id: 'language-learn',
        label: 'Language Learning',
        path: '/language',
        icon: Globe,
      },
      {
        id: 'home-life',
        label: 'Home Life Skills',
        path: '/home-life',
        icon: Home,
      },
      {
        id: 'code-create',
        label: 'Code & Create',
        path: '/code-create',
        icon: Code,
      },
    ],
  },
  {
    id: 'progress',
    label: 'My Progress',
    icon: TrendingUp,
    items: [
      {
        id: 'achievements',
        label: 'Achievements',
        path: '/progress/achievements',
        icon: Award,
      },
      {
        id: 'certificates',
        label: 'Certificates',
        path: '/progress/certificates',
        icon: FileText,
      },
      {
        id: 'portfolio',
        label: 'Learning Portfolio',
        path: '/progress/portfolio',
        icon: Briefcase,
      },
    ],
  },
  {
    id: 'family',
    label: 'Family Hub',
    icon: Users,
    items: [
      {
        id: 'family-dashboard',
        label: 'Family Dashboard',
        path: '/family/dashboard',
        icon: Home,
      },
      {
        id: 'student-roster',
        label: 'Student Roster',
        path: '/family/students',
        icon: Users,
      },
      {
        id: 'family-snapshot',
        label: 'Family Snapshot',
        path: '/family/snapshot',
        icon: Camera,
      },
    ],
  },
  {
    id: 'community',
    label: 'Community',
    icon: Network,
    items: [
      {
        id: 'learning-groups',
        label: 'Learning Groups',
        path: '/community/groups',
        icon: Users,
      },
      {
        id: 'community-schools',
        label: 'Community Schools',
        path: '/community/schools',
        icon: School,
      },
      {
        id: 'ask-khulu',
        label: 'Ask Khulu',
        path: '/community/ask-khulu',
        icon: HelpCircle,
      },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Settings',
    icon: Settings,
    items: [
      {
        id: 'course-builder',
        label: 'Course Builder',
        path: '/tools/course-builder',
        icon: Wrench,
        badge: { type: 'new', label: 'New' },
      },
      {
        id: 'analytics',
        label: 'Analytics',
        path: '/tools/analytics',
        icon: BarChart3,
      },
      {
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: Settings,
      },
    ],
  },
];
```

#### 1.3 Implement Layout System
**Files to Create**:
1. `src/components/layouts/AcademyLayout.tsx` - Main layout wrapper
2. `src/components/layouts/ModuleLayout.tsx` - Module-specific layout
3. `src/components/layouts/PublicLayout.tsx` - Pre-login pages

**AcademyLayout Structure**:
```tsx
// src/components/layouts/AcademyLayout.tsx
import React from 'react';
import { Sidebar } from '../navigation/Sidebar';
import { EcosystemHeader } from '../navigation/EcosystemHeader';
import { Footer } from '../shared/Footer';

interface AcademyLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSidebar?: boolean;
}

export const AcademyLayout: React.FC<AcademyLayoutProps> = ({
  children,
  title,
  showSidebar = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <EcosystemHeader />

      <div className="flex flex-1">
        {/* Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {title && (
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              {title}
            </h1>
          )}
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
```

### Phase 2: Module Migration (Weeks 3-6)

#### 2.1 Migrate Core Academy Components
**Source**: sazi-life-academy-app  
**Destination**: `src/components/modules/academy-core/`

**Components to Migrate**:
1. `AcademyDashboard.tsx` → Dashboard view
2. `CurriculumBrowser.tsx` → Course discovery
3. `ProgressTracker.tsx` → Progress tracking
4. `LearningModule.tsx` → Module viewer
5. `CourseBuilder.tsx` → Course creation
6. `CommunityHub.tsx` → Community features

**Migration Pattern**:
```tsx
// Original: sazi-life-academy-app/src/components/AcademyDashboard.tsx
// New: src/components/modules/academy-core/AcademyDashboard.tsx

import { AcademyLayout } from '@/components/layouts/AcademyLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useModule } from '@/hooks/useModule';

export const AcademyDashboard: React.FC = () => {
  const { user } = useAuth();
  const { moduleData } = useModule('academy');

  return (
    <AcademyLayout title="Academy Dashboard">
      {/* Existing dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <CurrentLearningPathways user={user} />
          <RecommendedCourses />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ProgressOverview />
          <AchievementsSummary />
        </div>
      </div>
    </AcademyLayout>
  );
};
```

#### 2.2 Migrate Homeschooling Module
**Source**: sazi-online-homeschooling-app  
**Destination**: `src/components/modules/homeschooling/`

**Components to Migrate**:
1. Grade-specific curriculum viewers (Grade R-12)
2. `CitizenScientist.tsx` → Research module
3. `CitizenJournalist.tsx` → Journalism module
4. `CivicEducation.tsx` → Civic ed module
5. `EducatorToolkit.tsx` → Teacher resources
6. `AssessmentTools.tsx` → Testing & grading
7. `ParentDashboard.tsx` → Parent view

**Page Structure**:
```tsx
// src/pages/homeschooling/index.tsx
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { HomeschoolingDashboard } from '@/components/modules/homeschooling/HomeschoolingDashboard';

export default function HomeschoolingPage() {
  return (
    <ModuleLayout
      module="homeschooling"
      title="Homeschooling - Grade R to 12"
    >
      <HomeschoolingDashboard />
    </ModuleLayout>
  );
}

// src/pages/homeschooling/grade/[gradeId].tsx
import { GradeCurriculum } from '@/components/modules/homeschooling/GradeCurriculum';

export default function GradePage() {
  const router = useRouter();
  const { gradeId } = router.query;

  return (
    <ModuleLayout
      module="homeschooling"
      title={`Grade ${gradeId} Curriculum`}
    >
      <GradeCurriculum gradeId={gradeId as string} />
    </ModuleLayout>
  );
}
```

#### 2.3 Migrate Home Life Module
**Source**: sazi-home-life-app  
**Destination**: `src/components/modules/home-life/`

**Components to Migrate**:
1. `CookingPage.tsx` → Recipe management
2. `CleaningPage.tsx` → Cleaning guides
3. `GardeningPage.tsx` → Garden planning
4. `DiyPage.tsx` → DIY projects
5. `BudgetingPage.tsx` → Financial tools
6. `SafetyHub.tsx` → Safety protocols
7. `FamilySnapshot.tsx` → Family overview widget
8. `RecipeCard.tsx` → Recipe display
9. `CategoryCard.tsx` → Category navigation
10. `PracticalReportPage.tsx` → Assessments

**Tab Navigation Pattern**:
```tsx
// src/pages/home-life/index.tsx
import { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';

const HOME_LIFE_TABS = ['cooking', 'cleaning', 'gardening', 'diy', 'budgeting'];

export default function HomeLifePage() {
  const [activeTab, setActiveTab] = useState('cooking');

  return (
    <ModuleLayout module="home-life" title="Home Life Skills">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b">
        {HOME_LIFE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'cooking' && <CookingPage />}
      {activeTab === 'cleaning' && <CleaningPage />}
      {activeTab === 'gardening' && <GardeningPage />}
      {activeTab === 'diy' && <DiyPage />}
      {activeTab === 'budgeting' && <BudgetingPage />}
    </ModuleLayout>
  );
}
```

#### 2.4 Migrate Code Create Module
**Source**: sazi-code-create-app  
**Destination**: `src/components/modules/code-create/`

**Components to Migrate**:
1. Course modules and curriculum
2. `QuizRunner.tsx` → Interactive quizzes
3. `ProjectManager.tsx` → Project tracking
4. `CodeEditor.tsx` → Code practice
5. `OfflineManager.tsx` → Offline support
6. `LifeCVIntegration.tsx` → Portfolio connection

**Special Considerations**:
- Preserve offline functionality
- Maintain quiz game mechanics
- Keep LifeCV integration intact

#### 2.5 Migrate Language Learn Module
**Source**: sazi-language-learn-app  
**Destination**: `src/components/modules/language-learn/`

**Components to Migrate**:
1. `KidsVocabularyGame.tsx` → Interactive game
2. `FamilyStoryTime.tsx` → Story-based learning
3. `VocabularyPage.tsx` → Word lists
4. `GrammarPage.tsx` → Grammar rules
5. `CulturePage.tsx` → Cultural context
6. `PhrasesPage.tsx` → Common phrases
7. `NumbersPage.tsx` → Number learning
8. `TimePage.tsx` → Time concepts
9. `AgeLevelsPage.tsx` → Age-appropriate content
10. `AskKhuluPage.tsx` → Q&A feature

### Phase 3: Shared Services & State (Week 7)

#### 3.1 Unified Authentication
**File**: `src/contexts/AuthContext.tsx`

```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, db } from '@/config/firebase.config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'guest' | 'student' | 'parent' | 'educator' | 'admin';
  modules: string[]; // Subscribed modules
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'high-contrast';
  language: string;
  defaultModule?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: userData?.role || 'student',
          modules: userData?.modules || ['academy'],
          preferences: userData?.preferences || {
            theme: 'light',
            language: 'en',
          },
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Create or update user document
    await setDoc(doc(db, 'users', result.user.uid), {
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      lastLogin: new Date(),
    }, { merge: true });
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    if (!user) return;

    const updatedPrefs = { ...user.preferences, ...prefs };
    await setDoc(doc(db, 'users', user.uid), {
      preferences: updatedPrefs,
    }, { merge: true });

    setUser({ ...user, preferences: updatedPrefs });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithGoogle,
      signOut,
      updatePreferences,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

#### 3.2 Progress Tracking Service
**File**: `src/services/progress.service.ts`

```typescript
import { db } from '@/config/firebase.config';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

export interface Progress {
  userId: string;
  moduleId: string; // 'homeschooling', 'home-life', etc.
  itemId: string; // Course/lesson ID
  itemType: 'course' | 'lesson' | 'quiz' | 'project';
  progress: number; // 0-100
  completed: boolean;
  lastAccessed: Date;
  timeSpent: number; // minutes
  achievements: string[];
}

export const progressService = {
  async updateProgress(data: Partial<Progress> & { userId: string; moduleId: string; itemId: string }) {
    const progressRef = doc(db, 'progress', `${data.userId}_${data.moduleId}_${data.itemId}`);

    await setDoc(progressRef, {
      ...data,
      lastAccessed: serverTimestamp(),
    }, { merge: true });
  },

  async getProgress(userId: string, moduleId: string, itemId: string): Promise<Progress | null> {
    const progressRef = doc(db, 'progress', `${userId}_${moduleId}_${itemId}`);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      return progressSnap.data() as Progress;
    }
    return null;
  },

  async getModuleProgress(userId: string, moduleId: string): Promise<Progress[]> {
    const progressQuery = query(
      collection(db, 'progress'),
      where('userId', '==', userId),
      where('moduleId', '==', moduleId)
    );

    const snapshot = await getDocs(progressQuery);
    return snapshot.docs.map(doc => doc.data() as Progress);
  },

  async getAllProgress(userId: string): Promise<Progress[]> {
    const progressQuery = query(
      collection(db, 'progress'),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(progressQuery);
    return snapshot.docs.map(doc => doc.data() as Progress);
  },

  async calculateOverallProgress(userId: string): Promise<{
    totalCourses: number;
    completedCourses: number;
    averageProgress: number;
    totalTimeSpent: number;
  }> {
    const allProgress = await this.getAllProgress(userId);

    const totalCourses = allProgress.filter(p => p.itemType === 'course').length;
    const completedCourses = allProgress.filter(p => p.itemType === 'course' && p.completed).length;
    const averageProgress = allProgress.reduce((sum, p) => sum + p.progress, 0) / (allProgress.length || 1);
    const totalTimeSpent = allProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

    return {
      totalCourses,
      completedCourses,
      averageProgress,
      totalTimeSpent,
    };
  },
};
```

#### 3.3 Achievement System
**File**: `src/services/achievement.service.ts`

```typescript
import { db } from '@/config/firebase.config';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'milestone' | 'community' | 'special';
  points: number;
  criteria: AchievementCriteria;
}

export interface AchievementCriteria {
  type: 'coursesCompleted' | 'streakDays' | 'hoursSpent' | 'perfectScore' | 'custom';
  threshold: number;
  moduleId?: string;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  earnedAt: Date;
  progress: number;
  unlocked: boolean;
}

export const achievementService = {
  async checkAndAwardAchievements(userId: string): Promise<UserAchievement[]> {
    // Get all achievements
    const achievementsSnap = await getDocs(collection(db, 'achievements'));
    const achievements = achievementsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Achievement[];

    // Get user's progress
    const progressQuery = query(
      collection(db, 'progress'),
      where('userId', '==', userId)
    );
    const progressSnap = await getDocs(progressQuery);
    const userProgress = progressSnap.docs.map(doc => doc.data());

    const newAchievements: UserAchievement[] = [];

    // Check each achievement
    for (const achievement of achievements) {
      const isEarned = await this.checkCriteria(achievement.criteria, userProgress);

      if (isEarned) {
        const userAchievement = await this.awardAchievement(userId, achievement.id);
        if (userAchievement) {
          newAchievements.push(userAchievement);
        }
      }
    }

    return newAchievements;
  },

  async checkCriteria(criteria: AchievementCriteria, userProgress: any[]): Promise<boolean> {
    switch (criteria.type) {
      case 'coursesCompleted':
        const completed = userProgress.filter(p =>
          p.itemType === 'course' &&
          p.completed &&
          (!criteria.moduleId || p.moduleId === criteria.moduleId)
        );
        return completed.length >= criteria.threshold;

      case 'hoursSpent':
        const totalMinutes = userProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
        const hours = totalMinutes / 60;
        return hours >= criteria.threshold;

      // Add more criteria types...

      default:
        return false;
    }
  },

  async awardAchievement(userId: string, achievementId: string): Promise<UserAchievement | null> {
    const userAchievementRef = doc(db, 'userAchievements', `${userId}_${achievementId}`);
    const existing = await getDoc(userAchievementRef);

    if (existing.exists() && existing.data().unlocked) {
      return null; // Already awarded
    }

    const userAchievement: UserAchievement = {
      userId,
      achievementId,
      earnedAt: new Date(),
      progress: 100,
      unlocked: true,
    };

    await setDoc(userAchievementRef, {
      ...userAchievement,
      earnedAt: serverTimestamp(),
    });

    return userAchievement;
  },

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const userAchievementsQuery = query(
      collection(db, 'userAchievements'),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(userAchievementsQuery);
    return snapshot.docs.map(doc => doc.data() as UserAchievement);
  },
};
```

### Phase 4: Dashboard Widgets (Week 8)

#### 4.1 Academy-Specific Widgets
**Files to Create**:
1. `src/components/dashboard/widgets/LearningOverviewWidget.tsx`
2. `src/components/dashboard/widgets/CurrentCoursesWidget.tsx`
3. `src/components/dashboard/widgets/AchievementsWidget.tsx`
4. `src/components/dashboard/widgets/FamilyActivityWidget.tsx`
5. `src/components/dashboard/widgets/QuickActionsWidget.tsx`
6. `src/components/dashboard/widgets/RecommendedCoursesWidget.tsx`

**LearningOverviewWidget**:
```tsx
// src/components/dashboard/widgets/LearningOverviewWidget.tsx
import { useAuth } from '@/contexts/AuthContext';
import { progressService } from '@/services/progress.service';
import { useEffect, useState } from 'react';
import { BookOpen, TrendingUp, Clock, Award } from 'lucide-react';

export const LearningOverviewWidget: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    averageProgress: 0,
    totalTimeSpent: 0,
  });

  useEffect(() => {
    if (user) {
      progressService.calculateOverallProgress(user.uid).then(setStats);
    }
  }, [user]);

  const hours = Math.floor(stats.totalTimeSpent / 60);
  const minutes = stats.totalTimeSpent % 60;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Learning Overview
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Courses</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalCourses}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <Award className="w-6 h-6 text-green-600 dark:text-green-300" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.completedCourses}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Progress</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(stats.averageProgress)}%
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
            <Clock className="w-6 h-6 text-orange-600 dark:text-orange-300" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Time Spent</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {hours}h {minutes}m
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
```

**CurrentCoursesWidget**:
```tsx
// src/components/dashboard/widgets/CurrentCoursesWidget.tsx
import { useAuth } from '@/contexts/AuthContext';
import { progressService } from '@/services/progress.service';
import { useEffect, useState } from 'react';
import { Progress } from '@/services/progress.service';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const CurrentCoursesWidget: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Progress[]>([]);

  useEffect(() => {
    if (user) {
      progressService.getAllProgress(user.uid).then(allProgress => {
        const activeCourses = allProgress
          .filter(p => p.itemType === 'course' && !p.completed)
          .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())
          .slice(0, 3);
        setCourses(activeCourses);
      });
    }
  }, [user]);

  const getModuleIcon = (moduleId: string) => {
    const icons: Record<string, string> = {
      homeschooling: '🎓',
      'home-life': '🏠',
      'code-create': '💻',
      'language-learn': '🗣️',
      academy: '📚',
    };
    return icons[moduleId] || '📘';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Continue Learning
      </h3>

      <div className="space-y-4">
        {courses.map((course) => (
          <Link
            key={course.itemId}
            href={`/${course.moduleId}/${course.itemId}`}
            className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getModuleIcon(course.moduleId)}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {course.itemId}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.moduleId.replace('-', ' ')}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.round(course.progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </Link>
        ))}

        {courses.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400 py-8">
            No active courses. Start learning today!
          </p>
        )}
      </div>

      <Link
        href="/courses"
        className="mt-4 block text-center text-blue-600 dark:text-blue-400 hover:underline"
      >
        View All Courses →
      </Link>
    </div>
  );
};
```

### Phase 5: Testing & Deployment (Week 9-10)

#### 5.1 Testing Checklist
- [ ] Navigation: All sidebar links work
- [ ] Auth: Google Sign-In flow
- [ ] Guest Access: Browse without login
- [ ] Progress Tracking: Save and load progress
- [ ] Achievements: Award and display achievements
- [ ] Responsive Design: Mobile, tablet, desktop
- [ ] Theme Switching: Light/dark/high-contrast
- [ ] Language Switching: All 14 languages
- [ ] Module Integration: All 5 modules functional
- [ ] Offline Support: Code Create module works offline
- [ ] Performance: Page load < 3s
- [ ] Accessibility: WCAG 2.1 AA compliance

#### 5.2 Deployment Configuration
**File**: `firebase.json`

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

---

## 📊 Migration Completion Checklist

### Core Infrastructure
- [ ] Navigation system implemented
- [ ] Layout components created
- [ ] Auth context configured
- [ ] Firebase integration setup
- [ ] Theme system working
- [ ] Language switching functional

### Module Migration
- [ ] Academy Core module migrated
- [ ] Homeschooling module migrated
- [ ] Home Life module migrated
- [ ] Code Create module migrated
- [ ] Language Learn module migrated

### Services & State
- [ ] Progress tracking service
- [ ] Achievement system
- [ ] Module context
- [ ] Shared hooks
- [ ] Type definitions

### Dashboard & Widgets
- [ ] Main dashboard page
- [ ] Learning overview widget
- [ ] Current courses widget
- [ ] Achievements widget
- [ ] Family activity widget
- [ ] Quick actions widget

### Testing & Quality
- [ ] All navigation links tested
- [ ] Auth flow verified
- [ ] Progress tracking works
- [ ] Responsive design confirmed
- [ ] Accessibility compliance
- [ ] Performance benchmarks met

### Deployment
- [ ] Firebase hosting configured
- [ ] Environment variables set
- [ ] Build process verified
- [ ] Production deployment successful
- [ ] DNS configured for sazi-life-academy.web.app

---

## 🎯 Success Metrics

### Technical Metrics
- **Page Load Time**: < 3 seconds
- **Lighthouse Score**: > 90
- **Accessibility Score**: WCAG 2.1 AA (100%)
- **Mobile Responsiveness**: 100%
- **Code Coverage**: > 80%

### User Experience Metrics
- **Navigation Clarity**: All modules accessible within 2 clicks
- **Feature Parity**: 100% of original features preserved
- **Cross-Module Navigation**: Seamless transitions
- **Theme Consistency**: Unified visual language

### Business Metrics
- **Single Entry Point**: All traffic through sazi-life-academy.web.app
- **User Retention**: Improved with unified dashboard
- **Feature Discovery**: Increased cross-module usage
- **Development Efficiency**: Faster feature additions

---

## 📝 Next Steps

1. **Review this specification** with stakeholders
2. **Create detailed wireframes** for unified dashboard
3. **Set up development environment** with new repo structure
4. **Begin Phase 1**: Foundation & Infrastructure (Weeks 1-2)
5. **Schedule weekly reviews** to track progress
6. **Plan user testing** for beta release
7. **Prepare migration documentation** for users

---

## 🔗 Related Documentation

- `LIFESYNC_COMPREHENSIVE_UPDATE_SPECIFICATION.md` - LifeSync alignment reference
- `ECOSYSTEM_HEADER_ENHANCEMENT.md` - Header navigation implementation
- `SIDEBAR_NAVIGATION_IMPLEMENTATION.md` - Sidebar structure details
- `SAZI_ACADEMY_ENHANCEMENT_SPECIFICATIONS.md` - Original academy specs
- `SAZI_LIFELONG_CURRICULUM_FRAMEWORK.md` - Learning framework

---

**Document Status**: Ready for Review and Implementation  
**Last Updated**: October 27, 2025  
**Next Review**: Start of Phase 1 (Week 1)
