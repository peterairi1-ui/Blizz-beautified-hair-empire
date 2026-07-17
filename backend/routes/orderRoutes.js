const express = require('express');
const Order = require('../models/Order');
const { sendSuccess, sendError } = require('../utilities/response');
const { requireCustomer, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('customer').sort({ createdAt: -1 });
    return sendSuccess(res, 200, orders, 'Orders fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.post('/', requireCustomer, async (req, res) => {
  try {
    const order = await Order.create(req.body);
    return sendSuccess(res, 201, order, 'Order created');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return sendError(res, 404, 'Order not found');
    return sendSuccess(res, 200, order, 'Order status updated');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

module.exports = router;
