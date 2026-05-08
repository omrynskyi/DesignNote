import { useRef } from 'react';
import { PinnedElement, StyleProp, useStore } from '../store';
import { apply } from '../../content/StyleInjector';
import { showHighlight, hideHighlight } from '../../content/StyleHighlighter';

interface Props { element: PinnedElement }

// ─── helpers ───────────────────────────────────────────────────────────────

function parseNum(v: string): { n: number; u: string } {
  const m = v.match(/^(-?\d*\.?\d+)(.*)$/);
  return m ? { n: parseFloat(m[1]), u: m[2].trim() || 'px' } : { n: 0, u: 'px' };
}

function toHex(color: string): string {
  if (!color || color === 'transparent') return '#000000';
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) return color;
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
  return '#000000';
}

// ─── ScrubInput ────────────────────────────────────────────────────────────

interface ScrubProps {
  value: string;
  onChange: (v: string) => void;
  min?: number;
  placeholder?: string;
  onHighlightStart?: () => void;
  onHighlightEnd?: () => void;
}

function ScrubInput({ value, onChange, min, placeholder, onHighlightStart, onHighlightEnd }: ScrubProps) {
  const drag = useRef<{ y: number; n: number; u: string; moved: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function onMouseDown(e: React.MouseEvent) {
    if (inputRef.current === document.activeElement && (e.target as HTMLElement).tagName === 'INPUT') return;
    e.preventDefault();
    const { n, u } = parseNum(value);
    drag.current = { y: e.clientY, n, u, moved: false };
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ns-resize';
    onHighlightStart?.();

    function onMove(me: MouseEvent) {
      if (!drag.current) return;
      const delta = drag.current.y - me.clientY;
      if (Math.abs(delta) >= 1) {
        drag.current.moved = true;
        let next = Math.round(drag.current.n + delta);
        if (min !== undefined) next = Math.max(min, next);
        onChange(`${next}${drag.current.u}`);
      }
    }
    function onUp() {
      const wasDrag = drag.current?.moved ?? false;
      drag.current = null;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      onHighlightEnd?.();
      if (!wasDrag) { inputRef.current?.focus(); inputRef.current?.select(); }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  return (
    <div className="dn-scrub" onMouseDown={onMouseDown}>
      <input
        ref={inputRef}
        className="dn-scrub-input"
        value={value}
        placeholder={placeholder ?? '—'}
        onChange={e => onChange(e.target.value)}
        onFocus={e => { e.target.select(); onHighlightStart?.(); }}
        onBlur={onHighlightEnd}
      />
    </div>
  );
}

// ─── Field wrapper — triggers highlight on hover/focus ─────────────────────

interface FieldProps {
  children: React.ReactNode;
  prop: StyleProp;
  el: HTMLElement;
  wide?: boolean;
}

function Field({ children, prop, el, wide }: FieldProps) {
  return (
    <div
      className={`dn-field${wide ? ' dn-field-wide' : ''}`}
      onMouseEnter={() => showHighlight(el, prop)}
      onMouseLeave={() => hideHighlight()}
    >
      {children}
    </div>
  );
}

// ─── ColorField ────────────────────────────────────────────────────────────

function ColorField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="dn-color-field">
      <label className="dn-color-swatch-wrap">
        <input type="color" value={toHex(value)} onChange={e => onChange(e.target.value)} className="dn-color-picker" />
        <span className="dn-color-swatch" style={{ background: value || 'transparent' }} />
      </label>
      <input
        className="dn-scrub-input dn-color-text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={e => e.target.select()}
      />
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="dn-section">
      <div className="dn-section-label">{title}</div>
      {children}
    </div>
  );
}

// ─── SpacingBox ────────────────────────────────────────────────────────────

function SpacingBox({ label: lbl, sides, vals, onChange, el }: {
  label: string;
  sides: ['top'|'right'|'bottom'|'left', StyleProp][];
  vals: string[];
  onChange: (prop: StyleProp, v: string) => void;
  el: HTMLElement;
}) {
  const [, topProp] = sides[0]; const [, rightProp] = sides[1];
  const [, botProp] = sides[2]; const [, leftProp] = sides[3];
  return (
    <div className="dn-spacing-box">
      <div className="dn-spacing-label">{lbl}</div>
      <div className="dn-spacing-grid">
        <div className="dn-sp-top">
          <Field prop={topProp} el={el}>
            <ScrubInput value={vals[0]} onChange={v => onChange(topProp, v)} min={0}
              onHighlightStart={() => showHighlight(el, topProp)} onHighlightEnd={hideHighlight} />
          </Field>
        </div>
        <div className="dn-sp-middle">
          <Field prop={leftProp} el={el}>
            <ScrubInput value={vals[3]} onChange={v => onChange(leftProp, v)} min={0}
              onHighlightStart={() => showHighlight(el, leftProp)} onHighlightEnd={hideHighlight} />
          </Field>
          <div className="dn-sp-center" />
          <Field prop={rightProp} el={el}>
            <ScrubInput value={vals[1]} onChange={v => onChange(rightProp, v)} min={0}
              onHighlightStart={() => showHighlight(el, rightProp)} onHighlightEnd={hideHighlight} />
          </Field>
        </div>
        <div className="dn-sp-bot">
          <Field prop={botProp} el={el}>
            <ScrubInput value={vals[2]} onChange={v => onChange(botProp, v)} min={0}
              onHighlightStart={() => showHighlight(el, botProp)} onHighlightEnd={hideHighlight} />
          </Field>
        </div>
      </div>
    </div>
  );
}

// ─── IconBtns ──────────────────────────────────────────────────────────────

function IconBtns({ value, options, onChange }: {
  value: string;
  options: { label: string; value: string; title?: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="dn-icon-btns">
      {options.map(o => (
        <button
          key={o.value}
          className={`dn-icon-btn ${value === o.value ? 'active' : ''}`}
          onClick={() => onChange(o.value)}
          title={o.title ?? o.value}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

const SHADOW_PRESETS = [
  { label: 'None', value: 'none' },
  { label: 'SM',   value: '0 1px 3px rgba(0,0,0,0.3)' },
  { label: 'MD',   value: '0 4px 14px rgba(0,0,0,0.35)' },
  { label: 'LG',   value: '0 12px 32px rgba(0,0,0,0.45)' },
];

const FLEX_DIR = [
  { label: '→', value: 'row', title: 'row' },
  { label: '↓', value: 'column', title: 'column' },
  { label: '←', value: 'row-reverse', title: 'row-reverse' },
  { label: '↑', value: 'column-reverse', title: 'column-reverse' },
];

const JUSTIFY = [
  { label: '⇤', value: 'flex-start', title: 'flex-start' },
  { label: '⊹', value: 'center', title: 'center' },
  { label: '⇥', value: 'flex-end', title: 'flex-end' },
  { label: '⇼', value: 'space-between', title: 'space-between' },
  { label: '⇹', value: 'space-around', title: 'space-around' },
];

const ALIGN = [
  { label: '⇤', value: 'flex-start', title: 'flex-start' },
  { label: '⊹', value: 'center', title: 'center' },
  { label: '⇥', value: 'flex-end', title: 'flex-end' },
  { label: '≡', value: 'stretch', title: 'stretch' },
];

export default function StyleEditor({ element }: Props) {
  const { updateStyle } = useStore();
  const el = element.el;

  function val(prop: StyleProp): string {
    return element.modifiedStyles[prop] ?? element.originalStyles[prop] ?? '';
  }

  function set(prop: StyleProp, value: string) {
    apply(el, prop, value);
    updateStyle(element.id, prop, value);
  }

  function scrub(prop: StyleProp, min?: number) {
    return (
      <ScrubInput
        value={val(prop)}
        onChange={v => set(prop, v)}
        min={min}
        onHighlightStart={() => showHighlight(el, prop)}
        onHighlightEnd={hideHighlight}
      />
    );
  }

  return (
    <div className="dn-style-editor">

      {/* ── SPACING ── */}
      <Section title="Spacing">
        <SpacingBox
          label="Padding"
          sides={[['top','padding-top'],['right','padding-right'],['bottom','padding-bottom'],['left','padding-left']]}
          vals={[val('padding-top'), val('padding-right'), val('padding-bottom'), val('padding-left')]}
          onChange={set} el={el}
        />
        <SpacingBox
          label="Margin"
          sides={[['top','margin-top'],['right','margin-right'],['bottom','margin-bottom'],['left','margin-left']]}
          vals={[val('margin-top'), val('margin-right'), val('margin-bottom'), val('margin-left')]}
          onChange={set} el={el}
        />
        <div className="dn-row" style={{ marginTop: 6 }}>
          <Field prop="gap" el={el} wide>
            <span className="dn-field-icon">Gap</span>
            {scrub('gap', 0)}
          </Field>
        </div>
      </Section>

      {/* ── DIMENSIONS ── */}
      <Section title="Dimensions">
        <div className="dn-row">
          <Field prop="width" el={el}>
            <span className="dn-field-icon">W</span>{scrub('width', 0)}
          </Field>
          <Field prop="height" el={el}>
            <span className="dn-field-icon">H</span>{scrub('height', 0)}
          </Field>
        </div>
        <div className="dn-row" style={{ marginTop: 4 }}>
          <Field prop="min-width" el={el}>
            <span className="dn-field-icon" style={{ fontSize: 9 }}>Min W</span>{scrub('min-width', 0)}
          </Field>
          <Field prop="max-width" el={el}>
            <span className="dn-field-icon" style={{ fontSize: 9 }}>Max W</span>{scrub('max-width', 0)}
          </Field>
        </div>
        <div className="dn-row" style={{ marginTop: 4 }}>
          <Field prop="min-height" el={el}>
            <span className="dn-field-icon" style={{ fontSize: 9 }}>Min H</span>{scrub('min-height', 0)}
          </Field>
          <Field prop="max-height" el={el}>
            <span className="dn-field-icon" style={{ fontSize: 9 }}>Max H</span>{scrub('max-height', 0)}
          </Field>
        </div>
      </Section>

      {/* ── TYPOGRAPHY ── */}
      <Section title="Typography">
        <div className="dn-row">
          <Field prop="font-size" el={el}>
            <span className="dn-field-icon">A</span>{scrub('font-size', 1)}
          </Field>
          <Field prop="font-weight" el={el}>
            <span className="dn-field-icon">W</span>
            <select className="dn-select-sm" value={val('font-weight')} onChange={e => set('font-weight', e.target.value)}>
              {['100','200','300','400','500','600','700','800','900'].map(w => <option key={w}>{w}</option>)}
            </select>
          </Field>
        </div>
        <div className="dn-row" style={{ marginTop: 4 }}>
          <Field prop="line-height" el={el}>
            <span className="dn-field-icon">↕</span>{scrub('line-height', 0)}
          </Field>
          <Field prop="letter-spacing" el={el}>
            <span className="dn-field-icon">AV</span>{scrub('letter-spacing')}
          </Field>
        </div>
        <div className="dn-row" style={{ marginTop: 6 }}>
          <Field prop="color" el={el} wide>
            <ColorField value={val('color')} onChange={v => set('color', v)} />
          </Field>
        </div>
      </Section>

      {/* ── FILL ── */}
      <Section title="Fill">
        <Field prop="background-color" el={el} wide>
          <ColorField value={val('background-color')} onChange={v => set('background-color', v)} />
        </Field>
      </Section>

      {/* ── BORDER ── */}
      <Section title="Border">
        <div className="dn-row">
          <Field prop="border-radius" el={el}>
            <span className="dn-field-icon">⌒</span>{scrub('border-radius', 0)}
          </Field>
          <Field prop="border-width" el={el}>
            <span className="dn-field-icon">W</span>{scrub('border-width', 0)}
          </Field>
        </div>
        <div className="dn-row" style={{ marginTop: 6 }}>
          <Field prop="border-color" el={el} wide>
            <ColorField value={val('border-color')} onChange={v => set('border-color', v)} />
          </Field>
          <Field prop="border-style" el={el}>
            <select className="dn-select-sm" value={val('border-style')} onChange={e => set('border-style', e.target.value)}>
              {['none','solid','dashed','dotted'].map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      {/* ── FLEXBOX ── */}
      <Section title="Flexbox">
        <div className="dn-row">
          <span className="dn-field-icon" style={{ flexShrink: 0 }}>Dir</span>
          <Field prop="flex-direction" el={el} wide>
            <IconBtns value={val('flex-direction')} options={FLEX_DIR} onChange={v => set('flex-direction', v)} />
          </Field>
        </div>
        <div className="dn-row" style={{ marginTop: 4 }}>
          <span className="dn-field-icon" style={{ flexShrink: 0 }}>J</span>
          <Field prop="justify-content" el={el} wide>
            <IconBtns value={val('justify-content')} options={JUSTIFY} onChange={v => set('justify-content', v)} />
          </Field>
        </div>
        <div className="dn-row" style={{ marginTop: 4 }}>
          <span className="dn-field-icon" style={{ flexShrink: 0 }}>A</span>
          <Field prop="align-items" el={el} wide>
            <IconBtns value={val('align-items')} options={ALIGN} onChange={v => set('align-items', v)} />
          </Field>
        </div>
        <div className="dn-row" style={{ marginTop: 4 }}>
          <span className="dn-field-icon" style={{ flexShrink: 0 }}>Wrap</span>
          <Field prop="flex-wrap" el={el} wide>
            <IconBtns
              value={val('flex-wrap')}
              options={[{ label: 'No wrap', value: 'nowrap' }, { label: 'Wrap', value: 'wrap' }]}
              onChange={v => set('flex-wrap', v)}
            />
          </Field>
        </div>
      </Section>

      {/* ── LAYOUT ── */}
      <Section title="Layout">
        <div className="dn-row">
          <Field prop="display" el={el}>
            <span className="dn-field-icon">Disp</span>
            <select className="dn-select-sm" value={val('display')} onChange={e => set('display', e.target.value)}>
              {['block','flex','grid','inline','inline-flex','inline-block','none'].map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field prop="overflow" el={el}>
            <span className="dn-field-icon">Ovfl</span>
            <select className="dn-select-sm" value={val('overflow')} onChange={e => set('overflow', e.target.value)}>
              {['visible','hidden','scroll','auto'].map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
        </div>
        <div className="dn-row" style={{ marginTop: 4 }}>
          <Field prop="opacity" el={el}>
            <span className="dn-field-icon">Opa</span>{scrub('opacity')}
          </Field>
          <Field prop="z-index" el={el}>
            <span className="dn-field-icon">Z</span>{scrub('z-index')}
          </Field>
        </div>
        <div className="dn-row" style={{ marginTop: 4 }}>
          <Field prop="position" el={el} wide>
            <span className="dn-field-icon">Pos</span>
            <IconBtns
              value={val('position')}
              options={[
                { label: 'Static', value: 'static' },
                { label: 'Rel', value: 'relative' },
                { label: 'Abs', value: 'absolute' },
                { label: 'Fixed', value: 'fixed' },
              ]}
              onChange={v => set('position', v)}
            />
          </Field>
        </div>
      </Section>

      {/* ── SHADOW ── */}
      <Section title="Shadow">
        <div className="dn-shadow-row">
          {SHADOW_PRESETS.map(p => (
            <button
              key={p.label}
              className={`dn-shadow-btn ${val('box-shadow') === p.value ? 'active' : ''}`}
              onClick={() => set('box-shadow', p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </Section>

    </div>
  );
}
