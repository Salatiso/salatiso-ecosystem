# MNI Web Apps Technical Specification
## Version 2.0 - Post-Upgrade Architecture

**Document Version:** 2.0  
**Date:** October 8, 2025  
**Status:** Draft - Upgrade Specification  
**Previous Version:** 1.0 (Current Production)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Component Specifications](#component-specifications)
5. [Data Models](#data-models)
6. [API Specifications](#api-specifications)
7. [Security Architecture](#security-architecture)
8. [Performance Requirements](#performance-requirements)
9. [Integration Points](#integration-points)
10. [Deployment Architecture](#deployment-architecture)

---

## 1. System Overview

### 1.1 Purpose
The MNI Web Apps ecosystem consists of two primary applications that support family enterprise management, career development, and Ubuntu-centered governance:

- **Salatiso LifeCV** - Personal career development and family engagement platform
- **BizHelp LifeCV** - Business support and enterprise management platform

### 1.2 Upgrade Objectives
This specification defines the enhanced technical architecture following the integration of:
- Family tree and timeline visualization
- Business organogram and career paths
- Interactive role documentation
- Ubuntu philosophy integration
- Educational repository features
- Community collaboration tools

### 1.3 Users & Roles

#### User Types
1. **Family Members** - Full access to family content and personal features
2. **Extended Family** - Limited access to public family content
3. **Business Partners** - Access to specific business ventures
4. **Public Users** - Access to marketing and public content
5. **Administrators** - Full system management capabilities

#### Permission Levels
- **Owner** - Full administrative rights (Salatiso)
- **Admin** - Content management and user administration
- **Editor** - Content creation and editing
- **Member** - Standard family member access
- **Viewer** - Read-only access
- **Guest** - Public content only

---

## 2. Architecture

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  Next.js Application (Static Export + Client-Side Routing)  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Salatiso   │  │   BizHelp    │  │   Shared     │      │
│  │   LifeCV     │  │   LifeCV     │  │  Components  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  React Components + Tailwind CSS + Framer Motion            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  New Components (Phase 2.0)                          │   │
│  │  • FamilyTree        • BusinessOrganogram            │   │
│  │  • FamilyTimeline    • CareerPaths                   │   │
│  │  • FamilyProfiles    • RoleDocuments                 │   │
│  │  • UbuntuWisdom      • EducationalRepository         │   │
│  │  • CommunityBoard    • InteractiveEditor             │   │
│  │  • BetaTesting       • TestingDashboard              │   │
│  │  • WeeklyReport      • PerformanceTracker            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                      │
├─────────────────────────────────────────────────────────────┤
│  Context Providers & State Management                        │
│  • AuthContext (Firebase Auth)                              │
│  • I18nContext (Multi-language)                             │
│  • FamilyDataContext (NEW)                                  │
│  • CareerProgressContext (NEW)                              │
│  • UbuntuThemeContext (NEW)                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  Firebase Services                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Firestore   │  │   Storage    │  │  Functions   │      │
│  │  (Database)  │  │   (Files)    │  │   (APIs)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Application Structure

```
salatiso-ecosystem/
├── src/
│   ├── components/
│   │   ├── family/              (NEW)
│   │   │   ├── FamilyTree.tsx
│   │   │   ├── FamilyTimeline.tsx
│   │   │   ├── FamilyProfiles.tsx
│   │   │   ├── FamilyMemberCard.tsx
│   │   │   └── FamilyNavigation.tsx
│   │   ├── business/            (NEW)
│   │   │   ├── BusinessOrganogram.tsx
│   │   │   ├── CareerPaths.tsx
│   │   │   ├── RoleDocuments.tsx
│   │   │   └── VentureCard.tsx
│   │   ├── ubuntu/              (NEW)
│   │   │   ├── UbuntuWisdom.tsx
│   │   │   ├── UbuntuThemeProvider.tsx
│   │   │   ├── CulturalElements.tsx
│   │   │   └── WisdomQuote.tsx
│   │   ├── education/           (NEW)
│   │   │   ├── EducationalRepository.tsx
│   │   │   ├── LearningModule.tsx
│   │   │   ├── ProgressTracker.tsx
│   │   │   └── AssessmentComponent.tsx
│   │   ├── community/           (NEW)
│   │   │   ├── CommunityBoard.tsx
│   │   │   ├── EventCalendar.tsx
│   │   │   ├── MessageThread.tsx
│   │   │   └── AchievementFeed.tsx
│   │   ├── editor/              (NEW)
│   │   │   ├── RichTextEditor.tsx
│   │   │   ├── CollaborativeEditor.tsx
│   │   │   └── VersionControl.tsx
│   │   ├── layouts/
│   │   ├── dashboard/
│   │   └── templates/
│   ├── contexts/
│   │   ├── AuthContext.tsx      (EXISTING)
│   │   ├── I18nContext.tsx      (EXISTING)
│   │   ├── FamilyDataContext.tsx     (NEW)
│   │   ├── CareerProgressContext.tsx (NEW)
│   │   └── UbuntuThemeContext.tsx    (NEW)
│   ├── hooks/                   (NEW)
│   │   ├── useFamilyData.ts
│   │   ├── useCareerProgress.ts
│   │   ├── useUbuntuTheme.ts
│   │   └── useRealTimeSync.ts
│   ├── services/                (NEW)
│   │   ├── familyService.ts
│   │   ├── careerService.ts
│   │   ├── educationService.ts
│   │   └── communityService.ts
│   ├── types/
│   │   ├── family.ts            (NEW)
│   │   ├── career.ts            (NEW)
│   │   ├── education.ts         (NEW)
│   │   └── index.ts
│   ├── utils/                   (NEW)
│   │   ├── familyTreeHelpers.ts
│   │   ├── dateFormatters.ts
│   │   └── validators.ts
│   └── pages/
│       ├── intranet/
│       │   ├── family-tree.tsx       (NEW)
│       │   ├── timeline.tsx          (ENHANCED)
│       │   ├── organogram.tsx        (NEW)
│       │   ├── career-paths.tsx      (NEW)
│       │   ├── profiles.tsx          (NEW)
│       │   └── community.tsx         (NEW)
│       └── ...
├── functions/                   (NEW - Firebase Functions)
│   ├── src/
│   │   ├── api/
│   │   │   ├── family.ts
│   │   │   ├── career.ts
│   │   │   └── community.ts
│   │   └── triggers/
│   │       ├── onProfileUpdate.ts
│   │       └── onCareerProgress.ts
│   └── package.json
└── docs/                        (ENHANCED)
    ├── TECHNICAL_SPECIFICATION_V2.md
    ├── API_DOCUMENTATION.md
    ├── COMPONENT_LIBRARY.md
    └── DEPLOYMENT_GUIDE.md
```

---

## 3. Technology Stack

### 3.1 Frontend Technologies

#### Core Framework
- **Next.js 14.2.33** - React framework with static export
- **React 18.2.0** - UI library
- **TypeScript 5.2.2** - Type safety

#### Styling & Animation
- **Tailwind CSS 3.3.5** - Utility-first CSS
- **Framer Motion 10.16.4** - Animation library
- **@tailwindcss/typography** - Rich text styling

#### NEW: Data Visualization
```json
{
  "react-flow-renderer": "^10.3.17",
  "d3": "^7.8.5",
  "recharts": "^2.10.0",
  "react-timeline-component": "^2.1.0"
}
```

#### NEW: Rich Content
```json
{
  "react-markdown": "^9.0.1",
  "react-quill": "^2.0.0",
  "quill": "^1.3.7",
  "react-pdf": "^7.5.1"
}
```

#### NEW: Real-Time & Collaboration
```json
{
  "socket.io-client": "^4.7.2",
  "yjs": "^13.6.10",
  "y-websocket": "^1.5.0"
}
```

#### NEW: Utilities
```json
{
  "date-fns": "^2.30.0",
  "lodash-es": "^4.17.21",
  "react-virtualized": "^9.22.5",
  "react-intersection-observer": "^9.5.3"
}
```

### 3.2 Backend Technologies

#### Firebase Services
- **Firebase Auth** - Authentication and authorization
- **Cloud Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **Firebase Functions** - Serverless backend (NEW)
- **Firebase Hosting** - Static site hosting

#### NEW: Firebase Functions Stack
```json
{
  "firebase-functions": "^4.5.0",
  "firebase-admin": "^11.11.1",
  "express": "^4.18.2",
  "cors": "^2.8.5"
}
```

### 3.3 Development Tools

#### Testing
- **Jest 29.7.0** - Test runner
- **@testing-library/react** - React testing utilities
- **@testing-library/jest-dom** - DOM matchers
- **Cypress** (NEW) - E2E testing

#### Code Quality
- **ESLint** - Linting
- **Prettier** (NEW) - Code formatting
- **Husky** (NEW) - Git hooks
- **lint-staged** (NEW) - Pre-commit linting

#### NEW: Development Utilities
```json
{
  "storybook": "^7.5.3",
  "chromatic": "^10.0.0",
  "webpack-bundle-analyzer": "^4.10.1"
}
```

---

## 4. Component Specifications

### 4.1 FamilyTree Component

#### Purpose
Interactive visualization of the Mdeni-Jalamba family structure with clickable nodes and detailed information.

#### Props Interface
```typescript
interface FamilyTreeProps {
  rootPersonId?: string;           // Start tree from specific person
  displayMode?: 'full' | 'compact' | 'lineage';
  showPhotos?: boolean;
  showDates?: boolean;
  onPersonClick?: (person: FamilyMember) => void;
  highlightMembers?: string[];     // Highlight specific members
  maxGenerations?: number;
  interactive?: boolean;
}
```

#### State Management
```typescript
interface FamilyTreeState {
  members: FamilyMember[];
  relationships: FamilyRelationship[];
  selectedPerson: FamilyMember | null;
  viewportCenter: { x: number; y: number };
  zoomLevel: number;
  loading: boolean;
  error: string | null;
}
```

#### Features
- ✅ Pan and zoom capability
- ✅ Click to view detailed profiles
- ✅ Search and filter functionality
- ✅ Responsive layout (collapse on mobile)
- ✅ Export to PDF/PNG
- ✅ Multi-generational view
- ✅ Spouse and children relationships
- ✅ Ubuntu color coding by generation

#### Technical Implementation
```typescript
// libs: react-flow-renderer, d3
import ReactFlow, { Node, Edge } from 'react-flow-renderer';

export const FamilyTree: React.FC<FamilyTreeProps> = ({
  rootPersonId = 'notemba',
  displayMode = 'full',
  showPhotos = true,
  onPersonClick
}) => {
  const { members, relationships } = useFamilyData();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    // Transform family data to react-flow nodes/edges
    const treeData = buildFamilyTree(members, relationships, rootPersonId);
    setNodes(treeData.nodes);
    setEdges(treeData.edges);
  }, [members, relationships, rootPersonId]);

  return (
    <div className="h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => onPersonClick?.(node.data)}
        fitView
      />
    </div>
  );
};
```

### 4.2 FamilyTimeline Component

#### Purpose
Chronological visualization of family history, key events, and educational milestones.

#### Props Interface
```typescript
interface FamilyTimelineProps {
  events?: TimelineEvent[];
  filterByPerson?: string;
  filterByCategory?: EventCategory[];
  startYear?: number;
  endYear?: number;
  showEducationalNotes?: boolean;
  interactive?: boolean;
}

enum EventCategory {
  BIRTH = 'birth',
  EDUCATION = 'education',
  CAREER = 'career',
  FAMILY = 'family',
  MILESTONE = 'milestone',
  BUSINESS = 'business'
}
```

#### Features
- ✅ Horizontal scrollable timeline
- ✅ Category filtering
- ✅ Educational annotations
- ✅ Photo attachments
- ✅ Link to detailed event pages
- ✅ Progress tracking for educational events
- ✅ Mobile-friendly vertical layout
- ✅ Export timeline to PDF

### 4.3 BusinessOrganogram Component

#### Purpose
Visual representation of MNI business structure with interactive role nodes.

#### Props Interface
```typescript
interface BusinessOrganogramProps {
  ventureFilter?: string[];        // Filter by specific ventures
  showVacancies?: boolean;
  highlightRoles?: string[];
  onRoleClick?: (role: Role) => void;
  layout?: 'hierarchical' | 'radial' | 'force-directed';
}

interface Role {
  id: string;
  title: string;
  holder?: FamilyMember;
  venture: string;
  responsibilities: string[];
  reportingTo?: string;
  team?: string[];
  status: 'filled' | 'vacant' | 'pending';
}
```

#### Features
- ✅ Multiple layout algorithms
- ✅ Hover for role details
- ✅ Click to view full role document
- ✅ Color-coded by venture
- ✅ Ubuntu color scheme
- ✅ Vacancy highlighting
- ✅ Reporting line visualization
- ✅ Responsive design

### 4.4 CareerPaths Component

#### Purpose
Display career development paths, prerequisites, and progress tracking.

#### Props Interface
```typescript
interface CareerPathsProps {
  personId?: string;               // Show paths for specific person
  showAllPaths?: boolean;
  highlightAvailable?: boolean;
  onPathSelect?: (path: CareerPath) => void;
}

interface CareerPath {
  id: string;
  title: string;
  description: string;
  prerequisites: Prerequisite[];
  milestones: Milestone[];
  estimatedDuration: string;
  roles: Role[];
  skills: Skill[];
  deliverables: Deliverable[];
}
```

#### Features
- ✅ Interactive path visualization
- ✅ Progress indicators
- ✅ Prerequisite checker
- ✅ Milestone tracking
- ✅ Skill assessment integration
- ✅ Recommended next steps
- ✅ Completion certificates

### 4.5 FamilyProfiles Component

#### Purpose
Immersive profile showcase starting with Notemba (Mother), including contributions and Ubuntu wisdom.

#### Props Interface
```typescript
interface FamilyProfilesProps {
  personId: string;
  editable?: boolean;
  showContributions?: boolean;
  showTimeline?: boolean;
  showWisdom?: boolean;
}

interface FamilyProfile {
  id: string;
  name: string;
  photo: string;
  birthDate: Date;
  role: string;
  bio: string;
  contributions: Contribution[];
  wisdom: UbuntuWisdom[];
  achievements: Achievement[];
  timeline: TimelineEvent[];
  media: MediaItem[];
}
```

#### Features
- ✅ Rich media gallery
- ✅ Interactive contribution showcase
- ✅ Ubuntu wisdom highlights
- ✅ Achievement timeline
- ✅ Edit mode for authorized users
- ✅ Social sharing
- ✅ Print-friendly view

### 4.6 UbuntuWisdom Component

#### Purpose
Display Ubuntu philosophy quotes, teachings, and cultural elements throughout the app.

#### Props Interface
```typescript
interface UbuntuWisdomProps {
  category?: WisdomCategory;
  random?: boolean;
  personId?: string;               // Show wisdom from specific person
  displayMode?: 'quote' | 'card' | 'banner';
}

enum WisdomCategory {
  FAMILY = 'family',
  BUSINESS = 'business',
  EDUCATION = 'education',
  LEADERSHIP = 'leadership',
  COMMUNITY = 'community'
}
```

#### Features
- ✅ Random wisdom rotation
- ✅ Category filtering
- ✅ Attribution to family members
- ✅ Multilingual support (11 SA languages)
- ✅ Share on social media
- ✅ Favorite wisdom collection

### 4.7 EducationalRepository Component

#### Purpose
Showcase educational journeys, homeschooling content, and learning modules.

#### Props Interface
```typescript
interface EducationalRepositoryProps {
  studentId?: string;
  subject?: string[];
  gradeLevel?: string;
  showAssessments?: boolean;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  content: string;               // Markdown content
  attachments: Attachment[];
  assessments: Assessment[];
  progress: Progress;
  covidExperience?: boolean;     // Flag for COVID-related content
}
```

#### Features
- ✅ Interactive learning modules
- ✅ Progress tracking
- ✅ Assessment integration
- ✅ COVID-19 experience documentation
- ✅ Homeschooling transition examples
- ✅ Solo's educational journey showcase
- ✅ Parent/teacher annotations

### 4.8 BetaTesting Component

#### Purpose
Automated beta tester assignment and management for all family members with integrated testing dashboard.

#### Props Interface
```typescript
interface BetaTestingProps {
  personId: string;
  testingUrl?: string;             // Default: https://bizhelp-lifecv.web.app/testing
  showWeeklyReports?: boolean;
  showPerformanceMetrics?: boolean;
  editable?: boolean;
}
```

#### Features
- ✅ Automatic beta tester assignment for all family members
- ✅ Testing dashboard integration
- ✅ Weekly report requirements tracking
- ✅ Performance management integration
- ✅ Career document inclusion of testing contributions
- ✅ Automated report generation and notifications
- ✅ Testing progress visualization and analytics

#### Technical Implementation
```typescript
// Automatic assignment on family member creation
useEffect(() => {
  if (isFamilyMember && !isBetaTester) {
    assignBetaTester(personId);
  }
}, [personId, isFamilyMember, isBetaTester]);
```

### 4.9 TestingDashboard Component

#### Purpose
Central testing dashboard at https://bizhelp-lifecv.web.app/testing for family beta testers.

#### Props Interface
```typescript
interface TestingDashboardProps {
  personId: string;
  viewMode?: 'personal' | 'family' | 'admin';
  timeRange?: 'week' | 'month' | 'quarter';
  showAnalytics?: boolean;
}
```

#### Features
- ✅ Personal testing progress tracking
- ✅ Weekly report submission interface
- ✅ Family-wide testing participation overview
- ✅ Automated report generation
- ✅ Testing analytics and insights
- ✅ Performance metrics integration
- ✅ Notification system for deadlines

### 4.10 WeeklyReport Component

#### Purpose
Structured weekly testing report component integrated into LifeCV and career documents.

#### Props Interface
```typescript
interface WeeklyReportProps {
  personId: string;
  weekStart: Date;
  editable?: boolean;
  includeInLifeCV?: boolean;
  includeInCareerDoc?: boolean;
}
```

#### Features
- ✅ Structured testing report template
- ✅ Automated report generation from testing data
- ✅ Integration with LifeCV documents
- ✅ Career document inclusion
- ✅ Performance management tracking
- ✅ Historical report archive
- ✅ Report sharing and collaboration

### 4.11 PerformanceTracker Component

#### Purpose
Performance management integration for beta testing participation and contributions.

#### Props Interface
```typescript
interface PerformanceTrackerProps {
  personId: string;
  metrics: PerformanceMetric[];
  includeTesting?: boolean;
  showCareerImpact?: boolean;
}
```

#### Features
- ✅ Testing participation metrics
- ✅ Report quality assessment
- ✅ Career progression integration
- ✅ Performance review integration
- ✅ Achievement recognition
- ✅ Goal setting and tracking

### 4.12 CommunityBoard Component

#### Purpose
Family message board, event calendar, and achievement celebrations.

#### Props Interface
```typescript
interface CommunityBoardProps {
  boardType?: 'messages' | 'events' | 'achievements';
  filterByVenture?: string;
  canPost?: boolean;
}
```

#### Features
- ✅ Real-time message updates
- ✅ Event calendar with RSVP
- ✅ Achievement celebrations
- ✅ Photo/video sharing
- ✅ Reactions and comments
- ✅ Notification system
- ✅ Ubuntu circle discussions

---

## 5. Data Models

### 5.1 Firestore Collections

#### Collection: `family_members`
```typescript
interface FamilyMember {
  id: string;                      // Unique identifier
  firstName: string;
  lastName: string;
  maidenName?: string;
  nicknames?: string[];
  photo: string;                   // Storage URL
  birthDate: Timestamp;
  birthPlace?: string;
  currentLocation?: string;
  bio: string;
  role: string;                    // Family role
  businessRoles: string[];         // Roles in ventures
  generation: number;              // Generation number
  parents?: string[];              // Parent IDs
  spouse?: string;                 // Spouse ID
  children?: string[];             // Children IDs
  siblings?: string[];             // Sibling IDs
  email?: string;
  phone?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
  permissions: PermissionLevel;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Collection: `family_relationships`
```typescript
interface FamilyRelationship {
  id: string;
  person1: string;                 // Person ID
  person2: string;                 // Person ID
  relationshipType: RelationshipType;
  startDate?: Timestamp;
  endDate?: Timestamp;
  notes?: string;
  createdAt: Timestamp;
}

enum RelationshipType {
  PARENT_CHILD = 'parent-child',
  SPOUSE = 'spouse',
  SIBLING = 'sibling',
  GRANDPARENT_GRANDCHILD = 'grandparent-grandchild',
  UNCLE_AUNT_NEPHEW_NIECE = 'uncle-aunt-nephew-niece',
  COUSIN = 'cousin'
}
```

#### Collection: `timeline_events`
```typescript
interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: Timestamp;
  endDate?: Timestamp;
  people: string[];                // Person IDs involved
  location?: string;
  photos: string[];                // Storage URLs
  educationalNote?: string;        // For teaching purposes
  significance: 'high' | 'medium' | 'low';
  visibility: 'public' | 'family' | 'private';
  createdBy: string;               // User ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Collection: `business_roles`
```typescript
interface BusinessRole {
  id: string;
  title: string;
  venture: string;                 // Venture name
  holder?: string;                 // Person ID
  description: string;
  responsibilities: string[];
  deliverables: string[];
  reportingTo?: string;            // Role ID
  team: string[];                  // Role IDs
  prerequisites: Prerequisite[];
  status: 'filled' | 'vacant' | 'pending';
  salaryRange?: string;
  documentUrl?: string;            // Link to role HTML document
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Collection: `career_paths`
```typescript
interface CareerPath {
  id: string;
  title: string;
  description: string;
  prerequisites: Prerequisite[];
  milestones: Milestone[];
  roles: string[];                 // Role IDs
  skills: Skill[];
  estimatedDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Prerequisite {
  type: 'education' | 'skill' | 'experience' | 'certification';
  title: string;
  description: string;
  required: boolean;
}

interface Milestone {
  title: string;
  description: string;
  order: number;
  estimatedDuration: string;
  deliverables: string[];
}

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}
```

#### Collection: `ubuntu_wisdom`
```typescript
interface UbuntuWisdom {
  id: string;
  quote: string;
  translations: {                  // 11 SA languages
    en: string;
    xh: string;
    zu: string;
    af: string;
    st: string;
    tn: string;
    ss: string;
    ve: string;
    ts: string;
    nr: string;
    nso: string;
  };
  attribution?: string;            // Person ID
  category: WisdomCategory;
  context?: string;
  dateShared?: Timestamp;
  favorites: string[];             // User IDs who favorited
  createdAt: Timestamp;
}
```

#### Collection: `educational_modules`
```typescript
interface EducationalModule {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  content: string;                 // Markdown
  attachments: Attachment[];
  assessments: Assessment[];
  studentId?: string;              // If specific to student
  covidRelated: boolean;
  homeschoolingExample: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Assessment {
  id: string;
  type: 'quiz' | 'essay' | 'project' | 'practical';
  questions: Question[];
  passingScore: number;
  timeLimit?: number;              // Minutes
}
```

#### Collection: `community_posts`
```typescript
interface CommunityPost {
  id: string;
  type: 'message' | 'event' | 'achievement';
  title: string;
  content: string;
  author: string;                  // Person ID
  venture?: string;                // If venture-specific
  attachments: Attachment[];
  reactions: Reaction[];
  comments: Comment[];
  visibility: 'public' | 'family' | 'venture';
  eventDate?: Timestamp;           // For events
  rsvp?: RSVP[];                   // For events
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Reaction {
  userId: string;
  type: 'like' | 'love' | 'celebrate' | 'support';
  timestamp: Timestamp;
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: Timestamp;
}

interface RSVP {
  userId: string;
  status: 'going' | 'maybe' | 'not-going';
  timestamp: Timestamp;
}
```

#### Collection: `career_progress`
```typescript
interface CareerProgress {
  id: string;
  personId: string;
  careerPathId: string;
  currentMilestone: number;
  completedMilestones: number[];
  skillsAcquired: Skill[];
  deliverables: CompletedDeliverable[];
  startDate: Timestamp;
  expectedCompletionDate?: Timestamp;
  actualCompletionDate?: Timestamp;
  status: 'not-started' | 'in-progress' | 'paused' | 'completed';
  notes: string;
  updatedAt: Timestamp;
}

interface CompletedDeliverable {
  title: string;
  completionDate: Timestamp;
  evidence: string;                // URL to proof
  approvedBy?: string;             // Person ID
}
```

#### Collection: `beta_testers`
```typescript
interface BetaTester {
  id: string;
  personId: string;
  assignedDate: Timestamp;
  status: 'active' | 'inactive' | 'suspended';
  testingLevel: 'basic' | 'intermediate' | 'advanced';
  specializations: string[];       // App areas they test
  weeklyReportRequired: boolean;
  lastReportDate?: Timestamp;
  totalReportsSubmitted: number;
  averageReportQuality: number;     // 1-5 scale
  performanceScore: number;         // 1-100 scale
  achievements: BetaTestingAchievement[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface BetaTestingAchievement {
  id: string;
  title: string;
  description: string;
  earnedDate: Timestamp;
  type: 'bug-finder' | 'feature-suggester' | 'consistent-tester' | 'quality-reporter';
}
```

#### Collection: `weekly_reports`
```typescript
interface WeeklyReport {
  id: string;
  personId: string;
  weekStart: Timestamp;
  weekEnd: Timestamp;
  appsTested: TestedApp[];
  bugsFound: BugReport[];
  featureSuggestions: FeatureSuggestion[];
  usabilityIssues: UsabilityIssue[];
  performanceObservations: PerformanceObservation[];
  overallRating: number;            // 1-5 scale
  recommendations: string;
  timeSpent: number;                // Hours spent testing
  includedInLifeCV: boolean;
  includedInCareerDoc: boolean;
  submittedAt: Timestamp;
  reviewedBy?: string;              // Admin who reviewed
  reviewNotes?: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
}

interface TestedApp {
  appName: string;
  appUrl: string;
  featuresTested: string[];
  issuesFound: number;
  rating: number;                   // 1-5 scale
  notes: string;
}

interface BugReport {
  id: string;
  appName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  screenshots: string[];            // Storage URLs
  browserInfo: BrowserInfo;
  status: 'open' | 'investigating' | 'fixed' | 'wont-fix';
  reportedAt: Timestamp;
}

interface FeatureSuggestion {
  id: string;
  appName: string;
  title: string;
  description: string;
  useCase: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  screenshots: string[];            // Storage URLs
  status: 'submitted' | 'under-review' | 'planned' | 'implemented';
  submittedAt: Timestamp;
}

interface UsabilityIssue {
  id: string;
  appName: string;
  issueType: 'navigation' | 'accessibility' | 'performance' | 'design' | 'functionality';
  description: string;
  severity: 'minor' | 'moderate' | 'major';
  userImpact: string;
  suggestions: string[];
  status: 'open' | 'addressed' | 'resolved';
}

interface PerformanceObservation {
  id: string;
  appName: string;
  metric: 'load-time' | 'responsiveness' | 'memory-usage' | 'battery-impact';
  value: number;
  unit: string;
  context: string;
  severity: 'good' | 'acceptable' | 'concerning' | 'critical';
  observations: string;
}
```

#### Collection: `testing_analytics`
```typescript
interface TestingAnalytics {
  id: string;
  period: 'weekly' | 'monthly' | 'quarterly';
  startDate: Timestamp;
  endDate: Timestamp;
  totalTesters: number;
  activeTesters: number;
  reportsSubmitted: number;
  averageReportQuality: number;
  bugsFound: number;
  bugsBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  featureSuggestions: number;
  appsCoverage: AppCoverage[];
  testerPerformance: TesterPerformance[];
  trends: TestingTrend[];
  recommendations: string[];
  generatedAt: Timestamp;
}

interface AppCoverage {
  appName: string;
  testersAssigned: number;
  reportsReceived: number;
  coveragePercentage: number;
  averageRating: number;
}

interface TesterPerformance {
  personId: string;
  reportsSubmitted: number;
  averageQuality: number;
  bugsFound: number;
  suggestionsMade: number;
  consistencyScore: number;         // Based on weekly submissions
  performanceScore: number;
}

interface TestingTrend {
  metric: string;
  previousValue: number;
  currentValue: number;
  change: number;
  changePercentage: number;
  trend: 'improving' | 'stable' | 'declining';
}
```

### 5.2 Firebase Storage Structure

```
/family/
  /photos/
    /{personId}/
      /profile.jpg
      /gallery/
        /{imageId}.jpg
  /documents/
    /roles/
      /{roleId}.html
      /{roleId}.pdf
    /education/
      /{moduleId}/
        /content.md
        /attachments/
  /timeline/
    /{eventId}/
      /photos/
      /videos/
/community/
  /posts/
    /{postId}/
      /attachments/
```

---

## 6. API Specifications

### 6.1 Firebase Functions Endpoints

#### Family Data APIs

**GET /api/family/tree**
```typescript
// Get family tree data
Request: {
  rootPersonId?: string;
  generations?: number;
}

Response: {
  members: FamilyMember[];
  relationships: FamilyRelationship[];
}
```

**GET /api/family/member/:id**
```typescript
// Get detailed family member profile
Response: FamilyMember & {
  fullTimeline: TimelineEvent[];
  contributions: Contribution[];
  wisdom: UbuntuWisdom[];
}
```

**POST /api/family/member**
```typescript
// Create/update family member
Request: Partial<FamilyMember>
Response: FamilyMember
// Requires: Admin permission
```

#### Career & Business APIs

**GET /api/career/paths**
```typescript
// Get all career paths
Request: {
  category?: string;
  difficulty?: string;
}
Response: CareerPath[]
```

**GET /api/career/progress/:personId**
```typescript
// Get person's career progress
Response: CareerProgress[]
```

**POST /api/career/milestone/complete**
```typescript
// Mark milestone as complete
Request: {
  progressId: string;
  milestoneIndex: number;
  deliverables: CompletedDeliverable[];
}
Response: CareerProgress
```

**GET /api/business/organogram**
```typescript
// Get business structure
Request: {
  venture?: string;
}
Response: {
  roles: BusinessRole[];
  hierarchy: RoleHierarchy;
}
```

#### Timeline APIs

**GET /api/timeline/events**
```typescript
// Get timeline events
Request: {
  startDate?: Date;
  endDate?: Date;
  category?: EventCategory;
  personId?: string;
}
Response: TimelineEvent[]
```

**POST /api/timeline/event**
```typescript
// Create timeline event
Request: Partial<TimelineEvent>
Response: TimelineEvent
// Requires: Editor permission
```

#### Community APIs

**GET /api/community/posts**
```typescript
// Get community posts
Request: {
  type?: 'message' | 'event' | 'achievement';
  venture?: string;
  limit?: number;
  cursor?: string;
}
Response: {
  posts: CommunityPost[];
  nextCursor?: string;
}
```

**POST /api/community/post**
```typescript
// Create community post
Request: Partial<CommunityPost>
Response: CommunityPost
```

**POST /api/community/reaction**
```typescript
// Add reaction to post
Request: {
  postId: string;
  type: ReactionType;
}
Response: CommunityPost
```

#### Education APIs

**GET /api/education/modules**
```typescript
// Get educational modules
Request: {
  subject?: string;
  gradeLevel?: string;
  studentId?: string;
}
Response: EducationalModule[]
```

**POST /api/education/progress**
```typescript
// Update learning progress
Request: {
  moduleId: string;
  studentId: string;
  completed: boolean;
  assessmentResults?: AssessmentResult;
}
Response: Progress
```

#### Beta Testing APIs

**POST /api/beta-testing/assign**
```typescript
// Automatically assign beta tester role to family member
Request: {
  personId: string;
  testingLevel?: 'basic' | 'intermediate' | 'advanced';
  specializations?: string[];
}
Response: BetaTester
// Requires: Admin permission
// Auto-called when new family member is added
```

**GET /api/beta-testing/dashboard/:personId**
```typescript
// Get testing dashboard data for person
Response: {
  tester: BetaTester;
  currentWeekReport?: WeeklyReport;
  previousReports: WeeklyReport[];
  performance: TesterPerformance;
  achievements: BetaTestingAchievement[];
}
```

**POST /api/beta-testing/report**
```typescript
// Submit weekly testing report
Request: Partial<WeeklyReport>
Response: WeeklyReport
// Requires: Active beta tester
```

**GET /api/beta-testing/analytics**
```typescript
// Get testing analytics (admin/family overview)
Request: {
  period?: 'weekly' | 'monthly' | 'quarterly';
  personId?: string;  // For personal analytics
}
Response: TestingAnalytics
// Requires: Family member permission
```

**POST /api/beta-testing/bug-report**
```typescript
// Submit bug report from testing
Request: Partial<BugReport>
Response: BugReport
```

**POST /api/beta-testing/feature-suggestion**
```typescript
// Submit feature suggestion from testing
Request: Partial<FeatureSuggestion>
Response: FeatureSuggestion
```

**GET /api/beta-testing/family-overview**
```typescript
// Get family-wide testing participation overview
Response: {
  totalTesters: number;
  activeTesters: number;
  reportsThisWeek: number;
  topPerformers: TesterPerformance[];
  coverageByApp: AppCoverage[];
}
```

---

## 7. Security Architecture

### 7.1 Authentication

#### Firebase Auth Configuration
- **Providers:** Email/Password, Google OAuth
- **MFA:** Optional for Admin users
- **Session Management:** 1 hour tokens, 30-day refresh

### 7.2 Authorization Rules

#### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/family_members/$(request.auth.uid))
             .data.permissions == 'admin';
    }
    
    function isFamilyMember() {
      return isAuthenticated() &&
             exists(/databases/$(database)/documents/family_members/$(request.auth.uid));
    }
    
    // Family members collection
    match /family_members/{memberId} {
      allow read: if isFamilyMember() || 
                     resource.data.visibility == 'public';
      allow write: if isAdmin();
    }
    
    // Family relationships
    match /family_relationships/{relationshipId} {
      allow read: if isFamilyMember();
      allow write: if isAdmin();
    }
    
    // Timeline events
    match /timeline_events/{eventId} {
      allow read: if isFamilyMember() || 
                     resource.data.visibility == 'public';
      allow create: if isFamilyMember();
      allow update, delete: if isAdmin() || 
                               request.auth.uid == resource.data.createdBy;
    }
    
    // Business roles
    match /business_roles/{roleId} {
      allow read: if isFamilyMember();
      allow write: if isAdmin();
    }
    
    // Career paths
    match /career_paths/{pathId} {
      allow read: if isFamilyMember();
      allow write: if isAdmin();
    }
    
    // Career progress
    match /career_progress/{progressId} {
      allow read: if isFamilyMember();
      allow create, update: if request.auth.uid == resource.data.personId || 
                               isAdmin();
      allow delete: if isAdmin();
    }
    
    // Ubuntu wisdom
    match /ubuntu_wisdom/{wisdomId} {
      allow read: if true;  // Public
      allow write: if isAdmin();
    }
    
    // Educational modules
    match /educational_modules/{moduleId} {
      allow read: if isFamilyMember();
      allow write: if isAdmin();
    }
    
    // Community posts
    match /community_posts/{postId} {
      allow read: if isFamilyMember() || 
                     resource.data.visibility == 'public';
      allow create: if isFamilyMember();
      allow update, delete: if request.auth.uid == resource.data.author || 
                               isAdmin();
    }
    
    // Beta testers collection
    match /beta_testers/{testerId} {
      allow read: if isFamilyMember();
      allow create: if isAdmin();
      allow update: if isAdmin() || 
                       request.auth.uid == resource.data.personId;
      allow delete: if isAdmin();
    }
    
    // Weekly reports collection
    match /weekly_reports/{reportId} {
      allow read: if isFamilyMember() || 
                     (isAuthenticated() && request.auth.uid == resource.data.personId);
      allow create: if isAuthenticated() && 
                       request.auth.uid == resource.data.personId;
      allow update: if isAuthenticated() && 
                       request.auth.uid == resource.data.personId;
      allow delete: if isAdmin();
    }
    
    // Testing analytics collection
    match /testing_analytics/{analyticsId} {
      allow read: if isFamilyMember();
      allow write: if isAdmin();
    }
  }
}
```

#### Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return request.auth.token.admin == true;
    }
    
    // Family photos
    match /family/photos/{personId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || 
                      request.auth.uid == personId;
    }
    
    // Role documents
    match /family/documents/roles/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Educational content
    match /family/documents/education/{moduleId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Community attachments
    match /community/posts/{postId}/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
                      request.resource.size < 10 * 1024 * 1024;  // 10MB limit
    }
    
    // Beta testing attachments (screenshots, etc.)
    match /beta-testing/reports/{reportId}/{fileName} {
      allow read: if isFamilyMember();
      allow write: if isAuthenticated() && 
                      request.resource.size < 5 * 1024 * 1024;  // 5MB limit
    }
    
    // Bug report screenshots
    match /beta-testing/bugs/{bugId}/{fileName} {
      allow read: if isFamilyMember();
      allow write: if isAuthenticated() && 
                      request.resource.size < 5 * 1024 * 1024;  // 5MB limit
    }
    
    // Feature suggestion attachments
    match /beta-testing/features/{featureId}/{fileName} {
      allow read: if isFamilyMember();
      allow write: if isAuthenticated() && 
                      request.resource.size < 5 * 1024 * 1024;  // 5MB limit
    }
  }
}
```

### 7.3 Data Privacy

#### Personal Information Protection
- **PII Encryption:** Email, phone numbers encrypted at rest
- **Data Minimization:** Only collect necessary data
- **Consent Management:** Explicit consent for data sharing
- **Right to Erasure:** Support for data deletion requests

#### Visibility Levels
1. **Public** - Visible to anyone (marketing content)
2. **Family** - Visible to authenticated family members
3. **Venture** - Visible to specific venture team members
4. **Private** - Visible only to creator and admins

---

## 8. Performance Requirements

### 8.1 Performance Targets

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Initial Page Load | < 2s | < 3s |
| Time to Interactive | < 3s | < 5s |
| First Contentful Paint | < 1.5s | < 2.5s |
| Lighthouse Score | > 90 | > 80 |
| Bundle Size | < 500KB | < 750KB |
| API Response Time | < 500ms | < 1s |

### 8.2 Optimization Strategies

#### Code Splitting
```typescript
// Dynamic imports for heavy components
const FamilyTree = dynamic(() => import('@/components/family/FamilyTree'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

const BusinessOrganogram = dynamic(() => 
  import('@/components/business/BusinessOrganogram'), {
  loading: () => <LoadingSpinner />
});
```

#### Image Optimization
- Next.js Image component with automatic optimization
- WebP format with PNG fallback
- Lazy loading for below-fold images
- Responsive image sizes

#### Database Optimization
- Firestore composite indexes for complex queries
- Pagination for large datasets (limit: 20 items per page)
- Caching frequently accessed data (family tree structure)
- Real-time listeners only where necessary

#### Caching Strategy
```typescript
// Cache family tree structure (updates rarely)
const CACHE_DURATION = {
  FAMILY_TREE: 24 * 60 * 60 * 1000,      // 24 hours
  UBUNTU_WISDOM: 7 * 24 * 60 * 60 * 1000, // 7 days
  CAREER_PATHS: 12 * 60 * 60 * 1000,     // 12 hours
  COMMUNITY_POSTS: 5 * 60 * 1000          // 5 minutes
};
```

---

## 9. Integration Points

### 9.1 External Services

#### Email Service (SendGrid/Firebase Extensions)
- Welcome emails for new family members
- Notification emails for community posts
- Weekly digest emails
- Event reminders

#### Analytics (Google Analytics 4)
- Page view tracking
- User engagement metrics
- Feature usage analytics
- Conversion tracking (career path completions)

#### Error Tracking (Sentry)
- Client-side error monitoring
- Performance monitoring
- Release tracking
- User feedback integration

### 9.2 Internal Integrations

#### Salatiso.com Integration
- Link to original books and articles
- Import historical content
- Cross-reference author profiles

#### Sazi Life Academy Integration
- Shared educational content
- Course enrollment tracking
- Certificate issuance

#### LifeKey Integration (Future)
- Single sign-on
- Unified profile management
- Cross-platform progress tracking

---

## 10. Deployment Architecture

### 10.1 Environments

#### Development
- **URL:** http://localhost:3000
- **Firebase Project:** salatiso-dev
- **Database:** Development Firestore instance
- **Purpose:** Local development and testing

#### Staging
- **URL:** https://salatiso-staging.web.app
- **Firebase Project:** salatiso-staging
- **Database:** Staging Firestore with anonymized data
- **Purpose:** Pre-production testing and QA

#### Production
- **Salatiso:** https://salatiso-lifecv.web.app
- **BizHelp:** https://bizhelp-lifecv.web.app
- **Firebase Project:** salatiso-production
- **Database:** Production Firestore
- **Purpose:** Live family platform

### 10.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase

on:
  push:
    branches: [main, staging]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

### 10.3 Monitoring & Alerts

#### Uptime Monitoring
- Pingdom/UptimeRobot for availability checks
- Target: 99.5% uptime
- Alert: Email + SMS for downtime > 5 minutes

#### Performance Monitoring
- Firebase Performance Monitoring
- Real User Monitoring (RUM)
- Synthetic monitoring for critical user flows

#### Error Tracking
- Sentry for error aggregation
- Alert threshold: > 10 errors/minute
- On-call rotation for critical errors

---

## Appendices

### Appendix A: Database Indexes

```javascript
// Firestore composite indexes required
// family_members
- members_by_generation: (generation ASC, lastName ASC)
- members_by_role: (role ASC, createdAt DESC)

// timeline_events
- events_by_person: (people ARRAY, date DESC)
- events_by_category: (category ASC, date DESC, visibility ASC)

// community_posts
- posts_by_type: (type ASC, createdAt DESC, visibility ASC)
- posts_by_venture: (venture ASC, createdAt DESC)

// career_progress
- progress_by_person: (personId ASC, status ASC)
```

### Appendix B: Environment Variables

```bash
# .env.production
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=

# Feature Flags
NEXT_PUBLIC_ENABLE_COMMUNITY_FEATURES=true
NEXT_PUBLIC_ENABLE_REAL_TIME_COLLABORATION=true
```

### Appendix C: Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Safari (iOS) | 14+ |
| Chrome Mobile (Android) | 90+ |

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | Oct 8, 2025 | MNI Tech Team | Initial V2 specification for upgrade |
| 1.0 | Sep 2025 | Solo | Original production specification |

**Status:** Draft - Under Review  
**Next Review:** October 15, 2025

---

*This document is part of the MNI Family Enterprise technical documentation suite.*
