# MNI Web Apps Component Library
## Version 2.0 - Ubuntu-Centered Design System

**Document Version:** 2.0  
**Date:** October 8, 2025  
**Status:** Draft for Phase 2 Implementation

---

## Overview

This component library defines the reusable UI components for the MNI Web Apps ecosystem, built on Ubuntu principles with consistent theming, accessibility, and responsive design.

### Design Principles

1. **Ubuntu First** - Family and community-centered design
2. **Accessibility** - WCAG 2.1 AA compliant
3. **Responsive** - Mobile-first approach
4. **Performance** - Optimized for speed
5. **Consistency** - Unified design language

### Color Palette

```typescript
// Ubuntu Theme Colors
export const ubuntuColors = {
  primary: {
    purple: '#6B46C1',      // Ubuntu purple
    gold: '#D69E2E',        // Ubuntu gold
  },
  secondary: {
    blue: '#3182CE',
    green: '#38A169',
    red: '#E53E3E',
  },
  neutral: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  }
};
```

---

## Layout Components

### PublicLayout

**Purpose:** Main layout wrapper for public-facing pages

**File:** `src/components/layouts/PublicLayout.tsx`

**Props:**
```typescript
interface PublicLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}
```

**Usage:**
```tsx
import PublicLayout from '@/components/layouts/PublicLayout';

export default function AboutPage() {
  return (
    <PublicLayout maxWidth="lg">
      <h1>About MNI</h1>
      <p>Our family story...</p>
    </PublicLayout>
  );
}
```

**Features:**
- Navigation header with logo
- Language switcher integration
- Responsive footer
- SEO-friendly structure
- Ubuntu theming

---

### IntranetLayout

**Purpose:** Protected layout for family intranet pages

**File:** `src/components/layouts/IntranetLayout.tsx`

**Props:**
```typescript
interface IntranetLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSidebar?: boolean;
  sidebarContent?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
}

interface Breadcrumb {
  label: string;
  href: string;
}
```

**Usage:**
```tsx
import IntranetLayout from '@/components/layouts/IntranetLayout';

export default function FamilyTreePage() {
  return (
    <IntranetLayout 
      title="Family Tree"
      breadcrumbs={[
        { label: 'Intranet', href: '/intranet' },
        { label: 'Family', href: '/intranet/family' },
        { label: 'Tree', href: '/intranet/family-tree' }
      ]}
    >
      <FamilyTree />
    </IntranetLayout>
  );
}
```

**Features:**
- User profile menu
- Quick navigation sidebar
- Breadcrumb navigation
- Notification center
- Family member presence indicators

---

## Family Components

### FamilyTree

**Purpose:** Interactive family tree visualization

**File:** `src/components/family/FamilyTree.tsx`

**Props:**
```typescript
interface FamilyTreeProps {
  rootPersonId?: string;
  displayMode?: 'full' | 'compact' | 'lineage';
  showPhotos?: boolean;
  showDates?: boolean;
  onPersonClick?: (person: FamilyMember) => void;
  highlightMembers?: string[];
  maxGenerations?: number;
  interactive?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import { FamilyTree } from '@/components/family/FamilyTree';

export default function FamilyTreePage() {
  const handlePersonClick = (person: FamilyMember) => {
    router.push(`/intranet/profiles/${person.id}`);
  };

  return (
    <FamilyTree
      rootPersonId="notemba"
      displayMode="full"
      showPhotos={true}
      onPersonClick={handlePersonClick}
      interactive={true}
    />
  );
}
```

**Sub-components:**
- `FamilyTreeNode` - Individual person node
- `FamilyTreeEdge` - Relationship connector
- `FamilyTreeControls` - Zoom/pan controls
- `FamilyTreeLegend` - Generation/relationship legend

