import { useState } from 'react';
import Toolbar from './components/Toolbar';
import PinnedElementList from './components/PinnedElementList';
import PromptPanel from './components/PromptPanel';

type Tab = 'annotations' | 'prompt';

interface Props {
  onClose: () => void;
}

export default function App({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>('annotations');

  return (
    <div className="dn-sidebar">
      <Toolbar onClose={onClose} />
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
      <div className="dn-content">
        {tab === 'annotations' ? <PinnedElementList /> : <PromptPanel />}
      </div>
    </div>
  );
}
