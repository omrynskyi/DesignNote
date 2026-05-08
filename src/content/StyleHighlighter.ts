// Colors matching DevTools convention
const C_PADDING  = 'rgba(147, 196, 125, 0.5)';
const C_MARGIN   = 'rgba(246, 178, 107, 0.5)';
const C_BORDER   = 'rgba(255, 229, 153, 0.55)';
const C_CONTENT  = 'rgba(111, 168, 220, 0.45)';
const C_GENERAL  = 'rgba(88, 101, 242, 0.18)';
const C_FLEX     = 'rgba(99, 179, 255, 0.18)';

let overlay: HTMLDivElement | null = null;

function getOverlay(): HTMLDivElement {
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.setAttribute('data-designnote-overlay', 'true');
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 0; height: 0; pointer-events: none; z-index: 2147483644;';
    document.body.appendChild(overlay);
  }
  return overlay;
}

function px(v: string): number { return parseFloat(v) || 0; }

function chip(top: number, left: number, w: number, h: number, bg: string, border = ''): HTMLDivElement {
  const d = document.createElement('div');
  d.style.cssText = `position:fixed;top:${top}px;left:${left}px;width:${Math.max(0,w)}px;height:${Math.max(0,h)}px;background:${bg};pointer-events:none;${border ? `box-sizing:border-box;outline:${border};` : ''}`;
  return d;
}

function label(text: string, top: number, left: number): HTMLDivElement {
  const d = document.createElement('div');
  d.style.cssText = `position:fixed;top:${top}px;left:${left}px;background:rgba(0,0,0,0.75);color:#fff;font:11px/1 -apple-system,sans-serif;padding:2px 5px;border-radius:3px;pointer-events:none;white-space:nowrap;z-index:2147483644;`;
  d.textContent = text;
  return d;
}

export function showHighlight(el: HTMLElement, prop: string): void {
  hideHighlight();
  const o = getOverlay();
  const r = el.getBoundingClientRect();
  const cs = window.getComputedStyle(el);

  const pt = px(cs.paddingTop),    pr = px(cs.paddingRight);
  const pb = px(cs.paddingBottom), pl = px(cs.paddingLeft);
  const mt = px(cs.marginTop),     mb = px(cs.marginBottom);
  const ml = px(cs.marginLeft),    mr = px(cs.marginRight);
  const bw = px(cs.borderTopWidth);

  const append = (...els: HTMLElement[]) => els.forEach(d => o.appendChild(d));

  if (prop === 'padding-top') {
    append(chip(r.top, r.left, r.width, pt, C_PADDING));
    if (pt > 12) append(label(`${Math.round(pt)}px`, r.top + pt/2 - 8, r.left + r.width/2 - 12));
  } else if (prop === 'padding-right') {
    append(chip(r.top, r.right - pr, pr, r.height, C_PADDING));
  } else if (prop === 'padding-bottom') {
    append(chip(r.bottom - pb, r.left, r.width, pb, C_PADDING));
  } else if (prop === 'padding-left') {
    append(chip(r.top, r.left, pl, r.height, C_PADDING));
  } else if (prop === 'margin-top') {
    append(chip(r.top - mt, r.left, r.width, mt, C_MARGIN));
    if (mt > 12) append(label(`${Math.round(mt)}px`, r.top - mt/2 - 8, r.left + r.width/2 - 12));
  } else if (prop === 'margin-bottom') {
    append(chip(r.bottom, r.left, r.width, mb, C_MARGIN));
  } else if (prop === 'margin-left') {
    append(chip(r.top, r.left - ml, ml, r.height, C_MARGIN));
  } else if (prop === 'margin-right') {
    append(chip(r.top, r.right, mr, r.height, C_MARGIN));
  } else if (prop === 'gap') {
    // highlight whole flex container
    append(chip(r.top, r.left, r.width, r.height, C_FLEX, '2px dashed rgba(99,179,255,0.7)'));
  } else if (prop.startsWith('border')) {
    const inset = bw / 2;
    append(chip(r.top - inset, r.left - inset, r.width + bw, bw, C_BORDER));
    append(chip(r.bottom - inset, r.left - inset, r.width + bw, bw, C_BORDER));
    append(chip(r.top, r.left - inset, bw, r.height, C_BORDER));
    append(chip(r.top, r.right - inset, bw, r.height, C_BORDER));
  } else if (prop === 'width' || prop === 'height' || prop === 'min-width' || prop === 'max-width' || prop === 'min-height' || prop === 'max-height') {
    const cx = r.left + pl + bw, cy = r.top + pt + bw;
    const cw = r.width - pl - pr - 2*bw, ch = r.height - pt - pb - 2*bw;
    append(chip(cy, cx, cw, ch, C_CONTENT, '2px solid rgba(111,168,220,0.8)'));
    append(label(`${Math.round(cw)}×${Math.round(ch)}`, cy + ch/2 - 8, cx + cw/2 - 20));
  } else if (
    prop === 'display' || prop === 'flex-direction' || prop === 'justify-content' ||
    prop === 'align-items' || prop === 'align-self' || prop === 'flex-wrap'
  ) {
    append(chip(r.top, r.left, r.width, r.height, C_FLEX, '2px dashed rgba(99,179,255,0.7)'));
  } else if (prop === 'color' || prop === 'font-size' || prop === 'font-weight' || prop === 'line-height' || prop === 'letter-spacing') {
    append(chip(r.top, r.left, r.width, r.height, C_GENERAL, '2px solid rgba(88,101,242,0.5)'));
  } else {
    append(chip(r.top, r.left, r.width, r.height, C_GENERAL));
  }
}

export function hideHighlight(): void {
  if (overlay) overlay.innerHTML = '';
}