**Styling:**
```css
.family-tree-node {
  @apply rounded-lg bg-white shadow-md p-4;
  @apply border-2 border-ubuntu-purple;
  @apply hover:shadow-lg transition-shadow;
}

.family-tree-node-photo {
  @apply w-16 h-16 rounded-full mx-auto mb-2;
  @apply border-4 border-ubuntu-gold;
}
```

---

### FamilyTimeline

**Purpose:** Chronological family history visualization

**File:** `src/components/family/FamilyTimeline.tsx`

**Props:**
```typescript
interface FamilyTimelineProps {
  events?: TimelineEvent[];
  filterByPerson?: string;
  filterByCategory?: EventCategory[];
  startYear?: number;
  endYear?: number;
  showEducationalNotes?: boolean;
  interactive?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}
```

**Usage:**
```tsx
import { FamilyTimeline } from '@/components/family/FamilyTimeline';

export default function TimelinePage() {
  return (
    <FamilyTimeline
      filterByCategory={['birth', 'education', 'milestone']}
      showEducationalNotes={true}
      layout="horizontal"
    />
  );
}
```

**Sub-components:**
- `TimelineEvent` - Individual event card
- `TimelineMarker` - Date marker
- `TimelineCategory` - Category icon and label
- `TimelineControls` - Navigation and filters

---

### FamilyMemberCard

**Purpose:** Compact family member profile card

**File:** `src/components/family/FamilyMemberCard.tsx`

**Props:**
```typescript
interface FamilyMemberCardProps {
  member: FamilyMember;
  variant?: 'default' | 'compact' | 'detailed';
  showRole?: boolean;
  showBio?: boolean;
  showActions?: boolean;
  onViewProfile?: (id: string) => void;
  onSendMessage?: (id: string) => void;
  className?: string;
}
```

**Usage:**
```tsx
import { FamilyMemberCard } from '@/components/family/FamilyMemberCard';

<FamilyMemberCard
  member={member}
  variant="detailed"
  showRole={true}
  showBio={true}
  onViewProfile={(id) => router.push(`/profiles/${id}`)}
/>
```

**Variants:**

```tsx
// Default - Photo, name, role
<FamilyMemberCard member={member} variant="default" />

// Compact - Minimal info for lists
<FamilyMemberCard member={member} variant="compact" />

// Detailed - Full info with bio
<FamilyMemberCard member={member} variant="detailed" />
```

---

### FamilyProfiles

**Purpose:** Full family member profile display

**File:** `src/components/family/FamilyProfiles.tsx`

**Props:**
```typescript
interface FamilyProfilesProps {
  personId: string;
  editable?: boolean;
  showContributions?: boolean;
  showTimeline?: boolean;
  showWisdom?: boolean;
  showCareerPath?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import { FamilyProfiles } from '@/components/family/FamilyProfiles';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const isOwner = user?.uid === params.id;

  return (
    <FamilyProfiles
      personId={params.id}
      editable={isOwner}
      showContributions={true}
      showTimeline={true}
      showWisdom={true}
      showCareerPath={true}
    />
  );
}
```

**Features:**
- Profile header with photo and bio
- Contributions showcase
- Ubuntu wisdom quotes
- Personal timeline
- Career progress tracker
- Edit mode for authorized users
- Media gallery

---

## Business Components

### BusinessOrganogram

**Purpose:** Visual business structure diagram

**File:** `src/components/business/BusinessOrganogram.tsx`

**Props:**
```typescript
interface BusinessOrganogramProps {
  ventureFilter?: string[];
  showVacancies?: boolean;
  highlightRoles?: string[];
  onRoleClick?: (role: Role) => void;
  layout?: 'hierarchical' | 'radial' | 'force-directed';
  className?: string;
}
```

**Usage:**
```tsx
import { BusinessOrganogram } from '@/components/business/BusinessOrganogram';

<BusinessOrganogram
  ventureFilter={['Sazi Life Academy', 'LifeKey']}
  showVacancies={true}
  layout="hierarchical"
  onRoleClick={(role) => setSelectedRole(role)}
/>
```

