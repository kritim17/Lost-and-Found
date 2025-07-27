const mongoose = require('mongoose');

const FoundItemSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    contact: String,
    images: [String],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isClaimed: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('FoundItem', FoundItemSchema);
