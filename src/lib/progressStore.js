const KEY = 'root2pro.progress.v1';

export function getProgress() {
  if (typeof localStorage === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function setNodeStatus(nodeId, status) {
  if (typeof localStorage === 'undefined') return;
  const progress = getProgress();
  progress[nodeId] = { status, updatedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(progress));
}
