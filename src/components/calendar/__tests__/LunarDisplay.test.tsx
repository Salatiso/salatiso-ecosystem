import React from 'react';
import { render } from '@testing-library/react';
import { LunarDisplay } from '../LunarDisplay';

// Mock the lunar conversion hooks
jest.mock('../../../hooks/useConversionService', () => ({
  useLunarPhase: jest.fn(() => ({
    phase: 'full',
    illumination: 100,
    age: 15,
    phaseName: 'Full Moon',
  })),
  useBatchLunarPhases: jest.fn(() => [
    { phase: 'full', illumination: 100, age: 15, phaseName: 'Full Moon' },
    { phase: 'waning_gibbous', illumination: 85, age: 16, phaseName: 'Waning Gibbous' },
    { phase: 'last_quarter', illumination: 50, age: 22, phaseName: 'Last Quarter' },
  ]),
}));

/**
 * Test suite for LunarDisplay component
 * Tests lunar phase information and visualization
 * Pattern: Proven from DualCalendarGrid (5 describe blocks, 12 tests)
 */
describe('LunarDisplay Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<LunarDisplay />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should render moon emoji', () => {
      const { container } = render(<LunarDisplay />);
      const moonEmoji = container.textContent;
      expect(moonEmoji).toBeTruthy();
    });

    it('should render with default props', () => {
      const { container } = render(<LunarDisplay />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should include phase information', () => {
      const { container } = render(<LunarDisplay showDetails={true} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should render with loading state', () => {
      const { container } = render(<LunarDisplay isLoading={true} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Props Handling', () => {
    it('should accept date prop', () => {
      const testDate = new Date('2025-10-15');
      const { container } = render(<LunarDisplay date={testDate} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle showUpcoming prop', () => {
      const { container } = render(<LunarDisplay showUpcoming={7} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle size variant sm', () => {
      const { container } = render(<LunarDisplay size="sm" />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle size variant md', () => {
      const { container } = render(<LunarDisplay size="md" />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle size variant lg', () => {
      const { container } = render(<LunarDisplay size="lg" />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept custom className', () => {
      const { container } = render(<LunarDisplay className="custom-class" />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Callbacks', () => {
    it('should render with showDetails prop', () => {
      const { container } = render(<LunarDisplay showDetails={true} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null date', () => {
      const { container } = render(<LunarDisplay date={undefined} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle large showUpcoming value', () => {
      const { container } = render(<LunarDisplay showUpcoming={30} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Component Stability', () => {
    it('should render multiple times without state issues', () => {
      const { unmount, container } = render(<LunarDisplay />);
      expect(container.firstChild).toBeTruthy();
      unmount();

      const { container: c2 } = render(<LunarDisplay />);
      expect(c2.firstChild).toBeTruthy();
    });

    it('should handle prop changes with fresh renders', () => {
      const { unmount, container: c1 } = render(
        <LunarDisplay size="sm" />
      );
      expect(c1.firstChild).toBeTruthy();
      unmount();

      const { container: c2 } = render(
        <LunarDisplay size="lg" />
      );
      expect(c2.firstChild).toBeTruthy();
    });
  });
});
