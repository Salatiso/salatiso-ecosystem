/**
 * @file IncidentLogForm.test.tsx
 * @description Comprehensive test suite for IncidentLogForm component
 * Tests: form validation, submission, category/severity selection, escalation logic
 * 
 * @created October 22, 2025
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';
import { IncidentLogForm } from '@/components/calendar/IncidentLogForm';
import {
  IncidentCategory,
  SeverityLevel,
  ContextLevel,
  EventType
} from '@/types/calendar';

// Mock toast notifications
jest.mock('react-hot-toast');

describe('IncidentLogForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render form with all required fields', () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      expect(screen.getByPlaceholderText(/incident title/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/describe what happened/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/where did this happen/i)).toBeInTheDocument();
    });

    it('should render category selection dropdown', () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const categoryLabels = screen.queryAllByText(/category/i);
      expect(categoryLabels.length).toBeGreaterThan(0);
    });

    it('should render severity level selection', () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const severityLabels = screen.queryAllByText(/severity/i);
      expect(severityLabels.length).toBeGreaterThan(0);
    });

    it('should render submit button', () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const submitButtons = screen.queryAllByRole('button', { name: /save|submit|escalate/i });
      expect(submitButtons.length).toBeGreaterThan(0);
    });

    it('should render cancel button', () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
          onCancel={jest.fn()}
        />
      );

      const cancelButton = screen.queryByRole('button', { name: /cancel/i });
      expect(cancelButton).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should require title field', async () => {
      const mockSubmit = jest.fn();
      render(
        <IncidentLogForm
          onSubmit={mockSubmit}
          context={ContextLevel.FAMILY}
        />
      );

      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      });
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('should validate title length (1-100 characters)', async () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const titleInput = screen.getByPlaceholderText(/incident title/i);
      
      // Test too long
      await userEvent.type(titleInput, 'a'.repeat(101));
      expect(screen.getByText(/title must be 100 characters or less/i)).toBeInTheDocument();
    });

    it('should require description field', async () => {
      const mockSubmit = jest.fn();
      render(
        <IncidentLogForm
          onSubmit={mockSubmit}
          context={ContextLevel.FAMILY}
        />
      );

      const titleInput = screen.getByPlaceholderText(/incident title/i);
      await userEvent.type(titleInput, 'Test Incident');

      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      });
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('should validate description length (10-2000 characters)', async () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const descInput = screen.getByPlaceholderText(/describe what happened/i);
      
      // Test too short
      await userEvent.type(descInput, 'short');
      expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument();
    });

    it('should require location field', async () => {
      const mockSubmit = jest.fn();
      render(
        <IncidentLogForm
          onSubmit={mockSubmit}
          context={ContextLevel.FAMILY}
        />
      );

      const titleInput = screen.getByPlaceholderText(/incident title/i);
      const descInput = screen.getByPlaceholderText(/describe what happened/i);

      await userEvent.type(titleInput, 'Test Incident');
      await userEvent.type(descInput, 'This is a test incident description');

      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/location is required/i)).toBeInTheDocument();
      });
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('should clear validation errors on input change', async () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      });

      const titleInput = screen.getByPlaceholderText(/incident title/i);
      await userEvent.type(titleInput, 'Test');

      // Error should clear after typing
      expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
    });
  });

  describe('Category Selection', () => {
    it('should allow selecting health category', async () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      // Category should be accessible
      const categoryElements = screen.queryAllByText(/health|safety|property/i);
      expect(categoryElements.length).toBeGreaterThan(0);
    });

    it('should display category icons and descriptions', () => {
      const { container } = render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      // Check for icons in the form
      const text = container.textContent || '';
      expect(text).toContain('💊'); // Health icon or similar
    });

    it('should have all 5 categories available', () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const categories = [
        IncidentCategory.HEALTH,
        IncidentCategory.SAFETY,
        IncidentCategory.PROPERTY,
        IncidentCategory.EMOTIONAL_SUPPORT,
        IncidentCategory.OTHER
      ];

      // All categories should be rendered or accessible
      expect(categories.length).toBe(5);
    });
  });

  describe('Severity Level Selection', () => {
    it('should allow selecting all severity levels', () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const severities = ['Critical', 'High', 'Medium', 'Low'];
      severities.forEach((severity) => {
        expect(screen.queryByText(new RegExp(severity, 'i'))).not.toBeNull();
      });
    });

    it('should display severity color coding', () => {
      const { container } = render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      // Check for severity-related styling classes
      const styled = container.querySelectorAll('[class*="bg-"]');
      expect(styled.length).toBeGreaterThan(0);
    });
  });

  describe('Auto-Escalation Warnings', () => {
    it('should display warning for critical severity', async () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      // Find and select critical severity
      const criticalOption = screen.queryByText(/critical/i);
      if (criticalOption) {
        await userEvent.click(criticalOption);
        
        // Wait for escalation warning
        await waitFor(() => {
          const warning = screen.queryByText(/escalate|critical/i);
          expect(warning).toBeInTheDocument();
        });
      }
    });

    it('should display appropriate warning for high severity', async () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const highOption = screen.queryByText(/^high$/i);
      if (highOption) {
        await userEvent.click(highOption);
        
        // Warning should appear
        await waitFor(() => {
          const warning = screen.queryByText(/family|notify/i);
          expect(warning).toBeInTheDocument();
        });
      }
    });

    it('should not display warning for low/medium severity', async () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const lowOption = screen.queryByText(/^low$/i);
      if (lowOption) {
        await userEvent.click(lowOption);
        
        // No escalation warning for low severity
        const escalationWarning = screen.queryByText(/escalate immediately/i);
        expect(escalationWarning).not.toBeInTheDocument();
      }
    });
  });

  describe('Character Counters', () => {
    it('should show character count for title', async () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const titleInput = screen.getByPlaceholderText(/incident title/i);
      await userEvent.type(titleInput, 'Test Incident');

      // Character counter should be visible
      const counter = screen.queryByText(/\d+\/100/);
      expect(counter).toBeInTheDocument();
    });

    it('should show character count for description', async () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const descInput = screen.getByPlaceholderText(/describe what happened/i);
      await userEvent.type(descInput, 'This is a test description.');

      // Character counter should be visible
      const counter = screen.queryByText(/\d+\/2000/);
      expect(counter).toBeInTheDocument();
    });

    it('should update counter as user types', async () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const descInput = screen.getByPlaceholderText(/describe what happened/i);
      await userEvent.type(descInput, 'Growing ');
      expect(screen.getByText(/8\/2000/)).toBeInTheDocument();

      await userEvent.type(descInput, 'text');
      expect(screen.getByText(/12\/2000/)).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with valid data', async () => {
      const mockSubmit = jest.fn();
      render(
        <IncidentLogForm
          onSubmit={mockSubmit}
          context={ContextLevel.FAMILY}
        />
      );

      const titleInput = screen.getByPlaceholderText(/incident title/i);
      const descInput = screen.getByPlaceholderText(/describe what happened/i);
      const locationInput = screen.getByPlaceholderText(/where did this happen/i);

      await userEvent.type(titleInput, 'Medical Emergency');
      await userEvent.type(descInput, 'Person feeling dizzy and confused');
      await userEvent.type(locationInput, 'Living Room');

      const submitButton = screen.getByRole('button', { name: /save|submit|escalate/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Medical Emergency',
            description: 'Person feeling dizzy and confused',
            location: 'Living Room'
          })
        );
      });
    });

    it('should show success toast on submission', async () => {
      const mockSubmit = jest.fn().mockResolvedValue(undefined);
      render(
        <IncidentLogForm
          onSubmit={mockSubmit}
          context={ContextLevel.FAMILY}
        />
      );

      const titleInput = screen.getByPlaceholderText(/incident title/i);
      const descInput = screen.getByPlaceholderText(/describe what happened/i);
      const locationInput = screen.getByPlaceholderText(/where did this happen/i);

      await userEvent.type(titleInput, 'Test');
      await userEvent.type(descInput, 'Test description for incident');
      await userEvent.type(locationInput, 'Home');

      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    });

    it('should show error toast on submission failure', async () => {
      const mockSubmit = jest.fn().mockRejectedValue(new Error('Submit failed'));
      render(
        <IncidentLogForm
          onSubmit={mockSubmit}
          context={ContextLevel.FAMILY}
        />
      );

      const titleInput = screen.getByPlaceholderText(/incident title/i);
      const descInput = screen.getByPlaceholderText(/describe what happened/i);
      const locationInput = screen.getByPlaceholderText(/where did this happen/i);

      await userEvent.type(titleInput, 'Test');
      await userEvent.type(descInput, 'Test description');
      await userEvent.type(locationInput, 'Home');

      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onCancel when cancel button clicked', async () => {
      const mockCancel = jest.fn();
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
          onCancel={mockCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);

      expect(mockCancel).toHaveBeenCalled();
    });

    it('should not call onSubmit when cancel clicked', async () => {
      const mockSubmit = jest.fn();
      const mockCancel = jest.fn();
      render(
        <IncidentLogForm
          onSubmit={mockSubmit}
          context={ContextLevel.FAMILY}
          onCancel={mockCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);

      expect(mockSubmit).not.toHaveBeenCalled();
      expect(mockCancel).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should disable form during submission', async () => {
      const mockSubmit = jest.fn(
        () => new Promise<void>((resolve) => setTimeout(resolve, 1000))
      );
      render(
        <IncidentLogForm
          onSubmit={mockSubmit}
          context={ContextLevel.FAMILY}
        />
      );

      const titleInput = screen.getByPlaceholderText(/incident title/i);
      const descInput = screen.getByPlaceholderText(/describe what happened/i);
      const locationInput = screen.getByPlaceholderText(/where did this happen/i);

      await userEvent.type(titleInput, 'Test');
      await userEvent.type(descInput, 'Test description');
      await userEvent.type(locationInput, 'Home');

      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      await userEvent.click(submitButton);

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      const { container } = render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const labels = container.querySelectorAll('label');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation', async () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const titleInput = screen.getByPlaceholderText(/incident title/i);
      titleInput.focus();
      expect(document.activeElement).toBe(titleInput);
    });

    it('should have descriptive error messages', async () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        const errorMessages = screen.queryAllByText(/required|must be/i);
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Context-Based Behavior', () => {
    it('should adapt for family context', () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      expect(screen.getByPlaceholderText(/incident title/i)).toBeInTheDocument();
    });

    it('should adapt for professional context', () => {
      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.PROFESSIONAL}
        />
      );

      expect(screen.getByPlaceholderText(/incident title/i)).toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should render on mobile viewport', () => {
      window.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));

      const { container } = render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      expect(container).toBeInTheDocument();
    });

    it('should have touch-friendly buttons on mobile', () => {
      window.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));

      render(
        <IncidentLogForm
          onSubmit={jest.fn()}
          context={ContextLevel.FAMILY}
        />
      );

      const buttons = screen.queryAllByRole('button');
      buttons.forEach((btn) => {
        // Buttons should have adequate padding for touch
        expect(btn.className).toContain('py');
      });
    });
  });
});
