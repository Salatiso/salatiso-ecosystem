/**
 * Phase 6.4 - Performance API Routes
 * RESTful API endpoints for performance metrics collection, analysis, and reporting
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore } from 'firebase-admin/firestore'

// ============================================================================
// Types
// ============================================================================

interface PerformanceData {
  userId: string
  sessionId: string
  metrics: any[]
  score: number
  grade: string
  timestamp: number
  url: string
  userAgent?: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: number
}

// ============================================================================
// Middleware & Helpers
// ============================================================================

function setCorsHeaders(res: NextApiResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

function handleCors(req: NextApiRequest, res: NextApiResponse): boolean {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return true
  }
  return false
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(key: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count++
  return true
}

// ============================================================================
// API Handlers
// ============================================================================

/**
 * POST /api/performance - Submit performance metrics
 */
async function handlePostPerformance(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
): Promise<void> {
  try {
    const data = req.body as PerformanceData

    if (!data.userId || !data.metrics || data.metrics.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid data: missing userId or metrics',
        timestamp: Date.now(),
      })
      return
    }

    // Rate limiting
    const rateLimitKey = `perf_${data.userId}`
    if (!checkRateLimit(rateLimitKey, 1000, 60000)) {
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        timestamp: Date.now(),
      })
      return
    }

    const db = getFirestore()

    // Store performance data
    const perfRef = db.collection('performance_data').doc()
    await perfRef.set({
      ...data,
      createdAt: new Date(),
      dataId: perfRef.id,
    })

    // Update user performance stats
    const userPerfRef = db.collection('user_performance').doc(data.userId)
    const userPerfDoc = await userPerfRef.get()
    const userData = userPerfDoc.data()

    await userPerfRef.set(
      {
        lastScore: data.score,
        lastGrade: data.grade,
        lastUpdate: new Date(),
        totalSubmissions: (userData?.totalSubmissions || 0) + 1,
        averageScore: userData
          ? (userData.averageScore * userData.totalSubmissions + data.score) /
            ((userData.totalSubmissions || 0) + 1)
          : data.score,
        bestScore: Math.max(userData?.bestScore || 0, data.score),
        worstScore: Math.min(userData?.worstScore || 100, data.score),
      },
      { merge: true }
    )

    res.status(200).json({
      success: true,
      data: { dataId: perfRef.id },
      timestamp: Date.now(),
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: Date.now(),
    })
  }
}

/**
 * GET /api/performance/score - Get performance scores
 */
async function handleGetScores(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
): Promise<void> {
  try {
    const { userId, hours = '24' } = req.query as Record<string, string>

    const db = getFirestore()
    const hoursNum = typeof hours === 'string' ? parseInt(hours) : hours
    const cutoffTime = new Date(Date.now() - hoursNum * 3600000)

    let query: any = db.collection('performance_data').where('createdAt', '>=', cutoffTime)

    if (userId) {
      query = query.where('userId', '==', userId)
    }

    query = query.orderBy('createdAt', 'desc').limit(100)

    const snapshot = await query.get()
    const scores = snapshot.docs.map(doc => doc.data())

    res.status(200).json({
      success: true,
      data: { scores, count: scores.length },
      timestamp: Date.now(),
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: Date.now(),
    })
  }
}

/**
 * GET /api/performance/user-stats - Get user performance statistics
 */
async function handleGetUserStats(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
): Promise<void> {
  try {
    const { userId } = req.query as Record<string, string>

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'Missing userId parameter',
        timestamp: Date.now(),
      })
      return
    }

    const db = getFirestore()
    const userPerfDoc = await db.collection('user_performance').doc(userId).get()

    if (!userPerfDoc.exists) {
      res.status(404).json({
        success: false,
        error: 'User performance data not found',
        timestamp: Date.now(),
      })
      return
    }

    res.status(200).json({
      success: true,
      data: userPerfDoc.data(),
      timestamp: Date.now(),
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: Date.now(),
    })
  }
}

/**
 * GET /api/performance/trends - Get performance trends
 */
