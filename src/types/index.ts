import type * as React from 'react';

export type LayoutDebugProps = {
  children: React.ReactNode;
  config?: Partial<LayoutDebugConfig>;
  /**
   * Force enable/disable the debug tool regardless of environment.
   * If not provided, the tool will automatically hide in production environments.
   * @default undefined (auto-detect environment)
   */
  forceEnable?: boolean;
};

export interface Breakpoint {
  name: string;
  width: number;
  color: string;
}

export interface LayoutDebugConfig {
  breakpoints: Array<Breakpoint>;
  grid: {
    columns: number;
    containerWidth?: number;
    columnWidth?: number;
    contentWidth?: number;
    margin: number;
    gutter: number;
    showColumnNumbers: boolean;
    showGutterValues: boolean;
    showContainerBorder: boolean;
    showContentBorder: boolean;
  };
  appearance: {
    borderOpacity: number;
    fillOpacity: number;
    labelOpacity: number;
    containerColor: string;
    contentColor: string;
    marginColor: string;
    columnColor: string;
    columnEvenOpacityOffset: number;
    indicatorTextColor: string;
    toggleBgColor: string;
    toggleBorderColor: string;
    toggleIconColor: string;
    spacingColor: string;
    elementBorderColor: string;
    panelBgColor: string;
    panelTextColor: string;
  };
  spacing: {
    enabled: boolean;
    showFirstLevelOnly?: boolean;
    showHorizontalSpacing?: boolean;
  };
  elementBorders: {
    enabled: boolean;
    opacity: number;
    width: number;
  };
}

export interface DebugFeatureState {
  grid: boolean;
  breakpoints: boolean;
  spacing: boolean;
  elementBorders: boolean;
}

export interface DebugStateContextType {
  isDebugEnabled: boolean;
  toggleDebug: () => void;
  features: DebugFeatureState;
  toggleFeature: (feature: keyof DebugFeatureState) => void;
  isPanelOpen: boolean;
  togglePanel: () => void;
}
