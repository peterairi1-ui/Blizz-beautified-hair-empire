const express = require('express');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const AdminUser = require('../models/AdminUser');
const { signToken } = require('../authentication/jwt');
const { sendSuccess, sendError } = require('../utilities/response');
const { sendMail } = require('../services/emailService');
const { requireCustomer } = require('../middleware/auth');
const router = express.Router();

router.post('/register', [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }).matches(/\d/).withMessage('Password must be at least 8 characters and include a number'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return sendError(res, 409, 'Email already registered');

    const user = await User.create(req.body);
    const token = signToken({ id: user._id, role: 'customer' });
    await sendMail({ to: user.email, subject: 'Welcome to Blizz Beautified Hair Empire', html: '<p>Welcome to Blizz Beautified Hair Empire.</p>' });
    return sendSuccess(res, 201, { token, user: { id: user._id, name: user.name, email: user.email } }, 'Registration successful');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      const adminMatch = await AdminUser.findOne({ email });
      if (adminMatch) {
        return sendError(res, 404, 'No customer account found for this email. If you are an administrator, please use the admin login page.');
      }
      return sendError(res, 404, 'User not found');
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) return sendError(res, 401, 'Invalid password');

    const token = signToken({ id: user._id, role: 'customer' });
    return sendSuccess(res, 200, { token, user: { id: user._id, name: user.name, email: user.email } }, 'Login successful');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.post('/forgot-password', [
  body('email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

  try {
    const email = String(req.body.email).trim().toLowerCase();
    const user = await User.findOne({ email });
    if (user) {
      const token = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
      await user.save();

      const origin = req.headers.origin || process.env.CLIENT_URL || 'http://localhost:5173';
      const resetLink = `${origin}/auth/reset/${token}`;
      await sendMail({
        to: user.email,
        subject: 'Reset your password',
        html: `<p>Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
      });

      return sendSuccess(res, 200, { resetLink }, 'Password reset instructions sent');
    }

    return sendSuccess(res, 200, {}, 'If this email is registered, a password reset link has been sent.');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.post('/reset-password/:token', [
  body('password').isLength({ min: 8 }).matches(/\d/).withMessage('Password must be at least 8 characters and include a number'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

  try {
    const token = req.params.token;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return sendError(res, 400, 'Invalid or expired reset token');
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await sendMail({
      to: user.email,
      subject: 'Your password has been updated',
      html: '<p>Your password has been successfully reset. If you did not initiate this request, please contact support immediately.</p>',
    });

    return sendSuccess(res, 200, null, 'Password updated successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.get('/me', requireCustomer, async (req, res) => {
  return sendSuccess(res, 200, { user: req.user }, 'User profile fetched');
});

module.exports = router;
