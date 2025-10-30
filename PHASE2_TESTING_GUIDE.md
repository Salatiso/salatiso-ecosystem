# Phase 2 Testing Strategy & Verification Checklist

**Phase:** 2 - Bi-Directional Activity Logging
**Timeline:** Weeks 3-4 (10 days)
**Target:** 16 components logging activities

---

## Testing Overview

### Three Levels of Testing

1. **Unit Tests** (Component level)
   - Each component logs correctly
   - Activity data is complete
   - Error handling works

2. **Integration Tests** (Cross-component)
   - Activities appear in BizHelp
   - Firestore listeners work
   - Real-time sync functions

3. **E2E Tests** (User perspective)
   - User performs action
   - Activity appears in Activity Feed
   - Timestamps and icons correct

---

## Unit Test Template

Use this template for **each component** you implement:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { YourComponent } from './YourComponent';

// Mock the hook
jest.mock('@/hooks/useBizHelpIntegration', () => ({
  useBizHelpIntegration: (companyId) => ({
    activityLogger: {
      log: jest.fn().mockResolvedValue(true)
    },
    activities: []
  })
}));

describe('YourComponent - Activity Logging', () => {
  
  it('logs activity when creating item', async () => {
    const { useBizHelpIntegration } = require('@/hooks/useBizHelpIntegration');
    const mockLog = jest.fn();
    
    useBizHelpIntegration.mockReturnValue({
      activityLogger: { log: mockLog },
      activities: []
    });
    
    render(<YourComponent companyId="test-company" />);
    
    // Trigger create action
    const createButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createButton);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test Item' }
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // Wait for logging
    await waitFor(() => {
      expect(mockLog).toHaveBeenCalledWith(
        'item_created',
        expect.objectContaining({
          itemId: expect.any(String),
          itemName: 'Test Item'
        })
      );
    });
  });
  
  it('includes all required data in activity log', async () => {
    const { useBizHelpIntegration } = require('@/hooks/useBizHelpIntegration');
    const mockLog = jest.fn();
    
    useBizHelpIntegration.mockReturnValue({
      activityLogger: { log: mockLog },
      activities: []
    });
    
    render(<YourComponent companyId="test-company" />);
    
    // ... create item ...
    
    await waitFor(() => {
      const [activityType, activityData] = mockLog.mock.calls[0];
      
      expect(activityType).toBe('item_created');
      expect(activityData).toHaveProperty('itemId');
      expect(activityData).toHaveProperty('itemName');
      // Add all required fields
    });
  });
  
  it('handles logging errors gracefully', async () => {
    const { useBizHelpIntegration } = require('@/hooks/useBizHelpIntegration');
    const mockLog = jest.fn().mockRejectedValue(new Error('Firestore error'));
    
    useBizHelpIntegration.mockReturnValue({
      activityLogger: { log: mockLog },
      activities: []
    });
    
    render(<YourComponent companyId="test-company" />);
    
    // ... create item (logging fails) ...
    
    // Component should still show success to user
    // (logging is not critical to operation)
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });
});
```

---

## Manual Testing Checklist

### For Each Component Implementation

#### Setup
- [ ] Component has useBizHelpIntegration hook imported
- [ ] Hook is called with valid companyId
- [ ] activityLogger is destructured from hook
- [ ] No TypeScript errors

#### Create Operation
- [ ] Perform create action in UI
- [ ] Activity appears in Activity Feed within 2 seconds
- [ ] Activity shows correct type (e.g., 'item_created')
- [ ] Activity timestamp is accurate
- [ ] Activity includes correct data

#### Update Operation
- [ ] Perform update action
- [ ] Activity logged with 'updated' type
- [ ] Changes are captured in activity data
- [ ] No duplicate activities logged

#### Status Change Operation
- [ ] Change status/state of item
- [ ] Activity logged with status change
- [ ] Old and new status visible in activity
- [ ] Activity icon reflects the change

#### Delete Operation
- [ ] Perform delete action
- [ ] Activity logged with 'deleted' type
- [ ] Item name/ID captured in activity
- [ ] Activity appears before item disappears

#### Error Handling
- [ ] Invalid input shown to user
- [ ] Logging doesn't break on error
- [ ] Error message displayed clearly
- [ ] Activity not logged on error

---

## Integration Test - Cross-Component Activity Flow

```typescript
describe('Cross-Component Activity Flow', () => {
  
  it('activities sync between MNI and BizHelp', async () => {
    // 1. Create activity in CompanyProfileCard
    const { unmount } = render(
      <CompanyProfileCard companyId="test-company" />
    );
    
    // Trigger create activity
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // 2. Verify activity in Firestore
    await waitFor(() => {
      // Query Firestore activities collection
      const activities = // get from firestore
      expect(activities).toContainEqual(
        expect.objectContaining({
          type: 'company_profile_updated',
          source: 'MNI'
        })
      );
    });
    
    // 3. Verify activity visible in ActivityFeedWidget
    unmount();
    render(<ActivityFeedWidget companyId="test-company" />);
    
    await waitFor(() => {
      expect(screen.getByText(/company.profile.updated/i)).toBeInTheDocument();
    });
  });
});
```

---

## E2E Testing Scenarios

### Scenario 1: Complete CRUD Workflow

```
1. USER ACTION: Create new company profile
   EXPECTED: Activity logged as 'company_profile_created'
   VERIFY: Name appears in Activity Feed

