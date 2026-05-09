import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../sidebar/App';
import { SIDEBAR_CSS } from '../sidebar/styles';
import { startSelecting, stopSelecting, markPinned, unmarkPinned, pauseSelecting, resumeSelecting } from './ElementSelector';
import { reset } from './StyleInjector';
import { useStore } from '../sidebar/store';
import { InlinePopover } from './InlinePopover';
import { enableResponsive, disableResponsive, setSimWidth } from './ResponsiveFrame';
import { v4 as uuidv4 } from 'uuid';

let container: HTMLElement | null = null;
let shadow: ShadowRoot | null = null;
let root: ReactDOM.Root | null = null;
let active = false;

// Badge tracking for scroll-update
const badgeRefs = new Map<string, { badge: HTMLElement; el: HTMLElement }>();

function updateAllBadges() {
  for (const { badge, el } of badgeRefs.values()) {
    const rect = el.getBoundingClientRect();
    badge.style.top = `${rect.top + window.scrollY - 10}px`;
    badge.style.left = `${rect.left + window.scrollX - 10}px`;
  }
}

window.addEventListener('scroll', updateAllBadges, { passive: true });
window.addEventListener('resize', updateAllBadges, { passive: true });

function createBadge(id: string, el: HTMLElement, index: number): void {
  const existing = document.querySelector(`[data-designnote-badge="${id}"]`);
  if (existing) return;

  const badge = document.createElement('span');
  badge.setAttribute('data-designnote-badge', id);
  badge.style.cssText = `
    position: absolute;
    width: 20px; height: 20px;
    background: #8F55F9; color: #fff;
    border-radius: 50%;
    font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    z-index: 2147483646; pointer-events: none;
    font-family: -apple-system, sans-serif;
    box-shadow: 0 2px 10px rgba(143,85,249,0.55);
  `;
  badge.textContent = String(index);
  document.documentElement.appendChild(badge);
  badgeRefs.set(id, { badge, el });

  const rect = el.getBoundingClientRect();
  badge.style.top = `${rect.top + window.scrollY - 10}px`;
  badge.style.left = `${rect.left + window.scrollX - 10}px`;
}

function removeBadge(id: string): void {
  const ref = badgeRefs.get(id);
  if (ref) { ref.badge.remove(); badgeRefs.delete(id); }
}

// Inline popover state
let activePopover: InlinePopover | null = null;
let activePinId: string | null = null;

function cancelActivePopoverIfEmpty(): void {
  if (!activePinId) return;
  const store = useStore.getState();
  const prev = store.pinnedElements.find((e) => e.id === activePinId);
  if (prev && !prev.comment && Object.keys(prev.modifiedStyles).length === 0) {
    reset(prev.el, prev.originalStyles);
    unmarkPinned(prev.el);
    removeBadge(prev.id);
    store.removeElement(prev.id);
  }
  activePopover?.destroy();
  activePopover = null;
  activePinId = null;
}

function applyEmbed(embed: boolean): void {
  document.documentElement.style.marginRight = embed ? '320px' : '';
  document.documentElement.style.transition = 'margin-right 0.2s ease';
}

let respWidthSetter: ((w: number) => void) | null = null;

function handleResponsiveToggle(enable: boolean, initialWidth: number, onWidth: (w: number) => void): void {
  respWidthSetter = onWidth;
  if (enable) {
    if (container) enableResponsive(container, initialWidth, (w, _h) => onWidth(w));
  } else {
    if (container) disableResponsive(container);
  }
}

function handleResponsiveWidth(w: number): void {
  setSimWidth(w);
}

function mount(): void {
  if (container) return;

  container = document.createElement('div');
  container.id = 'designnote-root';
  container.style.cssText = 'position: fixed; top: 0; right: 0; z-index: 2147483647; pointer-events: none;';
  document.body.appendChild(container);

  shadow = container.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = SIDEBAR_CSS;
  shadow.appendChild(style);

  const appContainer = document.createElement('div');
  appContainer.style.pointerEvents = 'auto';
  shadow.appendChild(appContainer);

  root = ReactDOM.createRoot(appContainer);
  root.render(
    <React.StrictMode>
      <App
        onClose={deactivate}
        onEmbedChange={applyEmbed}
        onResponsiveToggle={handleResponsiveToggle}
        onResponsiveWidth={handleResponsiveWidth}
        onSelectingPause={(paused) => paused ? pauseSelecting() : resumeSelecting()}
      />
    </React.StrictMode>
  );
}

function activate(): void {
  if (active) return;
  active = true;
  mount();

  startSelecting(shadow!, (el, selector, originalStyles) => {
    cancelActivePopoverIfEmpty();

    const id = uuidv4();
    const store = useStore.getState();
    store.addElement({ id, selector, el, comment: '', originalStyles, modifiedStyles: {} });
    markPinned(el);
    const index = useStore.getState().pinnedElements.find((e) => e.id === id)?.index ?? 1;
    createBadge(id, el, index);

    activePinId = id;
    activePopover = new InlinePopover(
      el,
      (text) => store.updateComment(id, text),
      (text) => {
        activePopover = null;
        activePinId = null;
        if (!text.trim()) {
          const el2 = useStore.getState().pinnedElements.find((e) => e.id === id);
          if (el2) {
            reset(el2.el, el2.originalStyles);
            unmarkPinned(el2.el);
            removeBadge(id);
            useStore.getState().removeElement(id);
          }
        }
      },
    );
  });
}

function deactivate(): void {
  if (!active) return;
  active = false;
  applyEmbed(false);
  if (container) disableResponsive(container);
  activePopover?.destroy();
  activePopover = null;
  activePinId = null;
  stopSelecting();
  // Remove all badges and clear refs
  for (const { badge } of badgeRefs.values()) badge.remove();
  badgeRefs.clear();
  if (root) { root.unmount(); root = null; }
  if (container) { container.remove(); container = null; shadow = null; }
}

chrome.runtime.onMessage.addListener((msg: { type: string }) => {
  if (msg.type !== 'toggle') return;
  if (active) deactivate();
  else activate();
});
