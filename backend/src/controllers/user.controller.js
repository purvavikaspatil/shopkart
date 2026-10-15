const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const Address = require('../models/AddressSchema');
const Card = require('../models/CardSchema');
const Coupon = require('../models/CouponSchema');
const Review = require('../models/ReviewSchema');
const { ADDRESSES, CARDS, COUPONS, REVIEWS } = require('../utils/inMemoryStore');

async function clearOtherDefaults(Model, userId, keepId) {
  if (mongoose.connection.readyState === 1) {
    await Model.updateMany(
      { user: userId, _id: { $ne: keepId } },
      { $set: { isDefault: false } },
    );
  }
}

/* ---------------- Addresses ---------------- */

exports.getAddresses = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (mongoose.connection.readyState === 1) {
    try {
      const addresses = await Address.find({ user: userId }).sort({ createdAt: -1 });
      if (addresses && addresses.length > 0) return res.json(addresses);
    } catch (e) {}
  }

  const userAddrs = ADDRESSES.filter((a) => String(a.user) === String(userId));
  res.json(userAddrs.length ? userAddrs : ADDRESSES.slice(0, 2));
});

exports.addAddress = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (mongoose.connection.readyState === 1) {
    try {
      const count = await Address.countDocuments({ user: userId });
      const isDefault = count === 0 || !!req.body.isDefault;
      const address = await Address.create({ ...req.body, user: userId, isDefault });
      if (isDefault) await clearOtherDefaults(Address, userId, address._id);
      const addresses = await Address.find({ user: userId }).sort({ createdAt: -1 });
      return res.status(201).json(addresses);
    } catch (e) {}
  }

  const newAddr = {
    _id: `addr-${Date.now()}`,
    id: `addr-${Date.now()}`,
    user: userId,
    ...req.body,
    isDefault: ADDRESSES.length === 0 || !!req.body.isDefault,
  };
  if (newAddr.isDefault) {
    ADDRESSES.forEach((a) => { a.isDefault = false; });
  }
  ADDRESSES.unshift(newAddr);
  res.status(201).json(ADDRESSES);
});

exports.updateAddress = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const address = await Address.findOne({ _id: id, user: userId });
      if (address) {
        Object.assign(address, req.body);
        await address.save();
        if (req.body.isDefault) await clearOtherDefaults(Address, userId, address._id);
        const addresses = await Address.find({ user: userId }).sort({ createdAt: -1 });
        return res.json(addresses);
      }
    } catch (e) {}
  }

  const addr = ADDRESSES.find((a) => a._id === id || a.id === id);
  if (addr) {
    Object.assign(addr, req.body);
    if (req.body.isDefault) {
      ADDRESSES.forEach((a) => { if (a !== addr) a.isDefault = false; });
    }
  }
  res.json(ADDRESSES);
});

exports.deleteAddress = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      await Address.findOneAndDelete({ _id: id, user: userId });
      const addresses = await Address.find({ user: userId }).sort({ createdAt: -1 });
      return res.json(addresses);
    } catch (e) {}
  }

  const idx = ADDRESSES.findIndex((a) => a._id === id || a.id === id);
  if (idx !== -1) ADDRESSES.splice(idx, 1);
  res.json(ADDRESSES);
});

exports.setDefaultAddress = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const address = await Address.findOne({ _id: id, user: userId });
      if (address) {
        address.isDefault = true;
        await address.save();
        await clearOtherDefaults(Address, userId, address._id);
        const addresses = await Address.find({ user: userId }).sort({ createdAt: -1 });
        return res.json(addresses);
      }
    } catch (e) {}
  }

  ADDRESSES.forEach((a) => { a.isDefault = a._id === id || a.id === id; });
  res.json(ADDRESSES);
});

/* ---------------- Cards ---------------- */

exports.getCards = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (mongoose.connection.readyState === 1) {
    try {
      const cards = await Card.find({ user: userId });
      if (cards && cards.length > 0) return res.json(cards);
    } catch (e) {}
  }

  const userCards = CARDS.filter((c) => String(c.user) === String(userId));
  res.json(userCards.length ? userCards : CARDS);
});

exports.addCard = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { number, holder, expiry, brand } = req.body;
  const digits = String(number).replace(/\s/g, '');

  const newCard = {
    _id: `card-${Date.now()}`,
    id: `card-${Date.now()}`,
    user: userId,
    last4: digits.slice(-4),
    brand: brand || (digits.startsWith('4') ? 'Visa' : digits.startsWith('5') ? 'Mastercard' : 'RuPay'),
    holder,
    expiry,
    isDefault: CARDS.length === 0,
  };

  if (mongoose.connection.readyState === 1) {
    try {
      await Card.create(newCard);
      const cards = await Card.find({ user: userId });
      return res.status(201).json(cards);
    } catch (e) {}
  }

  CARDS.push(newCard);
  res.status(201).json(CARDS);
});

exports.removeCard = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      await Card.findOneAndDelete({ _id: id, user: userId });
      const cards = await Card.find({ user: userId });
      return res.json(cards);
    } catch (e) {}
  }

  const idx = CARDS.findIndex((c) => c._id === id || c.id === id);
  if (idx !== -1) CARDS.splice(idx, 1);
  res.json(CARDS);
});

exports.setDefaultCard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  CARDS.forEach((c) => { c.isDefault = c._id === id || c.id === id; });
  res.json(CARDS);
});

/* ---------------- Coupons ---------------- */

exports.getCoupons = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const coupons = await Coupon.find();
      if (coupons && coupons.length > 0) return res.json(coupons);
    } catch (e) {}
  }

  res.json(COUPONS);
});

exports.validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;
  const upper = String(code).trim().toUpperCase();

  const coupon = COUPONS.find((c) => c.code.toUpperCase() === upper);
  if (!coupon) {
    throw new ApiError('Coupon code is invalid.', 404, 'COUPON_INVALID');
  }

  if (coupon.minOrder && Number(subtotal) < coupon.minOrder) {
    throw new ApiError(`Order subtotal must be at least INR ${coupon.minOrder} to apply ${upper}.`, 400, 'MIN_ORDER_NOT_MET');
  }

  res.json(coupon);
});

/* ---------------- Customer Reviews ---------------- */

exports.getMyReviews = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const userReviews = REVIEWS.filter((r) => String(r.user) === String(userId));
  res.json(userReviews.length ? userReviews : REVIEWS.slice(0, 3));
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const idx = REVIEWS.findIndex((r) => r._id === id || r.id === id);
  if (idx !== -1) REVIEWS.splice(idx, 1);
  res.json({ success: true });
});