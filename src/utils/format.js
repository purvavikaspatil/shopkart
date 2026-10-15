/** Formatting helpers. All money in the store is INR. */

/**
 * Formats a number as Indian rupees without decimals.
 * @param {number} value
 * @returns {string} e.g. "₹1,24,999"
 */
export function formatPrice(value) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Formats with two decimals - used for tax lines and analytics. */
export function formatPriceDecimal(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

/** Compact notation for dashboard stats: 1.2L, 45.6K. */
export function formatCompact(value) {
  const n = Number(value) || 0;
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(Number(value) || 0);
}

/** "12 Mar 2026" */
export function formatDate(input) {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** "12 Mar 2026, 4:30 PM" */
export function formatDateTime(input) {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

/** "3 days ago", "just now" - used by notifications and reviews. */
export function timeAgo(input) {
  const d = input instanceof Date ? input : new Date(input);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const units = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'week', secs: 604800 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
  ];
  for (const u of units) {
    const value = Math.floor(seconds / u.secs);
    if (value >= 1) return `${value} ${u.label}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

/** Adds N days to a date and returns a new Date. */
export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Turns "Men's Clothing" into "mens-clothing" for URLs. */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Turns "mens-clothing" back into "Mens Clothing" for display fallbacks. */
export function unslugify(slug) {
  return String(slug).split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function truncate(text, max = 80) {
  const s = String(text ?? '');
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

/** Initials for avatars: "Aarav Sharma" -> "AS". */
export function initials(name = '') {
  return String(name).trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || 'U';
}

/** Masks a card number for display: "**** **** **** 4521". */
export function maskCard(last4) {
  return `**** **** **** ${last4}`;
}
