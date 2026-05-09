const SIDEBAR_W = 320;
const TOOLBAR_H = 36;
const MIN_W = 200;

let frameEl: HTMLDivElement | null = null;
let enabled = false;
let simWidth = 0;
let simHeight = 0;
let onDimChangeCb: ((w: number, h: number) => void) | null = null;
let savedBody: Record<string, string> = {};
let raf = 0;

function avail(): number { return window.innerWidth - SIDEBAR_W; }

function layout(sw = simWidth) {
  const a = avail();
  const ratio = Math.min(1, a / sw);
  const scaledW = sw * ratio;
  const scaledH = simHeight * ratio;
  const offsetX = Math.max(0, (a - scaledW) / 2);
  return { ratio, scaledW, scaledH, offsetX };
}

function applyTransform() {
  const { ratio, offsetX } = layout();
  const b = document.body.style;
  b.width = `${simWidth}px`;
  b.minHeight = `${simHeight}px`;
  b.transformOrigin = 'top left';
  b.transform = `translateX(${offsetX}px) translateY(${TOOLBAR_H}px) scale(${ratio})`;
  b.overflowX = 'hidden';
}

function q<T extends HTMLElement>(sel: string): T {
  return frameEl!.querySelector<T>(sel)!;
}

function refreshFrame() {
  if (!frameEl) return;
  const { scaledW, scaledH, offsetX } = layout();

  q('.rf-shade-l').style.width = `${offsetX}px`;

  const sr = q('.rf-shade-r');
  sr.style.left = `${offsetX + scaledW}px`;
  sr.style.width = `${Math.max(0, avail() - offsetX - scaledW)}px`;

  q('.rf-border-l').style.left = `${offsetX}px`;

  const rh = q('.rf-handle-r');
  rh.style.left = `${offsetX + scaledW - 5}px`;
  rh.style.top = `${TOOLBAR_H}px`;

  // Toolbar always spans full available width
  const tb = q('.rf-toolbar');
  tb.style.left = '0';
  tb.style.width = '100%';

  q('.rf-dim').textContent = `${simWidth} × ${simHeight}`;

  // Update active preset
  frameEl!.querySelectorAll<HTMLElement>('.rf-preset').forEach(btn => {
    const w = parseInt(btn.dataset.w ?? '0', 10);
    btn.style.background = w === simWidth ? 'rgba(143,85,249,0.25)' : '';
    btn.style.color = w === simWidth ? '#c49aff' : '#888';
    btn.style.borderColor = w === simWidth ? 'rgba(143,85,249,0.5)' : 'rgba(255,255,255,0.1)';
  });
}

const PRESETS = [
  { label: 'Mobile', w: 390, h: 844 },
  { label: 'Tablet', w: 768, h: 1024 },
  { label: 'Laptop', w: 1280, h: 800 },
  { label: 'Full', w: () => window.innerWidth, h: () => window.innerHeight },
];

