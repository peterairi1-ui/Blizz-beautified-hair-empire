const express = require('express');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { sendSuccess, sendError } = require('../utilities/response');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email: req.body.email },
      { $setOnInsert: { email: req.body.email } },
      { upsert: true, new: true }
    );
    return sendSuccess(res, 201, subscriber, 'Subscribed');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

module.exports = router;
