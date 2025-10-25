import React from 'react';
import { render } from '@testing-library/react';
import { SeasonalWheel } from '../SeasonalWheel';

// Mock the Calendar System hooks with complete SeasonalMarker structure
jest.mock('../../../providers/CalendarSystemProvider', () => ({
  useCalendarSystem: jest.fn(() => ({
    systemType: 'natural13',
    setSystemType: jest.fn(),
    seasonalMarkers: [
      {
        id: 'marker-1',
        calendarSystemId: 'natural13',
        name: 'Winter Solstice',
        localizedNames: { en: 'Winter Solstice' },
        markerType: 'solar',
        timing: { 
          fixedDate: { month: 12, day: 21 },
          astronomicalEvent: 'solstice'
        },
        description: 'Astronomical winter begins',
        culturalSignificance: {
          origin: ['Global'],
          description: 'Start of winter season',
          traditionalActivities: ['Celebration'],
          biologicalAlignment: ['Dormancy'],
        },
        color: '#4B5563',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: 'marker-2',
        calendarSystemId: 'natural13',
        name: 'Spring Equinox',
        localizedNames: { en: 'Spring Equinox' },
        markerType: 'solar',
        timing: { 
          fixedDate: { month: 3, day: 20 },
          astronomicalEvent: 'equinox'
        },
        description: 'Astronomical spring begins',
        culturalSignificance: {
          origin: ['Global'],
          description: 'Start of spring season',
          traditionalActivities: ['Planting'],
          biologicalAlignment: ['Growth'],
        },
        color: '#22C55E',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: 'marker-3',
        calendarSystemId: 'natural13',
        name: 'Summer Solstice',
        localizedNames: { en: 'Summer Solstice' },
        markerType: 'solar',
        timing: { 
          fixedDate: { month: 6, day: 21 },
          astronomicalEvent: 'solstice'
        },
        description: 'Astronomical summer begins',
        culturalSignificance: {
          origin: ['Global'],
          description: 'Start of summer season',
          traditionalActivities: ['Gathering'],
          biologicalAlignment: ['Abundance'],
        },
        color: '#FBBF24',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: 'marker-4',
        calendarSystemId: 'natural13',
        name: 'Autumn Equinox',
        localizedNames: { en: 'Autumn Equinox' },
        markerType: 'solar',
        timing: { 
          fixedDate: { month: 9, day: 22 },
          astronomicalEvent: 'equinox'
        },
        description: 'Astronomical autumn begins',
        culturalSignificance: {
          origin: ['Global'],
          description: 'Start of autumn season',
          traditionalActivities: ['Harvest'],
          biologicalAlignment: ['Decline'],
        },
        color: '#F97316',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
    ],
  })),
  CalendarSystemProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../../../hooks/useConversionService', () => ({
  useNatural13Conversion: jest.fn(() => ({ 
    month: 1, 
    day: 1, 
    yearIndex: 0 
  })),
}));

/**
 * Test suite for SeasonalWheel component
 * Tests circular 13-month calendar visualization with astronomical markers
 * Pattern: Proven from DualCalendarGrid (5 describe blocks, 18 tests)
 */
describe('SeasonalWheel Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<SeasonalWheel />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should render SVG element', () => {
      const { container } = render(<SeasonalWheel />);
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('should render with default props', () => {
      const { container } = render(<SeasonalWheel />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should include color definitions', () => {
      const { container } = render(<SeasonalWheel />);
      const defs = container.querySelector('defs');
      expect(defs).toBeTruthy();
    });

    it('should render month segments', () => {
      const { container } = render(<SeasonalWheel />);
      const svg = container.querySelector('svg');
      expect(svg?.children.length).toBeGreaterThan(0);
    });
  });

  describe('Props Handling', () => {
    it('should accept highlightMonth prop', () => {
      const { container } = render(<SeasonalWheel highlightMonth={1} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle different months (1-13)', () => {
      const { container } = render(<SeasonalWheel highlightMonth={6} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept showMarkers true', () => {
      const { container } = render(<SeasonalWheel showMarkers={true} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept showMarkers false', () => {
      const { container } = render(<SeasonalWheel showMarkers={false} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle size variant sm', () => {
      const { container } = render(<SeasonalWheel size="sm" />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle size variant md', () => {
      const { container } = render(<SeasonalWheel size="md" />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle size variant lg', () => {
      const { container } = render(<SeasonalWheel size="lg" />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept custom className', () => {
      const { container } = render(<SeasonalWheel className="custom-class" />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle animated prop', () => {
      const { container } = render(<SeasonalWheel animated={true} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Callbacks', () => {
    it('should accept onMonthSelect callback', () => {
      const mockCallback = jest.fn();
      const { container } = render(
        <SeasonalWheel onMonthSelect={mockCallback} />
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle highlightMonth out of range (0)', () => {
      const { container } = render(<SeasonalWheel highlightMonth={0} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle highlightMonth out of range (14)', () => {
      const { container } = render(<SeasonalWheel highlightMonth={14} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle undefined showMarkers', () => {
      const { container } = render(<SeasonalWheel showMarkers={undefined} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should render with seasonal markers', () => {
      const { container } = render(<SeasonalWheel showMarkers={true} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Component Stability', () => {
    it('should render multiple times without state issues', () => {
      const { unmount, container } = render(<SeasonalWheel />);
      expect(container.firstChild).toBeTruthy();
      unmount();

      const { container: c2 } = render(<SeasonalWheel />);
      expect(c2.firstChild).toBeTruthy();
    });

    it('should handle prop changes with fresh renders', () => {
      const { unmount, container: c1 } = render(
        <SeasonalWheel highlightMonth={1} />
      );
      expect(c1.firstChild).toBeTruthy();
      unmount();

      const { container: c2 } = render(
        <SeasonalWheel highlightMonth={7} />
      );
      expect(c2.firstChild).toBeTruthy();
    });
  });
});
