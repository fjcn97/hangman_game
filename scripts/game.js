"use strict";

// Variables used in more than one function
let indexOfAttempt, word, time, letter, currentUser, pass, passConf, name, username, user, userArray, newData, currentUserScore, playerScore, matches, matchesArray, matchValuesArray,
theme, themes, themesArray, themeArray, email, userInfo, wasWordGuessed, timeInMinSec;

let listOfUnderscores = [];

if (localStorage.getItem("adminScore") === null) {
    localStorage.setItem("adminScore", 0);
}

if (localStorage.getItem("dsp93Score") === null) {
    localStorage.setItem("dsp93Score", 0);
}

const userObj = {
    'password': String,
    'email': String,
    'name': String,
    'avatarPath': String
};

// To insert the admin and a common user
function insertAdminAndUser(username, email, name, avatarPath) {
    userObj.password = "Test97..";
    userObj.email = email;
    userObj.name = name;
    userObj.avatarPath = avatarPath;
    
    localStorage.setItem(username, JSON.stringify(userObj));
}

// Insert admin
insertAdminAndUser("admin", "admin@jogodaforca.com", "Gonçalo Morais Simões", "style/eyes_moving.gif");

// Insert a common user
insertAdminAndUser("dsp93", "dsp93@gmail.com", "Daniel Silva Pereira", "style/monster_face.jpg");


// For Register Page
// If all fields are filled, then enable the register button.
// If no one is filled or not all are filled, then disable the register button.
function enableDisableRegisterButton(field) {
    $(field).on("keyup", function() {
        if ($('#username').val() !== '' && $('#pass').val() !== '' &&
        $('#passConf').val() !== '' && $.trim($('#name').val()) !== '' &&
        $('#email').val() !== '') {
            $('#registerBtn').prop('disabled', false);
        } else {
            $('#registerBtn').prop('disabled', true);
        }
    });
}

enableDisableRegisterButton("#username");
enableDisableRegisterButton("#pass");
enableDisableRegisterButton("#passConf");
enableDisableRegisterButton("#name");
enableDisableRegisterButton("#email");


// For Login and Add Theme Pages
// If the field is filled, then enable the button of its form.
// If not, then disable the form button.
function enableDisableButton(field, btn) {
    $(field).on("keyup", function() {
        if ($.trim($(field).val()) !== '') {
            $(btn).prop('disabled', false);
        } else {
            $(btn).prop('disabled', true);
        }
    });
}

enableDisableButton("#username", "#nextBtn");
enableDisableButton("#theme", "#addThemeBtn");


// For Add Word To Theme Page
// If the field has three or more characters, then enable the button of its form.
// If not, then disable the form button.
$("#word").on("keyup", function() {
    if ($.trim($("#word").val()).length >= 3) {
        $("#addWordToThemeBtn").prop('disabled', false);
    } else {
        $("#addWordToThemeBtn").prop('disabled', true);
    }
});

// Check if the item "themes" exists in the local storage
function checkIfThemesExist() {
    themes = localStorage.getItem("themes");
    
    if (themes === null) {
        themesArray = [];
    } else {
        themesArray = themes.split(',');
    }
}

// To disable the link "Jogar" when themes don't exist yet
checkIfThemesExist();

if (themes === null) {
    $("#gameLink").addClass("disabled");
    $("#gameLink").prop("href", "#");
    $("#gameLink").css("cursor", "default");
}

// The admin is the only one that can add themes to the game
function addTheme() {
    theme = $('#theme').val();
    
    // To not insert empty themes, since white spaces are allowed
    if ($.trim(theme) === '') {
        return false;
    }
    
    checkIfThemesExist();
    
    theme = theme.replace(/ /g, '_');
    
    // To prevent from adding themes already in the local storage
    if (themesArray.includes(theme)) {
        alert("Já inseriu esse tema anteriormente.");
        return false;
    }
    
    themesArray.push(theme);
    localStorage.setItem("themes", themesArray);
    localStorage.setItem(theme, []);
    alert("Tema inserido com sucesso!");
    location.reload();
}

// To load the current themes
function loadThemes() {
    checkIfThemesExist();
    
    // Check if themes exist
    if (!("themes" in localStorage)) {
        alert("Primeiro, tem de adicionar temas.");
        location.href = "../index.html";
    }
    
    for (const theme of themesArray) {
        if (localStorage.getItem(theme) !== null) {
            $('#themes').append(`<option value=${theme}>${theme.replace(/_/g, ' ')}</option>`);
        }
    }
}

