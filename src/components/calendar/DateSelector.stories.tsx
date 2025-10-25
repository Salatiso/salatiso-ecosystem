import type { Meta, StoryObj } from '@storybook/react';
import { DateSelector } from './DateSelector';
import type { Natural13Date } from '@/types/calendar-systems';

/**
 * DateSelector component is an interactive dual-calendar date picker
 * 
 * Features:
 * - Dual calendar system (Gregorian + Natural13)
 * - Month and day selectors
 * - Date validation
 * - Lunar and seasonal context
 * - Accessibility support
 */

const mockOnDateSelect = (gregorianDate: Date, natural13Date: Natural13Date) => {
  console.log('Date selected:', { gregorianDate, natural13Date });
};

const meta = {
  title: 'Calendar/DateSelector',
  component: DateSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An interactive date picker that allows users to select dates across both Gregorian and Natural13 calendar systems with lunar and seasonal context.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initialDate: {
      control: 'date',
      description: 'Initial date to display',
    },
    className: {
      control: 'text',
      description: 'CSS class for container',
    },
    showContext: {
      control: 'boolean',
      description: 'Whether to show lunar and seasonal context information',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether component is in loading state',
    },
    onDateSelect: {
      description: 'Callback when date is selected',
      action: 'date selected',
    },
  },
} satisfies Meta<typeof DateSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default date selector with context
 */
export const Default: Story = {
  args: {
    onDateSelect: mockOnDateSelect,
    initialDate: new Date(),
    showContext: true,
    isLoading: false,
  },
};

/**
 * Without context information
 */
export const NoContext: Story = {
  args: {
    onDateSelect: mockOnDateSelect,
    initialDate: new Date(),
    showContext: false,
    isLoading: false,
  },
};

/**
 * With specific date
 */
export const SpecificDate: Story = {
  args: {
    onDateSelect: mockOnDateSelect,
    initialDate: new Date(2025, 4, 15), // May 15, 2025
    showContext: true,
    isLoading: false,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    onDateSelect: mockOnDateSelect,
    initialDate: new Date(),
    showContext: true,
    isLoading: true,
  },
};

/**
 * Spring date selection
 */
export const SpringDate: Story = {
  args: {
    onDateSelect: mockOnDateSelect,
    initialDate: new Date(2025, 2, 20), // March 20 (Spring Equinox)
    showContext: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Date selector showing spring equinox with seasonal context',
      },
    },
  },
};

/**
 * Summer date selection
 */
export const SummerDate: Story = {
  args: {
    onDateSelect: mockOnDateSelect,
    initialDate: new Date(2025, 5, 21), // June 21 (Summer Solstice)
    showContext: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Date selector showing summer solstice with seasonal context',
      },
    },
  },
};

/**
 * Interactive date picker
 */
export const Interactive: Story = {
  args: {
    onDateSelect: mockOnDateSelect,
    initialDate: new Date(),
    showContext: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Try selecting different months and days to see both calendar systems and seasonal context update',
      },
    },
  },
};
