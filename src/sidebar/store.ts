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

export interface HistoryEntry {
  text: string;
  timestamp: number;
}

export const DEFAULT_PROMPT_TEMPLATE =
  'I made the following design changes and have some feedback on my current UI. Please update the code to match.';

interface Store {
  pinnedElements: PinnedElement[];
  selectedId: string | null;
  promptHistory: HistoryEntry[];
  promptTemplate: string;
  promptContext: string;

  addElement: (el: Omit<PinnedElement, 'index'>) => void;
  removeElement: (id: string) => void;
  updateComment: (id: string, comment: string) => void;
  updateStyle: (id: string, prop: string, value: string) => void;
  setSelected: (id: string | null) => void;
  clearAll: () => void;

  initPromptStorage: () => void;
  addToHistory: (entry: HistoryEntry) => void;
  setPromptTemplate: (template: string) => void;
  setPromptContext: (context: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  pinnedElements: [],
  selectedId: null,
  promptHistory: [],
  promptTemplate: DEFAULT_PROMPT_TEMPLATE,
  promptContext: '',

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

  initPromptStorage: () => {
    chrome.storage.local.get(['promptHistory', 'promptTemplate', 'promptContext'], (data) => {
      set({
        promptHistory: data.promptHistory ?? [],
        promptTemplate: data.promptTemplate ?? DEFAULT_PROMPT_TEMPLATE,
        promptContext: data.promptContext ?? '',
      });
    });
  },

  addToHistory: (entry) => {
    const updated = [entry, ...get().promptHistory].slice(0, 20);
    set({ promptHistory: updated });
    chrome.storage.local.set({ promptHistory: updated });
  },

  setPromptTemplate: (template) => {
    set({ promptTemplate: template });
    chrome.storage.local.set({ promptTemplate: template });
  },

  setPromptContext: (context) => {
    set({ promptContext: context });
    chrome.storage.local.set({ promptContext: context });
  },
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
  return buildPromptWithTemplate(elements, DEFAULT_PROMPT_TEMPLATE, '');
}

export function buildPromptWithTemplate(
  elements: PinnedElement[],
  template: string,
  context: string
): string {
  if (elements.length === 0) return '';
  const lines = elements.map((el) => {
    const diffs = buildStyleDiff(el.originalStyles, el.modifiedStyles);
    const styleText = diffs.length ? diffs.join(', ') : 'No style changes';
    const commentText = el.comment ? ` Comment: ${el.comment}` : '';
    return `Element ${el.index} (\`${el.selector}\`): ${styleText}.${commentText}`;
  });
  const contextLine = context.trim() ? `\n\nContext: ${context.trim()}` : '';
  return template + '\n\n' + lines.join('\n\n') + contextLine;
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
