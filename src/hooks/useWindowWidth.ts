import { useState, useEffect } from 'react';

const isBrowser = typeof window !== 'undefined';

// Debounce function
function debounce<F extends (...args: unknown[]) => unknown>(
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

export function useWindowWidth(debounceMs = 150): number {
  const [screenWidth, setScreenWidth] = useState(isBrowser ? window.innerWidth : 0);

  useEffect(() => {
    if (!isBrowser) return;

    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    // Initial width is already set by useState
    // updateScreenWidth();

    const debouncedHandleResize = debounce(updateScreenWidth, debounceMs);

    window.addEventListener('resize', debouncedHandleResize);

    // Cleanup listener on unmount
    return () => {
      // The timeout is cleared within the debounce function on subsequent calls.
      // Removing the event listener is the primary cleanup needed here.
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [debounceMs]); // Re-run effect if debounceMs changes

  return screenWidth;
}
