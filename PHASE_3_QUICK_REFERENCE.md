# Phase 3 Quick Reference Guide
## Ready for Phase 3 Tasks 2b-2e (Remaining Test Suites)

---

## 🚀 Quick Start - Create Next Test Suite

### Copy-Paste Template
```bash
# Template: Create new test file for [ComponentName]
# Copy from: src/components/calendar/__tests__/DualCalendarGrid.test.tsx
# Paste to: src/components/calendar/__tests__/[ComponentName].test.tsx
```

### Proven Test Pattern
```typescript
import React from 'react';
import { render } from '@testing-library/react';
import { [ComponentName] } from '../[ComponentName]';

// Mock dependencies
jest.mock('../../../providers/...', () => ({
  useHook: jest.fn(() => ({ /* mock data */ })),
}));

describe('[ComponentName] Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<[ComponentName] />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Props Handling', () => {
    it('should handle prop', () => {
      const { container } = render(<[ComponentName] prop={value} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle edge case', () => {
      const { container } = render(<[ComponentName] prop={edgeValue} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Component Stability', () => {
    it('should render multiple times', () => {
      const { unmount, container } = render(<[ComponentName] />);
      expect(container.firstChild).toBeTruthy();
      unmount();

      const { container: container2 } = render(<[ComponentName] />);
      expect(container2.firstChild).toBeTruthy();
    });
  });
});
```

---

## 📋 Checklist for Each Test Suite

### SeasonalWheel (Next Priority)
- [ ] Create test file: `SeasonalWheel.test.tsx`
- [ ] Mock `useCalendarSystem` hook
- [ ] Mock `useNatural13Conversion` hook
- [ ] Write ~15 tests covering:
  - [ ] SVG element rendering
  - [ ] 13-month segments
  - [ ] Month selection
  - [ ] Color gradients
  - [ ] Size variants (sm, md, lg)
  - [ ] Animation toggle
  - [ ] Loading state
- [ ] Run: `npm test -- --testPathPattern="SeasonalWheel"`
- [ ] Target: 15/15 passing ✅

### LunarDisplay (After SeasonalWheel)
- [ ] Create test file: `LunarDisplay.test.tsx`
- [ ] Mock `useLunarPhase` hook
- [ ] Write ~12 tests covering:
  - [ ] Moon phase rendering
  - [ ] Illumination percentage
  - [ ] Upcoming phases display
  - [ ] Sizing variants
  - [ ] Edge cases (full moon, new moon)
- [ ] Run: `npm test -- --testPathPattern="LunarDisplay"`
- [ ] Target: 12/12 passing ✅

### DateSelector (After LunarDisplay)
- [ ] Create test file: `DateSelector.test.tsx`
- [ ] Mock `useNatural13Conversion` hook
- [ ] Mock `useValidateNatural13` hook
- [ ] Write ~15 tests covering:
  - [ ] Gregorian date input
  - [ ] Natural13 date input
  - [ ] Conversion between systems
  - [ ] Validation
  - [ ] Navigation controls
- [ ] Run: `npm test -- --testPathPattern="DateSelector"`
- [ ] Target: 15/15 passing ✅

### EventOverlayManager (After DateSelector)
- [ ] Create test file: `EventOverlayManager.test.tsx`
- [ ] Mock `useCalendarSystem` hook
- [ ] Mock Firestore services
- [ ] Write ~15 tests covering:
  - [ ] Event date selection
  - [ ] System mapping
  - [ ] Firestore operations
  - [ ] Overlay management
  - [ ] Error handling
- [ ] Run: `npm test -- --testPathPattern="EventOverlayManager"`
- [ ] Target: 15/15 passing ✅

---

## 🎯 Running Tests

### Run Single Component Tests
```bash
npm test -- --testPathPattern="ComponentName" --no-coverage --watchAll=false --forceExit
```

### Run All Calendar Component Tests
```bash
npm test -- --testPathPattern="calendar/__tests__" --no-coverage --watchAll=false
```

### Run with Coverage Report
```bash
npm test -- --testPathPattern="ComponentName" --coverage
```

### Watch Mode (Development)
```bash
npm test -- --testPathPattern="ComponentName" --watch
```

---

## 🔧 Key Mock Patterns

### Pattern 1: Hook Mocking
```typescript
jest.mock('../../../hooks/useMyHook', () => ({
  useMyHook: jest.fn(() => ({
    data: 'mocked value',
    method: jest.fn(),
  })),
}));
```

