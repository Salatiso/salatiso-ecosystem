import { trackException } from '@/config/analytics';

export interface LogEntry {
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  error?: Error;
  context?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    error?: Error,
    context?: Record<string, any>
  ): LogEntry {
    return {
      level,
      message,
      error,
      context,
      timestamp: new Date().toISOString(),
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
    };
  }

  private getUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id;
      }
    } catch {
      // Ignore parsing errors
    }
    return undefined;
  }

  private getSessionId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return sessionStorage.getItem('sessionId') || undefined;
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // In development, also log to console
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = entry.level === 'error' ? 'error' :
                           entry.level === 'warn' ? 'warn' :
                           entry.level === 'info' ? 'info' : 'debug';
      console[consoleMethod](`[${entry.level.toUpperCase()}] ${entry.message}`, entry.error || entry.context || '');
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    const entry = this.createLogEntry('error', message, error, context);
    this.addLog(entry);

    // Track in analytics
    if (typeof window !== 'undefined') {
      trackException(error?.message || message, false);
    }

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(entry);
    }
  }

  warn(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('warn', message, undefined, context);
    this.addLog(entry);
  }

  info(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('info', message, undefined, context);
    this.addLog(entry);
  }

  debug(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('debug', message, undefined, context);
    this.addLog(entry);
  }

  private async reportError(entry: LogEntry) {
    try {
      // Send to error reporting service (e.g., Sentry, LogRocket, etc.)
      // For now, we'll just store in localStorage for debugging
      const existingErrors = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingErrors.push(entry);
      // Keep only last 50 errors
      if (existingErrors.length > 50) {
        existingErrors.splice(0, existingErrors.length - 50);
      }
      localStorage.setItem('errorLogs', JSON.stringify(existingErrors));
    } catch (error) {
      console.error('Failed to report error:', error);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Global logger instance
export const logger = new Logger();

// Global error handler for unhandled errors
export const setupGlobalErrorHandling = () => {
  if (typeof window === 'undefined') return;

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', new Error(event.reason), {
      type: 'unhandledrejection',
      promise: event.promise,
    });
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    logger.error('Uncaught error', event.error, {
      type: 'uncaughterror',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Generate session ID
  if (!sessionStorage.getItem('sessionId')) {
    sessionStorage.setItem('sessionId', `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }
};

// Utility function to log React errors
export const logReactError = (error: Error, errorInfo: { componentStack: string }) => {
  logger.error('React Error Boundary', error, {
    componentStack: errorInfo.componentStack,
    type: 'react_error_boundary',
  });
};

// Utility function to log API errors
export const logApiError = (endpoint: string, error: any, context?: Record<string, any>) => {
  logger.error(`API Error: ${endpoint}`, error instanceof Error ? error : new Error(String(error)), {
    endpoint,
    type: 'api_error',
    ...context,
  });
};

// Utility function to log performance issues
export const logPerformanceIssue = (metric: string, value: number, threshold: number) => {
  logger.warn(`Performance Issue: ${metric}`, {
    metric,
    value,
    threshold,
    type: 'performance_issue',
  });
};