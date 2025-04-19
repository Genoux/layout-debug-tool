import { createContext } from 'react';
import type { DebugStateContextType } from '../types';
import { DEFAULT_FEATURE_STATE } from '../constants';

const noop = () => {}; // Helper for default context values

export const DebugStateContext = createContext<DebugStateContextType>({
  isDebugEnabled: false,
  toggleDebug: noop,
  features: DEFAULT_FEATURE_STATE,
  toggleFeature: noop,
  isPanelOpen: false,
  togglePanel: noop,
});
