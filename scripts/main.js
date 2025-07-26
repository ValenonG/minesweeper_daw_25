"use strict";

var board = [];
const container = document.getElementById("table-container");

function showCustomForm() {
    const customForm = document.getElementById("custom-form");
    customForm.style.display = customForm.style.display === "none" ? "block" : "none";
}

function setCustomDifficulty() {
    const rows = parseInt(document.getElementById("custom-rows").value, 10);
    const cols = parseInt(document.getElementById("custom-cols").value, 10);
    const mines = parseInt(document.getElementById("custom-mines").value, 10);

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

    const table = document.createElement("table");

    for (var i = 0; i < rows; i++) {
        const tr = document.createElement("tr");
        board[i] = [];
        for (var j = 0; j < cols; j++) {
            const td = document.createElement("td");
            td.dataset.row = i;
            td.dataset.col = j;

            td.addEventListener("click", function () {
                const row = parseInt(this.dataset.row);
                const col = parseInt(this.dataset.col);
                const cell = board[row][col];

                if (cell.isMine) {
                    cell.element.textContent = "💣";
                    cell.element.style.backgroundColor = "#ff1900ff";
                } else {
                    cell.element.style.backgroundColor = "#888";
                }

                this.style.pointerEvents = "none";
            });

            tr.appendChild(td);
            board[i][j] = {
                isMine: false,
                element: td,
            };
        }
        table.appendChild(tr);
    }

    container.appendChild(table);
    placeMines(rows, cols, mines);
}

document.getElementById("custom-form").style.display = "none";

generateTable(8, 8, 10);
