export const SIDEBAR_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dn-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 320px;
    height: 100vh;
    background: #0f0f0f;
    color: #f0f0f0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    z-index: 2147483647;
    box-shadow: -4px 0 24px rgba(0,0,0,0.5);
    border-left: 1px solid #222;
  }

  /* Toolbar */
  .dn-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    border-bottom: 1px solid #1e1e1e;
    flex-shrink: 0;
  }
  .dn-toolbar-left { display: flex; align-items: center; gap: 8px; }
  .dn-toolbar-right { display: flex; align-items: center; gap: 6px; }
  .dn-logo { font-weight: 600; font-size: 13px; color: #5865F2; letter-spacing: -0.2px; }
  .dn-count {
    background: #5865F2;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    border-radius: 10px;
    padding: 1px 7px;
    min-width: 20px;
    text-align: center;
  }

  /* Tabs */
  .dn-tabs {
    display: flex;
    border-bottom: 1px solid #1e1e1e;
    flex-shrink: 0;
  }
  .dn-tab {
    flex: 1;
    padding: 10px;
    background: none;
    border: none;
    color: #666;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: color 0.15s, border-color 0.15s;
  }
  .dn-tab.active { color: #f0f0f0; border-bottom-color: #5865F2; }
  .dn-tab:hover:not(.active) { color: #aaa; }

  /* Content */
  .dn-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .dn-content::-webkit-scrollbar { width: 4px; }
  .dn-content::-webkit-scrollbar-track { background: transparent; }
  .dn-content::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

  /* Empty state */
  .dn-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 200px;
    padding: 24px;
    color: #555;
    text-align: center;
  }
  .dn-empty-icon { font-size: 24px; }
  .dn-empty-text { font-size: 12px; line-height: 1.5; }

  /* List */
  .dn-list { padding: 10px; display: flex; flex-direction: column; gap: 8px; }

  /* Card */
  .dn-card {
    background: #161616;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .dn-card:hover { border-color: #333; }
  .dn-card.selected { border-color: #5865F2; }
  .dn-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .dn-badge {
    background: #5865F2;
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
  }
  .dn-selector {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 11px;
    color: #888;
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
  }
  .dn-remove {
    background: none;
    border: none;
    color: #444;
    cursor: pointer;
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 4px;
    line-height: 1;
    flex-shrink: 0;
  }
  .dn-remove:hover { color: #f87171; background: #1e1e1e; }
  .dn-comment {
    width: 100%;
    background: #0f0f0f;
    border: 1px solid #222;
    border-radius: 6px;
    color: #d0d0d0;
    font-size: 12px;
    font-family: inherit;
    padding: 8px;
    resize: none;
    line-height: 1.4;
    transition: border-color 0.15s;
  }
  .dn-comment:focus { outline: none; border-color: #5865F2; }
  .dn-comment::placeholder { color: #444; }
  .dn-comment-text {
    font-size: 12px;
    color: #bbb;
    line-height: 1.5;
    margin-top: 4px;
    padding: 2px 0;
  }
  .dn-comment-empty {
    font-size: 12px;
    color: #3a3a3a;
    margin-top: 4px;
    font-style: italic;
  }

  /* ── Style editor shell ── */
  .dn-style-editor {
    border-top: 1px solid #1a1a1a;
    padding-bottom: 8px;
  }

  /* Section */
  .dn-section {
    border-bottom: 1px solid #1a1a1a;
    padding: 8px 10px 10px;
  }
  .dn-section-label {
    font-size: 10px;
    font-weight: 600;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
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
    color: #555;
    flex-shrink: 0;
    width: 16px;
    text-align: center;
    user-select: none;
  }

  /* Scrub input */
  .dn-scrub {
    flex: 1;
    min-width: 0;
    background: #1c1c1c;
    border: 1px solid #2a2a2a;
    border-radius: 5px;
    cursor: ns-resize;
    transition: border-color 0.12s;
    user-select: none;
  }
  .dn-scrub:hover { border-color: #3a3a3a; }
  .dn-scrub:focus-within { border-color: #5865F2; }
  .dn-scrub-input {
    display: block;
    width: 100%;
    background: transparent;
    border: none;
    color: #d0d0d0;
    font-size: 11px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    padding: 5px 6px;
    outline: none;
    cursor: inherit;
  }
  .dn-scrub-input:focus { cursor: text; }

  /* Compact select */
  .dn-select-sm {
    flex: 1;
    background: #1c1c1c;
    border: 1px solid #2a2a2a;
    border-radius: 5px;
    color: #d0d0d0;
    font-size: 11px;
    padding: 5px 4px;
    cursor: pointer;
    min-width: 0;
  }
  .dn-select-sm:focus { outline: none; border-color: #5865F2; }

  /* Color field */
  .dn-color-field {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    min-width: 0;
    background: #1c1c1c;
    border: 1px solid #2a2a2a;
    border-radius: 5px;
    padding: 3px 5px;
    transition: border-color 0.12s;
  }
  .dn-color-field:hover { border-color: #3a3a3a; }
  .dn-color-field:focus-within { border-color: #5865F2; }
  .dn-color-swatch-wrap {
    position: relative;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    cursor: pointer;
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
    border-radius: 3px;
    border: 1px solid rgba(255,255,255,0.1);
    pointer-events: none;
  }
  .dn-color-text {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    color: #d0d0d0;
    font-size: 11px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    padding: 2px 0;
    outline: none;
  }

  /* Spacing box */
  .dn-spacing-box { }
  .dn-spacing-label {
    font-size: 10px;
    color: #444;
    margin-bottom: 5px;
  }
  .dn-spacing-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: #141414;
    border: 1px solid #222;
    border-radius: 6px;
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
    border: 1px dashed #2a2a2a;
    border-radius: 4px;
    background: #0f0f0f;
  }

  /* Icon button groups (flexbox controls, position, etc) */
  .dn-icon-btns { display: flex; gap: 2px; flex: 1; min-width: 0; }
  .dn-icon-btn {
    flex: 1;
    background: #1c1c1c;
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    color: #666;
    font-size: 11px;
    padding: 5px 2px;
    cursor: pointer;
    transition: border-color 0.12s, color 0.12s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dn-icon-btn.active { border-color: #5865F2; color: #5865F2; background: #181c3a; }
  .dn-icon-btn:hover:not(.active) { border-color: #444; color: #ccc; }

  /* Shadow row */
  .dn-shadow-row { display: flex; gap: 4px; }
  .dn-shadow-btn {
    flex: 1;
    background: #1c1c1c;
    border: 1px solid #2a2a2a;
    border-radius: 5px;
    color: #666;
    font-size: 11px;
    padding: 6px 4px;
    cursor: pointer;
    transition: border-color 0.12s, color 0.12s;
  }
  .dn-shadow-btn.active { border-color: #5865F2; color: #5865F2; background: #181c3a; }
  .dn-shadow-btn:hover:not(.active) { border-color: #444; color: #ccc; }

  /* Prompt panel */
  .dn-prompt-panel { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
  .dn-prompt-text {
    width: 100%;
    min-height: 280px;
    background: #161616;
    border: 1px solid #272727;
    border-radius: 8px;
    color: #d0d0d0;
    font-size: 12px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    padding: 12px;
    resize: vertical;
    line-height: 1.6;
  }
  .dn-copy-btn {
    width: 100%;
    padding: 11px;
    background: #5865F2;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .dn-copy-btn:hover { background: #5a52e0; }
  .dn-copy-btn.copied { background: #16a34a; }

  /* Buttons */
  .dn-btn-ghost {
    background: none;
    border: 1px solid #272727;
    border-radius: 6px;
    color: #666;
    font-size: 11px;
    padding: 4px 10px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }
  .dn-btn-ghost:hover { color: #f87171; border-color: #f87171; }
  .dn-btn-icon {
    background: none;
    border: none;
    color: #555;
    font-size: 13px;
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 4px;
    line-height: 1;
  }
  .dn-btn-icon:hover { color: #f0f0f0; background: #1e1e1e; }
`;
