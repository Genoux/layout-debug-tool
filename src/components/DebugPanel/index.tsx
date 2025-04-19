import * as React from 'react';
import { memo, useContext } from 'react';
import { LayoutDebugContext } from '@/contexts/LayoutDebugContext';
import { DebugStateContext } from '@/contexts/DebugStateContext';
import { hexToRgba } from '@/utils/colorUtils';
import { FeatureToggle } from '@/components/FeatureToggle';

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DebugPanelComponent = () => {
  const config = useContext(LayoutDebugContext);
  const { features, isPanelOpen, togglePanel } = useContext(DebugStateContext);
  const { panelBgColor, panelTextColor } = config.appearance;

  if (!isPanelOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '3.5rem',
        right: '1.25rem',
        zIndex: 50,
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        padding: '0.75rem',
        marginBottom: '0.5rem',
        minWidth: '10rem',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: hexToRgba(panelBgColor, 0.9),
        color: panelTextColor,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      data-layout-debug="true"
      data-layout-debug-ui="true"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.25rem',
          paddingBottom: '0.25rem',
          borderBottom: `1px solid ${hexToRgba(panelTextColor, 0.2)}`,
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Layout Debug</span>
        <button
          type="button"
          onClick={togglePanel}
          style={{
            padding: '0.25rem',
            margin: '-0.25rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            opacity: 0.6,
            color: panelTextColor,
            transition: 'all 150ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '0.6';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Close Panel"
          aria-label="Close Panel"
        >
          <CloseIcon />
        </button>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginTop: '0.5rem' }}
      >
        <FeatureToggle feature="breakpoints" label="Breakpoint" active={features.breakpoints} />
        <FeatureToggle feature="grid" label="Grid Overlay" active={features.grid} />
        <FeatureToggle feature="spacing" label="Spacing" active={features.spacing} />
        <FeatureToggle feature="elementBorders" label="Borders" active={features.elementBorders} />
      </div>
      <div
        style={{
          fontSize: '0.625rem',
          paddingTop: '0.5rem',
          marginTop: '0.5rem',
          opacity: 0.7,
          textAlign: 'center',
          borderTop: `1px solid ${hexToRgba(panelTextColor, 0.2)}`,
        }}
      >
        <kbd
          style={{
            padding: '0 0.25rem',
            borderRadius: '0.25rem',
            backgroundColor: 'rgba(0,0,0,0.2)',
            fontFamily: 'sans-serif',
          }}
        >
          Shift
        </kbd>{' '}
        +{' '}
        <kbd
          style={{
            padding: '0 0.25rem',
            borderRadius: '0.25rem',
            backgroundColor: 'rgba(0,0,0,0.2)',
            fontFamily: 'sans-serif',
          }}
        >
          G
        </kbd>{' '}
        to toggle
      </div>
    </div>
  );
};

DebugPanelComponent.displayName = 'DebugPanel';

export const DebugPanel = memo(DebugPanelComponent);
