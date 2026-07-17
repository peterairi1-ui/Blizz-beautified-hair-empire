const express = require('express');
const Cart = require('../models/Cart');
const { sendSuccess, sendError } = require('../utilities/response');
const router = express.Router();

router.get('/:customerId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.params.customerId }).populate('items.product');
    return sendSuccess(res, 200, cart, 'Cart fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.post('/:customerId', async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { customer: req.params.customerId },
      { $push: { items: req.body.item } },
      { upsert: true, new: true }
    );
    return sendSuccess(res, 201, cart, 'Cart updated');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

module.exports = router;
