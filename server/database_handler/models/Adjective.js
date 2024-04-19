const mongoose = require('mongoose');

const adjectiveSchema = new mongoose.Schema({
    word: { type: String, required: true },
});

module.exports = mongoose.model('Adjective', adjectiveSchema);