# 🚀 Phase 2 UI Development - Implementation Starter Kit

**Ready to build:** October 25, 2025  
**Phase:** 2 - User Interface Components  
**Estimated Duration:** 1-2 weeks  
**Skill Level:** Intermediate React + TypeScript  

---

## Pre-Phase 2 Checklist

Before starting Phase 2, ensure these Phase 1 items are deployed:

- [ ] `firestore.rules` updated with calendar collections
- [ ] `src/services/CalendarSystemService.ts` deployed
- [ ] `src/services/ConversionService.ts` deployed
- [ ] `src/hooks/useCalendarSystemInit.ts` deployed
- [ ] `src/hooks/useConversionService.ts` deployed
- [ ] `src/providers/CalendarSystemProvider.tsx` deployed
- [ ] Firestore emulator tested locally
- [ ] All 73 tests passing in CI/CD

---

## Getting Started with Phase 2

### 1. App Setup (if not already done)

```tsx
// app.tsx or layout.tsx (root level)
'use client';

import { CalendarSystemProvider } from '@/providers/CalendarSystemProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CalendarSystemProvider>
          {children}
        </CalendarSystemProvider>
      </body>
    </html>
  );
}
```

### 2. Create Your First Component

```tsx
// components/calendar/DualCalendarView.tsx
'use client';

import { useCalendarSystem } from '@/providers/CalendarSystemProvider';
import { useNatural13Conversion } from '@/hooks/useConversionService';

export function DualCalendarView() {
  const { activeSystem, isLoading } = useCalendarSystem();
  const today = new Date();
  const natural13 = useNatural13Conversion(today);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1>{activeSystem?.displayName}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2>Gregorian</h2>
          <p>{today.toLocaleDateString()}</p>
        </div>
        <div>
          <h2>Natural 13-Month</h2>
          <p>{natural13.monthName}, Day {natural13.day}</p>
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 2 Component Roadmap

### Component 1: Calendar Grid (2-3 days)

**Purpose:** Display a month view with both calendar systems

**File:** `src/components/calendar/CalendarGrid.tsx`

**Features:**
```tsx
interface CalendarGridProps {
  date: Date;
  showLunar?: boolean;
  onDateSelect?: (date: Date) => void;
}

// Should display:
// - Week layout (7 columns)
// - Gregorian dates (top)
// - Natural13 dates (bottom)
// - Lunar phase icons
// - Visual distinction for seasonal markers
// - Click handler for date selection
```

**Start with:**
```tsx
'use client';

import { useNatural13Conversion, useBatchConversion } from '@/hooks/useConversionService';

export function CalendarGrid({ date, showLunar = true }: CalendarGridProps) {
  // 1. Generate 42 days (6 weeks × 7 days)
  const monthDates = generateMonthDates(date);
  
  // 2. Batch convert all dates (efficient!)
  const natural13Dates = useBatchConversion(monthDates);
  
  // 3. Render grid
  return (
    <div className="grid grid-cols-7 gap-1">
      {monthDates.map((gregorianDate, i) => {
        const natural13 = natural13Dates[i];
        return (
          <DateCell
            key={i}
            gregorian={gregorianDate}
            natural13={natural13}
            showLunar={showLunar}
          />
        );
      })}
    </div>
  );
}
```

**Dependencies:** Already available!
- `useBatchConversion()` hook
- `useNatural13Conversion()` hook
- `useLunarPhase()` hook

---

### Component 2: Seasonal Wheel (1-2 days)

**Purpose:** Circular visualization of the 13 seasons

**File:** `src/components/calendar/SeasonalWheel.tsx`

**Features:**
```tsx
interface SeasonalWheelProps {
  highlightMonth?: number; // 1-13
  showMarkers?: boolean;   // Show solstices/equinoxes
  size?: 'sm' | 'md' | 'lg';
}

