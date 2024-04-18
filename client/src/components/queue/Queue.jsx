import React, { useEffect } from 'react';
import './Queue.css';


const Queue = ({ inQueue, setInQueue, socket, setStorygame }) => {
  const cancelQueue = () => {
    setInQueue(false);
    socket.disconnect();
  };

  useEffect(() => {
    socket.on('game-start', () => {
      setInQueue(false);
      console.log("peli alkaa");
      setStorygame(true);
    });
  }, [socket, setInQueue ]);

  return (
    <div className={`queue ${inQueue ? 'active' : ''}`}>
      <h2>You are in queue</h2>
      <button onClick={cancelQueue}>Cancel Queue</button>
    </div>
  );
};

export default Queue;