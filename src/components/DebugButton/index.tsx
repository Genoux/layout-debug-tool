import * as React from 'react';

const _unused = React;

import { memo, useContext } from 'react';
import { LayoutDebugContext } from '@/contexts/LayoutDebugContext';
import { DebugStateContext } from '@/contexts/DebugStateContext';
import { hexToRgba } from '@/utils/colorUtils';

// Grid icon component
const GridIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

const DebugButtonComponent = () => {
  const config = useContext(LayoutDebugContext);
  const { isDebugEnabled, toggleDebug, togglePanel, isPanelOpen } = useContext(DebugStateContext);
  const { toggleBgColor, toggleBorderColor, toggleIconColor } = config.appearance;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.button === 0) {
      toggleDebug();
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    togglePanel();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2rem',
        height: '2rem',
        borderRadius: '9999px',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        transition: 'all 150ms ease-in-out',
        backgroundColor: hexToRgba(toggleBgColor, isDebugEnabled ? 0.8 : 0.5),
        borderColor: hexToRgba(toggleBorderColor, isPanelOpen ? 0.8 : 0.3),
        color: toggleIconColor,
        ...(isPanelOpen
          ? {
              outline: '2px solid rgba(0,0,0,0.2)',
              outlineOffset: '1px',
            }
          : {}),
      }}
      data-layout-debug="true"
      data-layout-debug-ui="true"
      title="Toggle layout debug (Shift+G). Right-click for options."
      aria-label={`${isDebugEnabled ? 'Hide' : 'Show'} Layout Debug. ${isPanelOpen ? 'Options panel is open.' : 'Right-click for options.'}`}
      aria-pressed={isDebugEnabled}
      aria-haspopup="true"
      aria-expanded={isPanelOpen}
      aria-controls="layout-debug-panel"
    >
      <GridIcon />
    </button>
  );
};

DebugButtonComponent.displayName = 'DebugButton';

export const DebugButton = memo(DebugButtonComponent);
