const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const { sendSuccess, sendError } = require('../utilities/response');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const message = await ContactMessage.create(req.body);
    return sendSuccess(res, 201, message, 'Message received');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.get('/', requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, messages, 'Messages fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

module.exports = router;
