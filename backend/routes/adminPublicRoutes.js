const express = require('express');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const AdminUser = require('../models/AdminUser');
const { signToken } = require('../authentication/jwt');
const { sendSuccess, sendError } = require('../utilities/response');
const { sendMail } = require('../services/emailService');

const router = express.Router();

function getFallbackAdminCredentials() {
  const email = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@blizzbeautified.com').trim().toLowerCase();
  const password = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin1234';
  return { email, password };
}

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

  try {
    const submittedEmail = String(req.body.email || '').trim().toLowerCase();
    const submittedPassword = String(req.body.password || '');

    const fallbackAdmin = getFallbackAdminCredentials();
    if (submittedEmail === fallbackAdmin.email && submittedPassword === fallbackAdmin.password) {
      const token = signToken({ id: 'local-admin', role: 'admin' });
      return sendSuccess(res, 200, { token, admin: { id: 'local-admin', name: 'Administrator', email: fallbackAdmin.email } }, 'Admin login successful');
    }

    const admin = await AdminUser.findOne({ email: submittedEmail });
    if (!admin) return sendError(res, 404, 'Admin account not found');

    const isMatch = await admin.comparePassword(submittedPassword);
    if (!isMatch) return sendError(res, 401, 'Invalid password');

    const token = signToken({ id: admin._id, role: 'admin' });
    return sendSuccess(res, 200, { token, admin: { id: admin._id, name: admin.name, email: admin.email } }, 'Admin login successful');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.post('/forgot', [
  body('email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

  try {
    const email = String(req.body.email).trim().toLowerCase();
    const admin = await AdminUser.findOne({ email });
    if (admin) {
      const token = crypto.randomBytes(20).toString('hex');
      admin.resetPasswordToken = token;
      admin.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
      await admin.save();

      const origin = req.headers.origin || process.env.CLIENT_URL || 'http://localhost:5173';
      const resetLink = `${origin}/admin/reset/${token}`;
      await sendMail({
        to: admin.email,
        subject: 'Reset your admin password',
        html: `<p>Click the link below to reset your admin password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
      });

      return sendSuccess(res, 200, { resetLink }, 'Admin password reset instructions sent');
    }

    return sendSuccess(res, 200, {}, 'If this email is registered, a reset link has been sent.');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.post('/reset/:token', [
  body('password').isLength({ min: 8 }).matches(/\d/).withMessage('Password must be at least 8 characters and include a number'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

  try {
    const token = req.params.token;
    const admin = await AdminUser.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return sendError(res, 400, 'Invalid or expired reset token');
    }

    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    await sendMail({
      to: admin.email,
      subject: 'Your admin password has been updated',
      html: '<p>Your admin password has been successfully reset. If you did not initiate this request, please contact support immediately.</p>',
    });

    return sendSuccess(res, 200, null, 'Admin password updated successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

module.exports = router;
