# BizHelp Integration - Developer Quick Reference

**File:** QUICK_REFERENCE_BIZHELP_INTEGRATION.md

## Quick Start

### Using BizHelp Data in Your Component

```typescript
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';

export const MyComponent = ({ companyId }: { companyId: string }) => {
  const { 
    business,        // BizHelp business data
    activities,      // Activity feed
    loading,         // Loading state
    error,          // Error message
    activityLogger   // Logger instance
  } = useBizHelpIntegration(companyId);

  if (loading) return <div>Loading business data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>{business?.name}</h2>
      <p>Status: {business?.stage}</p>
    </div>
  );
};
```

## Logging Activities

### Simple Activity Logging

```typescript
// Method 1: Using ActivityLogger class
const { activityLogger } = useBizHelpIntegration(companyId);

// Log project creation
await activityLogger?.projectCreated({
  projectId: 'proj-123',
  projectName: 'Website Redesign',
  startDate: new Date(),
  budget: 50000
});

// Log task status change
await activityLogger?.taskStatusChanged('task-456', 'todo', 'in_progress');

// Log compliance completion
await activityLogger?.complianceCompleted('comp-789', 'Annual Tax Filing');
```

### Custom Activity Types

```typescript
const { activityLogger } = useBizHelpIntegration(companyId);

// Log any custom activity
await activityLogger?.log(
  'custom_event_type',
  {
    customData: 'value',
    metadata: { key: 'value' }
  },
  'MNI' // source: 'MNI' or 'BizHelp'
);
```

## Deep Linking to BizHelp

```typescript
import { getBizHelpLink } from '@/services/bizHelpIntegration';

// Generate links to BizHelp operations
const projectsLink = getBizHelpLink('projects');
const complianceLink = getBizHelpLink('compliance-calendar');
const specificProjectLink = getBizHelpLink('project-detail', { 
  projectId: 'proj-123' 
});

// Navigate
window.open(projectsLink, '_blank');
```

## Available Activity Types

```typescript
import { ACTIVITY_TYPES } from '@/services/bizHelpIntegration';

// All available types:
ACTIVITY_TYPES.PROJECT_CREATED
ACTIVITY_TYPES.PROJECT_UPDATED
ACTIVITY_TYPES.PROJECT_COMPLETED
ACTIVITY_TYPES.TASK_CREATED
ACTIVITY_TYPES.TASK_STATUS_CHANGED
ACTIVITY_TYPES.TASK_COMPLETED
ACTIVITY_TYPES.COMPLIANCE_COMPLETED
ACTIVITY_TYPES.COMPLIANCE_OVERDUE
ACTIVITY_TYPES.COMPLIANCE_REMINDER
ACTIVITY_TYPES.GOVERNANCE_DOCUMENT_ADDED
ACTIVITY_TYPES.POLICY_ADOPTED
ACTIVITY_TYPES.BOARD_MEETING_HELD
ACTIVITY_TYPES.ROLE_CREATED
ACTIVITY_TYPES.TEAM_MEMBER_ADDED
ACTIVITY_TYPES.PERFORMANCE_REVIEW_COMPLETED
ACTIVITY_TYPES.PARTNERSHIP_CREATED
ACTIVITY_TYPES.PARTNERSHIP_SIGNED
ACTIVITY_TYPES.PARTNERSHIP_COMPLETED
ACTIVITY_TYPES.RISK_IDENTIFIED
ACTIVITY_TYPES.RISK_MITIGATED
ACTIVITY_TYPES.INCIDENT_REPORTED
ACTIVITY_TYPES.BUSINESS_REGISTERED
ACTIVITY_TYPES.ENTITY_CREATED
```

## Real Workflow Example

### Example 1: ProjectCanvas Component

```typescript
import { ProjectCanvas } from '@/components/professional/operations/ProjectCanvas';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';

export const ProjectCanvas = ({ companyId }: { companyId: string }) => {
  const { business, activityLogger, loading } = useBizHelpIntegration(companyId);

  const handleCreateProject = async (projectData: any) => {
    try {
      // Create project (existing code)
      const newProject = await createProject(projectData);

      // Log the activity
      await activityLogger?.projectCreated({
        projectId: newProject.id,
        projectName: newProject.name,
        startDate: projectData.startDate,
        status: 'planning'
      });

      // Show success
      toast.success('Project created and logged');
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  return (
    <div>
      {/* Existing project canvas UI */}
      <button onClick={() => handleCreateProject(newData)}>
        Create Project
      </button>
    </div>
  );
};
```

