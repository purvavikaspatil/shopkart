const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  last4:     String,   // never store full PAN
  brand:     String,   // Visa / Mastercard / RuPay
  holder:    String,
  expiry:    String,
  isDefault: { type: Boolean, default: false },
});

module.exports = mongoose.model('Card', CardSchema);