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

const PORT = process.env.PORT || 3000;

const playercount = 5;
const totalrounds = 3;
var story = "";
var turn = 0;
var rounds = 0;
var nicknames = [];
var players = [];

io.on('connection', async (socket) => {
  console.log('A user connected');
  
  // Handle getting nicknames
  socket.on('give-nickname', (nickname) => {
    if (players.length < playercount) {
        players.push(socket.id);
        nicknames.push(nickname);
        if (players.length === playercount) {
            io.emit('game-start', { players: nicknames });
            startGame();
        }
      }
    });
    
    socket.on('submit-word', (word) => {
      if (socket.id === players[turn]) {
          story += " " + word;
          turn = (turn + 1) % playerCount;
          if (turn === 0) {
              rounds++;
              if (rounds === totalRounds) {
                  endGame();
              } else {
                  startGame();
              }
          }
      }
  });

  socket.on('disconnect', () => {
    const index = players.indexOf(socket.id);
    if (index !== -1) {
        players.splice(index, 1);
        nicknames.splice(index, 1);
    }
  });
});

async function startGame() {
  // fetch words from DB
  try {
    const response = await fetch("http://localhost:3000/database/mixed-words", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
    });
    const wordChoices = response.json();
    // send to other users the current story and tell whose turn it is
    io.emit('story', { story, player: nicknames[turn]});
    // send words and current story to user, get the new word
    io.emit('give-words', wordChoices);
    } catch (error) {
      console.error('Error fetching words:', error);
  }
}
  

async function endGame() {
  const title = nicknames[0] + " & friends story";
    try {
      //push story to DB
      await fetch("http://localhost:3000/database/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          "title": title,
          "content": story
        }
      })
      //send game over
      io.emit('game-over', story);
      
      story = "";
      turn = 0;
      rounds = 0;
      nicknames = [];
      players = [];
    } catch (error) {
        console.error('Error posting story:', error);
    }
}

server.listen(PORT, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
