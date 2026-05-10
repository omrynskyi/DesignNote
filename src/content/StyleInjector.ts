export function apply(el: HTMLElement, prop: string, value: string): void {
  (el.style as unknown as Record<string, string>)[prop] = value;
}

export function reset(el: HTMLElement, modifiedStyles: Record<string, string>): void {
  for (const prop of Object.keys(modifiedStyles)) {
    (el.style as unknown as Record<string, string>)[prop] = '';
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
