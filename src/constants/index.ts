import type { LayoutDebugConfig, DebugFeatureState } from '../types';

// Default configuration
export const DEFAULT_CONFIG: LayoutDebugConfig = {
  breakpoints: [
    { name: 'xs', width: 0, color: '#6b7280' },
    { name: 'sm', width: 640, color: '#ec4899' },
    { name: 'md', width: 768, color: '#3b82f6' },
    { name: 'lg', width: 1024, color: '#22c55e' },
    { name: 'xl', width: 1280, color: '#eab308' },
    { name: '2xl', width: 1536, color: '#a855f7' },
  ],
  grid: {
    columns: 12,
    containerWidth: 1440,
    margin: 80,
    gutter: 20,
    showColumnNumbers: true,
    showGutterValues: true,
    showContainerBorder: false,
    showContentBorder: false,
  },
  appearance: {
    borderOpacity: 0.3,
    fillOpacity: 0.1,
    labelOpacity: 0.8,
    containerColor: '#3b82f6',
    contentColor: '#22c55e',
    marginColor: '#ef4444',
    columnColor: '#7c3aed',
    columnEvenOpacityOffset: 0.05,
    indicatorTextColor: '#ffffff',
    toggleBgColor: '#000000',
    toggleBorderColor: '#ffffff',
    toggleIconColor: '#ffffff',
    spacingColor: '#f472b6',
    elementBorderColor: '#94a3b8',
    panelBgColor: '#1f2937',
    panelTextColor: '#f3f4f6',
  },
  spacing: {
    enabled: true,
    showFirstLevelOnly: true,
    showHorizontalSpacing: true,
  },
  elementBorders: {
    enabled: true,
    opacity: 0.2,
    width: 1,
  },
};

// Default feature state
export const DEFAULT_FEATURE_STATE: DebugFeatureState = {
  grid: true,
  breakpoints: true,
  spacing: true,
  elementBorders: true,
};
