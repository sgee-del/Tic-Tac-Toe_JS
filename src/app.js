import React from "react";
import GameBoard from "./components/gameBoard";
import StatusDisplay from "./components/statusDisplay";
import ControlPanel from "./components/controlPanel";
import ScoreBoard from "./components/scoreBoard";
import useTicTacToe from "./hooks/useTicTacToe";


const App = () => {
  // Hook hoitaa kaiken pelilogiikan ja tilanhallinnan
  const {
    board,
    currentPlayer,
    winner,
    scores,
    isAiMode,
    setIsAiMode,
    handleCellClick,
    restartGame,
  } = useTicTacToe(); // Custom hookkia käytetään vain komponentissa App

  return (
    <div className="container game-container d-flex flex-column justify-content-center align-items-center">
      <h1 className="my-4">Tic-Tac-Toe</h1>

      <ControlPanel onRestart={restartGame} setGameMode={setIsAiMode} />

      <div className="d-flex justify-content-around w-100 my-3">
        <ScoreBoard player="X" score={scores.X} />
        <ScoreBoard player="O" score={scores.O} />
      </div>

      <StatusDisplay winner={winner} currentPlayer={currentPlayer} />

      <GameBoard board={board} onCellClick={handleCellClick} />
    </div>
  );
};

export default App;
