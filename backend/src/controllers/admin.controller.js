const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const Product = require('../models/ProductSchema');
const Order = require('../models/OrderSchema');
const User = require('../models/UserSchema');
const { PRODUCTS, ORDERS, USERS } = require('../utils/inMemoryStore');

/* ---------------- Product CRUD ---------------- */

exports.createProduct = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    } catch (e) {}
  }

  const newProd = {
    ...req.body,
    _id: `prod-${Date.now()}`,
    id: `prod-${Date.now()}`,
    addedAt: new Date(),
  };
  PRODUCTS.unshift(newProd);
  res.status(201).json(newProd);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (product) return res.json(product);
    } catch (e) {}
  }

  const index = PRODUCTS.findIndex((p) => p._id === id || p.id === id);
  if (index === -1) throw new ApiError('Product not found.', 404, 'PRODUCT_NOT_FOUND');
  PRODUCTS[index] = { ...PRODUCTS[index], ...req.body };
  res.json(PRODUCTS[index]);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      await Product.findByIdAndDelete(id);
      return res.json({ success: true });
    } catch (e) {}
  }

  const index = PRODUCTS.findIndex((p) => p._id === id || p.id === id);
  if (index !== -1) PRODUCTS.splice(index, 1);
  res.json({ success: true });
});

/* ---------------- Orders ---------------- */

exports.getAllOrders = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'firstName lastName email');
      if (orders && orders.length > 0) return res.json(orders);
    } catch (e) {}
  }

  res.json(ORDERS);
});

/* ---------------- Customers ---------------- */

exports.getCustomers = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const customers = await User.find({ role: 'customer' }).select('-password');
      if (customers && customers.length > 0) return res.json(customers);
    } catch (e) {}
  }

  const safeUsers = USERS.filter((u) => u.role === 'customer').map(({ password, passwordPlain, ...safe }) => safe);
  res.json(safeUsers);
});

/* ---------------- Analytics ---------------- */

exports.getAnalyticsSummary = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const [totalOrders, totalRevenue, totalCustomers, totalProducts] = await Promise.all([
        Order.countDocuments(),
        Order.aggregate([
          { $match: { status: { $ne: 'Cancelled' } } },
          { $group: { _id: null, sum: { $sum: '$totals.total' } } },
        ]),
        User.countDocuments({ role: 'customer' }),
        Product.countDocuments(),
      ]);

      if (totalProducts > 0) {
        return res.json({
          totalOrders,
          totalRevenue: totalRevenue[0]?.sum || 0,
          totalCustomers,
          totalProducts,
        });
      }
    } catch (e) {}
  }

  const revenue = ORDERS
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totals?.total || 0), 0);

  res.json({
    totalOrders: ORDERS.length,
    totalRevenue: revenue,
    totalCustomers: USERS.filter((u) => u.role === 'customer').length,
    totalProducts: PRODUCTS.length,
  });
});
