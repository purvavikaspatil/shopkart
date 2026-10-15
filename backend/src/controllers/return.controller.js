const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const ReturnRequest = require('../models/ReturnRequestSchema');
const Order = require('../models/OrderSchema');

exports.getReturns = asyncHandler(async (req, res) => {
  const returns = await ReturnRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(returns);
});

exports.createReturn = asyncHandler(async (req, res) => {
  const { orderId, items, reason, comments, refundMethod, pickupDate } = req.body;

  const order = await Order.findOne({ _id: orderId, user: req.user.id });
  if (!order) throw new ApiError('Order not found.', 404, 'ORDER_NOT_FOUND');
  if (order.status !== 'Delivered') {
    throw new ApiError('Only delivered orders can be returned.', 400, 'RETURN_NOT_ALLOWED');
  }

  const amount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const returnRequest = await ReturnRequest.create({
    user: req.user.id,
    order: order._id,
    items,
    reason,
    comments,
    refundMethod,
    pickupDate,
    amount,
    status: 'Pickup scheduled',
  });

  order.status = 'Returned';
  await order.save();

  res.status(201).json(returnRequest);
});

// Refunds are derived from return requests + cancelled orders, same as the frontend mock —
// no separate Refund collection needed.
exports.getRefunds = asyncHandler(async (req, res) => {
  const [returns, cancelledOrders] = await Promise.all([
    ReturnRequest.find({ user: req.user.id }),
    Order.find({ user: req.user.id, status: 'Cancelled' }),
  ]);

  const fromReturns = returns.map((r) => ({
    id: r._id,
    source: 'return',
    orderId: r.order,
    amount: r.amount,
    method: r.refundMethod,
    status: r.status,
    date: r.createdAt,
  }));

  const fromCancellations = cancelledOrders.map((o) => ({
    id: o._id,
    source: 'cancellation',
    orderId: o._id,
    amount: o.totals.total,
    method: o.payment?.label,
    status: 'Refunded',
    date: o.cancelledAt,
  }));

  res.json([...fromReturns, ...fromCancellations].sort((a, b) => b.date - a.date));
});
