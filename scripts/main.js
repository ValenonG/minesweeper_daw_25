"use strict";

var board = [];
var container = document.getElementById("table-container");

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

function generateTable(rows, cols, mines) {
    container.innerHTML = "";
    board = [];

    var table = document.createElement("table");

    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        board[i] = [];
        for (var j = 0; j < cols; j++) {
            var td = document.createElement("td");
            td.dataset.row = i;
            td.dataset.col = j;

            td.addEventListener("click", function () {
                var row = parseInt(this.dataset.row);
                var col = parseInt(this.dataset.col);
                var cell = board[row][col];

                if (cell.isMine) {
                    cell.element.textContent = "💣";
                    cell.element.style.backgroundColor = "#ff1900ff";

                } else {
                    if (cell.revealed || cell.isFlagged) return;

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

                this.style.pointerEvents = "none";
            });
            td.addEventListener("contextmenu", function (event) {
                event.preventDefault();
                var row = parseInt(this.dataset.row);
                var col = parseInt(this.dataset.col);
                var cell = board[row][col];

                if (!cell.isFlagged) {
                    cell.isFlagged = true;
                    this.textContent = "🚩";
                    this.style.backgroundColor = "#ffcc00";
                } else {
                    cell.isFlagged = false;
                    this.textContent = "";
                    this.style.backgroundColor = "";
                }
            });

            tr.appendChild(td);
            board[i][j] = {
                isMine: false,
                isFlagged: false,
                revealed: false,
                element: td,
            };
        }
        table.appendChild(tr);
    }

    container.appendChild(table);
    placeMines(rows, cols, mines);
    calculateAdjacentMines(rows, cols);

}

document.getElementById("custom-form").style.display = "none";

generateTable(8, 8, 10);
