# Sonny Services Testing - Quick Reference

## Running Tests

```pwsh
npm test
```

## Current Test Status

**Passing Tests**: 7 / 13  
**Test Suites**: 4 passed, 2 with minor adjustments needed

### ✅ Passing Tests
- `useSonnyServices` initialization and lifecycle (2 tests)
- `SonnyDashboard` smoke test (1 test)
- `SonnyTemplateCard` start flow (1 test)
- `HomePage` rendering (1 test)
- `SonnyNetworkWidget` rendering (1 test)
- `QuickActionsWidget` rendering (1 test)

### ⚠️ Tests Needing Mock Adjustments
- Specialized hooks return value assertions (4 tests) - need better mock alignment with actual hook returns
- Widget tests (2 tests) - need complete safetyStatus mock with lastCheckIn property

## Test Structure

```
__tests__/
├── hooks/
│   ├── useSonnyServices.test.ts         # Core service initialization
│   └── useSonnySpecializedHooks.test.ts # Individual hook APIs
├── components/
│   ├── SonnyDashboard.test.tsx          # Dashboard interactions
│   ├── SonnyTemplateCard.test.tsx       # Template collaboration
│   └── SonnyWidgets.test.tsx            # Widget rendering
└── home.test.tsx                         # Homepage smoke test
```

## Mock Infrastructure

### Service Mocks
All Sonny services are mocked using `jest.mock`:
- `SonnyBridgeService` - Messaging and status
- `TriggerManagerService` - Safety automation
- `ConsentLedgerService` - Permissions
- `TrustFrameworkService` - Ubuntu trust
- `MeshEngineService` - Mesh networking

### Context Mocks
- `AuthContext` - User authentication state
- `I18nContext` - Internationalization
- `next/router` - Next.js routing

### Browser Mocks
- `window.alert` - jsdom limitation (warnings only)
- `window.open` - Template viewing
- `navigator.geolocation` - Location access

## Writing New Tests

### Hook Test Pattern
```typescript
import { renderHook, act } from '@testing-library/react';
import { useSonnyBridge } from '@/hooks/useSonnyServices';

it('sends family message', async () => {
  const { result } = renderHook(() => useSonnyBridge(config));
  
  await act(async () => {
    const sent = await result.current.sendFamilyMessage('user1', 'Hello');
    expect(sent).toBe(true);
  });
});
```

### Component Test Pattern
```typescript
import { render, screen } from '@testing-library/react';
import SonnyDashboard from '@/components/SonnyDashboard';

it('renders dashboard', () => {
  render(<SonnyDashboard userId="u1" familyId="f1" displayName="Tester" />);
  expect(screen.getByText(/Sonny Family Network/i)).toBeInTheDocument();
});
```

## Known Issues & Workarounds

### Issue: "Cannot redefine property"
**Solution**: Use `jest.mock()` at module level instead of `jest.spyOn()`

### Issue: "window.alert not implemented"
**Expected**: jsdom doesn't implement alert; safe to ignore warning

### Issue: "Act warnings"
**Expected**: Async state updates in hooks; wrap in act() or ignore

### Issue: Missing mock properties
**Solution**: Ensure all required mock properties match component expectations

## Expanding Test Coverage

### Priority Areas
1. **Error Scenarios**: Test service initialization failures
2. **Event Handling**: Verify event emitter subscriptions
3. **State Updates**: Test real-time status changes
4. **Edge Cases**: Offline mode, reconnection logic
5. **Integration**: Multi-component interaction tests

### Coverage Goals
- **Target**: 80% statement coverage
- **Current**: ~40% (core paths covered)
- **Next**: Add error paths and edge cases

## CI/CD Integration

### Recommended Pipeline
```yaml
test:
  - npm install
  - npm test -- --coverage --ci
  - upload coverage to codecov
```

### Pre-commit Hook
```bash
#!/bin/sh
npm test -- --bail --findRelatedTests
```

## Performance

- **Test Suite Runtime**: ~5s (current)
- **Target**: Keep under 10s as tests grow
- **Strategy**: Use test.only for focused development

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Hooks](https://react-hooks-testing-library.com/)
