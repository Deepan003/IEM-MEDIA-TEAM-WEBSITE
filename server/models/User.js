const mongoose = require('mongoose');

// This schema defines the structure for user data in the database.
const UserSchema = new mongoose.Schema({
    // --- Core Credentials ---
    fullName: {
        type: String,
        required: [true, 'Please provide a full name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    username: {
        type: String,
        required: [function() { return this.role === 'photographer'; }, 'Username is required for photographers'],
        unique: true,
        sparse: true, // Allows multiple null values, ensuring uniqueness only for photographers
    },
    password: {
        type: String,
        required: [function() { return this.role !== 'guest'; }, 'Password is required'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['guest', 'photographer', 'lead', 'admin'],
        required: true,
    },

    // --- Photographer & Student Details ---
    enrollmentNumber: { type: String },
    rollNumber: { type: String },
    year: { type: Number },
    department: { type: String },
    device: { type: String, default: '' },
    lenses: { type: String, default: '' },
    
    // --- Contact & Personal Info ---
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    city: { type: String },

    // --- Guest Specific ---
    college: {
        type: String,
        required: [function() { return this.role === 'guest'; }, 'College name is required for guests'],
    }

}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the model from the schema and export it
const User = mongoose.model('User', UserSchema);
module.exports = User;