### Example 2: TaskTracker Component

```typescript
const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
  try {
    // Update task in Firestore (existing)
    const oldTask = await getTask(taskId);
    await updateTask(taskId, { status: newStatus });

    // Log activity (new)
    await activityLogger?.taskStatusChanged(
      taskId,
      oldTask.status,
      newStatus
    );

    toast.success(`Task moved to ${newStatus}`);
  } catch (error) {
    toast.error('Failed to update task');
  }
};
```

### Example 3: BizHelpIntegrationWidget Usage

```typescript
import { BizHelpIntegrationWidget } from '@/components/professional';

export const ProfessionalPage = () => {
  const { user } = useAuth();

  // Full dashboard view
  return (
    <BizHelpIntegrationWidget
      companyId={user?.businessId || user?.id}
      compact={false}
      onNavigate={(url) => window.open(url, '_blank')}
    />
  );
};

// Or compact view for sidebar
return (
  <BizHelpIntegrationWidget
    companyId={user?.businessId || user?.id}
    compact={true}
  />
);
```

## Business Data Structure

```typescript
interface BizHelpBusiness {
  id: string;
  name: string;
  type: 'SoleProp' | 'Partnership' | 'PtyLtd' | 'NPC' | 'Trust' | 'Stokvel' | 'CC';
  stage: 'planning' | 'applying' | 'registered' | 'formalized';
  
  registration?: {
    cipcNumber?: string;
    registeredDate?: string;
    taxNumber?: string;
  };
  
  compliance?: {
    obligations?: Array<{
      id: string;
      name: string;
      type: string;
      dueDate: string;
      status: string;
    }>;
  };
  
  partnerships?: string[];
  
  operations?: {
    projects: number;
    activeTeam: number;
    revenue?: number;
  };
}
```

## Activity Data Structure

```typescript
interface BusinessActivity {
  id?: string;
  type: string;                    // Activity type
  source: 'MNI' | 'BizHelp' | 'Hub'; // Where it came from
  companyId: string;               // Company context
  userId: string;                  // Who triggered it
  timestamp: Timestamp;            // When it happened
  data: Record<string, any>;       // Custom data
  visible?: string[];              // Visible in these apps
}
```

## Error Handling

```typescript
const { business, loading, error, activityLogger } = useBizHelpIntegration(companyId);

// Handle loading state
if (loading) return <Spinner />;

// Handle errors
if (error) {
  return (
    <Alert type="error">
      <p>Failed to load business data: {error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </Alert>
  );
}

// Handle missing business
if (!business) {
  return <Alert type="warning">Business data not found</Alert>;
}

// Safe logging with error handling
try {
  await activityLogger?.log('custom_event', { data: 'value' });
} catch (err) {
  console.error('Failed to log activity:', err);
  // Don't fail user operation if logging fails
}
```

## Navigation Examples

```typescript
import { getBizHelpLink } from '@/services/bizHelpIntegration';

// 1. Direct navigation
const navigateToProjects = () => {
  const url = getBizHelpLink('projects');
  window.open(url, '_blank');
};

// 2. In buttons
<button 
  onClick={() => window.open(getBizHelpLink('compliance'), '_blank')}
>
  View All Compliance Items
</button>

// 3. With parameters
<button 
  onClick={() => window.open(
    getBizHelpLink('project-detail', { projectId: project.id }), 
    '_blank'
  )}
>
  View Project Details in BizHelp
</button>

// 4. Create ActionMenu
const actions = [
  { 
    label: 'Projects', 
    onClick: () => window.open(getBizHelpLink('projects'), '_blank') 
  },
  { 
    label: 'Compliance', 
    onClick: () => window.open(getBizHelpLink('compliance'), '_blank') 
  },
  { 
    label: 'Team', 
    onClick: () => window.open(getBizHelpLink('org-chart'), '_blank') 
  },
];
```

