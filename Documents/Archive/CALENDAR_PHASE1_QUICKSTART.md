# 🎬 QUICK START: Phase 1 Implementation Guide

**Status:** Ready to Build  
**Date:** October 22, 2025  
**Target Completion:** November 1, 2025 (9 days)  

---

## 📋 What We're Building (Phase 1)

**3 Core React Components:**

1. **RoleAssignmentCard** — Show & manage who has what role
2. **IncidentLogForm** — Quick form to report problems
3. **AssistanceRequestCard** — Request & track help

**Plus Supporting Infrastructure:**
- Firestore integration (database)
- Custom React hooks
- Auto-escalation logic
- Firebase notifications

---

## 🚀 Implementation Sequence (Fastest Path)

### Day 1: Setup (Oct 23)
```bash
# Create component structure
mkdir -p src/components/calendar
mkdir -p src/hooks
mkdir -p src/services/calendar
mkdir -p tests/calendar

# Create empty component files
touch src/components/calendar/RoleAssignmentCard.tsx
touch src/components/calendar/IncidentLogForm.tsx
touch src/components/calendar/AssistanceRequestCard.tsx
```

### Day 2-3: Build Components (Oct 24-25)
- Write RoleAssignmentCard.tsx (350-400 lines)
- Write IncidentLogForm.tsx (450-500 lines)  
- Write AssistanceRequestCard.tsx (350-400 lines)

### Day 4-5: Add Hooks & Services (Oct 26-27)
- useRoleAssignment.ts custom hook
- useIncidentEscalation.ts custom hook
- calendarService.ts extensions
- escalationService.ts new service

### Day 6-7: Integration & Testing (Oct 28-29)
- Connect to calendar page
- Firebase backend setup
- Write unit tests
- Write integration tests

### Day 8-9: Optimization & Staging (Oct 30-Nov 1)
- Performance testing
- Bug fixes
- Staging deployment
- Solo testing ready

---

## 💻 Code Template: RoleAssignmentCard

**File:** `src/components/calendar/RoleAssignmentCard.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { EnhancedCalendarEvent, RoleType, Permission } from '@/types/calendar';
import toast from 'react-hot-toast';

interface RoleAssignmentCardProps {
  event: EnhancedCalendarEvent;
  currentUserId: string;
  onRoleUpdate?: (userId: string, newRole: RoleType) => Promise<void>;
  editable?: boolean;
  compact?: boolean;
}

export const RoleAssignmentCard: React.FC<RoleAssignmentCardProps> = ({
  event,
  currentUserId,
  onRoleUpdate,
  editable = false,
  compact = false
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: RoleType) => {
    if (!onRoleUpdate) return;
    
    try {
      setIsUpdating(true);
      setError(null);
      await onRoleUpdate(userId, newRole);
      toast.success('Role updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update role';
      setError(message);
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (compact) {
    return (
      <div className="role-assignment-compact">
        <h4>Roles: {event.roles.length} assigned</h4>
        <ul>
          {event.roles.map(role => (
            <li key={role.id}>
              <span className="role-icon">{getRoleIcon(role.role)}</span>
              <span>{role.role}</span>
              {role.status === 'accepted' && <span className="checkmark">✓</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="role-assignment-card">
      <h3>👥 Event Roles & Responsibilities</h3>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          ⚠️ {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="roles-list">
        {event.roles.map(role => (
          <div key={role.id} className={`role-item status-${role.status}`}>
            <div className="role-header">
              <span className="role-icon">{getRoleIcon(role.role)}</span>
              <div className="role-info">
                <h4>{role.role.charAt(0).toUpperCase() + role.role.slice(1)}</h4>
                <p>{getUserName(role.userId)}</p>
              </div>
              <span className="status-badge">{role.status}</span>
            </div>

            <p className="role-description">{getRoleDescription(role.role)}</p>

            {editable && isUpdateAllowed(currentUserId, event, Permission.EDIT) && (
              <div className="role-actions">
                <button 
                  onClick={() => handleRoleChange(role.userId, role.role)}
                  disabled={isUpdating}
                >
                  Edit
                </button>
                <button 
                  onClick={() => removeRole(role.userId)}
                  disabled={isUpdating}
                  className="btn-danger"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {editable && isUpdateAllowed(currentUserId, event, Permission.ASSIGN_ROLES) && (
        <button className="btn btn-primary" onClick={() => openAssignmentModal()}>
          + Add Role
        </button>
      )}
    </div>
  );
};

// Helper functions
function getRoleIcon(role: RoleType): string {
  const icons: Record<RoleType, string> = {
    organizer: '📋',
    participant: '👥',
    supporter: '🤝',
    steward: '⭐'
  };
  return icons[role];
}

function getRoleDescription(role: RoleType): string {
  const descriptions: Record<RoleType, string> = {
    organizer: 'Plans event, assigns roles, makes decisions',
    participant: 'Attends and contributes to event',
    supporter: 'Provides assistance or resources',
    steward: 'Oversees execution and outcomes'
  };
  return descriptions[role];
}

function getUserName(userId: string): string {
  // TODO: Fetch from user database
  return userId;
}

function isUpdateAllowed(
  userId: string,
  event: EnhancedCalendarEvent,
  permission: Permission
): boolean {
  // TODO: Implement permission checking
  return event.organizer === userId;
}

async function removeRole(userId: string): Promise<void> {
  // TODO: Implement role removal
  console.log('Removing role for user:', userId);
}

function openAssignmentModal(): void {
  // TODO: Open modal to assign new roles
}

export default RoleAssignmentCard;
```

