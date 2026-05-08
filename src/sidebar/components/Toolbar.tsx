import { useStore } from '../store';
import { reset } from '../../content/StyleInjector';
import { unmarkPinned } from '../../content/ElementSelector';

interface Props {
  onClose: () => void;
}

export default function Toolbar({ onClose }: Props) {
  const { pinnedElements, clearAll } = useStore();

  function handleClearAll() {
    for (const el of pinnedElements) {
      reset(el.el, el.originalStyles);
      unmarkPinned(el.el);
      const badge = document.querySelector(`[data-designnote-badge="${el.id}"]`);
      badge?.remove();
    }
    clearAll();
  }

  return (
    <div className="dn-toolbar">
      <div className="dn-toolbar-left">
        <span className="dn-logo">◈ DesignNote</span>
        {pinnedElements.length > 0 && (
          <span className="dn-count">{pinnedElements.length}</span>
        )}
      </div>
      <div className="dn-toolbar-right">
        {pinnedElements.length > 0 && (
          <button className="dn-btn-ghost" onClick={handleClearAll}>
            Clear all
          </button>
        )}
        <button className="dn-btn-icon" onClick={onClose} title="Close">
          ✕
        </button>
      </div>
    </div>
  );
}
