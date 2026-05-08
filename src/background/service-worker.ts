async function toggle(): Promise<void> {
  // lastFocusedWindow works correctly from service worker context
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id) return;
  const key = `active-${tab.id}`;
  const result = await chrome.storage.session.get(key);
  const current = (result[key] as boolean | undefined) ?? false;
  const next = !current;
  await chrome.storage.session.set({ [key]: next });
  // Fire-and-forget — don't await so a missing listener doesn't block or throw
  chrome.tabs.sendMessage(tab.id, { type: 'toggle', active: next }).catch(() => {});
}

chrome.action.onClicked.addListener(() => toggle());
