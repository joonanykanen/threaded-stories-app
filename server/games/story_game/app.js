var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const socketIo = require('socket.io');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dbhandler = require('../database_handler/routes/database_manager.js');

var app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/game', gameRouter);

const PORT = process.env.PORT || 3000;

var story = "";
var turn = 0;
var newWord = "";
var rounds = 0;
var playercount = 5;
var totalrounds = 3;

io.on('connection', (socket) => {
    console.log('A user connected');
    var nicknames = [];
    var players = [];
    var wordChoices = [];
    // Handle getting nicknames
    socket.on('give-nickname', () => {
        if (players.length < playercount) {
            players.push(socket.id);
            nicknames.push(socket.data.nickname);
            if (players.length === playercount) {
                io.emit('game-start', nicknames);
            }
        }
    });
  
  if(nicknames.length === 5) {
    while(true) {
      // fetch words from DB
      
      wordChoices = ["a", "b", "c", "d"];
      // send to other users the current story and tell whose turn it is
      io.emit('story', story, nicknames[turn])
      // send words and current story to user, get the new word
      io.emit('give-words', wordChoices);
      socket.on('submit-word', () => {
        story.push(newWord);
        turn += 1;
        if(turn == playercount) {
          turn = 0;
          rounds += 1;
        }
      })
      if(rounds == totalrounds) {
        break; 
      } 
    }
    //push story to DB

    //send game over
    io.emit('game-over', story);
  };
});


module.exports = app;