**Sub-components:**
- `OrganogramNode` - Individual role node
- `OrganogramEdge` - Reporting line
- `VentureGroup` - Venture container
- `RoleTooltip` - Hover details

---

### CareerPaths

**Purpose:** Career development path visualization

**File:** `src/components/business/CareerPaths.tsx`

**Props:**
```typescript
interface CareerPathsProps {
  personId?: string;
  showAllPaths?: boolean;
  highlightAvailable?: boolean;
  onPathSelect?: (path: CareerPath) => void;
  layout?: 'list' | 'grid' | 'flow';
  className?: string;
}
```

**Usage:**
```tsx
import { CareerPaths } from '@/components/business/CareerPaths';

<CareerPaths
  personId="solo"
  highlightAvailable={true}
  layout="flow"
  onPathSelect={(path) => router.push(`/career/${path.id}`)}
/>
```

**Features:**
- Interactive path visualization
- Progress indicators
- Prerequisite checker
- Milestone tracking
- Recommended next steps

---

### RoleDocuments

**Purpose:** Embedded role documentation viewer/editor

**File:** `src/components/business/RoleDocuments.tsx`

**Props:**
```typescript
interface RoleDocumentsProps {
  roleId: string;
  editable?: boolean;
  onSave?: (content: string) => Promise<void>;
  showVersionHistory?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import { RoleDocuments } from '@/components/business/RoleDocuments';

<RoleDocuments
  roleId="ceo"
  editable={isAdmin}
  onSave={handleSave}
  showVersionHistory={true}
/>
```

**Features:**
- HTML rendering
- Rich text editing (authorized users)
- Version history
- Export to PDF
- Print-friendly view

---

## Ubuntu Components

### UbuntuWisdom

**Purpose:** Display Ubuntu philosophy quotes and teachings

**File:** `src/components/ubuntu/UbuntuWisdom.tsx`

**Props:**
```typescript
interface UbuntuWisdomProps {
  category?: WisdomCategory;
  random?: boolean;
  personId?: string;
  displayMode?: 'quote' | 'card' | 'banner';
  language?: string;
  showAttribution?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import { UbuntuWisdom } from '@/components/ubuntu/UbuntuWisdom';

// Random wisdom quote
<UbuntuWisdom random={true} displayMode="banner" />

// Category-specific
<UbuntuWisdom category="family" displayMode="card" />

// From specific person
<UbuntuWisdom personId="visa" showAttribution={true} />
```

**Display Modes:**

```tsx
// Quote - Minimal text display
<UbuntuWisdom displayMode="quote" className="text-lg italic" />

// Card - Full card with background
<UbuntuWisdom displayMode="card" className="shadow-lg" />

// Banner - Full-width banner
<UbuntuWisdom displayMode="banner" className="py-12 bg-ubuntu-purple" />
```

---

### UbuntuThemeProvider

**Purpose:** Context provider for Ubuntu theme

**File:** `src/components/ubuntu/UbuntuThemeProvider.tsx`

**Usage:**
```tsx
import { UbuntuThemeProvider } from '@/components/ubuntu/UbuntuThemeProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UbuntuThemeProvider>
      <Component {...pageProps} />
    </UbuntuThemeProvider>
  );
}
```

**Hook:**
```tsx
import { useUbuntuTheme } from '@/contexts/UbuntuThemeContext';

export function MyComponent() {
  const { colors, spacing, typography } = useUbuntuTheme();
  
  return (
    <div style={{ color: colors.primary.purple }}>
      Ubuntu-themed content
    </div>
  );
}
```

---

### CulturalElements

**Purpose:** Display cultural symbols and patterns

**File:** `src/components/ubuntu/CulturalElements.tsx`

**Props:**
```typescript
interface CulturalElementsProps {
  element: 'pattern' | 'symbol' | 'divider';
  variant?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}
```

