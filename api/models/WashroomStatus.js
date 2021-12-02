const mongoose = require('mongoose');
const { Schema } = mongoose;

const washroomStatus = new Schema({
    washroomId: String,
    occupied: Boolean,
    timeUpdated: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('WashroomStatus', washroomStatus);