/**
 * Phase 6.4 - Performance Dashboard Component
 * React components for visualizing performance metrics with charts and recommendations
 */

import React, { useEffect, useState } from 'react'
import {
  PerformanceMonitor,
  PerformanceScore,
  WebVital,
  OptimizationRecommendation,
  MemoryMetrics,
  NetworkMetrics,
} from '@/lib/performance/performance-monitor'

// ============================================================================
// Score Card Component
// ============================================================================

interface ScoreCardProps {
  score: PerformanceScore
}

export const PerformanceScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 text-green-900 border-green-300'
      case 'B':
        return 'bg-blue-100 text-blue-900 border-blue-300'
      case 'C':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300'
      case 'D':
        return 'bg-orange-100 text-orange-900 border-orange-300'
      case 'F':
        return 'bg-red-100 text-red-900 border-red-300'
      default:
        return 'bg-gray-100 text-gray-900 border-gray-300'
    }
  }

  return (
    <div className={`border-2 rounded-lg p-6 ${getGradeColor(score.grade)}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Performance Score</h2>
          <p className="text-sm opacity-75 mt-1">
            Last updated: {new Date(score.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="text-6xl font-bold ml-6">{score.grade}</div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-white bg-opacity-50 rounded">
          <div className="text-2xl font-bold">{score.overall}</div>
          <div className="text-xs font-semibold">Overall</div>
        </div>
        <div className="text-center p-3 bg-white bg-opacity-50 rounded">
          <div className="text-2xl font-bold">{score.lcp}</div>
          <div className="text-xs font-semibold">LCP</div>
        </div>
        <div className="text-center p-3 bg-white bg-opacity-50 rounded">
          <div className="text-2xl font-bold">{score.fid}</div>
          <div className="text-xs font-semibold">INP/FID</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white bg-opacity-50 rounded">
        <div className="text-center">
          <div className="text-2xl font-bold">{score.cls}</div>
          <div className="text-xs font-semibold">CLS</div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Web Vitals Display Component
// ============================================================================

interface WebVitalsProps {
  vitals: Map<string, WebVital>
}

export const WebVitalsDisplay: React.FC<WebVitalsProps> = ({ vitals }) => {
  const vitalsList = Array.from(vitals.values())

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'border-green-500 bg-green-50'
      case 'needs-improvement':
        return 'border-yellow-500 bg-yellow-50'
      case 'poor':
        return 'border-red-500 bg-red-50'
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  const getRatingBadgeColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'bg-green-200 text-green-900'
      case 'needs-improvement':
        return 'bg-yellow-200 text-yellow-900'
      case 'poor':
        return 'bg-red-200 text-red-900'
      default:
        return 'bg-gray-200 text-gray-900'
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Core Web Vitals</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {vitalsList.map(vital => (
          <div key={vital.name} className={`border-2 rounded-lg p-4 ${getRatingColor(vital.rating)}`}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{vital.name}</h4>
                <p className="text-sm text-gray-600">
                  {vital.value.toFixed(0)} {vital.value > 100 ? 'ms' : ''}
                </p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${getRatingBadgeColor(vital.rating)}`}>
                {vital.rating === 'good'
                  ? 'Good'
                  : vital.rating === 'needs-improvement'
                    ? 'Needs Work'
                    : 'Poor'}
              </span>
            </div>
            {vital.delta !== undefined && (
              <p className={`text-xs mt-2 ${vital.delta > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {vital.delta > 0 ? '↑' : '↓'} {Math.abs(vital.delta).toFixed(0)} ms
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// System Metrics Component
// ============================================================================

interface SystemMetricsProps {
  memory: MemoryMetrics | null
  network: NetworkMetrics | null
}

export const SystemMetrics: React.FC<SystemMetricsProps> = ({ memory, network }) => {
  const getMemoryStatus = (percentage: number) => {
    if (percentage < 50) return { color: 'bg-green-500', status: 'Healthy' }
    if (percentage < 75) return { color: 'bg-yellow-500', status: 'Good' }
    if (percentage < 90) return { color: 'bg-orange-500', status: 'High' }
    return { color: 'bg-red-500', status: 'Critical' }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Memory Metrics */}
      {memory && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-3">Memory Usage</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Heap Usage</span>
                <span className="font-semibold">{memory.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getMemoryStatus(memory.percentage).color}`}
                  style={{ width: `${memory.percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB of{' '}
                {(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="mt-3 p-2 bg-white rounded border border-gray-200">
              <p className="text-xs text-gray-600">
                Status: <span className="font-semibold">{getMemoryStatus(memory.percentage).status}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Network Metrics */}
      {network && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-3">Network Info</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Connection Type</span>
              <span className="font-semibold">{network.effectiveType.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RTT</span>
              <span className="font-semibold">{network.rtt} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Downlink</span>
              <span className="font-semibold">{network.downlink} Mbps</span>
            </div>
            {network.saveData && (
              <div className="mt-2 p-2 bg-blue-100 border border-blue-200 rounded text-blue-900 text-xs font-semibold">
                💾 Save Data Mode Enabled
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Recommendations Component
// ============================================================================

interface RecommendationsProps {
  recommendations: OptimizationRecommendation[]
}

export const RecommendationsPanel: React.FC<RecommendationsProps> = ({ recommendations }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'border-red-300 bg-red-50'
      case 'medium':
        return 'border-yellow-300 bg-yellow-50'
      case 'low':
        return 'border-blue-300 bg-blue-50'
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'hard':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (recommendations.length === 0) {
    return (
      <div className="border border-green-300 rounded-lg p-6 bg-green-50 text-center">
        <p className="text-green-900 font-semibold">✅ No recommendations at this time</p>
        <p className="text-sm text-green-700 mt-1">Your performance metrics look great!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Optimization Recommendations</h3>
      {recommendations.slice(0, 8).map(rec => (
        <div key={rec.id} className={`border-2 rounded-lg p-4 ${getImpactColor(rec.impact)}`}>
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-900">{rec.title}</h4>
            <span className={`text-xs font-bold px-2 py-1 rounded ${getDifficultyColor(rec.difficulty)}`}>
              {rec.difficulty.charAt(0).toUpperCase() + rec.difficulty.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              Estimated improvement: <span className="font-semibold text-green-600">+{rec.estimatedImprovement}%</span>
            </span>
            <span className="text-gray-600">Category: {rec.category}</span>
          </div>
          {rec.code && (
            <div className="mt-2 p-2 bg-white bg-opacity-50 rounded font-mono text-xs text-gray-800 border border-gray-300 overflow-auto">
              {rec.code}
            </div>
          )}
        </div>
      ))}
      {recommendations.length > 8 && (
        <p className="text-sm text-gray-600 text-center">
          +{recommendations.length - 8} more recommendations available
        </p>
      )}
    </div>
  )
}

// ============================================================================
// Main Performance Dashboard Component
// ============================================================================

interface PerformanceDashboardProps {
  monitor: PerformanceMonitor
  refreshInterval?: number
  compactMode?: boolean
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  monitor,
  refreshInterval = 5000,
  compactMode = false,
}) => {
  const [score, setScore] = useState<PerformanceScore | null>(null)
  const [vitals, setVitals] = useState(new Map())
  const [memory, setMemory] = useState<MemoryMetrics | null>(null)
  const [network, setNetwork] = useState<NetworkMetrics | null>(null)
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateMetrics = () => {
      setLoading(true)
      const newScore = monitor.calculatePerformanceScore()
      setScore(newScore)
      setVitals(monitor.getWebVitals())
      setMemory(monitor.getMemoryMetrics())
      setNetwork(monitor.getNetworkMetrics())
      setRecommendations(monitor.getRecommendations())
      setLoading(false)
    }

    updateMetrics()
    const timer = setInterval(updateMetrics, refreshInterval)

    return () => clearInterval(timer)
  }, [monitor, refreshInterval])

  if (loading || !score) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Loading performance metrics...</p>
      </div>
    )
  }

  if (compactMode) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <PerformanceScoreCard score={score} />
        <WebVitalsDisplay vitals={vitals} />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Last updated: {new Date(score.timestamp).toLocaleTimeString()}
        </p>
      </div>

      {/* Main Score */}
      <PerformanceScoreCard score={score} />

      {/* Web Vitals */}
      <div className="border-t pt-6">
        <WebVitalsDisplay vitals={vitals} />
      </div>

      {/* System Metrics */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h3>
        <SystemMetrics memory={memory} network={network} />
      </div>

      {/* Recommendations */}
      <div className="border-t pt-6">
        <RecommendationsPanel recommendations={recommendations} />
      </div>

      {/* Footer */}
      <div className="border-t pt-4 text-xs text-gray-600 text-center">
        <p>Updates every {refreshInterval / 1000}s</p>
      </div>
    </div>
  )
}

export default PerformanceDashboard
