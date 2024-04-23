import React from 'react';
import { useState } from 'react';
import './StoryGame.css'

const StoryGame = ( {setStorygame, socket, nickname} ) => {

    const [story, setStory] = useState('');
    const [Words, setWords] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [players, setPlayers] = useState([]);

    // Get the info that it's players turn and get new words
    socket.on('your-turn', (data) => {
      setWords(data.words)
    });


    // Getting updated story and nickname of whose turn it is.
    socket.on('story', (data) => {
      setStory(data.story)
      setCurrentPlayer(data.player)
    });

    // Adding word of users choice to story.
    const handleWordSubmit = (word) => {
      socket.emit('submit-word', { word });
      setWords([])
    };
    
    return (
      <div className="story-game">
        <h1 className="title">Story Game</h1>
        <p className="story">{story}</p>
        <p className="current-player">Current player: {currentPlayer}</p>
        {currentPlayer === nickname && (
          <ul className="word-list">
            {Words.map((word, index) => (
              <li key={index}>
                <button onClick={() => handleWordSubmit(word)}>{word}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
};

export default StoryGame;