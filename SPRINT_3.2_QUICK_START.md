# Sprint 3.2: UI Integration Quick Start
**October 25, 2025** - Ready to Begin

---

## 🎯 Sprint 3.2 Objectives

Integrate the calendar backend into the user interface and implement the context switching system.

### Tasks (Est. 2-3 hours)

1. **Calendar Grid Component** (45 mins)
   - Create grid-based calendar view
   - Display events on correct dates
   - Handle month navigation
   - Show event indicators

2. **EventForm & EventDetails Integration** (45 mins)
   - Integrate EventForm into calendar page
   - Add modal for EventDetails
   - Wire up create/edit/delete buttons
   - Connect to EnhancedCalendarService

3. **Context Switcher Component** (30 mins)
   - Create context selector (Individual/Family/Community/Professional)
   - Store selection in localStorage
   - Filter events by context
   - Update Firestore queries

4. **Real-Time Event Display** (30 mins)
   - Connect subscribeToEvents()
   - Auto-update calendar on changes
   - Show live indicators
   - Handle offline gracefully

5. **Build & Deploy** (15 mins)
   - Verify 0 errors
   - Deploy to staging
   - End-to-end testing

---

## 📦 What's Already Built (Sprint 3.1)

### Available Services
```typescript
// Already fully implemented and ready to use:
import { enhancedCalendarService } from '@/services/EnhancedCalendarService';

// All methods available:
- createEvent(userId, input)
- getEvent(userId, eventId)
- queryEvents(userId, filters)
- updateEvent(userId, eventId, updates)
- deleteEvent(userId, eventId)
- assignRole(userId, eventId, role)
- respondToRole(userId, roleId, response)
- escalateIncident(userId, eventId, escalation)
- subscribeToEvent(userId, eventId, callback)
- subscribeToEvents(userId, filters, callback)
```

### Available Components
```typescript
// Ready to integrate:
import EventForm from '@/components/calendar/EventForm';
import EventDetails from '@/components/calendar/EventDetails';

// Props:
<EventForm 
  userId={userId}
  initialEvent={event}
  defaultContext="Family"
  mode="quick" // or "advanced"
  onSuccess={handleSuccess}
  onCancel={handleCancel}
/>

<EventDetails 
  event={event}
  onEdit={handleEdit}
  onEscalate={handleEscalate}
  onResolve={handleResolve}
/>
```

### Available Types
```typescript
import {
  CalendarEvent,
  EventType,
  EventStatus,
  EventContext,
  RoleType,
  SeverityLevel,
  // ... 15+ more interfaces
} from '@/types/calendar';
```

---

## 🏗️ Sprint 3.2 Architecture

### Component Structure
```
/intranet/calendar (page)
├── ContextSwitcher
│   └── Emits: context (Individual/Family/Community/Professional)
├── CalendarGrid (NEW)
│   ├── Shows events for selected context
│   ├── Listens to subscribeToEvents()
│   └── Emits: selectedEvent
├── EventForm Modal (NEW - uses EventForm component)
│   └── Integrates with createEvent()
├── EventDetails Modal (NEW - uses EventDetails component)
│   └── Displays event with actions
└── Toolbar
    └── Add Event Button → Opens EventForm Modal
```

### Data Flow
```
1. User selects context → ContextSwitcher
2. Query changes → subscribeToEvents() called
3. Events filtered by context → CalendarGrid displayed
4. User clicks event → EventDetails Modal opens
5. User clicks Edit → EventForm Modal opens
6. Form submits → createEvent() or updateEvent() called
7. Firestore updates → Real-time listeners fire
8. CalendarGrid auto-updates
```

---

## 🔧 Getting Started

### Step 1: Plan the Calendar Grid
Create `src/components/calendar/CalendarGrid.tsx`:

```typescript
// Structure to implement:
interface CalendarGridProps {
  events: CalendarEvent[];
  context: EventContext;
  onSelectEvent: (event: CalendarEvent) => void;
  onAddDay: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  events,
  context,
  onSelectEvent,
  onAddDay,
}) => {
  // Grid layout (7 columns for days of week)
  // Each cell shows date and events for that day
  // Color-code events by type/status
  // Click event to show details
};
```

### Step 2: Plan Context Switcher
Create `src/components/calendar/ContextSwitcher.tsx`:

```typescript
interface ContextSwitcherProps {
  current: EventContext;
  onChange: (context: EventContext) => void;
}

export const ContextSwitcher: React.FC<ContextSwitcherProps> = ({
  current,
  onChange,
}) => {
  // 4 buttons: Individual, Family, Community, Professional
  // Highlight current selection
  // Persist to localStorage
};
```

### Step 3: Update Calendar Page
Modify `src/pages/intranet/calendar.tsx`:

```typescript
export default function CalendarPage() {
  const [context, setContext] = useState<EventContext>('Family');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Subscribe to events for selected context
  useEffect(() => {
    const unsubscribe = enhancedCalendarService.subscribeToEvents(
      userId,
      { context, status: 'open' },
      (response) => {
        if (response.success) {
          setEvents(response.data);
        }
      }
    );
    return unsubscribe;
  }, [context, userId]);
  
  return (
    <div>
      <ContextSwitcher current={context} onChange={setContext} />
      <CalendarGrid 
        events={events}
        context={context}
        onSelectEvent={setSelectedEvent}
        onAddDay={(date) => setIsFormOpen(true)}
      />
      {selectedEvent && (
        <EventDetailsModal 
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={() => setIsFormOpen(true)}
        />
      )}
      {isFormOpen && (
        <EventFormModal 
          context={context}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
```

