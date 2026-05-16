"use client";

import { useEffect, useState } from "react";

/**
 * Debounces a value by `delay` milliseconds.
 * Useful for search inputs and other rapidly-changing values.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
