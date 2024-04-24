import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './Queue.css';


const Queue = ({ inQueue, setInQueue, socketQueue, setStorygame, setGameSocket, ip, setIp}) => {
  const [queueNumber, setQueueNumber] = useState(null);

  const cancelQueue = () => {
    setInQueue(false);
    socketQueue.disconnect();
    setIp("");
  };

  socketQueue.on('queue-number', (data) => {
    setQueueNumber(data);
  });

  socketQueue.on('game-ready', () => {

    const gameSocket = socketIOClient("http://localhost:5000");
    setGameSocket(gameSocket);
    setInQueue(false);
    setStorygame(true);
    socketQueue.disconnect();
  });


  return (
    <div className={`queue ${inQueue ? 'active' : ''}`}>
      <h2>You are in queue</h2>
      {queueNumber !== null && <p>Number of people in queue: {queueNumber}</p>}
      <button onClick={cancelQueue}>Cancel Queue</button>
    </div>
  );
};

export default Queue;