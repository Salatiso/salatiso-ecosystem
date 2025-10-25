/**
 * Test Utilities and Helpers
 * 
 * Common utilities for all test files
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Test Data Factories
 */

export const createMockUser = (overrides = {}) => ({
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  role: 'member',
  familyId: 'test-family-123',
  ...overrides,
});

export const createMockElder = (overrides = {}) => ({
  uid: 'elder-123',
  email: 'elder@example.com',
  displayName: 'Test Elder',
  role: 'elder',
  familyId: 'test-family-123',
  ...overrides,
});

export const createMockFamily = (overrides = {}) => ({
  id: 'test-family-123',
  name: 'Test Family',
  members: ['elder-123', 'member-456', 'member-789'],
  createdAt: Timestamp.now(),
  elderId: 'elder-123',
  ...overrides,
});

export const createMockTemplate = (overrides = {}) => ({
  id: 'template-123',
  templateId: 'f1-business-together',
  familyId: 'test-family-123',
  title: 'Business Together Plan',
  content: '<p>Test content</p>',
  status: 'draft',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  createdBy: 'elder-123',
  ...overrides,
});

export const createMockVideoRoom = (overrides = {}) => ({
  id: 'room-123',
  name: 'Family Planning Session',
  familyId: 'test-family-123',
  url: 'https://test.daily.co/test-room',
  status: 'active',
  createdBy: 'elder-123',
  createdAt: Timestamp.now(),
  participants: [],
  consents: {},
  ...overrides,
});

export const createMockRecommendation = (overrides = {}) => ({
  id: 'rec-123',
  familyId: 'test-family-123',
  templateId: 'f1-business-together',
  templateName: 'Business Together Plan',
  relevanceScore: 0.85,
  reasons: [
    'Family expressed interest in starting a business',
    'Multiple adult members available to contribute',
    'Economic need identified in recent conversations',
  ],
  ubuntuAlignment: {
    respect: 0.9,
    community: 0.85,
    sharing: 0.8,
  },
  generatedAt: Timestamp.now(),
  status: 'pending',
  ...overrides,
});

export const createMockMetrics = (overrides = {}) => ({
  totalMembers: 5,
  activeMembers: 4,
  templatesCreated: 12,
  templatesCompleted: 8,
  videoCallsHeld: 15,
  avgCallDuration: 45,
  coEditingSessions: 20,
  avgSessionDuration: 30,
  ubuntuScore: 85,
  businessImpactScore: 75,
  ...overrides,
});

export const createMockAnalyticsEvent = (overrides = {}) => ({
  id: 'event-123',
  familyId: 'test-family-123',
  userId: 'test-user-123',
  eventType: 'template_created',
  timestamp: Timestamp.now(),
  metadata: {},
  ...overrides,
});

/**
 * Mock Firebase Functions
 */

export const mockFirestore = () => {
  const data = new Map();

  return {
    collection: jest.fn((collectionName: string) => ({
      doc: jest.fn((docId: string) => ({
        get: jest.fn(async () => ({
          exists: () => data.has(`${collectionName}/${docId}`),
          data: () => data.get(`${collectionName}/${docId}`),
          id: docId,
        })),
        set: jest.fn(async (docData: any) => {
          data.set(`${collectionName}/${docId}`, docData);
        }),
        update: jest.fn(async (updates: any) => {
          const existing = data.get(`${collectionName}/${docId}`) || {};
          data.set(`${collectionName}/${docId}`, { ...existing, ...updates });
        }),
        delete: jest.fn(async () => {
          data.delete(`${collectionName}/${docId}`);
        }),
        onSnapshot: jest.fn((callback: Function) => {
          callback({
            exists: () => data.has(`${collectionName}/${docId}`),
            data: () => data.get(`${collectionName}/${docId}`),
            id: docId,
          });
          return jest.fn(); // Unsubscribe function
        }),
      })),
      add: jest.fn(async (docData: any) => {
        const id = Math.random().toString(36).substr(2, 9);
        data.set(`${collectionName}/${id}`, docData);
        return { id };
      }),
      where: jest.fn(() => ({
        get: jest.fn(async () => ({
          docs: Array.from(data.entries())
            .filter(([key]) => key.startsWith(`${collectionName}/`))
            .map(([key, value]) => ({
              id: key.split('/')[1],
              data: () => value,
              exists: () => true,
            })),
        })),
      })),
    })),
    
    // Helper to seed test data
    _seedData: (collectionName: string, docId: string, docData: any) => {
      data.set(`${collectionName}/${docId}`, docData);
    },
    
    // Helper to clear all data
    _clearData: () => {
      data.clear();
    },
  };
};

/**
 * Mock Daily.co Video
 */

