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
    reset(element.el, element.originalStyles);
    unmarkPinned(element.el);
    const badge = document.querySelector(`[data-designnote-badge="${element.id}"]`);
    badge?.remove();
    removeElement(element.id);
  }

  const hasChanges = Object.keys(element.modifiedStyles).length > 0;

  return (
    <div
      className={`dn-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="dn-card-header">
        <span className="dn-badge">{element.index}</span>
        <span className="dn-selector">{element.selector}</span>
        {hasChanges && <span className="dn-changed-dot" title="Has style changes" />}
        <button className="dn-remove" onClick={handleRemove} title="Remove">✕</button>
      </div>
      {element.comment && (
        <div className="dn-comment-text">{element.comment}</div>
      )}
      {!element.comment && (
        <div className="dn-comment-empty">No comment</div>
      )}
    </div>
  );
}
