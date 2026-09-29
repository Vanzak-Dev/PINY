let currentSettings = null;
const listeners = new Set();

export function setProductAnnouncement(settings) {
  currentSettings = settings;
  listeners.forEach((fn) => fn(settings));
}

export function subscribeProductAnnouncement(fn) {
  listeners.add(fn);
  fn(currentSettings);
  return () => listeners.delete(fn);
}
