# 🧪 Testing Quick Start Guide

## Installation

### 1. Install Test Dependencies
```powershell
# Unit & Component Testing
npm install --save-dev @testing-library/user-event @testing-library/jest-dom msw

# E2E Testing
npm install --save-dev @playwright/test
npx playwright install
```

### 2. Verify Installation
```powershell
npm test -- --version  # Jest
npx playwright --version  # Playwright
```

---

## Running Tests

### All Unit/Component Tests
```powershell
npm test
```

### Specific Test File
```powershell
npm test VideoConferenceService
npm test MetricCard
npm test collaboration-workflows
```

### Watch Mode (Auto-rerun on changes)
```powershell
npm test -- --watch
```

### With Coverage Report
```powershell
npm test -- --coverage --watchAll=false
# Open: coverage/lcov-report/index.html
```

### All E2E Tests
```powershell
npx playwright test
```

### E2E in Interactive Mode
```powershell
npx playwright test --ui
```

### Specific E2E Test
```powershell
npx playwright test --grep "Family Business Planning"
npx playwright test --grep "Multi-User Concurrent"
```

### E2E on Specific Browser
```powershell
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### E2E in Debug Mode
```powershell
npx playwright test --debug
```

### View E2E Report
```powershell
npx playwright show-report
```

---

## Test Status

### ✅ Passing Tests (Run These!)
```powershell
npm test VideoConferenceService    # 13 tests ✅
npm test MetricCard               # 9 tests ✅
npx playwright test               # 17 E2E tests ✅
```

### ⚠️ Failing Tests (Needs Fixes)
```powershell
npm test AIRecommendationService  # 32 TypeScript errors ⚠️
# Fix: Update tests to match actual service interface
```

### 🟡 TODO Tests (Skeletons Only)
```powershell
npm test collaboration-workflows  # All tests are placeholders
# All tests pass with expect(true).toBe(true)
```

---

## Fixing AI Recommendation Tests

The `AIRecommendationService.test.ts` has 32 TypeScript errors. Here's how to fix them:

### Key Issues & Fixes

#### 1. analyzeContext() - Wrong Signature
```typescript
// ❌ WRONG (current test)
const analysis = await service.analyzeContext(contextObject);

// ✅ CORRECT (fix needed)
const analysis = await service.analyzeContext('family-123'); // Pass familyId string
```

#### 2. explainRecommendation() - Wrong Return Type
```typescript
// ❌ WRONG (current test)
const explanation = await service.explainRecommendation(recommendation);
expect(explanation.summary).toContain('recommended');  // Expects object

// ✅ CORRECT (fix needed)
const explanation = service.explainRecommendation(recommendation); // No await, returns string
expect(typeof explanation).toBe('string');
expect(explanation).toContain('scored');
```

#### 3. refineWithFeedback() - Wrong Signature
```typescript
// ❌ WRONG (current test)
const refined = await service.refineWithFeedback(context, feedback);
expect(refined.length).toBeGreaterThan(0);  // Expects array

// ✅ CORRECT (fix needed)
await service.refineWithFeedback(feedback);  // Only one arg, returns void
// No return value to test
```

#### 4. Property Names - templateTitle vs templateName
```typescript
// ❌ WRONG (current test)
recommendation.templateName = 'Business Together';

// ✅ CORRECT (fix needed)
recommendation.templateTitle = 'Business Together';
```

#### 5. FamilyContext - Missing Properties
```typescript
// ❌ WRONG (current test)
const context = {
  familyId: string;
  userId: string;
  userRole: string;
  // ... missing required properties
};

// ✅ CORRECT (fix needed)
const context: FamilyContext = {
  familyId: 'family-123',
  businessType: ['retail', 'agriculture'],
  completedTemplates: [],
  familySize: 5,
  trustScore: 75,
  goals: ['Expand business'],
  challenges: ['Communication'],
  culturalContext: {
    language: 'en',
    region: 'Eastern Cape',
    industryFocus: ['agriculture']
  }
};
```

### Fix Script
```powershell
# 1. Open the test file
code __tests__/services/AIRecommendationService.test.ts

# 2. Make the fixes above

# 3. Run tests
npm test AIRecommendationService

# 4. Verify all 14 tests pass
```

---

## Creating New Tests

### Service Test Template
```typescript
import { ServiceClass } from '@/services/ServiceClass';

// Mock dependencies
jest.mock('firebase/firestore', () => ({...}));

describe('ServiceClass', () => {
  let service: ServiceClass;

  beforeEach(() => {
    service = new ServiceClass();
  });

  it('should do something', async () => {
    const result = await service.method();
    expect(result).toBeDefined();
  });
});
```

### Component Test Template
```typescript
import { render, screen } from '@testing-library/react';
import ComponentName from '@/components/ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName prop="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### E2E Test Template
```typescript
import { test, expect } from '@playwright/test';

test('User journey description', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("Click Me")');
  await expect(page.locator('.result')).toBeVisible();
});
```

---

## Test Utilities

