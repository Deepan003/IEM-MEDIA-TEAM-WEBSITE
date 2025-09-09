const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // --- Common Fields for All Users ---
    fullName: {
        type: String,
        required: [true, 'Please provide a full name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email' ]
    },
    password: {
        type: String,
        required: [true, 'A password is required'], // Now required for everyone
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['guest', 'photographer', 'lead', 'admin'],
        required: true,
    },

    // --- Photographer-Only Fields ---
    username: {
        type: String,
        required: [function() { return this.role === 'photographer'; }, 'Username is required for photographers'],
        unique: true,
        sparse: true, // This ensures the 'unique' constraint only applies to documents that have this field.
    },
    
    // --- Photographer-Specific Details ---
    year: { type: Number },
    device: { type: String, default: '' },
    lenses: { type: String, default: '' },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    city: { type: String },

    // --- Guest-Only Fields ---
    designation: {
        type: String,
        enum: ['Student', 'Teacher'],
        required: [function() { return this.role === 'guest'; }, 'Designation is required for guests'],
    },
    institution: {
        type: String,
        required: [function() { return this.role === 'guest' && this.designation === 'Student'; }, 'Institution is required for students'],
    },
    
    // --- Fields for both Photographers and Guests ---
    enrollmentNumber: { type: String }, // For Photographers and Guest Students
    department: { type: String },       // For Photographers and Guest Teachers
    rollNumber: { type: String },       // For Photographers (can be repurposed for Guests if needed)

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;