// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken); // everything under /users/me requires auth

router.get('/addresses', ctrl.getAddresses);
router.post('/addresses', ctrl.addAddress);
router.patch('/addresses/:id', ctrl.updateAddress);
router.delete('/addresses/:id', ctrl.deleteAddress);
router.patch('/addresses/:id/default', ctrl.setDefaultAddress);

router.get('/cards', ctrl.getCards);
router.post('/cards', ctrl.addCard);
router.delete('/cards/:id', ctrl.removeCard);
router.patch('/cards/:id/default', ctrl.setDefaultCard);

router.get('/coupons', ctrl.getCoupons);
router.post('/coupons/validate', ctrl.validateCoupon);

router.get('/reviews', ctrl.getMyReviews);
router.delete('/reviews/:id', ctrl.deleteReview);

module.exports = router;