import React from 'react';
import { render } from '@testing-library/react';
import { DateSelector } from '../DateSelector';

// Mock the conversion hooks
jest.mock('../../../hooks/useConversionService', () => ({
  useNatural13Conversion: jest.fn(() => ({ 
    month: 5, 
    day: 15, 
    yearIndex: 0 
  })),
  useValidateNatural13: jest.fn((month, day) => ({
    isValid: month >= 1 && month <= 13 && day >= 1 && day <= 28,
    maxDay: 28,
  })),
  useSeasonalContext: jest.fn(() => ({
    season: 'Spring Awakening',
    lunarPhase: {
      phase: 'waxing_gibbous',
      illumination: 75,
      age: 10,
    },
    solarTerm: 'Grain Awakening',
  })),
}));

/**
 * Test suite for DateSelector component
 * Tests dual-calendar date picker component for Natural13 system
 * Pattern: Proven from DualCalendarGrid (5 describe blocks, 15 tests)
 */
describe('DateSelector Component', () => {
  const mockOnDateSelect = jest.fn();

  beforeEach(() => {
    mockOnDateSelect.mockClear();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should render form elements', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} />
      );
      const form = container.querySelector('form') || container.querySelector('div');
      expect(form).toBeTruthy();
    });

    it('should render with default props', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should render select elements', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} />
      );
      const selects = container.querySelectorAll('select');
      expect(selects.length).toBeGreaterThan(0);
    });

    it('should render input elements', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} />
      );
      const inputs = container.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  describe('Props Handling', () => {
    it('should accept onDateSelect callback', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept initialDate prop', () => {
      const initialDate = new Date('2025-05-15');
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} initialDate={initialDate} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept className prop', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} className="custom-class" />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle isLoading prop true', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} isLoading={true} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle isLoading prop false', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} isLoading={false} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle showContext prop true', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} showContext={true} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle showContext prop false', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} showContext={false} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should render month options', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} />
      );
      const options = container.querySelectorAll('option');
      expect(options.length).toBeGreaterThan(1);
    });

    it('should render day input field', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} />
      );
      const inputs = container.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  describe('Callbacks', () => {
    it('should accept onDateSelect callback function', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} />
      );
      expect(container.firstChild).toBeTruthy();
      expect(mockOnDateSelect).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum valid date', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} initialDate={new Date('2025-01-01')} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle maximum valid date', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} initialDate={new Date('2025-12-31')} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle with optional props omitted', () => {
      const { container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} />
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Component Stability', () => {
    it('should render multiple times without state issues', () => {
      const { unmount, container } = render(
        <DateSelector onDateSelect={mockOnDateSelect} />
      );
      expect(container.firstChild).toBeTruthy();
      unmount();

      const { container: c2 } = render(
        <DateSelector onDateSelect={mockOnDateSelect} />
      );
      expect(c2.firstChild).toBeTruthy();
    });

    it('should handle prop changes with fresh renders', () => {
      const { unmount, container: c1 } = render(
        <DateSelector onDateSelect={mockOnDateSelect} initialDate={new Date('2025-01-15')} />
      );
      expect(c1.firstChild).toBeTruthy();
      unmount();

      const { container: c2 } = render(
        <DateSelector onDateSelect={mockOnDateSelect} initialDate={new Date('2025-12-15')} />
      );
      expect(c2.firstChild).toBeTruthy();
    });
  });
});
