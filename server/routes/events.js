const express = require('express');
const router = express.Router();
const { createEvent, getEvents } = require('../controllers/eventController');
const auth = require('../middleware/auth');

// Middleware to ensure only leads or admins can create events
const isLead = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'lead') {
        return res.status(403).json({ message: 'Access denied. Must be a Lead or Admin.' });
    }
    next();
};

// @route   POST /api/events
router.post('/', [auth, isLead], createEvent);

// @route   GET /api/events
router.get('/', auth, getEvents);


module.exports = router;