**Usage:**
```tsx
import { CulturalElements } from '@/components/ubuntu/CulturalElements';

// Pattern background
<CulturalElements element="pattern" variant="circles" size="lg" />

// Symbol divider
<CulturalElements element="divider" variant="waves" />

// Cultural symbol
<CulturalElements element="symbol" variant="unity" size="md" />
```

---

## Education Components

### EducationalRepository

**Purpose:** Educational content browser

**File:** `src/components/education/EducationalRepository.tsx`

**Props:**
```typescript
interface EducationalRepositoryProps {
  studentId?: string;
  subject?: string[];
  gradeLevel?: string;
  showAssessments?: boolean;
  layout?: 'grid' | 'list';
  className?: string;
}
```

**Usage:**
```tsx
import { EducationalRepository } from '@/components/education/EducationalRepository';

<EducationalRepository
  studentId="solo"
  subject={['Mathematics', 'Science']}
  gradeLevel="8"
  showAssessments={true}
  layout="grid"
/>
```

---

### LearningModule

**Purpose:** Individual learning module display

**File:** `src/components/education/LearningModule.tsx`

**Props:**
```typescript
interface LearningModuleProps {
  module: EducationalModule;
  studentId?: string;
  showProgress?: boolean;
  onComplete?: (moduleId: string) => void;
  className?: string;
}
```

**Usage:**
```tsx
import { LearningModule } from '@/components/education/LearningModule';

<LearningModule
  module={module}
  studentId="solo"
  showProgress={true}
  onComplete={(id) => toast.success('Module completed!')}
/>
```

**Features:**
- Markdown content rendering
- Video/audio integration
- Interactive elements
- Progress tracking
- Assessment integration

---

### ProgressTracker

**Purpose:** Visual progress tracking

**File:** `src/components/education/ProgressTracker.tsx`

**Props:**
```typescript
interface ProgressTrackerProps {
  progress: Progress;
  variant?: 'linear' | 'circular' | 'detailed';
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Usage:**
```tsx
import { ProgressTracker } from '@/components/education/ProgressTracker';

// Linear progress bar
<ProgressTracker progress={progress} variant="linear" />

// Circular progress
<ProgressTracker progress={progress} variant="circular" size="lg" />

// Detailed view with milestones
<ProgressTracker progress={progress} variant="detailed" showDetails={true} />
```

---

## Community Components

### CommunityBoard

**Purpose:** Family message board and social feed

**File:** `src/components/community/CommunityBoard.tsx`

**Props:**
```typescript
interface CommunityBoardProps {
  boardType?: 'messages' | 'events' | 'achievements';
  filterByVenture?: string;
  canPost?: boolean;
  layout?: 'feed' | 'grid';
  className?: string;
}
```

**Usage:**
```tsx
import { CommunityBoard } from '@/components/community/CommunityBoard';

<CommunityBoard
  boardType="messages"
  canPost={true}
  layout="feed"
/>
```

**Features:**
- Real-time updates
- Post creation
- Reactions and comments
- Media attachments
- Filtering and search

---

### EventCalendar

**Purpose:** Family events calendar

**File:** `src/components/community/EventCalendar.tsx`

**Props:**
```typescript
interface EventCalendarProps {
  view?: 'month' | 'week' | 'day' | 'list';
  events?: CommunityPost[];
  onEventClick?: (event: CommunityPost) => void;
  canCreate?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import { EventCalendar } from '@/components/community/EventCalendar';

<EventCalendar
  view="month"
  canCreate={true}
  onEventClick={(event) => setSelectedEvent(event)}
/>
```

---

### MessageThread

**Purpose:** Threaded message conversation

**File:** `src/components/community/MessageThread.tsx`

**Props:**
```typescript
interface MessageThreadProps {
  postId: string;
  showReactions?: boolean;
  enableReplies?: boolean;
  maxDepth?: number;
  className?: string;
}
```

**Usage:**
```tsx
import { MessageThread } from '@/components/community/MessageThread';

<MessageThread
  postId={post.id}
  showReactions={true}
  enableReplies={true}
  maxDepth={3}
/>
```

---

## Editor Components

### RichTextEditor

**Purpose:** WYSIWYG content editor

**File:** `src/components/editor/RichTextEditor.tsx`

**Props:**
```typescript
interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => Promise<void>;
  placeholder?: string;
  readOnly?: boolean;
  toolbar?: ToolbarConfig;
  className?: string;
}
```

**Usage:**
```tsx
import { RichTextEditor } from '@/components/editor/RichTextEditor';

