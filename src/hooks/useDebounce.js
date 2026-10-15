import { useState, useEffect } from 'react';

/**
 * Returns `value` after it has stopped changing for `delay` ms.
 * Used by the search bar so we do not query on every keystroke.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
