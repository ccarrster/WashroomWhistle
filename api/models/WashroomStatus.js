const mongoose = require('mongoose');
const { Schema } = mongoose;

const washroomStatus = new Schema({
    washroomId: String,
    occupied: Boolean
});

module.exports = mongoose.model('WashroomStatus', washroomStatus);