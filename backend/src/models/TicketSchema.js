const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  name:    String,
  email:   String,
  subject: String,
  message: String,
}, { timestamps: { createdAt: 'receivedAt', updatedAt: false } });

module.exports = mongoose.model('Ticket', TicketSchema);