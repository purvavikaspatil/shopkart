const crypto = require('crypto');
const Razorpay = require('razorpay');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const calculateTotals = require('../utils/calculateTotalsSchema');

let client = null;

function getClient() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new ApiError(
      'Online payments are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env.',
      503,
      'PAYMENTS_NOT_CONFIGURED',
    );
  }
  if (!client) client = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
  return client;
}

/** Recomputes the payable total on the server from the cart payload. */
function computeTotal({ items, delivery, payment, coupon }) {
  if (!items?.length) throw new ApiError('Your cart is empty.', 400, 'EMPTY_CART');
  return calculateTotals({
    items,
    deliveryId: delivery?.id,
    coupon,
    paymentMethod: payment?.id,
  });
}

/** POST /api/payments/razorpay/order  -> creates a Razorpay order for the cart. */
exports.createRazorpayOrder = asyncHandler(async (req, res) => {
  const { items, delivery, payment, coupon } = req.body;
  if (payment?.id === 'cod') throw new ApiError('Cash on delivery needs no online payment.', 400, 'INVALID_METHOD');

  const totals = computeTotal({ items, delivery, payment, coupon });
  const amount = Math.round(totals.total * 100); // paise
  if (amount < 100) throw new ApiError('Order total is too low to pay online.', 400, 'AMOUNT_TOO_LOW');

  const rzp = getClient();
  let order;
  try {
    order = await rzp.orders.create({
      amount,
      currency: 'INR',
      receipt: `sn_${Date.now()}`,
      notes: { userId: String(req.user?.id || '') },
    });
  } catch (err) {
    const message = err?.error?.description || err?.message || 'Could not start the payment.';
    throw new ApiError(message, 502, 'RAZORPAY_ORDER_FAILED');
  }

  res.status(201).json({
    keyId: process.env.RAZORPAY_KEY_ID,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
});

/** Constant-time HMAC check of the signature returned by Razorpay Checkout. */
function signatureIsValid({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return false;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(razorpay_signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Used by the order controller: confirms the payment is genuine and covers the order total.
 * Throws ApiError on any problem, returns the verified payment record otherwise.
 */
exports.assertPaymentVerified = async (paymentDetails, expectedTotal) => {
  getClient();
  if (!signatureIsValid(paymentDetails || {})) {
    throw new ApiError('Payment verification failed.', 400, 'PAYMENT_SIGNATURE_INVALID');
  }
  const rzp = getClient();
  let rzpOrder;
  try {
    rzpOrder = await rzp.orders.fetch(paymentDetails.razorpay_order_id);
  } catch {
    throw new ApiError('Could not confirm the payment with Razorpay.', 502, 'RAZORPAY_FETCH_FAILED');
  }
  if (rzpOrder.status !== 'paid') {
    throw new ApiError('Payment has not been completed.', 402, 'PAYMENT_NOT_PAID');
  }
  if (Number(rzpOrder.amount_paid) !== Math.round(expectedTotal * 100)) {
    throw new ApiError('Paid amount does not match the order total.', 400, 'AMOUNT_MISMATCH');
  }
  return {
    razorpayOrderId: paymentDetails.razorpay_order_id,
    razorpayPaymentId: paymentDetails.razorpay_payment_id,
  };
};

/** POST /api/payments/razorpay/verify -> lightweight signature check (optional, for the client). */
exports.verifyRazorpayPayment = asyncHandler(async (req, res) => {
  getClient();
  res.json({ verified: signatureIsValid(req.body || {}) });
});
