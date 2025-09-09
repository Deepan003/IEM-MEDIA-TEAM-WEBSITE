const express = require('express');
const router = express.Router();
// 1. Import all the required functions from the controller
const { 
    sendOtp, 
    registerPhotographer, 
    registerGuest, 
    checkUsername, 
    login 
} = require('../controllers/authController');

// URL: POST /api/auth/send-otp
// This route was missing. It's now connected to the 'sendOtp' function.
router.post('/send-otp', sendOtp);

// URL: POST /api/auth/register/photographer
router.post('/register/photographer', registerPhotographer);

// URL: POST /api/auth/register/guest
// This route was also missing.
router.post('/register/guest', registerGuest);

// URL: GET /api/auth/check-username
// This route was missing. It handles the real-time username availability check.
router.get('/check-username', checkUsername);

// URL: POST /api/auth/login
// This route was also missing.
router.post('/login', login);


module.exports = router;