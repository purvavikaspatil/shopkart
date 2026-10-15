const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.use(verifyToken, requireAdmin); // every admin route requires an admin JWT

router.post('/products', ctrl.createProduct);
router.patch('/products/:id', ctrl.updateProduct);
router.delete('/products/:id', ctrl.deleteProduct);

router.get('/orders', ctrl.getAllOrders);
router.get('/customers', ctrl.getCustomers);
router.get('/analytics/summary', ctrl.getAnalyticsSummary);

module.exports = router;