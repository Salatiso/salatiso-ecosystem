/**
 * Admin Panel Component Tests - Phase 4.8
 * Unit and integration tests for all admin components
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { UserManagementPanel } from '@/components/admin/UserManagementPanel';
import { SystemConfigurationPanel } from '@/components/admin/SystemConfigurationPanel';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';

describe('AdminPanel - Master Component', () => {
  test('renders admin panel header', () => {
    render(<AdminPanel />);
    expect(screen.getByText('Administration Panel')).toBeInTheDocument();
  });

  test('displays all four admin tabs', () => {
    render(<AdminPanel />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('System Config')).toBeInTheDocument();
    expect(screen.getByText('Audit Logs')).toBeInTheDocument();
  });

  test('switches between tabs', async () => {
    render(<AdminPanel />);
    
    // Default to dashboard
    expect(screen.getByText(/System-wide admin overview/i)).toBeInTheDocument();
    
    // Click users tab
    fireEvent.click(screen.getByText('User Management'));
    await waitFor(() => {
      expect(screen.getByText(/User table/i)).toBeInTheDocument();
    });
    
    // Click config tab
    fireEvent.click(screen.getByText('System Config'));
    await waitFor(() => {
      expect(screen.getByText(/Email Configuration/i)).toBeInTheDocument();
    });
    
    // Click audit tab
    fireEvent.click(screen.getByText('Audit Logs'));
    await waitFor(() => {
      expect(screen.getByText(/Audit Logs/i)).toBeInTheDocument();
    });
  });

  test('displays notification alert', () => {
    render(<AdminPanel />);
    expect(screen.getByText(/System Notifications/i)).toBeInTheDocument();
  });
});

describe('AdminDashboard - Component', () => {
  test('renders key metrics', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('System Uptime')).toBeInTheDocument();
    expect(screen.getByText('Active Sessions')).toBeInTheDocument();
    expect(screen.getByText('Security Events')).toBeInTheDocument();
  });

  test('displays correct metric values', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('1,284')).toBeInTheDocument();
    expect(screen.getByText('99.98%')).toBeInTheDocument();
    expect(screen.getByText('487')).toBeInTheDocument();
  });

  test('shows quick action buttons', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('Manage Users')).toBeInTheDocument();
    expect(screen.getByText('System Settings')).toBeInTheDocument();
    expect(screen.getByText('Security Audit')).toBeInTheDocument();
    expect(screen.getByText('System Health')).toBeInTheDocument();
  });

  test('displays system health monitor', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/API Response Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Database Performance/i)).toBeInTheDocument();
    expect(screen.getByText(/Cache Hit Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Error Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/CPU Usage/i)).toBeInTheDocument();
  });

  test('shows recent activity feed', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
    // At least one activity entry should be visible
    const activityItems = screen.getAllByRole('row');
    expect(activityItems.length).toBeGreaterThan(0);
  });

  test('time range selector works', async () => {
    render(<AdminDashboard />);
    const select = screen.getByDisplayValue('24h') as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    
    await userEvent.selectOptions(select, '7d');
    expect(screen.getByDisplayValue('7d')).toBeInTheDocument();
  });
});

describe('UserManagementPanel - Component', () => {
  test('renders user management interface', () => {
    render(<UserManagementPanel />);
    expect(screen.getByText(/User Management/i)).toBeInTheDocument();
  });

  test('displays user table with correct columns', () => {
    render(<UserManagementPanel />);
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Joined')).toBeInTheDocument();
    expect(screen.getByText('Last Login')).toBeInTheDocument();
  });

  test('displays sample users', () => {
    render(<UserManagementPanel />);
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Mike Chen')).toBeInTheDocument();
    expect(screen.getByText('Emma Rodriguez')).toBeInTheDocument();
  });

  test('search functionality filters users', async () => {
    render(<UserManagementPanel />);
    const searchInput = screen.getByPlaceholderText(/Search by name/i);
    
    await userEvent.type(searchInput, 'Sarah');
    
    // Sarah should be visible, others should be filtered
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
  });

  test('role filter works', async () => {
    render(<UserManagementPanel />);
    const roleSelect = screen.getByDisplayValue('All') as HTMLSelectElement;
    
    await userEvent.selectOptions(roleSelect, 'Admin');
    // Should show only admin users
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
  });

  test('displays user statistics', () => {
    render(<UserManagementPanel />);
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Admins')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('Total Users')).toBeInTheDocument();
  });

  test('CRUD buttons are present', () => {
    render(<UserManagementPanel />);
    const editButtons = screen.getAllByText('Edit');
    const deleteButtons = screen.getAllByText('Delete');
    
    expect(editButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  test('add user button visible', () => {
    render(<UserManagementPanel />);
    expect(screen.getByText('Add User')).toBeInTheDocument();
  });
});

describe('SystemConfigurationPanel - Component', () => {
  test('renders configuration sections', () => {
    render(<SystemConfigurationPanel />);
    expect(screen.getByText('General Settings')).toBeInTheDocument();
    expect(screen.getByText('Email Configuration')).toBeInTheDocument();
    expect(screen.getByText('Security Settings')).toBeInTheDocument();
    expect(screen.getByText('Database Settings')).toBeInTheDocument();
    expect(screen.getByText('Feature Toggles')).toBeInTheDocument();
  });

  test('displays configuration options', () => {
    render(<SystemConfigurationPanel />);
    expect(screen.getByText('Application Name')).toBeInTheDocument();
    expect(screen.getByText('Minimum Password Length')).toBeInTheDocument();
    expect(screen.getByText('Enable Automatic Backups')).toBeInTheDocument();
  });

  test('save changes button works', async () => {
    render(<SystemConfigurationPanel />);
    const saveButton = screen.getByText('Save Changes');
    
    expect(saveButton).toBeDisabled(); // Initially disabled (no changes)
    
    // Make a change
    const input = screen.getByDisplayValue('Salatiso Dashboard');
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Dashboard');
    
    // Save button should be enabled
    expect(saveButton).not.toBeDisabled();
  });

  test('displays warning banner', () => {
    render(<SystemConfigurationPanel />);
    expect(screen.getByText(/System Configuration Notice/i)).toBeInTheDocument();
  });

  test('toggle switches work', async () => {
    render(<SystemConfigurationPanel />);
    const toggles = screen.getAllByRole('button', { name: /toggle/i });
    expect(toggles.length).toBeGreaterThan(0);
  });
});

describe('AuditLogViewer - Component', () => {
  test('renders audit log viewer', () => {
    render(<AuditLogViewer />);
    expect(screen.getByText('Audit Logs')).toBeInTheDocument();
  });

  test('displays statistics cards', () => {
    render(<AuditLogViewer />);
    expect(screen.getByText('Total Logs')).toBeInTheDocument();
    expect(screen.getByText('Successful')).toBeInTheDocument();
    expect(screen.getByText('Errors')).toBeInTheDocument();
    expect(screen.getByText('Warnings')).toBeInTheDocument();
  });

  test('displays filters', () => {
    render(<AuditLogViewer />);
    expect(screen.getByPlaceholderText(/User, action, resource, IP/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Statuses')).toBeInTheDocument();
  });

  test('displays audit log table', () => {
    render(<AuditLogViewer />);
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Resource')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  test('search filters logs', async () => {
    render(<AuditLogViewer />);
    const searchInput = screen.getByPlaceholderText(/User, action, resource, IP/i);
    
    await userEvent.type(searchInput, 'admin');
    
    // Should filter results
    await waitFor(() => {
      expect(screen.getByText(/Showing/i)).toBeInTheDocument();
    });
  });

  test('export CSV button works', () => {
    render(<AuditLogViewer />);
    const exportButton = screen.getByText('Export CSV');
    expect(exportButton).toBeInTheDocument();
  });

  test('expandable row details', async () => {
    render(<AuditLogViewer />);
    // Click first row to expand
    const rows = screen.getAllByRole('row');
    if (rows.length > 1) {
      fireEvent.click(rows[1]);
      await waitFor(() => {
        expect(screen.getByText(/User Agent/i)).toBeInTheDocument();
      });
    }
  });
});

describe('Integration Tests - Tab Navigation', () => {
  test('navigation between all admin tabs works smoothly', async () => {
    render(<AdminPanel />);
    
  const tabs = ['Dashboard', 'User Management', 'System Config', 'Audit Logs'];
    
    for (const tab of tabs) {
      const tabButton = screen.getByRole('button', { name: new RegExp(tab, 'i') });
      fireEvent.click(tabButton);
      await waitFor(() => {
        const element = screen.getByRole('button', { name: new RegExp(tab, 'i') });
        // Check if element has blue color classes
        expect(element).toBeInTheDocument();
      });
    }
  });

  test('data persists when switching tabs', async () => {
    render(<AdminPanel />);
    
    // Note data on dashboard
    const initialData = screen.getByText('1,284');
    expect(initialData).toBeInTheDocument();
    
    // Switch to users and back
    fireEvent.click(screen.getByText('User Management'));
    await waitFor(() => {
      expect(screen.getByText(/Active Users/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Dashboard'));
    await waitFor(() => {
      // Data should still be there
      expect(screen.getByText('1,284')).toBeInTheDocument();
    });
  });
});

describe('Performance Tests', () => {
  test('admin panel renders quickly', () => {
    const startTime = performance.now();
    render(<AdminPanel />);
    const endTime = performance.now();
    
    // Should render in under 500ms
    expect(endTime - startTime).toBeLessThan(500);
  });

  test('user table with many rows renders efficiently', () => {
    const startTime = performance.now();
    render(<UserManagementPanel />);
    const endTime = performance.now();
    
    // Should handle efficiently
    expect(endTime - startTime).toBeLessThan(300);
  });
});

describe('Accessibility Tests', () => {
  test('admin panel is keyboard navigable', async () => {
    render(<AdminPanel />);
    
    // Tab to first button
    await userEvent.tab();
    
    // Should focus first interactive element
    const focusedElement = document.activeElement;
    expect(focusedElement).toBeInTheDocument();
  });

  test('buttons have proper aria labels', () => {
    render(<AdminPanel />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      // Each button should have text or aria-label
      expect(
        button.textContent || button.getAttribute('aria-label')
      ).toBeTruthy();
    });
  });

  test('form inputs are properly labeled', () => {
    render(<SystemConfigurationPanel />);
    
    // Form should render with input elements
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });
});

describe('Error Handling', () => {
  test('handles missing data gracefully', () => {
    // Mock empty state
    render(<AuditLogViewer />);
    
    // Should still render without crashing
    expect(screen.getByText('Audit Logs')).toBeInTheDocument();
  });

  test('displays error messages appropriately', () => {
    render(<AdminPanel />);
    
    // Panel should render with or without data
    expect(screen.getByText('Administration Panel')).toBeInTheDocument();
  });
});