// To the admin add a word to a theme
function addWordToTheme() {
    word = $('#word').val();
    
    if (word.length < 3) {
        return false;
    }
    
    const themeValue = $('#themes').val();
    theme = localStorage.getItem(themeValue);
    
    if (theme === '') {
        themeArray = [];
    } else {
        themeArray = theme.split(',');
    }
    
    // To prevent from adding words already in the local storage
    if (themeArray.includes(word)) {
        alert("Já inseriu essa palavra.");
        return false;
    }

    themeArray.push(word);
    
    localStorage.setItem(themeValue, themeArray);
    alert("A palavra foi adicionada ao tema com sucesso!");
    location.reload();
}

// Pause and play the video, and change the button text
function pausePlayVideo() {
    const video = $("#myVideo").get(0);
    const pausePlayBtn = $("#pausePlayBtn");

    if (video.paused) {
        video.play();
        pausePlayBtn.html("<i class='fas fa-pause'></i> Pausar");
    } else {
        video.pause();
        pausePlayBtn.html("<i class='fas fa-play'></i> Play");
    }
}

// Redirect a loggedin user that is already registered to the index page
function checkRegister() {
    currentUser = sessionStorage.getItem("currentUser");
    
    if (currentUser !== null) {
        location.href = '../index.html';
    }
}

// Write in the login page the username and password of the two initial accounts
function writeUsersInfo() {
    $('#usersInfo').html
    (`<b>admin:</b> ${JSON.parse(localStorage.getItem("admin"))['password']}<br><b>dsp93:</b> ${JSON.parse(localStorage.getItem("dsp93"))['password']}`);
}

// Redirect a loggedin user that is already authenticated to the index page
function checkLogin() {
    currentUser = sessionStorage.getItem("currentUser");
    
    if (currentUser !== null) {
        location.href = '../index.html';
    }
}

// Check if the item "matches" exist or that's not empty
function checkIfMatchesExist() {
    matches = localStorage.getItem("matches");
    
    if (matches === null || matches === '') {
        matchesArray = [];
    } else {
        matches = matches.replace(/},{/g, '};{');
        matchesArray = matches.split(';');
    }
}

// To filter info from the matches item and to sort the array of stats
function toStatsTables(array, key) {
    for (const match of matchesArray) {
        array.push(JSON.parse(match)[key]);
    }
    
    array.sort();
}

// Append stats to the corresponding tables
function appendToStatsTables(tableTop, topArray, col1, col2) {
    for (const element of topArray) {
        $(`#${tableTop}`).append(`<tr><td>${element[col1]}</td><td class=text-right>${element[col2]}</td></tr>`);
    }
}

// Sort stats tables
function sortTable(keyOfMatch, tableId) {
    let arrayToBeLooped = [], arrayToBeMapped = [], nTimesOccurred = [], prev;
    
    toStatsTables(arrayToBeLooped, keyOfMatch);
    
    for (const element of arrayToBeLooped) {
        if (element !== prev) {
            arrayToBeMapped.push(element);
            nTimesOccurred.push(1);
        } else {
            nTimesOccurred[nTimesOccurred.length-1]++;
        }
        prev = element;
    }
    
    let arrayForTable = $.map(arrayToBeMapped, function(v, i) {
      return [{[keyOfMatch]:v, 'nTimes':nTimesOccurred[i]}];
    });

    // Sort from the element that occurred more times to the one that occurred less times 
    arrayForTable.sort((a, b) => b.nTimes - a.nTimes);

    appendToStatsTables(tableId, arrayForTable, keyOfMatch, 'nTimes');
}

// To the stats page
function toStatsPage() {
    currentUser = sessionStorage.getItem("currentUser");
    
    if (currentUser === null) {
        location.href = 'auth/login.html';
    }
    
    checkIfMatchesExist();
    
    // If matches don't exist yet, then the stats tables are empty. So, don't show them
    if (matches === null || matches === '') {
        $('#tableTopThemesHeader').css('display', 'none');
        $('#tableTopWordsHeader').css('display', 'none');
    }
    
    let topPlayers, topPlayersArray = [];
    
    for (const item in localStorage) {
        if (item.endsWith('Score')) {
            topPlayers = {'player':item.replace('Score', ''), 'score':localStorage.getItem(item)};
            topPlayersArray.push(topPlayers);
        }
    }
    
    // Sort from the player with the most points to the player that has the fewest points
    topPlayersArray.sort((a, b) => b.score - a.score);
    
    appendToStatsTables("tableTopPlayers", topPlayersArray, 'player', 'score');

    sortTable("theme", "tableTopThemes");
    sortTable("word", "tableTopWords");
}

