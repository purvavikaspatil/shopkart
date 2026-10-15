/**
 * Server-side mirror of the frontend's utils/helpers.js calculateTotals().
 * The amount charged through Razorpay is computed HERE, never trusted from the client,
 * and it must match what the shopper saw at checkout.
 */
const TAX_RATE = 0.05;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEES = { standard: 49, express: 99, sameday: 199 };
const COD_FEE = 29;

function calculateTotals({ items, deliveryId = 'standard', coupon = null, paymentMethod = '' }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalSubtotal = items.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0,
  );
  const discount = Math.max(0, originalSubtotal - subtotal);

  let couponDiscount = 0;
  if (coupon) {
    couponDiscount = coupon.type === 'percent'
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
    if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
    couponDiscount = Math.min(couponDiscount, subtotal);
  }

  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const baseShipping = SHIPPING_FEES[deliveryId] ?? SHIPPING_FEES.standard;
  const deliveryFee = items.length === 0
    ? 0
    : deliveryId === 'standard' && taxableAmount >= FREE_SHIPPING_THRESHOLD
      ? 0
      : baseShipping;
  const tax = Math.round(taxableAmount * TAX_RATE);
  const codFee = paymentMethod === 'cod' ? COD_FEE : 0;
  const total = Math.max(0, taxableAmount + deliveryFee + tax + codFee);

  return { subtotal, discount, couponDiscount, deliveryFee, tax, codFee, total };
}

module.exports = calculateTotals;
