// suoritetaan skripti vasta kun koko sivu on ladattu
document.addEventListener('DOMContentLoaded', () => {

    // Alustetaan muuttujat html elementeille
    const cells = document.querySelectorAll(".cell");
    const statusDisplay = document.getElementById("status");
    const restartButton = document.getElementById("restart");

    let gameActive = true;
    let currentPlayer = 'X';

    // array pelilaudasta (9 tyhjää solua), muuttaa tilaa pelin aikana
    // Jokainen indeksi vastaa yhtä solua laudalla
    // ja päivittää tyhjän solun nykyiseksi pelaajakasi kun siihen klikataan
    // verrataan sitten löytyykö index yhdistelmä winningConditionsista
    let gamestate = ["", "", "", "", "", "", "", "", ""];

    // Kaikki mahdolliset voittoehdot, solun indeksit
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Näyttää viestin nykyisestä pelaajasta/voitosta/tasapelistä jne..
    const winningMessage = () => `Player ${currentPlayer} has won!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
    statusDisplay.innerHTML = currentPlayerTurn();

    // Vaihdetaan pelaajaa vuoron (klikkauksen) jälkeen
    function checkTurn() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.innerHTML = currentPlayerTurn();
    }

    // Käsitellään solun klikkaus ja päivitetään gamestate array
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;

        // Varmistetaan että solua ei ole jo klikattu ja peli on aktiivinen
        if (clickedCell.textContent !== "" || !gameActive) {
            return;
        }

        // Päivitetään klikattuun soluun nykyinen pelaaja ("x" tai "o")
        clickedCell.textContent = currentPlayer;
        const clickedCellIndex = Array.from(cells).indexOf(clickedCell);
        // Päivitetään gamestate array klikatun solun indeksillä
        gamestate[clickedCellIndex] = currentPlayer;
        checkResult();
    }

    // Tarkistetaan pelin tulos (voitto/tasapeli/jatkuu)
    function checkResult() {
        let roundWon = false;

        // Käydään läpi kaikki voittoehdot "winningConditions" arraysta
        for (let i = 0; i < winningConditions.length; i++) {
            // Otetaan voittoehdon indeksit ja vastaavat arvot gamestatesta
            // Annetaan arvot valA, valB, valC muuttujiin ja puretaan array
            const [a, b, c] = winningConditions[i];
            const valA = gamestate[a];
            const valB = gamestate[b];
            const valC = gamestate[c];

            // Jos jokin solu on tyhjä, hypätään seuraavaan voittoehtoon
            if (valA === '' || valB === '' || valC === '') {
                continue;
            }

            // Jos [a, b, c] vastaa samaa pelaajaa, peli on voitettu eli silloin 
            // gamestate[a] === gamestate[b] === gamestate[c] vastaa winningCondition arraysta riviä
            // Lisätään .winCells luokka voittaneille soluille ja vaihdetaan väri css:llä
            if (valA === valB && valB === valC) {
                cells[a].classList.add("winCells");
                cells[b].classList.add("winCells");
                cells[c].classList.add("winCells");
                roundWon = true;
                break;
            }
        }

        // Jos peli on voitettu, näytetään voittoviesti ja lopetetaan peli
        if (roundWon) {
            statusDisplay.innerHTML = winningMessage();
            gameActive = false;
            return;
        }

        // Tarkista onko kaikki ruudut täynnä ilman voittajaa
        if (!gamestate.includes("")) {
            statusDisplay.innerHTML = drawMessage();
            gameActive = false;
            return;
        }

        checkTurn(); // Jos kukaan ei voittanut, vaihdetaan vuoroa.
    }

    // Asettaa joka solun tyhjäksi ja aloittaa pelin alusta. restart nappi TODO: tarkista funktio
    function emptyBoard() {
        cells.forEach(cell => cell.textContent = "");
        gamestate = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        currentPlayer = 'X';
        statusDisplay.innerHTML = currentPlayerTurn();
        // Poistetaan winCells luokka kaikista soluista
        cells.forEach(cell => cell.classList.remove("winCells"));
    }

    // Lisätään event listener joka napille (cell)
    cells.forEach(cell => {
        cell.addEventListener("click", handleCellClick);
    });

    // Lisätään event listener restart-napille, restart nappi kutsuu emptyBoard funktiota
    restartButton.addEventListener('click', emptyBoard);
});