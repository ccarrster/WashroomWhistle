const mongoose = require('mongoose');
const { Schema } = mongoose;

const washroomLog = new Schema({
    washroomId: String,
    occupied: Boolean,
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('WashroomLog', washroomLog);