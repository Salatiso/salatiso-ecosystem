import React from 'react';
import { render, screen } from '@testing-library/react';
import { SonnyNetworkWidget, WelcomeWidget, FamilyActivityWidget, QuickActionsWidget } from '@/components/dashboard/SonnyWidgets';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1', displayName: 'Tester' } })
}));

jest.mock('@/hooks/useSonnyServices', () => ({
  useSonnyServices: () => ({
    state: { meshStatus: 'online', connectionCount: 3 },
    familyMembers: [
      { id: 'f1', name: 'John', status: 'online', lastSeen: new Date(), role: 'parent', trustScore: 85 },
      { id: 'f2', name: 'Jane', status: 'away', lastSeen: new Date(), role: 'parent', trustScore: 90 }
    ],
    safetyStatus: { isActive: false, activeTriggers: [], lastCheckIn: new Date() }
  }),
  useSonnyBridge: () => ({ isConnected: true, connectionCount: 3, sendFamilyMessage: jest.fn() }),
  useSafetyManager: () => ({ performCheckIn: jest.fn(), triggerEmergency: jest.fn() })
}));

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn() })
}));

describe('Sonny Dashboard Widgets', () => {
  it('renders SonnyNetworkWidget', () => {
    render(<SonnyNetworkWidget />);
    expect(screen.getByText(/Sonny Network/i)).toBeInTheDocument();
  });

  it('renders WelcomeWidget with user name', () => {
    render(<WelcomeWidget />);
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  it('renders FamilyActivityWidget with family members', () => {
    render(<FamilyActivityWidget />);
    expect(screen.getByText(/Family Activity/i)).toBeInTheDocument();
  });

  it('renders QuickActionsWidget', () => {
    render(<QuickActionsWidget />);
    expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument();
  });
});
