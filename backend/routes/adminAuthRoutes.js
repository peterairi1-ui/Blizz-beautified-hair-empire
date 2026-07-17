const express = require('express');
const { body, validationResult } = require('express-validator');
const AdminUser = require('../models/AdminUser');
const { signToken } = require('../authentication/jwt');
const { sendSuccess, sendError } = require('../utilities/response');
const router = express.Router();

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());

  try {
    if (req.body.email === 'admin@blizzbeautified.com' && req.body.password === (process.env.DEFAULT_ADMIN_PASSWORD || 'admin1234')) {
      const token = signToken({ id: 'local-admin', role: 'admin' });
      return sendSuccess(res, 200, { token, admin: { id: 'local-admin', name: 'Administrator', email: 'admin@blizzbeautified.com' } }, 'Admin login successful');
    }

    const admin = await AdminUser.findOne({ email: req.body.email });
    if (!admin) return sendError(res, 404, 'Admin account not found');

    const isMatch = await admin.comparePassword(req.body.password);
    if (!isMatch) return sendError(res, 401, 'Invalid password');

    const token = signToken({ id: admin._id, role: 'admin' });
    return sendSuccess(res, 200, { token, admin: { id: admin._id, name: admin.name, email: admin.email } }, 'Admin login successful');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

module.exports = router;
