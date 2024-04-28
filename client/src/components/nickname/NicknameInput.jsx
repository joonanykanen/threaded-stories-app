// NicknameInput.js
import React, { useState } from 'react';
import "./NicknameInput.css";

const NicknameInput = ({ onSubmit }) => {
  const [nickname, setNickname] = useState('');

  const handleChange = (e) => {
    setNickname(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(nickname);
  };

  return (
    <div className="nickname-input-container">
      <h1 className="title">Threaded Stories</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NicknameInput;
