import { generateSelector } from './SelectorGenerator';
import { captureStyles } from './StyleInjector';
import { STYLE_PROPS } from '../sidebar/store';

const ACCENT       = '#8F55F9';
const ACCENT_FILL  = 'rgba(143, 85, 249, 0.12)';
const PINNED_FILL  = 'rgba(143, 85, 249, 0.08)';
const DN_ATTR      = 'data-designnote-pinned';

type PinCallback = (el: HTMLElement, selector: string, originalStyles: Record<string, string>) => void;

let hovered:    HTMLElement | null = null;
let active   = false;
let onPin:      PinCallback | null = null;
let shadowRoot: ShadowRoot  | null = null;

// ─── Hover overlay (fixed, pointer-events:none) ───────────────────────────
let hoverOverlay: HTMLDivElement | null = null;

function getHoverOverlay(): HTMLDivElement {
  if (!hoverOverlay) {
    hoverOverlay = document.createElement('div');
    hoverOverlay.setAttribute('data-designnote-hover', 'true');
    hoverOverlay.style.cssText = `
      position: fixed; pointer-events: none; z-index: 2147483645;
      background: ${ACCENT_FILL};
      border: 2px solid ${ACCENT};
      border-radius: 2px; box-sizing: border-box;
      transition: top .06s, left .06s, width .06s, height .06s;
    `;
    document.documentElement.appendChild(hoverOverlay);
  }
  return hoverOverlay;
}

function positionOverlay(el: HTMLElement): void {
  const o = getHoverOverlay();
  const r = el.getBoundingClientRect();
  o.style.top    = `${r.top}px`;
  o.style.left   = `${r.left}px`;
  o.style.width  = `${r.width}px`;
  o.style.height = `${r.height}px`;
  o.style.display = 'block';
}

function hideOverlay(): void {
  if (hoverOverlay) hoverOverlay.style.display = 'none';
}

function removeOverlay(): void {
  hoverOverlay?.remove();
  hoverOverlay = null;
}

// ─── Guard ────────────────────────────────────────────────────────────────

function isDesignNoteEvent(e: MouseEvent): boolean {
  if (!shadowRoot) return false;
  return e.composedPath().some((n) => {
    if (n === shadowRoot) return true;
    if (n instanceof HTMLElement) {
      return (
        n.hasAttribute('data-designnote-badge')      ||
        n.hasAttribute('data-designnote-popover')    ||
        n.hasAttribute('data-designnote-hover')      ||
        n.hasAttribute('data-designnote-responsive') ||
        n.id === 'designnote-root'
      );
    }
    return false;
  });
}

// ─── Event handlers ───────────────────────────────────────────────────────

function handleMouseOver(e: MouseEvent): void {
  if (!active) return;
  if (isDesignNoteEvent(e)) return;
  const target = e.target as HTMLElement;
  if (target.hasAttribute(DN_ATTR)) { hideOverlay(); return; }
  hovered = target;
  positionOverlay(target);
}

function handleMouseOut(e: MouseEvent): void {
  if (!active) return;
  if (isDesignNoteEvent(e)) return;
  const target = e.target as HTMLElement;
  if (target === hovered) { hideOverlay(); hovered = null; }
}

function handleClick(e: MouseEvent): void {
  if (!active) return;
  if (isDesignNoteEvent(e)) return;
  const target = e.target as HTMLElement;
  e.preventDefault();
  e.stopPropagation();
  hideOverlay();
  hovered = null;
  const selector     = generateSelector(target);
  const originalStyles = captureStyles(target, STYLE_PROPS);
  onPin?.(target, selector, originalStyles);
}

// ─── Public API ───────────────────────────────────────────────────────────

export function startSelecting(sr: ShadowRoot, callback: PinCallback): void {
  shadowRoot = sr;
  onPin      = callback;
  active     = true;
  document.addEventListener('mouseover', handleMouseOver, true);
  document.addEventListener('mouseout',  handleMouseOut,  true);
  document.addEventListener('click',     handleClick,     true);
}

export function stopSelecting(): void {
  active = false;
  hideOverlay();
  removeOverlay();
  document.removeEventListener('mouseover', handleMouseOver, true);
  document.removeEventListener('mouseout',  handleMouseOut,  true);
  document.removeEventListener('click',     handleClick,     true);
}

export function pauseSelecting(): void {
  active = false;
  hideOverlay();
}

export function resumeSelecting(): void {
  active = true;
}

export function markPinned(el: HTMLElement): void {
  el.setAttribute(DN_ATTR, 'true');
  el.style.outline      = `2px solid ${ACCENT}`;
  el.style.outlineOffset = '1px';
  el.style.boxShadow    = `inset 0 0 0 9999px ${PINNED_FILL}, 0 0 12px rgba(143,85,249,0.25)`;
}

export function unmarkPinned(el: HTMLElement): void {
  el.removeAttribute(DN_ATTR);
  el.style.outline      = '';
  el.style.outlineOffset = '';
  el.style.boxShadow    = '';
}
