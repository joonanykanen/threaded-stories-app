var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/storygame', () => {
    var story = [];
    var turn = 1;
    var newWord = "";
    var wordChoices = [];
    var rounds = 0;
    while(true) {
        // fetch words from DB
        // send to other users the current story and tell them its not their turn
        // send words and current story to user, get the new word
        story.push(newWord);
        turn += 1;
        if(turn == 6) {
            turn = 1;
            rounds += 1;
            if(rounds == 5) {
                break;
            }
        }
    }
    //push story to DB
    //send game omer
})

module.exports = app;
