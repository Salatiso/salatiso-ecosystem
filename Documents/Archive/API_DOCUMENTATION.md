# MNI Web Apps API Documentation
## Version 2.0 - Firebase Functions & Firestore Integration

**Document Version:** 2.0  
**Date:** October 8, 2025  
**Status:** Draft for Phase 2 Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Family APIs](#family-apis)
4. [Career & Business APIs](#career--business-apis)
5. [Timeline APIs](#timeline-apis)
6. [Community APIs](#community-apis)
7. [Education APIs](#education-apis)
8. [Ubuntu APIs](#ubuntu-apis)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

---

## Overview

### Base URLs

**Production:**
- Firestore: Direct client SDK access
- Functions: `https://us-central1-salatiso-lifecv.cloudfunctions.net`

**Staging:**
- Firestore: Direct client SDK access
- Functions: `https://us-central1-salatiso-staging.cloudfunctions.net`

### Authentication
All API requests require Firebase Authentication token in header:
```
Authorization: Bearer <firebase_id_token>
```

### Response Format
```typescript
// Success Response
{
  success: true,
  data: any,
  timestamp: string
}

// Error Response
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  },
  timestamp: string
}
```

---

## Authentication

### Get Current User Profile
```
GET /api/auth/profile
```

**Response:**
```typescript
{
  success: true,
  data: {
    uid: string,
    email: string,
    familyMember: FamilyMember,
    permissions: PermissionLevel,
    lastLogin: Timestamp
  }
}
```

---

## Family APIs

### Get Family Tree

**Endpoint:** `GET /api/family/tree`

**Query Parameters:**
```typescript
{
  rootPersonId?: string,    // Start from specific person (default: 'notemba')
  generations?: number,     // Number of generations (default: all)
  includePhotos?: boolean   // Include photo URLs (default: true)
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    members: FamilyMember[],
    relationships: FamilyRelationship[],
    metadata: {
      totalMembers: number,
      generations: number,
      lastUpdated: Timestamp
    }
  }
}
```

**Example:**
```bash
curl -X GET "https://us-central1-salatiso-lifecv.cloudfunctions.net/api/family/tree?rootPersonId=notemba&generations=3" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Get Family Member Details

**Endpoint:** `GET /api/family/member/:id`

**Path Parameters:**
- `id` - Family member ID

**Response:**
```typescript
{
  success: true,
  data: {
    ...FamilyMember,
    timeline: TimelineEvent[],
    contributions: Contribution[],
    wisdom: UbuntuWisdom[],
    currentRoles: BusinessRole[],
    careerProgress: CareerProgress[]
  }
}
```

**Example:**
```typescript
// Using Firebase SDK
import { getFamilyMember } from '@/services/familyService';

const member = await getFamilyMember('solo');
```

---

### Create/Update Family Member

**Endpoint:** `POST /api/family/member`

**Permissions Required:** Admin

**Request Body:**
```typescript
{
  id?: string,              // Optional for create, required for update
  firstName: string,
  lastName: string,
  maidenName?: string,
  photo?: string,
  birthDate: Date,
  bio: string,
  role: string,
  generation: number,
  parents?: string[],
  spouse?: string,
  email?: string,
  phone?: string,
  permissions?: PermissionLevel
}
```

**Response:**
```typescript
{
  success: true,
  data: FamilyMember
}
```

---

### Search Family Members

**Endpoint:** `GET /api/family/search`

**Query Parameters:**
```typescript
{
  query: string,           // Search term
  fields?: string[],       // Fields to search (name, bio, role)
  generation?: number,
  limit?: number          // Max results (default: 20)
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    results: FamilyMember[],
    total: number,
    query: string
  }
}
```

---

## Career & Business APIs

### Get All Career Paths

**Endpoint:** `GET /api/career/paths`

**Query Parameters:**
```typescript
{
  category?: string,
  difficulty?: 'beginner' | 'intermediate' | 'advanced',
  personId?: string        // Filter by prerequisites met
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    paths: CareerPath[],
    total: number,
    filtered: boolean
  }
}
```

---

### Get Career Path Details

**Endpoint:** `GET /api/career/path/:id`

**Path Parameters:**
- `id` - Career path ID

**Response:**
```typescript
{
  success: true,
  data: {
    ...CareerPath,
    enrolledMembers: number,
    completionRate: number,
    averageDuration: string,
    relatedPaths: CareerPath[]
  }
}
```

---

### Get Person's Career Progress

**Endpoint:** `GET /api/career/progress/:personId`

**Path Parameters:**
- `personId` - Family member ID

**Response:**
```typescript
{
  success: true,
  data: {
    activePaths: CareerProgress[],
    completedPaths: CareerProgress[],
    achievements: Achievement[],
    skillsAcquired: Skill[],
    nextSteps: Recommendation[]
  }
}
```

---

### Start Career Path

**Endpoint:** `POST /api/career/enroll`

**Request Body:**
```typescript
{
  personId: string,
  careerPathId: string,
  startDate?: Date,
  notes?: string
}
```

**Response:**
```typescript
{
  success: true,
  data: CareerProgress
}
```

---

### Complete Milestone

**Endpoint:** `POST /api/career/milestone/complete`

**Request Body:**
```typescript
{
  progressId: string,
  milestoneIndex: number,
  deliverables: CompletedDeliverable[],
  evidence: string[],      // URLs to proof documents
  notes?: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    progress: CareerProgress,
    nextMilestone?: Milestone,
    certificateUrl?: string  // If path completed
  }
}
```

---

### Get Business Organogram

**Endpoint:** `GET /api/business/organogram`

**Query Parameters:**
```typescript
{
  venture?: string,         // Filter by venture
  showVacancies?: boolean,
  layout?: 'hierarchical' | 'radial' | 'force-directed'
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    roles: BusinessRole[],
    hierarchy: {
      root: string,          // Top-level role ID
      tree: RoleNode[]
    },
    vacancies: BusinessRole[],
    ventures: string[]
  }
}
```

---

### Get Role Details

**Endpoint:** `GET /api/business/role/:id`

**Path Parameters:**
- `id` - Role ID

**Response:**
```typescript
{
  success: true,
  data: {
    ...BusinessRole,
    currentHolder?: FamilyMember,
    reportingToRole?: BusinessRole,
    teamMembers: FamilyMember[],
    requiredSkills: Skill[],
    documentContent?: string  // HTML content if available
  }
}
```

---

### Apply for Role

**Endpoint:** `POST /api/business/role/apply`

**Request Body:**
```typescript
{
  roleId: string,
  applicantId: string,
  motivation: string,
  skillsEvidence: Evidence[]
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    applicationId: string,
    status: 'pending',
    submittedAt: Timestamp
  }
}
```

---

## Timeline APIs

### Get Timeline Events

**Endpoint:** `GET /api/timeline/events`

**Query Parameters:**
```typescript
{
  startDate?: Date,
  endDate?: Date,
  category?: EventCategory | EventCategory[],
  personId?: string,        // Events involving specific person
  visibility?: 'public' | 'family' | 'private',
  limit?: number,
  cursor?: string          // For pagination
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    events: TimelineEvent[],
    total: number,
    nextCursor?: string,
    hasMore: boolean
  }
}
```

**Example:**
```typescript
// Get family events for 2024
const response = await fetch(
  '/api/timeline/events?startDate=2024-01-01&endDate=2024-12-31&category=family',
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
```

---

### Get Timeline Event Details

**Endpoint:** `GET /api/timeline/event/:id`

**Path Parameters:**
- `id` - Event ID

**Response:**
```typescript
{
  success: true,
  data: {
    ...TimelineEvent,
    peopleDetails: FamilyMember[],
    photos: MediaItem[],
    relatedEvents: TimelineEvent[]
  }
}
```

---

### Create Timeline Event

**Endpoint:** `POST /api/timeline/event`

**Permissions Required:** Member (Editor for public events)

**Request Body:**
```typescript
{
  title: string,
  description: string,
  category: EventCategory,
  date: Date,
  endDate?: Date,
  people: string[],         // Person IDs
  location?: string,
  photos?: string[],        // Storage URLs
  educationalNote?: string,
  significance: 'high' | 'medium' | 'low',
  visibility: 'public' | 'family' | 'private'
}
```

**Response:**
```typescript
{
  success: true,
  data: TimelineEvent
}
```

---

### Update Timeline Event

**Endpoint:** `PUT /api/timeline/event/:id`

**Permissions Required:** Creator or Admin

**Request Body:** Partial<TimelineEvent>

**Response:**
```typescript
{
  success: true,
  data: TimelineEvent
}
```

---

### Delete Timeline Event

**Endpoint:** `DELETE /api/timeline/event/:id`

**Permissions Required:** Creator or Admin

**Response:**
```typescript
{
  success: true,
  data: {
    deletedId: string,
    deletedAt: Timestamp
  }
}
```

---

## Community APIs

### Get Community Posts

**Endpoint:** `GET /api/community/posts`

**Query Parameters:**
```typescript
{
  type?: 'message' | 'event' | 'achievement',
  venture?: string,
  visibility?: 'public' | 'family' | 'venture',
  limit?: number,          // Default: 20, Max: 100
  cursor?: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    posts: CommunityPost[],
    nextCursor?: string,
    hasMore: boolean
  }
}
```

---

### Get Post Details

**Endpoint:** `GET /api/community/post/:id`

**Path Parameters:**
- `id` - Post ID

**Response:**
```typescript
{
  success: true,
  data: {
    ...CommunityPost,
    authorDetails: FamilyMember,
    commentsExpanded: CommentWithAuthor[],
    reactionsGrouped: {
      like: number,
      love: number,
      celebrate: number,
      support: number
    }
  }
}
```

---

### Create Community Post

**Endpoint:** `POST /api/community/post`

**Permissions Required:** Member

**Request Body:**
```typescript
{
  type: 'message' | 'event' | 'achievement',
  title: string,
  content: string,
  venture?: string,
  attachments?: Attachment[],
  visibility: 'public' | 'family' | 'venture',
  eventDate?: Date,        // Required for events
  tags?: string[]
}
```

**Response:**
```typescript
{
  success: true,
  data: CommunityPost
}
```

---

### Add Reaction

**Endpoint:** `POST /api/community/post/:id/reaction`

**Path Parameters:**
- `id` - Post ID

**Request Body:**
```typescript
{
  type: 'like' | 'love' | 'celebrate' | 'support'
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    post: CommunityPost,
    reaction: Reaction
  }
}
```

---

### Add Comment

**Endpoint:** `POST /api/community/post/:id/comment`

**Path Parameters:**
- `id` - Post ID

**Request Body:**
```typescript
{
  content: string,
  parentCommentId?: string  // For threaded comments
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    comment: Comment,
    post: CommunityPost
  }
}
```

---

### RSVP to Event

**Endpoint:** `POST /api/community/event/:id/rsvp`

**Path Parameters:**
- `id` - Event post ID

**Request Body:**
```typescript
{
  status: 'going' | 'maybe' | 'not-going'
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    rsvp: RSVP,
    totalGoing: number,
    totalMaybe: number
  }
}
```

---

## Education APIs

### Get Educational Modules

**Endpoint:** `GET /api/education/modules`

**Query Parameters:**
```typescript
{
  subject?: string,
  gradeLevel?: string,
  studentId?: string,
  covidRelated?: boolean,
  limit?: number
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    modules: EducationalModule[],
    subjects: string[],
    gradeLevels: string[]
  }
}
```

---

### Get Module Details

**Endpoint:** `GET /api/education/module/:id`

**Path Parameters:**
- `id` - Module ID

**Response:**
```typescript
{
  success: true,
  data: {
    ...EducationalModule,
    contentHtml: string,     // Rendered markdown
    progressByStudent: {
      [studentId: string]: Progress
    }
  }
}
```

---

### Submit Assessment

**Endpoint:** `POST /api/education/assessment/submit`

**Request Body:**
```typescript
{
  moduleId: string,
  studentId: string,
  assessmentId: string,
  answers: Answer[],
  timeSpent: number        // Minutes
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    result: AssessmentResult,
    score: number,
    passed: boolean,
    feedback: string,
    certificateUrl?: string
  }
}
```

---

### Update Learning Progress

**Endpoint:** `POST /api/education/progress`

**Request Body:**
```typescript
{
  moduleId: string,
  studentId: string,
  sectionCompleted?: string,
  percentComplete: number,
  notes?: string
}
```

**Response:**
```typescript
{
  success: true,
  data: Progress
}
```

---

## Ubuntu APIs

### Get Ubuntu Wisdom

**Endpoint:** `GET /api/ubuntu/wisdom`

**Query Parameters:**
```typescript
{
  category?: WisdomCategory,
  language?: string,        // ISO 639-1 code (en, xh, zu, etc.)
  random?: boolean,         // Get random wisdom
  personId?: string,        // Wisdom from specific person
  limit?: number
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    wisdom: UbuntuWisdom[],
    total: number,
    categories: WisdomCategory[]
  }
}
```

---

### Get Daily Wisdom

**Endpoint:** `GET /api/ubuntu/wisdom/daily`

**Query Parameters:**
```typescript
{
  language?: string,
  category?: WisdomCategory
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    wisdom: UbuntuWisdom,
    date: Date
  }
}
```

---

### Favorite Wisdom

**Endpoint:** `POST /api/ubuntu/wisdom/:id/favorite`

**Path Parameters:**
- `id` - Wisdom ID

**Response:**
```typescript
{
  success: true,
  data: {
    wisdom: UbuntuWisdom,
    favorited: boolean
  }
}
```

---

### Share Wisdom

**Endpoint:** `POST /api/ubuntu/wisdom/:id/share`

**Path Parameters:**
- `id` - Wisdom ID

**Request Body:**
```typescript
{
  platform: 'whatsapp' | 'twitter' | 'facebook' | 'email',
  recipients?: string[]    // For email
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    shareUrl: string,
    shareCount: number
  }
}
```

---

## Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_REQUIRED` | 401 | Authentication required |
| `PERMISSION_DENIED` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

