const express = require('express');
const Appointment = require('../models/Appointment');
const { sendSuccess, sendError } = require('../utilities/response');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', requireAdmin, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, appointments, 'Appointments fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    return sendSuccess(res, 201, appointment, 'Appointment created');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!appointment) return sendError(res, 404, 'Appointment not found');
    return sendSuccess(res, 200, appointment, 'Appointment status updated');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
});

module.exports = router;
