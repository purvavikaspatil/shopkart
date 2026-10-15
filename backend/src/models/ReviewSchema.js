const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productTitle: String,
    thumbnail: String,
    author: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: String,
    body: { type: String, required: true },
    verified: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    photos: [String],
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);