export function enableResponsive(
  container: HTMLElement,
  initialWidth: number,
  onDim: (w: number, h: number) => void,
) {
  if (enabled) return;
  enabled = true;
  simWidth = initialWidth;
  simHeight = Math.round(window.innerHeight * (initialWidth / window.innerWidth));
  onDimChangeCb = onDim;

  document.documentElement.appendChild(container);

  const props = ['width', 'minHeight', 'transform', 'transformOrigin', 'overflowX'];
  for (const p of props) savedBody[p] = (document.body.style as any)[p];
  applyTransform();

  // ── Frame overlay ────────────────────────────────────────────────────────
  frameEl = document.createElement('div');
  frameEl.setAttribute('data-designnote-responsive', 'true');
  frameEl.style.cssText = `
    position:fixed;top:0;left:0;right:${SIDEBAR_W}px;bottom:0;
    pointer-events:none;z-index:2147483643;overflow:hidden;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  const mkShade = (cls: string, extra = '') => {
    const d = document.createElement('div');
    d.className = cls;
    d.style.cssText = `position:absolute;background:rgba(0,0,0,0.55);${extra}`;
    return d;
  };

  const shadeL = mkShade('rf-shade-l', `top:${TOOLBAR_H}px;bottom:0;left:0;`);
  const shadeR = mkShade('rf-shade-r', `top:${TOOLBAR_H}px;bottom:0;`);

  const borderL = document.createElement('div');
  borderL.className = 'rf-border-l';
  borderL.style.cssText = `
    position:absolute;bottom:0;width:1px;
    background:rgba(143,85,249,0.5);
  `;
  borderL.style.top = `${TOOLBAR_H}px`;

  // Right handle
  const handleR = document.createElement('div');
  handleR.className = 'rf-handle-r';
  handleR.style.cssText = `
    position:absolute;bottom:0;width:10px;
    pointer-events:all;cursor:ew-resize;
    display:flex;align-items:center;justify-content:center;
  `;
  const pipR = document.createElement('div');
  pipR.style.cssText = `
    width:4px;height:40px;border-radius:4px;
    background:rgba(143,85,249,0.85);
  `;
  handleR.appendChild(pipR);

  // ── Top toolbar (like DevTools) ──────────────────────────────────────────
  const toolbar = document.createElement('div');
  toolbar.className = 'rf-toolbar';
  toolbar.style.cssText = `
    position:absolute;top:0;height:${TOOLBAR_H}px;
    background:rgba(18,16,26,0.97);
    border-bottom:1px solid rgba(143,85,249,0.25);
    display:flex;align-items:center;gap:6px;padding:0 10px;
    pointer-events:all;
    box-sizing:border-box;
    overflow:hidden;
  `;

  const dim = document.createElement('span');
  dim.className = 'rf-dim';
  dim.style.cssText = `
    font-size:12px;font-weight:600;color:#c49aff;
    min-width:90px;flex-shrink:0;letter-spacing:-0.2px;
  `;

  const sep = document.createElement('div');
  sep.style.cssText = 'width:1px;height:16px;background:rgba(255,255,255,0.1);flex-shrink:0;';

  // Preset buttons
  const presetRow = document.createElement('div');
  presetRow.style.cssText = 'display:flex;gap:4px;align-items:center;';

  for (const p of PRESETS) {
    const btn = document.createElement('button');
    btn.className = 'rf-preset';
    btn.dataset.w = String(typeof p.w === 'function' ? p.w() : p.w);
    btn.textContent = p.label;
    btn.style.cssText = `
      background:transparent;border:1px solid rgba(255,255,255,0.1);
      border-radius:5px;color:#888;font-size:11px;font-weight:500;
      padding:3px 8px;cursor:pointer;
      font-family:inherit;transition:none;white-space:nowrap;
    `;
    btn.addEventListener('click', () => {
      const w = typeof p.w === 'function' ? p.w() : p.w;
      const h = typeof p.h === 'function' ? p.h() : p.h;
      simWidth = w;
      simHeight = h;
      applyTransform();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { refreshFrame(); onDimChangeCb?.(simWidth, simHeight); });
    });
    presetRow.appendChild(btn);
  }

  toolbar.append(dim, sep, presetRow);
  frameEl.append(shadeL, shadeR, borderL, handleR, toolbar);
  document.documentElement.appendChild(frameEl);
  refreshFrame();

  // ── Drag handler (width only) ────────────────────────────────────────────
  let dragW = false, startX = 0, startW = 0;

  handleR.addEventListener('mousedown', e => {
    e.preventDefault();
    dragW = true; startX = e.clientX; startW = simWidth;
    document.documentElement.style.cursor = 'ew-resize';
    document.documentElement.style.userSelect = 'none';
  });

  const onMove = (e: MouseEvent) => {
    if (!dragW) return;
    const { ratio } = layout(startW);
    const next = Math.max(MIN_W, Math.min(avail(), Math.round(startW + (e.clientX - startX) / ratio)));
    if (next !== simWidth) {
      simWidth = next;
      applyTransform();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { refreshFrame(); onDimChangeCb?.(simWidth, simHeight); });
    }
  };

  const onUp = () => {
    if (!dragW) return;
    dragW = false;
    document.documentElement.style.cursor = '';
    document.documentElement.style.userSelect = '';
  };

  document.addEventListener('mousemove', onMove, true);
  document.addEventListener('mouseup', onUp, true);

  const onWinResize = () => { applyTransform(); refreshFrame(); };
  window.addEventListener('resize', onWinResize);

  Object.assign(frameEl, { _onMove: onMove, _onUp: onUp, _onWinResize: onWinResize });
}

export function disableResponsive(container: HTMLElement) {
  if (!enabled) return;
  enabled = false;

  for (const [p, v] of Object.entries(savedBody)) {
    (document.body.style as any)[p] = v;
  }
  savedBody = {};
  document.body.appendChild(container);

  if (frameEl) {
    const f = frameEl as any;
    document.removeEventListener('mousemove', f._onMove, true);
    document.removeEventListener('mouseup', f._onUp, true);
    window.removeEventListener('resize', f._onWinResize);
    frameEl.remove();
    frameEl = null;
  }
  onDimChangeCb = null;
}

export function setSimWidth(w: number) {
  if (!enabled) return;
  simWidth = Math.max(MIN_W, w);
  simHeight = Math.round(window.innerHeight * (simWidth / window.innerWidth));
  applyTransform();
  refreshFrame();
  onDimChangeCb?.(simWidth, simHeight);
}

export function getSimWidth() { return simWidth; }
export function isResponsiveEnabled() { return enabled; }
