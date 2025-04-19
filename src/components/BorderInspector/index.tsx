import * as React from 'react';
import { memo, useEffect, useContext } from 'react';
import { LayoutDebugContext } from '@/contexts/LayoutDebugContext';
import { DebugStateContext } from '@/contexts/DebugStateContext';
import { hexToRgba } from '@/utils/colorUtils';
import type { LayoutDebugConfig, DebugStateContextType } from '@/types';

const BorderInspectorComponent = () => {
  const config = useContext(LayoutDebugContext) as LayoutDebugConfig;
  const { isDebugEnabled, features } = useContext(DebugStateContext) as DebugStateContextType;
  const { elementBorderColor } = config.appearance;
  const {
    enabled: bordersConfigEnabled,
    opacity: borderOpacity,
    width: borderWidth,
  } = config.elementBorders;

  const bordersEnabled = isDebugEnabled && features.elementBorders && bordersConfigEnabled;

  useEffect(() => {
    const styleId = 'layout-debug-element-borders';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

    if (bordersEnabled) {
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.setAttribute('id', styleId);
        document.head.appendChild(styleElement);
      }

      // Further refined CSS to preserve delimiter borders but not add outlines to text elements
      const borderStyleContent = `
        /* Apply outline to regular elements */
        body *:not(script):not(style):not(link):not(meta):not(title):not(head):not(br):not(wbr) {
          outline: ${borderWidth}px solid ${hexToRgba(elementBorderColor, borderOpacity)} !important;
          outline-offset: -${borderWidth}px !important;
        }
        
        /* Remove outline from all debug UI elements and text elements */
        body [data-layout-debug-ui="true"],
        body [data-layout-debug-ui="true"] *,
        body div[data-layout-debug="true"] > div[data-layout-debug="true"] {
          outline: none !important;
        }
        
        /* Preserve existing borders on debug visualization elements */
        body div[data-layout-debug="true"] {
          outline-style: none !important;
        }
      `;
      styleElement.textContent = borderStyleContent;
    } else {
      if (styleElement) {
        styleElement.remove();
      }
    }

    return () => {
      const elToRemove = document.getElementById(styleId);
      if (elToRemove) {
        elToRemove.remove();
      }
    };
  }, [bordersEnabled, elementBorderColor, borderOpacity, borderWidth]);

  return null;
};

BorderInspectorComponent.displayName = 'BorderInspector';

export const BorderInspector = memo(BorderInspectorComponent);