// Should display:
// - 13 segments (one per month)
// - Month names around circle
// - Color coding by season phase
// - Highlight current month
// - Overlay for 4 astronomical markers
// - Rotation animation
```

**Data you have:**
- `NATURAL13_MONTH_NAMES` - All 13 month names
- `seasonalMarkers` - From context (4 markers)
- Current date conversion

**Start with:**
```tsx
export function SeasonalWheel({ highlightMonth, showMarkers = true }: SeasonalWheelProps) {
  const { seasonalMarkers } = useCalendarSystem();
  const natural13 = useNatural13Conversion(new Date());

  // Calculate angle per month: 360 / 13 = ~27.69 degrees
  const monthAngle = 360 / 13;

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      {/* Draw circle segments for each month */}
      {NATURAL13_MONTH_NAMES.map((name, i) => {
        const angle = (i * monthAngle) - 90; // Start at top
        return (
          <MonthSegment
            key={i}
            month={i + 1}
            name={name}
            angle={angle}
            isHighlighted={i + 1 === highlightMonth}
          />
        );
      })}

      {/* Draw marker lines */}
      {showMarkers && seasonalMarkers.map(marker => (
        <SolarTermMarker key={marker.id} marker={marker} />
      ))}
    </svg>
  );
}
```

**Libraries to consider:**
- `react-svg` for SVG rendering
- `d3-shape` for arc calculations (already mentioned in Phase 1)
- `framer-motion` for animation (already in project!)

---

### Component 3: Lunar Phase Display (1 day)

**Purpose:** Show current and upcoming lunar phases

**File:** `src/components/calendar/LunarDisplay.tsx`

**Features:**
```tsx
interface LunarDisplayProps {
  date: Date;
  showNext?: number; // Show next N days of phases
}

// Should display:
// - Current moon phase emoji/icon
// - Illumination percentage
// - Age in days
// - Next N days' phases (optional)
```

**Start with:**
```tsx
'use client';

import { useLunarPhase, useBatchLunarPhases } from '@/hooks/useConversionService';

const MOON_EMOJIS = {
  new: '🌑',
  waxing_crescent: '🌒',
  first_quarter: '🌓',
  waxing_gibbous: '🌔',
  full: '🌕',
  waning_gibbous: '🌖',
  last_quarter: '🌗',
  waning_crescent: '🌘',
};

