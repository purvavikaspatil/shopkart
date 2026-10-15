const express = require('express');
const router = express.Router();

router.use('/products', require('./product.routes'));
router.use('/categories', require('./category.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/orders', require('./order.routes'));
router.use('/payments', require('./payment.routes'));
router.use('/returns', require('./return.routes'));
router.use('/users/me', require('./user.routes'));
router.use('/content', require('./content.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;