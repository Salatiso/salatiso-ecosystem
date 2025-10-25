import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SonnyTemplateCard } from '@/components/templates/SonnyTemplateCard';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1', displayName: 'Tester' } })
}));

jest.mock('@/hooks/useSonnyServices', () => ({
  useSonnyServices: () => ({ familyMembers: [] }),
  useSonnyBridge: () => ({ sendFamilyMessage: jest.fn() })
}));

describe('SonnyTemplateCard', () => {
  it('starts individual collaboration by opening template', () => {
    // jsdom open mock
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null as any);

    render(
      <SonnyTemplateCard
        templateId="t1"
        templateName="Ubuntu Personal Development"
        templateCategory="personal"
        templatePath="/templates/personal/p1.html"
        collaborationMode="individual"
        ubuntuPrinciples={["Personal growth serves community"]}
        onStartCollaboration={() => {}}
      />
    );

    const startBtn = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startBtn);

    expect(openSpy).toHaveBeenCalled();
    openSpy.mockRestore();
  });
});
