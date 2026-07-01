import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../sidebar/App';
import { SIDEBAR_CSS } from '../sidebar/styles';
import { startSelecting, stopSelecting, markPinned, unmarkPinned, pauseSelecting, resumeSelecting } from './ElementSelector';
import { apply, reset } from './StyleInjector';
import { useStore } from '../sidebar/store';
import { InlinePopover } from './InlinePopover';
import { enableResponsive, disableResponsive, setSimWidth, isResponsiveEnabled } from './ResponsiveFrame';
import { v4 as uuidv4 } from 'uuid';

const DN_SESSION_KEY = 'dnRestore';

interface SavedPin {
  id: string;
  index: number;
  selector: string;
  comment: string;
  originalStyles: Record<string, string>;
  modifiedStyles: Record<string, string>;
}

let container: HTMLElement | null = null;
let shadow: ShadowRoot | null = null;
let root: ReactDOM.Root | null = null;
let active = false;
let unsubscribeStore: (() => void) | null = null;

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
    reset(prev.el, prev.modifiedStyles);
    unmarkPinned(prev.el);
    removeBadge(prev.id);
    store.removeElement(prev.id);
  }
  activePopover?.destroy();
  activePopover = null;
  activePinId = null;
}

let embedActive = false;
let savedEmbedBody: { width: string; transform: string; overflowX: string } | null = null;
let embedResizeHandler: (() => void) | null = null;

function placeContainer(): void {
  if (!container) return;
  if (embedActive || isResponsiveEnabled()) {
    document.documentElement.appendChild(container);
  } else {
    document.body.appendChild(container);
  }
}

function applyEmbed(embed: boolean): void {
  embedActive = embed;
  if (embed) {
    savedEmbedBody = {
      width: document.body.style.width,
      transform: document.body.style.transform,
      overflowX: document.body.style.overflowX,
    };
    document.body.style.width = `${window.innerWidth - 320}px`;
    document.body.style.transform = 'translate(0,0)';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    embedResizeHandler = () => {
      if (embedActive) document.body.style.width = `${window.innerWidth - 320}px`;
    };
    window.addEventListener('resize', embedResizeHandler);
  } else {
    if (embedResizeHandler) {
      window.removeEventListener('resize', embedResizeHandler);
      embedResizeHandler = null;
    }
    if (savedEmbedBody) {
      document.body.style.width = savedEmbedBody.width;
      document.body.style.transform = savedEmbedBody.transform;
      document.body.style.overflowX = savedEmbedBody.overflowX;
      savedEmbedBody = null;
    }
    document.documentElement.style.overflowX = '';
  }
  placeContainer();
}

let respWidthSetter: ((w: number) => void) | null = null;

function handleResponsiveToggle(enable: boolean, initialWidth: number, onWidth: (w: number) => void): void {
  respWidthSetter = onWidth;
  if (enable) {
    if (container) enableResponsive(container, initialWidth, (w, _h) => onWidth(w));
  } else {
    if (container) disableResponsive(container);
    // disableResponsive moves container to body; re-correct if embed is also active
    placeContainer();
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
        onRefresh={refreshPage}
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
  useStore.getState().initPromptStorage();
  mount();

  unsubscribeStore = useStore.subscribe((state) => {
    if (activePinId && !state.pinnedElements.find((e) => e.id === activePinId)) {
      activePopover?.destroy();
      activePopover = null;
      activePinId = null;
    }
  });

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
          if (el2 && Object.keys(el2.modifiedStyles).length === 0) {
            reset(el2.el, el2.modifiedStyles);
            unmarkPinned(el2.el);
            removeBadge(id);
            useStore.getState().removeElement(id);
          }
        }
      },
    );
  });
}

function refreshPage(): void {
  const store = useStore.getState();
  const saved: SavedPin[] = store.pinnedElements.map(e => ({
    id: e.id,
    index: e.index,
    selector: e.selector,
    comment: e.comment,
    originalStyles: e.originalStyles,
    modifiedStyles: e.modifiedStyles,
  }));
  chrome.storage.session.set({ [DN_SESSION_KEY]: saved }, () => {
    location.reload();
  });
}

function restorePins(saved: SavedPin[]): void {
  const doRestore = () => {
    const store = useStore.getState();
    for (const pin of saved) {
      const el = document.querySelector<HTMLElement>(pin.selector);
      if (!el) continue;
      store.addElement({
        id: pin.id,
        selector: pin.selector,
        el,
        comment: pin.comment,
        originalStyles: pin.originalStyles,
        modifiedStyles: pin.modifiedStyles,
      });
      for (const [prop, value] of Object.entries(pin.modifiedStyles)) {
        apply(el, prop, value);
      }
      markPinned(el);
      const index = useStore.getState().pinnedElements.find(e => e.id === pin.id)?.index ?? pin.index;
      createBadge(pin.id, el, index);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doRestore, { once: true });
  } else {
    doRestore();
  }
}

function deactivate(): void {
  if (!active) return;
  active = false;
  unsubscribeStore?.();
  unsubscribeStore = null;
  if (embedActive) applyEmbed(false);
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

// Auto-restore after a designnote-initiated page refresh
chrome.storage.session.get([DN_SESSION_KEY], (data) => {
  const saved = data[DN_SESSION_KEY] as SavedPin[] | undefined;
  if (saved?.length) {
    chrome.storage.session.remove([DN_SESSION_KEY]);
    activate();
    restorePins(saved);
  }
});
