# Error Handling & Logging System

This document outlines the comprehensive error handling and logging system implemented in the Salatiso Ecosystem.

## Overview

The error handling system provides:
- **Global Error Boundaries** for React components
- **Comprehensive Logging** with structured data
- **Analytics Integration** for error tracking
- **User-Friendly Error Pages** for better UX
- **Async Operation Handling** with error recovery
- **Toast Notifications** for user feedback

## Components

### ErrorBoundary (`src/components/ErrorBoundary.tsx`)

A React error boundary that catches JavaScript errors anywhere in the component tree.

**Features:**
- Catches and displays user-friendly error messages
- Logs errors to analytics and console
- Provides recovery options (reload, go back)
- Development mode shows detailed error information

**Usage:**
```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### Logger (`src/utils/logger.ts`)

Centralized logging utility with structured error tracking.

**Features:**
- Multiple log levels (error, warn, info, debug)
- Automatic context capture (user ID, session ID, URL, user agent)
- Analytics integration for error tracking
- Local storage persistence for production debugging
- Global error handling setup

**Usage:**
```tsx
import { logger } from '@/utils/logger';

// Log different types of messages
logger.error('Database connection failed', error);
logger.warn('API response slow', { responseTime: 5000 });
logger.info('User completed tutorial', { tutorialId: 'basic' });
```

### useAsync Hook (`src/hooks/useAsync.ts`)

Handles async operations with built-in error handling.

**Features:**
- Loading states management
- Error catching and logging
- Success/error callbacks
- Multiple async operations support
- Form submission handling

**Usage:**
```tsx
import { useAsync } from '@/hooks/useAsync';

function MyComponent() {
  const { data, loading, error, execute } = useAsync(fetchUserData, {
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error),
    immediate: true, // Run immediately on mount
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Data: {JSON.stringify(data)}</div>;
}
```

### Toast System (`src/utils/toast.ts`)

Enhanced toast notifications with error integration.

**Features:**
- Success, error, warning, and info notifications
- Promise-based notifications
- Loading states
- Error logging integration

**Usage:**
```tsx
import { useToast } from '@/utils/toast';

function MyComponent() {
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      await toast.promise(
        submitForm(),
        {
          loading: 'Submitting...',
          success: 'Form submitted successfully!',
          error: 'Failed to submit form',
        }
      );
    } catch (error) {
      // Error already handled by toast
    }
  };

  return (
    <button onClick={handleSubmit}>
      Submit
    </button>
  );
}
```

### Error Pages (`src/components/ErrorPage.tsx`)

User-friendly error pages for 404 and 500 errors.

**Features:**
- Consistent design with app branding
- Clear error messages and actions
- Contact information for support
- Development mode debugging info

## Integration Points

### App-Level Integration (`src/pages/_app.tsx`)

The error handling system is integrated at the app level:

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';
import { setupGlobalErrorHandling } from '@/utils/logger';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    setupGlobalErrorHandling();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        {/* Other providers */}
        <Component {...pageProps} />
      </AuthProvider>
    </ErrorBoundary>
  );
}
```

### Analytics Integration

Errors are automatically tracked in Google Analytics:

- **Exception Tracking**: All caught errors are sent to GA4
- **Custom Events**: Error context and metadata
- **User Properties**: Error frequency by user role

## Error Types Handled

1. **React Errors**: Component rendering errors
2. **Async Errors**: Promise rejections and async operation failures
3. **Network Errors**: API call failures
4. **JavaScript Errors**: Uncaught exceptions
5. **Unhandled Rejections**: Unhandled promise rejections

## Logging Levels

- **ERROR**: Critical issues requiring immediate attention
- **WARN**: Potential issues or unexpected behavior
- **INFO**: General information and successful operations
- **DEBUG**: Detailed debugging information

## Production vs Development

**Development:**
- Detailed error messages in console
- Error boundary shows stack traces
- All logs output to console

**Production:**
- User-friendly error messages
- Errors logged to analytics and local storage
- Sensitive information hidden

## Best Practices

### Error Handling in Components

```tsx
import { useErrorHandler } from '@/components/ErrorBoundary';
import { useToast } from '@/utils/toast';

function MyComponent() {
  const handleError = useErrorHandler();
  const toast = useToast();

  const handleAction = async () => {
    try {
      await riskyOperation();
      toast.success('Operation completed!');
    } catch (error) {
      handleError(error);
      toast.error('Operation failed');
    }
  };
}
```

### API Error Handling

```tsx
import { logApiError } from '@/utils/logger';

const apiCall = async () => {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  } catch (error) {
    logApiError('/api/data', error, { userId: '123' });
    throw error;
  }
};
```

### Custom Error Classes

```tsx
export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'NetworkError';
  }
}
```

## Monitoring & Debugging

### Error Logs Access

In production, error logs are stored in localStorage for debugging:

```javascript
// Access error logs in browser console
const errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
console.table(errorLogs);
```

### Analytics Dashboard

Errors can be monitored through the Analytics Dashboard (`/analytics`) which shows:
- Error frequency and trends
- Most common error types
- User impact analysis

## Configuration

### Environment Variables

```bash
# Error reporting (for future external services)
NEXT_PUBLIC_ERROR_REPORTING_ENABLED=true
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Logger Configuration

The logger can be configured by modifying `src/utils/logger.ts`:

```typescript
private maxLogs = 100; // Maximum logs to keep in memory
```

## Future Enhancements

- **External Error Reporting**: Integration with Sentry, LogRocket, etc.
- **Error Recovery**: Automatic retry mechanisms
- **Performance Monitoring**: Response time tracking
- **User Feedback**: Error reporting forms
- **Admin Dashboard**: Real-time error monitoring for administrators