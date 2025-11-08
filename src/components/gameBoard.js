import React from "react";
import Cell from "./Cell";

const GameBoard = ({ board, onCellClick }) => {
  return (
    <div className="game-board" style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 100px)", // 3x3 pelilauta, jokainen solu 100px leveä
      gap: "10px" // Solujen väli
    }}>
      {board.map((cell, index) => (
        <Cell key={index} value={cell} onClick={() => onCellClick(index)} />
      ))}
    </div>
  );
};

export default GameBoard;
