/**
 * Phase 6.3 - Analytics Engine
 * Core event tracking, data aggregation, and reporting for the Salatiso ecosystem
 * 
 * Features:
 * - Real-time event tracking with custom properties
 * - Data aggregation and statistical analysis
 * - User behavior analytics
 * - Performance tracking
 * - Goal/conversion funnel tracking
 * - Batch event reporting
 * - Local storage persistence
 * - Auto-flush to backend
 */

import { LifeCVProfile } from '@/types/profile'

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface AnalyticsEvent {
  id: string
  userId: string
  type: string
  category: string
  action: string
  label?: string
  value?: number
  properties?: Record<string, any>
  timestamp: number
  sessionId: string
  userAgent?: string
  url?: string
  referrer?: string
}

export interface EventBatch {
  id: string
  userId: string
  events: AnalyticsEvent[]
  batchTime: number
  totalEvents: number
  sessionDuration: number
  deviceInfo?: DeviceInfo
}

export interface AnalyticsMetrics {
  totalEvents: number
  eventsPerHour: number
  uniqueUsers: number
  averageSessionDuration: number
  topEvents: Array<{ event: string; count: number }>
  userJourneys: UserJourney[]
  conversionMetrics: ConversionMetric[]
  performanceMetrics: PerformanceMetric[]
  lastUpdated: number
}

export interface UserJourney {
  userId: string
  sessionId: string
  events: string[]
  entryPoint: string
  exitPoint: string
  duration: number
  timestamp: number
}

export interface ConversionMetric {
  goal: string
  attempts: number
  conversions: number
  conversionRate: number
  averageSteps: number
  funnelStages: FunnelStage[]
}

export interface FunnelStage {
  stage: string
  completions: number
  dropoffs: number
  completionRate: number
}

export interface PerformanceMetric {
  page: string
  averageLoadTime: number
  averageInteractionTime: number
  bounceRate: number
  totalVisits: number
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop'
  os: string
  browser: string
  screenWidth: number
  screenHeight: number
}

export interface AnalyticsConfig {
  userId?: string
  sessionId?: string
  autoFlush?: boolean
  flushInterval?: number
  persistToStorage?: boolean
  sampleRate?: number
  debug?: boolean
  customDimensions?: Record<string, string>
}

// ============================================================================
// Analytics Engine Class
// ============================================================================

export class AnalyticsEngine {
  private eventQueue: AnalyticsEvent[] = []
  private sessionId: string
  private userId: string
  private sessionStartTime: number
  private config: Required<AnalyticsConfig>
  private flushTimer?: NodeJS.Timeout
  private metricsCache: Map<string, AnalyticsMetrics> = new Map()
  private userJourneys: Map<string, UserJourney> = new Map()
  private conversionFunnels: Map<string, ConversionMetric> = new Map()
  private eventListeners: Set<(event: AnalyticsEvent) => void> = new Set()
  private performanceObserver?: PerformanceObserver

  constructor(config: AnalyticsConfig = {}) {
    this.userId = config.userId || this.generateId('user')
    this.sessionId = config.sessionId || this.generateId('session')
    this.sessionStartTime = Date.now()

    this.config = {
      userId: this.userId,
      sessionId: this.sessionId,
      autoFlush: config.autoFlush ?? true,
      flushInterval: config.flushInterval ?? 30000, // 30 seconds
      persistToStorage: config.persistToStorage ?? true,
      sampleRate: config.sampleRate ?? 1.0,
      debug: config.debug ?? false,
      customDimensions: config.customDimensions ?? {},
    }

    if (this.config.persistToStorage) {
      this.loadEventsFromStorage()
    }

    if (this.config.autoFlush) {
      this.startAutoFlush()
    }

    this.initializePerformanceTracking()
    this.trackSessionStart()
  }

  // ========================================================================
  // Event Tracking Methods
  // ========================================================================

