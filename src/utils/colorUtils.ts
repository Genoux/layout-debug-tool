export const hexToRgba = (hex: string, alpha = 1): string => {
  if (!hex || !hex.startsWith('#') || (hex.length !== 7 && hex.length !== 4)) {
    console.warn(`Invalid hex color provided to hexToRgba: ${hex}`);
    return hex;
  }

  let rHex: string;
  let gHex: string;
  let bHex: string;

  if (hex.length === 4) {
    // Handle shorthand hex (e.g., #RGB)
    rHex = hex.slice(1, 2) + hex.slice(1, 2);
    gHex = hex.slice(2, 3) + hex.slice(2, 3);
    bHex = hex.slice(3, 4) + hex.slice(3, 4);
  } else {
    // Handle full hex (e.g., #RRGGBB)
    rHex = hex.slice(1, 3);
    gHex = hex.slice(3, 5);
    bHex = hex.slice(5, 7);
  }

  const r = Number.parseInt(rHex, 16);
  const g = Number.parseInt(gHex, 16);
  const b = Number.parseInt(bHex, 16);

  // Clamp alpha value between 0 and 1
  const clampedAlpha = Math.max(0, Math.min(1, alpha));

  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
};
