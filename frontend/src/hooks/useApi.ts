import { useCallback, useEffect, useRef, useState } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fires `fn` on mount (and whenever `deps` change).
 * Returns { data, loading, error, refetch }.
 */
export function useApi<T>(
  fn: () => Promise<{ data: T }>,
  deps: unknown[] = [],
) {
  const [state, setState] = useState<UseApiState<T>>({ data: null, loading: true, error: null });
  const mounted = useRef(true);

  const execute = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fn();
      if (mounted.current) setState({ data: res.data, loading: false, error: null });
    } catch (err) {
      if (mounted.current)
        setState({ data: null, loading: false, error: (err as Error).message });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mounted.current = true;
    execute();
    return () => { mounted.current = false; };
  }, [execute]);

  return { ...state, refetch: execute };
}

/**
 * Like useApi but does NOT fire automatically — call `execute(payload)` manually.
 * Useful for mutations (create / update / delete).
 */
export function useMutation<TPayload, TResult>(
  fn: (payload: TPayload) => Promise<{ data: TResult }>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (payload: TPayload): Promise<TResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(payload);
      return res.data;
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { execute, loading, error, clearError: () => setError(null) };
}
