import toast from 'react-hot-toast';
import { logger } from '@/utils/logger';

export interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  style?: Record<string, any>;
  className?: string;
  icon?: string;
  iconTheme?: {
    primary: string;
    secondary: string;
  };
}

class ToastManager {
  // Success notifications
  success(message: string, options?: ToastOptions) {
    logger.info('Toast success shown', { message });
    return toast.success(message, {
      duration: 4000,
      style: {
        background: '#10B981',
        color: '#fff',
      },
      ...options,
    });
  }

  // Error notifications
  error(message: string, error?: Error, options?: ToastOptions) {
    logger.error('Toast error shown', error || new Error(message), { message });
    return toast.error(message, {
      duration: 6000,
      style: {
        background: '#EF4444',
        color: '#fff',
      },
      ...options,
    });
  }

  // Warning notifications
  warning(message: string, options?: ToastOptions) {
    logger.warn('Toast warning shown', { message });
    return toast(message, {
      duration: 5000,
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
      },
      ...options,
    });
  }

  // Info notifications
  info(message: string, options?: ToastOptions) {
    logger.info('Toast info shown', { message });
    return toast(message, {
      duration: 4000,
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
      },
      ...options,
    });
  }

  // Loading notifications
  loading(message: string, options?: ToastOptions) {
    return toast.loading(message, {
      style: {
        background: '#6B7280',
        color: '#fff',
      },
      ...options,
    });
  }

  // Dismiss specific toast
  dismiss(toastId: string) {
    toast.dismiss(toastId);
  }

  // Dismiss all toasts
  dismissAll() {
    toast.dismiss();
  }

  // Promise-based notifications
  async promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ) {
    const toastId = this.loading(messages.loading, options);

    try {
      const data = await promise;
      const successMessage = typeof messages.success === 'function'
        ? messages.success(data)
        : messages.success;

      toast.success(successMessage, {
        id: toastId,
        duration: 4000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
        ...options,
      });

      logger.info('Promise toast success', { successMessage });
      return data;
    } catch (error) {
      const errorMessage = typeof messages.error === 'function'
        ? messages.error(error)
        : messages.error;

      toast.error(errorMessage, {
        id: toastId,
        duration: 6000,
        style: {
          background: '#EF4444',
          color: '#fff',
        },
        ...options,
      });

      logger.error('Promise toast error', error instanceof Error ? error : new Error(String(error)), {
        errorMessage
      });

      throw error;
    }
  }
}

// Global toast manager instance
export const toastManager = new ToastManager();

// Convenience functions for direct use
export const showSuccess = (message: string, options?: ToastOptions) =>
  toastManager.success(message, options);

export const showError = (message: string, error?: Error, options?: ToastOptions) =>
  toastManager.error(message, error, options);

export const showWarning = (message: string, options?: ToastOptions) =>
  toastManager.warning(message, options);

export const showInfo = (message: string, options?: ToastOptions) =>
  toastManager.info(message, options);

export const showLoading = (message: string, options?: ToastOptions) =>
  toastManager.loading(message, options);

export const dismissToast = (toastId: string) => toastManager.dismiss(toastId);

export const dismissAllToasts = () => toastManager.dismissAll();

// React hook for toast notifications
export const useToast = () => {
  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    dismiss: dismissToast,
    dismissAll: dismissAllToasts,
    promise: toastManager.promise.bind(toastManager),
  };
};