import { createContext } from 'react';
import type { LayoutDebugConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

export const LayoutDebugContext = createContext<LayoutDebugConfig>(DEFAULT_CONFIG);
