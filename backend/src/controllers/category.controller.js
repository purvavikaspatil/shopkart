const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const Category = require('../models/CategorySchema');
const { CATEGORIES } = require('../utils/inMemoryStore');

exports.getCategories = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const categories = await Category.find();
    if (categories && categories.length > 0) return res.json(categories);
  }
  res.json(CATEGORIES);
});

exports.getCategoryBySlug = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const category = await Category.findOne({ slug: req.params.slug });
    if (category) return res.json(category);
  }
  const fallbackCat = CATEGORIES.find((c) => c.slug === req.params.slug);
  if (!fallbackCat) throw new ApiError('Category not found.', 404, 'CATEGORY_NOT_FOUND');
  res.json(fallbackCat);
});