  /**
   * Track a custom event
   */
  public trackEvent(
    type: string,
    category: string,
    action: string,
    options?: {
      label?: string
      value?: number
      properties?: Record<string, any>
    }
  ): AnalyticsEvent {
    // Apply sampling
    if (Math.random() > this.config.sampleRate) {
      return {} as AnalyticsEvent
    }

    const event: AnalyticsEvent = {
      id: this.generateId('event'),
      userId: this.userId,
      type,
      category,
      action,
      label: options?.label,
      value: options?.value,
      properties: options?.properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    }

    this.eventQueue.push(event)
    this.notifyListeners(event)

    if (this.config.debug) {
      console.log('[Analytics]', event)
    }

    if (this.config.persistToStorage) {
      this.saveEventsToStorage()
    }

    return event
  }

  /**
   * Track a page view
   */
  public trackPageView(
    title: string,
    properties?: Record<string, any>
  ): AnalyticsEvent {
    return this.trackEvent('pageview', 'page', 'view', {
      label: title,
      properties,
    })
  }

  /**
   * Track a user interaction
   */
  public trackInteraction(
    component: string,
    action: string,
    value?: number,
    properties?: Record<string, any>
  ): AnalyticsEvent {
    return this.trackEvent('interaction', 'component', action, {
      label: component,
      value,
      properties,
    })
  }

  /**
   * Track a conversion event
   */
  public trackConversion(
    goal: string,
    value?: number,
    properties?: Record<string, any>
  ): AnalyticsEvent {
    return this.trackEvent('conversion', 'goal', goal, {
      value,
      properties,
    })
  }

  /**
   * Track an error event
   */
  public trackError(
    message: string,
    stack?: string,
    properties?: Record<string, any>
  ): AnalyticsEvent {
    return this.trackEvent('error', 'exception', message, {
      properties: { stack, ...properties },
    })
  }

  /**
   * Track timing information
   */
  public trackTiming(
    category: string,
    action: string,
    duration: number,
    label?: string,
    properties?: Record<string, any>
  ): AnalyticsEvent {
    return this.trackEvent('timing', category, action, {
      label,
      value: duration,
      properties,
    })
  }

  // ========================================================================
  // Event Queue & Batch Management
  // ========================================================================

