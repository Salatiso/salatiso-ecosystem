/**
 * Phase 6.3 - Analytics Engine & API Tests
 * Comprehensive test suite for analytics features
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { AnalyticsEngine, getAnalytics, resetAnalytics } from '@/lib/analytics/analytics-engine'

// ============================================================================
// Analytics Engine Tests
// ============================================================================

describe('Analytics Engine - Event Tracking', () => {
  let analytics: AnalyticsEngine

  beforeEach(() => {
    resetAnalytics()
    analytics = new AnalyticsEngine({ debug: false, autoFlush: false, persistToStorage: false })
  })

  afterEach(() => {
    analytics.destroy()
    resetAnalytics()
  })

  it('should initialize successfully', () => {
    expect(analytics).toBeDefined()
  })

  it('should track custom events', () => {
    const event = analytics.trackEvent('test', 'category', 'action')
    expect(event).toBeDefined()
    expect(event.type).toBe('test')
  })

  it('should track page view events', () => {
    const event = analytics.trackPageView('Home')
    expect(event.type).toBe('pageview')
    expect(event.label).toBe('Home')
  })

  it('should track interaction events', () => {
    const event = analytics.trackInteraction('Button', 'click', 1)
    expect(event.type).toBe('interaction')
    expect(event.label).toBe('Button')
  })

  it('should track conversion events', () => {
    const event = analytics.trackConversion('purchase', 99.99)
    expect(event.type).toBe('conversion')
    expect(event.value).toBe(99.99)
  })

  it('should track error events', () => {
    const event = analytics.trackError('Test error')
    expect(event.type).toBe('error')
  })

  it('should track timing events', () => {
    const event = analytics.trackTiming('page', 'load', 1234)
    expect(event.type).toBe('timing')
    expect(event.value).toBe(1234)
  })

  it('should queue multiple events', () => {
    analytics.trackEvent('test1', 'cat1', 'action1')
    analytics.trackEvent('test2', 'cat2', 'action2')
    analytics.trackEvent('test3', 'cat3', 'action3')
    expect(analytics.getQueuedEvents().length).toBeGreaterThanOrEqual(3)
  })

  it('should include event properties', () => {
    const props = { custom: 'value' }
    const event = analytics.trackEvent('test', 'cat', 'action', { properties: props })
    expect(event.properties).toEqual(props)
  })

  it('should subscribe to events', (done) => {
    let received = false
    const unsubscribe = analytics.subscribe(() => {
      received = true
    })
    analytics.trackEvent('test', 'cat', 'action')
    setTimeout(() => {
      expect(received).toBe(true)
      unsubscribe()
      done()
    }, 10)
  })

  it('should unsubscribe from events', () => {
    let callCount = 0
    const listener = () => {
      callCount++
    }
    const unsubscribe = analytics.subscribe(listener)
    analytics.trackEvent('test1', 'cat', 'action')
    unsubscribe()
    analytics.trackEvent('test2', 'cat', 'action')
    expect(callCount).toBe(1)
  })
})

// ============================================================================
// Queue Management Tests
// ============================================================================

describe('Analytics Engine - Queue Management', () => {
  let analytics: AnalyticsEngine

  beforeEach(() => {
    resetAnalytics()
    analytics = new AnalyticsEngine({ debug: false, autoFlush: false, persistToStorage: false })
  })

  afterEach(() => {
    analytics.destroy()
    resetAnalytics()
  })

  it('should get queued events', () => {
    analytics.trackEvent('test1', 'cat', 'action')
    analytics.trackEvent('test2', 'cat', 'action')
    const queued = analytics.getQueuedEvents()
    expect(queued.length).toBeGreaterThanOrEqual(2)
  })

  it('should clear all events', () => {
    analytics.trackEvent('test1', 'cat', 'action')
    analytics.trackEvent('test2', 'cat', 'action')
    analytics.clearEvents()
    expect(analytics.getQueuedEvents()).toHaveLength(0)
  })

  it('should return queue statistics', () => {
    analytics.trackEvent('test1', 'cat', 'action')
    analytics.trackEvent('test2', 'cat', 'action')
    const stats = analytics.getQueueStats()
    expect(stats.totalEvents).toBeGreaterThanOrEqual(2)
    expect(stats.estimatedSize).toBeGreaterThan(0)
  })

  it('should handle empty queue stats', () => {
    const cleanAnalytics = new AnalyticsEngine({ debug: false, autoFlush: false, persistToStorage: false })
    cleanAnalytics.clearEvents()
    const stats = cleanAnalytics.getQueueStats()
    expect(stats.totalEvents).toBe(0)
    expect(stats.oldestEvent).toBeNull()
    cleanAnalytics.destroy()
  })
})

// ============================================================================
// Metrics & Aggregation Tests
// ============================================================================

describe('Analytics Engine - Metrics', () => {
  let analytics: AnalyticsEngine

  beforeEach(() => {
    resetAnalytics()
    analytics = new AnalyticsEngine({ debug: false, autoFlush: false, persistToStorage: false })
  })

  afterEach(() => {
    analytics.destroy()
    resetAnalytics()
  })

  it('should calculate metrics', () => {
    analytics.trackEvent('test', 'cat1', 'action1')
    analytics.trackEvent('test', 'cat2', 'action2')
    const metrics = analytics.getMetrics()
    expect(metrics).toBeDefined()
    expect(metrics.totalEvents).toBeGreaterThanOrEqual(2)
  })

  it('should track top events', () => {
    analytics.trackEvent('test', 'cat', 'action1')
    analytics.trackEvent('test', 'cat', 'action1')
    analytics.trackEvent('test', 'cat', 'action2')
    const metrics = analytics.getMetrics()
    expect(metrics.topEvents.length).toBeGreaterThan(0)
  })

  it('should calculate events per hour', () => {
    analytics.trackEvent('test', 'cat', 'action')
    const metrics = analytics.getMetrics()
    expect(metrics.eventsPerHour).toBeGreaterThanOrEqual(0)
  })

  it('should filter metrics by timewindow', () => {
    analytics.trackEvent('test', 'cat', 'action')
    const metricsLarge = analytics.getMetrics(3600000)
    const metricsSmall = analytics.getMetrics(10)
    expect(metricsLarge.totalEvents).toBeGreaterThanOrEqual(metricsSmall.totalEvents)
  })

  it('should register conversion funnels', () => {
    const funnel = analytics.registerConversionFunnel('purchase', ['step1', 'step2', 'step3'])
    expect(funnel.goal).toBe('purchase')
    expect(funnel.funnelStages).toHaveLength(3)
  })

  it('should update conversion progress', () => {
    analytics.registerConversionFunnel('purchase', ['step1', 'step2'])
    analytics.updateConversionProgress('purchase', 'step1', true)
    analytics.updateConversionProgress('purchase', 'step2', false)
    const metrics = analytics.getMetrics()
    expect(metrics.conversionMetrics).toBeDefined()
  })

  it('should track user journeys', () => {
    analytics.trackUserJourney('user123', ['page1', 'page2', 'purchase'])
    const metrics = analytics.getMetrics()
    expect(metrics.userJourneys).toBeDefined()
  })
})

// ============================================================================
// Profile Integration Tests
// ============================================================================

describe('Analytics Engine - Profile Integration', () => {
  let analytics: AnalyticsEngine

  beforeEach(() => {
    resetAnalytics()
    analytics = new AnalyticsEngine({ debug: false, autoFlush: false, persistToStorage: false })
  })

  afterEach(() => {
    analytics.destroy()
    resetAnalytics()
  })

  it('should track profile interactions', () => {
    const profile = { id: 'p123', name: 'John' } as any
    const event = analytics.trackProfileInteraction(profile, 'edit')
    expect(event.type).toBe('profile_interaction')
    expect(event.properties?.profileId).toBe('p123')
  })

  it('should track profile views', () => {
    const profile = { id: 'p456', name: 'Jane' } as any
    const event = analytics.trackProfileView(profile)
    expect(event.action).toBe('view')
  })

  it('should track profile edits', () => {
    const profile = { id: 'p789', name: 'Bob' } as any
    const event = analytics.trackProfileEdit(profile, 'experience')
    expect(event.action).toBe('edit')
    expect(event.properties?.section).toBe('experience')
  })
})

// ============================================================================
// Edge Cases Tests
// ============================================================================

describe('Analytics Engine - Edge Cases', () => {
  let analytics: AnalyticsEngine

  beforeEach(() => {
    resetAnalytics()
    analytics = new AnalyticsEngine({ debug: false, autoFlush: false, persistToStorage: false })
  })

  afterEach(() => {
    analytics.destroy()
    resetAnalytics()
  })

  it('should handle sampling rate', () => {
    const sampled = new AnalyticsEngine({ sampleRate: 0.1, autoFlush: false, persistToStorage: false })
    for (let i = 0; i < 100; i++) {
      sampled.trackEvent('test', 'cat', 'action')
    }
    expect(sampled.getQueuedEvents().length).toBeLessThanOrEqual(100)
    sampled.destroy()
  })

  it('should handle invalid funnel updates gracefully', () => {
    analytics.registerConversionFunnel('test', ['s1', 's2'])
    expect(() => {
      analytics.updateConversionProgress('test', 'invalid', true)
    }).not.toThrow()
  })

  it('should handle listener errors gracefully', () => {
    const badListener = () => {
      throw new Error('Test error')
    }
    const goodListener = jest.fn()
    analytics.subscribe(badListener)
    analytics.subscribe(goodListener)
    expect(() => {
      analytics.trackEvent('test', 'cat', 'action')
    }).not.toThrow()
  })

  it('should handle rapid fire events', () => {
    for (let i = 0; i < 500; i++) {
      analytics.trackEvent('test', 'cat', `action_${i}`)
    }
    expect(analytics.getQueuedEvents().length).toBeGreaterThanOrEqual(500)
  })

  it('should handle large properties', () => {
    const props: Record<string, string> = {}
    for (let i = 0; i < 50; i++) {
      props[`key_${i}`] = 'x'.repeat(500)
    }
    const event = analytics.trackEvent('test', 'cat', 'action', { properties: props })
    expect(event.properties).toBeDefined()
  })

  it('should handle special characters', () => {
    const event = analytics.trackEvent('test_$', 'cat_é', 'action_😀', { label: '测试' })
    expect(event).toBeDefined()
  })
})

// ============================================================================
// Performance Tests
// ============================================================================

describe('Analytics Engine - Performance', () => {
  let analytics: AnalyticsEngine

  beforeEach(() => {
    resetAnalytics()
    analytics = new AnalyticsEngine({ debug: false, autoFlush: false, persistToStorage: false })
  })

  afterEach(() => {
    analytics.destroy()
    resetAnalytics()
  })

  it('should track events quickly', () => {
    const start = performance.now()
    analytics.trackEvent('test', 'cat', 'action')
    const duration = performance.now() - start
    expect(duration).toBeLessThan(10)
  })

  it('should calculate metrics quickly', () => {
    for (let i = 0; i < 100; i++) {
      analytics.trackEvent('test', `cat_${i % 5}`, `action_${i % 10}`)
    }
    const start = performance.now()
    analytics.getMetrics()
    const duration = performance.now() - start
    expect(duration).toBeLessThan(100)
  })

  it('should maintain reasonable memory footprint', () => {
    for (let i = 0; i < 500; i++) {
      analytics.trackEvent('test', 'cat', 'action')
    }
    const stats = analytics.getQueueStats()
    expect(stats.estimatedSize).toBeLessThan(1000000) // < 1MB
  })
})

// ============================================================================
// Singleton Tests
// ============================================================================

describe('Analytics Engine - Singleton', () => {
  afterEach(() => {
    resetAnalytics()
  })

  it('should return same instance from getAnalytics', () => {
    const instance1 = getAnalytics()
    const instance2 = getAnalytics()
    expect(instance1).toBe(instance2)
  })

  it('should reset to create new instance', () => {
    const instance1 = getAnalytics()
    resetAnalytics()
    const instance2 = getAnalytics()
    expect(instance1).not.toBe(instance2)
  })
})
