# Dual Calendar System - Developer Quick Reference

## Quick Start Guide

### 1. Basic Conversion

```typescript
import { ConversionService } from '@/services/ConversionService';

// Convert Gregorian → Natural13
const today = new Date();
const natural13 = ConversionService.toNatural13(today);
console.log(`${natural13.monthName}, Day ${natural13.day}`); // e.g., "Moon of Renewal, Day 15"

// Convert back to Gregorian
const gregorian = ConversionService.toGregorian(natural13);
```

### 2. Get Full Seasonal Context

```typescript
const context = ConversionService.getSeasonalContext(new Date());
console.log(context);
// Returns:
// {
//   natural13Date: { year, month, day, monthName, ... },
//   lunarPhase: { phase, illumination, age },
//   solarTerm: "Winter Solstice" | null,
//   season: "Winter Renewal"
// }
```

### 3. Get Lunar Phase

```typescript
const lunar = ConversionService.getLunarPhase(new Date());
console.log(`${lunar.phase} (${lunar.illumination}% illuminated)`);
// Example: "full (100% illuminated)"

// Lunar phases: 'new' | 'waxing_crescent' | 'first_quarter' | 
//               'waxing_gibbous' | 'full' | 'waning_gibbous' | 
//               'last_quarter' | 'waning_crescent'
```

### 4. Batch Conversions

```typescript
const dates = [new Date(2024, 11, 21), new Date(2024, 11, 22), new Date(2024, 11, 23)];
const natural13Dates = ConversionService.batchToNatural13(dates);
const lunarPhases = ConversionService.batchGetLunarPhases(dates);
```

### 5. Date Range with Metadata

```typescript
const startDate = new Date(2024, 11, 1);
const endDate = new Date(2024, 11, 31);

const range = ConversionService.getDateRange(startDate, endDate, true);
// Returns array of: { date, lunar, solar }
```

---

## Calendar System Service

### Database Initialization (Call Once at Startup)

```typescript
import { CalendarSystemService } from '@/services/CalendarSystemService';

// In your app initialization (e.g., _app.tsx)
await CalendarSystemService.initialize();
// This creates:
// - Natural 13-Month calendar system
// - 4 seasonal markers (solstices/equinoxes)
```

### Get All Calendar Systems

```typescript
const systems = await CalendarSystemService.getCalendarSystems();
// Returns: CalendarSystem[]
```

### Create Calendar Overlay for Event

```typescript
const overlay = await CalendarSystemService.setEventOverlay({
  eventId: 'event-123',
  calendarSystemId: 'natural13-id',
  convertedDate: {
    year: 2024,
    month: 1,
    day: 15,
    monthName: 'Moon of Renewal'
  },
  lunarPhase: {
    phase: 'full',
    illumination: 100,
    age: 15
  }
});
```

### Get Event Overlays

```typescript
const overlays = await CalendarSystemService.getEventOverlays('event-123');
// Returns all calendar systems for this event
```

### Get Seasonal Markers

```typescript
const markers = await CalendarSystemService.getSeasonalMarkers('natural13-id');
// Returns: SeasonalMarker[] - the 4 astronomical markers
```

---

## Data Types Reference

### Natural13Date
```typescript
interface Natural13Date {
  year: number;
  month: number;           // 1-13
  day: number;             // 1-28
  dayOfWeek?: number;      // 1-7
  weekOfMonth?: number;    // 1-4
  specialDay?: string;     // 'Year Day' | 'Leap Day'
  monthName: string;
  seasonalPosition?: string;
}
```

### LunarPhase
```typescript
interface LunarPhase {
  phase: LunarPhaseName;   // 8 phase types
  illumination: number;    // 0-100
  age: number;             // 0-29.53 days
}
```

### SeasonalMarker
```typescript
interface SeasonalMarker {
  id: string;
  calendarSystemId: string;
  name: string;
  localizedNames: Record<string, string>;
  type: 'lunar' | 'solar' | 'biological' | 'cultural' | 'agricultural';
  timing: {
    fixedDate?: { month: number; day: number };
    astronomicalEvent?: 'solstice' | 'equinox' | 'cross_quarter';
    lunarPhase?: LunarPhaseName;
  };
  culturalSignificance: {
    origin: string[];
    description: string;
    traditionalActivities: string[];
    biologicalAlignment: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 13 Seasonal Months

```
1.  Moon of Renewal         (Dec 22 - Jan 18)  [Winter]
2.  Moon of Deep Cold       (Jan 19 - Feb 15)  [Winter]
3.  Moon of Awakening       (Feb 16 - Mar 15)  [Spring]
4.  Moon of Returning Life  (Mar 16 - Apr 12)  [Spring]
5.  Moon of First Flowers   (Apr 13 - May 10)  [Spring]
6.  Moon of First Rains     (May 11 - Jun 7)   [Summer]
7.  Moon of Long Days       (Jun 8  - Jul 5)   [Summer]
8.  Moon of Ripening        (Jul 6  - Aug 2)   [Summer]
9.  Moon of Gathering       (Aug 3  - Aug 30)  [Fall]
10. Moon of Corn            (Aug 31 - Sep 27)  [Fall]
11. Moon of Long Shadows    (Sep 28 - Oct 25)  [Fall]
12. Moon of Falling Leaves  (Oct 26 - Nov 22)  [Fall]
13. Moon of Long Nights     (Nov 23 - Dec 20)  [Winter]