// Get these values from the inputs of a form
function getPassNameValues() {
    pass = $("#pass").val();
    passConf = $("#passConf").val();
    name = $("#name").val();
}

// To register a common user
function register() {
    getPassNameValues();
    username = $("#username").val();
    
    if (username in localStorage) {
        alert("Este utilizador já existe. Escolha outro nome de utilizador.");
        return false;
    } else if (pass !== passConf) {
        alert("As passwords não combinam.");
        return false;
    } else {
        if (confirm("Pretende submeter?")) {
            userObj.password = pass;
            userObj.name = name;
            userObj.email = $("#email").val();
            userObj.avatarPath = $("input[name=avatar]:checked").val();
            
            localStorage.setItem(username, JSON.stringify(userObj));
            alert("Registado com sucesso!");
            location.href = 'login.html';
            return false;
        // To prevent from reloading the page if user clicks in "No"
        } else {
            return false;
        }
    }
}

// Check if username exists before login
function checkIfUsernameExists() {
    username = $('#username').val();
    
    user = localStorage.getItem(username);
        
    if (user === null) {
        alert('Utilizador não registado.');
        return false;
    } else {
        $(".form-group").html("<div class='form-group'><label for='password'>Password</label><input type='password' id='pass' class='form-control' placeholder='********' onkeypress='preventWhiteSpaces(event);' required><br><button id='loginBtn' class='btn btn-dark' onclick='return login("+`\"${username}\"`+")' disabled><i class='fas fa-sign-in-alt'></i> Login</button></div>");
        
        // autofocus prop does not work when swapping dom elements
        // So:
        $("#pass").focus();
        enableDisableButton("#pass", "#loginBtn");
    }
}

// To an user login
function login(username) {
    pass = $('#pass').val();
    userInfo = JSON.parse(user);

    if (pass === userInfo['password']) {
        sessionStorage.setItem("currentUser", username);
        location.href = '../index.html';
    } else {
        alert('Password errada. Introduza-a novamente.');
        return false;
    }
}

// Score of the loggedin user
function userScore() {
    currentUserScore = currentUser + "Score";
    playerScore = localStorage.getItem(currentUserScore); 
}

// Load the profile of the admin or of a common user
function profile() {
    $('.avatar').prop('src', userInfo['avatarPath']);
    
    $('#email').val(userInfo['email']);
    
    userScore();
    
    if (playerScore === null) {
        $('#score').val(0);
    } else {
        $('#score').val(localStorage.getItem(currentUser + "Score"));
    }
    
    if (currentUser === "admin" || currentUser === "dsp93") {
        $('#email').prop('readonly', true);
        $('#changeProfile').hide();
    }
    
    checkIfMatchesExist();
    
    // Only show my matches
    let myMatchesArray = matchesArray.filter(match => JSON.parse(match)['playerUsername'] === currentUser);
    
    // If I don't have matches yet, then the table of my matches will be empty. So, hide it
    if (myMatchesArray.length === 0) {
        $('#tableMatchesDiv').css('display', 'none');
    }
    
    // Sort my matches from the one which I had more points (the newest one)
    // to the one which I had less points (the oldest one)
    myMatchesArray.sort((a, b) => JSON.parse(b)['playerScore'] - JSON.parse(a)['playerScore']);
    
    for (let match of myMatchesArray) {
        match = JSON.parse(match);
        $('#tableMatches').append(`<tr><td class=text-right>${match['playerScore']}</td><td>${match['theme']}</td><td>${match['word'].replace(/_/g, ' ')}</td><td class=text-right>${match['time']}</td><td>${match['wasWordGuessed']}</td></tr>`);
    }
}

// Update the profile of a common user
function updateProfile() {
    email = $("#email").val();
    
    getInfoActualUser();
    checkIfAnyUserIsLoggedin();
    
    userInfo['email'] = email;

    localStorage.setItem(currentUser, JSON.stringify(userInfo));
}

// To an user logout
function logout() {
    sessionStorage.removeItem("currentUser");
    location.reload();
}

// Get info about the actual user
function getInfoActualUser() {
    currentUser = sessionStorage.getItem("currentUser");
    user = localStorage.getItem(currentUser);
}

