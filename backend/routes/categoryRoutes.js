const express = require('express');
const Category = require('../models/Category');
const { sendSuccess, sendError } = require('../utilities/response');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return sendSuccess(res, 200, categories, 'Categories fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return sendSuccess(res, 201, category, 'Category created');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

module.exports = router;
