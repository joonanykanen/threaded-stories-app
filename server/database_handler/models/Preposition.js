const mongoose = require('mongoose');

const prepositionSchema = new mongoose.Schema({
    word: { type: String, required: true },
});

module.exports = mongoose.model('Preposition', prepositionSchema);