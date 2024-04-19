const mongoose = require('mongoose');

const explicitSchema = new mongoose.Schema({
    word: { type: String, required: true },
});

module.exports = mongoose.model('Explicit', explicitSchema);