2. USER ACTION: Edit company profile
   EXPECTED: Activity logged as 'company_profile_updated'
   VERIFY: Edit timestamp appears in Activity Feed

3. USER ACTION: View activity details
   EXPECTED: Full activity data visible
   VERIFY: All fields (time, type, data) correct

4. USER ACTION: Filter activities by type
   EXPECTED: Only profile updates visible
   VERIFY: Other activity types hidden
```

### Scenario 2: Real-Time Activity Sync

```
SETUP: Open Professional tab in two browser windows

WINDOW A:
1. Click "Activity Feed"
2. Watch for activities

WINDOW B:
1. Create new item in any component
2. Wait 2 seconds

EXPECTED:
- Activity appears in WINDOW A automatically
- No page refresh needed
- Timestamp matches action time
```

### Scenario 3: Activity Feed Filtering

```
1. Open Activity Feed
2. 50+ activities should be visible
3. Search for "profile" 
   → Should show only profile-related activities
4. Filter by "MNI" source
   → Should show only MNI activities
5. Filter by "created" type
   → Should show only creation activities
6. Apply multiple filters
   → Should show intersection of filters
```

### Scenario 4: Performance Under Load

```
1. Open Activity Feed
2. Rapidly create 10 items (one per second)
3. Check Activity Feed:
   → All 10 should appear
   → No lag in UI
   → No duplicate entries
   → Scroll smooth (< 60fps)
```

---

## Test Coverage Requirements

### Phase 2 Success Criteria

```
Component Coverage:
✅ All 16 components logging = 100%
✅ Each component has ≥ 80% test coverage
✅ Unit tests for create/update/delete
✅ Integration tests for sync

Activity Coverage:
✅ All activity types tested
✅ Error scenarios tested
✅ Edge cases tested (null values, etc.)
✅ Performance tested (< 50ms sync latency)

UI Coverage:
✅ Activity appears in Feed
✅ Filters work correctly
✅ Search works correctly
✅ Icons display correctly
✅ Timestamps format correctly
```

---

## Daily Testing Checklist

### Morning (Before Implementation)
- [ ] Build succeeds: `npm run build` ✓
- [ ] No TypeScript errors
- [ ] Latest code pulled

### During Implementation
- [ ] Component compiles without errors
- [ ] Hook imports correctly
- [ ] Logger initialized successfully

### After Implementation
- [ ] Manual test create action
- [ ] Manual test update action
- [ ] Manual test delete action
- [ ] Verify Activity Feed shows activities
- [ ] Run unit tests: `npm test`
- [ ] Check browser console for errors

### End of Day
- [ ] All tests pass
- [ ] Code committed
- [ ] No broken builds
- [ ] Progress updated

---

## Automated Testing Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (during development)
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- YourComponent.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="activity logging"

# Run tests with verbose output
npm test -- --verbose
```