async function handleGetTrends(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
): Promise<void> {
  try {
    const { userId, days = '7' } = req.query as Record<string, string>

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'Missing userId parameter',
        timestamp: Date.now(),
      })
      return
    }

    const db = getFirestore()
    const daysNum = typeof days === 'string' ? parseInt(days) : days
    const cutoffTime = new Date(Date.now() - daysNum * 86400000)

    const query = db
      .collection('performance_data')
      .where('userId', '==', userId)
      .where('createdAt', '>=', cutoffTime)
      .orderBy('createdAt', 'asc')

    const snapshot = await query.get()
    const data = snapshot.docs.map(doc => {
      const d = doc.data()
      return {
        timestamp: d.timestamp,
        score: d.score,
        grade: d.grade,
      }
    })

    // Group by day
    const trends: Record<string, any> = {}
    for (const point of data) {
      const date = new Date(point.timestamp).toISOString().split('T')[0]
      if (!trends[date]) {
        trends[date] = { scores: [], grades: {} }
      }
      trends[date].scores.push(point.score)
      trends[date].grades[point.grade] = (trends[date].grades[point.grade] || 0) + 1
    }

    // Calculate daily averages
    const dailyTrends = Object.entries(trends).map(([date, data]: [string, any]) => ({
      date,
      averageScore: Math.round(data.scores.reduce((a: number, b: number) => a + b, 0) / data.scores.length),
      minScore: Math.min(...data.scores),
      maxScore: Math.max(...data.scores),
      samples: data.scores.length,
      gradeDistribution: data.grades,
    }))

    res.status(200).json({
      success: true,
      data: { trends: dailyTrends, totalSamples: data.length },
      timestamp: Date.now(),
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: Date.now(),
    })
  }
}

/**
 * GET /api/performance/compare - Compare performance across users/pages
 */
async function handleCompare(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
): Promise<void> {
  try {
    const { urls, hours = 24 } = req.query

    const db = getFirestore()
    const cutoffTime = new Date(Date.now() - parseInt(hours as string) * 3600000)

    const urlList = Array.isArray(urls) ? urls : [urls as string]

    const comparisons: Record<string, any> = {}

    for (const url of urlList) {
      const query = db
        .collection('performance_data')
        .where('url', '==', url)
        .where('createdAt', '>=', cutoffTime)

      const snapshot = await query.get()
      const scores = snapshot.docs.map((doc: any) => doc.data().score)

      comparisons[url] = {
        samples: scores.length,
        average: scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b) / scores.length) : 0,
        min: scores.length > 0 ? Math.min(...scores) : 0,
        max: scores.length > 0 ? Math.max(...scores) : 0,
      }
    }

    res.status(200).json({
      success: true,
      data: comparisons,
      timestamp: Date.now(),
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: Date.now(),
    })
  }
}

/**
 * POST /api/performance/alerts - Register performance alert
 */
async function handlePostAlert(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
): Promise<void> {
  try {
    const { userId, metric, threshold, action } = req.body

    if (!userId || !metric || !threshold) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields',
        timestamp: Date.now(),
      })
      return
    }

    const db = getFirestore()

    const alertRef = db.collection('performance_alerts').doc()
    await alertRef.set({
      userId,
      metric,
      threshold,
      action,
      active: true,
      createdAt: new Date(),
      alertId: alertRef.id,
    })

    res.status(200).json({
      success: true,
      data: { alertId: alertRef.id },
      timestamp: Date.now(),
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: Date.now(),
    })
  }
}

/**
 * DELETE /api/performance/data/:id - Delete performance data
 */
async function handleDeleteData(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
): Promise<void> {
  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Invalid data ID',
        timestamp: Date.now(),
      })
      return
    }

    const db = getFirestore()

    await db.collection('performance_data').doc(id).delete()

    res.status(200).json({
      success: true,
      data: { deleted: true },
      timestamp: Date.now(),
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: Date.now(),
    })
  }
}

// ============================================================================
// Main Handler
// ============================================================================

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (handleCors(req, res)) {
    return
  }

  const { path } = req.query
  const pathArray = Array.isArray(path) ? path : [path]
  const endpoint = pathArray.join('/')

  try {
    if (req.method === 'POST' && !endpoint) {
      await handlePostPerformance(req, res)
    } else if (req.method === 'GET' && endpoint === 'score') {
      await handleGetScores(req, res)
    } else if (req.method === 'GET' && endpoint === 'user-stats') {
      await handleGetUserStats(req, res)
    } else if (req.method === 'GET' && endpoint === 'trends') {
      await handleGetTrends(req, res)
    } else if (req.method === 'GET' && endpoint === 'compare') {
      await handleCompare(req, res)
    } else if (req.method === 'POST' && endpoint === 'alerts') {
      await handlePostAlert(req, res)
    } else if (req.method === 'DELETE' && endpoint?.startsWith('data/')) {
      await handleDeleteData(req, res)
    } else {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        timestamp: Date.now(),
      })
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      timestamp: Date.now(),
    })
  }
}
