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
  leftEl: Element | null;
  rightEl: Element | null;
  topDistance: number;
  bottomDistance: number;
  leftDistance: number;
  rightDistance: number;
  parentEl: Element | null;
  parentTopDistance: number | null;
  parentBottomDistance: number | null;
  parentLeftDistance: number | null;
  parentRightDistance: number | null;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const getStyleValues = (el: Element | null) => {
  if (!el) return { top: 0, right: 0, bottom: 0, left: 0 };

  const style = window.getComputedStyle(el);
  return {
    top: Number.parseInt(style.getPropertyValue('padding-top') || '0', 10),
    right: Number.parseInt(style.getPropertyValue('padding-right') || '0', 10),
    bottom: Number.parseInt(style.getPropertyValue('padding-bottom') || '0', 10),
    left: Number.parseInt(style.getPropertyValue('padding-left') || '0', 10),
  };
};

const getMarginValues = (el: Element | null) => {
  if (!el) return { top: 0, right: 0, bottom: 0, left: 0 };

  const style = window.getComputedStyle(el);
  return {
    top: Number.parseInt(style.getPropertyValue('margin-top') || '0', 10),
    right: Number.parseInt(style.getPropertyValue('margin-right') || '0', 10),
    bottom: Number.parseInt(style.getPropertyValue('margin-bottom') || '0', 10),
    left: Number.parseInt(style.getPropertyValue('margin-left') || '0', 10),
  };
};

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
    label,
  }: {
    top: number;
    left: number;
    width: number;
    height: number;
    distance: number;
    color: string;
    label?: string;
    borderOpacity: number;
  }) => {
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
          {label || `${Math.round(distance)}px`}
        </div>
      </div>
    );
  }
);
SpacingIndicator.displayName = 'SpacingIndicator';

const BoxModelIndicator = memo(
  ({
    element,
    color,
    type,
    borderOpacity,
  }: {
    element: Element;
    color: string;
    type: 'padding' | 'margin';
    borderOpacity: number;
  }) => {
    const rect = element.getBoundingClientRect();
    const values = type === 'padding' ? getStyleValues(element) : getMarginValues(element);

    if (Object.values(values).every(v => v === 0)) return null;

    return (
      <>
        {values.top > 0 && (
          <div
            style={{
              position: 'fixed',
              pointerEvents: 'none',
              zIndex: 40,
              top: type === 'padding' ? rect.top : rect.top - values.top,
              left: rect.left,
              width: rect.width,
              height: type === 'padding' ? values.top : values.top,
              backgroundColor: hexToRgba(color, type === 'padding' ? 0.2 : 0.15),
              border: `1px dashed ${hexToRgba(color, borderOpacity)}`,
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
                padding: '0 0.25rem',
                borderRadius: '0.25rem',
                fontSize: '0.7rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                backgroundColor: hexToRgba(color, 0.9),
                color: '#ffffff',
                whiteSpace: 'nowrap',
              }}
              data-layout-debug="true"
            >
              {values.top}px
            </div>
          </div>
        )}

        {values.right > 0 && (
          <div
            style={{
              position: 'fixed',
              pointerEvents: 'none',
              zIndex: 40,
              top: rect.top,
              left: type === 'padding' ? rect.right - values.right : rect.right,
              width: values.right,
              height: rect.height,
              backgroundColor: hexToRgba(color, type === 'padding' ? 0.2 : 0.15),
              border: `1px dashed ${hexToRgba(color, borderOpacity)}`,
              boxSizing: 'border-box',
            }}
            data-layout-debug="true"
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) rotate(90deg)',
                padding: '0 0.25rem',
                borderRadius: '0.25rem',
                fontSize: '0.7rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                backgroundColor: hexToRgba(color, 0.9),
                color: '#ffffff',
                whiteSpace: 'nowrap',
              }}
              data-layout-debug="true"
            >
              {values.right}px
            </div>
          </div>
        )}

        {values.bottom > 0 && (
          <div
            style={{
              position: 'fixed',
              pointerEvents: 'none',
              zIndex: 40,
              top: type === 'padding' ? rect.bottom - values.bottom : rect.bottom,
              left: rect.left,
              width: rect.width,
              height: values.bottom,
              backgroundColor: hexToRgba(color, type === 'padding' ? 0.2 : 0.15),
              border: `1px dashed ${hexToRgba(color, borderOpacity)}`,
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
                padding: '0 0.25rem',
                borderRadius: '0.25rem',
                fontSize: '0.7rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                backgroundColor: hexToRgba(color, 0.9),
                color: '#ffffff',
                whiteSpace: 'nowrap',
              }}
              data-layout-debug="true"
            >
              {values.bottom}px
            </div>
          </div>
        )}

        {values.left > 0 && (
          <div
            style={{
              position: 'fixed',
              pointerEvents: 'none',
              zIndex: 40,
              top: rect.top,
              left: type === 'padding' ? rect.left : rect.left - values.left,
              width: values.left,
              height: rect.height,
              backgroundColor: hexToRgba(color, type === 'padding' ? 0.2 : 0.15),
              border: `1px dashed ${hexToRgba(color, borderOpacity)}`,
              boxSizing: 'border-box',
            }}
            data-layout-debug="true"
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) rotate(-90deg)',
                padding: '0 0.25rem',
                borderRadius: '0.25rem',
                fontSize: '0.7rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                backgroundColor: hexToRgba(color, 0.9),
                color: '#ffffff',
                whiteSpace: 'nowrap',
              }}
              data-layout-debug="true"
            >
              {values.left}px
            </div>
          </div>
        )}
      </>
    );
  }
);
BoxModelIndicator.displayName = 'BoxModelIndicator';

