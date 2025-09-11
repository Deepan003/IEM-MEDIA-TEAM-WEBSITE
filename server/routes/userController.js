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
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // This line will now work correctly
        user.isBanned = !user.isBanned; 
        
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        await user.deleteOne();

        res.json({ msg: 'User removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};