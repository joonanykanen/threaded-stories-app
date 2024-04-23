const mongoose = require('mongoose');

const auxiliarySchema = new mongoose.Schema({
    word: { type: String, required: true },
});

module.exports = mongoose.model('Auxiliary', auxiliarySchema);