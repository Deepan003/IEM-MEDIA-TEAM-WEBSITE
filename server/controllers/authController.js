const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const otpStore = {};

exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes
        otpStore[email] = { otp, expiration };

        const mailOptions = {
            from: `"IEM Photography Club" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Your Verification Code',
            html: `<p>Your OTP for registration is: <h2>${otp}</h2> It is valid for 10 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}: ${otp}`);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

exports.registerPhotographer = async (req, res) => {
    console.log('Received data for registration:', req.body);

    const { email, password, otp, fullName, username, ...otherDetails } = req.body;
    
    if (!email || !password || !otp || !fullName || !username) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    const storedOtpData = otpStore[email];
    if (!storedOtpData) {
        return res.status(400).json({ message: 'OTP not found. Please request one again.' });
    }
    if (Date.now() > storedOtpData.expiration) {
        delete otpStore[email];
        return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    if (storedOtpData.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP.' });
    }
    
    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: 'User with this email or username already exists.' });
        }
        
        user = new User({ email, password, fullName, username, ...otherDetails, role: 'photographer' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        delete otpStore[email];

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (error) {
        console.error('REGISTRATION ERROR:', error); 
        res.status(500).send('Server Error');
    }
};
// --- ADD THIS NEW FUNCTION FOR GUESTS ---
exports.registerGuest = async (req, res) => {
    console.log('Received data for guest registration:', req.body);

    const { email, password, otp, fullName, designation, institution, enrollmentNumber, department, otherInstitution } = req.body;
    
    if (!email || !password || !otp || !fullName || !designation) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    const storedOtpData = otpStore[email];
    if (!storedOtpData) {
        return res.status(400).json({ message: 'OTP not found. Please request one again.' });
    }
    if (Date.now() > storedOtpData.expiration) {
        delete otpStore[email];
        return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    if (storedOtpData.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP.' });
    }
    
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }
        
        const guestDetails = {
            email,
            password,
            fullName,
            designation,
            role: 'guest'
        };

        if (designation === 'Student') {
            guestDetails.enrollmentNumber = enrollmentNumber;
            guestDetails.institution = institution === 'Other' ? otherInstitution : institution;
        } else if (designation === 'Teacher') {
            guestDetails.department = department;
        }

        user = new User(guestDetails);

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        delete otpStore[email];

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (error) {
        console.error('GUEST REGISTRATION ERROR:', error); 
        res.status(500).send('Server Error');
    }
};

exports.checkUsername = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ available: false, message: 'Username is required.' });
        }
        
        const user = await User.findOne({ username: username.toLowerCase() });

        if (user) {
            return res.json({ available: false });
        } else {
            return res.json({ available: true });
        }
    } catch (error) {
        console.error("Username check error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// --- THIS IS THE NEWLY ADDED LOGIN FUNCTION ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // If everything is ok, create and return a token
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                name: user.fullName
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }, // Token will be valid for 7 days
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).send('Server Error');
    }
};