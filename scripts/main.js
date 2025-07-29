"use strict";

var board = [];
var container = document.getElementById("table-container");
var mineCounter = document.getElementById("mine-counter");
var timerDisplay = document.getElementById("timer");
var resetButton = document.getElementById("reset-button");

var timerInterval = null;
var totalMines = 0;
var flagsPlaced = 0;
var secondsElapsed = 0;
var timerStarted = false;
var gameOver = false;
var playerName = "";

var loseSound = document.getElementById("lose-sound");
var winSound = document.getElementById("win-sound");

function startTimer() {
    if (timerStarted) return;
    timerStarted = true;
    stopTimer(); 
    secondsElapsed = 0;
    timerDisplay.textContent = "Time: 0s";
    timerInterval = setInterval(() => {
        secondsElapsed++;
        timerDisplay.textContent = `Time: ${secondsElapsed}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function updateMineCounter() {
    mineCounter.textContent = "Mines: " + (totalMines - flagsPlaced);
}

function showCustomForm() {
    var customForm = document.getElementById("custom-form");
    customForm.style.display = customForm.style.display === "none" ? "block" : "none";
}

function setCustomDifficulty() {
    var rows = parseInt(document.getElementById("custom-rows").value, 10);
    var cols = parseInt(document.getElementById("custom-cols").value, 10);
    var mines = parseInt(document.getElementById("custom-mines").value, 10);

    if (isNaN(rows) || isNaN(cols) || isNaN(mines) || rows <= 0 || cols <= 0 || mines <= 0) {
        showModal("Enter positive numbers for rows, columns, and mines.");
        return;
    }

    if (mines >= rows * cols) {
        showModal("Mines must be fewer than total cells.");
        return;
    }

    generateTable(rows, cols, mines);
    document.getElementById("custom-form").style.display = "none";
}

function showModal(message) {
    document.getElementById("error-message").textContent = message;
    document.getElementById("error-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("error-modal").style.display = "none";
}

function countAdjacentMines(row, col) {
    var count = 0;
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            var r = row + i;
            var c = col + j;
            if (r >= 0 && r < board.length && c >= 0 && c < board[0].length) {
                if (board[r][c].isMine) count++;
            }
        }
    }
    return count;
}

function calculateAdjacentMines(rows, cols) {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (!board[i][j].isMine) {
                board[i][j].adjacentMines = countAdjacentMines(i, j);
            }
        }
    }
}

function revealEmptyCells(row, col) {
    if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) return;

    var cell = board[row][col];
    if (cell.revealed || cell.isFlagged) return;

    cell.revealed = true;
    cell.element.style.backgroundColor = "#888";
    cell.element.style.pointerEvents = "none";

    if (cell.adjacentMines > 0) {
        cell.element.textContent = cell.adjacentMines;
        cell.element.style.color = cell.adjacentMines === 1 ? "blue" :
                                   cell.adjacentMines === 2 ? "green" :
                                   cell.adjacentMines === 3 ? "red" :
                                   cell.adjacentMines === 4 ? "purple" : "black";
        return;
    }

    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            revealEmptyCells(row + i, col + j);
        }
    }
}

function placeMines(rows, cols, mines) {
    var placed = 0;
    while (placed < mines) {
        var r = Math.floor(Math.random() * rows);
        var c = Math.floor(Math.random() * cols);
        if (!board[r][c].isMine) {
            board[r][c].isMine = true;
            placed++;
        }
    }
}

function revealAllMines() {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) {
                board[i][j].element.textContent = "💣";
                board[i][j].element.style.backgroundColor = "#ff8080";
            }
        }
    }
}


function generateTable(rows, cols, mines) {
    container.innerHTML = "";
    board = [];
    totalMines = mines;
    flagsPlaced = 0;
    gameOver = false;
    timerStarted = false;
    stopTimer();
    updateMineCounter();
    timerDisplay.textContent = "Time: 0s";

    var table = document.createElement("table");

    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        board[i] = [];
        for (var j = 0; j < cols; j++) {
            var td = document.createElement("td");
            td.dataset.row = i;
            td.dataset.col = j;

            td.addEventListener("click", function () {
                if (!timerStarted) startTimer();
                var row = parseInt(this.dataset.row);
                var col = parseInt(this.dataset.col);
                var cell = board[row][col];

                if (cell.revealed || cell.isFlagged || gameOver) return;

                if (cell.isMine) {
                    cell.element.textContent = "💣";
                    cell.element.style.backgroundColor = "#ff1900ff";
                    stopTimer();
                    gameOver = true;
                    showGameResult("💥 ¡Perdiste!");
                    loseSound.play();
                    revealAllMines();
                } else {
                    if (cell.adjacentMines === 0) {
                        revealEmptyCells(row, col);
                    } else {
                        cell.revealed = true;
                        cell.element.style.backgroundColor = "#888";
                        cell.element.textContent = cell.adjacentMines;
                        cell.element.style.pointerEvents = "none";
                        cell.element.style.color = cell.adjacentMines === 1 ? "blue" :
                                                   cell.adjacentMines === 2 ? "green" :
                                                   cell.adjacentMines === 3 ? "red" :
                                                   cell.adjacentMines === 4 ? "purple" : "black";
                    }
                }
                checkWin();
            });

            td.addEventListener("contextmenu", function (event) {
                event.preventDefault();
                var row = parseInt(this.dataset.row);
                var col = parseInt(this.dataset.col);
                var cell = board[row][col];

                if (cell.revealed || gameOver) return;

                if (!cell.isFlagged) {
                    cell.isFlagged = true;
                    this.textContent = "🚩";
                    this.style.backgroundColor = "#ffcc00";
                    flagsPlaced++;
                } else {
                    cell.isFlagged = false;
                    this.textContent = "";
                    this.style.backgroundColor = "";
                    flagsPlaced--;
                }

                updateMineCounter();
            });

            tr.appendChild(td);
            board[i][j] = {
                isMine: false,
                isFlagged: false,
                revealed: false,
                element: td
            };
        }
        table.appendChild(tr);
    }

    container.appendChild(table);
    placeMines(rows, cols, mines);
    calculateAdjacentMines(rows, cols);
}

document.getElementById("custom-form").style.display = "none";
askPlayerName();

document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        e.preventDefault();
        startTimer();
    }
});

resetButton.addEventListener("click", function () {
    generateTable(8, 8, 10);
});

function checkWin() {
    var unrevealed = 0;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].revealed && !board[i][j].isMine) {
                unrevealed++;
            }
        }
    }
    if (unrevealed === 0 && !gameOver) {
        stopTimer();
        gameOver = true;
        showGameResult("🏆 ¡Ganaste!");
        saveGame();
        launchConfetti();
        winSound.play();
    }
}

function showGameResult(message) {
    document.getElementById("game-result-title").textContent = message;
    document.getElementById("game-result-modal").style.display = "flex";
}

function saveGame(){
        if (playerName !== "") {
        var game = {
            name: playerName,
            duration: secondsElapsed,
            date: getFormattedDateTime()
        };

    var games = JSON.parse(localStorage.getItem("minesweeperRanking")) || [];
    games.push(game);
    localStorage.setItem("minesweeperRanking", JSON.stringify(games));
    //console.log(game)
    }
}

function getFormattedDateTime() {
    var now = new Date();
    var date = now.getFullYear() + "-" + 
        pad2(now.getMonth() + 1) + "-" + 
        pad2(now.getDate());
    var hour = pad2(now.getHours()) + ":" + pad2(now.getMinutes());
    return date + " " + hour;
}

function pad2(n) {
    return n < 10 ? "0" + n : "" + n;
}

function closeGameResult() {
    document.getElementById("game-result-modal").style.display = "none";
    winSound.pause();
    winSound.currentTime = 0;
    loseSound.pause();
    loseSound.currentTime = 0;
}

function askPlayerName() {
    document.getElementById("player-modal").style.display = "flex";
}

function savePlayerName() {
    var input = document.getElementById("player-name").value.trim();
    if (!/^[a-zA-Z0-9 ]{3,}$/.test(input)) {
        showModal("Name must be at least 3 alphanumeric characters.");
        return;
    }
    playerName = input;
    document.getElementById("player-modal").style.display = "none";
    generateTable(8, 8, 10);
    //console.log(playerName)
}
