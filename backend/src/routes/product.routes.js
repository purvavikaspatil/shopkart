// src/routes/product.routes.js
const express = require('express');
const router = express.Router();

const {
  getProducts,
  getAllProducts,
  getProductById,
  getProductBySlug,
  getProductsByIds,
  getFeatured,
  getBestSellers,
  getNewArrivals,
  getDeals,
  getTrending,
  getRecommendations,
  getRelated,
  getFrequentlyBoughtTogether,
  getReviews,
  addReview,
  getSuggestions,
  getFilterOptions,
  getBrands,
  checkDelivery,
} = require('../controllers/product.controller');

const { verifyToken } = require('../middleware/auth');

// --- static/curated lists first (before ':id' routes, see note below) ---
router.get('/all', getAllProducts);
router.get('/featured', getFeatured);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/deals', getDeals);
router.get('/trending', getTrending);
router.get('/recommendations', getRecommendations);
router.get('/suggestions', getSuggestions);
router.get('/filter-options', getFilterOptions);
router.get('/brands', getBrands);
router.get('/slug/:slug', getProductBySlug);
router.post('/batch', getProductsByIds);

// --- main listing ---
router.get('/', getProducts);

// --- single product and its nested resources ---
router.get('/:id', getProductById);
router.get('/:id/related', getRelated);
router.get('/:id/frequently-bought-together', getFrequentlyBoughtTogether);
router.get('/:id/reviews', getReviews);
router.post('/:id/reviews', verifyToken, addReview);       // must be logged in to review
router.post('/:id/check-delivery', checkDelivery);

module.exports = router;