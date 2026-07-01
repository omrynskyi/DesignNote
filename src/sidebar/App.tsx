import { useState, useEffect, useCallback } from 'react';
import logoUrl from '../assets/logo-inline';
import Toolbar from './components/Toolbar';
import PinnedElementList from './components/PinnedElementList';
import PromptPanel from './components/PromptPanel';

type Tab = 'annotations' | 'prompt';

interface Props {
  onClose: () => void;
  onRefresh: () => void;
  onEmbedChange: (embed: boolean) => void;
  onResponsiveToggle: (enable: boolean, initialWidth: number, onWidth: (w: number) => void) => void;
  onResponsiveWidth: (w: number) => void;
  onSelectingPause: (paused: boolean) => void;
}

export default function App({ onClose, onRefresh, onEmbedChange, onResponsiveToggle, onResponsiveWidth, onSelectingPause }: Props) {
  const [tab, setTab] = useState<Tab>('annotations');
  const [embedMode, setEmbedMode] = useState(false);
  const [responsive, setResponsive] = useState(false);
  const [respWidth, setRespWidth] = useState(390);
  const [collapsed, setCollapsed] = useState(false);
  const [selecting, setSelecting] = useState(true);

  const toggleSelecting = useCallback(() => {
    setSelecting(prev => { onSelectingPause(prev); return !prev; });
  }, [onSelectingPause]);

  const toggleEmbed = useCallback(() => {
    setEmbedMode(prev => { onEmbedChange(!prev); return !prev; });
  }, [onEmbedChange]);

  const toggleResponsive = useCallback(() => {
    setResponsive(prev => {
      const next = !prev;
      const initW = next ? window.innerWidth : respWidth;
      if (next) setRespWidth(initW);
      onResponsiveToggle(next, initW, (w) => setRespWidth(w));
      return next;
    });
  }, [onResponsiveToggle, respWidth]);

  const handleWidthInput = useCallback((w: number) => {
    setRespWidth(w);
    onResponsiveWidth(w);
  }, [onResponsiveWidth]);

  useEffect(() => {
    return () => { onEmbedChange(false); };
  }, [onEmbedChange]);

  return (
    <>
      <div className={`dn-sidebar${collapsed ? ' dn-sidebar--collapsed' : ''}`}>
        <Toolbar
          onClose={onClose}
          onRefresh={onRefresh}
          onCollapse={() => setCollapsed(true)}
          embedMode={embedMode}
          onToggleEmbed={toggleEmbed}
          responsive={responsive}
          onToggleResponsive={toggleResponsive}
          respWidth={respWidth}
          onRespWidthChange={handleWidthInput}
          selecting={selecting}
          onToggleSelecting={toggleSelecting}
        />
        <div className="dn-divider" />
        <div className="dn-tabs">
          <button
            className={`dn-tab ${tab === 'annotations' ? 'active' : ''}`}
            onClick={() => setTab('annotations')}
          >
            Annotations
          </button>
          <button
            className={`dn-tab ${tab === 'prompt' ? 'active' : ''}`}
            onClick={() => setTab('prompt')}
          >
            Prompt
          </button>
        </div>
        <div className="dn-tabs-underline" />
        <div className="dn-content">
          {tab === 'annotations' ? <PinnedElementList /> : <PromptPanel />}
        </div>
      </div>

      {collapsed && (
        <button className="dn-tab-btn" onClick={() => setCollapsed(false)} title="Open DesignNote">
          <img src={logoUrl} style={{ width: 16, height: 16, display: 'block' }} alt="" />
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
            <path d="M2 5L6 1M2 5L6 9" stroke="rgba(143,85,249,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </>
  );
}
