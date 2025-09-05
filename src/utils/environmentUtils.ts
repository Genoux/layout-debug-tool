/**
 * Utility functions for environment detection
 */

/**
 * Detects if the current environment is development.
 * Checks multiple common environment indicators used by different frameworks.
 */
export function isDevelopmentEnvironment(): boolean {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return false;
  }

  // Check common development environment indicators
  const nodeEnv = process.env.NODE_ENV;
  const nextPhase = process.env.NEXT_PHASE;
  const isDev = process.env.DEV;
  
  // Check for development mode indicators
  if (nodeEnv === 'development') {
    return true;
  }
  
  // Next.js specific checks
  if (nextPhase === 'phase-development-server') {
    return true;
  }
  
  // Vite development check
  if (isDev === 'true' || isDev === '1') {
    return true;
  }
  
  // Check for localhost or development domains
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    const isDevelopmentHost = 
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.dev');
    
    if (isDevelopmentHost) {
      return true;
    }
  }
  
  // Check for common development ports
  if (typeof window !== 'undefined' && window.location) {
    const port = window.location.port;
    const commonDevPorts = ['3000', '3001', '4000', '5000', '5173', '8000', '8080', '8888', '9000'];
    if (port && commonDevPorts.includes(port)) {
      return true;
    }
  }
  
  // Check for webpack hot module replacement (indicates development)
  if (typeof window !== 'undefined' && (window as any).webpackHotUpdate) {
    return true;
  }
  
  // Check for Vite HMR
  if (typeof window !== 'undefined' && (window as any).__vite_plugin_react_preamble_installed__) {
    return true;
  }
  
  return false;
}

/**
 * Determines if the debug tool should be enabled based on environment and override settings
 */
export function shouldEnableDebugTool(forceEnable?: boolean): boolean {
  // If forceEnable is explicitly set, use that value
  if (typeof forceEnable === 'boolean') {
    return forceEnable;
  }
  
  // Otherwise, auto-detect development environment
  return isDevelopmentEnvironment();
}