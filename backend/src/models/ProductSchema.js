const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, index: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: Number,                 // derive: round((1 - price/originalPrice) * 100)
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    colors: [String],
    sizes: [String],
    material: String,
    tags: [String],
    description: String,
    highlights: [String],
    specifications: { type: Map, of: String },   // key-value spec table
    boxContents: [String],
    images: [String],
    thumbnail: String,
    deliveryDays: { type: Number, default: 3 },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Product',ProductSchema)