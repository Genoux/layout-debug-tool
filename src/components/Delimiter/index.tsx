import React from 'react';
import { memo } from 'react';
import { hexToRgba } from '@/utils/colorUtils';

interface DelimiterProps {
  width: number;
  color: string;
}

const DelimiterComponent = ({ width, color }: DelimiterProps) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: `${width}px`,
      borderLeft: `1px dashed ${hexToRgba(color, 0.5)}`,
      borderRight: `1px dashed ${hexToRgba(color, 0.5)}`,
    }}
    data-layout-debug="true"
  >
    <div
      style={{
        position: 'absolute',
        right: 0,
        transform: 'translateX(100%)',
        paddingLeft: '0.25rem',
        top: '1rem',
        fontSize: '0.75rem',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        color,
      }}
      data-layout-debug="true"
    >
      {width}
    </div>
  </div>
);

DelimiterComponent.displayName = 'Delimiter';

export const Delimiter = memo(DelimiterComponent);
