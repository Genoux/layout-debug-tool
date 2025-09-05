import * as React from 'react';

const _unused = React;
import { LayoutDebugContext } from '@/contexts/LayoutDebugContext';
import { DebugStateContext } from '@/contexts/DebugStateContext';
import { useLayoutDebugEngine } from '@/hooks/useLayoutDebugEngine';
import { shouldEnableDebugTool } from '@/utils/environmentUtils';
import type { LayoutDebugProps } from '@/types';

import { CurrentBreakpoint } from '@/components/CurrentBreakpoint';
import { Delimiter } from '@/components/Delimiter';
import { GridOverlay } from '@/components/GridOverlay';
import { SpacingInspector } from '@/components/SpacingInspector';
import { BorderInspector } from '@/components/BorderInspector';
import { DebugButton } from '@/components/DebugButton';
import { DebugPanel } from '@/components/DebugPanel';
import { ClientProvider } from '@/components/ClientProvider';

/**
 * Main component that visualizes layout debugging information.
 * Automatically hides in production environments unless forceEnable is set to true.
 */
export const LayoutDebugger: React.FC<LayoutDebugProps> = ({ children, config = {}, forceEnable }) => {
  const {
    mergedConfig,
    debugState,
    isDebugEnabled,
    features,
    screenWidth,
    visibleDelimiters,
    constrainedWidth,
    isClient,
  } = useLayoutDebugEngine(config);

  // Check if debug tool should be enabled based on environment
  const shouldShowDebugTool = shouldEnableDebugTool(forceEnable);

  // Early return if not in development and not force enabled
  if (!shouldShowDebugTool) {
    return <>{children}</>;
  }

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <LayoutDebugContext.Provider value={mergedConfig}>
      <DebugStateContext.Provider value={debugState}>
        <div data-layout-debug="true">
          {isDebugEnabled && (
            <>
              {features.breakpoints && <CurrentBreakpoint width={screenWidth} />}

              {features.breakpoints && (
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    pointerEvents: 'none',
                    zIndex: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    overflow: 'hidden',
                  }}
                  data-layout-debug="true"
                >
                  <div
                    style={{
                      position: 'relative',
                      width: `${constrainedWidth}px`,
                      maxWidth: '100%',
                      height: '100%',
                      flexShrink: 0,
                    }}
                    data-layout-debug="true"
                  >
                    {visibleDelimiters.map((delimiter: { width: number; color: string }) => (
                      <Delimiter
                        key={delimiter.width}
                        width={delimiter.width}
                        color={delimiter.color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {features.grid && <GridOverlay screenWidth={screenWidth} />}

              {features.spacing && <SpacingInspector />}

              {features.elementBorders && <BorderInspector />}
            </>
          )}

          <DebugButton />
          <DebugPanel />

          {children}
        </div>
      </DebugStateContext.Provider>
    </LayoutDebugContext.Provider>
  );
};

export const LayoutDebug = LayoutDebugger;
export const LayoutDebugTool = LayoutDebugger;

export { useLayoutDebugEngine };

export { CurrentBreakpoint };
export { DebugButton };
export { DebugPanel };
export { GridOverlay };
export { SpacingInspector };
export { BorderInspector };
export { ClientProvider };

export type {
  LayoutDebugProps,
  LayoutDebugConfig,
  DebugFeatureState,
  DebugStateContextType,
  Breakpoint,
} from '@/types';