---

## Activity Verification Checklist

For each logged activity, verify:

```
✓ Type: Correct activity type string
✓ Source: 'MNI' for MNI components, 'BizHelp' for BizHelp
✓ Timestamp: Current time (within 5 seconds)
✓ Data: All relevant fields included
✓ User: Correct user ID recorded
✓ Company: Correct company ID recorded
✓ Document: Created in /activities/{userId} collection
✓ Firestore: Verified in Firebase Console
✓ UI: Visible in ActivityFeedWidget within 2 seconds
✓ Real-time: Appears without page refresh
```

---

## Bug Report Template

If you encounter an issue during testing:

```
TITLE: [COMPONENT] Activity not logging

DESCRIPTION:
When I [ACTION], the activity [ACTIVITY_TYPE] is not logged.

STEPS TO REPRODUCE:
1. Navigate to [COMPONENT]
2. Perform [ACTION]
3. Open Activity Feed
4. Expected: [WHAT_SHOULD_HAPPEN]
5. Actual: [WHAT_ACTUALLY_HAPPENED]

EXPECTED:
Activity appears in Activity Feed within 2 seconds

ACTUAL:
Activity does not appear after 5 seconds

COMPONENT: CompanyProfileCard
ACTIVITY_TYPE: company_profile_updated
USER_ID: [YOUR_USER_ID]
COMPANY_ID: [YOUR_COMPANY_ID]
TIMESTAMP: [WHEN_IT_HAPPENED]

SCREENSHOTS: [IF_APPLICABLE]
BROWSER: Chrome 120+
```

---

## Weekly Test Report Template

End of each week, complete:

```markdown
# Week [N] Testing Report

## Components Tested
- [ ] CompanyProfileCard - 3/3 operations logged ✓
- [ ] ComplianceTracker - 3/3 operations logged ✓
- [ ] DocumentRepository - 3/3 operations logged
- ...

## Test Coverage
- Unit: 85% (42/50 tests passing)
- Integration: 90% (9/10 tests passing)
- E2E: 100% (4/4 scenarios passing)

## Issues Found
1. [Component] - [Issue description] [RESOLVED/OPEN]
2. ...

## Performance Metrics
- Sync latency: 23ms average
- Error rate: 0%
- Duplicate rate: 0%

## Ready for Production
- [ ] No critical issues
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] Code reviewed
```

---

## Success Metrics

### Phase 2 Must-Have
```
✅ 16/16 components logging (100%)
✅ All activities in ActivityFeed (100%)
✅ Sync latency < 50ms (95th percentile)
✅ Zero duplicate activities
✅ 80%+ test coverage
✅ Zero critical bugs
```

### Phase 2 Nice-to-Have
```
☐ 90%+ test coverage
☐ < 25ms sync latency
☐ Activity search/filter optimized
☐ Performance metrics dashboard
☐ Activity export feature
```

---

## Testing Timeline

**Week 1 (Days 1-5):**
- Days 1-3: Unit tests for governance components
- Days 4-5: Integration tests begin

**Week 2 (Days 6-10):**
- Days 6-8: Unit tests for remaining components
- Days 9-10: E2E testing & performance verification

**Friday Deployment:**
- Final regression testing
- Performance validation
- Deploy to production

---

## Questions During Testing?

Refer to:
- **ACTIVITY_LOGGING_GUIDE.md** - Implementation details
- **PHASE2_KICKOFF.md** - Full specification
- **src/services/bizHelpIntegration.ts** - Logger implementation
- **src/hooks/useBizHelpIntegration.ts** - Hook details

---

**Your job:** Implement the logging code ✓
**Our job:** Test it thoroughly and deploy with confidence!

Let's ship Phase 2 on schedule! 🚀
