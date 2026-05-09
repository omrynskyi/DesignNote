export const SIDEBAR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dn-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 320px;
    height: 100vh;
    background: rgba(12, 11, 17, 0.80);
    backdrop-filter: blur(28px) saturate(1.6);
    -webkit-backdrop-filter: blur(28px) saturate(1.6);
    color: #f0f0f0;
    font-family: 'Host Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    z-index: 2147483647;
    border-left: 1px solid rgba(143, 85, 249, 0.30);
    box-shadow:
      -1px 0 0 rgba(143, 85, 249, 0.15),
      -8px 0 48px rgba(143, 85, 249, 0.10),
      -24px 0 80px rgba(0,0,0,0.50);
    transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .dn-sidebar--collapsed {
    transform: translateX(320px);
  }

  /* Collapse tab (visible when sidebar is hidden) */
  .dn-tab-btn {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 68px;
    background: rgba(12, 11, 17, 0.72);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(143, 85, 249, 0.35);
    border-right: none;
    border-radius: 10px 0 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    z-index: 2147483647;
    box-shadow: -4px 0 24px rgba(143, 85, 249, 0.18), -8px 0 32px rgba(0,0,0,0.4);
    transition: width 0.15s;
    padding: 0;
  }
  .dn-tab-btn:hover { width: 36px; }
  .dn-tab-btn svg { flex-shrink: 0; }

  /* Toolbar */
  .dn-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 14px 0;
    flex-shrink: 0;
  }
  .dn-toolbar-left { display: flex; align-items: center; gap: 8px; }
  .dn-toolbar-right { display: flex; align-items: center; gap: 4px; }

  .dn-logo {
    display: flex;
    align-items: center;
    gap: 7px;
    font-weight: 700;
    font-size: 14px;
    color: #f0f0f0;
    letter-spacing: -0.3px;
  }
  .dn-logo-icon {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
  .dn-count {
    background: #8F55F9;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    border-radius: 20px;
    padding: 2px 8px;
    min-width: 22px;
    text-align: center;
    letter-spacing: 0;
  }

  /* Toolbar controls row */
  .dn-toolbar-controls {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px 0;
    flex-shrink: 0;
  }
  .dn-control-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 8px;
    color: #999;
    font-size: 11px;
    font-weight: 500;
    font-family: inherit;
    padding: 5px 9px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
    white-space: nowrap;
  }
  .dn-control-btn:hover { border-color: rgba(143,85,249,0.4); color: #ccc; }
  .dn-control-btn.active {
    border-color: #8F55F9;
    color: #c49aff;
    background: rgba(143,85,249,0.12);
  }
  .dn-scale-select {
    flex: 1;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 8px;
    color: #888;
    font-size: 11px;
    font-family: inherit;
    padding: 5px 8px;
    cursor: pointer;
    min-width: 0;
    appearance: none;
    -webkit-appearance: none;
  }
  .dn-scale-select:focus { outline: none; border-color: rgba(143,85,249,0.4); }

  /* Responsive controls */
  .dn-resp-controls {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 14px 0;
    flex-shrink: 0;
  }
  .dn-resp-width-field {
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(143,85,249,0.35);
    border-radius: 8px;
    padding: 0 10px;
    gap: 4px;
  }
  .dn-resp-input {
    flex: 1;
    background: transparent;
    border: none;
    color: #e0e0e0;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    padding: 7px 0;
    outline: none;
    min-width: 0;
    -moz-appearance: textfield;
  }
  .dn-resp-input::-webkit-inner-spin-button,
  .dn-resp-input::-webkit-outer-spin-button { -webkit-appearance: none; }
  .dn-resp-unit {
    font-size: 11px;
    color: #777777;
    flex-shrink: 0;
  }
  .dn-resp-presets {
    display: flex;
    gap: 4px;
  }
  .dn-preset-btn {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 7px;
    color: #666;
    font-size: 11px;
    font-weight: 500;
    font-family: inherit;
    padding: 5px 4px;
    cursor: pointer;
    transition: border-color 0.12s, color 0.12s, background 0.12s;
  }
  .dn-preset-btn.active {
    border-color: rgba(143,85,249,0.55);
    color: #c49aff;
    background: rgba(143,85,249,0.12);
  }
  .dn-preset-btn:hover:not(.active) { border-color: rgba(255,255,255,0.18); color: #ccc; }

  /* Divider */
  .dn-divider {
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 12px 14px 0;
    flex-shrink: 0;
  }

  /* Tabs */
  .dn-tabs {
    display: flex;
    padding: 0 14px;
    gap: 4px;
    flex-shrink: 0;
    margin-top: 8px;
  }
  .dn-tab {
    flex: 1;
    padding: 8px 10px;
    background: none;
    border: none;
    color: #777;
    font-size: 12px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    border-radius: 8px 8px 0 0;
    border-bottom: 2px solid transparent;
    transition: color 0.15s, border-color 0.15s;
    letter-spacing: 0.01em;
  }
  .dn-tab.active { color: #f0f0f0; border-bottom-color: #8F55F9; }
  .dn-tab:hover:not(.active) { color: #999; }

  /* Tab underline */
  .dn-tabs-underline {
    height: 1px;
    background: rgba(255,255,255,0.07);
    flex-shrink: 0;
  }

  /* Content */
  .dn-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .dn-content::-webkit-scrollbar { width: 3px; }
  .dn-content::-webkit-scrollbar-track { background: transparent; }
  .dn-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }

  /* Empty state */
  .dn-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 200px;
    padding: 24px;
    color: #444;
    text-align: center;
  }
  .dn-empty-icon { font-size: 22px; }
  .dn-empty-text { font-size: 12px; line-height: 1.6; color: #777777; }

  /* List */
  .dn-list { padding: 12px; display: flex; flex-direction: column; gap: 8px; }

  /* Card */
  .dn-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 11px 12px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
  }
  .dn-card:hover { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.06); }
  .dn-card.selected {
    border-color: rgba(143,85,249,0.55);
    background: rgba(143,85,249,0.07);
    box-shadow: 0 0 0 1px rgba(143,85,249,0.2) inset;
  }
  .dn-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 7px;
  }
  .dn-badge {
    background: #8F55F9;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(143,85,249,0.45);
  }
  .dn-selector {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 11px;
    color: #666;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dn-changed-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    flex-shrink: 0;
    box-shadow: 0 0 6px rgba(34,197,94,0.5);
  }
  .dn-remove {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 12px;
    padding: 3px 5px;
    border-radius: 5px;
    line-height: 1;
    flex-shrink: 0;
    transition: color 0.15s, background 0.15s;
  }
  .dn-remove:hover { color: #f87171; background: rgba(248,113,113,0.10); }
  .dn-comment {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: #d0d0d0;
    font-size: 12px;
    font-family: inherit;
    padding: 8px 10px;
    resize: none;
    line-height: 1.5;
    transition: border-color 0.15s;
  }
  .dn-comment:focus { outline: none; border-color: rgba(143,85,249,0.5); }
  .dn-comment::placeholder { color: #383838; }
  .dn-comment-text {
    font-size: 12px;
    color: #aaa;
    line-height: 1.6;
    padding: 2px 0;
  }
  .dn-comment-empty {
    font-size: 12px;
    color: #777777;
    font-style: italic;
  }

  /* ── Style editor shell ── */
  .dn-style-editor {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding-bottom: 8px;
  }

  /* Section */
  .dn-section {
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 10px 12px 12px;
  }
  .dn-section-label {
    font-size: 10px;
    font-weight: 700;
    color: #6a6a6a;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 9px;
  }

  /* Row + field */
  .dn-row { display: flex; align-items: center; gap: 4px; }
  .dn-field {
    display: flex;
    align-items: center;
    gap: 3px;
    flex: 1;
    min-width: 0;
  }
  .dn-field-wide { flex: 2; }
  .dn-field-icon {
    font-size: 10px;
    color: #6a6a6a;
    flex-shrink: 0;
    min-width: 14px;
    white-space: nowrap;
    text-align: center;
    user-select: none;
  }

  /* Scrub input */
  .dn-scrub {
    flex: 1;
    min-width: 0;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 8px;
    cursor: ns-resize;
    transition: border-color 0.12s;
    user-select: none;
  }
  .dn-scrub:hover { border-color: rgba(255,255,255,0.16); }
  .dn-scrub:focus-within { border-color: rgba(143,85,249,0.55); }
  .dn-scrub-input {
    display: block;
    width: 100%;
    background: transparent;
    border: none;
    color: #d8d8d8;
    font-size: 11px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    padding: 5px 7px;
    outline: none;
    cursor: inherit;
  }
  .dn-scrub-input:focus { cursor: text; }

  /* Compact select */
  .dn-select-sm {
    flex: 1;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 8px;
    color: #d8d8d8;
    font-size: 11px;
    font-family: inherit;
    padding: 5px 6px;
    cursor: pointer;
    min-width: 0;
    appearance: none;
    -webkit-appearance: none;
  }
  .dn-select-sm:focus { outline: none; border-color: rgba(143,85,249,0.55); }

  /* Color field */
  .dn-color-field {
    display: flex;
    align-items: center;
    gap: 5px;
    flex: 1;
    min-width: 0;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 8px;
    padding: 4px 7px;
    transition: border-color 0.12s;
  }
  .dn-color-field:hover { border-color: rgba(255,255,255,0.16); }
  .dn-color-field:focus-within { border-color: rgba(143,85,249,0.55); }
  .dn-color-swatch-wrap {
    position: relative;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    cursor: pointer;
    border-radius: 4px;
  }
  .dn-color-picker {
    position: absolute;
    inset: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    padding: 0;
    border: none;
  }
  .dn-color-swatch {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.15);
    pointer-events: none;
  }
  .dn-color-text {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    color: #d8d8d8;
    font-size: 11px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    padding: 2px 0;
    outline: none;
  }

  /* Spacing box */
  .dn-spacing-box { }
  .dn-spacing-label {
    font-size: 10px;
    color: #6a6a6a;
    margin-bottom: 5px;
  }
  .dn-spacing-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 8px;
    padding: 6px;
  }
  .dn-sp-top, .dn-sp-bot { width: 70px; }
  .dn-sp-middle {
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
  }
  .dn-sp-middle .dn-scrub { width: 58px; flex: none; }
  .dn-sp-center {
    flex: 1;
    height: 32px;
    border: 1px dashed rgba(255,255,255,0.1);
    border-radius: 4px;
    background: rgba(0,0,0,0.2);
  }

  /* Icon button groups */
  .dn-icon-btns { display: flex; gap: 2px; flex: 1; min-width: 0; }
  .dn-icon-btn {
    flex: 1;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 6px;
    color: #888;
    font-size: 11px;
    font-family: inherit;
    padding: 5px 2px;
    cursor: pointer;
    transition: border-color 0.12s, color 0.12s, background 0.12s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dn-icon-btn.active {
    border-color: rgba(143,85,249,0.6);
    color: #c49aff;
    background: rgba(143,85,249,0.14);
  }
  .dn-icon-btn:hover:not(.active) { border-color: rgba(255,255,255,0.18); color: #ccc; }

  /* Shadow row */
  .dn-shadow-row { display: flex; gap: 4px; }
  .dn-shadow-btn {
    flex: 1;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 7px;
    color: #888;
    font-size: 11px;
    font-family: inherit;
    padding: 6px 4px;
    cursor: pointer;
    transition: border-color 0.12s, color 0.12s, background 0.12s;
  }
  .dn-shadow-btn.active {
    border-color: rgba(143,85,249,0.6);
    color: #c49aff;
    background: rgba(143,85,249,0.14);
  }
  .dn-shadow-btn:hover:not(.active) { border-color: rgba(255,255,255,0.18); color: #ccc; }

  /* Prompt panel */
  .dn-prompt-panel { padding: 14px; display: flex; flex-direction: column; gap: 12px; }
  .dn-section-title {
    font-size: 11px;
    font-weight: 700;
    color: #6a6a6a;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .dn-prompt-text {
    width: 100%;
    min-height: 260px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: #c0c0c0;
    font-size: 12px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    padding: 12px;
    resize: vertical;
    line-height: 1.65;
    outline: none;
    transition: border-color 0.15s;
  }
  .dn-prompt-text:focus { border-color: rgba(143,85,249,0.4); }

  .dn-copy-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #8F55F9 0%, #6B3FD4 100%);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 0.15s, box-shadow 0.15s;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 20px rgba(143,85,249,0.35);
  }
  .dn-copy-btn:hover { opacity: 0.9; box-shadow: 0 6px 28px rgba(143,85,249,0.5); }
  .dn-copy-btn.copied {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    box-shadow: 0 4px 20px rgba(34,197,94,0.35);
  }

  /* Buttons */
  .dn-btn-ghost {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 7px;
    color: #777;
    font-size: 11px;
    font-family: inherit;
    padding: 5px 10px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }
  .dn-btn-ghost:hover { color: #f87171; border-color: rgba(248,113,113,0.4); }
  .dn-btn-icon {
    background: none;
    border: none;
    color: #666;
    font-size: 13px;
    cursor: pointer;
    padding: 5px 6px;
    border-radius: 6px;
    line-height: 1;
    transition: color 0.15s, background 0.15s;
  }
  .dn-btn-icon:hover { color: #f0f0f0; background: rgba(255,255,255,0.08); }
`;
