import * as React from 'react';
import { memo, useState, useEffect, useContext } from 'react';
import { LayoutDebugContext } from '@/contexts/LayoutDebugContext';
import { DebugStateContext } from '@/contexts/DebugStateContext';
import { hexToRgba } from '@/utils/colorUtils';
import { isElementVisible } from '@/utils/domUtils';
import type { LayoutDebugConfig, DebugStateContextType } from '@/types';

interface SpacingInfo {
  targetEl: Element;
  topEl: Element | null;
  bottomEl: Element | null;
  topDistance: number;
  bottomDistance: number;
  parentEl: Element | null;
  parentTopDistance: number | null;
  parentBottomDistance: number | null;
}

const isDebugElement = (el: Element | null): boolean => {
  if (!el) return false;

  if (el.hasAttribute('data-layout-debug-ui') || el.getAttribute('data-layout-debug') === 'true') {
    return true;
  }

  let parent = el.parentElement;
  while (parent) {
    if (parent.hasAttribute('data-layout-debug-ui')) {
      return true;
    }
    parent = parent.parentElement;
  }

  return false;
};

const SpacingIndicator = memo(
  ({
    top,
    left,
    width,
    height,
    distance,
    color,
  }: {
    top: number;
    left: number;
    width: number;
    height: number;
    distance: number;
    color: string;
    borderOpacity: number;
  }) => {
    // Filter out zero-distance and extremely large distances
    if (!Number.isFinite(distance) || distance > 384 || distance === 0) return null;

    return (
      <div
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 40,
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: hexToRgba(color, 0.2),
          borderLeft: `1px dashed ${hexToRgba(color, 0.5)}`,
          borderRight: `1px dashed ${hexToRgba(color, 0.5)}`,
          boxSizing: 'border-box',
        }}
        data-layout-debug="true"
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '0 0.375rem',
            paddingTop: '0.125rem',
            paddingBottom: '0.125rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            backgroundColor: hexToRgba(color, 0.9),
            color: '#ffffff',
            whiteSpace: 'nowrap',
          }}
          data-layout-debug="true"
        >
          {Math.round(distance)}px
        </div>
      </div>
    );
  }
);
SpacingIndicator.displayName = 'SpacingIndicator';

