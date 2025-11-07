import React from "react";

const StatusDisplay = ({ winner, currentPlayer }) => {
  if (winner === "draw") return <h2>Tasapeli!</h2>;
  if (winner) return <h2>Voittaja: {winner}</h2>;
  return <h2>Vuorossa: {currentPlayer}</h2>;
};

export default StatusDisplay;
