/**
 * Security Configuration & Hardening
 * Rate limiting, CSRF, Input validation, Security headers
 */

// Rate limiting configuration
export const RATE_LIMITS = {
  // API endpoints
  api: {
    default: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 min
    auth: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 requests per 15 min
    import: { windowMs: 60 * 60 * 1000, max: 10 }, // 10 imports per hour
    export: { windowMs: 60 * 60 * 1000, max: 20 }, // 20 exports per hour
    search: { windowMs: 1 * 60 * 1000, max: 30 }, // 30 searches per minute
    cleanup: { windowMs: 24 * 60 * 60 * 1000, max: 3 } // 3 cleanups per day
  },
  // UI interactions
  ui: {
    buttonClick: { debounceMs: 500 },
    textInput: { debounceMs: 300 },
    search: { debounceMs: 500 },
    dragDrop: { throttleMs: 100 }
  }
};

// CSRF token configuration
export const CSRF_CONFIG = {
  tokenLength: 32,
  headerName: 'X-CSRF-Token',
  cookieName: '_csrf',
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Input validation rules
export const INPUT_VALIDATION = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 254,
    message: 'Please enter a valid email address'
  },
  phone: {
    pattern: /^[\d\s\-\+\(\)]*$/,
    minLength: 7,
    maxLength: 15,
    message: 'Please enter a valid phone number'
  },
  name: {
    pattern: /^[a-zA-Z\s\-']*$/,
    minLength: 1,
    maxLength: 100,
    message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
  },
  organization: {
    pattern: /^[a-zA-Z0-9\s\-&.,()]*$/,
    minLength: 1,
    maxLength: 255,
    message: 'Organization name contains invalid characters'
  },
  url: {
    pattern: /^https?:\/\/.+/,
    maxLength: 2048,
    message: 'Please enter a valid URL starting with http:// or https://'
  },
  bio: {
    maxLength: 5000,
    message: 'Bio cannot exceed 5000 characters'
  },
  tags: {
    pattern: /^[a-zA-Z0-9\-_]*$/,
    maxLength: 50,
    message: 'Tags can only contain letters, numbers, hyphens, and underscores'
  }
};

// Content Security Policy headers
export const CSP_HEADERS = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com', 'https://cdn.jsdelivr.net'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'", 'https://firebaseio.com', 'https://*.firebase.com', 'https://www.googletagmanager.com'],
  'media-src': ["'self'", 'blob:'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// File upload validation
export const FILE_UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5 MB
  allowedFormats: ['.csv', '.vcf', '.xlsx', '.xls', '.json'],
  allowedMimeTypes: [
    'text/csv',
    'text/plain',
    'text/vcard',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/json'
  ]
};

// Sanitization functions
export const sanitizeInput = (input: string, type: 'email' | 'phone' | 'name' | 'text'): string => {
  if (!input) return '';

  let sanitized = input.trim();

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // XSS prevention: escape HTML
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  // Type-specific sanitization
  switch (type) {
    case 'email':
      sanitized = sanitized.toLowerCase().trim();
      break;
    case 'phone':
      // Remove all non-numeric characters except +, -, (, )
      sanitized = sanitized.replace(/[^\d\+\-\(\)]/g, '');
      break;
    case 'name':
      // Keep only alphanumeric, spaces, hyphens, apostrophes
      sanitized = sanitized.replace(/[^a-zA-Z\s\-']/g, '');
      break;
    case 'text':
      // Basic text sanitization
      sanitized = sanitized.substring(0, 5000);
      break;
  }

  return sanitized;
};

// Validation functions
export const validateInput = (input: string, type: keyof typeof INPUT_VALIDATION): { valid: boolean; error?: string } => {
  const rules = INPUT_VALIDATION[type] as any;

  if (!input && type !== 'bio') {
    return { valid: false, error: `${type} is required` };
  }

  if (rules?.minLength && input.length < rules.minLength) {
    return { valid: false, error: `${type} must be at least ${rules.minLength} characters` };
  }

  if (rules?.maxLength && input.length > rules.maxLength) {
    return { valid: false, error: rules.message };
  }

  if (rules?.pattern && !rules.pattern.test(input)) {
    return { valid: false, error: rules.message };
  }

  return { valid: true };
};

// CSRF token management
export class CSRFTokenManager {
  private static tokens = new Map<string, { token: string; created: number }>();

  static generateToken(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static storeToken(sessionId: string, token: string): void {
    this.tokens.set(sessionId, { token, created: Date.now() });
  }

  static validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId);
    if (!stored) return false;

    // Token expiry: 24 hours
    if (Date.now() - stored.created > 24 * 60 * 60 * 1000) {
      this.tokens.delete(sessionId);
      return false;
    }

    return stored.token === token;
  }

  static clearToken(sessionId: string): void {
    this.tokens.delete(sessionId);
  }
}

// Rate limiter implementation
export class RateLimiter {
  private attempts = new Map<string, number[]>();
  private limits = RATE_LIMITS;

  isLimited(key: string, limitConfig: typeof RATE_LIMITS.api.default): boolean {
    const now = Date.now();
    const windowStart = now - limitConfig.windowMs;

    // Get attempts in current window
    let attempts = this.attempts.get(key) || [];
    attempts = attempts.filter(time => time > windowStart);

    // Check if limit exceeded
    if (attempts.length >= limitConfig.max) {
      return true;
    }

    // Record new attempt
    attempts.push(now);
    this.attempts.set(key, attempts);

    return false;
  }

  getRemainingAttempts(key: string, limitConfig: typeof RATE_LIMITS.api.default): number {
    const now = Date.now();
    const windowStart = now - limitConfig.windowMs;

    let attempts = this.attempts.get(key) || [];
    attempts = attempts.filter(time => time > windowStart);

    return Math.max(0, limitConfig.max - attempts.length);
  }

  getResetTime(key: string, limitConfig: typeof RATE_LIMITS.api.default): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    return oldestAttempt + limitConfig.windowMs;
  }
}

export const rateLimiter = new RateLimiter();

// Request signing for sensitive operations
export class RequestSigner {
  private static generateSignature(data: string, secret: string): string {
    // In a real app, use proper HMAC-SHA256
    return btoa(`${data}:${secret}`);
  }

  static signRequest(data: Record<string, any>, secret: string): { signature: string; timestamp: string } {
    const timestamp = new Date().toISOString();
    const dataString = JSON.stringify(data) + timestamp;
    const signature = this.generateSignature(dataString, secret);

    return { signature, timestamp };
  }

  static verifySignature(
    data: Record<string, any>,
    signature: string,
    timestamp: string,
    secret: string
  ): boolean {
    // Verify timestamp (must be within 5 minutes)
    const requestTime = new Date(timestamp).getTime();
    const now = Date.now();
    if (Math.abs(now - requestTime) > 5 * 60 * 1000) {
      return false;
    }

    // Verify signature
    const dataString = JSON.stringify(data) + timestamp;
    const expectedSignature = this.generateSignature(dataString, secret);

    return signature === expectedSignature;
  }
}

export default {
  RATE_LIMITS,
  CSRF_CONFIG,
  INPUT_VALIDATION,
  CSP_HEADERS,
  SECURITY_HEADERS,
  FILE_UPLOAD_CONFIG,
  sanitizeInput,
  validateInput,
  CSRFTokenManager,
  RateLimiter,
  RequestSigner,
  rateLimiter
};
