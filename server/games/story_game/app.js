var express = require('express');
const http = require('http');
const socketIo = require('socket.io');

var app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
});


const PORT = process.env.PORT || 5000;

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
  socket.on('give-nickname', (data) => {
    if (players.length < playercount) {
        players.push(socket.id);
        nicknames.push(data.nickname);
        if (players.length === playercount) {
            io.emit('game-start', nicknames);
            startTurn();
        }
      }
    });
    
    socket.on('submit-word', (data) => {
      
      story += " " + data.word;
      turn = (turn + 1) % playercount;
      if (turn === 0) {
        rounds++;
        if (rounds === totalrounds) {
            endGame();
        }
      }
      startTurn();
    
  });

  socket.on('disconnect', () => {
    const index = players.indexOf(socket.id);
    if (index !== -1) {
        players.splice(index, 1);
        nicknames.splice(index, 1);
    }
  });
});

async function startTurn() {
  // fetch words from DB
  try {
    const response = await fetch("http://localhost:2000/database/mixed-words", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
    });
    const wordChoices = await response.json();

    if (!wordChoices) {
      wordChoices = ["error", "fetching", "words", "this", "time"];
    }

    // send to other users the current story and tell whose turn it is
    io.emit('story', { story, player: nicknames[turn]});
    // send words and current story to user, get the new word
    io.emit('give-words', {words: wordChoices});
    } catch (error) {
      console.error('Error fetching words:', error);
  }
}
  

async function endGame() {
  const title = nicknames[0] + " & friends story";
    try {
      //push story to DB
      await fetch("http://localhost:2000/database/stories", {
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


// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;