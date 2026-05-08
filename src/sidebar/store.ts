import { create } from 'zustand';

export interface PinnedElement {
  id: string;
  index: number;
  selector: string;
  el: HTMLElement;
  comment: string;
  originalStyles: Record<string, string>;
  modifiedStyles: Record<string, string>;
}

interface Store {
  pinnedElements: PinnedElement[];
  selectedId: string | null;
  addElement: (el: Omit<PinnedElement, 'index'>) => void;
  removeElement: (id: string) => void;
  updateComment: (id: string, comment: string) => void;
  updateStyle: (id: string, prop: string, value: string) => void;
  setSelected: (id: string | null) => void;
  clearAll: () => void;
}

export const useStore = create<Store>((set, get) => ({
  pinnedElements: [],
  selectedId: null,

  addElement: (el) => {
    const elements = get().pinnedElements;
    const index = elements.length + 1;
    set({ pinnedElements: [...elements, { ...el, index }], selectedId: el.id });
  },

  removeElement: (id) => {
    const filtered = get().pinnedElements.filter((e) => e.id !== id);
    const reindexed = filtered.map((e, i) => ({ ...e, index: i + 1 }));
    set({
      pinnedElements: reindexed,
      selectedId: get().selectedId === id ? null : get().selectedId,
    });
  },

  updateComment: (id, comment) => {
    set({
      pinnedElements: get().pinnedElements.map((e) =>
        e.id === id ? { ...e, comment } : e
      ),
    });
  },

  updateStyle: (id, prop, value) => {
    set({
      pinnedElements: get().pinnedElements.map((e) =>
        e.id === id
          ? { ...e, modifiedStyles: { ...e.modifiedStyles, [prop]: value } }
          : e
      ),
    });
  },

  setSelected: (id) => set({ selectedId: id }),

  clearAll: () => set({ pinnedElements: [], selectedId: null }),
}));

const STYLE_PROPS = [
  // spacing
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'gap',
  // dimensions
  'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
  // typography
  'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color',
  // fill
  'background-color',
  // border
  'border-radius', 'border-width', 'border-color', 'border-style',
  // flexbox
  'display', 'flex-direction', 'justify-content', 'align-items', 'align-self', 'flex-wrap',
  // layout
  'overflow', 'opacity', 'position', 'z-index', 'top', 'right', 'bottom', 'left',
  // effects
  'box-shadow',
] as const;

export type StyleProp = (typeof STYLE_PROPS)[number];
export { STYLE_PROPS };

export function buildPrompt(elements: PinnedElement[]): string {
  if (elements.length === 0) return '';
  const lines = elements.map((el) => {
    const diffs = buildStyleDiff(el.originalStyles, el.modifiedStyles);
    const styleText = diffs.length ? diffs.join(', ') : 'No style changes';
    const commentText = el.comment ? ` Comment: ${el.comment}` : '';
    return `Element ${el.index} (\`${el.selector}\`): ${styleText}.${commentText}`;
  });
  return (
    'I made the following design changes and have some feedback on my current UI. Please update the code to match.\n\n' +
    lines.join('\n\n')
  );
}

function buildStyleDiff(
  original: Record<string, string>,
  modified: Record<string, string>
): string[] {
  return Object.entries(modified)
    .filter(([prop, val]) => original[prop] !== val && val !== '')
    .map(([prop, val]) => {
      const from = original[prop] || 'unset';
      return `${prop} from ${from} to ${val}`;
    });
}
