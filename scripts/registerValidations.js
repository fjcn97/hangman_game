"use strict";

// Prevent spaces in the username, password and confirm password inputs
function preventWhiteSpaces(event) {
    if (event.which === 32) {
        event.preventDefault();
        return false;
    }
}

// When the user clicks on the password field, show the message box
function showMessageBox() {
    $("#message").css('display', 'block');
}

// When the user clicks outside of the password field, hide the message box
function hideMessageBox() {
    $("#message").css('display', 'none');
}

// Validate lowercase and uppercase letters
// Validate numbers
function switchStatusClass(passOrPassConf, expression, element) {
    if (passOrPassConf.match(expression)) {
        $(element).removeClass("invalid");
        $(element).addClass("valid");
    } else {
        $(element).removeClass("valid");
        $(element).addClass("invalid");
    }
}

// Change message box that appears when clicking / writing in the pass and confirm pass inputs
function changeMessageBox(inputId) {
    const passOrPassConf = $(`#${inputId}`).val();

    switchStatusClass(passOrPassConf, /[a-z]/g, "#letter");
    switchStatusClass(passOrPassConf, /[A-Z]/g, "#capital");
    switchStatusClass(passOrPassConf, /[0-9]/g, "#number");

    // Validate length
    if (passOrPassConf.length >= 8 && passOrPassConf.length <= 12) {
        $("#length").removeClass("invalid");
        $("#length").addClass("valid");
    } else {
        $("#length").removeClass("valid");
        $("#length").addClass("invalid");
    }
}

// Check if passwords are equal
function verifyPasswords() {
    if ($('#pass').val() === $('#passConf').val()) {
        $('#passMessage').html('As passwords combinam.').css('color', 'green');
    } else {
        $('#passMessage').html('As passwords não combinam.').css('color', 'red');
    }
}

// Prevent numbers to be inserted in the name
function preventNumbers(event) {
    const keyCode = (event.keyCode ? event.keyCode : event.which);
    if (keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 105) {
        event.preventDefault();
    }
}