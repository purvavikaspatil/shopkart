const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/payment.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.post('/razorpay/order', ctrl.createRazorpayOrder);
router.post('/razorpay/verify', ctrl.verifyRazorpayPayment);

module.exports = router;