---

## 🔌 Firebase Integration Pattern

**File:** `src/services/calendar/calendarService.ts`

```typescript
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  onSnapshot,
  QueryConstraint,
  where
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { EnhancedCalendarEvent, EventStatus, EventType } from '@/types/calendar';

/**
 * Subscribe to real-time event updates
 */
export const subscribeToEvent = (
  eventId: string,
  callback: (event: EnhancedCalendarEvent) => void
) => {
  const ref = doc(db, 'events', eventId);
  return onSnapshot(ref, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as EnhancedCalendarEvent);
    }
  });
};

/**
 * Subscribe to all roles in an event
 */
export const subscribeToRoles = (
  eventId: string,
  callback: (roles: EventRole[]) => void
) => {
  const q = query(
    collection(db, 'events', eventId, 'roles')
  );
  return onSnapshot(q, (snapshot) => {
    const roles = snapshot.docs.map(doc => doc.data() as EventRole);
    callback(roles);
  });
};

/**
 * Create a new incident
 */
export const createIncident = async (
  incidentData: IncidentFormData
): Promise<string> => {
  const event: Partial<EnhancedCalendarEvent> = {
    type: EventType.INCIDENT,
    category: incidentData.category,
    severity: incidentData.severity,
    title: incidentData.title,
    description: incidentData.description,
    location: incidentData.location,
    context: incidentData.context,
    status: EventStatus.OPEN,
    createdAt: new Date(),
    updatedAt: new Date(),
    incidentData: {
      category: incidentData.category,
      severity: incidentData.severity,
      description: incidentData.description,
      location: incidentData.location,
      escalationPath: [],
      currentLevel: incidentData.context
    }
  };

  const ref = await addDoc(collection(db, 'events'), event);
  return ref.id;
};

/**
 * Update event status
 */
export const updateEventStatus = async (
  eventId: string,
  newStatus: EventStatus,
  notes?: string
): Promise<void> => {
  const ref = doc(db, 'events', eventId);
  await updateDoc(ref, {
    status: newStatus,
    updatedAt: new Date(),
    ...(notes && { statusNotes: notes })
  });
};
```

---

## 🎣 Custom Hook Pattern

**File:** `src/hooks/useRoleAssignment.ts`

```typescript
import { useState, useEffect } from 'react';
import { EventRole, Permission, RoleType } from '@/types/calendar';
import { subscribeToRoles } from '@/services/calendar/calendarService';

interface UseRoleAssignmentOptions {
  eventId: string;
  userId: string;
}

export const useRoleAssignment = ({ eventId, userId }: UseRoleAssignmentOptions) => {
  const [roles, setRoles] = useState<EventRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = subscribeToRoles(eventId, (data) => {
        setRoles(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setLoading(false);
    }
  }, [eventId]);

  const userRole = roles.find(r => r.userId === userId);
  const canEdit = userRole?.permissions.includes(Permission.EDIT) ?? false;
  const canEscalate = userRole?.permissions.includes(Permission.ESCALATE) ?? false;

  return {
    roles,
    userRole,
    loading,
    error,
    canEdit,
    canEscalate
  };
};
```

---

## ✅ Testing Template

**File:** `tests/calendar/RoleAssignmentCard.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RoleAssignmentCard } from '@/components/calendar/RoleAssignmentCard';
import { EnhancedCalendarEvent, RoleType, RoleStatus } from '@/types/calendar';
import { createMinimalEvent } from '@/types/calendar';

describe('RoleAssignmentCard', () => {
  const mockEvent = createMinimalEvent('Test Event', new Date(), 'user_1');

  it('renders role assignment card', () => {
    render(
      <RoleAssignmentCard 
        event={mockEvent} 
        currentUserId="user_1"
      />
    );

    expect(screen.getByText(/Event Roles/i)).toBeInTheDocument();
  });

  it('displays all assigned roles', () => {
    render(
      <RoleAssignmentCard 
        event={mockEvent} 
        currentUserId="user_1"
      />
    );

    mockEvent.roles.forEach(role => {
      expect(screen.getByText(role.role, { selector: 'h4' })).toBeInTheDocument();
    });
  });

  it('handles role updates', async () => {
    const onRoleUpdate = jest.fn();

    render(
      <RoleAssignmentCard 
        event={mockEvent} 
        currentUserId="user_1"
        onRoleUpdate={onRoleUpdate}
        editable={true}
      />
    );

    const editButton = screen.getByText('Edit').first();
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(onRoleUpdate).toHaveBeenCalled();
    });
  });

  it('shows error message on update failure', async () => {
    const onRoleUpdate = jest.fn().mockRejectedValue(
      new Error('Update failed')
    );

    render(
      <RoleAssignmentCard 
        event={mockEvent} 
        currentUserId="user_1"
        onRoleUpdate={onRoleUpdate}
        editable={true}
      />
    );

    const editButton = screen.getByText('Edit').first();
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText(/Update failed/i)).toBeInTheDocument();
    });
  });

  it('respects compact mode', () => {
    const { container } = render(
      <RoleAssignmentCard 
        event={mockEvent} 
        currentUserId="user_1"
        compact={true}
      />
    );

    expect(container.querySelector('.role-assignment-compact')).toBeInTheDocument();
  });
});
```

