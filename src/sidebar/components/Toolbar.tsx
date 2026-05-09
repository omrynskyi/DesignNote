import logoUrl from '../../assets/logo-inline';
import { useStore } from '../store';
import { reset } from '../../content/StyleInjector';
import { unmarkPinned } from '../../content/ElementSelector';

interface Props {
  onClose: () => void;
  onCollapse: () => void;
  embedMode: boolean;
  onToggleEmbed: () => void;
  responsive: boolean;
  onToggleResponsive: () => void;
  respWidth: number;
  onRespWidthChange: (w: number) => void;
}


export default function Toolbar({
  onClose, onCollapse, embedMode, onToggleEmbed,
  responsive, onToggleResponsive, respWidth, onRespWidthChange,
}: Props) {
  const { pinnedElements, clearAll } = useStore();

  function handleClearAll() {
    for (const el of pinnedElements) {
      reset(el.el, el.originalStyles);
      unmarkPinned(el.el);
      document.querySelector(`[data-designnote-badge="${el.id}"]`)?.remove();
    }
    clearAll();
  }


  return (
    <>
      <div className="dn-toolbar">
        <div className="dn-toolbar-left">
          <img src={logoUrl} className="dn-logo-icon" alt="" />
          <span className="dn-logo">DesignNote</span>
          {pinnedElements.length > 0 && (
            <span className="dn-count">{pinnedElements.length}</span>
          )}
        </div>
        <div className="dn-toolbar-right">
          {pinnedElements.length > 0 && (
            <button className="dn-btn-ghost" onClick={handleClearAll}>Clear</button>
          )}
          <button className="dn-btn-icon" onClick={onCollapse} title="Minimize">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 6L6 2M10 6L6 10M10 6H2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="dn-btn-icon" onClick={onClose} title="Close">✕</button>
        </div>
      </div>

      <div className="dn-toolbar-controls">
        <button
          className={`dn-control-btn ${embedMode ? 'active' : ''}`}
          onClick={onToggleEmbed}
          title="Embed sidebar — push page content left"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="7" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="9" y="1" width="2" height="10" rx="0.5" fill="currentColor" opacity="0.6"/>
          </svg>
          Embed
        </button>
        <button
          className={`dn-control-btn ${responsive ? 'active' : ''}`}
          onClick={onToggleResponsive}
          title="Responsive viewport simulator"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="0.5" y="2.5" width="11" height="7" rx="1" stroke="currentColor" strokeWidth="1.1"/>
            <rect x="4.5" y="8.5" width="3" height="1.5" rx="0.4" fill="currentColor" opacity="0.6"/>
            <rect x="3" y="10" width="6" height="1" rx="0.4" fill="currentColor" opacity="0.4"/>
          </svg>
          Responsive
        </button>
      </div>

    </>
  );
}
