const Event = require('../models/Event');

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Leads/Admins)
exports.createEvent = async (req, res) => {
    try {
        const newEvent = new Event({
            ...req.body,
            createdBy: req.user.id // Get user ID from the auth middleware
        });

        const event = await newEvent.save();
        res.status(201).json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/events
// @desc    Get all events
// @access  Private
exports.getEvents = async (req, res) => {
    try {
        // Fetch events and sort by the most recently created
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};