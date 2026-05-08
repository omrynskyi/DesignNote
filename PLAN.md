# DesignNote Chrome Extension — Implementation Plan

## Context

DesignNote is a Chrome extension that lets developers/designers visually annotate UI elements on any webpage, make live CSS tweaks, and export a structured prompt for Claude. Currently only the product spec exists (`Design Note Claude.md`). No code has been written. This plan covers a complete V1 build.

---

## Project Structure

```
DesignNote/
├── manifest.json
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── content/
│   │   ├── index.tsx          # Content script entry — mounts shadow DOM + sidebar
│   │   ├── ElementSelector.ts # Hover highlight + click-to-pin logic
│   │   ├── StyleInjector.ts   # Apply/remove live style overrides
│   │   └── SelectorGenerator.ts # Produce CSS selector for a clicked element
│   ├── sidebar/
│   │   ├── App.tsx            # Sidebar root component
│   │   ├── styles.ts          # All sidebar CSS as a string (injected into shadow DOM)
│   │   ├── store.ts           # Zustand store — session state + prompt builder
│   │   └── components/
│   │       ├── PinnedElementList.tsx  # List of all pinned elements
│   │       ├── PinnedElementCard.tsx  # Per-element card with badge + comment
│   │       ├── StyleEditor.tsx        # Spacing/typography/border/color controls
│   │       ├── PromptPanel.tsx        # Prompt preview + Copy button
│   │       └── Toolbar.tsx            # Clear-all, close, header
│   └── background/
│       └── service-worker.ts  # Manifest V3 service worker (keyboard shortcut handler)
├── public/
│   ├── icons/                 # 16/32/48/128px extension icons
│   ├── popup.html             # Browser action popup (activate/deactivate toggle)
│   └── popup.js               # Popup logic
└── PLAN.md                    # This file
```

---

## Phase 1 — Project Setup

**Goal:** Runnable Chrome extension skeleton with sidebar visible.

**Dependencies:**
- `react`, `react-dom`, `zustand`, `uuid`
- `vite`, `@crxjs/vite-plugin`, `@vitejs/plugin-react`
- `@types/chrome`, `@types/react`, `@types/react-dom`, `@types/uuid`, `typescript`

**Key config files:**
- `manifest.json` — Manifest V3, content scripts on `<all_urls>`, `Alt+Shift+D` command
- `vite.config.ts` — CRXJS plugin reads manifest and handles MV3 bundling
- `tsconfig.json` — strict mode, `lib: ["ES2022", "DOM"]`

**Verify:** `npm install && npm run build` → `dist/` produced, loads in `chrome://extensions`

---

## Phase 2 — Shadow DOM Injection & Sidebar Shell

**`src/content/index.tsx`:**
- `activate()`: creates `#designnote-root`, attaches shadow DOM, injects CSS string, renders `<App />`
- `deactivate()`: unmounts React root, removes container from DOM
- Listens for `window.dispatchEvent('designnote:toggle')` (fired by popup and keyboard shortcut)

**`src/sidebar/App.tsx`:**
- Fixed-position right sidebar (320px wide, full viewport height, z-index max)
- Two tabs: **Annotations** | **Prompt**

---

## Phase 3 — Element Selection

**`src/content/ElementSelector.ts`:**
- `mouseover` → add glowing outline (`2px solid #6C63FF`) to hovered element
- `mouseout` → clear outline (unless pinned)
- `click` (capture phase) → `preventDefault`, `stopPropagation`, call pin callback
- Guards: skip elements inside shadow root via `composedPath()`

**`src/content/SelectorGenerator.ts`:**
- Walk up DOM building minimal selector (prefer `#id`, then `.class` combos, then `tag:nth-of-type`)
- Stops after 3 segments

**State shape (Zustand store):**
```ts
interface PinnedElement {
  id: string;           // uuid
  index: number;        // 1-based
  selector: string;     // CSS selector
  el: HTMLElement;      // live DOM reference
  comment: string;
  originalStyles: Record<string, string>;
  modifiedStyles: Record<string, string>;
}
```

**Badge:** Absolutely-positioned `<span data-designnote-badge="id">` injected into host page body, positioned via `getBoundingClientRect`.

---

## Phase 4 — Style Editor

**`src/sidebar/components/StyleEditor.tsx`:**
- Properties exposed: padding (4 sides), margin (top/bottom), gap, font-size, font-weight, line-height, color, background-color, border-radius, border-width, border-color, border-style, box-shadow
- Control types: text input (with units), color picker + hex text input, select dropdown, shadow preset buttons (None/SM/MD/LG)
- Each change: calls `StyleInjector.apply(el, prop, value)` (live preview) + `store.updateStyle(id, prop, value)` (tracking)

**`src/content/StyleInjector.ts`:**
- `apply(el, prop, val)` — `el.style[prop] = val`
- `reset(el, originals)` — restore all original values
- `captureStyles(el, props)` — reads computed styles on pin

---

## Phase 5 — Prompt Builder

**`src/sidebar/store.ts` — `buildPrompt(elements)`:**
```
I made the following design changes and have some feedback on my current UI. Please update the code to match.

Element 1 (`selector`): border-radius from 4px to 12px. Comment: feels too flat.
Element 2 (`selector`): No style changes. Comment: too wide on desktop.
```

**`src/sidebar/components/PromptPanel.tsx`:**
- Live textarea (read-only) showing generated prompt
- "Copy Prompt" button → `navigator.clipboard.writeText()` → shows "✓ Copied!" for 2s

---

## Phase 6 — Session Persistence & Polish

- Zustand store holds state for the session (in-memory, cleared on deactivate)
- "Clear All" in Toolbar: resets all element styles, removes badges, clears store
- `Alt+Shift+D` keyboard shortcut via `chrome.commands` in service worker
- Popup button queries `chrome.storage.session` for per-tab active state

---

## Verification Checklist

1. `npm install && npm run build` succeeds with no TS errors
2. Load `dist/` as unpacked extension in `chrome://extensions`
3. Visit any webpage → click extension icon → sidebar appears on right, host page styles unaffected
4. Hover elements → glowing purple outline follows cursor
5. Click element → numbered badge appears anchored to element, card added to sidebar
6. Type a comment in the card → text persists in the list
7. Click a card to select it → Style Editor appears below; change border-radius → live update on page
8. Switch to "Prompt" tab → structured prompt reflects selector, style diff, and comment
9. "Copy Prompt" → paste into Claude.ai → prompt is coherent and actionable
10. "Clear All" → badges removed, styles reset, list empty
11. `Alt+Shift+D` toggles sidebar open/closed
