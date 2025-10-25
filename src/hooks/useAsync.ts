import { useState, useCallback, useEffect } from 'react';
import { useErrorHandler } from '@/components/ErrorBoundary';
import { logger } from '@/utils/logger';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

export function useAsync<T = any>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const handleError = useErrorHandler();

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });

      if (options.onSuccess) {
        options.onSuccess(data);
      }

      logger.info('Async operation completed successfully', {
        operation: asyncFunction.name,
        dataSize: Array.isArray(data) ? data.length : typeof data,
      });

      return data;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: errorObj });

      // Log the error
      logger.error('Async operation failed', errorObj, {
        operation: asyncFunction.name,
      });

      // Use error boundary handler
      handleError(errorObj);

      if (options.onError) {
        options.onError(errorObj);
      }

      throw errorObj;
    }
  }, [asyncFunction, options, handleError]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, loading: false, error: null }),
  };
}

// Hook for handling multiple async operations
export function useAsyncMultiple() {
  const [operations, setOperations] = useState<Record<string, AsyncState<any>>>({});
  const handleError = useErrorHandler();

  const execute = useCallback(async (
    key: string,
    asyncFunction: () => Promise<any>,
    options: UseAsyncOptions = {}
  ) => {
    setOperations(prev => ({
      ...prev,
      [key]: { data: null, loading: true, error: null }
    }));

    try {
      const data = await asyncFunction();
      setOperations(prev => ({
        ...prev,
        [key]: { data, loading: false, error: null }
      }));

      if (options.onSuccess) {
        options.onSuccess(data);
      }

      logger.info(`Async operation '${key}' completed successfully`, {
        operation: asyncFunction.name,
        dataSize: Array.isArray(data) ? data.length : typeof data,
      });

      return data;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setOperations(prev => ({
        ...prev,
        [key]: { data: null, loading: false, error: errorObj }
      }));

      logger.error(`Async operation '${key}' failed`, errorObj, {
        operation: asyncFunction.name,
      });

      handleError(errorObj);

      if (options.onError) {
        options.onError(errorObj);
      }

      throw errorObj;
    }
  }, [handleError]);

  const reset = useCallback((key: string) => {
    setOperations(prev => ({
      ...prev,
      [key]: { data: null, loading: false, error: null }
    }));
  }, []);

  return {
    operations,
    execute,
    reset,
    getOperation: (key: string) => operations[key] || { data: null, loading: false, error: null },
  };
}

// Hook for handling form submissions with error handling
export function useFormSubmit<T = any>(
  submitFunction: (data: T) => Promise<any>,
  options: UseAsyncOptions = {}
) {
  const [submitState, setSubmitState] = useState<AsyncState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const handleError = useErrorHandler();

  const submit = useCallback(async (formData: T) => {
    setSubmitState({ data: null, loading: true, error: null });

    try {
      const result = await submitFunction(formData);
      setSubmitState({ data: result, loading: false, error: null });

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      logger.info('Form submission successful', {
        formData: typeof formData,
        result: typeof result,
      });

      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setSubmitState({ data: null, loading: false, error: errorObj });

      logger.error('Form submission failed', errorObj, {
        formData: typeof formData,
      });

      handleError(errorObj);

      if (options.onError) {
        options.onError(errorObj);
      }

      throw errorObj;
    }
  }, [submitFunction, options, handleError]);

  return {
    ...submitState,
    submit,
    reset: () => setSubmitState({ data: null, loading: false, error: null }),
  };
}