export function LunarDisplay({ date, showNext = 0 }: LunarDisplayProps) {
  const lunar = useLunarPhase(date);
  
  let upcomingPhases: any[] = [];
  if (showNext > 0) {
    const nextDates = Array.from({ length: showNext }, (_, i) => {
      const d = new Date(date);
      d.setDate(d.getDate() + i + 1);
      return d;
    });
    upcomingPhases = useBatchLunarPhases(nextDates);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <div className="text-6xl">{MOON_EMOJIS[lunar.phase]}</div>
        <p className="text-lg capitalize">{lunar.phase.replace('_', ' ')}</p>
        <p className="text-sm text-gray-600">{lunar.illumination}% illuminated</p>
        <p className="text-xs text-gray-500">Age: {lunar.age.toFixed(1)} days</p>
      </div>

      {upcomingPhases.length > 0 && (
        <div className="flex gap-2">
          {upcomingPhases.map((phase, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl">{MOON_EMOJIS[phase.phase]}</div>
              <p className="text-xs">+{i + 1}d</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### Component 4: Date Selector (1-2 days)

**Purpose:** Interactive date picker for both calendar systems

**File:** `src/components/calendar/DateSelector.tsx`

**Features:**
```tsx
interface DateSelectorProps {
  onDateSelect: (gregorian: Date, natural13: Natural13Date) => void;
  initialDate?: Date;
}

// Should allow:
// - Click on calendar dates
// - Type in Gregorian date
// - Type in Natural13 date (month + day)
// - Navigate between months
// - Show conversion in real-time
```

**Libraries to consider:**
- Use existing React `<input type="date" />` for Gregorian
- Custom form for Natural13 input

---

### Component 5: Event Overlay Manager (2-3 days)

**Purpose:** Manage event calendar system mappings

**File:** `src/components/calendar/EventOverlayManager.tsx`

**Features:**
```tsx
interface EventOverlayManagerProps {
  eventId: string;
  onSave?: (overlay: CalendarOverlay) => void;
}

// Should:
// - Show event date in Gregorian
// - Convert to Natural13
// - Display lunar phase
// - Allow system selection
// - Save overlay to Firestore
// - Show existing overlays
```

**Start with:**
```tsx
'use client';

import { useCalendarSystem } from '@/providers/CalendarSystemProvider';
import { useSeasonalContext } from '@/hooks/useConversionService';
import { CalendarSystemService } from '@/services/CalendarSystemService';

export function EventOverlayManager({ eventId }: EventOverlayManagerProps) {
  const { calendarSystems } = useCalendarSystem();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const context = useSeasonalContext(selectedDate);

  const handleSaveOverlay = async (systemId: string) => {
    await CalendarSystemService.setEventOverlay({
      eventId,
      calendarSystemId: systemId,
      convertedDate: {
        year: context.natural13Date.year,
        month: context.natural13Date.month,
        day: context.natural13Date.day,
        monthName: context.natural13Date.monthName
      },
      lunarPhase: context.lunarPhase,
      solarTerm: context.solarTerm
    });
  };

  return (
    <div>
      <input
        type="date"
        value={selectedDate.toISOString().split('T')[0]}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      />

      <div>
        <h3>{context.natural13Date.monthName}, Day {context.natural13Date.day}</h3>
        <p>🌙 {context.lunarPhase.phase}</p>
        {context.solarTerm && <p>⭐ {context.solarTerm}</p>}
      </div>

      <div>
        {calendarSystems.map(system => (
          <button
            key={system.id}
            onClick={() => handleSaveOverlay(system.id)}
          >
            Add to {system.displayName}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## Styling Approach

### Recommendation: Tailwind CSS (already in project)

**Color Scheme Suggestion:**
```tsx
const SEASON_COLORS = {
  'Winter Renewal': 'from-blue-600 to-cyan-400',      // Cool blues
  'Spring Awakening': 'from-green-600 to-emerald-400', // Fresh greens
  'Summer Abundance': 'from-yellow-500 to-orange-400',  // Warm yellows
  'Autumn Gratitude': 'from-amber-600 to-red-400',     // Warm reds
};

const MONTH_COLORS = {
  1: 'bg-blue-100',  // Moon of Renewal
  2: 'bg-cyan-100',  // Moon of Deep Cold
  3: 'bg-green-100', // Moon of Awakening
  // ... etc
};
```

---

## Testing Strategy for Phase 2

### Component Tests
```tsx
// components/__tests__/CalendarGrid.test.tsx
import { render, screen } from '@testing-library/react';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';

describe('CalendarGrid', () => {
  it('should display 42 days', () => {
    render(<CalendarGrid date={new Date()} />);
    const cells = screen.getAllByRole('button'); // or your cell element
    expect(cells).toHaveLength(42);
  });

  it('should convert dates correctly', () => {
    // Use mocked hooks to verify conversions
  });

  it('should handle lunar phase display', () => {
    // Verify moon emojis appear
  });
});
```

### Integration Tests
```tsx
// Test CalendarGrid within CalendarSystemProvider
import { render } from '@testing-library/react';
import { CalendarSystemProvider } from '@/providers/CalendarSystemProvider';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';

describe('CalendarGrid Integration', () => {
  it('should render within provider', () => {
    render(
      <CalendarSystemProvider>
        <CalendarGrid date={new Date()} />
      </CalendarSystemProvider>
    );
    // Verify rendering succeeds
  });
});
```

---

## Performance Considerations

### Optimization Strategies

1. **Memoization**
```tsx
import { memo } from 'react';

export const DateCell = memo(({ date, natural13 }: Props) => {
  return <div>{natural13.day}</div>;
}, (prev, next) => {
  // Custom comparison for memo
  return prev.date.getTime() === next.date.getTime();
});
```

2. **Batch Operations**
```tsx
// Use batch hooks instead of individual conversions
const monthDates = generateMonthDates(currentDate);
const natural13Dates = useBatchConversion(monthDates); // 1 memoized call
// Instead of:
// const conversions = monthDates.map(d => useNatural13Conversion(d)); // Bad!
```

3. **Virtualization for Large Calendars**
```tsx
import { FixedSizeList } from 'react-window';

// If showing many months, virtualize the list
<FixedSizeList
  height={600}
  itemCount={12}
  itemSize={400}
>
  {CalendarGridRow}
</FixedSizeList>
```

---

## Common Patterns

### Pattern 1: Date Range Display
```tsx
function DateRangeCalendar({ startDate, endDate }: Props) {
  const range = useDateRange(startDate, endDate, true);

  return (
    <div>
      {range.map((item, i) => (
        <div key={i}>
          <p>{item.date.monthName} {item.date.day}</p>
          <p>🌙 {item.lunar.phase}</p>
          {item.solar && <p>⭐ {item.solar}</p>}
        </div>
      ))}
    </div>
  );
}
```

### Pattern 2: System Switching
```tsx
function SystemSelector() {
  const { calendarSystems, setActiveSystem, activeSystem } = useCalendarSystem();

  return (
    <select value={activeSystem?.id} onChange={(e) => setActiveSystem(e.target.value)}>
      {calendarSystems.map(sys => (
        <option key={sys.id} value={sys.id}>{sys.displayName}</option>
      ))}
    </select>
  );
}
```

### Pattern 3: Seasonal Context Display
```tsx
function SeasonalInfo({ date }: Props) {
  const context = useSeasonalContext(date);

  return (
    <Card>
      <h3>{context.natural13Date.monthName}</h3>
      <p>Season: {context.season}</p>
      <p>Lunar: {context.lunarPhase.phase}</p>
      {context.solarTerm && <p>Solar Term: {context.solarTerm}</p>}
    </Card>
  );
}
```

---

## Deployment Checklist for Phase 2

- [ ] All Phase 1 code deployed and tested
- [ ] Components created and tested locally
- [ ] Storybook stories created (optional but recommended)
- [ ] Performance profiling done
- [ ] Accessibility audit (a11y) passed
- [ ] Mobile responsiveness tested
- [ ] Cross-browser testing done
- [ ] E2E tests written and passing
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Deployed to staging
- [ ] User testing done
- [ ] Deployed to production

---

## Resources

### Available Hooks (Phase 1)
- `useCalendarSystemInit()` - Initialization
- `useNatural13Conversion()` - Single conversion
- `useGregorianConversion()` - Reverse conversion
- `useLunarPhase()` - Lunar calculations
- `useSolarTerm()` - Solar term detection
- `useSeasonalContext()` - Complete context
- `useBatchConversion()` - Bulk conversions
- `useBatchGregorianConversion()` - Bulk reverse
- `useBatchLunarPhases()` - Bulk lunar
- `useDateRange()` - Range generation
- `useValidateNatural13()` - Validation
- `useClearConversionCache()` - Cache management

### Available Context
- `useCalendarSystem()` - Main context
- `useCalendarSystemReady()` - Ready check
- `useNatural13System()` - Get Natural13 system
- `useSeasonalMarkersForActiveSystem()` - Get markers
- `useCalendarSystemLoading()` - Loading state
- `useCalendarSystemError()` - Error state

### Available Services
- `CalendarSystemService` - CRUD + seeding
- `ConversionService` - Conversions + caching

---

## Next Steps

1. **Create feature branch:** `feature/phase-2-ui-components`
2. **Start with CalendarGrid:** Foundation for other components
3. **Build incrementally:** One component at a time
4. **Test as you go:** Unit + integration tests
5. **Get feedback:** Share progress with team
6. **Iterate:** Refine based on user feedback

---

## Questions? Debugging?

### Common Issues

**Q: Dates are off by one day**  
A: Check timezone handling. Natural13 year starts Dec 21, not Dec 22.

**Q: Lunar phase seems wrong**  
A: Verify date is in UTC. Use `new Date('2024-12-21T00:00:00Z')` for consistency.

**Q: Context provider not found**  
A: Ensure `CalendarSystemProvider` wraps your component tree in root layout.

**Q: Hooks not working**  
A: Only use hooks inside components, not at module level. Must be inside function component.

---

**Ready to build? Let's go! 🚀**

*Phase 2 Kickoff: Ready*  
*Foundation: Solid ✅*  
*Documentation: Complete ✅*  
*Support: Available ✅*  

Let's create something beautiful! 🎨
