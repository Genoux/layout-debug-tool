# React Layout Debug Tool

A React component designed to help visualize and debug CSS layouts, including breakpoints, grid overlays, spacing, and element borders.

## Installation

```bash
npm install react-layout-debug-tool
# or
yarn add react-layout-debug-tool
```

## Usage

Wrap your application or a specific layout section with the `LayoutDebug` component. It's generally recommended to only include this during development.

```tsx
import React from 'react';
import { LayoutDebug, LayoutDebugConfig } from 'react-layout-debug-tool';

// Optional: Define custom configuration
const customConfig: Partial<LayoutDebugConfig> = {
  grid: {
    columns: 24,
    contentWidth: 1440,
    margin: 40,
    gutter: 16,
  },
  appearance: {
    columnColor: '#ff00ff', // Magenta columns!
  }
};

function MyApp({ Component, pageProps }) {
  // Only render LayoutDebug in development
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <>
      {isDevelopment ? (
        <LayoutDebug config={customConfig}>
          <Component {...pageProps} />
        </LayoutDebug>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

export default MyApp;
```

## Features

*   **Breakpoint Indicator:** Shows the current responsive breakpoint based on screen width.
*   **Grid Overlay:** Displays a customizable grid overlay based on your configuration (columns, width, margin, gutter).
*   **Spacing Inspector:** Hover over elements to see the pixel distance to their nearest siblings above and below.
*   **Element Borders:** Adds an outline to all elements (excluding the debug UI itself) to visualize boundaries.

## Toggling Features

*   **Toggle All:** Press `Shift + G` to show/hide the entire debug UI.
*   **Options Panel:** Right-click the toggle button (bottom-right corner) to open a panel where you can individually enable/disable features (Breakpoints, Grid, Spacing, Borders).

## Configuration

You can pass an optional `config` prop to `LayoutDebug` to customize its behavior and appearance. See the `LayoutDebugConfig` type exported from the package for all available options.

```ts
import type { LayoutDebugConfig } from 'react-layout-debug-tool';
```

## Contributing

[Instructions for contributing - TODO]

## License

MIT 