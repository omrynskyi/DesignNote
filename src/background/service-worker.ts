async function toggle(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id) return;
  chrome.tabs.sendMessage(tab.id, { type: 'toggle' }).catch(() => {});
}

chrome.action.onClicked.addListener(() => toggle());
