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
  selecting: boolean;
  onToggleSelecting: () => void;
}

export default function Toolbar({
  onClose, onCollapse, embedMode, onToggleEmbed,
  responsive, onToggleResponsive,
  selecting, onToggleSelecting,
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
        </div>
        <div className="dn-toolbar-right">
          <button
            className={`dn-view-btn ${embedMode ? 'active' : ''}`}
            onClick={onToggleEmbed}
            title="Embed — push page content"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="11" y="1" width="2" height="12" rx="0.8" fill="currentColor" opacity="0.5"/>
            </svg>
          </button>
          <button
            className={`dn-view-btn ${responsive ? 'active' : ''}`}
            onClick={onToggleResponsive}
            title="Responsive viewport"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="0.7" y="3" width="12.6" height="8" rx="1.3" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M5.5 11v1.5M8.5 11v1.5M4 12.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="dn-toolbar-sep" />
          <button className="dn-btn-icon" onClick={onCollapse} title="Minimize">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 6L6 2M10 6L6 10M10 6H2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="dn-btn-icon" onClick={onClose} title="Close">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="dn-toolbar-controls">
        <button
          className={`dn-select-btn ${selecting ? 'selecting' : 'paused'}`}
          onClick={onToggleSelecting}
          title={selecting ? 'Pause element selection' : 'Start element selection'}
        >
          {selecting ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="2.5" y="2" width="2.5" height="8" rx="0.8" fill="currentColor"/>
                <rect x="7" y="2" width="2.5" height="8" rx="0.8" fill="currentColor"/>
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
              </svg>
              Select
            </>
          )}
        </button>

        {pinnedElements.length > 0 && (
          <div className="dn-session-pill">
            <span className="dn-session-count">{pinnedElements.length}</span>
            <button className="dn-session-clear" onClick={handleClearAll} title="Clear all">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
