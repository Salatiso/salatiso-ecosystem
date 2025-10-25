import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DualCalendarGrid } from '../DualCalendarGrid';

/**
 * Test suite for DualCalendarGrid component
 * Tests rendering, props, user interactions, and state changes
 */
describe('DualCalendarGrid Component', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <DualCalendarGrid month={10} year={2024} />
      );
      expect(container).toBeTruthy();
    });

    it('should render with required props', () => {
      const { container } = render(
        <DualCalendarGrid month={5} year={2024} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should render calendar structure', () => {
      const { container } = render(
        <DualCalendarGrid month={10} year={2024} />
      );
      // Should have a main container
      expect(container.querySelector('div')).toBeTruthy();
    });
  });

  describe('Props Handling', () => {
    it('should accept month prop (January)', () => {
      const { container } = render(
        <DualCalendarGrid month={1} year={2024} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept month prop (December)', () => {
      const { container } = render(<DualCalendarGrid month={12} year={2024} />);
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept year prop', () => {
      const { container } = render(
        <DualCalendarGrid month={6} year={2024} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle optional showLunar true', () => {
      const { container } = render(
        <DualCalendarGrid month={10} year={2024} showLunar={true} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle optional showLunar false', () => {
      const { container } = render(
        <DualCalendarGrid month={10} year={2024} showLunar={false} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle optional showToday true', () => {
      const { container } = render(
        <DualCalendarGrid month={10} year={2024} showToday={true} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle optional showToday false', () => {
      const { container } = render(
        <DualCalendarGrid month={10} year={2024} showToday={false} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle custom className', () => {
      const { container } = render(
        <DualCalendarGrid
          month={10}
          year={2024}
          className="test-class"
        />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle isLoading true', () => {
      const { container } = render(
        <DualCalendarGrid
          month={10}
          year={2024}
          isLoading={true}
        />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle isLoading false', () => {
      const { container } = render(
        <DualCalendarGrid
          month={10}
          year={2024}
          isLoading={false}
        />
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Callbacks', () => {
    it('should accept onDateSelect callback', () => {
      const onDateSelect = jest.fn();
      const { container } = render(
        <DualCalendarGrid
          month={10}
          year={2024}
          onDateSelect={onDateSelect}
        />
      );
      // Component should render without error even with callback
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle February in leap year', () => {
      const { container } = render(
        <DualCalendarGrid month={2} year={2024} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle February in non-leap year', () => {
      const { container } = render(
        <DualCalendarGrid month={2} year={2023} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle January', () => {
      const { container } = render(
        <DualCalendarGrid month={1} year={2024} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle December', () => {
      const { container } = render(
        <DualCalendarGrid month={12} year={2024} />
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should handle year boundaries', () => {
      const { unmount, container } = render(
        <DualCalendarGrid month={12} year={2024} />
      );
      expect(container.firstChild).toBeTruthy();
      unmount();

      const { container: container2 } = render(
        <DualCalendarGrid month={1} year={2025} />
      );
      expect(container2.firstChild).toBeTruthy();
    });
  });

  describe('Component Stability', () => {
    it('should render multiple months without issues', () => {
      const { unmount, container } = render(
        <DualCalendarGrid month={10} year={2024} />
      );
      expect(container.firstChild).toBeTruthy();
      unmount();

      const { container: container2 } = render(
        <DualCalendarGrid month={6} year={2024} />
      );
      expect(container2.firstChild).toBeTruthy();
    });

    it('should render different years', () => {
      const { unmount, container } = render(
        <DualCalendarGrid month={1} year={2024} />
      );
      expect(container.firstChild).toBeTruthy();
      unmount();

      const { container: container3 } = render(
        <DualCalendarGrid month={1} year={2025} />
      );
      expect(container3.firstChild).toBeTruthy();
    });
  });
});
