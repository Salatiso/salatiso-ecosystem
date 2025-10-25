import type { Meta, StoryObj } from '@storybook/react';
import { LunarDisplay } from './LunarDisplay';

/**
 * LunarDisplay component shows lunar phase information
 * 
 * Features:
 * - Current lunar phase visualization with emoji
 * - Illumination percentage
 * - Lunar age (days into cycle)
 * - Multiple size options
 * - Optional detailed information
 */
const meta = {
  title: 'Calendar/LunarDisplay',
  component: LunarDisplay,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A component that displays the current or specified lunar phase with illumination percentage and age information.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    date: {
      control: 'date',
      description: 'The date to show lunar phase for (defaults to today)',
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
      description: 'Size variant of the display',
    },
    showDetails: {
      control: 'boolean',
      description: 'Whether to show detailed information (illumination, age)',
    },
    showUpcoming: {
      control: { type: 'number', min: 0, max: 30 },
      description: 'Number of upcoming days to show phases for',
    },
    className: {
      control: 'text',
      description: 'CSS class for container',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether component is in loading state',
    },
  },
} satisfies Meta<typeof LunarDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default lunar display
 */
export const Default: Story = {
  args: {
    date: new Date(),
    size: 'md',
    showDetails: true,
    isLoading: false,
  },
};

/**
 * Small size variant
 */
export const Small: Story = {
  args: {
    date: new Date(),
    size: 'sm',
    showDetails: false,
    isLoading: false,
  },
};

/**
 * Large size variant with details
 */
export const Large: Story = {
  args: {
    date: new Date(),
    size: 'lg',
    showDetails: true,
    isLoading: false,
  },
};

/**
 * With upcoming days
 */
export const WithUpcoming: Story = {
  args: {
    date: new Date(),
    size: 'md',
    showDetails: true,
    showUpcoming: 7,
    isLoading: false,
  },
};

/**
 * Without details
 */
export const NoDetails: Story = {
  args: {
    date: new Date(),
    size: 'md',
    showDetails: false,
    isLoading: false,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    date: new Date(),
    size: 'md',
    showDetails: true,
    isLoading: true,
  },
};

/**
 * Full moon
 */
export const FullMoon: Story = {
  args: {
    date: new Date(2025, 10, 1), // Full moon example
    size: 'lg',
    showDetails: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Showing full moon lunar phase',
      },
    },
  },
};

/**
 * New moon
 */
export const NewMoon: Story = {
  args: {
    date: new Date(2025, 9, 29), // New moon example
    size: 'lg',
    showDetails: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Showing new moon lunar phase',
      },
    },
  },
};