---

## 📋 Implementation Checklist

### CalendarGrid Component
- [ ] Create component structure
- [ ] Implement month view grid
- [ ] Add day navigation
- [ ] Display events on correct dates
- [ ] Color-code by event type
- [ ] Add event indicators
- [ ] Handle empty days
- [ ] Test with sample data

### ContextSwitcher Component
- [ ] Create context selector
- [ ] Add 4 context buttons
- [ ] Highlight current selection
- [ ] Save to localStorage
- [ ] Restore on page load
- [ ] Emit onChange events
- [ ] Test all contexts

### Calendar Page Integration
- [ ] Replace placeholder with new components
- [ ] Subscribe to real-time events
- [ ] Open EventForm on "Add" button
- [ ] Open EventDetails on event click
- [ ] Handle form submission
- [ ] Auto-refresh on changes
- [ ] Test end-to-end

### Styling & Polish
- [ ] Color scheme for events
- [ ] Responsive design (mobile-friendly)
- [ ] Animations for modals
- [ ] Loading states
- [ ] Error messages
- [ ] Accessibility (ARIA labels)

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Test CalendarGrid rendering
// Test ContextSwitcher state changes
// Test event filtering by context
```

### Integration Tests
```typescript
// Test component communication
// Test EnhancedCalendarService integration
// Test real-time subscriptions
```

### E2E Tests (Manual)
```
1. Navigate to calendar page
2. Select different contexts → Grid updates
3. Click "Add Event" → Form opens
4. Fill form → Submit → Event appears on calendar
5. Click event → Details show
6. Click Edit → Form updates with event data
7. Create incident → See severity badge
8. Escalate incident → See in escalation list
```

---

## 🎨 UI/UX Tips

### Color Coding (Suggested)
- **Activity**: Blue background
- **Incident**: Red background
- **Status badges**: Green (Resolved), Yellow (In-Progress), Gray (Archived)
- **Severity**: Dark Red (Critical), Orange (High), Yellow (Medium), Gray (Low)

### Interactions
- Hover event to show quick preview
- Click to open details modal
- Drag to reschedule (optional for Sprint 3.3)
- Right-click for quick actions (delete, escalate)

### Mobile Considerations
- Collapsible context switcher on mobile
- Swipe to navigate months
- Touch-friendly button sizes
- Responsive grid (3-column on tablet, 7-column on desktop)

---

## 🚀 Deployment Checklist

Before deploying:
- [ ] 0 TypeScript errors
- [ ] All components render
- [ ] Forms submit successfully
- [ ] Real-time updates working
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Accessibility pass

Deployment:
```bash
npm run build
firebase deploy --only hosting:lifecv-d2724
```

---

## 📚 Related Files

### Implementation Files
- Service: `src/services/EnhancedCalendarService.ts`
- Components: `src/components/calendar/{EventForm,EventDetails}.tsx`
- Types: `src/types/calendar.ts`
- Page: `src/pages/intranet/calendar.tsx`

### Documentation
- Spec: `CALENDAR_ENHANCEMENT_COMPREHENSIVE_SPECIFICATION.md`
- Architecture: `ECOSYSTEM_PROFILE_STANDARD.md`
- Quick Ref: `CALENDAR_QUICK_REFERENCE.md`

---

## 💡 Pro Tips

1. **Start with CalendarGrid**: This is the most visible component
2. **Add ContextSwitcher early**: It controls what events are shown
3. **Use TailwindCSS for styling**: Already in project
4. **Leverage Framer Motion**: For smooth modal animations
5. **Test subscriptions**: Make sure real-time updates work
6. **Batch API calls**: Load context once per session

---

## ❓ Quick Q&A

**Q: Can I reuse existing calendar code?**
A: Yes! Check `src/pages/intranet/calendar.tsx` for placeholder structure

**Q: How do I handle different time zones?**
A: CalendarEvent uses ISO timestamps; convert to user's timezone in component

**Q: Should I support drag-to-reschedule in Sprint 3.2?**
A: No - keep it simple. Plan for Sprint 3.3+

**Q: How do I debug real-time subscriptions?**
A: Check browser console for subscription logs; verify Firestore rules allow access

**Q: What about mobile responsiveness?**
A: Use TailwindCSS responsive classes; test on device

---

## 🎯 Success Criteria

Sprint 3.2 is **COMPLETE** when:
- ✅ Calendar grid displays events correctly
- ✅ Context switcher changes shown events
- ✅ EventForm creates new events
- ✅ EventDetails modal shows event info
- ✅ Real-time updates work (no page refresh needed)
- ✅ 0 build errors
- ✅ 0 TypeScript errors
- ✅ Deployed to staging
- ✅ Manual E2E tests pass

---

## ⏱️ Estimated Timeline

| Task | Est. Time |
|------|-----------|
| CalendarGrid | 45 mins |
| ContextSwitcher | 30 mins |
| Integration | 45 mins |
| Styling & Polish | 30 mins |
| Testing & Deploy | 30 mins |
| **Total** | **2.5 hours** |

---

## 🎊 What's Next After Sprint 3.2?

- **Sprint 3.3**: Entity Linking UI (link events to contacts/assets/projects)
- **Sprint 3.4**: Advanced Filtering & Search
- **Sprint 3.5**: Mobile Sync & Notifications

---

*Ready to build? Let me know when you're ready to start Sprint 3.2!*

**Staging URL**: https://lifecv-d2724.web.app