---

## 📊 Checklist for Phase 1

### Components (3)
- [ ] RoleAssignmentCard.tsx (350-400 lines)
- [ ] IncidentLogForm.tsx (450-500 lines)
- [ ] AssistanceRequestCard.tsx (350-400 lines)

### Hooks (2)
- [ ] useRoleAssignment.ts (100-150 lines)
- [ ] useIncidentEscalation.ts (150-200 lines)

### Services (2)
- [ ] calendarService.ts extensions (200-300 lines)
- [ ] escalationService.ts new (200-250 lines)

### Tests (3)
- [ ] RoleAssignmentCard.test.tsx (250-350 lines)
- [ ] IncidentLogForm.test.tsx (300-400 lines)
- [ ] escalationService.test.ts (200-300 lines)

### Integration (3)
- [ ] Wire into existing calendar page
- [ ] Firebase Firestore setup
- [ ] Real-time notifications (React Hot Toast)

### Documentation (2)
- [ ] README for calendar components
- [ ] API documentation for services

### Deployment (3)
- [ ] Staging environment setup
- [ ] Smoke tests
- [ ] Performance baseline

---

## 🎯 Daily Standups (Oct 23-Nov 1)

### Standup Template
```markdown
**Date:** [Date]
**Goal:** [Daily objective]

✅ Completed:
- [Task 1]
- [Task 2]

🔄 In Progress:
- [Task 3]

⛔ Blocked:
- [Issue 1 - Resolution]

📊 Status:
- Lines of code: XXX
- Test coverage: XX%
- Build status: ✓
```

---

## 🚨 Risk Checklist

- [ ] TypeScript strict mode enabled
- [ ] All console.logs removed before commit
- [ ] No hardcoded URLs or secrets
- [ ] Error boundaries in place
- [ ] Loading states visible
- [ ] Offline support tested
- [ ] Mobile responsive tested
- [ ] Accessibility (WCAG 2.1 AA) tested
- [ ] Firebase quota not exceeded
- [ ] Performance < 200ms per action

---

## 📞 Support Triggers

**Call for help when:**
- TypeScript compilation errors > 5
- Test coverage drops below 90%
- Build time exceeds 5 minutes
- Performance metric exceeds 500ms
- Firebase quota approaching limit
- Family testing blocked
- Architectural decision needed

---

## 🏁 Definition of Done (Phase 1)

**Code:**
- ✅ All components written
- ✅ Zero TypeScript errors
- ✅ 95%+ test coverage
- ✅ Linting passes
- ✅ No console errors

**Testing:**
- ✅ Unit tests pass
- ✅ Integration tests pass
- ✅ E2E tests pass
- ✅ Performance acceptable
- ✅ Mobile tested

**Documentation:**
- ✅ Code comments (JSDoc)
- ✅ Component storybook
- ✅ API documentation
- ✅ Deployment guide

**Staging:**
- ✅ Deployed to staging
- ✅ Smoke tests pass
- ✅ Solo testing ready
- ✅ Family briefed

---

## 🚀 Go/No-Go Decision Criteria (Nov 1)

**GO IF:**
- ✅ All components working
- ✅ Solo confirms usability
- ✅ 90%+ family approval in testing
- ✅ Zero critical bugs
- ✅ Performance acceptable
- ✅ Backward compatibility verified

**NO-GO IF:**
- ❌ Critical bugs unfixed
- ❌ Family feedback negative
- ❌ Performance degraded
- ❌ Breaking changes detected
- ❌ Firebase quota issues
- ❌ Deployment failed

---

## 📚 Reference Documents

1. **CALENDAR_ENHANCEMENT_PLAN.md** — Strategic roadmap
2. **src/types/calendar.ts** — Complete type system
3. **CALENDAR_UI_UX_SPECIFICATIONS.md** — Component specs
4. **CALENDAR_IMPLEMENTATION_KICKOFF.md** — This file

---

## 🎬 Let's Go!

**Ready to build Phase 1?**

**Just tell me:**
1. "Start writing RoleAssignmentCard.tsx"
2. "Create all Phase 1 components"
3. "Build Phase 1 infrastructure (hooks/services)"

**And I'll deliver production-ready code immediately!**

---

**October 22, 2025**  
**GitHub Copilot**  
**Ready to implement! 🚀**
