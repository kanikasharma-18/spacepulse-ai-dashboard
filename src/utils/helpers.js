/**
 * formatDate — returns a human-readable date string.
 * @param {Date|string|number} date
 * @param {Intl.DateTimeFormatOptions} opts
 */
export function formatDate(date, opts = {}) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...opts,
  }).format(new Date(date));
}

/**
 * formatRelativeTime — e.g. "3h ago", "2d ago"
 * @param {Date|string|number} date
 */
export function formatRelativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const secs  = Math.floor(diff / 1000);
  const mins  = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);

  if (days  > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins  > 0) return `${mins}m ago`;
  return 'Just now';
}

/**
 * haversineDistance — great-circle distance in km between two lat/lng points.
 * @param {{ lat: number, lng: number }} a
 * @param {{ lat: number, lng: number }} b
 */
export function haversineDistance(a, b) {
  const R  = 6371; // Earth radius km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * clamp — clamps a number between min and max.
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * truncate — truncates text to maxLen chars with ellipsis.
 */
export const truncate = (str, maxLen = 120) =>
  str.length > maxLen ? str.slice(0, maxLen).trimEnd() + '…' : str;

/**
 * classNames — conditionally joins class strings (tiny clsx alternative).
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
