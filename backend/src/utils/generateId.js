const crypto = require('crypto');

function generateInvoiceNumber() {
  const rand = crypto.randomInt(100000, 999999);
  return `INV-${new Date().getFullYear()}-${rand}`;
}

function generateTrackingNumber() {
  const rand = crypto.randomInt(100000000, 999999999);
  return `SNT${rand}`;
}

module.exports = { generateInvoiceNumber, generateTrackingNumber };
