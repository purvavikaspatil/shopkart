import { apiRequest, fail } from './apiClient';
import { STORAGE_KEYS, ORDER_STAGES, ORDER_STATUS, DELIVERY_OPTIONS, PAYMENT_METHODS } from '@/utils/constants';
import { readStorage, writeStorage } from '@/utils/storage';
import { generateId, generateTrackingNumber, calculateTotals } from '@/utils/helpers';
import { products } from '@/data/products';
import { DELIVERY_PARTNERS } from '@/data/mockContent';

const CITIES = ['Bengaluru hub', 'Hosur sorting centre', 'Chennai transit hub', 'Local delivery centre'];

function loadOrders() {
  return readStorage(STORAGE_KEYS.orders, null) ?? seedOrders();
}

function persist(orders) {
  writeStorage(STORAGE_KEYS.orders, orders);
  return orders;
}

function buildTimeline(order) {
  const stageIndex = ORDER_STAGES.indexOf(order.status);
  const placed = new Date(order.createdAt).getTime();
  return ORDER_STAGES.map((stage, i) => ({
    stage,
    at: new Date(placed + i * 20 * 3600000).toISOString(),
    location: i === 0 ? 'Order placed online' : CITIES[Math.min(i - 1, CITIES.length - 1)],
    done: stageIndex >= 0 ? i <= stageIndex : false,
    current: i === stageIndex,
  }));
}

function seedOrders() {
  const pick = (id) => products.find((p) => p.id === id) ?? products[0];
  const line = (product, quantity = 1, extra = {}) => ({
    productId: product.id,
    title: product.title,
    brand: product.brand,
    thumbnail: product.thumbnail,
    price: product.price,
    originalPrice: product.originalPrice,
    quantity,
    ...extra,
  });

  const address = {
    id: 'addr-1', label: 'Home', fullName: 'Aarav Sharma', phone: '9845012345',
    line1: '412, Brigade Palm Court', line2: 'Yelahanka New Town',
    city: 'Bengaluru', state: 'Karnataka', pincode: '560064',
  };

  const make = (id, daysAgo, status, items, payment, delivery = 'standard') => {
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
    const totals = calculateTotals(items, { deliveryId: delivery, paymentMethod: payment });
    const order = {
      id,
      _id: id,
      createdAt,
      status,
      items,
      address,
      delivery: DELIVERY_OPTIONS.find((d) => d.id === delivery),
      payment: PAYMENT_METHODS.find((p) => p.id === payment),
      coupon: null,
      totals,
      trackingNumber: generateTrackingNumber(),
      partner: DELIVERY_PARTNERS[id.length % DELIVERY_PARTNERS.length],
      estimatedDelivery: new Date(new Date(createdAt).getTime() + 5 * 86400000).toISOString(),
      invoiceNumber: `INV-${id.replace('SN-', '')}`,
    };
    order.timeline = buildTimeline(order);
    return order;
  };

  const orders = [
    make('SN-4K2P91', 2, ORDER_STATUS.OUT_FOR_DELIVERY, [line(pick(10), 1), line(pick(11), 2)], 'upi', 'express'),
    make('SN-8M3X22', 12, ORDER_STATUS.DELIVERED, [line(pick(31), 1, { size: 'M', color: 'Olive' })], 'card'),
    make('SN-2H7Q45', 26, ORDER_STATUS.DELIVERED, [line(pick(60), 1), line(pick(62), 1)], 'cod'),
    make('SN-9T1L08', 40, ORDER_STATUS.CANCELLED, [line(pick(21), 1)], 'card'),
  ];
  return persist(orders);
}

