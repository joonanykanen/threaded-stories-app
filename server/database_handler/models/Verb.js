const mongoose = require('mongoose');

const verbSchema = new mongoose.Schema({
    word: { type: String, required: true },
});

module.exports = mongoose.model('Verb', verbSchema);