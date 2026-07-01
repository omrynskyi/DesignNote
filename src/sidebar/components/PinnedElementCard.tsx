import { PinnedElement, useStore } from '../store';
import { reset } from '../../content/StyleInjector';
import { unmarkPinned } from '../../content/ElementSelector';

interface Props {
  element: PinnedElement;
  isSelected: boolean;
  onSelect: () => void;
}

export default function PinnedElementCard({ element, isSelected, onSelect }: Props) {
  const { removeElement } = useStore();

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    reset(element.el, element.modifiedStyles);
    unmarkPinned(element.el);
    const badge = document.querySelector(`[data-designnote-badge="${element.id}"]`);
    badge?.remove();
    removeElement(element.id);
  }

  const changeCount = Object.entries(element.modifiedStyles)
    .filter(([prop, v]) => v !== '' && v !== (element.originalStyles[prop] ?? ''))
    .length;

  return (
    <div
      className={`dn-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="dn-card-header">
        <span className="dn-badge">{element.index}</span>
        <span className="dn-selector">{element.selector}</span>
        <button className="dn-remove" onClick={handleRemove} title="Remove">✕</button>
      </div>
      {element.comment && (
        <div className="dn-comment-text">{element.comment}</div>
      )}
      {!element.comment && changeCount === 0 && (
        <div className="dn-comment-empty">No comment</div>
      )}
      {!element.comment && changeCount > 0 && (
        <div className="dn-changes-summary">
          <span className="dn-changes-pill">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="4.5" cy="4.5" r="3.5" fill="rgba(143,85,249,0.5)" />
              <circle cx="4.5" cy="4.5" r="1.5" fill="#c49aff" />
            </svg>
            {changeCount} change{changeCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
