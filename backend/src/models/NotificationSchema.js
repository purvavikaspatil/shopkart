const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:  { type: String, enum: ['order', 'price', 'deal', 'account'], required: true },
  title: String,
  body:  String,
  link:  String,
  read:  { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);