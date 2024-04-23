const mongoose = require('mongoose');

const nounSchema = new mongoose.Schema({
    word: { type: String, required: true },
});

module.exports = mongoose.model('Noun', nounSchema);