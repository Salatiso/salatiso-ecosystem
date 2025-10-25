import type { Meta, StoryObj } from '@storybook/react';
import { EventOverlayManager } from './EventOverlayManager';
import type { CalendarOverlay } from '@/types/calendar-systems';

/**
 * EventOverlayManager component provides calendar event management
 * 
 * Features:
 * - Event creation and editing
 * - Date/time overlays on calendar
 * - Event conflict detection
 * - Seasonal and lunar context
 * - Multi-calendar support
 */

const mockOnSaved = (overlay: CalendarOverlay) => {
  console.log('Event overlay saved:', overlay);
};

const meta = {
  title: 'Calendar/EventOverlayManager',
  component: EventOverlayManager,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'EventOverlayManager handles the creation, editing, and display of calendar events across multiple calendar systems with conflict detection and context awareness.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    eventId: {
      control: 'text',
      description: 'Unique identifier for the event',
    },
    initialDate: {
      control: 'date',
      description: 'Initial date for the event',
    },
    className: {
      control: 'text',
      description: 'CSS class for container',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether component is in loading state',
    },
    onSaved: {
      description: 'Callback when event is saved',
      action: 'event saved',
    },
    existingOverlays: {
      description: 'Array of existing event overlays to check for conflicts',
    },
  },
} satisfies Meta<typeof EventOverlayManager>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default event overlay manager
 */
export const Default: Story = {
  args: {
    eventId: 'evt-001',
    initialDate: new Date(),
    className: undefined,
    isLoading: false,
    onSaved: mockOnSaved,
    existingOverlays: [],
  },
};

/**
 * With save callback
 */
export const WithCallback: Story = {
  args: {
    eventId: 'evt-002',
    initialDate: new Date(),
    className: undefined,
    isLoading: false,
    onSaved: (overlay: CalendarOverlay) => {
      console.log('Event overlay saved with callback:', overlay);
      alert(`Event overlay ${overlay.id} saved successfully`);
    },
    existingOverlays: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Event manager with alert callback when event is saved',
      },
    },
  },
};

/**
 * With existing overlays (conflict detection)
 */
export const WithOverlays: Story = {
  args: {
    eventId: 'evt-003',
    initialDate: new Date(),
    className: undefined,
    isLoading: false,
    onSaved: mockOnSaved,
    existingOverlays: [
      {
        id: 'overlay-1',
        eventId: 'evt-existing-1',
        calendarSystemId: 'gregorian',
        convertedDate: {
          year: 2025,
          month: 1,
          day: 15,
          monthName: 'January',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'overlay-2',
        eventId: 'evt-existing-2',
        calendarSystemId: 'natural13',
        convertedDate: {
          year: 2025,
          month: 5,
          day: 15,
          monthName: 'Planting Moon',
          seasonalPosition: '15th day of Planting Moon',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Event manager showing existing overlays and conflict detection',
      },
    },
  },
};

/**
 * Different event ID
 */
export const DifferentEvent: Story = {
  args: {
    eventId: 'team-sprint-planning',
    initialDate: new Date(2025, 2, 15), // March 15, 2025
    className: undefined,
    isLoading: false,
    onSaved: mockOnSaved,
    existingOverlays: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Event manager with a different event and custom initial date',
      },
    },
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    eventId: 'evt-loading',
    initialDate: new Date(),
    className: undefined,
    isLoading: true,
    onSaved: mockOnSaved,
    existingOverlays: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Event manager in loading state while fetching event data',
      },
    },
  },
};

/**
 * Interactive event manager
 */
export const Interactive: Story = {
  args: {
    eventId: 'evt-interactive',
    initialDate: new Date(),
    className: undefined,
    isLoading: false,
    onSaved: mockOnSaved,
    existingOverlays: [
      {
        id: 'overlay-sample-1',
        eventId: 'evt-sample-1',
        calendarSystemId: 'gregorian',
        convertedDate: {
          year: 2025,
          month: new Date().getMonth() + 1,
          day: new Date().getDate(),
          monthName: new Date().toLocaleString('default', { month: 'long' }),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Try interacting with the event manager to create or edit events and see conflict detection in action',
      },
    },
  },
};

/**
 * Seasonal event
 */
export const SeasonalEvent: Story = {
  args: {
    eventId: 'seasonal-solstice',
    initialDate: new Date(2025, 5, 21), // June 21 (Summer Solstice)
    className: undefined,
    isLoading: false,
    onSaved: mockOnSaved,
    existingOverlays: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Event manager for seasonal events with solstice/equinox context',
      },
    },
  },
};
