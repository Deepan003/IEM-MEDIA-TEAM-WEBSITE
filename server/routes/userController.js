const User = require('../models/User');

// Get all 'photographer' and 'lead' members
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['photographer', 'lead'] } });
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Ban/Unban a user
exports.banUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.isBanned = !user.isBanned; // Assumes 'isBanned' field in User model
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// ... (deleteUser function)