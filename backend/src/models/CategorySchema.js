const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    icon: String,
    tagline: String,
    description: String,
    color: String,
    banner: String,
    subcategories: [String],
});

module.exports = mongoose.model('Category', categorySchema);