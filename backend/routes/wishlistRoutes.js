const express = require('express');
const Wishlist = require('../models/Wishlist');
const { sendSuccess, sendError } = require('../utilities/response');
const router = express.Router();

router.get('/:customerId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ customer: req.params.customerId }).populate('items');
    return sendSuccess(res, 200, wishlist, 'Wishlist fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.post('/:customerId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { customer: req.params.customerId },
      { $addToSet: { items: req.body.itemId } },
      { upsert: true, new: true }
    );
    return sendSuccess(res, 201, wishlist, 'Wishlist updated');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

module.exports = router;
