/**
 * Phase 6.3 - Analytics API Routes
 * RESTful API endpoints for analytics data collection, aggregation, and retrieval
 * 
 * Endpoints:
 * - POST /api/analytics: Submit event batch
 * - GET /api/analytics/metrics: Get aggregated metrics
 * - GET /api/analytics/events: Retrieve events with filters
 * - POST /api/analytics/funnels: Register conversion funnels
 * - PUT /api/analytics/funnels/:goal: Update funnel progress
 * - GET /api/analytics/journeys: Get user journeys
 * - DELETE /api/analytics/events: Clear events
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// ============================================================================
// Types
// ============================================================================

interface AnalyticsEventPayload {
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

interface EventBatchPayload {
  id: string
  userId: string
  events: AnalyticsEventPayload[]
  batchTime: number
  totalEvents: number
  sessionDuration: number
  deviceInfo?: {
    type: string
    os: string
    browser: string
    screenWidth: number
    screenHeight: number
  }
}

interface AnalyticsResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: number
}

interface MetricsResponse {
  totalEvents: number
  eventsPerHour: number
  uniqueUsers: number
  averageSessionDuration: number
  topEvents: Array<{ event: string; count: number }>
}

interface QueryFilters {
  userId?: string
  startTime?: number
  endTime?: number
  eventType?: string
  category?: string
  limit?: number
}

// ============================================================================
// Middleware & Helpers
// ============================================================================

/**
 * Verify authentication token
 */
async function verifyAuth(req: NextApiRequest): Promise<{ uid: string } | null> {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decodedToken = await getAuth().verifyIdToken(token)
    return { uid: decodedToken.uid }
  } catch (error) {
    return null
  }
}

/**
 * Set CORS headers
 */
function setCorsHeaders(res: NextApiResponse): void {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )
}

/**
 * Handle CORS preflight
 */
function handleCors(req: NextApiRequest, res: NextApiResponse): boolean {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return true
  }

  return false
}

/**
 * Rate limiting check (simple in-memory store)
 */
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
 * POST /api/analytics - Submit event batch
 */
