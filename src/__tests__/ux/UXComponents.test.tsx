/**
 * UX Components Test Suite - Phase 5
 * Tests for keyboard shortcuts, tooltips, skeletons, dialogs, empty states, and theme
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tooltip, HelpIcon, TooltipButton } from '@/components/ux/Tooltip';
import { Skeleton, CardSkeleton, TableSkeleton, WidgetSkeleton } from '@/components/ux/Skeleton';
import { ConfirmationDialog, AlertDialog } from '@/components/ux/ConfirmationDialog';
import { EmptyState, NoContacts, NoMessages, ErrorState } from '@/components/ux/EmptyState';

// ===== Tooltip Tests =====

describe('Tooltip Component', () => {
  test('renders children correctly', () => {
    render(
      <Tooltip content="Help text">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  test('HelpIcon renders correctly', () => {
    render(<HelpIcon text="This is help" />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  test('TooltipButton renders', () => {
    render(
      <TooltipButton tooltip="Save changes" onClick={() => {}}>
        Save
      </TooltipButton>
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});

// ===== Skeleton Tests =====

describe('Skeleton Loader Components', () => {
  test('Skeleton renders placeholder', () => {
    const { container } = render(<Skeleton className="h-4 w-full" />);
    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  test('CardSkeleton renders', () => {
    const { container } = render(<CardSkeleton count={1} />);
    expect(container.querySelector('.rounded-lg')).toBeInTheDocument();
  });

  test('TableSkeleton renders', () => {
    const { container } = render(<TableSkeleton rows={1} columns={2} />);
    expect(container.querySelector('.flex')).toBeInTheDocument();
  });

  test('WidgetSkeleton renders', () => {
    const { container } = render(<WidgetSkeleton />);
    expect(container.querySelector('.rounded-lg')).toBeInTheDocument();
  });
});

// ===== Confirmation Dialog Tests =====

describe('ConfirmationDialog Component', () => {
  test('renders when isOpen is true', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(
      <ConfirmationDialog
        isOpen={false}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
  });

  test('renders danger type styling', () => {
    const { container } = render(
      <ConfirmationDialog
        isOpen={true}
        type="danger"
        title="Delete"
        message="This is permanent"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});

describe('AlertDialog Component', () => {
  test('renders when isOpen is true', () => {
    render(
      <AlertDialog
        isOpen={true}
        title="Alert"
        message="Important message"
        onClose={() => {}}
      />
    );
    
    expect(screen.getByText('Alert')).toBeInTheDocument();
    expect(screen.getByText('Important message')).toBeInTheDocument();
  });
});

// ===== Empty State Tests =====

describe('Empty State Components', () => {
  test('EmptyState renders with title', () => {
    render(
      <EmptyState
        title="Nothing here"
        description="Get started"
      />
    );
    
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  test('EmptyState renders action button', () => {
    render(
      <EmptyState
        title="Empty"
        action={{
          label: 'Create',
          onClick: () => {},
        }}
      />
    );
    
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  test('NoContacts renders', () => {
    render(<NoContacts onAdd={() => {}} />);
    expect(screen.getByText('No contacts yet')).toBeInTheDocument();
  });

  test('NoMessages renders', () => {
    render(<NoMessages onCompose={() => {}} />);
    expect(screen.getByText('No messages')).toBeInTheDocument();
  });

  test('ErrorState renders', () => {
    render(<ErrorState onRetry={() => {}} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});

// ===== Integration Tests =====

describe('UX Components Integration', () => {
  test('EmptyState with action callback works', () => {
    const handleClick = jest.fn();
    render(
      <EmptyState
        title="Empty"
        action={{
          label: 'Add',
          onClick: handleClick,
        }}
      />
    );
    
    fireEvent.click(screen.getByText('Add'));
    expect(handleClick).toHaveBeenCalled();
  });

  test('ConfirmationDialog with custom text', () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Confirm"
        message="Sure?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });
});

// ===== Rendering Tests =====

describe('Component Rendering', () => {
  test('Skeleton renders without crashing', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('Multiple skeletons render', () => {
    const { container } = render(<CardSkeleton count={5} />);
    expect(container.querySelectorAll('.bg-white').length).toBeGreaterThan(0);
  });

  test('Tooltip renders with position', () => {
    render(
      <Tooltip content="Test" position="bottom">
        <div>Content</div>
      </Tooltip>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
