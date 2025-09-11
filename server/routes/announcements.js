const express = require('express');
const router = express.Router();
const { createAnnouncement, getAnnouncements } = require('../controllers/announcementController');
const auth = require('../middleware/auth');

// Middleware to ensure only leads or admins can post
const isLead = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'lead') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    next();
};

// Get all announcements (all authenticated users can do this)
router.get('/', auth, getAnnouncements);

// Create a new announcement (only leads/admins)
router.post('/', [auth, isLead], createAnnouncement);

module.exports = router;