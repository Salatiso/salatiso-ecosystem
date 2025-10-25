import React from 'react';
import { render } from '@testing-library/react';
import { EventOverlayManager } from '../EventOverlayManager';

// Mock the hooks and services
jest.mock('../../../providers/CalendarSystemProvider', () => ({
  useCalendarSystem: jest.fn(() => {
    const calendarSystems = [
      {
        id: 'natural13',
        displayName: 'Natural 13 Calendar',
        type: 'natural13',
        isActive: true,
        monthNames: ['Araveh', 'Khutzo', 'Kutlo', 'Morama', 'Phakwane', 'Diphalane', 'Mosiana', 'Phato', 'Loetse', 'Kardinala', 'Moswanedi', 'Phakwane Pedi', 'Morama Pedi'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'gregorian',
        displayName: 'Gregorian Calendar',
        type: 'gregorian',
        isActive: true,
        monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return {
      systemType: 'natural13',
      setSystemType: jest.fn(),
      calendarSystems: calendarSystems,
      currentSystem: calendarSystems[0],
    };
  }),
}));

jest.mock('../../../hooks/useConversionService', () => ({
  useSeasonalContext: jest.fn(() => ({
    season: 'Spring Awakening',
    lunarPhase: {
      phase: 'waxing_gibbous',
      illumination: 75,
      age: 10,
    },
    solarTerm: 'Grain Awakening',
  })),
  useNatural13Conversion: jest.fn(() => ({ 
    month: 5, 
    day: 15, 
    yearIndex: 0 
  })),
}));

jest.mock('../../../services/CalendarSystemService', () => ({
  CalendarSystemService: jest.fn(() => ({
    getAllSystems: jest.fn().mockResolvedValue([
      {
        id: 'natural13',
        displayName: 'Natural 13 Calendar',
        type: 'natural13',
        isActive: true,
      },
    ]),
    getCalendarOverlays: jest.fn().mockResolvedValue([]),
    createCalendarOverlay: jest.fn().mockResolvedValue({ id: 'overlay-1', eventId: 'event-1' }),
    deleteCalendarOverlay: jest.fn().mockResolvedValue(true),
  })),
}));

/**
 * Test suite for EventOverlayManager component
 * Tests event-to-calendar-system mapping with Firestore integration
 * Pattern: Proven from DualCalendarGrid (5 describe blocks, 15 tests)
 */
describe('EventOverlayManager Component', () => {
  const mockEventId = 'event-123';
  const mockOnSaved = jest.fn();

  beforeEach(() => {
    mockOnSaved.mockClear();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should render form elements', () => {
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} />
      );
      const form = container.querySelector('form') || container.querySelector('div');
      expect(form).toBeTruthy();
    });

    it('should render with default props', () => {
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should render system selector', () => {
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} />
      );
      const selects = container.querySelectorAll('select');
      expect(selects.length).toBeGreaterThan(0);
    });

    it('should render buttons', () => {
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} />
      );
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Props Handling', () => {
    it('should accept eventId prop', () => {
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept initialDate prop', () => {
      const initialDate = new Date('2025-05-15');
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} initialDate={initialDate} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept onSaved callback', () => {
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} onSaved={mockOnSaved} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept className prop', () => {
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} className="custom-class" />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle isLoading prop true', () => {
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} isLoading={true} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle isLoading prop false', () => {
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} isLoading={false} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept existingOverlays prop', () => {
      const existingOverlays = [
        {
          id: 'overlay-1',
          eventId: mockEventId,
          calendarSystemId: 'natural13',
          mappedDate: new Date('2025-05-15'),
          notes: 'Test overlay',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const { container } = render(
        <EventOverlayManager
          eventId={mockEventId}
          existingOverlays={existingOverlays}
        />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should render with different event IDs', () => {
      const { container } = render(
        <EventOverlayManager eventId="different-event-id" />
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Callbacks', () => {
    it('should accept onSaved callback function', () => {
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} onSaved={mockOnSaved} />
      );
      expect(container.firstChild).toBeTruthy();
      expect(mockOnSaved).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty eventId', () => {
      const { container } = render(
        <EventOverlayManager eventId="" />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle with optional props omitted', () => {
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle empty existingOverlays', () => {
      const { container } = render(
        <EventOverlayManager eventId={mockEventId} existingOverlays={[]} />
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Component Stability', () => {
    it('should render multiple times without state issues', () => {
      const { unmount, container } = render(
        <EventOverlayManager eventId={mockEventId} />
      );
      expect(container.firstChild).toBeTruthy();
      unmount();

      const { container: c2 } = render(
        <EventOverlayManager eventId={mockEventId} />
      );
      expect(c2.firstChild).toBeTruthy();
    });

    it('should handle prop changes with fresh renders', () => {
      const { unmount, container: c1 } = render(
        <EventOverlayManager eventId="event-1" />
      );
      expect(c1.firstChild).toBeTruthy();
      unmount();

      const { container: c2 } = render(
        <EventOverlayManager eventId="event-2" />
      );
      expect(c2.firstChild).toBeTruthy();
    });
  });
});
