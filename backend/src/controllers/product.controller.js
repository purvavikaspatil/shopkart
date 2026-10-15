const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const Product = require('../models/ProductSchema');
const Review = require('../models/ReviewSchema');
const { PRODUCTS, REVIEWS } = require('../utils/inMemoryStore');

const SORTERS = {
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1 },
  newest: { addedAt: -1 },
  popularity: { reviewCount: -1 },
};

/** In-memory filtering helper for fallback mode */
function filterInMemory(items, query) {
  let result = [...items];

  if (query.category) {
    result = result.filter((p) => p.category.toLowerCase() === query.category.toLowerCase());
  }
  if (query.subcategory) {
    result = result.filter((p) => p.subcategory && p.subcategory.toLowerCase() === query.subcategory.toLowerCase());
  }
  if (query.brand) {
    const brands = query.brand.split(',').map((b) => b.trim().toLowerCase());
    result = result.filter((p) => brands.includes(p.brand.toLowerCase()));
  }
  if (query.colors) {
    const colors = query.colors.split(',').map((c) => c.trim().toLowerCase());
    result = result.filter((p) => p.colors && p.colors.some((c) => colors.includes(c.toLowerCase())));
  }
  if (query.sizes) {
    const sizes = query.sizes.split(',').map((s) => s.trim().toLowerCase());
    result = result.filter((p) => p.sizes && p.sizes.some((s) => sizes.includes(s.toLowerCase())));
  }
  if (query.minRating) {
    result = result.filter((p) => p.rating >= Number(query.minRating));
  }
  if (query.minPrice) {
    result = result.filter((p) => p.price >= Number(query.minPrice));
  }
  if (query.maxPrice) {
    result = result.filter((p) => p.price <= Number(query.maxPrice));
  }
  if (query.search) {
    const q = query.search.toLowerCase();
    result = result.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  // Sorting
  const sort = query.sort || 'newest';
  if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
  else if (sort === 'popularity') result.sort((a, b) => b.reviewCount - a.reviewCount);
  else result.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

  return result;
}

/** Builds a Mongo filter object from query params */
function buildFilter(query) {
  const filter = {};
  if (query.category) filter.category = { $regex: new RegExp(`^${query.category}$`, 'i') };
  if (query.subcategory) filter.subcategory = { $regex: new RegExp(`^${query.subcategory}$`, 'i') };
  if (query.brand) filter.brand = { $in: query.brand.split(',').map((b) => new RegExp(`^${b.trim()}$`, 'i')) };
  if (query.colors) filter.colors = { $in: query.colors.split(',') };
  if (query.sizes) filter.sizes = { $in: query.sizes.split(',') };
  if (query.minRating) filter.rating = { $gte: Number(query.minRating) };

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { brand: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
      { tags: { $in: [new RegExp(query.search, 'i')] } },
    ];
  }

  return filter;
}

exports.getProducts = asyncHandler(async (req, res) => {
  const { page = 1, perPage = 20, sort } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = buildFilter(req.query);
      const sortBy = SORTERS[sort] || { addedAt: -1 };
      const skip = (Number(page) - 1) * Number(perPage);

      const [items, total] = await Promise.all([
        Product.find(filter).sort(sortBy).skip(skip).limit(Number(perPage)),
        Product.countDocuments(filter),
      ]);

      if (total > 0 || Object.keys(filter).length > 0) {
        return res.json({
          items,
          total,
          page: Number(page),
          perPage: Number(perPage),
          totalPages: Math.ceil(total / perPage),
        });
      }
    } catch (e) {
      console.warn('Fallback to in-memory store for getProducts:', e.message);
    }
  }

  // In-memory fallback
  const filtered = filterInMemory(PRODUCTS, req.query);
  const total = filtered.length;
  const skip = (Number(page) - 1) * Number(perPage);
  const items = filtered.slice(skip, skip + Number(perPage));

  res.json({
    items,
    total,
    page: Number(page),
    perPage: Number(perPage),
    totalPages: Math.ceil(total / perPage),
  });
});

exports.getAllProducts = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const products = await Product.find();
      if (products && products.length > 0) return res.json(products);
    } catch (e) {
      console.warn('Fallback to in-memory store for getAllProducts:', e.message);
    }
  }
  res.json(PRODUCTS);
});

exports.getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const product = await Product.findById(id);
        if (product) return res.json(product);
      }
    } catch (e) {
      console.warn('Fallback for getProductById:', e.message);
    }
  }

  const found = PRODUCTS.find((p) => p._id === id || p.id === id || p.slug === id);
  if (!found) throw new ApiError('Product not found.', 404, 'PRODUCT_NOT_FOUND');
  res.json(found);
});

exports.getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const product = await Product.findOne({ slug });
      if (product) return res.json(product);
    } catch (e) {
      console.warn('Fallback for getProductBySlug:', e.message);
    }
  }

  const found = PRODUCTS.find((p) => p.slug === slug);
  if (!found) throw new ApiError('Product not found.', 404, 'PRODUCT_NOT_FOUND');
  res.json(found);
});

