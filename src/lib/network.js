/**
 * Returns true when the visitor is on a slow / metered / data-saver
 * connection (Network Information API). Used to skip the heavy WebGL
 * scenes — three.js + textures are ~several MB — in weak-wifi zones.
 *
 * Conservative: if the API is unavailable we assume a normal connection
 * (return false) so capable devices still get the full experience.
 */
export function isSlowConnection() {
  if (typeof navigator === 'undefined') return false
  const c =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection
  if (!c) return false
  if (c.saveData) return true
  const t = c.effectiveType
  return t === 'slow-2g' || t === '2g' || t === '3g'
}
