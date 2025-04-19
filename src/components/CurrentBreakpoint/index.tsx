import * as React from 'react';
import { memo, useContext } from 'react';
import { LayoutDebugContext } from '@/contexts/LayoutDebugContext';
import { hexToRgba } from '@/utils/colorUtils';

interface CurrentBreakpointProps {
  width: number;
}

const CurrentBreakpointComponent = ({ width }: CurrentBreakpointProps) => {
  const config = useContext(LayoutDebugContext);
  const currentBreakpoint =
    [...config.breakpoints].reverse().find(bp => width >= bp.width) || config.breakpoints[0];

  if (!currentBreakpoint) return null; // Should theoretically never happen with the fallback

  return (
    <div
      style={{
        position: 'fixed',
        top: '0.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
        paddingTop: '0.25rem',
        paddingBottom: '0.25rem',
        borderRadius: '9999px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        fontSize: '0.75rem',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        backgroundColor: hexToRgba(currentBreakpoint.color, 1),
        color: config.appearance.indicatorTextColor,
      }}
      data-layout-debug="true"
      data-layout-debug-ui="true"
    >
      <div
        style={{
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: '9999px',
          backgroundColor: '#ffffff',
        }}
        data-layout-debug="true"
      />
      {currentBreakpoint.name} ({width}px)
    </div>
  );
};

CurrentBreakpointComponent.displayName = 'CurrentBreakpoint';

export const CurrentBreakpoint = memo(CurrentBreakpointComponent);
