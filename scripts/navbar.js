"use strict";
var contactForm = document.getElementById("contact-form");
var contactModal = document.getElementById("contact-modal");

document.getElementById("navbar-contact").addEventListener("click", function() {
    document.getElementById("contact-modal").style.display = "flex";
});

function closeModalContact() {
    document.getElementById("contact-modal").style.display = "none";
}

contactForm.onsubmit = function (e) {
    e.preventDefault();

    var name = document.getElementById("contact-name").value.trim();
    var email = document.getElementById("contact-email").value.trim();
    var message = document.getElementById("contact-message").value.trim();
    var error = "";

    if (!/^[a-zA-Z0-9 ]{3,}$/.test(name)) {
        error += "Name must be at least 3 alphanumeric characters.";
    }

    if (!/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(email)) {
        error += "Please enter a valid email address.";
    }

    if (message.length <= 5) {
        error += "Message must be more than 5 characters.";
    }

    if (error !== "") {
        showModal(error);
        return;
    }

    var mailto = 
        "mailto:Minesweeper@help.com" +
        "?subject=" + encodeURIComponent("Contact from Minesweeper") +
        "&body=" + encodeURIComponent(
        "Hello, my name is " + name + " " +
        "and I want to communicate with you for the following reason: " + message
    );

    contactForm.reset();
    window.location.href = mailto;
    contactModal.style.display = "none";
};

function openRankingModal() {
    document.getElementById("ranking-modal").style.display = "flex";
    renderRanking();
}

function renderRanking() {
    var rankingList = document.getElementById("ranking-list");
    var order = document.getElementById("ranking-order").value;

    var games = JSON.parse(localStorage.getItem("minesweeperRanking")) || [];

    if (games.length === 0) {
        rankingList.innerHTML = "<p>There are no registered games.</p>";
        return;
    }

    if (order === "duration") {
        games.sort(function (a, b) {
        return a.duration - b.duration;
        });
    } else if (order === "date") {
        games.sort(function (a, b) {
        return b.date.localeCompare(a.date);
        });
    }

    var html = "<ol>";
    for (var i = 0; i < games.length; i++) {
        var g = games[i];
        html += "<li><strong>" + g.name + "</strong> - " +
        "<span class='ranking-duration'>" + g.duration + "s </span> - " +
        g.date + "</li>";
    }
    html += "</ol>";

    rankingList.innerHTML = html;
}

function closeRankingModal() {
    document.getElementById("ranking-modal").style.display = "none";
}

document.getElementById("navbar-ranking").addEventListener("click", function () {
    openRankingModal();
});

document.getElementById("navbar-about").addEventListener("click", function () {
    document.getElementById("about-modal").style.display = "flex";
});

function closeAboutModal() {
    document.getElementById("about-modal").style.display = "none";
}

document.getElementById("toggle-dark").addEventListener("click", function () {
    var isDark = document.body.classList.toggle("dark-mode");
    updateDarkModeLabel(isDark);
});

function updateDarkModeLabel(isDark) {
    var label = document.getElementById("dark-label");
    if (label) {
        label.textContent = isDark ? "🌔 Light Mode" : "🌒 Dark Mode";
    }
}