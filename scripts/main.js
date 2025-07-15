"use strict";

const container = document.getElementById("table-container");

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

generateTable(8, 8);