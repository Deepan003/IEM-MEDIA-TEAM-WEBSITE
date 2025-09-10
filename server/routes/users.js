const express = require('express');
const router = express.Router();
const { getUsers, banUser, deleteUser } = require('./userController');
const auth = require('../middleware/auth'); // We'll create this middleware for authentication

// Middleware to check for Admin/Lead roles
const isLead = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'lead') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

router.get('/', [auth, isLead], getUsers);
router.put('/:id/ban', [auth, isLead], banUser);
router.delete('/:id', [auth, isLead], deleteUser);

module.exports = router;