<RichTextEditor
  initialContent={content}
  onChange={setContent}
  onSave={handleSave}
  placeholder="Start writing..."
/>
```

**Toolbar Features:**
- Text formatting (bold, italic, underline)
- Headers (H1-H6)
- Lists (ordered, unordered)
- Links and images
- Code blocks
- Ubuntu color palette

---

### CollaborativeEditor

**Purpose:** Real-time collaborative editing

**File:** `src/components/editor/CollaborativeEditor.tsx`

**Props:**
```typescript
interface CollaborativeEditorProps {
  documentId: string;
  initialContent?: string;
  onSave?: (content: string) => Promise<void>;
  showPresence?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import { CollaborativeEditor } from '@/components/editor/CollaborativeEditor';

<CollaborativeEditor
  documentId="role-ceo"
  showPresence={true}
  onSave={handleSave}
/>
```

**Features:**
- Real-time collaboration (Y.js)
- User presence indicators
- Cursor tracking
- Conflict resolution
- Version history

---

## Beta Testing Components

### BetaTesting

**Purpose:** Automated beta tester assignment and management for family members

**File:** `src/components/beta-testing/BetaTesting.tsx`

**Props:**
```typescript
interface BetaTestingProps {
  personId: string;
  testingUrl?: string;             // Default: https://bizhelp-lifecv.web.app/testing
  showWeeklyReports?: boolean;
  showPerformanceMetrics?: boolean;
  editable?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import { BetaTesting } from '@/components/beta-testing/BetaTesting';

<BetaTesting
  personId="solo"
  testingUrl="https://bizhelp-lifecv.web.app/testing"
  showWeeklyReports={true}
  showPerformanceMetrics={true}
  editable={true}
/>
```

**Features:**
- Automatic beta tester assignment for all family members
- Testing dashboard integration
- Weekly report requirements tracking
- Performance management integration
- Career document inclusion of testing contributions
- Automated report generation and notifications

--- 

### TestingDashboard

**Purpose:** Central testing dashboard for family beta testers

**File:** `src/components/beta-testing/TestingDashboard.tsx`

**Props:**
```typescript
interface TestingDashboardProps {
  personId: string;
  viewMode?: 'personal' | 'family' | 'admin';
  timeRange?: 'week' | 'month' | 'quarter';
  showAnalytics?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import { TestingDashboard } from '@/components/beta-testing/TestingDashboard';

<TestingDashboard
  personId="solo"
  viewMode="personal"
  timeRange="week"
  showAnalytics={true}
/>
```

**Features:**
- Personal testing progress tracking
- Weekly report submission interface
- Family-wide testing participation overview
- Automated report generation
- Testing analytics and insights
- Performance metrics integration
- Notification system for deadlines

---

### WeeklyReport

**Purpose:** Structured weekly testing report component

**File:** `src/components/beta-testing/WeeklyReport.tsx`

**Props:**
```typescript
interface WeeklyReportProps {
  personId: string;
  weekStart: Date;
  editable?: boolean;
  includeInLifeCV?: boolean;
  includeInCareerDoc?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import { WeeklyReport } from '@/components/beta-testing/WeeklyReport';

<WeeklyReport
  personId="solo"
  weekStart={new Date('2025-10-01')}
  editable={true}
  includeInLifeCV={true}
  includeInCareerDoc={true}
/>
```

**Features:**
- Structured testing report template
- Automated report generation from testing data
- Integration with LifeCV documents
- Career document inclusion
- Performance management tracking
- Historical report archive
- Report sharing and collaboration

---

### PerformanceTracker

**Purpose:** Performance management integration for beta testing

**File:** `src/components/beta-testing/PerformanceTracker.tsx`

**Props:**
```typescript
interface PerformanceTrackerProps {
  personId: string;
  metrics: PerformanceMetric[];
  includeTesting?: boolean;
  showCareerImpact?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import { PerformanceTracker } from '@/components/beta-testing/PerformanceTracker';

<PerformanceTracker
  personId="solo"
  metrics={performanceMetrics}
  includeTesting={true}
  showCareerImpact={true}
/>
```

**Features:**
- Testing participation metrics
- Report quality assessment
- Career progression integration
- Performance review integration
- Achievement recognition
- Goal setting and tracking

---

## UI Components

### Button

**Purpose:** Styled button with variants

**File:** `src/components/ui/Button.tsx`

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ubuntu' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}
```

**Usage:**
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md">
  Click me
</Button>

<Button variant="ubuntu" loading={true}>
  Saving...
</Button>

<Button variant="outline" icon={<ArrowRight />} iconPosition="right">
  Next
</Button>
```

**Variants:**
```css
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn-ubuntu {
  @apply bg-ubuntu-purple text-white hover:bg-purple-700;
  @apply border-2 border-ubuntu-gold;
}

.btn-outline {
  @apply border-2 border-current bg-transparent hover:bg-gray-100;
}
```

---

### Card

**Purpose:** Content container

**File:** `src/components/ui/Card.tsx`

**Props:**
```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'ubuntu' | 'elevated';
  className?: string;
}
```

**Usage:**
```tsx
import { Card } from '@/components/ui/Card';

<Card 
  title="Ubuntu Wisdom" 
  subtitle="Daily inspiration"
  variant="ubuntu"
  footer={<Button>Learn More</Button>}
>
  <p>Ubuntu philosophy content...</p>
</Card>
```

---

### Modal

**Purpose:** Dialog overlay

**File:** `src/components/ui/Modal.tsx`

**Props:**
```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
}
```

**Usage:**
```tsx
import { Modal } from '@/components/ui/Modal';

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Add Family Member"
  size="lg"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleSave}>Save</Button>
    </>
  }
>
  <FamilyMemberForm />
</Modal>
```

---

### Tooltip

**Purpose:** Hover information

**File:** `src/components/ui/Tooltip.tsx`

**Props:**
```typescript
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}
```

**Usage:**
```tsx
import { Tooltip } from '@/components/ui/Tooltip';

