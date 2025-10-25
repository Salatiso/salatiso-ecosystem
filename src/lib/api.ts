import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const auth = getAuth();
export const db = getFirestore();

// API Response helpers
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const sendSuccess = <T>(
  res: NextApiResponse,
  data: T,
  message?: string,
  statusCode = 200
) => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendError = (
  res: NextApiResponse,
  error: string,
  statusCode = 500,
  details?: any
) => {
  console.error('API Error:', error, details);
  res.status(statusCode).json({
    success: false,
    error,
  });
};

// Authentication middleware
export const withAuth = (
  handler: (req: NextApiRequest & { user: any }, res: NextApiResponse) => Promise<void> | void
) => {
  return async (req: NextApiRequest & { user: any }, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 'Unauthorized: No token provided', 401);
      }

      const token = authHeader.substring(7);
      const decodedToken = await auth.verifyIdToken(token);

      req.user = decodedToken;
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return sendError(res, 'Unauthorized: Invalid token', 401);
    }
  };
};

// Role-based authorization middleware
export const withRole = (allowedRoles: string[]) => {
  return (
    handler: (req: NextApiRequest & { user: any }, res: NextApiResponse) => Promise<void> | void
  ) => {
    return withAuth(async (req, res) => {
      const userRole = req.user.role || 'user';

      if (!allowedRoles.includes(userRole)) {
        return sendError(res, 'Forbidden: Insufficient permissions', 403);
      }

      return handler(req, res);
    });
  };
};

// Rate limiting helper (basic implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const withRateLimit = (
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) => {
  return (
    handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void
  ) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const clientId = req.headers['x-forwarded-for'] as string ||
                      req.connection.remoteAddress ||
                      'unknown';

      const now = Date.now();
      const clientData = rateLimitMap.get(clientId);

      if (!clientData || now > clientData.resetTime) {
        rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
      } else if (clientData.count >= maxRequests) {
        return sendError(res, 'Too many requests', 429);
      } else {
        clientData.count++;
      }

      return handler(req, res);
    };
  };
};

// Input validation helpers
export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

export const validateLength = (
  value: string,
  fieldName: string,
  min?: number,
  max?: number
): string | null => {
  if (min && value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (max && value.length > max) {
    return `${fieldName} must be no more than ${max} characters`;
  }
  return null;
};

// CORS helper
export const allowCors = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    return handler(req, res);
  };
};