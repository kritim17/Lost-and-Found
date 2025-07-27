const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    locationFound: { type: String, required: true },
    contactInfo: { type: String, required: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User reference
    status: { type: String, default: 'Found' },
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
