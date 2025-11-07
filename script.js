// suoritetaan skripti vasta kun koko sivu on ladattu
document.addEventListener('DOMContentLoaded', () => {

    // Alustetaan muuttujat html elementeille    
    const statusDisplay = document.getElementById('status');
    const gameBoard = document.getElementById('game');
    const restartButton = document.getElementById('restart');
    const vsPlayerButton = document.getElementById('vsPlayer');
    const vsAIButton = document.getElementById('vsAI');
    const scoreXDisplay = document.getElementById('scoreX');
    const scoreODisplay = document.getElementById('scoreO');

    let board = ['', '', '', '', '', '', '', '', '']; // Pelilaudan tila
    let currentPlayer = 'X'; // x aloittaa pelin
    let isGameActive = true;
    let isAI = false;
    let cells = []; // Solujen määrä                   

    let scores = { X: 0, O: 0 }; // Tallennetaaan pisteet

    // array pelilaudasta (9 tyhjää solua), muuttaa tilaa pelin aikana
    // Jokainen indeksi vastaa yhtä solua laudalla
    // ja päivittää tyhjän solun nykyiseksi pelaajakasi kun siihen klikataan
    // verrataan sitten löytyykö index yhdistelmä winningConditionsista
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    function initializeBoard() {
        gameBoard.innerHTML = '';
        cells = [];
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('button');
            cell.classList.add('cell', 'btn', 'btn-lg', 'btn-dark');
            cell.dataset.index = i;
            gameBoard.appendChild(cell);
            cells.push(cell);
            cell.addEventListener('click', () => {
                if (isAI && currentPlayer === 'O') return; // Estöö klikkaukset AI:n vuorolla
                userAction(cell, i);
            });
        }
    }

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true; // LIsää voittaja listaan
                winCondition.forEach(index => {
                    cells[index].classList.add('winner');
                });
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerHTML = `Player ${currentPlayer} has won!`;
            if (isAI && currentPlayer === 'O') { // AI wins
                gameBoard.classList.add('shake');
            }
            updateScore(currentPlayer);
            isGameActive = false;
            return;
        }

        // Jos pelissä ei ole tyyhjiä ruutuja se on tasapalie eikä kumpmikaan voittanut
        let roundDraw = !board.includes('');
        if (roundDraw) {
            statusDisplay.innerHTML = 'Game ended in a draw!';
            gameBoard.classList.add('shake');
            isGameActive = false;
            return;
        }

        changePlayer();
    }

    function updateScore(winner) {
        scores[winner]++;
        scoreXDisplay.innerText = scores.X;
        scoreODisplay.innerText = scores.O;
    }

    // Funktio määrittää nykyisen pelaajan ja antaa sen mukaisen viestin/ vaihtaa vuoroa
    function changePlayer() {
        // Jos ei ole x:n vuoro annetaan currentPlayer arvoksi o
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; 
        // Näytettään kenen vuoro html elementissä
        statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
        if (isAI && currentPlayer === 'O' && isGameActive) {
            setTimeout(aiMove, 500); // Pieni viive ennen AI:n siirtoa 
        }
    }

    // AI looppaa läpi kaikki mahdollliset voittosenaariot ja pyrkii niihin
    function checkWinner(currentBoard, player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (currentBoard[a] === player && currentBoard[b] === player && currentBoard[c] === player) {
                return true;
            }
        }
        return false;
    }

    // Minmax algoritmi mikä on lähes voittamaton
    function minimax(newBoard, player) {
        const availableSpots = newBoard.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);

        // Tarkistetaan voittaja funktoilla checkWinner(), ja lisätään pisteitä
        if (checkWinner(newBoard, 'X')) {
            return { score: -10 };
        } else if (checkWinner(newBoard, 'O')) {
            return { score: 10 };
        } else if (availableSpots.length === 0) {
            return { score: 0 };
        }

        let moves = [];
        for (let i = 0; i < availableSpots.length; i++) {
            let move = {};
            move.index = availableSpots[i];
            newBoard[availableSpots[i]] = player;

            if (player === 'O') {
                let result = minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                let result = minimax(newBoard, 'O');
                move.score = result.score;
            }

            newBoard[availableSpots[i]] = ''; // Resetoi ruutu
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') { // AI'n vuori, minmax
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else { // Ihmisen vuoro, minimoi pisteet
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    // Function AI:n siirrolle
    function aiMove() {
        const bestMove = minimax(board, 'O');
        const moveIndex = bestMove.index;

        const cell = cells[moveIndex];
        cell.innerHTML = currentPlayer;
        cell.classList.add('player-o');
        board[moveIndex] = currentPlayer;
        handleResultValidation();
    }

    // Funktio tarkistaa onko klikatttu solu validi (tyhjä)
    const isValidAction = (cell) => {
        if (cell.innerHTML === 'X' || cell.innerHTML === 'O') {
            return false;
        }
        return true;
    };

    // Validointi onko klikatttu solu validi ja peli aktiivinen ennenkuin päivitetään lauta
    const userAction = (cell, index) => {
        if (isValidAction(cell) && isGameActive) {
            cell.innerHTML = currentPlayer;
            // Add class for player color
            if (currentPlayer === 'X') {
                cell.classList.add('player-x');
            } else {
                cell.classList.add('player-o');
            }
            board[index] = currentPlayer;
            handleResultValidation();
        }
    };

    // Funktiolla aloitetaan peli uudestaa ja nollataan muuttujat
    function restartGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        currentPlayer = 'X';
        statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
        cells.forEach(cell => cell.innerHTML = '');
        
        // Poistaa animaaion
        cells.forEach(cell => cell.classList.remove('winner'));
        gameBoard.classList.remove('shake');
        // Poistaa pelaajjat
        cells.forEach(cell => cell.classList.remove('player-x', 'player-o'));

        // Tarkistetaan onko AI:n vuoro
        if (isAI && currentPlayer === 'O') {
            setTimeout(aiMove, 500);
        }
    }

    // funktio mikä suoritetaan jos pelaat AI:ta vastaan  
    function setGameMode(aiEnabled) {
        isAI = aiEnabled;
        scores = { X: 0, O: 0 }; // Resetoi psiteet viahtaessa pelimuotoa
        // Näytetään pisteet
        scoreXDisplay.innerText = scores.X;
        scoreODisplay.innerText = scores.O;
        restartGame();
        // Päivitetään status viesti pelimuodon mukaan
        if (isAI) {
            statusDisplay.innerHTML = "Player vs AI. It's X's turn";
        } else {
            statusDisplay.innerHTML = "Player vs Player. It's X's turn";
        }
    }

    restartButton.addEventListener('click', restartGame);
    vsPlayerButton.addEventListener('click', () => setGameMode(false));
    vsAIButton.addEventListener('click', () => setGameMode(true));

    initializeBoard();
});