Year Day: December 21 (Winter Solstice - Intercalary)
Leap Day: After Month 6 (in leap years only)
```

---

## Special Dates

### Year Day
- **When:** December 21 each year
- **Natural13 Date:** `{ month: 0, day: 1, specialDay: 'Year Day' }`
- **Significance:** Winter Solstice, New Year, Renewal

### Leap Day
- **When:** After Month 6 (between Jun 7 and Jun 8 Gregorian) in leap years
- **Natural13 Date:** `{ month: 6, day: 29, specialDay: 'Leap Day' }`
- **Significance:** Calendar balance in leap years

---

## Useful Patterns

### Display a Date
```typescript
const date = new Date(2024, 11, 25); // Dec 25, 2024
const n13 = ConversionService.toNatural13(date);
console.log(`${n13.monthName} ${n13.day}, ${n13.year} (Week ${n13.weekOfMonth})`);
// Output: "Moon of Long Nights 5, 2024 (Week 2)"
```

### Check if Date is Solar Term
```typescript
const solar = ConversionService.getSolarTerm(context.natural13Date);
if (solar) {
  console.log(`This is a solar term: ${solar}`);
}
```

### Verify Round-Trip Conversion
```typescript
const result = ConversionService.verifyRoundTrip(new Date());
if (result.success) {
  console.log('✅ Conversion perfect');
} else {
  console.log(`⚠️ ${result.daysDifference} day difference`);
}
```

### Get Lunar Phase Percentage
```typescript
const lunar = ConversionService.getLunarPhase(new Date());
if (lunar.illumination > 75) {
  console.log('🌕 Moon is mostly full');
} else if (lunar.illumination > 25) {
  console.log('🌓 Moon is visible');
} else {
  console.log('🌑 Moon is mostly dark');
}
```

---

## Firestore Collections Structure

### calendarSystems
```firestore
calendarSystems/
├── natural13-id/
│   ├── name: "Natural 13-Month"
│   ├── displayName: "Natural 13-Month Calendar"
│   ├── type: "seasonal"
│   ├── config: { ... }
│   ├── isActive: true
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

### calendarOverlays
```firestore
calendarOverlays/
├── overlay-id/
│   ├── eventId: "event-123"
│   ├── calendarSystemId: "natural13-id"
│   ├── convertedDate: { year, month, day, monthName }
│   ├── lunarPhase: { phase, illumination, age }
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

### seasonalMarkers
```firestore
seasonalMarkers/
├── marker-id-1/ → Winter Solstice
├── marker-id-2/ → Spring Equinox
├── marker-id-3/ → Summer Solstice
└── marker-id-4/ → Autumn Equinox
    ├── name: "Winter Solstice (Year Day)"
    ├── calendarSystemId: "natural13-id"
    ├── timing: { astronomicalEvent: "solstice", fixedDate: {...} }
    ├── culturalSignificance: { origin, description, activities, alignment }
    └── isActive: true
```

---

## Performance Tips

### Use Caching
```typescript
// Conversions are automatically cached (500 entry limit)
// For the same date, the second call is instant
const date = new Date(2024, 11, 25);
const n13_1 = ConversionService.toNatural13(date); // ~0.1ms
const n13_2 = ConversionService.toNatural13(date); // ~0.01ms (cached!)
```

### Clear Cache if Needed
```typescript
ConversionService.clearCache(); // Useful for memory-critical apps
```

### Batch Operations
```typescript
// More efficient than individual conversions
const dates = Array.from({ length: 100 }, (_, i) => 
  new Date(2024, 11, i + 1)
);
const results = ConversionService.batchToNatural13(dates);
```

---

## Common Errors & Solutions

### Error: Date converting to wrong year
**Solution:** Check if date is before Dec 21. Natural13 year boundaries are on winter solstice.

### Error: Invalid Natural13Date
**Solution:** Use `ConversionService.validateAndConvert()` to check before using.

### Error: Firestore document not found
**Solution:** Call `CalendarSystemService.initialize()` first to seed data.

---

## Testing

```typescript
import { ConversionService } from '@/services/ConversionService';

describe('Calendar Integration', () => {
  it('should convert dates correctly', () => {
    const date = new Date(2024, 11, 22); // Dec 22 = Month 1, Day 1
    const n13 = ConversionService.toNatural13(date);
    expect(n13.month).toBe(1);
    expect(n13.day).toBe(1);
    expect(n13.monthName).toContain('Renewal');
  });

  it('should maintain round-trip accuracy', () => {
    const original = new Date(2025, 5, 15);
    const result = ConversionService.verifyRoundTrip(original);
    expect(result.success).toBe(true);
  });
});
```

---

**For more details, see:**
- `PHASE_1_FOUNDATION_COMPLETE.md` - Full implementation details
- `src/types/calendar-systems.ts` - Type definitions
- `src/utils/calendar-conversion.ts` - Core conversion logic
- `src/services/CalendarSystemService.ts` - Database operations
- `src/services/ConversionService.ts` - Conversion wrapper
