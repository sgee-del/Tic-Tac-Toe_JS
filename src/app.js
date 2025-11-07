// Importataan komponentit ja tarvittavat hookit
import React, { useState, useEffect } from "react";
import GameBoard from "./components/gameBoard.js"; // Pelilauta-komponentti
import StatusDisplay from "./components/statusDisplay.js"; // Pelin tila-näyttökomponentti
import ControlPanel from "./components/controlPanel.js"; // Ohjauspaneeli-komponentti
import ScoreBoard from "./components/scoreBoard.js"; // Pistetaulukko-komponentti
import useTicTacToe from "./hooks/useTicTacToe.js"; // Custom hook sisältää pelilogiikan


const App = () => {
    // Pelin tilan hallinta Reactin useState-koukuilla
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [winner, setWinner] = useState(null);
    const [scores, setScores] = useState({ X: 0, O: 0 });
    const [isAiMode, setIsAiMode] = useState(false);

    // Tähän tulisi funktiot, jotka muokkaavat tilaa:
    // - handleCellClick(index)
    // - restartGame()
    // - setGameMode(isAI)
    // - checkWinner() (useEffect-koukussa)
    // - aiMove() (useEffect-koukussa)

    // Arvotaan pelin aloittaja
    // Arvotaan kumpi pelaaja aloittaa
    useEffect(() => {
        const startingPlayer = Math.random() < 0.5 ? 'X' : 'O';
        setCurrentPlayer(startingPlayer);
    }, []);

    // Funktio tarkistaa voittajan
    const checkWinner = (board) => {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        // Voittajan tarkistus logiikka
        for (const [a, b, c] of winPatterns) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    };


    // Kun pelaaja klikkaa ruutua (cell), ottaa "index" parametrina ja päivittää pelilaudan tilan
  const handleCellClick = (index) => {
    if (winner || board[index]) return; // Jos peli on ohi tai ruutu on varattu, return (guard clause)

    const newBoard = [...board]; // Luodaan uusi taulukko kopio nykyisestä laudasta "board"
    newBoard[index] = currentPlayer; // Päivitetään valittu ruutu sekä uusi board nykyisellä pelaajalla
    setBoard(newBoard); //  setBoard funktiolla päivitetään pelilauta, parametrina uusi päivitetty lauta

    // Tarkistetaan voittaja tai tasapelim joka siirron jälkeen kutsutaan checkWinner funktiota
    // Silläkin parametrina uusi päivitetty lauta
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) { // Jos voittaja löytyy
      setWinner(gameWinner); // Asetetaan voittaja tilaan
      setScores((prev) => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 })); // Voittaja saa yhden pisteen voitosta
    } else if (newBoard.every((cell) => cell !== null)) { // Jos voittoa ei löydy mutta lauta on täynnä
      setWinner("draw"); // Tulee tasapeli
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X"); // Muuten vaihdetaan pelaajaa
    }
  };

    // Pelin uudelleenkäynnistäminen
    const handleRestart = () => {
        setBoard(Array(9).fill(null)); // Tyhjennetään pelilauta ja pisteet yms
        setWinner(null); // Tyhjennetän voittaja
        // Arvotaan aloittava pelaaja uudelleen
        const startingPlayer = Math.random() < 0.5 ? 'X' : 'O';
        setCurrentPlayer(startingPlayer);
    };

    return (
    <div className="container game-container d-flex flex-column justify-content-center align-items-center">
      <h1 className="my-4">Tic-Tac-Toe</h1>

      <ControlPanel onRestart={handleRestart} setGameMode={setIsAiMode} />

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