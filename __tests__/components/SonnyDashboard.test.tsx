import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SonnyDashboard from '@/components/SonnyDashboard';

jest.mock('@/hooks/useSonnyServices', () => ({
  useSonnyServices: () => ({
    state: { isInitialized: true, meshStatus: 'online', isConnecting: false, connectionCount: 2 },
    familyMembers: [],
    safetyStatus: { isActive: false, activeTriggers: [], lastCheckIn: new Date() },
    services: {}
  }),
  useSonnyBridge: () => ({
    isConnected: true,
    connectionCount: 2,
    sendFamilyMessage: jest.fn().mockResolvedValue(true),
    broadcastStatusUpdate: jest.fn().mockResolvedValue(true)
  }),
  useSafetyManager: () => ({
    performCheckIn: jest.fn().mockResolvedValue(true),
    triggerEmergency: jest.fn().mockResolvedValue(true),
    setGeofence: jest.fn().mockResolvedValue(true)
  }),
  useConsentManager: () => ({
    requestPermission: jest.fn(),
    grantPermission: jest.fn(),
    checkPermission: jest.fn()
  }),
  useTrustNetwork: () => ({
    userTrustProfile: null,
    getTrustScore: jest.fn(),
    recordInteraction: jest.fn()
  })
}));

describe('SonnyDashboard', () => {
  it('renders and broadcasts status', async () => {
    render(<SonnyDashboard userId="u1" familyId="fam1" displayName="Tester" />);
    expect(screen.getByText(/Sonny Family Network/i)).toBeInTheDocument();

    const select = screen.getByDisplayValue('Available');
    fireEvent.change(select, { target: { value: 'Busy' } });

    const btn = screen.getByRole('button', { name: /Broadcast Status/i });
    fireEvent.click(btn);

    await waitFor(() => {
      // Expect no errors thrown; alert is used inside, which we can ignore for this smoke test
    });
  });
});
