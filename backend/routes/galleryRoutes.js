const express = require('express');
const Gallery = require('../models/Gallery');
const { sendSuccess, sendError } = require('../utilities/response');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Gallery.find({ isActive: true }).sort({ createdAt: -1 });
    return sendSuccess(res, 200, items, 'Gallery fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const item = await Gallery.create(req.body);
    return sendSuccess(res, 201, item, 'Gallery item created');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

module.exports = router;
