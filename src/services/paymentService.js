import { apiRequest, ApiError } from './apiClient';
import { DELIVERY_OPTIONS, PAYMENT_METHODS } from '@/utils/constants';

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
let scriptPromise = null;

/** Loads Razorpay's checkout.js once. */
export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = CHECKOUT_SRC;
      el.async = true;
      el.onload = () => resolve(true);
      el.onerror = () => { scriptPromise = null; reject(new ApiError('Could not load Razorpay. Check your internet connection.', 503, 'RAZORPAY_SCRIPT')); };
      document.body.appendChild(el);
    });
  }
  return scriptPromise;
}

/** Asks the backend to create a Razorpay order for this cart (amount is computed server-side). */
function createRazorpayOrder({ items, deliveryId, paymentMethod, coupon }) {
  return apiRequest('/payments/razorpay/order', {
    method: 'POST',
    body: {
      items,
      delivery: DELIVERY_OPTIONS.find((d) => d.id === deliveryId) || { id: deliveryId },
      payment: PAYMENT_METHODS.find((p) => p.id === paymentMethod) || { id: paymentMethod },
      coupon,
    },
  });
}

const METHOD_MAP = { card: 'card', upi: 'upi', netbanking: 'netbanking' };

export const paymentService = {
  /**
   * Opens Razorpay Checkout and resolves with { razorpay_order_id, razorpay_payment_id, razorpay_signature }.
   * Rejects with ApiError if the shopper closes the popup or the payment fails.
   */
  async payWithRazorpay({ items, deliveryId, paymentMethod, coupon, user, address }) {
    await loadRazorpay();
    const rzpOrder = await createRazorpayOrder({ items, deliveryId, paymentMethod, coupon });

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: rzpOrder.keyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        order_id: rzpOrder.orderId,
        name: 'ShopNest',
        description: 'Order payment',
        prefill: {
          name: user?.name || address?.fullName || '',
          email: user?.email || '',
          contact: user?.phone || address?.phone || '',
        },
        theme: { color: '#3D48D6' },
        // Opens with the shopper's chosen method first; others remain available inside the popup.
        config: METHOD_MAP[paymentMethod]
          ? { display: { preferences: { show_default_blocks: true } } }
          : undefined,
        handler: (response) => resolve(response),
        modal: {
          ondismiss: () => reject(new ApiError('Payment was cancelled.', 400, 'PAYMENT_CANCELLED')),
        },
      });
      rzp.on('payment.failed', (resp) => {
        reject(new ApiError(resp?.error?.description || 'Payment failed. Please try again.', 402, 'PAYMENT_FAILED'));
      });
      rzp.open();
    });
  },
};

export default paymentService;
