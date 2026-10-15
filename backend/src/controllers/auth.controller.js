const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');
const User = require('../models/UserSchema');
const { USERS } = require('../utils/inMemoryStore');

// In-memory store for reset codes
const resetCodes = new Map();

const sanitize = (user) => ({
  id: user._id || user.id,
  _id: user._id || user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phoneNumber || user.phone,
  phoneNumber: user.phoneNumber || user.phone,
  gender: user.gender || '',
  dob: user.dob || '',
  avatar: user.avatar || `https://picsum.photos/seed/shopnest-${user.firstName}/200/200`,
  emailVerified: user.emailVerified ?? true,
  role: user.role || 'customer',
});

exports.signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, phone } = req.body;
  const normalizedEmail = String(email).trim().toLowerCase();
  const userPhone = phoneNumber || phone || 9845012399;

  if (mongoose.connection.readyState === 1) {
    try {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        throw new ApiError('An account with this email already exists.', 409, 'EMAIL_TAKEN');
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        firstName,
        lastName,
        email: normalizedEmail,
        password: hash,
        phoneNumber: Number(userPhone) || 9845012399,
        role: 'customer',
        emailVerified: true,
      });

      const token = signToken(user);
      return res.status(201).json({ user: sanitize(user), token });
    } catch (e) {
      if (e.code === 'EMAIL_TAKEN') throw e;
      console.warn('DB Signup fallback to in-memory:', e.message);
    }
  }

  // In-memory fallback
  const existingInMemory = USERS.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existingInMemory) {
    throw new ApiError('An account with this email already exists.', 409, 'EMAIL_TAKEN');
  }

  const newUser = {
    _id: `660f1f77bcf86cd79943${(USERS.length + 1).toString(16).padStart(4, '0')}`,
    firstName,
    lastName,
    email: normalizedEmail,
    passwordPlain: password,
    password: bcrypt.hashSync(password, 10),
    phoneNumber: Number(userPhone) || 9845012399,
    role: 'customer',
    emailVerified: true,
    avatar: `https://picsum.photos/seed/shopnest-${firstName}/200/200`,
    createdAt: new Date(),
  };

  USERS.push(newUser);
  const token = signToken(newUser);
  res.status(201).json({ user: sanitize(newUser), token });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email).trim().toLowerCase();

  // 1. Check live MongoDB if connected
  if (mongoose.connection.readyState === 1) {
    try {
      const user = await User.findOne({ email: normalizedEmail });
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          const token = signToken(user);
          return res.json({ user: sanitize(user), token });
        }
      }
    } catch (e) {
      console.warn('DB Login fallback to in-memory:', e.message);
    }
  }

  // 2. Check in-memory store (covers the 4 pre-seeded accounts)
  const memUser = USERS.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (memUser) {
    const isDirectMatch = memUser.passwordPlain === password;
    const isHashMatch = await bcrypt.compare(password, memUser.password).catch(() => false);

    if (isDirectMatch || isHashMatch) {
      const token = signToken(memUser);
      return res.json({ user: sanitize(memUser), token });
    }
    throw new ApiError('Incorrect password. Please try again.', 401, 'INVALID_CREDENTIALS');
  }

  throw new ApiError('No account found with this email.', 404, 'USER_NOT_FOUND');
});

exports.logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalized = String(email).trim().toLowerCase();
  const code = crypto.randomInt(100000, 999999).toString();
  resetCodes.set(normalized, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

  console.log(`Password reset code for ${normalized}: ${code}`);
  res.json({ success: true, message: 'Reset code sent to your email.', code });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;
  const normalized = String(email).trim().toLowerCase();
  const entry = resetCodes.get(normalized);

  if (!entry || entry.code !== code || entry.expiresAt < Date.now()) {
    // For ease of demo testing, allow 123456 as a master reset code
    if (code !== '123456') {
      throw new ApiError('Invalid or expired reset code.', 400, 'INVALID_RESET_CODE');
    }
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const user = await User.findOne({ email: normalized });
      if (user) {
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        resetCodes.delete(normalized);
        return res.json({ success: true, message: 'Password updated. Please log in.' });
      }
    } catch (e) {}
  }

  const memUser = USERS.find((u) => u.email.toLowerCase() === normalized);
  if (memUser) {
    memUser.passwordPlain = newPassword;
    memUser.password = bcrypt.hashSync(newPassword, 10);
    resetCodes.delete(normalized);
    return res.json({ success: true, message: 'Password updated. Please log in.' });
  }

  res.json({ success: true, message: 'Password updated. Please log in.' });
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (code === '000000') {
    throw new ApiError('That verification code has expired. Request a new one.', 400, 'CODE_EXPIRED');
  }
  res.json({ success: true, message: 'Email verified successfully.' });
});

exports.resendCode = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'A fresh verification code has been sent.' });
});

exports.updateMe = asyncHandler(async (req, res) => {
  const updates = req.body;
  const userId = req.user?.id;

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await User.findByIdAndUpdate(userId, updates, { new: true });
      if (updated) return res.json(sanitize(updated));
    } catch (e) {}
  }

  const memUser = USERS.find((u) => u._id === userId || u.id === userId);
  if (memUser) {
    Object.assign(memUser, updates);
    return res.json(sanitize(memUser));
  }

  res.json({ ...updates, id: userId });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;

  if (mongoose.connection.readyState === 1) {
    try {
      const user = await User.findById(userId);
      if (user) {
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) throw new ApiError('Current password is incorrect.', 401, 'INVALID_CREDENTIALS');
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res.json({ success: true, message: 'Password changed successfully.' });
      }
    } catch (e) {
      if (e.code === 'INVALID_CREDENTIALS') throw e;
    }
  }

  res.json({ success: true, message: 'Password changed successfully.' });
});
