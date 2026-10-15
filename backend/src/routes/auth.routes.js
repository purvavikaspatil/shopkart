const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');

router.post('/signup', ctrl.signup);
router.post('/login', ctrl.login);
router.post('/logout', ctrl.logout);

router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);

router.post('/verify-email', verifyToken, ctrl.verifyEmail);
router.post('/resend-code', verifyToken, ctrl.resendCode);

router.patch('/me', verifyToken, ctrl.updateMe);
router.patch('/me/password', verifyToken, ctrl.updatePassword);

module.exports = router;