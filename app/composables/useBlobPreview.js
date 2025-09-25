export function makeObjectUrl(blob) {
  if (!blob) return "";
  return window.URL.createObjectURL(blob);
}

export function revokeObjectUrl(url) {
  if (!url) return;
  try { window.URL.revokeObjectURL(url); } catch (_) {}
}