const SpacingInspectorComponent = () => {
  const config = useContext(LayoutDebugContext) as LayoutDebugConfig;
  const { isDebugEnabled, features } = useContext(DebugStateContext) as DebugStateContextType;
  const { spacingColor } = config.appearance;
  const {
    enabled: spacingConfigEnabled,
    showFirstLevelOnly = true,
    showHorizontalSpacing = true,
  } = config.spacing;

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
    let leftEl = null;
    let leftDistance = Number.POSITIVE_INFINITY;
    let rightEl = null;
    let rightDistance = Number.POSITIVE_INFINITY;

    for (const el of elements) {
      const rect = el.getBoundingClientRect();

      // Vertical spacing detection
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

      // Horizontal spacing detection
      if (showHorizontalSpacing) {
        const verticalOverlap = rect.top < targetRect.bottom && rect.bottom > targetRect.top;
        if (verticalOverlap) {
          if (rect.right <= targetRect.left) {
            const distance = targetRect.left - rect.right;
            if (distance < leftDistance) {
              leftEl = el;
              leftDistance = distance;
            }
          } else if (rect.left >= targetRect.right) {
            const distance = rect.left - targetRect.right;
            if (distance < rightDistance) {
              rightEl = el;
              rightDistance = distance;
            }
          }
        }
      }
    }

    let parentInfo: {
      parentEl: HTMLElement | null;
      topDistance: number | null;
      bottomDistance: number | null;
      leftDistance: number | null;
      rightDistance: number | null;
    } = {
      parentEl: null,
      topDistance: null,
      bottomDistance: null,
      leftDistance: null,
      rightDistance: null,
    };

    // Only calculate parent spacing if not in first-level-only mode
    if (!showFirstLevelOnly) {
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
        const pLeftDist = targetRect.left - parentRect.left;
        const pRightDist = parentRect.right - targetRect.right;

        parentInfo = {
          parentEl: immediateParent,
          topDistance: pTopDist,
          bottomDistance: pBottomDist,
          leftDistance: pLeftDist,
          rightDistance: pRightDist,
        };
      }
    }

    setSpacingInfo({
      targetEl: hoveredElement,
      topEl: topEl,
      bottomEl: bottomEl,
      leftEl,
      rightEl,
      topDistance: topDistance,
      bottomDistance: bottomDistance,
      leftDistance,
      rightDistance,
      parentEl: parentInfo.parentEl,
      parentTopDistance: parentInfo.topDistance,
      parentBottomDistance: parentInfo.bottomDistance,
      parentLeftDistance: parentInfo.leftDistance,
      parentRightDistance: parentInfo.rightDistance,
      padding: getStyleValues(hoveredElement),
      margin: getMarginValues(hoveredElement),
    });
  }, [hoveredElement, spacingEnabled, showHorizontalSpacing, showFirstLevelOnly]);

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
        data-layout-debug="true"
      />

      <BoxModelIndicator
        element={spacingInfo.targetEl}
        color={spacingColor}
        type="padding"
        borderOpacity={config.appearance.borderOpacity}
      />

      <BoxModelIndicator
        element={spacingInfo.targetEl}
        color="#ef4444"
        type="margin"
        borderOpacity={config.appearance.borderOpacity}
      />

      {spacingInfo.topEl && (
        <SpacingIndicator
          top={spacingInfo.topEl.getBoundingClientRect().bottom}
          left={targetRect.left}
          width={targetRect.width}
          height={spacingInfo.topDistance}
          distance={spacingInfo.topDistance}
          color={spacingColor}
          label={`Gap: ${Math.round(spacingInfo.topDistance)}px`}
          borderOpacity={config.appearance.borderOpacity}
        />
      )}

      {spacingInfo.bottomEl && (
        <SpacingIndicator
          top={targetRect.bottom}
          left={targetRect.left}
          width={targetRect.width}
          height={spacingInfo.bottomDistance}
          distance={spacingInfo.bottomDistance}
          color={spacingColor}
          label={`Gap: ${Math.round(spacingInfo.bottomDistance)}px`}
          borderOpacity={config.appearance.borderOpacity}
        />
      )}

      {/* Horizontal spacing indicators */}
      {spacingInfo.leftEl && (
        <SpacingIndicator
          top={targetRect.top}
          left={spacingInfo.leftEl.getBoundingClientRect().right}
          width={spacingInfo.leftDistance}
          height={Math.min(targetRect.height, 20)} // Use a fixed or minimum height to prevent overcrowding
          distance={spacingInfo.leftDistance}
          color={spacingColor}
          label={`${Math.round(spacingInfo.leftDistance)}px`}
          borderOpacity={config.appearance.borderOpacity}
        />
      )}

      {spacingInfo.rightEl && (
        <SpacingIndicator
          top={targetRect.top}
          left={targetRect.right}
          width={spacingInfo.rightDistance}
          height={Math.min(targetRect.height, 20)} // Use a fixed or minimum height to prevent overcrowding
          distance={spacingInfo.rightDistance}
          color={spacingColor}
          label={`${Math.round(spacingInfo.rightDistance)}px`}
          borderOpacity={config.appearance.borderOpacity}
        />
      )}

      {/* Only show parent spacing if not in first-level-only mode */}
      {!showFirstLevelOnly && spacingInfo.parentEl && spacingInfo.parentTopDistance !== null && (
        <SpacingIndicator
          top={spacingInfo.parentEl.getBoundingClientRect().top}
          left={targetRect.left}
          width={targetRect.width}
          height={spacingInfo.parentTopDistance}
          distance={spacingInfo.parentTopDistance}
          color={spacingColor}
          label={`Gap: ${Math.round(spacingInfo.parentTopDistance)}px`}
          borderOpacity={config.appearance.borderOpacity * 0.7}
        />
      )}

      {!showFirstLevelOnly && spacingInfo.parentEl && spacingInfo.parentBottomDistance !== null && (
        <SpacingIndicator
          top={targetRect.bottom}
          left={targetRect.left}
          width={targetRect.width}
          height={spacingInfo.parentBottomDistance}
          distance={spacingInfo.parentBottomDistance}
          color={spacingColor}
          label={`Gap: ${Math.round(spacingInfo.parentBottomDistance)}px`}
          borderOpacity={config.appearance.borderOpacity * 0.7}
        />
      )}

      {!showFirstLevelOnly && spacingInfo.parentEl && spacingInfo.parentLeftDistance !== null && (
        <SpacingIndicator
          top={targetRect.top}
          left={spacingInfo.parentEl.getBoundingClientRect().left}
          width={spacingInfo.parentLeftDistance}
          height={Math.min(targetRect.height, 20)}
          distance={spacingInfo.parentLeftDistance}
          color={spacingColor}
          label={`Gap: ${Math.round(spacingInfo.parentLeftDistance)}px`}
          borderOpacity={config.appearance.borderOpacity * 0.7}
        />
      )}

      {!showFirstLevelOnly && spacingInfo.parentEl && spacingInfo.parentRightDistance !== null && (
        <SpacingIndicator
          top={targetRect.top}
          left={targetRect.right}
          width={spacingInfo.parentRightDistance}
          height={Math.min(targetRect.height, 20)}
          distance={spacingInfo.parentRightDistance}
          color={spacingColor}
          label={`Gap: ${Math.round(spacingInfo.parentRightDistance)}px`}
          borderOpacity={config.appearance.borderOpacity * 0.7}
        />
      )}
    </>
  );
};

SpacingInspectorComponent.displayName = 'SpacingInspector';

export const SpacingInspector = memo(SpacingInspectorComponent);
