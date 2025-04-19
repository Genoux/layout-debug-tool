# React Layout Debug Tool

Visual debugging tool for React layouts with breakpoint indicators, grid overlays, spacing inspector, and element borders.

## Install

```bash
npm install layout-debug-tool
```

## Quick Start

```tsx
import { LayoutDebug } from 'layout-debug-tool';

function App() {
  return (
    <LayoutDebug>
      <YourApp />
    </LayoutDebug>
  );
}
```

## Features

- **Breakpoint Indicator**: Shows current responsive breakpoint
- **Grid Overlay**: Visualizes your layout grid (customizable columns, width, etc.)
- **Spacing Inspector**: Hover elements to see distances to siblings
- **Element Borders**: Outlines all elements for boundary visualization

## Controls

- **Toggle All**: Press `Shift + G` to show/hide debug UI
- **Options Panel**: Right-click toggle button (bottom-right) for feature settings

## Configuration

```tsx
// Example custom configuration
const config = {
  grid: {
    columns: 24,
    contentWidth: 1440,
    margin: 40,
    gutter: 16,
  },
  appearance: {
    columnColor: '#ff00ff',
  }
};

<LayoutDebug config={config}>
  <YourApp />
</LayoutDebug>
```
