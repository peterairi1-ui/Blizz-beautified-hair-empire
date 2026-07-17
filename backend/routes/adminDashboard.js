const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAdmin, async (req, res) => {
  try {
    const admin = req.admin;
    return res.json({ success: true, admin: { id: admin._id, name: admin.name, email: admin.email }, message: 'Welcome to the admin dashboard' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
