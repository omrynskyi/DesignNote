export function apply(el: HTMLElement, prop: string, value: string): void {
  (el.style as unknown as Record<string, string>)[prop] = value;
}

export function reset(el: HTMLElement, originalStyles: Record<string, string>): void {
  // Clear all inline styles we may have set, then restore originals
  const allProps = Object.keys(originalStyles);
  for (const prop of allProps) {
    (el.style as unknown as Record<string, string>)[prop] = originalStyles[prop];
  }
}

export function captureStyles(el: HTMLElement, props: readonly string[]): Record<string, string> {
  const computed = window.getComputedStyle(el);
  const result: Record<string, string> = {};
  for (const prop of props) {
    result[prop] = computed.getPropertyValue(prop).trim();
  }
  return result;
}
