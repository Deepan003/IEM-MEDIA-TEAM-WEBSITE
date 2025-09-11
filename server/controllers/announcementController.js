const Announcement = require('../models/Announcement');

// @route   POST /api/announcements
// @desc    Create a new announcement
// @access  Private (Leads/Admins)
exports.createAnnouncement = async (req, res) => {
    const { content, image } = req.body;

    if (!content) {
        return res.status(400).json({ msg: 'Content is required' });
    }

    try {
        const newAnnouncement = new Announcement({
            content,
            image, // This would be a URL from a file upload service
            author: req.user.id
        });

        const announcement = await newAnnouncement.save();
        // Populate author details before sending the response
        await announcement.populate('author', 'fullName profilePic');
        res.status(201).json(announcement);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Private (All logged-in users)
exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .populate('author', 'fullName profilePic') // Get author's name and picture
            .sort({ createdAt: -1 }); // Show newest first
        res.json(announcements);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};