  /**
   * Flush events to backend
   */
  public async flush(): Promise<void> {
    if (this.eventQueue.length === 0) {
      return
    }

    const batch: EventBatch = {
      id: this.generateId('batch'),
      userId: this.userId,
      events: [...this.eventQueue],
      batchTime: Date.now(),
      totalEvents: this.eventQueue.length,
      sessionDuration: Date.now() - this.sessionStartTime,
      deviceInfo: this.getDeviceInfo(),
    }

    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
      })

      if (response.ok) {
        this.eventQueue = []
        if (this.config.persistToStorage) {
          this.clearStoredEvents()
        }
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[Analytics] Flush failed:', error)
      }
    }
  }

  /**
   * Clear all events
   */
  public clearEvents(): void {
    this.eventQueue = []
    if (this.config.persistToStorage) {
      this.clearStoredEvents()
    }
  }

  /**
   * Get queued events
   */
  public getQueuedEvents(): AnalyticsEvent[] {
    return [...this.eventQueue]
  }

  /**
   * Get queue statistics
   */
  public getQueueStats(): {
    totalEvents: number
    oldestEvent: number | null
    newestEvent: number | null
    estimatedSize: number
  } {
    return {
      totalEvents: this.eventQueue.length,
      oldestEvent: this.eventQueue[0]?.timestamp || null,
      newestEvent: this.eventQueue[this.eventQueue.length - 1]?.timestamp || null,
      estimatedSize: JSON.stringify(this.eventQueue).length,
    }
  }

  // ========================================================================
  // Analytics & Metrics
  // ========================================================================

  /**
   * Get aggregated metrics
   */
  public getMetrics(timewindowMs: number = 3600000): AnalyticsMetrics {
    const now = Date.now()
    const cutoff = now - timewindowMs
    const filteredEvents = this.eventQueue.filter(e => e.timestamp >= cutoff)

    const topEvents = this.aggregateTopEvents(filteredEvents, 10)
    const userJourneys = Array.from(this.userJourneys.values())
    const conversionMetrics = Array.from(this.conversionFunnels.values())

    return {
      totalEvents: filteredEvents.length,
      eventsPerHour: Math.round((filteredEvents.length / timewindowMs) * 3600000),
      uniqueUsers: new Set(filteredEvents.map(e => e.userId)).size,
      averageSessionDuration: this.calculateAverageSessionDuration(userJourneys),
      topEvents,
      userJourneys,
      conversionMetrics,
      performanceMetrics: this.calculatePerformanceMetrics(filteredEvents),
      lastUpdated: now,
    }
  }

  /**
   * Track a user journey
   */
  public trackUserJourney(userId: string, events: string[]): void {
    const journey: UserJourney = {
      userId,
      sessionId: this.sessionId,
      events,
      entryPoint: events[0],
      exitPoint: events[events.length - 1],
      duration: Date.now() - this.sessionStartTime,
      timestamp: Date.now(),
    }

    this.userJourneys.set(`${userId}-${this.sessionId}`, journey)
  }

  /**
   * Register a conversion funnel
   */
  public registerConversionFunnel(
    goal: string,
    stages: string[],
    properties?: Record<string, any>
  ): ConversionMetric {
    const metric: ConversionMetric = {
      goal,
      attempts: 0,
      conversions: 0,
      conversionRate: 0,
      averageSteps: 0,
      funnelStages: stages.map(stage => ({
        stage,
        completions: 0,
        dropoffs: 0,
        completionRate: 0,
      })),
    }

    this.conversionFunnels.set(goal, metric)
    return metric
  }

  /**
   * Update conversion funnel progress
   */
  public updateConversionProgress(goal: string, stage: string, completed: boolean): void {
    const metric = this.conversionFunnels.get(goal)
    if (!metric) return

    const stageIndex = metric.funnelStages.findIndex(s => s.stage === stage)
    if (stageIndex === -1) return

    if (completed) {
      metric.funnelStages[stageIndex].completions++
      if (stageIndex === metric.funnelStages.length - 1) {
        metric.conversions++
      }
    } else {
      metric.funnelStages[stageIndex].dropoffs++
    }

    metric.attempts++
    metric.conversionRate = metric.conversions / Math.max(metric.attempts, 1)

    for (const stage of metric.funnelStages) {
      stage.completionRate = stage.completions / Math.max(metric.attempts, 1)
    }
  }

  // ========================================================================
  // User Profile Integration
  // ========================================================================

  /**
   * Track profile interaction
   */
  public trackProfileInteraction(
    profile: LifeCVProfile,
    action: string,
    properties?: Record<string, any>
  ): AnalyticsEvent {
    return this.trackEvent('profile_interaction', 'profile', action, {
      label: profile.name,
      properties: {
        profileId: profile.id,
        ...properties,
      },
    })
  }

  /**
   * Track profile view
   */
  public trackProfileView(profile: LifeCVProfile): AnalyticsEvent {
    return this.trackProfileInteraction(profile, 'view')
  }

  /**
   * Track profile edit
   */
  public trackProfileEdit(profile: LifeCVProfile, section: string): AnalyticsEvent {
    return this.trackProfileInteraction(profile, 'edit', { section })
  }

  // ========================================================================
  // Event Listeners
  // ========================================================================

  /**
   * Subscribe to events
   */
  public subscribe(listener: (event: AnalyticsEvent) => void): () => void {
    this.eventListeners.add(listener)

    // Return unsubscribe function
    return () => {
      this.eventListeners.delete(listener)
    }
  }

  private notifyListeners(event: AnalyticsEvent): void {
    for (const listener of this.eventListeners) {
      try {
        listener(event)
      } catch (error) {
        if (this.config.debug) {
          console.error('[Analytics] Listener error:', error)
        }
      }
    }
  }

  // ========================================================================
  // Private Helper Methods
  // ========================================================================

  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  private initializePerformanceTracking(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    try {
      this.performanceObserver = new PerformanceObserver((list: PerformanceEntryList) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            this.trackTiming('page', 'load', navEntry.loadEventEnd - navEntry.fetchStart, 'total')
          }
          if (entry.entryType === 'paint') {
            const paintEntry = entry as PerformancePaintTiming
            this.trackTiming('page', 'paint', paintEntry.startTime, paintEntry.name)
          }
        }
      })

      this.performanceObserver.observe({ entryTypes: ['navigation', 'paint'] })
    } catch (error) {
      if (this.config.debug) {
        console.error('[Analytics] Performance observer setup failed:', error)
      }
    }
  }

  private trackSessionStart(): void {
    this.trackEvent('session', 'lifecycle', 'start', {
      properties: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
    })
  }

  private aggregateTopEvents(
    events: AnalyticsEvent[],
    limit: number
  ): Array<{ event: string; count: number }> {
    const counts = new Map<string, number>()

    for (const event of events) {
      const key = `${event.category}:${event.action}`
      counts.set(key, (counts.get(key) || 0) + 1)
    }

    return Array.from(counts.entries())
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  private calculateAverageSessionDuration(journeys: UserJourney[]): number {
    if (journeys.length === 0) return 0
    const total = journeys.reduce((sum, j) => sum + j.duration, 0)
    return Math.round(total / journeys.length)
  }

  private calculatePerformanceMetrics(events: AnalyticsEvent[]): PerformanceMetric[] {
    const pageMetrics = new Map<string, PerformanceMetric>()

    for (const event of events) {
      if (event.type !== 'pageview') continue

      const page = event.url || 'unknown'
      if (!pageMetrics.has(page)) {
        pageMetrics.set(page, {
          page,
          averageLoadTime: 0,
          averageInteractionTime: 0,
          bounceRate: 0,
          totalVisits: 0,
        })
      }

      const metric = pageMetrics.get(page)!
      metric.totalVisits++
    }

    return Array.from(pageMetrics.values())
  }

  private getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        type: 'desktop',
        os: 'unknown',
        browser: 'unknown',
        screenWidth: 0,
        screenHeight: 0,
      }
    }

    const ua = navigator.userAgent.toLowerCase()
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      deviceType = 'tablet'
    } else if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
      deviceType = 'mobile'
    }

    let os = 'unknown'
    if (ua.includes('windows')) os = 'Windows'
    else if (ua.includes('mac')) os = 'MacOS'
    else if (ua.includes('linux')) os = 'Linux'
    else if (ua.includes('android')) os = 'Android'
    else if (ua.includes('iphone')) os = 'iOS'

    let browser = 'unknown'
    if (ua.includes('edge')) browser = 'Edge'
    else if (ua.includes('chrome')) browser = 'Chrome'
    else if (ua.includes('safari')) browser = 'Safari'
    else if (ua.includes('firefox')) browser = 'Firefox'

    return {
      type: deviceType,
      os,
      browser,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    }
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // ========================================================================
  // Storage Methods
  // ========================================================================

  private saveEventsToStorage(): void {
    try {
      const key = `analytics_queue_${this.sessionId}`
      const data = JSON.stringify(this.eventQueue)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, data)
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[Analytics] Storage save failed:', error)
      }
    }
  }

  private loadEventsFromStorage(): void {
    try {
      if (typeof localStorage === 'undefined') return

      const keys = Object.keys(localStorage).filter(k => k.startsWith('analytics_queue_'))

      for (const key of keys) {
        const data = localStorage.getItem(key)
        if (data) {
          const events = JSON.parse(data) as AnalyticsEvent[]
          this.eventQueue.push(...events)
        }
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[Analytics] Storage load failed:', error)
      }
    }
  }

  private clearStoredEvents(): void {
    try {
      if (typeof localStorage === 'undefined') return

      const key = `analytics_queue_${this.sessionId}`
      localStorage.removeItem(key)
    } catch (error) {
      if (this.config.debug) {
        console.error('[Analytics] Storage clear failed:', error)
      }
    }
  }

  // ========================================================================
  // Cleanup Methods
  // ========================================================================

  /**
   * Destroy the analytics engine
   */
  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect()
    }

    this.eventListeners.clear()
    this.trackEvent('session', 'lifecycle', 'end')
    this.flush()
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let analyticsInstance: AnalyticsEngine | null = null

export function getAnalytics(config?: AnalyticsConfig): AnalyticsEngine {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsEngine(config)
  }
  return analyticsInstance
}

export function resetAnalytics(): void {
  if (analyticsInstance) {
    analyticsInstance.destroy()
  }
  analyticsInstance = null
}