### Mock Data Factories (Available)
```typescript
import { createMockUser, createMockFamily, createMockTemplate } from '@/__tests__/utils/test-helpers';

const user = createMockUser({ role: 'elder' });
const family = createMockFamily({ elderId: user.uid });
const template = createMockTemplate({ familyId: family.id });
```

### Mock Services (Available)
```typescript
import { mockFirestore, mockDailyCall, mockOpenAI } from '@/__tests__/utils/test-helpers';

const firestore = mockFirestore();
const dailyCall = mockDailyCall();
const openai = mockOpenAI();
```

### Assertions (Available)
```typescript
import { assertUbuntuPrinciples, assertMetricsStructure } from '@/__tests__/utils/test-helpers';

assertUbuntuPrinciples(action);
assertMetricsStructure(metrics);
```

---

## Debugging Tests

### Debug Jest Tests
```powershell
# Add debugger to test
it('should work', () => {
  debugger;  // Add this line
  expect(true).toBe(true);
});

# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand VideoConferenceService
```

### Debug Playwright Tests
```powershell
# Interactive debug mode
npx playwright test --debug

# Headed mode (see browser)
npx playwright test --headed

# Slow motion
npx playwright test --headed --slow-mo=1000
```

### View Test Output
```powershell
# Verbose mode
npm test -- --verbose

# Show console.log
npm test -- --silent=false
```

---

## Coverage Goals

### Current Coverage
```
- Service Tests: 25% (1 of 4 services)
- Component Tests: 17% (1 of 6 components)
- Integration Tests: 0% (skeleton only)
- E2E Tests: 100% (all scenarios)
- Overall: ~33%
```

### Target Coverage
```
- Service Tests: 100% (4 of 4 services)
- Component Tests: 100% (6 of 6 components)
- Integration Tests: 100% (14 workflows)
- E2E Tests: 100% (maintained)
- Overall: 80%+
```

### Generate Coverage Report
```powershell
npm test -- --coverage --watchAll=false

# Open HTML report
start coverage/lcov-report/index.html  # Windows
open coverage/lcov-report/index.html   # Mac
```

---

## CI/CD Integration (TODO)

### GitHub Actions Workflow
Create `.github/workflows/test.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - run: npx playwright install --with-deps
      - run: npx playwright test
```

---

## Troubleshooting

### "Cannot find module '@/...'"
**Solution:** Check `tsconfig.json` paths configuration
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### "ReferenceError: TextEncoder is not defined"
**Solution:** Already fixed in `jest.setup.ts`

### Playwright can't find elements
**Solution:** Increase timeout
```typescript
await page.waitForSelector('.element', { timeout: 10000 });
```

### Tests are flaky
**Solution:** Use `waitForCondition()` instead of fixed delays
```typescript
import { waitForCondition } from '@/__tests__/utils/test-helpers';
await waitForCondition(() => element.isVisible(), 5000);
```

### "Port 3000 already in use"
**Solution:** Kill existing process
```powershell
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

## Next Steps

1. **Fix AI Tests** (2 hours)
   ```powershell
   code __tests__/services/AIRecommendationService.test.ts
   npm test AIRecommendationService
   ```

2. **Create Service Tests** (5 hours)
   ```powershell
   # CollaborativeEditingService.test.ts
   # AnalyticsService.test.ts
   ```

3. **Implement Integration Bodies** (4 hours)
   ```powershell
   code __tests__/integration/collaboration-workflows.test.ts
   # Replace all TODOs with real implementations
   ```

4. **Create Component Tests** (4 hours)
   ```powershell
   # TrendChart, UbuntuGauge, Dashboard, Editor, Presence
   ```

5. **Achieve 80% Coverage** (2 hours)
   ```powershell
   npm test -- --coverage
   ```

---

## Resources

- **Jest Docs:** https://jestjs.io/docs/getting-started
- **React Testing Library:** https://testing-library.com/docs/react-testing-library/intro
- **Playwright Docs:** https://playwright.dev/docs/intro
- **MSW Docs:** https://mswjs.io/docs/

---

## Quick Commands Cheat Sheet

```powershell
# Install
npm install --save-dev @testing-library/user-event @testing-library/jest-dom msw
npm install --save-dev @playwright/test
npx playwright install

# Run
npm test                           # All unit/component tests
npm test VideoConferenceService    # Specific test
npm test -- --watch                # Watch mode
npm test -- --coverage             # With coverage
npx playwright test                # E2E tests
npx playwright test --ui           # E2E interactive
npx playwright show-report         # View E2E report

# Debug
npx playwright test --debug        # Debug E2E
npm test -- --verbose              # Verbose output

# Fix
npm test AIRecommendationService   # See errors
code __tests__/services/AIRecommendationService.test.ts  # Fix them
```

---

**Status:** Infrastructure ✅ | Tests 33% ✅ | AI Tests ⚠️ | Coverage 🟡  
**Next:** Fix AI tests → Complete remaining → 80% coverage  
**ETA:** 20 hours