### Error Response Format

```typescript
{
  success: false,
  error: {
    code: 'PERMISSION_DENIED',
    message: 'You do not have permission to perform this action',
    details: {
      requiredPermission: 'admin',
      currentPermission: 'member'
    }
  },
  timestamp: '2025-10-08T10:30:00Z'
}
```

### Error Handling Example

```typescript
try {
  const response = await fetch('/api/family/member', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(memberData)
  });
  
  const result = await response.json();
  
  if (!result.success) {
    switch (result.error.code) {
      case 'AUTH_REQUIRED':
        // Redirect to login
        router.push('/login');
        break;
      case 'PERMISSION_DENIED':
        // Show permission error
        toast.error('You need admin permissions for this action');
        break;
      case 'VALIDATION_ERROR':
        // Show validation errors
        setErrors(result.error.details);
        break;
      default:
        // Generic error
        toast.error(result.error.message);
    }
    return;
  }
  
  // Success handling
  toast.success('Family member updated successfully');
  
} catch (error) {
  console.error('API error:', error);
  toast.error('Network error. Please try again.');
}
```

---

## Rate Limiting

### Limits

| Endpoint Category | Limit | Window |
|------------------|-------|--------|
| Read Operations | 300 requests | 5 minutes |
| Write Operations | 100 requests | 5 minutes |
| File Uploads | 20 requests | 5 minutes |
| Search Operations | 50 requests | 5 minutes |

