import React from 'react';
import './MainMenu.css'

const MainMenu = ({ nickname, handleQueue }) => {

    const handleClick = async () => {
      handleQueue();
    }

    return (
      <div className="main-menu-container">
        <h1>Welcome, {nickname}!</h1>
        <div className="menu-options">
          <button onClick={handleClick}>Queue for Game</button>
          <button >Log Off</button>
        </div>
      </div>
    );
  };
  
  export default MainMenu;