/**
 * Phase 6.5 - Security Hardening: Security Middleware
 * Middleware for Next.js API routes with security features
 */

import type { NextApiRequest, NextApiResponse } from 'next'

// ============================================================================
// Types
// ============================================================================

export interface SecurityContext {
  userId?: string
  userEmail?: string
  userRoles?: string[]
  ipAddress?: string
  userAgent?: string
  timestamp: number
}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator?: (req: NextApiRequest) => string
}

export interface SecurityConfig {
  enableCORS: boolean
  corsOrigins?: string[]
  enableRateLimit: boolean
  rateLimitConfig?: RateLimitConfig
  enableInputValidation: boolean
  enableOutputEncoding: boolean
  requireAuth?: boolean
  requiredRoles?: string[]
}

// ============================================================================
// Rate Limiting
// ============================================================================

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(key: string, config: RateLimitConfig): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs })
    return true
  }

  if (entry.count >= config.maxRequests) {
    return false
  }

  entry.count++
  return true
}

// ============================================================================
// CORS Handler
// ============================================================================

function handleCORS(req: NextApiRequest, res: NextApiResponse, origins?: string[]): boolean {
  const allowedOrigins = origins || ['*']
  const origin = req.headers.origin || '*'

  if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return true
  }

  return false
}

// ============================================================================
// Security Headers
// ============================================================================

function setSecurityHeaders(res: NextApiResponse): void {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY')

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff')

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block')

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Feature policy
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  )

  // Content security policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  )
}

// ============================================================================
// Input Validation
// ============================================================================

export function sanitizeInput(input: unknown): unknown {
  if (typeof input === 'string') {
    // Remove dangerous characters and XSS attempts
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  if (typeof input === 'object' && input !== null) {
    if (Array.isArray(input)) {
      return input.map((item) => sanitizeInput(item))
    }

    const sanitized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }

  return input
}

export function validateInput(
  data: unknown,
  schema: Record<string, { type: string; required?: boolean; pattern?: RegExp; max?: number; min?: number }>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid request body'] }
  }

  const obj = data as Record<string, unknown>

  for (const [key, rules] of Object.entries(schema)) {
    const value = obj[key]

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`Missing required field: ${key}`)
      continue
    }

    if (value === undefined || value === null) {
      continue
    }

    // Type check
    if (typeof value !== rules.type) {
      errors.push(`Field '${key}' must be of type ${rules.type}`)
      continue
    }

    // Pattern check
    if (rules.pattern && typeof value === 'string') {
      if (!rules.pattern.test(value)) {
        errors.push(`Field '${key}' does not match required format`)
      }
    }

    // Length checks
    if (typeof value === 'string') {
      if (rules.max && value.length > rules.max) {
        errors.push(`Field '${key}' exceeds maximum length of ${rules.max}`)
      }
      if (rules.min && value.length < rules.min) {
        errors.push(`Field '${key}' is below minimum length of ${rules.min}`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

// ============================================================================
// Authentication & Authorization
// ============================================================================

export async function extractAuthContext(req: NextApiRequest): Promise<SecurityContext | null> {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return null
  }

  // In a real implementation, decode JWT token
  // For now, return a basic context
  return {
    timestamp: Date.now(),
    ipAddress: getClientIpAddress(req),
    userAgent: req.headers['user-agent'],
  }
}

export function getClientIpAddress(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress || 'unknown'
}

// ============================================================================
// Main Middleware Factory
// ============================================================================

export function createSecurityMiddleware(config?: Partial<SecurityConfig>) {
  const defaultConfig: SecurityConfig = {
    enableCORS: true,
    corsOrigins: ['*'],
    enableRateLimit: true,
    rateLimitConfig: {
      windowMs: 60000, // 1 minute
      maxRequests: 100,
      keyGenerator: (req) => getClientIpAddress(req),
    },
    enableInputValidation: true,
    enableOutputEncoding: true,
    requireAuth: false,
    ...config,
  }

  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    handler: (req: NextApiRequest, res: NextApiResponse, context: SecurityContext) => Promise<void> | void
  ): Promise<void> => {
    try {
      // Set security headers
      setSecurityHeaders(res)

      // Handle CORS
      if (defaultConfig.enableCORS && handleCORS(req, res, defaultConfig.corsOrigins)) {
        return
      }

      // Rate limiting
      if (defaultConfig.enableRateLimit && defaultConfig.rateLimitConfig) {
        const keyGen = defaultConfig.rateLimitConfig.keyGenerator || ((r) => getClientIpAddress(r))
        const key = keyGen(req)

        if (!checkRateLimit(key, defaultConfig.rateLimitConfig)) {
          res.status(429).json({
            success: false,
            error: 'Too many requests. Please try again later.',
          })
          return
        }
      }

      // Extract security context
      const context: SecurityContext = {
        timestamp: Date.now(),
        ipAddress: getClientIpAddress(req),
        userAgent: req.headers['user-agent'],
        ...(await extractAuthContext(req)),
      }

      // Authentication check
      if (defaultConfig.requireAuth && !context.userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        })
        return
      }

      // Authorization check
      if (defaultConfig.requiredRoles && context.userRoles) {
        const hasRequiredRole = defaultConfig.requiredRoles.some((role) => context.userRoles!.includes(role))

        if (!hasRequiredRole) {
          res.status(403).json({
            success: false,
            error: 'Insufficient permissions',
          })
          return
        }
      }

      // Call the actual handler
      await handler(req, res, context)
    } catch (error: any) {
      console.error('Security middleware error:', error)

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }
}

// ============================================================================
// Utility Middleware Functions
// ============================================================================

/**
 * Middleware to sanitize all request inputs
 */
export function sanitizeRequestBody(req: NextApiRequest, res: NextApiResponse, next: () => void): void {
  if (req.body) {
    req.body = sanitizeInput(req.body)
  }
  next()
}

/**
 * Middleware to validate request body against schema
 */
export function validateRequestBody(
  schema: Record<string, { type: string; required?: boolean; pattern?: RegExp; max?: number; min?: number }>
) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void): void => {
    const validation = validateInput(req.body, schema)

    if (!validation.valid) {
      res.status(400).json({
        success: false,
        errors: validation.errors,
      })
      return
    }

    next()
  }
}

/**
 * Middleware to require authentication
 */
export function requireAuth(req: NextApiRequest, res: NextApiResponse, next: () => void): void {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
    })
    return
  }

  next()
}

/**
 * Middleware to require specific roles
 */
export function requireRoles(...roles: string[]) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void): void => {
    const userRoles = (req as any).userRoles || []

    if (!roles.some((role) => userRoles.includes(role))) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      })
      return
    }

    next()
  }
}

/**
 * Middleware to log security events
 */
export async function logSecurityEvent(
  req: NextApiRequest,
  res: NextApiResponse,
  eventType: string,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    const context: SecurityContext = {
      timestamp: Date.now(),
      ipAddress: getClientIpAddress(req),
      userAgent: req.headers['user-agent'],
    }

    // In a real implementation, log to audit logger
    console.log(`[SECURITY] ${eventType}:`, {
      ...context,
      ...details,
    })
  } catch (error) {
    console.error('Error logging security event:', error)
  }
}

// ============================================================================
// Response Wrapper
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp: number
}

export function sendResponse<T>(
  res: NextApiResponse,
  statusCode: number,
  success: boolean,
  data?: T,
  error?: string
): void {
  const response: ApiResponse<T> = {
    success,
    timestamp: Date.now(),
  }

  if (success && data !== undefined) {
    response.data = data
  } else if (!success && error) {
    response.error = error
  }

  res.status(statusCode).json(response)
}
