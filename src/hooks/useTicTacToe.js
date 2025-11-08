import { useState, useEffect } from "react";

/*
  Tämä custom hook huolehtii koko pelilogiikasta.

  Se pitää sisällään:
  - pelilaudan tilan (board)
  - nykyisen pelaajan (currentPlayer)
  - voittajan (winner)
  - pisteet (scores)
  - tekoälytilan (isAiMode)
  - toiminnot kuten handleCellClick() ja restartGame()

  Lopuksi hook "palauttaa" nämä arvot ja funktiot,
  jotta App-komponentti voi käyttää niitä helposti.
*/

// Määritelllään pelitila
function useTicTacToe() {
    const [board, setBoard] = useState(Array(9).fill(null)); // 3x3 pelilauta
    const [currentPlayer, setCurrentPlayer] = useState(null); // Aloittaja arvotaan
    const [winner, setWinner] = useState(null); // Voittaja x, o tai tasapeli
    const [scores, setScores] = useState({ X: 0, O: 0 }); // Pisteet pelaajille
    const [isAiMode, setIsAiMode] = useState(false); // Tekoälytila pois päältä oletuksena

    // Arvotaan kumpi pelaaja aloittaa, kun komponentti ladataan ensimmäisen kerran
    // Tee  tästä oma komponentti TODO
    useEffect(() => {
        const startingPlayer = Math.random() < 0.5 ? 'X' : 'O';
        setCurrentPlayer(startingPlayer);
    }, []); // Tyhjä riippuvuuslista tarkoittaa, että tämä suoritetaan vain kerran

    // Funktio tarkistaa voittajan
    useEffect(() => {
        const gameWinner = checkWinner(board);
        if (gameWinner) {
            setWinner(gameWinner);
            // Päivitetään pistetilanne, lisätään voittajan pisteitä yhdellä
            setScores((prev) => ({
                ...prev,
                [gameWinner]: prev[gameWinner] + 1,
            }));
        } else if (board.every((cell) => cell !== null)) {
            setWinner("draw"); // Jos kaikki ruudut täynnä → tasapeli
        }
    }, [board]); // Käynnistyy aina kun board muuttuu

    // AI:n liike – kun on AI:n vuoro
    useEffect(() => {
        if (isAiMode && currentPlayer === "O" && !winner) {
            const timer = setTimeout(() => {
                aiMove();
            }, 500); // pieni viive realistisuutta varten
            return () => clearTimeout(timer);
        }
    }, [currentPlayer, isAiMode, winner]);

    // Solun klikkaaminen (ihmispelaaja)
    const handleCellClick = (index) => {

        // Estetään klikkaus jos peli ohi tai ruutu varattu
        if (winner || board[index]) return;

        // Päivitetään pelilauta
        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        // Vaihdetaan vuoro (AI siirtyy O:ksi jos AI-tila päällä)
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    };

    // AI:n siirto
    const aiMove = () => {
        const emptyCells = board
            .map((cell, index) => (cell === null ? index : null))
            .filter((val) => val !== null);

        if (emptyCells.length === 0) return;

        // Valitaan satunnainen tyhjä ruutu TODO paranna AI logiikkaa myöhemmin
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

        const newBoard = [...board];
        newBoard[randomIndex] = "O"; // AI pelaa O:na
        setBoard(newBoard);

        // Vuoro takaisin ihmiselle
        setCurrentPlayer("X");
    };

    // Tyhjennetään pelilauta ja asetetaan aloittaja uudelleen
    const restartGame = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        const startingPlayer = Math.random() < 0.5 ? "X" : "O";
        setCurrentPlayer(startingPlayer);
    };

    // Voittajan tarkistuslogiikka
    const checkWinner = (board) => {

        // Kaikki mahdolliset voittokuviot
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

        // Käydään läpi kaikki mahdolliset voittokuviot
        for (const [a, b, c] of winPatterns) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // Palautetaan voittajan symboli (X tai O)
            }
        }
        return null; // Ei voittajaa vielä
    };

    // Palautetaan kaikki tarvittavat muuttujat ja funktiot
  return {
    board,
    currentPlayer,
    winner,
    scores,
    isAiMode,
    setIsAiMode,
    handleCellClick,
    restartGame,
  };
}

export default useTicTacToe;
