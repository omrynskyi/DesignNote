import { useStore } from '../store';
import PinnedElementCard from './PinnedElementCard';
import StyleEditor from './StyleEditor';

export default function PinnedElementList() {
  const { pinnedElements, selectedId, setSelected } = useStore();
  const selected = pinnedElements.find((e) => e.id === selectedId) ?? null;

  if (pinnedElements.length === 0) {
    return (
      <div className="dn-empty">
        <div className="dn-empty-icon">◎</div>
        <div className="dn-empty-text">Click any element on the page to annotate it</div>
      </div>
    );
  }

  return (
    <div className="dn-list">
      {pinnedElements.map((el) => (
        <PinnedElementCard
          key={el.id}
          element={el}
          isSelected={el.id === selectedId}
          onSelect={() => setSelected(el.id === selectedId ? null : el.id)}
        />
      ))}
      {selected && (
        <StyleEditor element={selected} />
      )}
    </div>
  );
}