// Check if any user is loggedin
function checkIfAnyUserIsLoggedin() {
    userInfo = {};
    if (user !== null) {
        userInfo = JSON.parse(user);
    }
}

// To change the nav bar according to the type of user loggedin. Used in the index page
function toIndexPage() {
    getInfoActualUser();
    
    if (currentUser !== null) {
        $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-dark bg-dark'><a class='navbar-brand' href='index.html'>Jogo da Forca</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item active'><a class='nav-link' href='index.html'>Página Inicial</a></li><li class='nav-item'><a class='nav-link' href='game.html' id='gameLink'>Jogar</a></li><li class='nav-item'><a class='nav-link' href='stats.html'>Estatísticas</a></li><li class='nav-item'><a class='nav-link' href='profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item'><a class='nav-link' href='rules.html'>Regras</a></li><li class='nav-item'><a class='nav-link' href='help.html'>Ajuda</a></li></ul></div></nav>");
    }
    
    checkIfThemesExist();
    
    if (themes !== null) {
        $("#startGame").addClass("btn-dark");
    } else {
        $("#startGame").addClass("btn-danger");
        $("#startGame").click(function() {
            alert('Primeiro, inicie sessão como administrador e adicione temas para poder começar a jogar.');
        });
        $("#gameLink").addClass("disabled");
        $("#gameLink").prop("href", "#");
        $("#gameLink").css("cursor", "default");
    }
        
    if (currentUser === "admin") {
        $('.content').append("<button style='margin-right: 5px;' class='btn btn-dark' id=addTheme onclick=location='themes/addTheme.html'><i class='fas fa-plus'></i> Adicionar tema</button>");
        $('.content').append("<button class='btn btn-dark' id=addWordToTheme onclick=location='themes/addWordToTheme.html'><i class='fas fa-plus'></i> Adicionar palavra a tema</button>");
    }
    
    if (!("themes" in localStorage)) {
        $('#addWordToTheme').prop("disabled", true);
    }
}

// To change the nav bar according to the type of user loggedin. Used in the help page
function toHelpPage() {
    getInfoActualUser();
    
    if (currentUser !== null) {
        $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-dark bg-dark'><a class='navbar-brand' href='index.html'>Jogo da Forca</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item'><a class='nav-link' href='index.html'>Página Inicial</a></li><li class='nav-item'><a class='nav-link' href='game.html' id='gameLink'>Jogar</a></li><li class='nav-item'><a class='nav-link' href='stats.html'>Estatísticas</a></li><li class='nav-item'><a class='nav-link' href='profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item'><a class='nav-link' href='rules.html'>Regras</a></li><li class='nav-item active'><a class='nav-link' href='help.html'>Ajuda</a></li></ul></div></nav>");
    }
}

// To change the nav bar according to the type of user loggedin. Used in the play page
function toPlayPage() {
    getInfoActualUser();
    
    if (currentUser !== null) {
        $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-dark bg-dark'><a class='navbar-brand' href='index.html'>Jogo da Forca</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item'><a class='nav-link' href='index.html'>Página Inicial</a></li><li class='nav-item active'><a class='nav-link' href='game.html' id='gameLink'>Jogar</a></li><li class='nav-item'><a class='nav-link' href='stats.html'>Estatísticas</a></li><li class='nav-item'><a class='nav-link' href='profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item'><a class='nav-link' href='rules.html'>Regras</a></li><li class='nav-item'><a class='nav-link' href='help.html'>Ajuda</a></li></ul></div></nav>");
    }
    
    checkIfThemesExist();
    
    if (themes === null) {
        location.href = "index.html";
    }
    
    for (const themeForPlayPage of themesArray) {
        $('.themes').append(`<button style='margin-left: 2.5px; margin-right: 2.5px; margin-bottom: 5px;' class='btn' id='${themeForPlayPage}' onclick = game('${themeForPlayPage}')>${themeForPlayPage.replace(/_/g, ' ')}</button>`);
        
        // If the theme has no words, then his button has a different appearance
        if (localStorage.getItem(themeForPlayPage) !== '') {
            $("#"+themeForPlayPage).addClass("btn-dark");
        } else {
            $("#"+themeForPlayPage).addClass("btn-danger");
            $("#"+themeForPlayPage).click(function() {
                alert('Primeiro, inicie sessão como administrador e adicione palavras ao tema.');
            });
        }
    }
}

