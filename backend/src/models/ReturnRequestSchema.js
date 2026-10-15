const mongoose = require('mongoose');

const ReturnSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order:        { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  items:        [{ productId: mongoose.Schema.Types.ObjectId, title: String, price: Number, quantity: Number }],
  reason:       String,
  comments:     String,
  refundMethod: String,
  pickupDate:   String,
  status:       { type: String, default: 'Pickup scheduled' }, // -> 'Refunded' when settled
  amount:       Number,
}, { timestamps: true });

module.exports = mongoose.model('ReturnRequest', ReturnSchema);