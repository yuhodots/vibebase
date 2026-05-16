"use client";

import { useEffect, useState } from "react";

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Returns the current window size and updates on resize.
 * Returns { width: 0, height: 0 } on the server / initial render.
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