// To change the nav bar according to the type of user loggedin. Used in the rules page
function toRulesPage() {
    getInfoActualUser();
    
    if (currentUser !== null) {
        $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-dark bg-dark'><a class='navbar-brand' href='index.html'>Jogo da Forca</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item'><a class='nav-link' href='index.html'>Página Inicial</a></li><li class='nav-item'><a class='nav-link' href='game.html' id='gameLink'>Jogar</a></li><li class='nav-item'><a class='nav-link' href='stats.html'>Estatísticas</a></li><li class='nav-item'><a class='nav-link' href='profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item active'><a class='nav-link' href='rules.html'>Regras</a></li><li class='nav-item'><a class='nav-link' href='help.html'>Ajuda</a></li></ul></div></nav>");
    }
}

// Function that creates the "Arriscar" and "Começar novo jogo" buttons,
// including the text box where the player will write a letter
function createTextBoxBtns(theme) {
    $('#arrowBack').on('click', function() { location.reload(); });

    $('#textBoxBtns').html(`<div class='form-group'><label>Digite uma letra</label><input class='form-control' type='text' id='letterBox' placeholder='e' maxlength='1' onpaste='return false;' autocomplete=off autofocus required></div>`);

    enableDisableButton("#letterBox", '#arriscarBtn');

    $("#letterBox").on("keypress", function() {
        return ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || (event.keyCode === 231));
    });

    $("#letterBox").keydown(function() {
      if (event.keyCode === 13) { askLetter(`${theme}`); return false; }
    });
    $('#textBoxBtns').append(`<button style='margin-right: 5px;' class='btn btn-dark' id=arriscarBtn onclick=askLetter('${theme}') disabled>Arriscar</button><button class='btn btn-dark' onclick='location.reload()'>Começar novo jogo</button>`);
    
    $('#listOfUnderscores').html(`<p>${listOfUnderscores.join(' ')}</p>`);
}

// Empty game divs after it's end
function emptyGameDivs() {
    $('#textBoxBtns').empty();
    $('#listOfUnderscores').empty();
    $('#bodyParts').empty();

    // To not show the time counter after the end of the game
    $('#timeCounter').css("display", "none");
    
    // To not show the choosed letters after the end
    $('#choosedLetters').css("display", "none");
};

// Save the matches item in the local storage
function pushMatches(theme) {
    checkIfMatchesExist();
    
    const match = {
        playerUsername: String,
        playerScore: Number,
        theme: String,
        word: String,
        time: String,
        wasWordGuessed: String
    };

    match.playerUsername = currentUser;
    match.playerScore = playerScore;
    match.theme = theme;
    match.word = word;
    match.time = timeInMinSec;
    match.wasWordGuessed = wasWordGuessed;

    matchesArray.push(JSON.stringify(match));
    localStorage.setItem("matches", matchesArray);
}

// Check if the player already guessed, or not, the whole word.
// If he guessed, the text box disappears and a winner's message appears.
// If he not guessed the word yet, then the user is "asked" to enter a letter again.
function checkIfWordWasDiscovered(theme) {
    if (!(listOfUnderscores.indexOf('_') > -1)) {
        emptyGameDivs();
        
        currentUser = sessionStorage.getItem("currentUser");
        
        if (currentUser !== null) {
            userScore();
            
            // Add one point to the player's score
            if (playerScore !== null) {
                playerScore = parseInt(playerScore) + 1;
            // If the player has no score yet, then his score is set to one
            } else {
                playerScore = 1;
            }
            
            $('#textBoxBtns').append(`<p><b>Ganhou 1 ponto!</b></p><p><b>Minha pontuação até agora:</b> ${playerScore} </p><p><b>Palavra:</b> ${word} </p><p><b>Tempo:</b> ${timeInMinSec}</p>`);
            
            localStorage.setItem(currentUserScore, playerScore);
            
            wasWordGuessed = "Sim";
            pushMatches(theme);
        } else {
            // In case user is not loggedin, the message is slightly different
            $('#textBoxBtns').append(`<p><b>Acertou!</b></p><p><b>Palavra:</b> ${word} </p><p><b>Tempo:</b> ${timeInMinSec}</p>`);
        }
        
        $('#textBoxBtns').append("<button class='btn btn-dark' onclick='location.reload()'>Começar novo jogo</button>");
        $('#textBoxBtns').append("<br><br><img src='style/joker_clapping.gif' class='img-fluid' alt='Joker is clapping, because you won!'>");
    } else {
        createTextBoxBtns(theme);
    }
}

