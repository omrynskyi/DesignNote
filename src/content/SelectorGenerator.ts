export function generateSelector(el: HTMLElement): string {
  if (el.id) return `#${CSS.escape(el.id)}`;

  const path: string[] = [];
  let current: HTMLElement | null = el;

  while (current && current !== document.body) {
    const tag = current.tagName.toLowerCase();
    const classes = Array.from(current.classList)
      .filter((c) => !c.startsWith('designnote-'))
      .slice(0, 2)
      .map((c) => `.${CSS.escape(c)}`)
      .join('');

    let segment = tag + classes;

    // Add :nth-child if needed to disambiguate
    if (current.parentElement) {
      const siblings = Array.from(current.parentElement.children).filter(
        (s) => s.tagName === current!.tagName
      );
      if (siblings.length > 1) {
        const idx = siblings.indexOf(current) + 1;
        segment += `:nth-of-type(${idx})`;
      }
    }

    path.unshift(segment);
    current = current.parentElement;

    // Stop if we have a unique enough selector already
    if (path.length >= 3) break;
  }

  return path.join(' > ');
}
