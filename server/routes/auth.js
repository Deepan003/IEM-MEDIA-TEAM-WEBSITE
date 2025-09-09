const express = require('express');
const router = express.Router();
const { sendOtp, registerPhotographer } = require('../controllers/authController');

// URL: POST /api/auth/send-otp
router.post('/send-otp', sendOtp);

// URL: POST /api/auth/register/photographer
router.post('/register/photographer', registerPhotographer);

module.exports = router;