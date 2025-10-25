import type { Meta, StoryObj } from '@storybook/react';
import { DualCalendarGrid } from './DualCalendarGrid';

/**
 * DualCalendarGrid component displays a month view with dual calendars
 * (Gregorian and Natural13 side-by-side)
 * 
 * Features:
 * - Simultaneous display of Gregorian and Natural13 calendars
 * - Highlight current day
 * - Select dates with callbacks
 * - Responsive design
 */
const meta = {
  title: 'Calendar/DualCalendarGrid',
  component: DualCalendarGrid,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A dual-calendar component that displays both Gregorian and Natural13 month views side-by-side for easy comparison and date selection.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    month: {
      control: { type: 'number', min: 1, max: 12 },
      description: 'Month number (1-12 for Gregorian)',
    },
    year: {
      control: { type: 'number', min: 2020, max: 2030 },
      description: 'Year number',
    },
    showToday: {
      control: 'boolean',
      description: 'Whether to highlight today\'s date',
    },
    onDateSelect: {
      description: 'Callback fired when a date is selected',
      action: 'date selected',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether component is in loading state',
    },
    className: {
      control: 'text',
      description: 'CSS class for container',
    },
  },
} satisfies Meta<typeof DualCalendarGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default usage with current month and year
 */
export const Default: Story = {
  args: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    showToday: true,
    isLoading: false,
  },
};

/**
 * With custom month selection
 */
export const CustomMonth: Story = {
  args: {
    month: 5,
    year: 2025,
    showToday: false,
    isLoading: false,
  },
};

/**
 * With today highlighted
 */
export const WithTodayHighlight: Story = {
  args: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    showToday: true,
    isLoading: false,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    showToday: true,
    isLoading: true,
  },
};

/**
 * Different months showcase
 */
export const SpringMonth: Story = {
  args: {
    month: 3,
    year: 2025,
    showToday: false,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Showing March (Spring) with both calendar systems',
      },
    },
  },
};

/**
 * Summer month showcase
 */
export const SummerMonth: Story = {
  args: {
    month: 6,
    year: 2025,
    showToday: false,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Showing June (Summer) with both calendar systems',
      },
    },
  },
};

/**
 * Interactive demo
 */
export const Interactive: Story = {
  args: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    showToday: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Try changing the month and year controls below to see different months in both calendars',
      },
    },
  },
};
