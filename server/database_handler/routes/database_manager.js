var express = require('express');
var router = express.Router();

const Auxiliary = require('../models/Auxiliary');
const Explicit = require('../models/Explicit');
const Noun = require('../models/Noun'); 
const Preposition = require('../models/Preposition');
const Story = require('../models/Story');
const Adjective = require('../models/Adjective');
const Verb = require('../models/Verb');

// Auxiliary routes
router.get('/auxiliary', getWords(Auxiliary));
router.post('/auxiliary', postWord(Auxiliary));

// Explicit routes
router.get('/explicit', getWords(Explicit));
router.post('/explicit', postWord(Explicit));

// Noun routes
router.get('/Noun', getWords(Noun));
router.post('/Noun', postWord(Noun));

// Preposition routes
router.get('/prepositions', getWords(Preposition));
router.post('/prepositions', postWord(Preposition));

// Subject routes
router.get('/adjective', getWords(Adjective));
router.post('/adjective', postWord(Adjective));

// Verb routes
router.get('/verbs', getWords(Verb));
router.post('/verbs', postWord(Verb));

// Story routes
router.get('/stories', getWords(Story));
router.post('/stories', postStory);

//post multiple words
router.post('/words', postWords);

// Generic GET handler. Returns ALL of the words in the database
function getWords(Model) {
    return async (req, res) => {
        try {
            const items = await Model.find();
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}

// Generic POST handler for a single word
function postWord(Model) {
    return async (req, res) => {
        // The field should match the schema field, which is 'word', not 'text'
        const item = new Model({
            word: req.body.word, // Changed from text to word
        });

        try {
            const newItem = await item.save();
            res.status(201).json(newItem);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
}


// selecting the correct place for the post to happen in the database
function getModelForType(type) {
    switch (type) {
        case 'auxiliary':
            return Auxiliary;
        case 'explicit':
            return Explicit;
        case 'noun':
            return Noun;
        case 'preposition':
            return Preposition;
        case 'adjective':
            return Adjective;
        case 'verb':
            return Verb;
        case 'story':
            return Story;
        default:
            return null;
    }
}


// Generic POST handler for a list of words
function postWords(req, res) {
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ message: "Expected an array of word objects." });
    }

    const creationPromises = req.body.map(wordData => {
        const Model = getModelForType(wordData.type);
        if (!Model) {
            return Promise.reject(new Error(`Invalid type: ${wordData.type}`));
        }
        return new Model({ word: wordData.text }).save();
    });

    Promise.all(creationPromises)
        .then(newItems => {
            res.status(201).json(newItems);
        })
        .catch(error => {
            res.status(400).json({ message: error.message });
        });
}

// Specific POST handler for stories
async function postStory(req, res) {
    const story = new Story({
        title: req.body.title,
        content: req.body.content,
    });

    try {
        const newStory = await story.save();
        res.status(201).json(newStory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

router.get('/mixed-words', async (req, res) => {
    try {

        // This function creates a promise to retrieve random documents from a given model.
        const getRandomWords = (Model, count) => {
            return Model.aggregate([
                { $sample: { size: parseInt(count) || 0 } }
            ]);
        };

        // Use Promise.all to perform all the aggregations in parallel.
        //changing the number here changes how many words the applicaiton fetches
        const mixedWords = await Promise.all([
            getRandomWords(Auxiliary, 2),
            getRandomWords(Explicit, 2),
            getRandomWords(Noun, 2),
            getRandomWords(Preposition, 2),
            getRandomWords(Adjective, 2),
            getRandomWords(Verb, 2)
        ]);

        // Flatten the array of arrays and remove any undefined (for types not queried)
        const wordsList = mixedWords.flat().filter(Boolean);

        res.status(200).json(wordsList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
