import React from "react";

// Näyttää pelaajien pisteet
const ScoreBoard = ({ player, score }) => {
  return (
    <div>
      <h3>Pelaaja {player}</h3>
      <p>Pisteet: {score}</p>
    </div>
  );
};

export default ScoreBoard;
