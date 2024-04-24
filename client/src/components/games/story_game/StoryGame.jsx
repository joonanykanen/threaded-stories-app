import React from 'react';
import { useState, useEffect } from 'react';
import './StoryGame.css'

const StoryGame = ( {setStorygame, gameSocket, nickname} ) => {

    const [story, setStory] = useState('');
    const [Words, setWords] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [players, setPlayers] = useState([]);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
      // Sending the clients nickname to backend.
      gameSocket.emit('give-nickname', { nickname });
  }, []);

    // Get the info that it's players turn and get new words.
    gameSocket.on('give-words', (data) => {
      console.log(data);
      setWords(data.words)
    });

    // Game starts and client gets all the player nicknames.
    gameSocket.on('game-start', (data) => {
      console.log(data)
      setPlayers(data);
    });

    // Getting updated story and nickname of whose turn it is.
    gameSocket.on('story', (data) => {
      console.log(data);
      setStory(data.story)
      setCurrentPlayer(data.player)
    });

    // Game ending and logic with it.
    gameSocket.on('game-over', () => {
      setGameOver(true)
      gameSocket.disconnect();
    });

    // Adding word of users choice to story.
    const handleWordSubmit = (word) => {
      gameSocket.emit('submit-word', { word });
      setWords([])
    };

    return (
      <div className="story-game">
        <h1 className="title">Story Game</h1>
        <p className="story">{story}</p>
        <div className="players">
          {players.map((player, index) => (
            <p key={index} className={player === currentPlayer ? 'current-player' : ''}>{player}</p>
          ))}
        </div>
        <p className="current-player">{currentPlayer} turn</p>
        <ul className="word-list">
          {Words.map((word, index) => (
            <li key={index}>
              <button onClick={() => handleWordSubmit(word)}>{word}</button>
            </li>
          ))}
        </ul>
        {gameOver && (
          <div className="game-over">
            <h2>Game Over</h2>
            <p>The final story is:</p>
            <p>{story}</p>
            <button onClick={() => setStorygame(false)}>Back to Main Menu</button>
          </div>
        )}
      </div>
    );
};

export default StoryGame;