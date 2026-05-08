const STYLE_ID = 'designnote-popover-styles';

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    .dn-popover {
      position: absolute;
      z-index: 2147483645;
      background: #1a1a1a;
      border: 1.5px solid #5865F2;
      border-radius: 10px;
      padding: 10px 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      width: 260px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .dn-popover textarea {
      display: block;
      width: 100%;
      background: transparent;
      border: none;
      color: #f0f0f0;
      font-size: 13px;
      font-family: inherit;
      resize: none;
      outline: none;
      line-height: 1.5;
      min-height: 56px;
    }
    .dn-popover textarea::placeholder { color: #555; }
    .dn-popover-hint {
      font-size: 11px;
      color: #444;
      margin-top: 4px;
      user-select: none;
    }
  `;
  document.head.appendChild(s);
}

export class InlinePopover {
  private div: HTMLDivElement;
  private textarea: HTMLTextAreaElement;
  private closed = false;

  constructor(
    anchor: HTMLElement,
    onChange: (text: string) => void,
    onClose: (text: string) => void,
  ) {
    injectStyles();

    this.div = document.createElement('div');
    this.div.className = 'dn-popover';
    this.div.setAttribute('data-designnote-popover', 'true');

    this.textarea = document.createElement('textarea');
    this.textarea.placeholder = 'Add a design note…';
    this.textarea.rows = 3;

    const hint = document.createElement('div');
    hint.className = 'dn-popover-hint';
    hint.textContent = 'Esc to save · Esc without text removes this note';

    this.div.appendChild(this.textarea);
    this.div.appendChild(hint);
    document.body.appendChild(this.div);
    this.reposition(anchor);

    this.textarea.focus();

    this.textarea.addEventListener('input', () => onChange(this.textarea.value));

    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); this.close(onClose); }
    });
  }

  reposition(anchor: HTMLElement) {
    const rect = anchor.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const SIDEBAR_W = 320;
    const MARGIN = 8;

    let top = rect.bottom + scrollY + MARGIN;
    let left = rect.left + scrollX;

    // Clamp within visible area (avoid sidebar)
    const maxLeft = window.innerWidth - SIDEBAR_W - 260 - MARGIN;
    if (left > maxLeft) left = maxLeft;
    if (left < MARGIN) left = MARGIN;

    // If below the fold, flip above
    if (rect.bottom + 120 > window.innerHeight) {
      top = rect.top + scrollY - 120 - MARGIN;
    }

    this.div.style.top = `${top}px`;
    this.div.style.left = `${left}px`;
  }

  getValue() { return this.textarea.value; }

  close(onClose: (text: string) => void) {
    if (this.closed) return;
    this.closed = true;
    const text = this.textarea.value;
    this.div.remove();
    onClose(text);
  }

  destroy() {
    if (this.closed) return;
    this.closed = true;
    this.div.remove();
  }
}
