import { useState, useEffect } from 'react';
import { useStore, buildPromptWithTemplate, DEFAULT_PROMPT_TEMPLATE, HistoryEntry } from '../store';

type Panel = 'none' | 'history' | 'template' | 'context';

function formatTime(ts: number): string {
  const diffMins = Math.floor((Date.now() - ts) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return new Date(ts).toLocaleDateString();
}

export default function PromptPanel() {
  const {
    pinnedElements,
    promptHistory, promptTemplate, promptContext,
    addToHistory, setPromptTemplate, setPromptContext,
  } = useStore();

  const [copied, setCopied] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<Panel>('none');

  useEffect(() => {
    setEditedPrompt(null);
  }, [pinnedElements]);

  const autoPrompt = buildPromptWithTemplate(pinnedElements, promptTemplate, promptContext);
  const prompt = editedPrompt ?? autoPrompt;
  const isEdited = editedPrompt !== null;

  async function handleCopy() {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToHistory({ text: prompt, timestamp: Date.now() });
  }

  function handleTemplateChange(val: string) {
    setPromptTemplate(val);
    setEditedPrompt(null);
  }

  function handleContextChange(val: string) {
    setPromptContext(val);
    setEditedPrompt(null);
  }

  function togglePanel(panel: Panel) {
    setActivePanel(p => p === panel ? 'none' : panel);
  }

  return (
    <div className="dn-prompt-panel">
      <div className="dn-prompt-header">
        <span className="dn-section-title">Generated prompt</span>
        <div className="dn-prompt-actions">
          <button
            className={`dn-prompt-action-btn ${activePanel === 'history' ? 'active' : ''}`}
            onClick={() => togglePanel('history')}
            title="Prompt history"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6.5" cy="6.5" r="5.2" stroke="currentColor" strokeWidth="1.25"/>
              <path d="M6.5 3.8V6.5L8.3 7.8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className={`dn-prompt-action-btn ${activePanel === 'template' ? 'active' : ''}`}
            onClick={() => togglePanel('template')}
            title="Edit prompt template"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 3.5h9M2 6.5h6.5M2 9.5h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M9.5 8l1.5 1-1.5 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className={`dn-prompt-action-btn ${activePanel === 'context' ? 'active' : ''}`}
            onClick={() => togglePanel('context')}
            title="Tech stack context"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1.5" y="1.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
              <path d="M4.5 11.5h4M6.5 8.5v3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
          </button>
          {isEdited && (
            <button
              className="dn-prompt-action-btn dn-prompt-regen"
              onClick={() => setEditedPrompt(null)}
              title="Regenerate"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M10.5 6A4 4 0 1 1 7 2.2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                <path d="M7 1l.5 1.5L6 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {activePanel === 'history' && (
        <div className="dn-prompt-subpanel">
          <div className="dn-prompt-subpanel-label">Copied prompts</div>
          {promptHistory.length === 0 ? (
            <div className="dn-prompt-subpanel-empty">No history yet — copy a prompt to save it</div>
          ) : (
            <div className="dn-history-list">
              {promptHistory.map((entry: HistoryEntry, i: number) => (
                <button
                  key={i}
                  className="dn-history-item"
                  onClick={() => { setEditedPrompt(entry.text); setActivePanel('none'); }}
                >
                  <span className="dn-history-time">{formatTime(entry.timestamp)}</span>
                  <span className="dn-history-preview">{entry.text.slice(0, 72)}{entry.text.length > 72 ? '…' : ''}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {activePanel === 'template' && (
        <div className="dn-prompt-subpanel">
          <div className="dn-prompt-subpanel-label">Prompt prefix</div>
          <textarea
            className="dn-subpanel-textarea"
            value={promptTemplate}
            onChange={e => handleTemplateChange(e.target.value)}
            rows={3}
            placeholder="Enter the opening instruction for every prompt…"
          />
          {promptTemplate !== DEFAULT_PROMPT_TEMPLATE && (
            <button className="dn-prompt-subpanel-reset" onClick={() => handleTemplateChange(DEFAULT_PROMPT_TEMPLATE)}>
              Reset to default
            </button>
          )}
        </div>
      )}

      {activePanel === 'context' && (
        <div className="dn-prompt-subpanel">
          <div className="dn-prompt-subpanel-label">Tech stack & context</div>
          <textarea
            className="dn-subpanel-textarea"
            value={promptContext}
            onChange={e => handleContextChange(e.target.value)}
            rows={2}
            placeholder="e.g. React + Tailwind, Button is in src/components/Button.tsx"
          />
        </div>
      )}

      {pinnedElements.length === 0 && !isEdited ? (
        <div className="dn-empty dn-empty--inline">
          <div className="dn-empty-icon">✦</div>
          <div className="dn-empty-text">Annotate elements first, then your prompt will appear here</div>
        </div>
      ) : (
        <>
          <textarea
            className={`dn-prompt-text${isEdited ? ' edited' : ''}`}
            value={prompt}
            onChange={e => setEditedPrompt(e.target.value)}
          />
          <button
            className={`dn-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? '✓ Copied!' : 'Copy Prompt'}
          </button>
        </>
      )}
    </div>
  );
}
