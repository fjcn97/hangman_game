"use strict";

//Prevent spaces in the username, password and confirm password inputs
function preventWhiteSpaces(event) {
    if (event.which === 32) {
        event.preventDefault();
        return false;
    }
}

// When the user clicks on the password field, show the message box
function showMessageBox() {
    document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
function hideMessageBox() {
    document.getElementById("message").style.display = "none";
}

letter = document.getElementById("letter");
let capital = document.getElementById("capital");
let number = document.getElementById("number");
let length = document.getElementById("length");

//Change message box that appears when clicking / writing in the pass and confirm pass inputs
function changeMessageBox(inputId) {
    let passOrPassConf = document.getElementById(inputId).value;

    // Validate lowercase letters
    let lowerCaseLetters = /[a-z]/g;
    if (passOrPassConf.match(lowerCaseLetters)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
    } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
    }

    // Validate capital letters
    let upperCaseLetters = /[A-Z]/g;
    if (passOrPassConf.match(upperCaseLetters)) {
        capital.classList.remove("invalid");
        capital.classList.add("valid");
    } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
    }

    // Validate numbers
    let numbers = /[0-9]/g;
    if (passOrPassConf.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }

    // Validate length
    if (passOrPassConf.length >= 8 && passOrPassConf.length <= 12) {
        length.classList.remove("invalid");
        length.classList.add("valid");
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
    }
}

//Verify if passwords are equal
function verifyPasswords() {
    if ($('#pass').val() === $('#passConf').val()) {
        $('#passMessage').html('As passwords combinam.').css('color', 'green');
    } else {
        $('#passMessage').html('As passwords não combinam.').css('color', 'red');
    }
}

//Prevents numbers to be inserted in the name
function preventNumbers(event) {
    let keyCode = (event.keyCode ? event.keyCode : event.which);
    if (keyCode > 47 && keyCode < 58) {
        event.preventDefault();
    }
}