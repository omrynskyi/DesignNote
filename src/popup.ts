const btn = document.getElementById('toggle') as HTMLButtonElement;

async function getActiveTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function updateButton(): Promise<void> {
  const tab = await getActiveTab();
  if (!tab?.id) return;
  const result = await chrome.storage.session.get(`active-${tab.id}`);
  const isActive = (result[`active-${tab.id}`] as boolean | undefined) ?? false;
  btn.textContent = isActive ? 'Deactivate' : 'Activate';
  btn.className = isActive ? 'active' : '';
}

btn.addEventListener('click', async () => {
  const tab = await getActiveTab();
  if (!tab?.id) return;
  const key = `active-${tab.id}`;
  const result = await chrome.storage.session.get(key);
  const current = (result[key] as boolean | undefined) ?? false;
  await chrome.storage.session.set({ [key]: !current });
  await chrome.tabs.sendMessage(tab.id, { type: 'toggle', active: !current });
  updateButton();
});

updateButton();