export const mockDailyCall = () => ({
  join: jest.fn().mockResolvedValue(undefined),
  leave: jest.fn().mockResolvedValue(undefined),
  startRecording: jest.fn().mockResolvedValue(undefined),
  stopRecording: jest.fn().mockResolvedValue(undefined),
  participants: jest.fn().mockReturnValue({}),
  on: jest.fn(),
  off: jest.fn(),
  destroy: jest.fn(),
  setLocalVideo: jest.fn(),
  setLocalAudio: jest.fn(),
  sendAppMessage: jest.fn(),
});

/**
 * Mock OpenAI
 */

export const mockOpenAI = () => ({
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                recommendations: [
                  {
                    templateId: 'f1-business-together',
                    templateName: 'Business Together Plan',
                    relevanceScore: 0.85,
                    reasons: ['Test reason 1', 'Test reason 2'],
                    ubuntuAlignment: { respect: 0.9, community: 0.85, sharing: 0.8 },
                  },
                ],
              }),
            },
          },
        ],
      }),
    },
  },
});

/**
 * Mock Yjs Document
 */

export const mockYjsDoc = () => {
  const text = { toString: jest.fn(() => 'Test content') };
  return {
    getText: jest.fn(() => text),
    on: jest.fn(),
    off: jest.fn(),
    destroy: jest.fn(),
  };
};

/**
 * Mock WebSocket Provider
 */

export const mockWebsocketProvider = () => ({
  on: jest.fn(),
  off: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
  destroy: jest.fn(),
  awareness: {
    setLocalState: jest.fn(),
    getStates: jest.fn(() => new Map()),
    on: jest.fn(),
    off: jest.fn(),
  },
});

/**
 * Wait Utilities
 */

export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const waitForCondition = async (
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await waitFor(interval);
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
};

/**
 * Test Assertions
 */

export const assertUbuntuPrinciples = (action: any) => {
  expect(action).toHaveProperty('consent');
  expect(action).toHaveProperty('respectForElders');
  expect(action).toHaveProperty('collectiveDecision');
};

export const assertTemplateStructure = (template: any) => {
  expect(template).toHaveProperty('id');
  expect(template).toHaveProperty('familyId');
  expect(template).toHaveProperty('title');
  expect(template).toHaveProperty('content');
  expect(template).toHaveProperty('status');
  expect(template).toHaveProperty('createdAt');
  expect(template).toHaveProperty('createdBy');
};

export const assertMetricsStructure = (metrics: any) => {
  expect(metrics).toHaveProperty('totalMembers');
  expect(metrics).toHaveProperty('activeMembers');
  expect(metrics).toHaveProperty('templatesCreated');
  expect(metrics).toHaveProperty('templatesCompleted');
  expect(metrics).toHaveProperty('ubuntuScore');
  expect(typeof metrics.ubuntuScore).toBe('number');
  expect(metrics.ubuntuScore).toBeGreaterThanOrEqual(0);
  expect(metrics.ubuntuScore).toBeLessThanOrEqual(100);
};

/**
 * Snapshot Utilities
 */

export const createMockSnapshot = (overrides = {}) => ({
  id: 'snapshot-123',
  documentId: 'template-123',
  version: 1,
  content: '<p>Test content</p>',
  createdBy: 'test-user-123',
  createdAt: Timestamp.now(),
  description: 'Test snapshot',
  ...overrides,
});

/**
 * Performance Testing
 */

export const measurePerformance = async (fn: () => Promise<void>) => {
  const startTime = performance.now();
  await fn();
  const endTime = performance.now();
  return endTime - startTime;
};

export const assertPerformance = async (
  fn: () => Promise<void>,
  maxDuration: number,
  description: string
) => {
  const duration = await measurePerformance(fn);
  expect(duration).toBeLessThan(maxDuration);
  console.log(`✓ ${description}: ${duration.toFixed(2)}ms (max: ${maxDuration}ms)`);
};

/**
 * Cleanup Utilities
 */

export const cleanupTestData = async (firestore: any, familyId: string) => {
  // Delete all test data for a family
  const collections = [
    'families',
    'templates',
    'videoRooms',
    'recommendations',
    'analytics',
    'snapshots',
  ];

  for (const collection of collections) {
    const snapshot = await firestore.collection(collection)
      .where('familyId', '==', familyId)
      .get();

    for (const doc of snapshot.docs) {
      await doc.ref.delete();
    }
  }
};

/**
 * Mock Auth Context
 */

export const createMockAuthContext = (user = createMockUser()) => ({
  currentUser: user,
  loading: false,
  error: null,
  login: jest.fn(),
  logout: jest.fn(),
  updateProfile: jest.fn(),
});

/**
 * Render with Providers (for React Testing Library)
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  // TODO: Add providers when needed
  // const Wrapper = ({ children }: { children: React.ReactNode }) => (
  //   <AuthContext.Provider value={mockAuthContext}>
  //     <I18nContext.Provider value={mockI18nContext}>
  //       {children}
  //     </I18nContext.Provider>
  //   </AuthContext.Provider>
  // );

  return render(ui, options);
};
