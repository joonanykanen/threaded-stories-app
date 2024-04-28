import React, { useState, useEffect } from 'react';
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
    try {
      const response = await fetch('https://lb.nykanen.dev/proxy');
      const data = await response.json();
      setIp(`${data.host}`);
    } catch (error) {
      console.error('Error fetching IP:', error);
    }
  };

  useEffect(() => {
    if (ip) {
      const socketQueue = socketIOClient(`${ip}:3000`);
      setSocketQueue(socketQueue);
      setInQueue(true);
      socketQueue.emit('join-queue');
    }
  }, [ip]);

  return (
    <div className="App">
      {!nickname && <NicknameInput onSubmit={handleNicknameSubmit} />}
      {nickname &&!inQueue && !storygame &&<MainMenu handleQueue={handleQueue} nickname={nickname} />}
      {nickname && inQueue && <Queue inQueue={inQueue} setInQueue={setInQueue} socketQueue={socketQueue} setStorygame={setStorygame} setGameSocket={setGameSocket} ip={ip} setIp={setIp}/>}
      {nickname && !inQueue && storygame && <Storygame setStorygame={setStorygame} gameSocket={gameSocket} nickname={nickname} />}
    </div>
  );
}

export default App;