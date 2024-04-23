import React, { useState } from 'react';
import NicknameInput from './components/nickname/NicknameInput';
import MainMenu from './components/main_menu/MainMenu';
import Queue from './components/queue/Queue';
import Storygame from './components/games/story_game/StoryGame';
import socketIOClient from 'socket.io-client';

function App() {
  const [nickname, setNickname] = useState('');
  const [inQueue, setInQueue] = useState(false);
  const [socketQueue, setSocketQueue] = useState(null);
  const [storygame, setStorygame] = useState(null);
  const [gameSocket, setGameSocket] = useState(null);
  const [ip, setIp] = useState("");

  const handleNicknameSubmit = (newNickname) => {
    setNickname(newNickname);
  };

  const handleQueue = async () => {
    setInQueue(true);
    const response = await fetch('lb.nykanen.dev:3000'); // Fetching the IP from server manager
    const data = await response.json();
    // Setting IP and connecting to queue socket.
    setIp(data.host);
    const socketQueue = socketIOClient(`${ip}:3000`);
    setSocketQueue(socketQueue);
    // Notifying that new client is in queue.
    socketQueue.emit('join-queue');
  };

  return (
    <div className="App">
      {!nickname && <NicknameInput onSubmit={handleNicknameSubmit} />}
      {nickname &&!inQueue && !storygame &&<MainMenu handleQueue={handleQueue} nickname={nickname} />}
      {nickname && inQueue && <Queue inQueue={inQueue} setInQueue={setInQueue} socketQueue={socketQueue} setStorygame={setStorygame} setGameSocket={setGameSocket} ip={ip}/>}
      {nickname && !inQueue && storygame && <Storygame setStorygame={setStorygame} gameSocket={gameSocket} nickname={nickname} />}
    </div>
  );
}

export default App;