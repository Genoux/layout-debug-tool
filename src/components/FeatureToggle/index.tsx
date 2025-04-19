import * as React from 'react';
import { memo, useContext } from 'react';
import { DebugStateContext } from '@/contexts/DebugStateContext';
import { LayoutDebugContext } from '@/contexts/LayoutDebugContext';
import type { DebugFeatureState } from '@/types'; // Use type-only import
import { hexToRgba } from '@/utils/colorUtils';

interface FeatureToggleProps {
  feature: keyof DebugFeatureState;
  label: string;
  active: boolean;
}

const FeatureToggleComponent = ({ feature, label, active }: FeatureToggleProps) => {
  const { toggleFeature } = useContext(DebugStateContext);
  const config = useContext(LayoutDebugContext);

  return (
    <button
      type="button"
      onClick={() => toggleFeature(feature)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
        paddingTop: '0.25rem',
        paddingBottom: '0.25rem',
        borderRadius: '0.375rem',
        transition: 'colors 150ms',
        width: '100%',
        textAlign: 'left',
        backgroundColor: active ? hexToRgba(config.appearance.toggleBgColor, 0.4) : 'transparent',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      data-layout-debug="true"
    >
      <div
        style={{
          width: '0.875rem',
          height: '0.875rem',
          borderRadius: '0.125rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: `1px solid ${config.appearance.panelTextColor}`,
          backgroundColor: active ? config.appearance.toggleIconColor : 'transparent',
        }}
        aria-hidden="true"
      >
        {active && (
          <svg
            width="8"
            height="8"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <title>Checkbox checked</title>
            <path
              d="M1 5L4 8L9 2"
              stroke={config.appearance.panelBgColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span style={{ fontSize: '0.75rem', flexGrow: 1 }}>{label}</span>
    </button>
  );
};

FeatureToggleComponent.displayName = 'FeatureToggle';

export const FeatureToggle = memo(FeatureToggleComponent);
