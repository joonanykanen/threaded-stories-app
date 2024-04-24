import React, { useState, useEffect } from 'react';
import './Queue.css';
import socketIOClient from 'socket.io-client';

const Queue = ({ inQueue, setInQueue, socketQueue, setStorygame, setGameSocket, ip}) => {
  const [queueNumber, setQueueNumber] = useState(null);

  const cancelQueue = () => {
    setInQueue(false);
    socketQueue.disconnect();
  };

  useEffect(() => {

    socketQueue.on('game-ready', () => {
      const gameSocket = socketIOClient(`${ip}:5000`);
      setGameSocket(gameSocket);
      setInQueue(false);
      setStorygame(true);
      socketQueue.disconnect();
    });

    socketQueue.on('queue-number', (data) => {
      setQueueNumber(data.queueNumber);
    });

  }, [socketQueue, setInQueue, setStorygame]);

  return (
    <div className={`queue ${inQueue ? 'active' : ''}`}>
      <h2>You are in queue</h2>
      {queueNumber !== null && <p>Number of people in queue: {queueNumber}</p>}
      <button onClick={cancelQueue}>Cancel Queue</button>
    </div>
  );
};

export default Queue;