exports.getProductsByIds = asyncHandler(async (req, res) => {
  const { ids = [] } = req.body;
  const idSet = new Set(ids.map(String));

  if (mongoose.connection.readyState === 1) {
    try {
      const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
      const products = await Product.find({ _id: { $in: validIds } });
      if (products && products.length > 0) return res.json(products);
    } catch (e) {
      console.warn('Fallback for getProductsByIds:', e.message);
    }
  }

  const found = PRODUCTS.filter((p) => idSet.has(String(p._id)) || idSet.has(String(p.id)));
  res.json(found);
});

exports.getFeatured = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const products = await Product.find({ isFeatured: true }).limit(12);
      if (products && products.length > 0) return res.json(products);
    } catch (e) {}
  }
  const featured = PRODUCTS.filter((p) => p.isFeatured).slice(0, 12);
  res.json(featured.length ? featured : PRODUCTS.slice(0, 12));
});

exports.getBestSellers = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const products = await Product.find({ isBestSeller: true }).limit(12);
      if (products && products.length > 0) return res.json(products);
    } catch (e) {}
  }
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 12);
  res.json(bestSellers.length ? bestSellers : PRODUCTS.slice(0, 12));
});

exports.getNewArrivals = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const products = await Product.find().sort({ addedAt: -1 }).limit(12);
      if (products && products.length > 0) return res.json(products);
    } catch (e) {}
  }
  res.json(PRODUCTS.slice(0, 12));
});

exports.getDeals = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const products = await Product.find({ discount: { $gte: 15 } }).sort({ discount: -1 }).limit(12);
      if (products && products.length > 0) return res.json(products);
    } catch (e) {}
  }
  const deals = [...PRODUCTS].sort((a, b) => b.discount - a.discount).slice(0, 12);
  res.json(deals);
});

exports.getTrending = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const products = await Product.find().sort({ reviewCount: -1 }).limit(12);
      if (products && products.length > 0) return res.json(products);
    } catch (e) {}
  }
  const trending = [...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 12);
  res.json(trending);
});

exports.getRecommendations = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const products = await Product.find().sort({ rating: -1 }).limit(12);
      if (products && products.length > 0) return res.json(products);
    } catch (e) {}
  }
  const recs = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 12);
  res.json(recs);
});

exports.getRelated = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const prod = PRODUCTS.find((p) => p._id === id || p.id === id || p.slug === id);
  if (!prod) return res.json(PRODUCTS.slice(0, 8));

  const related = PRODUCTS.filter((p) => p._id !== prod._id && p.category === prod.category).slice(0, 8);
  res.json(related.length ? related : PRODUCTS.slice(0, 8));
});

exports.getFrequentlyBoughtTogether = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const prod = PRODUCTS.find((p) => p._id === id || p.id === id || p.slug === id);
  const bundle = PRODUCTS.filter((p) => p._id !== prod?._id).slice(0, 3);
  res.json(bundle);
});

exports.getReviews = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
      if (reviews && reviews.length > 0) return res.json(reviews);
    } catch (e) {}
  }
  const matches = REVIEWS.filter((r) => r.product === req.params.id);
  res.json(matches.length ? matches : REVIEWS.slice(0, 4));
});

exports.addReview = asyncHandler(async (req, res) => {
  const { rating, title, body, photos } = req.body;
  const review = {
    _id: `rev-${Date.now()}`,
    user: req.user?.id || 'guest',
    product: req.params.id,
    rating: Number(rating) || 5,
    title,
    body,
    photos: photos || [],
    verified: true,
    helpfulCount: 0,
    createdAt: new Date(),
  };

  if (mongoose.connection.readyState === 1) {
    try {
      const dbReview = await Review.create(review);
      return res.status(201).json(dbReview);
    } catch (e) {}
  }

  REVIEWS.unshift(review);
  res.status(201).json(review);
});

exports.getSuggestions = asyncHandler(async (req, res) => {
  const { q = '' } = req.query;
  if (!q.trim()) return res.json([]);
  const term = q.toLowerCase();

  const matches = PRODUCTS.filter((p) =>
    p.title.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term)
  ).slice(0, 8);

  res.json(matches.map((p) => ({ _id: p._id, id: p._id, title: p.title, brand: p.brand, thumbnail: p.thumbnail, slug: p.slug })));
});

exports.getFilterOptions = asyncHandler(async (req, res) => {
  const brands = Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
  const colors = Array.from(new Set(PRODUCTS.flatMap((p) => p.colors || []))).filter(Boolean).sort();
  const sizes = Array.from(new Set(PRODUCTS.flatMap((p) => p.sizes || []))).filter(Boolean);
  const prices = PRODUCTS.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  res.json({
    brands,
    colors,
    sizes,
    priceRange: { min, max },
  });
});

exports.getBrands = asyncHandler(async (req, res) => {
  const brands = Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
  res.json(brands);
});

exports.checkDelivery = asyncHandler(async (req, res) => {
  const { pincode } = req.body;
  if (!/^\d{6}$/.test(pincode)) {
    throw new ApiError('Enter a valid 6-digit pincode.', 400, 'INVALID_PINCODE');
  }

  const eta = new Date();
  eta.setDate(eta.getDate() + 3);

  res.json({
    deliverable: true,
    estimatedDelivery: eta,
    days: 3,
  });
});
