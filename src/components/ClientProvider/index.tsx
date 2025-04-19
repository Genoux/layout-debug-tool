import * as React from 'react';
const { useState, useEffect } = React;

/**
 * Client-side only provider that prevents SSR rendering
 * Use this in Next.js or other SSR environments to prevent hydration errors
 */
export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? <>{children}</> : null;
}
