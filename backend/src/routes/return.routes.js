const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/return.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', ctrl.getReturns);
router.post('/', ctrl.createReturn);
router.get('/refunds', ctrl.getRefunds);

module.exports = router;