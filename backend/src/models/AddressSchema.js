const mongoose = require('mongoose');

const { Schema } = mongoose

const Address = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    label: String,   // 'Home', 'Work', etc.
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Address', Address);