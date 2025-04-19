import { useState, useCallback, useMemo } from 'react';
import type { LayoutDebugConfig, DebugFeatureState, DebugStateContextType } from '@/types';
import { DEFAULT_FEATURE_STATE } from '@/constants';
import { mergeConfig } from '@/utils/configUtils';
import { useWindowWidth } from './useWindowWidth';
import { useKeyPress } from './useKeyPress';

/**
 * Core hook that handles all state management and orchestration for the layout debugging tools.
 * This separates the logic/state from the UI components.
 */
export function useLayoutDebugEngine(config: Partial<LayoutDebugConfig> = {}) {
  const [isDebugEnabled, setIsDebugEnabled] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [features, setFeatures] = useState<DebugFeatureState>(DEFAULT_FEATURE_STATE);
  const mergedConfig = useMemo(() => mergeConfig(config), [config]);
  const screenWidth = useWindowWidth();
  const containerWidth = mergedConfig.grid.containerWidth || 1440;

  const handleToggleShortcut = useCallback(() => {
    setIsDebugEnabled(prev => !prev);
  }, []);

  useKeyPress('G', handleToggleShortcut, { shift: true });

  const toggleDebug = useCallback(() => setIsDebugEnabled(prev => !prev), []);
  const togglePanel = useCallback(() => setIsPanelOpen(prev => !prev), []);
  const toggleFeature = useCallback((feature: keyof DebugFeatureState) => {
    setFeatures((prev: DebugFeatureState) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  }, []);

  const visibleDelimiters = useMemo(
    () =>
      mergedConfig.breakpoints
        .filter(bp => bp.width > 0 && screenWidth > 0 && bp.width <= screenWidth)
        .map(bp => ({ width: bp.width, color: bp.color })),
    [mergedConfig.breakpoints, screenWidth]
  );

  const constrainedWidth = useMemo(() => {
    return Math.min(containerWidth, screenWidth || containerWidth);
  }, [containerWidth, screenWidth]);

  const debugState: DebugStateContextType = useMemo(
    () => ({
      isDebugEnabled,
      toggleDebug,
      features,
      toggleFeature,
      isPanelOpen,
      togglePanel,
    }),
    [isDebugEnabled, toggleDebug, features, toggleFeature, isPanelOpen, togglePanel]
  );

  return {
    mergedConfig,
    debugState,
    isDebugEnabled,
    isPanelOpen,
    features,
    screenWidth,
    visibleDelimiters,
    constrainedWidth,
    isClient: typeof window !== 'undefined' && screenWidth > 0,
  };
}
