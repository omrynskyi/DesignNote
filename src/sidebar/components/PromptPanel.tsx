import { useState } from 'react';
import { useStore, buildPrompt } from '../store';

export default function PromptPanel() {
  const { pinnedElements } = useStore();
  const [copied, setCopied] = useState(false);
  const prompt = buildPrompt(pinnedElements);

  async function handleCopy() {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (pinnedElements.length === 0) {
    return (
      <div className="dn-empty">
        <div className="dn-empty-icon">✦</div>
        <div className="dn-empty-text">Annotate elements first, then your prompt will appear here</div>
      </div>
    );
  }

  return (
    <div className="dn-prompt-panel">
      <div className="dn-section-title">Generated Prompt</div>
      <textarea className="dn-prompt-text" readOnly value={prompt} />
      <button
        className={`dn-copy-btn ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
      >
        {copied ? '✓ Copied!' : 'Copy Prompt'}
      </button>
    </div>
  );
}
