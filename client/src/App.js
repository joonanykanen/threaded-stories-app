import React, { useState } from 'react';
import NicknameInput from './components/nickname/NicknameInput';
import MainMenu from './components/main_menu/MainMenu';
import Queue from './components/queue/Queue';
import Storygame from './components/games/story_game/StoryGame';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://127.0.0.1:4001';

function App() {
  const [nickname, setNickname] = useState('');
  const [inQueue, setInQueue] = useState(false);
  const [socket, setSocket] = useState(null);
  const [storygame, setStorygame] = useState(null);

  const handleNicknameSubmit = (newNickname) => {
    setNickname(newNickname);
  };

  const handleQueue = async () => {
    setInQueue(true);
    const socket = socketIOClient(ENDPOINT);
    socket.on('connect', () => {
      console.log('connected to server');
    });
    setSocket(socket);
    socket.emit('join-queue', { nickname });
  };

  /* const handleQueue = async () => {
    setInQueue(true);
    const response = await fetch('http://localhost:3000/api/server-ip'); // Fetching the IP from server manager
    const data = await response.json();
    const socket = socketIOClient(`${data.ip}:4001`); // connecting to game server
    socket.on('connect', () => {
      console.log('connected to server');
    });
    setSocket(socket);
    socket.emit('join-queue', { nickname });
  }; */

  return (
    <div className="App">
      {!nickname && <NicknameInput onSubmit={handleNicknameSubmit} />}
      {nickname &&!inQueue && !storygame &&<MainMenu onQueue={handleQueue} nickname={nickname} />}
      {nickname && inQueue && <Queue inQueue={inQueue} setInQueue={setInQueue} socket={socket} setStorygame={setStorygame} />}
      {nickname && !inQueue && storygame && <Storygame setStorygame={setStorygame} socket={socket} nickname={nickname} />}
    </div>
  );
}

export default App;