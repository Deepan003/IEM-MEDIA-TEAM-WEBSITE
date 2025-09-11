const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    banner: { type: String }, // URL to the uploaded banner image
    date: {
        type: { type: String, enum: ['Single Day', 'Date Range'] },
        startDate: { type: Date },
        endDate: { type: Date }
    },
    description: { type: String },
    location: {
        address: { type: String },
        googleMapsLink: { type: String }
    },
    externalLinks: [{
        label: { type: String },
        url: { type: String }
    }],
    accessibility: { type: String, enum: ['Open', 'Invite-Only', 'Hybrid'], default: 'Open' },
    visibility: { type: String, enum: ['Public', 'Members Only', 'Participants Only', 'Private'], default: 'Members Only' },
    participants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, default: 'Photographer' } // Can be 'Photographer' or 'Event Lead'
    }],
    subEvents: [{
        name: { type: String },
        date: { type: Date },
        rooms: [{
            name: { type: String },
            assignments: [{
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                isFloating: { type: Boolean, default: false }
            }]
        }]
    }],
    attendance: {
        enabled: { type: Boolean, default: false },
        selfMarking: { type: Boolean, default: false },
        geofencing: {
            enabled: { type: Boolean, default: false },
            radius: { type: Number } // in meters
        },
        records: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            status: { type: String, enum: ['Present', 'Absent'], default: 'Absent' }
        }]
    },
    // This field is now added
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;