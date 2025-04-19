import * as React from 'react';
import { memo, useContext } from 'react';
import { LayoutDebugContext } from '@/contexts/LayoutDebugContext';
import { hexToRgba } from '@/utils/colorUtils';

interface GridOverlayProps {
  screenWidth?: number;
}

const GridOverlayComponent = ({ screenWidth }: GridOverlayProps) => {
  const config = useContext(LayoutDebugContext);
  const {
    columns,
    containerWidth = 1440,
    contentWidth: configContentWidth,
    columnWidth: configColumnWidth,
    margin,
    gutter,
    showColumnNumbers,
    showGutterValues,
  } = config.grid;

  const {
    borderOpacity,
    fillOpacity,
    labelOpacity,
    marginColor,
    columnColor,
    columnEvenOpacityOffset,
  } = config.appearance;

  // Calculate content width from container width if not explicitly provided
  const contentWidth = configContentWidth || containerWidth - margin * 2;

  // Calculate column width from content width - fixed calculation, not adaptive
  const columnWidth = configColumnWidth || (contentWidth - gutter * (columns - 1)) / columns;

  // Use fixed container width without screen constraints
  const fixedWidth = containerWidth;

  const columnIds = React.useMemo(() => Array.from({ length: columns }, (_, i) => i), [columns]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
      data-layout-debug="true"
    >
      <div
        style={{
          position: 'relative',
          width: `${fixedWidth}px`,
          height: '100%',
          flexShrink: 0,
        }}
        data-layout-debug="true"
      >
        {/* Margins */}
        {[0, 1].map(side => (
          <div
            key={`margin-${side}`}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              [side === 0 ? 'left' : 'right']: 0,
              width: `${margin}px`,
              borderRight:
                side === 0 ? `1px dashed ${hexToRgba(marginColor, borderOpacity)}` : 'none',
              borderLeft:
                side === 1 ? `1px dashed ${hexToRgba(marginColor, borderOpacity)}` : 'none',
              backgroundColor: hexToRgba(marginColor, fillOpacity / 3),
            }}
            data-layout-debug="true"
          />
        ))}

        {/* Columns Container */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${margin}px`,
            right: `${margin}px`,
            // Fixed content width
            height: '100%',
          }}
          data-layout-debug="true"
        >
          <div
            style={{
              display: 'flex',
              height: '100%',
              width: '100%',
              justifyContent: 'space-between',
            }}
            data-layout-debug="true"
          >
            {columnIds.map(id => (
              <div
                key={id}
                style={{
                  height: '100%',
                  width: `${columnWidth}px`,
                  flexGrow: 0,
                  flexShrink: 0,
                  position: 'relative',
                  backgroundColor: hexToRgba(
                    columnColor,
                    fillOpacity + (id % 2 === 0 ? columnEvenOpacityOffset : 0)
                  ),
                  marginLeft: id > 0 ? `${gutter}px` : 0,
                }}
                data-layout-debug="true"
              >
                {/* Column Numbers */}
                {showColumnNumbers && (id === 0 || id === columns - 1 || id % 3 === 0) && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1.5rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.625rem',
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                      color: hexToRgba(columnColor, labelOpacity),
                    }}
                    data-layout-debug="true"
                  >
                    {id + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

GridOverlayComponent.displayName = 'GridOverlay';

export const GridOverlay = memo(GridOverlayComponent);
