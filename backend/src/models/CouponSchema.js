const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, uppercase: true },
  title:       String,
  description: String,
  type:        { type: String, enum: ['percent', 'flat'], required: true },
  value:       Number,
  maxDiscount: Number,
  minOrder:    { type: Number, default: 0 },
  category:    { type: String, default: 'All categories' },
  expiresAt:   Date,
});

module.exports = mongoose.model('Coupon', CouponSchema);
// isExpired is computed at query time: expiresAt < Date.now()