async function handlePostAnalytics(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsResponse<any>>
): Promise<void> {
  try {
    const batch = req.body as EventBatchPayload

    // Validate batch
    if (!batch.userId || !batch.events || batch.events.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid batch: missing userId or events',
        timestamp: Date.now(),
      })
      return
    }

    // Rate limiting
    const rateLimitKey = `analytics_${batch.userId}`
    if (!checkRateLimit(rateLimitKey, 1000, 60000)) {
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        timestamp: Date.now(),
      })
      return
    }

    const db = getFirestore()

    // Store batch in Firestore
    const batchRef = db.collection('analytics_batches').doc()
    await batchRef.set({
      ...batch,
      createdAt: new Date(),
      batchId: batchRef.id,
    })

    // Store individual events for querying
    const batch_write = db.batch()
    const eventsRef = db.collection('analytics_events')

    for (const event of batch.events) {
      const docRef = eventsRef.doc()
      batch_write.set(docRef, {
        ...event,
        batchId: batchRef.id,
        createdAt: new Date(),
      })
    }

    await batch_write.commit()

    // Update user analytics metadata
    const userAnalyticsRef = db.collection('user_analytics').doc(batch.userId)
    await userAnalyticsRef.set(
      {
        lastEventBatch: batchRef.id,
        lastEventTime: new Date(),
        totalEventsSubmitted: (await userAnalyticsRef.get()).data()?.totalEventsSubmitted + batch.totalEvents || batch.totalEvents,
        sessionDuration: Math.max(
          (await userAnalyticsRef.get()).data()?.sessionDuration || 0,
          batch.sessionDuration
        ),
      },
      { merge: true }
    )

    res.status(200).json({
      success: true,
      data: {
        batchId: batchRef.id,
        eventsProcessed: batch.totalEvents,
      },
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
 * GET /api/analytics/metrics - Get aggregated metrics
 */
async function handleGetMetrics(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsResponse<MetricsResponse>>
): Promise<void> {
  try {
    const { userId } = req.query as Record<string, string>
    const hours = typeof req.query.hours === 'string' ? parseInt(req.query.hours) : 24

    const db = getFirestore()
    const cutoffTime = Date.now() - hours * 3600000

    let query: any = db.collection('analytics_events').where('timestamp', '>=', cutoffTime)

    if (userId) {
      query = query.where('userId', '==', userId)
    }

    const snapshot = await query.get()
    const events = snapshot.docs.map(doc => doc.data())

    // Aggregate metrics
    const topEvents = new Map<string, number>()
    const uniqueUsers = new Set<string>()
    let totalDuration = 0
    let sessionCount = 0

    for (const event of events) {
      const eventKey = `${event.category}:${event.action}`
      topEvents.set(eventKey, (topEvents.get(eventKey) || 0) + 1)
      uniqueUsers.add(event.userId)
      totalDuration += event.sessionDuration || 0
      sessionCount++
    }

    const topEventsArray = Array.from(topEvents.entries())
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    res.status(200).json({
      success: true,
      data: {
        totalEvents: events.length,
        eventsPerHour: Math.round((events.length / hours)),
        uniqueUsers: uniqueUsers.size,
        averageSessionDuration: sessionCount > 0 ? Math.round(totalDuration / sessionCount) : 0,
        topEvents: topEventsArray,
      },
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
 * GET /api/analytics/events - Retrieve events with filters
 */
async function handleGetEvents(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsResponse<any[]>>
): Promise<void> {
  try {
    const { userId, startTime, endTime, eventType } = req.query as Record<string, string>
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 100

    const db = getFirestore()
    let query: any = db.collection('analytics_events')

    if (userId) {
      query = query.where('userId', '==', userId)
    }

    if (startTime) {
      query = query.where('timestamp', '>=', parseInt(startTime))
    }

    if (endTime) {
      query = query.where('timestamp', '<=', parseInt(endTime))
    }

    if (eventType) {
      query = query.where('type', '==', eventType)
    }

    query = query.orderBy('timestamp', 'desc').limit(limit)

    const snapshot = await query.get()
    const events = snapshot.docs.map(doc => doc.data())

    res.status(200).json({
      success: true,
      data: events,
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
 * POST /api/analytics/funnels - Register conversion funnel
 */
async function handlePostFunnel(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsResponse<any>>
): Promise<void> {
  try {
    const { goal, stages } = req.body

    if (!goal || !Array.isArray(stages) || stages.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid funnel: missing goal or stages',
        timestamp: Date.now(),
      })
      return
    }

    const db = getFirestore()
    const funnelRef = db.collection('analytics_funnels').doc(goal)

    await funnelRef.set({
      goal,
      stages: stages.map((stage: string) => ({
        stage,
        completions: 0,
        dropoffs: 0,
      })),
      created: new Date(),
      attempts: 0,
      conversions: 0,
    })

    res.status(200).json({
      success: true,
      data: { funnelId: funnelRef.id },
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
 * PUT /api/analytics/funnels/:goal - Update funnel progress
 */
async function handlePutFunnel(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsResponse<any>>
): Promise<void> {
  try {
    const { goal } = req.query
    const { stage, completed } = req.body

    if (!goal || !stage || completed === undefined) {
      res.status(400).json({
        success: false,
        error: 'Invalid request: missing goal, stage, or completed flag',
        timestamp: Date.now(),
      })
      return
    }

    const db = getFirestore()
    const funnelRef = db.collection('analytics_funnels').doc(goal as string)
    const funnelDoc = await funnelRef.get()

    if (!funnelDoc.exists) {
      res.status(404).json({
        success: false,
        error: 'Funnel not found',
        timestamp: Date.now(),
      })
      return
    }

    const funnelData = funnelDoc.data()!
    const stageIndex = funnelData.stages.findIndex((s: any) => s.stage === stage)

    if (stageIndex === -1) {
      res.status(400).json({
        success: false,
        error: 'Stage not found in funnel',
        timestamp: Date.now(),
      })
      return
    }

    if (completed) {
      funnelData.stages[stageIndex].completions++
      if (stageIndex === funnelData.stages.length - 1) {
        funnelData.conversions++
      }
    } else {
      funnelData.stages[stageIndex].dropoffs++
    }

    funnelData.attempts++

    await funnelRef.set(funnelData)

    res.status(200).json({
      success: true,
      data: { updated: true },
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
 * GET /api/analytics/journeys - Get user journeys
 */
async function handleGetJourneys(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsResponse<any[]>>
): Promise<void> {
  try {
    const { userId } = req.query as Record<string, string>
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 50

    const db = getFirestore()
    let query: any = db.collection('analytics_journeys')

    if (userId) {
      query = query.where('userId', '==', userId)
    }

    query = query.orderBy('timestamp', 'desc').limit(limit)

    const snapshot = await query.get()
    const journeys = snapshot.docs.map(doc => doc.data())

    res.status(200).json({
      success: true,
      data: journeys,
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
 * DELETE /api/analytics/events - Clear events
 */
async function handleDeleteEvents(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsResponse<any>>
): Promise<void> {
  try {
    // Verify authentication for deletion
    const auth = await verifyAuth(req)
    if (!auth) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        timestamp: Date.now(),
      })
      return
    }

    const { userId } = req.query

    const db = getFirestore()

    if (userId && userId !== auth.uid) {
      res.status(403).json({
        success: false,
        error: 'Forbidden: cannot delete other users data',
        timestamp: Date.now(),
      })
      return
    }

    let query: any = db.collection('analytics_events')

    if (userId) {
      query = query.where('userId', '==', userId)
    }

    const snapshot = await query.get()
    const batch = db.batch()

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
    })

    await batch.commit()

    res.status(200).json({
      success: true,
      data: { deletedCount: snapshot.size },
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
  // Handle CORS
  if (handleCors(req, res)) {
    return
  }

  const { path } = req.query
  const pathArray = Array.isArray(path) ? path : [path]
  const endpoint = pathArray.join('/')

  try {
    if (req.method === 'POST' && !endpoint) {
      await handlePostAnalytics(req, res)
    } else if (req.method === 'GET' && endpoint === 'metrics') {
      await handleGetMetrics(req, res)
    } else if (req.method === 'GET' && endpoint === 'events') {
      await handleGetEvents(req, res)
    } else if (req.method === 'POST' && endpoint === 'funnels') {
      await handlePostFunnel(req, res)
    } else if (req.method === 'PUT' && endpoint?.startsWith('funnels/')) {
      await handlePutFunnel(req, res)
    } else if (req.method === 'GET' && endpoint === 'journeys') {
      await handleGetJourneys(req, res)
    } else if (req.method === 'DELETE' && endpoint === 'events') {
      await handleDeleteEvents(req, res)
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
