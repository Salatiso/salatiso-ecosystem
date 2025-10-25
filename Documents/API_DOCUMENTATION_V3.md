# API Documentation - Salatiso Ecosystem

This document outlines the REST API endpoints available for the Salatiso Ecosystem platform.

## Authentication

All API endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <firebase-auth-token>
```

## Base URL

```
https://your-domain.com/api
```

## Response Format

All responses follow this structure:

```json
{
  "success": boolean,
  "data": any,
  "error": string,
  "message": string
}
```

## User Management APIs

### GET /api/user/profile

Get current user's profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user",
    "familyId": "family_id",
    "preferences": {...},
    "gamification": {...}
  }
}
```

### PUT /api/user/update-profile

Update current user's profile.

**Request Body:**
```json
{
  "displayName": "Updated Name",
  "email": "newemail@example.com",
  "preferences": {
    "language": "en",
    "theme": "dark"
  },
  "gamification": {
    "level": 5,
    "xp": 1250
  }
}
```

## Family Management APIs

### GET /api/family/info

Get current user's family information and members.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "family_id",
    "name": "Doe Family",
    "members": [
      {
        "id": "user_id",
        "displayName": "John Doe",
        "role": "family_admin",
        "email": "john@example.com"
      }
    ]
  }
}
```

### POST /api/family/updates

Create a new family update/announcement. (Admin only)

**Request Body:**
```json
{
  "title": "Family Meeting",
  "content": "We will have a family meeting this Sunday at 2 PM.",
  "type": "announcement",
  "priority": "high"
}
```

## Learning Management APIs

### GET /api/courses

Get available courses with user progress.

**Query Parameters:**
- `category` (optional): Filter by category
- `limit` (optional): Limit results (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "course_id",
      "title": "Business Fundamentals",
      "description": "Learn the basics of business",
      "category": "business",
      "progress": {
        "overallProgress": 75,
        "status": "in_progress",
        "lessons": {...}
      }
    }
  ]
}
```

### POST /api/courses/progress

Update user's progress in a course.

**Request Body:**
```json
{
  "courseId": "course_id",
  "lessonId": "lesson_id",
  "progress": 100,
  "completed": true,
  "score": 95
}
```

## Project Management APIs

### POST /api/projects/create

Create a new project.

**Request Body:**
```json
{
  "name": "New Business Venture",
  "description": "Starting a new online business",
  "type": "business",
  "category": "startup",
  "priority": "high",
  "dueDate": "2025-12-31"
}
```

### GET /api/projects

Get user's projects.

**Query Parameters:**
- `status` (optional): Filter by status (active, completed, etc.)
- `type` (optional): Filter by type
- `limit` (optional): Limit results (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "project_id",
      "name": "Business Plan",
      "description": "Comprehensive business plan",
      "type": "business",
      "status": "active",
      "priority": "high",
      "members": [
        {
          "id": "user_id",
          "displayName": "John Doe",
          "role": "admin"
        }
      ],
      "progress": 45
    }
  ]
}
```

## Analytics APIs

### GET /api/analytics/dashboard

Get analytics dashboard data. (Admin only)

**Query Parameters:**
- `period`: Time period (7d, 30d, 90d) - default: 30d

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1247,
    "activeUsers": 892,
    "pageViews": 15432,
    "sessionDuration": 245,
    "topPages": [
      {"page": "/intranet", "views": 2847}
    ],
    "userEngagement": {
      "coursesStarted": 456,
      "coursesCompleted": 234,
      "achievements": 89,
      "messages": 1234
    },
    "contentMetrics": {
      "templatesDownloaded": 567,
      "booksDownloaded": 234,
      "searches": 3456
    },
    "businessMetrics": {
      "projectsViewed": 789,
      "businessPlansViewed": 456,
      "careerPathsViewed": 321
    }
  }
}
```

## Error Handling

All APIs return appropriate HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting

APIs are rate limited to prevent abuse:
- Default: 100 requests per 15 minutes per IP
- Authenticated users: Higher limits based on role

## Data Validation

All input data is validated server-side with clear error messages for:
- Required fields
- Email format validation
- Length constraints
- Data type validation

## Security Features

- Firebase Authentication integration
- Role-based access control
- Input sanitization
- CORS protection
- Request logging and monitoring

## Client Usage

Use the provided API client for easy integration:

```typescript
import { useApi } from '@/lib/apiClient';

function MyComponent() {
  const api = useApi();

  const loadProfile = async () => {
    try {
      const response = await api.getUserProfile();
      if (response.success) {
        console.log('Profile:', response.data);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };
}
```

## Future Enhancements

- GraphQL API support
- WebSocket real-time updates
- API versioning
- Advanced filtering and pagination
- Bulk operations
- File upload handling