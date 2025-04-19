import type { LayoutDebugConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

export const mergeConfig = (userConfig: Partial<LayoutDebugConfig> = {}): LayoutDebugConfig => ({
  breakpoints: userConfig.breakpoints || DEFAULT_CONFIG.breakpoints,
  grid: { ...DEFAULT_CONFIG.grid, ...(userConfig.grid || {}) },
  appearance: { ...DEFAULT_CONFIG.appearance, ...(userConfig.appearance || {}) },
  spacing: { ...DEFAULT_CONFIG.spacing, ...(userConfig.spacing || {}) },
  elementBorders: { ...DEFAULT_CONFIG.elementBorders, ...(userConfig.elementBorders || {}) },
});
