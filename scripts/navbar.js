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
        "Hola! mi nombre es " + name + " " +
        "y me estoy comunicando con ustedes por la siguiente razón : " + message
    );

    contactForm.reset();
    window.location.href = mailto;
    contactModal.style.display = "none";
};