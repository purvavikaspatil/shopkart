const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken); // every order route requires login

router.get('/', ctrl.getOrders);
router.post('/', ctrl.createOrder);
router.get('/:id', ctrl.getOrderById);
router.patch('/:id/cancel', ctrl.cancelOrder);
router.patch('/:id/advance', ctrl.advanceOrder); // demo/admin use only
router.get('/:id/tracking', ctrl.getTracking);

module.exports = router;