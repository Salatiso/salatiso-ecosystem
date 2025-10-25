# 🌍 Dual Calendar System - Complete Specification

**Feature Name:** Natural Calendar Overlay System  
**Version:** 1.0  
**Date:** October 25, 2025  
**Status:** 📋 Specification Phase  
**Priority:** ⭐ High - Strategic Differentiator

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Core Objectives](#core-objectives)
3. [System Architecture](#system-architecture)
4. [Data Models](#data-models)
5. [Calendar Systems](#calendar-systems)
6. [Conversion Logic](#conversion-logic)
7. [User Interface](#user-interface)
8. [Integration Points](#integration-points)
9. [Implementation Phases](#implementation-phases)
10. [Testing Strategy](#testing-strategy)
11. [Future Extensions](#future-extensions)

---

## 🎯 Executive Summary

The **Dual Calendar System** adds a parallel **Natural/Indigenous 13-Month calendar** layer to the existing Gregorian calendar, allowing users to:

- **View events in both calendar systems** simultaneously
- **Track biological and seasonal cycles** aligned with nature
- **Honor indigenous time-keeping practices** (Khoisan, Bantu, Mayan, etc.)
- **Maintain full compatibility** with external Gregorian systems
- **Enable household stewardship** based on natural rhythms

### Key Differentiators:
✅ **First calendar app** to natively support indigenous time systems  
✅ **Biological cycle integration** (lunar phases, gestation, migration)  
✅ **Cultural preservation** tool for indigenous communities  
✅ **Mesh-network compatible** (works offline, sync later)  
✅ **Educational mode** explaining seasonal markers

---

## 🎯 Core Objectives

### Must Have (Phase 1)
1. ✅ **Preserve all existing calendar features** - no regressions
2. ✅ **13-Month Natural Calendar** implementation
3. ✅ **Dual view toggle** (Gregorian ↔ Natural)
4. ✅ **Automatic date conversion** between systems
5. ✅ **Lunar phase overlay** on both calendars
6. ✅ **Basic seasonal markers** (solstices, equinoxes)

### Should Have (Phase 2)
1. ⭐ **Overlay mode** - both calendars visible simultaneously
2. ⭐ **Indigenous seasonal markers** (configurable by region)
3. ⭐ **Biological cycle tracking** (menstrual, gestation, migration)
4. ⭐ **Cultural calendar plugins** (Mayan, Chinese, Islamic)
5. ⭐ **Seasonal wheel visualization** (circular indigenous design)

### Could Have (Phase 3)
1. 💡 **AI-suggested seasonal timing** for household tasks
2. 💡 **Multi-calendar comparison view** (3+ systems)
3. 💡 **Ancestral alignment** (birth moon phase, etc.)
4. 💡 **Educational tooltips** with cultural context
5. 💡 **Export to .ics** with both calendar dates

---

## 🏗️ System Architecture

### Architecture Principles
1. **Separation of Concerns**: Calendar systems are independent modules
2. **Single Source of Truth**: Canonical dates stored in UTC/Gregorian
3. **Derived Views**: All alternative calendars are computed overlays
4. **Backward Compatible**: Existing events work without modification
5. **Plugin Architecture**: New calendars can be added without core changes

### Component Hierarchy
```
CalendarContainer (existing)
├── CalendarSystemSelector (NEW)
│   ├── GregorianCalendar (default)
│   ├── Natural13Calendar (NEW)
│   └── CalendarPlugins[] (future)
├── CalendarOverlayEngine (NEW)
│   ├── DateConverter
│   ├── SeasonalMarkerEngine
│   └── LunarPhaseCalculator
├── CalendarGrid (enhanced)
├── EventForm (enhanced)
└── EventDetails (enhanced)
```

### Service Layer
```typescript
// New Services
CalendarSystemService - Manages calendar definitions
ConversionService - Handles date conversions
SeasonalMarkerService - Manages cultural/biological markers
LunarCalculationService - Astronomical calculations
OverlayRenderingService - Visual overlay logic

// Enhanced Services
EnhancedCalendarService (existing) - Extended with dual-calendar support
```

---

## 📊 Data Models

### 1. CalendarSystem (NEW)

```typescript
interface CalendarSystem {
  id: string; // 'gregorian', 'natural13', 'lunar', 'mayan', etc.
  name: string;
  displayName: string; // Localized
  type: 'solar' | 'lunar' | 'lunisolar' | 'seasonal';
  
  config: {
    daysPerYear: number;
    monthsPerYear: number;
    daysPerMonth: number | number[]; // Fixed or variable
    weekDaysPerMonth?: number;
    intercalationRules: IntercalationRule[];
    yearStartAlignment: 'solstice' | 'equinox' | 'lunar' | 'fixed';
  };
  
  culturalOrigin?: {
    regions: string[]; // ['Southern Africa', 'Khoisan', 'Bantu']
    description: string;
    references: string[]; // Academic sources
  };
  
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDefault: boolean;
}

interface IntercalationRule {
  type: 'leap_day' | 'leap_month' | 'intercalary_period';
  frequency: string; // e.g., "every 4 years"
  insertionPoint: string; // e.g., "after month 6"
  duration: number; // days
}
```

### 2. CalendarOverlay (NEW)

```typescript
interface CalendarOverlay {
  id: string;
  eventId: string; // Links to EnhancedCalendarEvent
  calendarSystemId: string;
  
  // Converted date in overlay system
  convertedDate: {
    year: number;
    month: number; // Or month name
    day: number;
    dayOfWeek?: number;
    seasonalPosition?: string; // "3rd day of Planting Moon"
  };
  
  // Astronomical data
  lunarPhase?: {
    phase: 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 
           'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';
    illumination: number; // 0-100%
    age: number; // Days since new moon
  };
  
  // Seasonal alignment
  seasonalMarkers?: string[]; // IDs of relevant markers
  solarTerm?: string; // For East Asian calendars
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. SeasonalMarker (NEW)

```typescript
interface SeasonalMarker {
  id: string;
  calendarSystemId: string;
  
  name: string; // "Green Corn Moon"
  localizedNames: Record<string, string>; // Multi-language
  
  type: 'lunar' | 'solar' | 'biological' | 'cultural' | 'agricultural';
  
  // Timing
  timing: {
    fixedDate?: { month: number; day: number }; // For solar markers
    lunarPhase?: string; // For lunar markers
    astronomicalEvent?: 'solstice' | 'equinox' | 'cross_quarter';
    ecologicalTrigger?: string; // "First frost", "Flowering of Marula"
  };
  
  // Cultural context
  culturalSignificance: {
    origin: string[]; // ['Khoisan', 'San']
    description: string;
    traditionalActivities: string[];
    biologicalAlignment: string[]; // ['Gestation peak', 'Migration']
  };
  
  // Visual representation
  icon?: string;
  color?: string;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Enhanced Event Model (UPDATED)

```typescript
// Extension to existing EnhancedCalendarEvent
interface EnhancedCalendarEvent {
  // ... existing fields ...
  
  // NEW: Calendar overlay data
  calendarOverlays?: CalendarOverlay[];
  primaryCalendarSystem?: string; // Default: 'gregorian'
  seasonalContext?: {
    markers: string[]; // Relevant seasonal markers
    lunarPhase: string;
    biologicalCycle?: string;
  };
  
  // NEW: Display preferences
  displayInCalendars?: string[]; // Which calendars to show event in
}
```

---

## 📅 Calendar Systems

### 1. Gregorian Calendar (Existing - Default)

**Configuration:**
- 365 days/year (366 in leap years)
- 12 months (28-31 days each)
- 7-day week
- Leap year: Every 4 years (except century years not divisible by 400)

**Role:** Canonical storage format for interoperability

---

### 2. Natural 13-Month Calendar (NEW - Primary Addition)

**Configuration:**
```typescript
{
  id: 'natural13',
  name: 'Natural 13-Month Calendar',
  type: 'solar',
  config: {
    daysPerYear: 365, // 366 in leap years
    monthsPerYear: 13,
    daysPerMonth: 28, // All months have 28 days
    weekDaysPerMonth: 4, // 4 perfect weeks per month
    intercalationRules: [
      {
        type: 'leap_day',
        frequency: 'every 4 years',
        insertionPoint: 'after month 6',
        duration: 1
      },
      {
        type: 'intercalary_period',
        frequency: 'every year',
        insertionPoint: 'end of year',
        duration: 1 // "Year Day" - outside month structure
      }
    ],
    yearStartAlignment: 'solstice' // Winter solstice (Dec 21/22)
  }
}
```

**Month Names (Seasonal):**
1. **Moon of Renewal** (Dec 22 - Jan 18)
2. **Moon of Deep Cold** (Jan 19 - Feb 15)
3. **Moon of Awakening** (Feb 16 - Mar 15)
4. **Moon of First Growth** (Mar 16 - Apr 12)
5. **Moon of Planting** (Apr 13 - May 10)
6. **Moon of First Rains** (May 11 - Jun 7)
7. **Moon of Long Days** (Jun 8 - Jul 5) - *Leap Day here if leap year*
8. **Moon of First Harvest** (Jul 6 - Aug 2)
9. **Moon of Ripening** (Aug 3 - Aug 30)
10. **Moon of Gathering** (Aug 31 - Sep 27)
11. **Moon of Falling Leaves** (Sep 28 - Oct 25)
12. **Moon of First Frost** (Oct 26 - Nov 22)
13. **Moon of Long Nights** (Nov 23 - Dec 20)
14. **Year Day** (Dec 21) - Intercalary day, outside months

**Advantages:**
- ✅ Every month has exactly 28 days (4 perfect weeks)
- ✅ Every month starts on the same day of the week
- ✅ Predictable: Date 15 is always mid-month
- ✅ Aligned with lunar cycles (28 days ≈ 1 moon cycle)
- ✅ 13 = sacred number in many indigenous cultures

---

### 3. Lunar Phase Overlay (NEW)

**Purpose:** Show moon phases on any calendar view

**Calculation:** Astronomical (not calendar-based)
- New Moon
- Waxing Crescent
- First Quarter
- Waxing Gibbous
- Full Moon
- Waning Gibbous
- Last Quarter
- Waning Crescent

**Use Cases:**
- Traditional ceremonies timed to full/new moons
- Agricultural planning (planting by moon phase)
- Biological cycle tracking (menstruation, gestation)
- Fishing/hunting traditions

---

### 4. Seasonal Marker System (NEW)

**Solar Terms (8 primary points):**
1. Winter Solstice (Dec 21/22)
2. Imbolc / Cross-Quarter (Feb 2-4)
3. Spring Equinox (Mar 20/21)
4. Beltane / Cross-Quarter (May 1-5)
5. Summer Solstice (Jun 20/21)
6. Lughnasadh / Cross-Quarter (Aug 1-7)
7. Autumn Equinox (Sep 22/23)
8. Samhain / Cross-Quarter (Oct 31 - Nov 7)

**Indigenous Markers (Examples - Configurable):**

**Khoisan/San Markers:**
- **Moon of the Gemsbok Migration** (May-Jun)
- **Moon of the !Nara Melon Harvest** (Mar-Apr)
- **Moon of the First Thunders** (Oct-Nov)

**Bantu/Southern African Markers:**
- **Moon of the Marula Flowering** (Nov-Dec)
- **Moon of the Cattle Breeding** (Sep-Oct)
- **Moon of the Initiation** (Jun-Jul)

**Biological Cycles:**
- **Gestation Months** (9 lunar cycles)
- **Menstrual Synchronization** (28-day alignment)
- **Animal Migration Periods**
- **Plant Flowering/Fruiting Seasons**

---

## ⚙️ Conversion Logic

### Gregorian → Natural 13-Month

```typescript
function convertGregorianToNatural13(gregorianDate: Date): Natural13Date {
  // 1. Find year start (winter solstice of previous year)
  const yearStart = getWinterSolstice(gregorianDate.getFullYear() - 1);
  
  // 2. Calculate days since year start
  const daysSinceStart = daysBetween(yearStart, gregorianDate);
  
  // 3. Account for leap year
  const isLeapYear = isGregorianLeapYear(gregorianDate.getFullYear());
  
  // 4. Handle Year Day (day 365, or 366 in leap year)
  if (daysSinceStart === 365 || (isLeapYear && daysSinceStart === 366)) {
    return {
      year: gregorianDate.getFullYear(),
      month: 0, // Year Day is outside month structure
      day: 1,
      specialDay: 'Year Day',
      monthName: 'Year Day'
    };
  }
  
  // 5. Handle Leap Day (after month 6 in leap years)
  if (isLeapYear && daysSinceStart > 196) {
    // Adjust for leap day insertion
    daysSinceStart -= 1;
  }
  
  // 6. Calculate month and day
  const month = Math.floor(daysSinceStart / 28) + 1;
  const day = (daysSinceStart % 28) + 1;
  
  return {
    year: gregorianDate.getFullYear(),
    month: Math.min(month, 13),
    day: day,
    monthName: getMonthName(month),
    weekOfMonth: Math.floor((day - 1) / 7) + 1,
    dayOfWeek: ((day - 1) % 7) + 1
  };
}
```

### Natural 13-Month → Gregorian

```typescript
function convertNatural13ToGregorian(natural13Date: Natural13Date): Date {
  // 1. Find year start (winter solstice)
  const yearStart = getWinterSolstice(natural13Date.year - 1);
  
  // 2. Handle Year Day
  if (natural13Date.month === 0) {
    return new Date(yearStart.getTime() + (365 * 24 * 60 * 60 * 1000));
  }
  
  // 3. Calculate days from year start
  let daysFromStart = (natural13Date.month - 1) * 28 + natural13Date.day;
  
  // 4. Adjust for leap day if applicable
  const isLeapYear = isGregorianLeapYear(natural13Date.year);
  if (isLeapYear && natural13Date.month > 6) {
    daysFromStart += 1;
  }
  
  // 5. Return Gregorian date
  return new Date(yearStart.getTime() + (daysFromStart * 24 * 60 * 60 * 1000));
}
```

### Lunar Phase Calculation

```typescript
function calculateLunarPhase(date: Date): LunarPhase {
  // Using astronomical algorithms
  const JD = getJulianDate(date);
  const daysSinceNewMoon = (JD - 2451550.1) % 29.53058867; // Synodic month
  
  const age = daysSinceNewMoon;
  const illumination = 50 * (1 - Math.cos(2 * Math.PI * age / 29.53058867));
  
  let phase: string;
  if (age < 1.84566) phase = 'new';
  else if (age < 5.53699) phase = 'waxing_crescent';
  else if (age < 9.22831) phase = 'first_quarter';
  else if (age < 12.91963) phase = 'waxing_gibbous';
  else if (age < 16.61096) phase = 'full';
  else if (age < 20.30228) phase = 'waning_gibbous';
  else if (age < 23.99361) phase = 'last_quarter';
  else if (age < 27.68493) phase = 'waning_crescent';
  else phase = 'new';
  
  return { phase, illumination, age };
}
```

---

## 🖥️ User Interface

### 1. Calendar System Selector

**Location:** Top of calendar view  
**Design:** Toggle/dropdown

```tsx
<CalendarSystemSelector>
  <option value="gregorian">📅 Gregorian Calendar</option>
  <option value="natural13">🌙 Natural 13-Month</option>
  <option value="overlay">🔄 Dual View</option>
</CalendarSystemSelector>
```

**Behavior:**
- Instant switching (no page reload)
- Persists user preference
- Shows current date in both systems

---

### 2. Dual View / Overlay Mode

**Layout Options:**

**Option A: Side-by-Side**
```
┌─────────────────┬─────────────────┐
│  Gregorian      │  Natural 13     │
│  October 2025   │  Moon of        │
│                 │  Gathering      │
│  [Calendar]     │  [Calendar]     │
│                 │                 │
│  Events appear  │  Same events,   │
│  in both views  │  converted      │
└─────────────────┴─────────────────┘
```

**Option B: Overlay (Preferred)**
```
┌───────────────────────────────────┐
│  Primary: Natural 13-Month        │
│  Moon of Gathering (Oct 2025)     │
│                                   │
│  [Calendar Grid]                  │
│  - Each cell shows both dates     │
│  - Lunar phase icons              │
│  - Seasonal markers highlighted   │
│                                   │
│  Toggle: [🌙 Natural] [📅 Greg]  │
└───────────────────────────────────┘
```

**Cell Design (Overlay Mode):**
```
┌──────────────┐
│ 25 Oct       │ ← Gregorian (small, gray)
│ 28 Gathering │ ← Natural (large, primary)
│ 🌗 Last Qtr  │ ← Lunar phase
│ • Meeting    │ ← Events
│ • Harvest    │
└──────────────┘
```

---

### 3. Event Creation in Dual Mode

**Enhanced Event Form:**

```tsx
<EventForm>
  <CalendarSystemSelector>
    <label>Create event for:</label>
    <select>
      <option>Gregorian Calendar</option>
      <option>Natural 13-Month Calendar</option>
      <option>Both (recommended)</option>
    </select>
  </CalendarSystemSelector>
  
  <DateInput>
    {/* Shows date in both formats */}
    <input type="date" value="2025-10-25" />
    <span className="conversion">
      ≈ Moon of Gathering, Day 28
    </span>
  </DateInput>
  
  <SeasonalMarkerSelector>
    <label>Align with seasonal marker:</label>
    <select optional>
      <option>-- None --</option>
      <option>🍂 Autumn Equinox</option>
      <option>🌾 Harvest Season</option>
      <option>🌙 Full Moon</option>
    </select>
  </SeasonalMarkerSelector>
  
  {/* Rest of form unchanged */}
</EventForm>
```

---

### 4. Seasonal Wheel Visualization

**Circular Indigenous Design:**

```
        Winter Solstice
              🌑
               |
    🍂 -------|------- 🌸
  Autumn      |     Spring
  Equinox     •     Equinox
              |
    🌞 -------|------- ☀️
  Summer      |
  Solstice    |
              |
         Current Date
```

**Interactive Features:**
- Click segment to jump to that season
- Hover to see seasonal markers
- Shows current position on wheel
- Displays upcoming cultural events

---

### 5. Visual Design System

**Color Coding:**
- 🔵 **Blue** = Gregorian dates
- 🟢 **Green** = Natural 13-Month dates
- 🟡 **Gold** = Seasonal markers
- 🌙 **Silver** = Lunar phases
- 🟣 **Purple** = Cultural/indigenous markers

**Icons:**
- 📅 Gregorian calendar
- 🌙 Natural/lunar calendar
- 🌒🌓🌔🌕🌖🌗🌘🌑 Lunar phases
- 🌸🌞🍂❄️ Seasonal markers
- ⚡ Astronomical events

---

## 🔗 Integration Points

### 1. Contacts & Family Timeline

**Birthday Display:**
```
John Doe
Born: October 25, 1985 (Gregorian)
      Moon of Gathering, Day 28, 1985 (Natural)
      🌗 Last Quarter Moon
Ancestral Note: Born under Waning Moon (introspective energy)
```

**Rites of Passage:**
- Coming of age aligned with seasonal cycles
- Initiations during traditional moons
- Ancestral remembrance on lunar anniversaries

---

### 2. Assets & Maintenance

**Seasonal Maintenance Cycles:**
```
Asset: Community Garden
Next Maintenance: "After First Frost" 
                  ≈ Moon of First Frost, Days 15-20
                  ≈ November 10-15 (Gregorian)
```

**Agricultural Timing:**
- Planting by moon phase
- Harvesting during optimal solar terms
- Equipment servicing during "resting" seasons

---

### 3. Incidents & Safety

**Incident Patterns:**
```
Analysis: Snake bites increase during "Moon of First Rains"
Recommendation: Extra caution during May-June
Historical Data: 80% of incidents occur in waxing moon phase
```

---

### 4. Dashboard Widget

**Dual Calendar Widget:**
```
┌────────────────────────────────┐
│ 📅 Today                       │
│ Oct 25, 2025 (Gregorian)       │
│ Moon of Gathering, Day 28      │
│                                │
│ 🌗 Last Quarter (73% waning)  │
│                                │
│ 🍂 Season: Late Autumn         │
│ Next Marker: Samhain (6 days)  │
│                                │
│ 📆 Upcoming:                   │
│ • Oct 31 - Samhain            │
│ • Nov 1 - Year Day            │
│ • Nov 15 - New Moon           │
└────────────────────────────────┘
```

---

### 5. Alerts & Notifications

**Seasonal Alerts:**
```
🌙 Natural Calendar Alert
Title: Planting Moon begins tomorrow
Description: Traditional time for sowing root vegetables
Timing: April 13 (Gregorian) = Moon of Planting, Day 1
Action: Review planting schedule in Assets
```

**Lunar Phase Reminders:**
```
🌕 Full Moon Reminder
The full moon rises tonight - traditional gathering time
Best viewing: 8:43 PM
Cultural Note: "Hunter's Moon" in many traditions
```

---

## 📝 Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
**Goal:** Core infrastructure without UI

**Tasks:**
1. ✅ Create `CalendarSystem` data model
2. ✅ Create `CalendarOverlay` data model
3. ✅ Create `SeasonalMarker` data model
4. ✅ Implement `Natural13Calendar` definition
5. ✅ Build conversion functions (Gregorian ↔ Natural13)
6. ✅ Implement lunar phase calculations
7. ✅ Create `CalendarSystemService`
8. ✅ Create `ConversionService`
9. ✅ Write unit tests for conversions
10. ✅ Add Firestore collections and rules

**Deliverables:**
- Working conversion logic (tested)
- Data models in Firestore
- Service layer ready
- No UI changes yet

---

### Phase 2: Basic UI Integration (Weeks 3-4)
**Goal:** Simple calendar switching

**Tasks:**
1. ✅ Add `CalendarSystemSelector` component
2. ✅ Enhance `CalendarGrid` to show Natural13 view
3. ✅ Update `EventForm` with date conversion display
4. ✅ Add lunar phase icons to calendar cells
5. ✅ Implement user preference persistence
6. ✅ Add basic seasonal marker display
7. ✅ Update dashboard widget
8. ✅ Write integration tests
9. ✅ Update user documentation

**Deliverables:**
- Users can switch between calendars
- Events display in both systems
- Lunar phases visible
- Basic seasonal markers shown

---

### Phase 3: Overlay & Advanced Features (Weeks 5-6)
**Goal:** Dual view and seasonal markers

**Tasks:**
1. ✅ Build overlay mode (side-by-side or combined)
2. ✅ Implement seasonal wheel visualization
3. ✅ Add `SeasonalMarkerSelector` to event form
4. ✅ Create seasonal marker management UI (admin)
5. ✅ Implement cultural marker database
6. ✅ Add biological cycle tracking options
7. ✅ Enhance alerts with seasonal timing
8. ✅ Add ancestral alignment features
9. ✅ Performance optimization for dual rendering
10. ✅ Comprehensive testing

**Deliverables:**
- Full overlay mode working
- Seasonal markers selectable
- Cultural context available
- Performance optimized

---

### Phase 4: Cultural Plugins & Education (Weeks 7-8)
**Goal:** Extensibility and education

**Tasks:**
1. ✅ Build plugin architecture for new calendars
2. ✅ Create sample plugins (Mayan, Chinese, Islamic)
3. ✅ Add educational tooltips
4. ✅ Create cultural context database
5. ✅ Implement multi-language support for markers
6. ✅ Add academic references/sources
7. ✅ Build calendar comparison tool
8. ✅ Create user guide and tutorials
9. ✅ Final testing and refinement
10. ✅ Deployment and documentation

**Deliverables:**
- Plugin system functional
- Educational content integrated
- Multi-calendar support
- Ready for production

---

## 🧪 Testing Strategy

### Unit Tests

**Conversion Logic:**
```typescript
describe('Gregorian to Natural13 Conversion', () => {
  it('converts winter solstice correctly', () => {
    const date = new Date('2025-12-21');
    const natural = convertGregorianToNatural13(date);
    expect(natural.specialDay).toBe('Year Day');
  });
  
  it('handles leap years', () => {
    const date = new Date('2024-07-05'); // Leap year
    const natural = convertGregorianToNatural13(date);
    // Should account for leap day after month 6
  });
  
  it('round-trip conversion is accurate', () => {
    const original = new Date('2025-10-25');
    const natural = convertGregorianToNatural13(original);
    const backToGregorian = convertNatural13ToGregorian(natural);
    expect(backToGregorian.toDateString()).toBe(original.toDateString());
  });
});
```

**Lunar Calculations:**
```typescript
describe('Lunar Phase Calculations', () => {
  it('calculates known full moons correctly', () => {
    const fullMoon = new Date('2025-11-05'); // Known full moon
    const phase = calculateLunarPhase(fullMoon);
    expect(phase.phase).toBe('full');
    expect(phase.illumination).toBeGreaterThan(95);
  });
});
```

---

### Integration Tests

**Event Creation:**
```typescript
it('creates event with dual calendar data', async () => {
  const event = await createEvent({
    title: 'Harvest Festival',
    dateTime: new Date('2025-10-25'),
    displayInCalendars: ['gregorian', 'natural13']
  });
  
  expect(event.calendarOverlays).toHaveLength(2);
  expect(event.calendarOverlays[0].calendarSystemId).toBe('natural13');
  expect(event.calendarOverlays[0].convertedDate.monthName).toContain('Gathering');
});
```

---

### UI Tests

**Calendar Switching:**
```typescript
it('switches calendar views smoothly', () => {
  render(<CalendarView />);
  
  expect(screen.getByText('October 2025')).toBeInTheDocument();
  
  fireEvent.click(screen.getByText('Natural 13-Month'));
  
  expect(screen.getByText('Moon of Gathering')).toBeInTheDocument();
  expect(screen.queryByText('October 2025')).not.toBeInTheDocument();
});
```

---

### Performance Tests

**Large Dataset:**
```typescript
it('renders 500 events in dual mode within 2 seconds', async () => {
  const events = generateMockEvents(500);
  
  const startTime = performance.now();
  render(<CalendarGrid events={events} viewMode="overlay" />);
  const renderTime = performance.now() - startTime;
  
  expect(renderTime).toBeLessThan(2000);
});
```

---

## 🔮 Future Extensions

### Phase 5: Advanced Features (Post-Launch)

**1. AI-Suggested Timing**
```
Event: "Plant tomatoes"
AI Suggestion: 
  🌙 Best timing: Moon of Planting, Days 5-10
  ☀️ Solar: After last frost (cross-referenced with local climate data)
  📊 Historical: 85% success rate when planted during waxing moon
```

**2. Multi-Calendar Comparison**
```
┌──────────┬──────────┬──────────┬──────────┐
│ Gregorian│ Natural13│ Mayan    │ Chinese  │
├──────────┼──────────┼──────────┼──────────┤
│ Oct 25   │ Gather28 │ 13 Ben   │ 9th Moon │
│ 2025     │ Year 2025│ Tzolk'in │ Wood Snake
└──────────┴──────────┴──────────┴──────────┘
```

**3. Ancestral Alignment**
```
Your Birth Data:
- Gregorian: October 25, 1990
- Natural: Moon of Gathering, Day 28
- Lunar: 🌗 Last Quarter
- Seasonal: Autumn Cross-Quarter

Ancestral Pattern:
- 3 generations born under waning moons
- Traditional "introspective lineage"
- Aligned with harvest/reflection seasons

Suggested Practices:
- Schedule important decisions during waxing phases
- Honor reflective nature during waning periods
- Celebrate birthdays at cross-quarter festivals
```

**4. Ecological Integration**
```
Current Period: Moon of First Rains
Ecological Markers for Southern Africa:
- ✅ Marula trees flowering (verified via satellite data)
- ✅ Red-billed Queleas migrating (eBird data)
- ⏳ First thunderstorms expected (weather API)

Recommended Activities:
- 🌱 Plant heat-loving crops
- 🐝 Check bee hive activity
- 💧 Repair water catchment systems
```

**5. Cultural Calendar Marketplace**
```
Browse Calendar Systems:
- 🌍 Khoisan Seasonal Calendar (by San Community Elders)
- 🗿 Mayan Long Count (by Mayan Cultural Institute)
- 🌙 Islamic Hijri (by Islamic Foundation)
- 🐉 Chinese Lunar (by Chinese Cultural Center)

Each includes:
- Conversion algorithms
- Cultural markers and festivals
- Educational content
- Academic references
- Community validation
```

---

## 📚 Technical Dependencies

### New Libraries Needed

**Astronomical Calculations:**
```json
{
  "dependencies": {
    "astronomia": "^2.0.0", // Lunar phase, solstice calculations
    "suncalc": "^1.9.0"     // Sun position, solar terms
  }
}
```

**Date Handling:**
```json
{
  "dependencies": {
    "date-fns": "^2.30.0",   // Enhanced date manipulation
    "date-fns-tz": "^2.0.0"  // Timezone support
  }
}
```

**Visualization:**
```json
{
  "dependencies": {
    "d3-shape": "^3.2.0",    // Seasonal wheel rendering
    "react-circular-progressbar": "^2.1.0" // Lunar phase display
  }
}
```

---

## 📋 Acceptance Criteria

### Phase 1 Complete When:
- [ ] All conversion functions pass unit tests
- [ ] Data models deployed to Firestore
- [ ] Services return correct calendar data
- [ ] 100% test coverage on conversion logic

### Phase 2 Complete When:
- [ ] Users can switch between calendars
- [ ] All existing events display in both systems
- [ ] Lunar phases visible on calendar
- [ ] No regressions in existing features
- [ ] User preference persists across sessions

### Phase 3 Complete When:
- [ ] Overlay mode renders correctly
- [ ] Seasonal markers selectable in event form
- [ ] Cultural markers database populated
- [ ] Performance meets benchmarks
- [ ] Full test coverage

### Phase 4 Complete When:
- [ ] Plugin system functional
- [ ] At least 2 sample plugins working
- [ ] Educational content integrated
- [ ] Documentation complete
- [ ] Ready for production deployment

---

## 🎨 Wireframe Concepts (Textual)

### Desktop View - Overlay Mode

```
┌────────────────────────────────────────────────────────────────┐
│ 🏠 Salatiso Ecosystem              [👤 Profile] [🔔 Alerts]    │
├────────────────────────────────────────────────────────────────┤
│ 📅 Calendar                                                     │
│                                                                │
│ View: [🌙 Natural 13-Month ▼]  Today: Oct 25, 2025           │
│                                     Moon of Gathering, Day 28  │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Moon of Gathering (October 2025)        🌗 Last Quarter  │  │
│ │ ◀ Prev Month                                  Next Month ▶│  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ Sun   Mon   Tue   Wed   Thu   Fri   Sat                  │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │  1     2     3     4     5     6     7                    │  │
│ │ Oct1  Oct2  Oct3  Oct4  Oct5  Oct6  Oct7                 │  │
│ │ 🌑    🌒    🌓    🌔    🌕    🌖    🌗                    │  │
│ │                                                            │  │
│ │  8     9    10    11    12    13    14                    │  │
│ │ Oct8  Oct9  Oct10 Oct11 Oct12 Oct13 Oct14                │  │
│ │ 🌘    🌑    🌒    🌓    🌔    🌕    🌖                    │  │
│ │                                                            │  │
│ │ 15    16    17    18    19    20    21                    │  │
│ │ Oct15 Oct16 Oct17 Oct18 Oct19 Oct20 Oct21                │  │
│ │ 🌗    🌘    🌑    🌒    🌓    🌔    🌕                    │  │
│ │                                                            │  │
│ │ 22    23    24    25    26    27    28                    │  │
│ │ Oct22 Oct23 Oct24 Oct25 Oct26 Oct27 Oct28                │  │
│ │ 🌖    🌗    🌘    🌑    🌒    🌓    🌔                    │  │
│ │                 👈 YOU ARE HERE                           │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                                                │
│ 🍂 Seasonal Context:                                          │
│ • Autumn Cross-Quarter approaching (6 days)                   │
│ • Harvest Season (traditional gathering time)                 │
│ • Waning Moon (reflection phase)                              │
│                                                                │
│ 📆 Upcoming Events:                                           │
│ • Oct 26 - Community Harvest Dinner 🌾                        │
│ • Oct 31 - Samhain / Ancestor Remembrance 🕯️                 │
│ • Nov 1 - Year Day (intercalary) ⭐                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Mobile View - Compact Dual Display

```
┌──────────────────────┐
│ 🌙 Natural Calendar  │
│ ─────────────────── │
│ Moon of Gathering    │
│ Day 28              │
│                      │
│ 📅 Oct 25, 2025     │
│ 🌗 Last Quarter     │
│                      │
│ [Switch to Greg] 🔄 │
│ ─────────────────── │
│ Today's Events:      │
│                      │
│ 🌾 Harvest Dinner   │
│    6:00 PM          │
│    Community Hall    │
│                      │
│ 📝 Planning Meeting │
│    2:00 PM          │
│    Home Office       │
│                      │
│ [+ Add Event]       │
│                      │
│ ─────────────────── │
│ 🍂 Season: Autumn   │
│ Next: Samhain (6d)  │
└──────────────────────┘
```

---

## 🚀 Getting Started (Developer Guide)

### Step 1: Create Type Definitions

File: `src/types/calendar-systems.ts`

```typescript
// Add to project - see detailed spec above
export interface CalendarSystem { ... }
export interface CalendarOverlay { ... }
export interface SeasonalMarker { ... }
```

### Step 2: Implement Services

File: `src/services/CalendarSystemService.ts`

```typescript
class CalendarSystemService {
  async getCalendarSystem(id: string): Promise<CalendarSystem> { ... }
  async getAllCalendarSystems(): Promise<CalendarSystem[]> { ... }
  async createCalendarSystem(system: CalendarSystem): Promise<void> { ... }
}
```

### Step 3: Build Conversion Logic

File: `src/utils/calendar-conversion.ts`

```typescript
export function convertGregorianToNatural13(date: Date): Natural13Date { ... }
export function convertNatural13ToGregorian(natural: Natural13Date): Date { ... }
export function calculateLunarPhase(date: Date): LunarPhase { ... }
```

### Step 4: Update UI Components

File: `src/components/calendar/CalendarSystemSelector.tsx`

```typescript
const CalendarSystemSelector: React.FC = () => {
  // Component code
};
```

### Step 5: Testing

```bash
npm run test:calendar-systems
```

---

## 📞 Support & Resources

**Documentation:**
- This spec document
- API documentation (to be generated)
- User guide (Phase 4)

**References:**
- Natural 13-Month Calendar: [Link to academic sources]
- Lunar calculations: [Astronomical algorithms]
- Indigenous markers: [Cultural consultation records]

**Team Contacts:**
- Product Owner: [Name]
- Lead Developer: [Name]
- Cultural Consultant: [Name]

---

**Status:** ✅ **Specification Complete - Ready for Development**

**Next Steps:**
1. Review and approve specification
2. Assign developers to Phase 1
3. Set up project tracking
4. Begin implementation

---

*"Honoring the rhythms of nature while navigating the modern world."*  
*— Salatiso Ecosystem Mission*
