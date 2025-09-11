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
        required: [true, 'A password is required'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['guest', 'photographer', 'lead', 'admin'],
        required: true,
    },

    // --- ADD THIS LINE ---
    isBanned: {
        type: Boolean,
        default: false
    },

    // --- Photographer-Only Fields ---
    username: {
        type: String,
        required: [function() { return this.role === 'photographer'; }, 'Username is required for photographers'],
        unique: true,
        sparse: true,
    },
    
    // ... rest of the schema remains the same
    year: { type: Number },
    device: { type: String, default: '' },
    lenses: { type: String, default: '' },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    city: { type: String },
    designation: {
        type: String,
        enum: ['Student', 'Teacher'],
        required: [function() { return this.role === 'guest'; }, 'Designation is required for guests'],
    },
    institution: {
        type: String,
        required: [function() { return this.role === 'guest' && this.designation === 'Student'; }, 'Institution is required for students'],
    },
    enrollmentNumber: { type: String },
    department: { type: String },
    rollNumber: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;