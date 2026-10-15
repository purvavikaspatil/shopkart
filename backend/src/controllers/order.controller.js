const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const Order = require('../models/OrderSchema');
const Product = require('../models/ProductSchema');
const calculateTotals = require('../utils/calculateTotalsSchema');
const { generateInvoiceNumber, generateTrackingNumber } = require('../utils/generateId');
const { ORDERS, PRODUCTS } = require('../utils/inMemoryStore');
const { assertPaymentVerified } = require('./payment.controller');

const STAGES = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];

exports.getOrders = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (mongoose.connection.readyState === 1) {
    try {
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
      if (orders && orders.length > 0) return res.json(orders);
    } catch (e) {}
  }

  // Fallback: return orders for this user or all seeded orders for demo
  const userOrders = ORDERS.filter((o) => String(o.user) === String(userId));
  res.json(userOrders.length ? userOrders : ORDERS);
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (mongoose.connection.readyState === 1) {
    try {
      const order = await Order.findOne({ _id: id });
      if (order) return res.json(order);
    } catch (e) {}
  }

  const found = ORDERS.find((o) => o._id === id || o.id === id || o.invoiceNumber === id || o.trackingNumber === id);
  if (!found) throw new ApiError('Order not found.', 404, 'ORDER_NOT_FOUND');
  res.json(found);
});

exports.createOrder = asyncHandler(async (req, res) => {
  const { items, address, delivery, payment, coupon, paymentDetails } = req.body;
  const userId = req.user?.id;

  if (!items?.length) {
    throw new ApiError('Your cart is empty.', 400, 'EMPTY_CART');
  }

  const orderItems = items.map((item) => ({
    productId: item.productId,
    title: item.title,
    brand: item.brand,
    thumbnail: item.thumbnail,
    price: item.price,
    originalPrice: item.originalPrice || item.price,
    quantity: item.quantity || 1,
    size: item.size,
    color: item.color,
  }));

  const totals = calculateTotals({
    items: orderItems,
    deliveryId: delivery?.id,
    coupon,
    paymentMethod: payment?.id,
  });

  // Online payments must be verified (signature + amount) before an order is created.
  let paymentRecord = { ...payment, status: 'pending' };
  if (payment?.id && payment.id !== 'cod') {
    const verified = await assertPaymentVerified(paymentDetails, totals.total);
    const duplicate = ORDERS.some((o) => o.payment?.razorpayPaymentId === verified.razorpayPaymentId)
      || (mongoose.connection.readyState === 1
        && await Order.exists({ 'payment.razorpayPaymentId': verified.razorpayPaymentId }));
    if (duplicate) throw new ApiError('This payment has already been used for an order.', 409, 'PAYMENT_ALREADY_USED');
    paymentRecord = { ...payment, ...verified, status: 'paid', paidAt: new Date() };
  }

  const orderData = {
    _id: `ord-${Date.now()}`,
    user: userId,
    items: orderItems,
    address,
    delivery,
    payment: paymentRecord,
    coupon,
    totals,
    status: 'Placed',
    timeline: [{ stage: 'Placed', at: new Date(), done: true, current: true, location: 'Order placed online' }],
    trackingNumber: generateTrackingNumber(),
    invoiceNumber: generateInvoiceNumber(),
    partner: 'NestExpress',
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  };

  if (mongoose.connection.readyState === 1) {
    try {
      const created = await Order.create(orderData);
      return res.status(201).json(created);
    } catch (e) {
      console.warn('DB createOrder fallback:', e.message);
    }
  }

  ORDERS.unshift(orderData);
  res.status(201).json(orderData);
});

exports.cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (mongoose.connection.readyState === 1) {
    try {
      const order = await Order.findById(id);
      if (order) {
        order.status = 'Cancelled';
        order.cancelledAt = new Date();
        order.cancelReason = reason;
        await order.save();
        return res.json(order);
      }
    } catch (e) {}
  }

  const order = ORDERS.find((o) => o._id === id || o.id === id);
  if (!order) throw new ApiError('Order not found.', 404, 'ORDER_NOT_FOUND');
  order.status = 'Cancelled';
  order.cancelledAt = new Date();
  order.cancelReason = reason;
  res.json(order);
});

exports.advanceOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const order = await Order.findById(id);
      if (order) {
        const currentIndex = STAGES.indexOf(order.status);
        const nextStage = STAGES[currentIndex + 1];
        if (nextStage) {
          order.status = nextStage;
          order.timeline.forEach((step) => { step.current = false; });
          order.timeline.push({ stage: nextStage, at: new Date(), done: true, current: true });
          await order.save();
          return res.json(order);
        }
      }
    } catch (e) {}
  }

  const order = ORDERS.find((o) => o._id === id || o.id === id);
  if (!order) throw new ApiError('Order not found.', 404, 'ORDER_NOT_FOUND');
  const currentIndex = STAGES.indexOf(order.status);
  const nextStage = STAGES[currentIndex + 1] || 'Delivered';
  order.status = nextStage;
  res.json(order);
});

exports.getTracking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const order = await Order.findById(id);
      if (order) {
        return res.json({
          status: order.status,
          timeline: order.timeline,
          trackingNumber: order.trackingNumber,
          partner: order.partner,
          estimatedDelivery: order.estimatedDelivery,
        });
      }
    } catch (e) {}
  }

  const order = ORDERS.find((o) => o._id === id || o.id === id);
  if (!order) throw new ApiError('Order not found.', 404, 'ORDER_NOT_FOUND');

  res.json({
    status: order.status,
    timeline: order.timeline,
    trackingNumber: order.trackingNumber,
    partner: order.partner,
    estimatedDelivery: order.estimatedDelivery,
  });
});
