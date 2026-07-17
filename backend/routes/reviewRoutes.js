const express = require('express');
const Review = require('../models/Review');
const { sendSuccess, sendError } = require('../utilities/response');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    return sendSuccess(res, 200, reviews, 'Reviews fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const review = await Review.create(req.body);
    return sendSuccess(res, 201, review, 'Review created');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

module.exports = router;