export const orderService = {
  async getOrders() {
    return apiRequest('/orders', {
      fallback: () => [...loadOrders()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    }).then((orders) => (orders || []).map((o) => ({
      ...o,
      id: o._id || o.id,
      timeline: o.timeline || buildTimeline(o),
    })));
  },

  async getOrderById(id) {
    return apiRequest(`/orders/${id}`, {
      fallback: () => {
        const order = loadOrders().find((o) => o.id === id || o._id === id);
        if (!order) fail('We could not find that order.', 404, 'ORDER_NOT_FOUND');
        return order;
      },
    }).then((o) => ({
      ...o,
      id: o._id || o.id,
      timeline: o.timeline || buildTimeline(o),
    }));
  },

  async createOrder(payload) {
    const { items, address, deliveryId, paymentMethod, coupon, paymentDetails } = payload;
    // A paid order must never be silently replaced by a local mock order, so no fallback is used.
    const isOnlinePayment = Boolean(paymentDetails);
    return apiRequest('/orders', {
      method: 'POST',
      body: {
        items,
        address,
        delivery: DELIVERY_OPTIONS.find((d) => d.id === deliveryId) || { id: deliveryId, label: 'Standard Delivery', fee: 0 },
        payment: PAYMENT_METHODS.find((p) => p.id === paymentMethod) || { id: paymentMethod, label: paymentMethod },
        coupon,
        paymentDetails,
      },
      fallback: isOnlinePayment ? undefined : () => {
        if (!items?.length) fail('Your cart is empty.', 400, 'EMPTY_CART');
        if (!address) fail('Choose a delivery address before placing the order.', 400, 'NO_ADDRESS');

        const totals = calculateTotals(items, { coupon, deliveryId, paymentMethod });
        const createdAt = new Date().toISOString();
        const delivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryId) ?? DELIVERY_OPTIONS[0];
        const etaDays = deliveryId === 'sameday' ? 0 : deliveryId === 'express' ? 3 : 6;

        const order = {
          id: generateId('SN'),
          createdAt,
          status: ORDER_STATUS.PLACED,
          items,
          address,
          delivery,
          payment: PAYMENT_METHODS.find((p) => p.id === paymentMethod) ?? PAYMENT_METHODS[0],
          coupon: coupon ? { code: coupon.code, value: totals.couponDiscount } : null,
          totals,
          trackingNumber: generateTrackingNumber(),
          partner: DELIVERY_PARTNERS[Math.floor(Math.random() * DELIVERY_PARTNERS.length)],
          estimatedDelivery: new Date(Date.now() + etaDays * 86400000).toISOString(),
          invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}`,
        };
        order.timeline = buildTimeline(order);
        persist([order, ...loadOrders()]);
        return order;
      },
    }).then((o) => ({
      ...o,
      id: o._id || o.id,
      timeline: o.timeline || buildTimeline(o),
    }));
  },

  async cancelOrder(id, reason = 'Changed my mind') {
    return apiRequest(`/orders/${id}/cancel`, {
      method: 'PATCH',
      body: { reason },
      fallback: () => {
        const orders = loadOrders();
        const index = orders.findIndex((o) => o.id === id || o._id === id);
        if (index === -1) fail('We could not find that order.', 404, 'ORDER_NOT_FOUND');
        const order = orders[index];
        orders[index] = { ...order, status: ORDER_STATUS.CANCELLED, cancelledAt: new Date().toISOString(), cancelReason: reason };
        persist(orders);
        return orders[index];
      },
    });
  },

  async advanceOrder(id) {
    return apiRequest(`/orders/${id}/advance`, {
      method: 'PATCH',
      fallback: () => {
        const orders = loadOrders();
        const index = orders.findIndex((o) => o.id === id || o._id === id);
        if (index === -1) return null;
        const current = ORDER_STAGES.indexOf(orders[index].status);
        if (current === -1 || current >= ORDER_STAGES.length - 1) return orders[index];
        const updated = { ...orders[index], status: ORDER_STAGES[current + 1] };
        updated.timeline = buildTimeline(updated);
        orders[index] = updated;
        persist(orders);
        return updated;
      },
    });
  },

  async getTracking(id) {
    return apiRequest(`/orders/${id}/tracking`, {
      fallback: () => {
        const order = loadOrders().find((o) => o.id === id || o._id === id);
        if (!order) fail('We could not find that shipment.', 404, 'ORDER_NOT_FOUND');
        const timeline = buildTimeline(order);
        const currentStep = timeline.filter((t) => t.done).pop() ?? timeline[0];
        return {
          orderId: order.id,
          trackingNumber: order.trackingNumber,
          partner: order.partner,
          status: order.status,
          estimatedDelivery: order.estimatedDelivery,
          currentLocation: currentStep.location,
          timeline,
          events: [...timeline].filter((t) => t.done).reverse(),
        };
      },
    }).then((track) => ({
      ...track,
      orderId: track.orderId || id,
      timeline: track.timeline || [],
      events: track.events || (track.timeline ? [...track.timeline].filter((t) => t.done).reverse() : []),
    }));
  },

  async getReturns() {
    return apiRequest('/returns', {
      fallback: () => readStorage(STORAGE_KEYS.returns, []),
    });
  },

  async createReturn({ orderId, items, reason, comments, refundMethod, pickupDate }) {
    return apiRequest('/returns', {
      method: 'POST',
      body: { orderId, items, reason, comments, refundMethod, pickupDate },
      fallback: () => {
        const order = loadOrders().find((o) => o.id === orderId || o._id === orderId);
        if (!order) fail('We could not find that order.', 404, 'ORDER_NOT_FOUND');
        const ret = {
          id: generateId('RET'),
          orderId,
          items,
          reason,
          comments,
          refundMethod,
          pickupDate,
          status: 'Return requested',
          createdAt: new Date().toISOString(),
        };
        const allReturns = readStorage(STORAGE_KEYS.returns, []);
        writeStorage(STORAGE_KEYS.returns, [ret, ...allReturns]);
        return ret;
      },
    });
  },

  async getRefunds() {
    return apiRequest('/returns/refunds', {
      fallback: () => [],
    });
  },
};

export default orderService;
