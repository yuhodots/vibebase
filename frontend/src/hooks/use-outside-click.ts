"use client";

import { useCallback, useEffect, type RefObject } from "react";

/**
 * Calls `onOutsideClick` when a mousedown happens outside the referenced element.
 * Useful for closing dropdowns, popovers, and menus.
 */
export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutsideClick: () => void,
): void {
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    },
    [ref, onOutsideClick],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [handleClick]);
}