const SpacingInspectorComponent = () => {
  const config = useContext(LayoutDebugContext) as LayoutDebugConfig;
  const { isDebugEnabled, features } = useContext(DebugStateContext) as DebugStateContextType;
  const { spacingColor } = config.appearance;
  const { enabled: spacingConfigEnabled } = config.spacing;

  const spacingEnabled = isDebugEnabled && features.spacing && spacingConfigEnabled;

  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [spacingInfo, setSpacingInfo] = useState<SpacingInfo | null>(null);

  useEffect(() => {
    if (!spacingEnabled) {
      setHoveredElement(null);
      setSpacingInfo(null);
      return;
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;

      if (
        target.tagName === 'HTML' ||
        target.tagName === 'BODY' ||
        target.tagName === 'SCRIPT' ||
        target.tagName === 'STYLE'
      ) {
        return;
      }

      if (isDebugElement(target) || !isElementVisible(target)) {
        return;
      }

      setHoveredElement(target);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as Element;

      if (!relatedTarget || relatedTarget.tagName === 'HTML' || relatedTarget.tagName === 'BODY') {
        setHoveredElement(null);
        setSpacingInfo(null);
        return;
      }

      if (isDebugElement(relatedTarget)) {
        setHoveredElement(null);
        setSpacingInfo(null);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      setHoveredElement(null);
      setSpacingInfo(null);
    };
  }, [spacingEnabled]);

  useEffect(() => {
    if (!spacingEnabled || !hoveredElement) {
      setSpacingInfo(null);
      return;
    }

    const targetRect = hoveredElement.getBoundingClientRect();
    const allElements = Array.from(document.querySelectorAll('body *'));

    const elements = allElements.filter(el => {
      if (isDebugElement(el)) {
        return false;
      }

      if (!isElementVisible(el)) {
        return false;
      }

      if (el === hoveredElement || el.contains(hoveredElement) || hoveredElement.contains(el)) {
        return false;
      }

      return true;
    });

    let topEl = null;
    let topDistance = Number.POSITIVE_INFINITY;
    let bottomEl = null;
    let bottomDistance = Number.POSITIVE_INFINITY;

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      const horizontalOverlap = rect.left < targetRect.right && rect.right > targetRect.left;

      if (horizontalOverlap) {
        if (rect.bottom <= targetRect.top) {
          const distance = targetRect.top - rect.bottom;
          if (distance < topDistance) {
            topEl = el;
            topDistance = distance;
          }
        } else if (rect.top >= targetRect.bottom) {
          const distance = rect.top - targetRect.bottom;
          if (distance < bottomDistance) {
            bottomEl = el;
            bottomDistance = distance;
          }
        }
      }
    }

    let parentInfo: {
      parentEl: HTMLElement | null;
      topDistance: number | null;
      bottomDistance: number | null;
    } = {
      parentEl: null,
      topDistance: null,
      bottomDistance: null,
    };

    const immediateParent = hoveredElement.parentElement;
    if (
      immediateParent &&
      immediateParent.tagName !== 'BODY' &&
      immediateParent.tagName !== 'HTML' &&
      !isDebugElement(immediateParent)
    ) {
      const parentRect = immediateParent.getBoundingClientRect();
      const pTopDist = targetRect.top - parentRect.top;
      const pBottomDist = parentRect.bottom - targetRect.bottom;

      parentInfo = {
        parentEl: immediateParent,
        topDistance: pTopDist,
        bottomDistance: pBottomDist,
      };
    }

    setSpacingInfo({
      targetEl: hoveredElement,
      topEl: topEl,
      bottomEl: bottomEl,
      topDistance: topDistance,
      bottomDistance: bottomDistance,
      parentEl: parentInfo.parentEl,
      parentTopDistance: parentInfo.topDistance,
      parentBottomDistance: parentInfo.bottomDistance,
    });
  }, [hoveredElement, spacingEnabled]);

  if (!spacingEnabled || !spacingInfo) return null;

  const targetRect = spacingInfo.targetEl.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (
    targetRect.bottom < 0 ||
    targetRect.top > viewportHeight ||
    targetRect.right < 0 ||
    targetRect.left > viewportWidth
  ) {
    return null;
  }

  return (
    <>
      {/* Target Element Highlight */}
      <div
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 40,
          top: `${targetRect.top}px`,
          left: `${targetRect.left}px`,
          width: `${targetRect.width}px`,
          height: `${targetRect.height}px`,
          border: `2px solid ${hexToRgba(spacingColor, 0.8)}`,
          backgroundColor: hexToRgba(spacingColor, 0.1),
          boxSizing: 'border-box',
        }}
        data-layout-debug="true" // Mark as debug element
      />

      {/* Top Spacing Indicator - SpacingIndicator component will filter out zero values */}
      {spacingInfo.topEl && (
        <SpacingIndicator
          top={spacingInfo.topEl.getBoundingClientRect().bottom}
          left={targetRect.left}
          width={targetRect.width}
          height={spacingInfo.topDistance}
          distance={spacingInfo.topDistance}
          color={spacingColor}
          borderOpacity={config.appearance.borderOpacity} // Pass necessary config
        />
      )}

      {/* Bottom Spacing Indicator - SpacingIndicator component will filter out zero values */}
      {spacingInfo.bottomEl && (
        <SpacingIndicator
          top={targetRect.bottom}
          left={targetRect.left}
          width={targetRect.width}
          height={spacingInfo.bottomDistance}
          distance={spacingInfo.bottomDistance}
          color={spacingColor}
          borderOpacity={config.appearance.borderOpacity}
        />
      )}

      {/* Parent Top Spacing Indicator - SpacingIndicator component will filter out zero values */}
      {spacingInfo.parentEl && spacingInfo.parentTopDistance !== null && (
        <SpacingIndicator
          top={spacingInfo.parentEl.getBoundingClientRect().top}
          left={targetRect.left}
          width={targetRect.width}
          height={spacingInfo.parentTopDistance}
          distance={spacingInfo.parentTopDistance}
          color={spacingColor}
          borderOpacity={config.appearance.borderOpacity * 0.7}
        />
      )}

      {/* Parent Bottom Spacing Indicator - SpacingIndicator component will filter out zero values */}
      {spacingInfo.parentEl && spacingInfo.parentBottomDistance !== null && (
        <SpacingIndicator
          top={targetRect.bottom}
          left={targetRect.left}
          width={targetRect.width}
          height={spacingInfo.parentBottomDistance}
          distance={spacingInfo.parentBottomDistance}
          color={spacingColor}
          borderOpacity={config.appearance.borderOpacity * 0.7}
        />
      )}
    </>
  );
};

SpacingInspectorComponent.displayName = 'SpacingInspector';

export const SpacingInspector = memo(SpacingInspectorComponent);