<Tooltip content="This is Ubuntu wisdom" position="top">
  <span>Hover me</span>
</Tooltip>
```

---

## Hooks

### useFamilyData

**File:** `src/hooks/useFamilyData.ts`

**Usage:**
```typescript
import { useFamilyData } from '@/hooks/useFamilyData';

export function MyComponent() {
  const { 
    members, 
    relationships, 
    loading, 
    error,
    refetch 
  } = useFamilyData({
    generation: 2,
    includePhotos: true
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <FamilyTree members={members} relationships={relationships} />;
}
```

---

### useCareerProgress

**File:** `src/hooks/useCareerProgress.ts`

**Usage:**
```typescript
import { useCareerProgress } from '@/hooks/useCareerProgress';

export function CareerDashboard({ personId }: { personId: string }) {
  const { 
    activePaths, 
    completedPaths, 
    nextMilestone,
    completeMilestone,
    loading 
  } = useCareerProgress(personId);

  return (
    <>
      {activePaths.map(path => (
        <ProgressTracker key={path.id} progress={path} />
      ))}
    </>
  );
}
```

---

### useRealTimeSync

**File:** `src/hooks/useRealTimeSync.ts`

**Usage:**
```typescript
import { useRealTimeSync } from '@/hooks/useRealTimeSync';

export function CommunityFeed() {
  const posts = useRealTimeSync<CommunityPost>('community_posts', {
    orderBy: 'createdAt',
    limit: 20
  });

  return (
    <>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}
```

---

## Utilities

### Family Tree Helpers

**File:** `src/utils/familyTreeHelpers.ts`

```typescript
import { buildFamilyTree, findCommonAncestor, calculateGeneration } from '@/utils/familyTreeHelpers';

// Build tree structure from flat data
const tree = buildFamilyTree(members, relationships, 'notemba');

// Find common ancestor
const ancestor = findCommonAncestor('solo', 'tina', members, relationships);

// Calculate generation number
const generation = calculateGeneration('kwakho', members, relationships);
```

---

### Date Formatters

**File:** `src/utils/dateFormatters.ts`

```typescript
import { formatDate, formatTimeAgo, formatDateRange } from '@/utils/dateFormatters';

// Format date
formatDate(new Date(), 'long'); // "October 8, 2025"

// Time ago
formatTimeAgo(new Date()); // "2 hours ago"

// Date range
formatDateRange(startDate, endDate); // "Oct 1 - Oct 8, 2025"
```

---

## Testing

### Component Testing Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { FamilyMemberCard } from '@/components/family/FamilyMemberCard';

describe('FamilyMemberCard', () => {
  const mockMember = {
    id: 'test-id',
    firstName: 'Test',
    lastName: 'Member',
    role: 'Tester',
    photo: '/test.jpg'
  };

  it('renders member information', () => {
    render(<FamilyMemberCard member={mockMember} />);
    
    expect(screen.getByText('Test Member')).toBeInTheDocument();
    expect(screen.getByText('Tester')).toBeInTheDocument();
  });

  it('calls onViewProfile when clicked', () => {
    const handleClick = jest.fn();
    render(
      <FamilyMemberCard 
        member={mockMember} 
        onViewProfile={handleClick}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith('test-id');
  });
});
```

---

## Storybook Integration

### Component Story Example

```typescript
// FamilyMemberCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { FamilyMemberCard } from './FamilyMemberCard';

const meta: Meta<typeof FamilyMemberCard> = {
  title: 'Family/FamilyMemberCard',
  component: FamilyMemberCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FamilyMemberCard>;

export const Default: Story = {
  args: {
    member: {
      id: '1',
      firstName: 'Solo',
      lastName: 'Mdeni',
      role: 'Lead Developer',
      photo: '/solo.jpg',
    },
  },
};

export const Compact: Story = {
  args: {
    ...Default.args,
    variant: 'compact',
  },
};

export const Detailed: Story = {
  args: {
    ...Default.args,
    variant: 'detailed',
    showBio: true,
  },
};
```

---

## Accessibility Guidelines

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order must be logical
- Focus indicators must be visible

### ARIA Labels
```tsx
<button 
  aria-label="View family member profile"
  aria-describedby="member-name"
>
  <span id="member-name">{member.name}</span>
</button>
```

### Screen Reader Support
- Use semantic HTML
- Provide alternative text for images
- Use proper heading hierarchy

---

## Performance Best Practices

### Code Splitting
```tsx
const FamilyTree = dynamic(() => import('@/components/family/FamilyTree'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

### Memoization
```tsx
const MemoizedCard = React.memo(FamilyMemberCard, (prev, next) => {
  return prev.member.id === next.member.id;
});
```

### Virtualization
```tsx
import { VirtualizedList } from '@/components/ui/VirtualizedList';

<VirtualizedList
  items={members}
  renderItem={(member) => <FamilyMemberCard member={member} />}
  itemHeight={120}
/>
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | Oct 8, 2025 | Initial V2 component library documentation |

---

*This document is part of the MNI Family Enterprise technical documentation suite.*
