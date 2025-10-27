/**
 * Phase 6.4 - Performance Monitor
 * Real-time performance metrics tracking, Web Vitals measurement, and optimization recommendations
 * 
 * Features:
 * - Core Web Vitals tracking (LCP, FID/INP, CLS)
 * - Custom performance metrics
 * - Memory usage monitoring
 * - CPU throttling detection
 * - Network speed detection
 * - Performance scoring and grading
 * - Optimization recommendations
 * - Performance regression detection
 * - Historical performance tracking
 */

import { AnalyticsEngine } from '@/lib/analytics/analytics-engine'

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface WebVital {
  name: 'LCP' | 'FID' | 'INP' | 'CLS' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta?: number
}

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
  category: 'vitals' | 'custom' | 'memory' | 'network' | 'runtime'
  threshold?: { good: number; poor: number }
}

export interface PerformanceScore {
  overall: number // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  lcp: number
  fid: number
  cls: number
  timestamp: number
  metrics: PerformanceMetric[]
}

export interface OptimizationRecommendation {
  id: string
  category: 'images' | 'scripts' | 'styles' | 'fonts' | 'cache' | 'compression' | 'lazy-loading'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  estimatedImprovement: number // percentage
  difficulty: 'easy' | 'medium' | 'hard'
  code?: string
}

export interface RegressionAlert {
  metric: string
  previousValue: number
  currentValue: number
  degradation: number // percentage
  timestamp: number
  severity: 'critical' | 'warning' | 'info'
}

export interface MemoryMetrics {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  percentage: number
}

export interface NetworkMetrics {
  type: string
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g'
  downlink: number
  rtt: number
  saveData: boolean
}

export interface ResourceTiming {
  name: string
  duration: number
  size: number
  type: string
  cached: boolean
}

export interface PerformanceConfig {
  trackWebVitals?: boolean
  trackMemory?: boolean
  trackNetwork?: boolean
  trackResources?: boolean
  enableRecommendations?: boolean
  enableRegressionDetection?: boolean
  metricsInterval?: number
  historySize?: number
  debug?: boolean
  analytics?: AnalyticsEngine
}

// ============================================================================
// Performance Monitor Class
// ============================================================================