// Write the loser's message
function lose(theme) {
    emptyGameDivs();
    
    currentUser = sessionStorage.getItem("currentUser");
        
    if (currentUser !== null) {
        userScore();

        if (playerScore !== null) {
            playerScore = parseInt(playerScore);
        // If the player has no score yet, the his score is set to 0
        } else {
            playerScore = 0;
        }
        
        $('#textBoxBtns').append(`<p><b>Perdeu!</b></p><p><b>Minha pontuação até agora:</b> ${playerScore} </p><p><b>Palavra:</b> ${word} </p><p><b>Tempo:</b> ${timeInMinSec}</p>`);

        wasWordGuessed = "Não";
        pushMatches(theme);
    } else {
        $('#textBoxBtns').append(`<p><b>Perdeu!</b></p><p><b>Palavra:</b> ${word} </p><p><b>Tempo:</b> ${timeInMinSec}</p>`);
    }
    
    $('#textBoxBtns').append("<button class='btn btn-dark' onclick='location.reload()'>Começar novo jogo</button>");
    $('#textBoxBtns').append("<br><br><img src='style/skeleton.gif' class='img-fluid' alt='You lost!'>");
}

// Here, the word is declared and the time starts
function game(theme) {
    // Saves the words of the theme in a list
    const listOfWords = localStorage.getItem(theme).split(',');

    $('h1').html(`Tema: ${theme}`);
    
    if (listOfWords[0] !== "") {
        $('.themes').empty();
    
        // Choose one word randomly
        word = listOfWords[Math.floor(Math.random() * listOfWords.length)].toLowerCase();
        
        [...word].forEach(() => listOfUnderscores.push('_'));

        time = 0;
        // Count time
        setInterval(function () {
            time ++;
            if (time <= 60) {
                timeInMinSec = `${time} s`;
                $('#timeCounter').html(`<b>Tempo:</b> ${timeInMinSec}`);
            } else {
                const minutes = Math.floor(time / 60);
                const seconds = time - minutes * 60;
                timeInMinSec = `${minutes} min e ${seconds} s`;
                $('#timeCounter').html(`<b>Tempo:</b> ${timeInMinSec}`);
            }
        }, 1000);
        
        indexOfAttempt = 0;

        createTextBoxBtns(theme);
        checkIfWordWasDiscovered(theme);
    }
}

// Check how many equal letters exist in the word
// and switch the "underscores" by the letters of the word
function switchUnderscoreByLetter() {
    let i = 0;
    while (i < word.length) {
        if (word[i] === letter) {
            listOfUnderscores.splice(i, 1, letter);
        }
        i++;
    }
}

// Increment attempts counter and check if the word was already discovered
function toAskLetterFunction(theme) {
    indexOfAttempt += 1;
    $('#textBoxBtns').empty();
    checkIfWordWasDiscovered(theme);
}

// Check if the given letter is, in fact, in the word,
// call the function that switches the underscore by a letter,
// and call the function that checks if the player has already guessed all letters.
// If not, a body part appears, and, if the attempts end, a loser's message appears
function askLetter(theme) {
    // Body parts of the gif to be showed during the game
    const bodyParts = [
        "<img src='style/left_leg.gif' alt='left leg hanged'>",
        "<img src='style/legs.gif' alt='legs hanged'>",
        "<img src='style/body_trunk_+_legs.gif' alt='body trunk with legs hanged'>",
        "<img src='style/right_arm_body_trunk_+_legs.gif' alt='body trunk with right arm and with legs hanged'>", "<img src='style/arms_body_trunk_+_legs.gif' alt='almost full body hanged'>"
    ];

    letter = $('#letterBox').val().toLowerCase();
    
    if (letter !== '') {
        $("#choosedLetters").removeAttr("style");
    }
    
    if (word.indexOf(letter) > -1 && !(listOfUnderscores.indexOf(letter) > -1)) {
        switchUnderscoreByLetter();
        $('#listOfUnderscores').html(`<p>${listOfUnderscores.join(' ')}</p>`);
        $('#textBoxBtns').empty();
        checkIfWordWasDiscovered(theme);
    } else {
        if (indexOfAttempt < 5) {
            $('#bodyParts').html(bodyParts[indexOfAttempt]);
            toAskLetterFunction(theme);
        } else {
            lose(theme);
        }
    }
    
    $("#choosedLetters").append(` ${letter}`);
}