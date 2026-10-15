import { TAX_RATE, FREE_SHIPPING_THRESHOLD, SHIPPING_FEES, COD_FEE } from './constants';

/** Simulates network latency so skeleton/loading states are demonstrable. */
export const delay = (ms = 350) => new Promise((resolve) => { setTimeout(resolve, ms); });

/** Clamps a number into [min, max]. */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/** Deterministic pseudo-random generator so mock data is stable across reloads. */
export function seededRandom(seed) {
  let s = typeof seed === 'string'
    ? seed.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) % 2147483647, 7)
    : seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Picks `count` items from an array without mutating it. */
export const sample = (arr, count) => [...arr].slice(0, count);

/** Fisher-Yates shuffle driven by a seed so results do not jump every render. */
export function shuffle(arr, seed = 42) {
  const rand = seededRandom(seed);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Splits an array into chunks of size n. */
export function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** Groups array items by the value returned from `keyFn`. */
export function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
}

export const unique = (arr) => [...new Set(arr)];

/** Generates a readable mock order/return id, e.g. "SN-8F42K1". */
export function generateId(prefix = 'SN') {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

/** Mock 12-digit tracking number. */
export function generateTrackingNumber() {
  return `SNX${Math.floor(100000000 + Math.random() * 899999999)}IN`;
}

/**
 * Calculates the full price breakdown for a set of cart lines.
 *
 * @param {Array<{price:number, quantity:number, originalPrice?:number}>} items
 * @param {{ coupon?: {type:'percent'|'flat', value:number, maxDiscount?:number}|null,
 *           deliveryId?: string, paymentMethod?: string }} options
 */
export function calculateTotals(items, options = {}) {
  const { coupon = null, deliveryId = 'standard', paymentMethod = null } = options;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const mrpTotal = items.reduce((sum, i) => sum + (i.originalPrice || i.price) * i.quantity, 0);
  const productDiscount = Math.max(0, mrpTotal - subtotal);

  let couponDiscount = 0;
  if (coupon) {
    couponDiscount = coupon.type === 'percent'
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
    if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
    couponDiscount = Math.min(couponDiscount, subtotal);
  }

  const taxable = Math.max(0, subtotal - couponDiscount);
  const baseShipping = SHIPPING_FEES[deliveryId] ?? SHIPPING_FEES.standard;
  // Standard shipping is free once the order crosses the threshold.
  const shipping = items.length === 0
    ? 0
    : deliveryId === 'standard' && taxable >= FREE_SHIPPING_THRESHOLD
      ? 0
      : baseShipping;
  const tax = Math.round(taxable * TAX_RATE);
  const codFee = paymentMethod === 'cod' ? COD_FEE : 0;
  const total = Math.max(0, taxable + shipping + tax + codFee);

  return {
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    mrpTotal,
    subtotal,
    productDiscount,
    couponDiscount,
    shipping,
    tax,
    codFee,
    total,
    savings: productDiscount + couponDiscount,
    amountToFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - taxable),
  };
}

/** Highlights every occurrence of `query` inside `text` for search results. */
export function splitHighlight(text, query) {
  const q = String(query || '').trim();
  if (!q) return [{ text, match: false }];
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = String(text).split(new RegExp(`(${safe})`, 'ig'));
  return parts.filter(Boolean).map((part) => ({ text: part, match: part.toLowerCase() === q.toLowerCase() }));
}

/** Scroll helper used after route changes and pagination. */
export function scrollToTop(behavior = 'smooth') {
  try {
    window.scrollTo({ top: 0, behavior });
  } catch {
    window.scrollTo(0, 0);
  }
}