### Rate Limit Headers

```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 245
X-RateLimit-Reset: 1696761600
```

### Rate Limit Exceeded Response

```typescript
{
  success: false,
  error: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Rate limit exceeded. Please try again later.',
    details: {
      limit: 300,
      resetAt: '2025-10-08T10:40:00Z'
    }
  },
  timestamp: '2025-10-08T10:35:00Z'
}
```

---

## Webhooks (Future Enhancement)

### Available Webhooks

1. **member.created** - New family member added
2. **member.updated** - Family member profile updated
3. **timeline.event.created** - New timeline event
4. **career.milestone.completed** - Career milestone achieved
5. **community.post.created** - New community post
6. **education.assessment.completed** - Assessment submitted

### Webhook Payload Example

```typescript
{
  event: 'member.created',
  timestamp: '2025-10-08T10:30:00Z',
  data: FamilyMember,
  triggeredBy: string  // User ID
}
```

---

## SDK Examples

### JavaScript/TypeScript SDK

```typescript
import { MNIClient } from '@mni/sdk';

const client = new MNIClient({
  apiKey: process.env.FIREBASE_API_KEY,
  authToken: firebaseAuth.currentUser.token
});

// Get family tree
const familyTree = await client.family.getTree({
  rootPersonId: 'notemba',
  generations: 3
});

// Create timeline event
const event = await client.timeline.createEvent({
  title: 'Family Gathering',
  date: new Date('2025-12-25'),
  category: 'family',
  people: ['salatiso', 'visa', 'solo', 'tina', 'kwakho', 'sazi']
});

// Get career progress
const progress = await client.career.getProgress('solo');
```

---

## Testing

### API Testing with Postman

Import the Postman collection:
```
docs/postman/MNI_API_Collection.json
```

### Authentication Setup

1. Get Firebase ID token:
```typescript
const token = await firebase.auth().currentUser.getIdToken();
```

2. Add to Postman environment:
```
FIREBASE_TOKEN = <your_token>
```

### Test Data

Staging environment includes anonymized test data:
- 20 family members
- 100+ timeline events
- 15 career paths
- 50+ community posts

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | Oct 8, 2025 | Initial V2 API specification for upgrade |

---

*This document is part of the MNI Family Enterprise technical documentation suite.*