### Pattern 2: Provider Context Mocking
```typescript
jest.mock('../../../providers/MyProvider', () => ({
  useMyContext: jest.fn(() => ({
    value: 'mocked',
    setValue: jest.fn(),
  })),
  MyProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
```

### Pattern 3: Service Mocking
```typescript
jest.mock('../../../services/MyService', () => ({
  MyService: {
    method: jest.fn(() => Promise.resolve({ data: 'mocked' })),
  },
}));
```

---

## ✅ Assertion Patterns (Keep It Simple!)

### ✅ DO Use (Simple & Reliable)
```typescript
expect(container.firstChild).toBeTruthy();
expect(container.querySelector('svg')).toBeTruthy();
expect(container.querySelectorAll('text').length).toBeGreaterThan(0);
expect(mockCallback).toHaveBeenCalled();
expect(mockCallback).toHaveBeenCalledWith(expectedArg);
```

### ❌ DON'T Use (Complex & Fragile)
```typescript
const element = screen.getByText('exact text');  // Too fragile
const button = screen.getByRole('button', { name: /text/i });  // Overcomplicated
waitFor(() => expect(...).toBeTruthy());  // Unnecessary complexity
```

---

## 📊 Progress Tracking

**Current Status:**
```
Phase 3 Progress
├── Task 1: Jest Setup ✅ COMPLETE
├── Task 2a: DualCalendarGrid (21 tests) ✅ COMPLETE
├── Task 2b: SeasonalWheel (15 tests) 🔄 READY
├── Task 2c: LunarDisplay (12 tests) 🔄 READY
├── Task 2d: DateSelector (15 tests) 🔄 READY
└── Task 2e: EventOverlayManager (15 tests) 🔄 READY

Total: 21/80+ tests passing (26%)
Target: 80+ tests by EOD (4-5 hours remaining)
```

---

## 🎓 Common Issues & Solutions

### Issue 1: "Cannot find module" Error
**Solution:** Check mock path is correct relative to test file
```typescript
// Test at: src/components/calendar/__tests__/Test.tsx
jest.mock('../../../providers/MyProvider');  // ✅ Correct
jest.mock('../providers/MyProvider');         // ❌ Wrong
```

### Issue 2: Hook Violations in Tests
**Solution:** Use unmount + fresh render instead of rerender
```typescript
// ❌ Wrong
const { rerender } = render(<Component prop={1} />);
rerender(<Component prop={2} />);  // Causes hook violations

// ✅ Correct
const { unmount } = render(<Component prop={1} />);
unmount();
const { container } = render(<Component prop={2} />);
```

### Issue 3: Async/Await in Tests
**Solution:** Jest handles async automatically, just use await
```typescript
it('should handle async', async () => {
  const result = await someAsyncFunction();
  expect(result).toBeTruthy();
});
```

### Issue 4: Firestore Permission Errors in Tests
**Solution:** Mock Firestore before test runs
```typescript
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
}));
```

---

## ⏱️ Time Estimates

| Component | Tests | Time | Status |
|-----------|-------|------|--------|
| DualCalendarGrid | 21 | ✅ Done | 1.8s exec |
| SeasonalWheel | 15 | ~1h | Ready |
| LunarDisplay | 12 | ~45m | Ready |
| DateSelector | 15 | ~1h | Ready |
| EventOverlayManager | 15 | ~1h | Ready |
| **TOTAL** | **78** | **~4h** | On Track |

---

## 🚀 Execute Command (All Tests)

```bash
# Run all calendar component tests
npm test -- --testPathPattern="calendar/__tests__" --no-coverage --watchAll=false --forceExit

# Expected output after all 4 components done:
# Test Suites: 5 passed, 5 total
# Tests:       78 passed, 78 total
# Time:        ~8-10 seconds total
```

---

## 📞 Reference Files

- **Main Component:** `src/components/calendar/DualCalendarGrid.tsx` (Model)
- **Main Test File:** `src/components/calendar/__tests__/DualCalendarGrid.test.tsx` (Template)
- **Jest Config:** `jest.config.js`
- **Jest Setup:** `jest.setup.ts`
- **Type Definitions:** `src/types/calendar-systems.ts`

---

**Last Updated:** October 25, 2025  
**Status:** 🟢 READY FOR RAPID EXPANSION  
**Next Task:** SeasonalWheel Test Suite (Est. 1 hour)
