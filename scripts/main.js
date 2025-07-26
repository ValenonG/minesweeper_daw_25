"use strict";

const container = document.getElementById("table-container");

function showCustomForm() {
    const customForm = document.getElementById("custom-form");
    customForm.style.display = customForm.style.display === "none" ? "block" : "none";
}

function setCustomDifficulty() {
    const rows = parseInt(document.getElementById("custom-rows").value, 10);
    const cols = parseInt(document.getElementById("custom-cols").value, 10);

    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
        showModal("Enter positive numbers for rows and columns.");
        return;
    }

    generateTable(rows, cols);
    document.getElementById("custom-form").style.display = "none";
}

function showModal(message) {
    document.getElementById("error-message").textContent = message;
    document.getElementById("error-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("error-modal").style.display = "none";
}

function generateTable(rows, cols) {
    container.innerHTML = "";

    const table = document.createElement("table");

    for (var i = 0; i < rows; i++) {
        const tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {
            const td = document.createElement("td");
            td.dataset.row = i;
            td.dataset.col = j;

            td.addEventListener("click", () => {
                td.style.backgroundColor = "#888";
            });

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    container.appendChild(table);
}

document.getElementById("custom-form").style.display = "none";

generateTable(8, 8);
