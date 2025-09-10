const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
    platform: { type: String, required: true, unique: true }, // e.g., 'Instagram', 'Facebook'
    url: { type: String, required: true }
});

const SocialMedia = mongoose.model('SocialMedia', socialMediaSchema);
module.exports = SocialMedia;