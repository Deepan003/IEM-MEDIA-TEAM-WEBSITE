const express = require('express');
const router = express.Router();

// Import all the functions from our controller, including the new 'registerGuest'
const { 
    sendOtp, 
    registerPhotographer, 
    registerGuest, // <-- Added new function
    login, 
    checkUsername 
} = require('../controllers/authController');

// This route can be used by both photographers and guests to get an OTP
router.post('/send-otp', sendOtp);

// This route is specifically for registering photographers
router.post('/register/photographer', registerPhotographer);

// --- ADD THIS NEW ROUTE FOR GUESTS ---
router.post('/register/guest', registerGuest);


// These routes are ready for when we build out the login and username check
router.post('/login', login);
router.get('/check-username', checkUsername);

module.exports = router;