import { useEffect } from 'react';

const isBrowser = typeof window !== 'undefined';

/**
 * Hook to execute a callback when a specific key combination is pressed.
 *
 * @param targetKey The main key to listen for (e.g., 'G').
 * @param callback The function to execute when the key combination is pressed.
 * @param modifiers Optional object specifying modifier keys (shift, ctrl, alt, meta). Defaults to only Shift: true.
 */
export function useKeyPress(
  targetKey: string,
  callback: (event: KeyboardEvent) => void,
  modifiers: { shift?: boolean; ctrl?: boolean; alt?: boolean; meta?: boolean } = { shift: true }
): void {
  // Destructure modifiers for the dependency array
  const { shift = true, ctrl = false, alt = false, meta = false } = modifiers;

  useEffect(() => {
    if (!isBrowser) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toUpperCase() !== targetKey.toUpperCase()) return;

      const shiftPressed = event.shiftKey;
      const ctrlPressed = event.ctrlKey;
      const altPressed = event.altKey;
      const metaPressed = event.metaKey;

      if (modifiers.shift && !shiftPressed) return;
      if (modifiers.ctrl && !ctrlPressed) return;
      if (modifiers.alt && !altPressed) return;
      if (modifiers.meta && !metaPressed) return;

      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      callback(event);
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };

    // Dependencies: include the callback and targetKey. Modifier changes are handled implicitly
    // if the callback itself changes based on modifiers, or if the modifiers object reference changes.
  }, [targetKey, callback, modifiers]);
}