export class PerformanceMonitor {
  private config: Required<PerformanceConfig>
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private webVitals: Map<string, WebVital> = new Map()
  private history: PerformanceScore[] = []
  private recommendations: OptimizationRecommendation[] = []
  private baselineMetrics: Map<string, number> = new Map()
  private metricsTimer?: NodeJS.Timeout
  private observer?: PerformanceObserver

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      trackWebVitals: config.trackWebVitals ?? true,
      trackMemory: config.trackMemory ?? true,
      trackNetwork: config.trackNetwork ?? true,
      trackResources: config.trackResources ?? true,
      enableRecommendations: config.enableRecommendations ?? true,
      enableRegressionDetection: config.enableRegressionDetection ?? true,
      metricsInterval: config.metricsInterval ?? 30000, // 30 seconds
      historySize: config.historySize ?? 100,
      debug: config.debug ?? false,
      analytics: config.analytics || undefined,
    }

    this.initialize()
  }

  // ========================================================================
  // Initialization
  // ========================================================================

  private initialize(): void {
    if (typeof window === 'undefined') return

    // Track Web Vitals
    if (this.config.trackWebVitals) {
      this.trackWebVitals()
    }

    // Track Resources
    if (this.config.trackResources) {
      this.observeResourceTiming()
    }

    // Start periodic metrics collection
    this.startMetricsCollection()

    // Generate initial recommendations
    if (this.config.enableRecommendations) {
      this.generateRecommendations()
    }

    if (this.config.debug) {
      console.log('[Performance Monitor] Initialized')
    }
  }

  // ========================================================================
  // Web Vitals Tracking
  // ========================================================================

  private trackWebVitals(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

    try {
      // Track LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList: PerformanceEntryList) => {
        const entries = entryList.getEntries() as PerformanceEntryWithRenderTime[]
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1]
          this.recordWebVital('LCP', lastEntry.renderTime || lastEntry.loadTime)
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Track CLS (Cumulative Layout Shift)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((entryList: PerformanceEntryList) => {
        for (const entry of entryList.getEntries() as LayoutShiftEntry[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.recordWebVital('CLS', clsValue)
          }
        }
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // Track INP (Interaction to Next Paint) / FID (First Input Delay)
      const inputObserver = new PerformanceObserver((entryList: PerformanceEntryList) => {
        for (const entry of entryList.getEntries() as PerformanceEventTiming[]) {
          this.recordWebVital('INP', entry.duration)
        }
      })
      inputObserver.observe({ entryTypes: ['first-input', 'event'] })

      // Track TTFB (Time to First Byte)
      if (performance.timing) {
        const ttfb = performance.timing.responseStart - performance.timing.navigationStart
        this.recordWebVital('TTFB', ttfb)
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('[Performance Monitor] Web Vitals tracking failed:', error)
      }
    }
  }

  private recordWebVital(name: string, value: number): void {
    const rating = this.rateWebVital(name, value)
    const vital: WebVital = {
      name: name as any,
      value,
      rating,
    }

    const existing = this.webVitals.get(name)
    if (existing) {
      vital.delta = value - existing.value
    }

    this.webVitals.set(name, vital)

    this.recordMetric({
      name,
      value,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'vitals',
    })

    if (this.config.analytics) {
      this.config.analytics.trackTiming('performance', 'web-vital', value, name)
    }
  }

  private rateWebVital(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      INP: { good: 200, poor: 500 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 600, poor: 1800 },
    }

    const threshold = thresholds[name as keyof typeof thresholds]
    if (!threshold) return 'needs-improvement'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  // ========================================================================
  // Memory Metrics
  // ========================================================================

  public getMemoryMetrics(): MemoryMetrics | null {
    if (typeof window === 'undefined' || !performance || !(performance as any).memory) {
      return null
    }

    const memory = (performance as any).memory
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    }
  }

  private trackMemory(): void {
    if (!this.config.trackMemory) return

    const memory = this.getMemoryMetrics()
    if (!memory) return

    this.recordMetric({
      name: 'Memory Usage',
      value: memory.percentage,
      unit: '%',
      timestamp: Date.now(),
      category: 'memory',
    })

    // Alert if memory usage is high
    if (memory.percentage > 90) {
      if (this.config.analytics) {
        this.config.analytics.trackError('High memory usage', `${memory.percentage.toFixed(2)}%`)
      }
    }
  }

  // ========================================================================
  // Network Metrics
  // ========================================================================

  public getNetworkMetrics(): NetworkMetrics | null {
    if (typeof navigator === 'undefined') return null

    const connection = (navigator as any).connection
    if (!connection) return null

    return {
      type: connection.type || 'unknown',
      effectiveType: connection.effectiveType || '4g',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false,
    }
  }

  private trackNetwork(): void {
    if (!this.config.trackNetwork) return

    const network = this.getNetworkMetrics()
    if (!network) return

    this.recordMetric({
      name: 'Network RTT',
      value: network.rtt,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'network',
    })
  }

  // ========================================================================
  // Resource Timing
  // ========================================================================

  private observeResourceTiming(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((entryList: PerformanceEntryList) => {
        const entries = entryList.getEntries() as PerformanceResourceTiming[]
        for (const entry of entries) {
          this.recordResourceTiming({
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize || 0,
            type: entry.initiatorType,
            cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
          })
        }
      })
      observer.observe({ entryTypes: ['resource'] })
    } catch (error) {
      if (this.config.debug) {
        console.error('[Performance Monitor] Resource timing observation failed:', error)
      }
    }
  }

  private recordResourceTiming(timing: ResourceTiming): void {
    this.recordMetric({
      name: `Resource: ${timing.name}`,
      value: timing.duration,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'runtime',
    })
  }

  // ========================================================================
  // Metrics Collection & Recording
  // ========================================================================

  private startMetricsCollection(): void {
    this.metricsTimer = setInterval(() => {
      this.trackMemory()
      this.trackNetwork()
    }, this.config.metricsInterval)
  }

  public recordMetric(metric: PerformanceMetric): void {
    const category = metric.category
    if (!this.metrics.has(category)) {
      this.metrics.set(category, [])
    }

    const categoryMetrics = this.metrics.get(category)!
    categoryMetrics.push(metric)

    // Keep only recent metrics
    if (categoryMetrics.length > 1000) {
      categoryMetrics.shift()
    }

    // Check for regressions
    if (this.config.enableRegressionDetection) {
      this.checkForRegressions(metric)
    }
  }

  // ========================================================================
  // Performance Scoring
  // ========================================================================

  public calculatePerformanceScore(): PerformanceScore {
    const vitals = Array.from(this.webVitals.values())
    const allMetrics = Array.from(this.metrics.values()).flat()

    let score = 100
    let lcpScore = 100
    let fidScore = 100
    let clsScore = 100

    // Score Web Vitals
    for (const vital of vitals) {
      const vitalScore = vital.rating === 'good' ? 100 : vital.rating === 'needs-improvement' ? 50 : 0

      if (vital.name === 'LCP') {
        lcpScore = vitalScore
        score -= (100 - vitalScore) * 0.4
      } else if (vital.name === 'INP' || vital.name === 'FID') {
        fidScore = vitalScore
        score -= (100 - vitalScore) * 0.3
      } else if (vital.name === 'CLS') {
        clsScore = vitalScore
        score -= (100 - vitalScore) * 0.3
      }
    }

    // Score memory
    const memory = this.getMemoryMetrics()
    if (memory && memory.percentage > 80) {
      score -= (memory.percentage - 80) * 0.5
    }

    score = Math.max(0, Math.min(100, score))

    const performanceScore: PerformanceScore = {
      overall: Math.round(score),
      grade: this.scoreToGrade(Math.round(score)),
      lcp: lcpScore,
      fid: fidScore,
      cls: clsScore,
      timestamp: Date.now(),
      metrics: allMetrics,
    }

    // Track in history
    this.history.push(performanceScore)
    if (this.history.length > this.config.historySize) {
      this.history.shift()
    }

    if (this.config.analytics) {
      this.config.analytics.trackEvent('performance', 'score', `${performanceScore.grade}`, {
        value: performanceScore.overall,
      })
    }

    return performanceScore
  }

  private scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  // ========================================================================
  // Regression Detection
  // ========================================================================

  private checkForRegressions(metric: PerformanceMetric): void {
    const baseline = this.baselineMetrics.get(metric.name)
    if (!baseline) {
      this.baselineMetrics.set(metric.name, metric.value)
      return
    }

    const degradation = ((metric.value - baseline) / baseline) * 100

    if (degradation > 20) {
      // More than 20% degradation
      const alert: RegressionAlert = {
        metric: metric.name,
        previousValue: baseline,
        currentValue: metric.value,
        degradation,
        timestamp: Date.now(),
        severity: degradation > 50 ? 'critical' : degradation > 30 ? 'warning' : 'info',
      }

      if (this.config.analytics) {
        this.config.analytics.trackError(
          `Performance regression: ${metric.name}`,
          `Degradation: ${degradation.toFixed(2)}%`
        )
      }

      if (this.config.debug) {
        console.warn('[Performance Monitor] Regression detected:', alert)
      }
    }
  }

  // ========================================================================
  // Optimization Recommendations
  // ========================================================================

  public generateRecommendations(): OptimizationRecommendation[] {
    this.recommendations = []

    // Analyze Web Vitals
    for (const [name, vital] of this.webVitals) {
      if (vital.rating === 'poor' || vital.rating === 'needs-improvement') {
        this.recommendations.push(...this.getVitalRecommendations(name, vital.value))
      }
    }

    // Analyze memory
    const memory = this.getMemoryMetrics()
    if (memory && memory.percentage > 75) {
      this.recommendations.push({
        id: 'memory-optimization',
        category: 'scripts',
        title: 'Reduce Memory Usage',
        description: `Memory usage is at ${memory.percentage.toFixed(1)}%. Consider code-splitting, lazy loading, or removing unused dependencies.`,
        impact: 'high',
        estimatedImprovement: 15,
        difficulty: 'medium',
      })
    }

    // Analyze resources
    this.analyzeResourcePerformance()

    return this.recommendations
  }

  private getVitalRecommendations(vitalName: string, value: number): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []

    switch (vitalName) {
      case 'LCP':
        recommendations.push(
          {
            id: 'lcp-images',
            category: 'images',
            title: 'Optimize Images for LCP',
            description: 'Ensure LCP images are optimized and loaded early. Use modern formats like WebP.',
            impact: 'high',
            estimatedImprovement: 20,
            difficulty: 'easy',
          },
          {
            id: 'lcp-fonts',
            category: 'fonts',
            title: 'Font Loading Strategy',
            description: 'Use font-display: swap to prevent text visibility delay during font loading.',
            impact: 'high',
            estimatedImprovement: 15,
            difficulty: 'easy',
            code: '@font-face { font-display: swap; }',
          }
        )
        break

      case 'INP':
      case 'FID':
        recommendations.push({
          id: 'inp-scripts',
          category: 'scripts',
          title: 'Reduce JavaScript Execution Time',
          description: 'Break up long tasks into smaller chunks using requestIdleCallback or requestAnimationFrame.',
          impact: 'high',
          estimatedImprovement: 25,
          difficulty: 'hard',
        })
        break

      case 'CLS':
        recommendations.push({
          id: 'cls-layout',
          category: 'styles',
          title: 'Fix Layout Shifts',
          description: 'Reserve space for dynamic content (images, ads) to prevent layout shifts.',
          impact: 'medium',
          estimatedImprovement: 10,
          difficulty: 'medium',
          code: 'aspect-ratio: 16 / 9; /* Reserve space for images */',
        })
        break
    }

    return recommendations
  }

  private analyzeResourcePerformance(): void {
    const resourceMetrics = this.metrics.get('runtime') || []

    // Find slow resources
    const slowResources = resourceMetrics
      .filter((m: any) => m.value > 1000)
      .slice(0, 3)

    for (const resource of slowResources) {
      this.recommendations.push({
        id: `slow-resource-${resource.name}`,
        category: 'compression',
        title: `Optimize ${resource.name.substring(0, 30)}...`,
        description: `This resource took ${resource.value.toFixed(0)}ms to load. Consider compression, caching, or lazy loading.`,
        impact: 'medium',
        estimatedImprovement: 20,
        difficulty: 'medium',
      })
    }
  }

  // ========================================================================
  // Data Retrieval
  // ========================================================================

  public getWebVitals(): Map<string, WebVital> {
    return new Map(this.webVitals)
  }

  public getMetrics(category?: string): PerformanceMetric[] {
    if (category) {
      return [...(this.metrics.get(category) || [])]
    }
    return Array.from(this.metrics.values()).flat()
  }

  public getHistory(limit: number = 10): PerformanceScore[] {
    return this.history.slice(-limit)
  }

  public getRecommendations(impact?: string): OptimizationRecommendation[] {
    if (impact) {
      return this.recommendations.filter(r => r.impact === impact)
    }
    return [...this.recommendations]
  }

  public clearMetrics(): void {
    this.metrics.clear()
    this.webVitals.clear()
  }

  // ========================================================================
  // Cleanup
  // ========================================================================

  public destroy(): void {
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer)
    }
    this.clearMetrics()
    if (this.config.debug) {
      console.log('[Performance Monitor] Destroyed')
    }
  }
}

// ============================================================================
// Type Definitions for Observers
// ============================================================================

interface PerformanceEntryWithRenderTime extends PerformanceEntry {
  renderTime: number
  loadTime: number
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean
  value: number
}

interface PerformanceEventTiming extends PerformanceEntry {
  duration: number
}

// ============================================================================
// Singleton Instance
// ============================================================================

let monitorInstance: PerformanceMonitor | null = null

export function getPerformanceMonitor(config?: PerformanceConfig): PerformanceMonitor {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor(config)
  }
  return monitorInstance
}

export function resetPerformanceMonitor(): void {
  if (monitorInstance) {
    monitorInstance.destroy()
  }
  monitorInstance = null
}
