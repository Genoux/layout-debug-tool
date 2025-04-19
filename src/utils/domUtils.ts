export const isElementVisible = (element: Element | null): boolean => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  // Check visibility style as well
  const style = window.getComputedStyle(element);
  const isHidden =
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    Number.parseFloat(style.opacity) === 0;
  return rect.width > 0 && rect.height > 0 && !isHidden;
};

export const isDebugElement = (element: Element | null): boolean => {
  if (!element) return false;
  // Check the element itself
  if (element.hasAttribute('data-layout-debug')) return true;
  // Check its parents
  let parent = element.parentElement;
  while (parent) {
    if (parent.hasAttribute('data-layout-debug')) return true;
    parent = parent.parentElement;
  }
  return false;
};