## Performance Tips

1. **Memoize callbacks:** Use `useCallback` to prevent unnecessary re-renders
```typescript
const handleLog = useCallback(async (data) => {
  await activityLogger?.log('event', data);
}, [activityLogger]);
```

2. **Batch operations:** Log multiple activities together
```typescript
const activities = [];
for (const item of items) {
  activities.push({ type: 'item_created', data: item });
}
await Promise.all(
  activities.map(a => activityLogger?.log(a.type, a.data))
);
```

3. **Unsubscribe listeners:** The hook handles this automatically
```typescript
// No need to manually unsubscribe - done on unmount
const { business } = useBizHelpIntegration(companyId);
```

## Testing

### Mock the hook in tests
```typescript
jest.mock('@/hooks/useBizHelpIntegration', () => ({
  useBizHelpIntegration: () => ({
    business: {
      id: 'test-business',
      name: 'Test Company',
      stage: 'registered',
    },
    activities: [],
    loading: false,
    error: null,
    activityLogger: {
      projectCreated: jest.fn(),
      log: jest.fn(),
    },
  }),
}));
```

### Mock activity logger
```typescript
const mockActivityLogger = {
  projectCreated: jest.fn().mockResolvedValue(undefined),
  taskStatusChanged: jest.fn().mockResolvedValue(undefined),
  log: jest.fn().mockResolvedValue(undefined),
};
```

## TypeScript Support

All integration code is fully typed:

```typescript
// Import types for your components
import type { 
  BizHelpBusiness,
  BusinessActivity,
  ActivityLogger
} from '@/services/bizHelpIntegration';

// Type-safe usage
const business: BizHelpBusiness | null = /* ... */;
const activities: BusinessActivity[] = /* ... */;
const logger: ActivityLogger | null = /* ... */;
```

## Security Considerations

1. **Authentication Required:**
   - User must be logged in to use BizHelp integration
   - useAuth() hook verifies authentication

2. **Authorization:**
   - Only company members can access business data
   - Firestore security rules enforce permissions

3. **Activity Logging:**
   - All activities attributed to specific user (userId)
   - Timestamp recorded for audit trail
   - No sensitive data in logs

4. **Deep Links:**
   - Always validate companyId before navigation
   - BizHelp should verify user access before showing data

## Common Issues & Solutions

### Issue: Business data is null
**Solution:** Verify companyId is correct and user has access
```typescript
const { user } = useAuth();
// Use: user?.businessId || user?.id
const { business } = useBizHelpIntegration(user?.businessId);
```

### Issue: Activities not syncing
**Solution:** Check Firestore security rules and user permissions
```typescript
// Verify in Firebase Console:
// - User can read from /activities/{userId}
// - User can create documents in /activities/{userId}
```

### Issue: Activity logging fails silently
**Solution:** Add error handling and logging
```typescript
try {
  await activityLogger?.log('event', data);
} catch (error) {
  console.error('Activity logging failed:', error);
  // Handle error appropriately
}
```

### Issue: Deep links open wrong page
**Solution:** Verify route parameters match BizHelp routes
```typescript
// Check in BizHelp PHASE1_DEPLOYMENT_SUMMARY.md for correct routes
const url = getBizHelpLink('project-detail', { projectId: id });
```

## Documentation References

- **Full Implementation:** `PHASE1_BIZHELP_INTEGRATION_COMPLETE.md`
- **Deployment Info:** `PHASE1_DEPLOYMENT_SUMMARY.md`
- **Architecture:** `BIZHELP_INTEGRATION_ROADMAP.md`
- **Source Code:** `src/services/bizHelpIntegration.ts`
- **Hook Code:** `src/hooks/useBizHelpIntegration.ts`
- **Component Code:** `src/components/professional/BizHelpIntegrationWidget.tsx`

## Support

For help or questions:
1. Check code comments in source files
2. Review TypeScript interfaces
3. See examples in PHASE1_DEPLOYMENT_SUMMARY.md
4. Check Firebase console logs

---

**Status:** ✅ Production Ready - All Features Implemented
**Last Updated:** January 2025
