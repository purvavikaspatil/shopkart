import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Runs an async function and tracks { data, loading, error }.
 *
 * Guards against setting state after unmount and ignores responses from
 * superseded calls, which is what causes flicker when filters change fast.
 *
 * @template T
 * @param {() => Promise<T>} asyncFn
 * @param {Array} deps re-runs when these change
 * @param {{ immediate?: boolean, initialData?: T }} [options]
 */
export function useAsync(asyncFn, deps = [], options = {}) {
  const { immediate = true, initialData = null } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const mounted = useRef(true);
  const callId = useRef(0);
  const fnRef = useRef(asyncFn);
  fnRef.current = asyncFn;

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const run = useCallback(async () => {
    const id = callId.current + 1;
    callId.current = id;
    setLoading(true);
    setError(null);
    try {
      const result = await fnRef.current();
      // Drop the result if a newer call started while this one was in flight.
      if (mounted.current && callId.current === id) setData(result);
      return result;
    } catch (err) {
      if (mounted.current && callId.current === id) setError(err);
      return null;
    } finally {
      if (mounted.current && callId.current === id) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: run, setData };
}

export default useAsync;
