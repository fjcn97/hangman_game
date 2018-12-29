"use strict";

//Variables used in more than one function
let i, indexOfAttempt, word, time, letter, currentUser, pass, passConf, name, username, user, userArray, newData, currentUserScore, playerScore, matches, matchesArray, matchValuesArray, theme, themes, themesArray, themeArray;

let listOfUnderscores = [];

//Body parts of the gif to be showed during the game
let bodyParts = ["<img src='style/left_leg.gif' alt='left leg hanged'>", "<img src='style/legs.gif' alt='legs hanged'>", "<img src='style/body_trunk_+_legs.gif' alt='body trunk with legs hanged'>", "<img src='style/right_arm_body_trunk_+_legs.gif' alt='body trunk with right arm and with legs hanged'>", "<img src='style/arms_body_trunk_+_legs.gif' alt='almost full body hanged'>"];

if (localStorage.getItem("adminScore") === null) {
    localStorage.setItem("adminScore", 0);
}

if (localStorage.getItem("dsp93Score") === null) {
    localStorage.setItem("dsp93Score", 0);
}

//To insert the admin and a common user
function pushToArray(name, email, username, avatarPath) {
    let array = [];
    
    array.push("Test97..");
    array.push(name);
    array.push(email);
    array.push(avatarPath);
    
    localStorage.setItem(username, array);
}

//Insert admin
pushToArray("Gonçalo Morais Simões", "admin@jogodaforca.com", "admin", "style/eyes_moving.gif");

//Insert a common user
pushToArray("Daniel Silva Pereira", "dsp@gmail.com", "dsp93", "style/monster_face.jpg");

//Verify if the item "themes" exists in the local storage
function verifyIfThemesExist() {
    themes = localStorage.getItem("themes");
    
    if (themes === null) {
        themesArray = [];
    } else {
        themesArray = themes.split(',');
    }
}

//To disable the link "Jogar" when themes don't exist yet
verifyIfThemesExist();

if (themes === null) {
    $("#gameLink").addClass("disabled");
    $("#gameLink").prop("href", "#");
    $("#gameLink").css("cursor", "default");
}

//The admin is the only one that can add themes to the game
function addTheme() {
    theme = $('#theme').val();
    
    if ($.trim(theme) === '') {
        alert("Introduza o tema.");
        return false;
    }
    
    verifyIfThemesExist();
    
    theme = theme.replace(/ /g, '_');
    
    //To prevent from adding themes already in the local storage
    if (themesArray.includes(theme)) {
        alert("Já inseriu esse tema anteriormente.");
        return false;
    } else {
        themesArray.push(theme);
        localStorage.setItem("themes", themesArray);
        localStorage.setItem(theme, []);
    }
}

//To load the current themes
function loadThemes() {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    verifyIfThemesExist();
    
    //Verify if themes exist
    if (!("themes" in localStorage)) {
        alert("Primeiro, tem de adicionar temas.");
        window.location.href = "../index.html";
    }
    
    for (i = 0; i < themesArray.length; i++) {
        if (localStorage.getItem(themesArray[i]) !== null) {
            $('#themes').append(`<option value=${themesArray[i]}>${themesArray[i].replace(/_/g, ' ')}</option>`);
        }
    }
}

//To the admin add a word to a theme
function addWordToTheme() {
    word = $('#word').val();
    
    if ($.trim(word) === '') {
        alert("Introduza a palavra.");
        return false;
    }
    
    if ($.trim(word) !== '' && word.length < 3) {
        alert("Insira uma palavra com 3 ou + caracteres.");
        return false;
    }
    
    let themeValue = $('#themes').val();
    theme = localStorage.getItem(themeValue);
    
    if (theme === '') {
        themeArray = [];
    } else {
        themeArray = theme.split(',');
    }
    
    //To prevent from adding words already in the local storage
    if (themeArray.includes(word)) {
        alert("Já inseriu essa palavra.");
        return false;
    }

    themeArray.push(word);
    
    localStorage.setItem(themeValue, themeArray);
    
    //To not reload the page
    return false;
}

// Get the video
let video = document.getElementById("myVideo");

// Get the button
let btn = document.getElementById("myBtn");

// Pause and play the video, and change the button text
function myFunction() {
    if (video.paused) {
        video.play();
        btn.innerHTML = "<i class='fas fa-pause'></i> Pausar";
    } else {
        video.pause();
        btn.innerHTML = "<i class='fas fa-play'></i> Play";
    }
}

//Alert a loggedin user that is already registered
function checkRegister() {
    currentUser = sessionStorage.getItem("currentUser");
    
    if (currentUser !== null) {
        alert("Já se encontra registado.");
        window.location.href = '../index.html';
    }
}

//Write in the login page the initial account's info
function writeUsersInfo() {
    $('#usersInfo').html(`<p><b>admin:</b> ${localStorage.getItem("admin").split(',')[0]}</p><p><b>dsp93:</b> ${localStorage.getItem("dsp93").split(',')[0]}</p>`);
}

//Redirect a loggedin user to the index page
function checkLogin() {
    currentUser = sessionStorage.getItem("currentUser");
    
    if (currentUser !== null) {
        window.location.href = '../index.html';
    }
}

//Verify if the item "matches" exist or that's not empty
function verifyIfMatchesExist() {
    matches = localStorage.getItem("matches");
    
    if (matches === null || matches === '') {
        matchesArray = [];
    } else {
        matchesArray = matches.split(',');
    }
}

//To filter info from the matches item and to sort the array of stats
function toStatsTables(array, position) {
    for ( i = 0; i < matchesArray.length; i++ ) {
        array.push(matchesArray[i].split(' ')[position]);
    }
    
    array.sort();
}

//Append stats to the corresponding tables
function appendToStatsTables(tableTop, topArray, col1, col2) {
    for (i = 0; i < topArray.length; i++) {
        $(`#${tableTop}`).append(`<tr><td>${topArray[i][col1]}</td><td class=text-right>${topArray[i][col2]}</td></tr>`);
    }
}

//To the stats page
function toStatsPage() {
    currentUser = sessionStorage.getItem("currentUser");
    
    if (currentUser === null) {
        window.location.href = 'auth/login.html';
    }
    
    verifyIfMatchesExist();
    
    //If matches don't exist yet, then the stats tables are empty. So, don't show them
    if (matches === null || matches === '') {
        $('#tableTopThemesHeader').css('display', 'none');
        $('#tableTopWordsHeader').css('display', 'none');
    }
    
    let topPlayers, topPlayersArray = [];
    
    for (let item in localStorage) {
        if (item.endsWith('Score')) {
            topPlayers = {'player':item.replace('Score', ''), 'score':localStorage.getItem(item)};
            topPlayersArray.push(topPlayers);
        }
    }
    
    //Sort from the player with the most points to the player that has the fewest points
    topPlayersArray.sort((a, b) => b.score - a.score);
    
    appendToStatsTables("tableTopPlayers", topPlayersArray, 'player', 'score');
    
    themesArray = [], themes = [];
    let nTimesThemeOccurred = [], prev;
    
    toStatsTables(themesArray, 2);
    
    for ( i = 0; i < themesArray.length; i++ ) {
        if ( themesArray[i] !== prev ) {
            themes.push(themesArray[i]);
            nTimesThemeOccurred.push(1);
        } else {
            nTimesThemeOccurred[nTimesThemeOccurred.length-1]++;
        }
        prev = themesArray[i];
    }
    
    let topThemesArray = $.map(themes, function(v, i) {
      return [{'theme':v, 'nTimes':nTimesThemeOccurred[i]}];
    });
    
    //Sort from the theme that occurred more times to the one that occurred less times 
    topThemesArray.sort((a, b) => b.nTimes - a.nTimes);

    appendToStatsTables("tableTopThemes", topThemesArray, 'theme', 'nTimes');
    
    let wordsArray = [], words = [], nTimesWordOccurred = [];
    
    toStatsTables(wordsArray, 3);
    
    for ( i = 0; i < wordsArray.length; i++ ) {
        if ( wordsArray[i] !== prev ) {
            words.push(wordsArray[i]);
            nTimesWordOccurred.push(1);
        } else {
            nTimesWordOccurred[nTimesWordOccurred.length-1]++;
        }
        prev = wordsArray[i];
    }
    
    let topWordsArray = $.map(words, function(v, i) {
      return [{'word':v, 'nTimes':nTimesWordOccurred[i]}];
    });
    
    //Sort from the word that people tried to guess more times to the one people tried to guess less times
    topWordsArray.sort((a, b) => b.nTimes - a.nTimes);

    appendToStatsTables("tableTopWords", topWordsArray, 'word', 'nTimes');
}

//Get these values from the inputs of a form
function getPassNameValues() {
    pass = $("#pass").val();
    passConf = $("#passConf").val();
    name = $("#name").val();
}

//To register a common user
function register() {
    getPassNameValues();
    username = $("#username").val();
    
    if (username in localStorage) {
        alert("Este utilizador já existe. Escolha outro nome de utilizador.");
        return false;
    } else if (pass !== passConf) {
        alert("As passwords não combinam.");
        return false;
    } else if ($.trim(name) === '') {
        alert("Introduza o nome completo.");
        return false;
    } else {
        if (confirm("Pretende submeter?")) {
            userArray = [];
            
            let email = $("#email").val();
            let avatar = $("input[name=avatar]:checked").val();
            
            userArray.push(pass);
            userArray.push(name);
            userArray.push(email);
            
            if (typeof avatar !== 'undefined') {
                userArray.push(avatar);
            } else {
                userArray.push("null");
            }
            
            localStorage.setItem(username, userArray);
            window.location.href = 'login.html';
        } else {
            return false;
        }
    }
}

//To the admin or a common user login
function login() {
    username = $('#username').val();
    pass = $('#pass').val();
    
    user = localStorage.getItem(username);
        
    if (user === null) {
        alert('Utilizador não registado.');
        return false;
    } else {
        userArray = user.split(",");

        if (pass === userArray[0]) {
            sessionStorage.setItem("currentUser", username);
            window.location.href = '../index.html';
        } else {
            alert('Password errada. Introduza-a novamente.');
            return false;
        }
    }
}

//Score of the loggedin user
function userScore() {
    currentUserScore = currentUser + "Score";
    playerScore = localStorage.getItem(currentUserScore); 
}

//Load the profile of the admin or of a common user
function profile() {
    if (userArray[3] !== 'null') {
        $('.avatar').prop('src', userArray[3]);
    } else {
        $('.avatarDiv').html("Sem avatar");
    }
    
    $('#email').val(userArray[2]);
    
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
    
    verifyIfMatchesExist();
    
    //Only show my matches
    let myMatchesArray = matchesArray.filter(match => match.startsWith(currentUser));
    
    //If I don't have matches yet, then the table of my matches will be empty. So, hide it.
    if (myMatchesArray.length === 0) {
        $('#tableMatchesHeader').css('display', 'none');
    }
    
    //Sort my matches from the newest to the oldest
    myMatchesArray.sort((a, b) => b.split(' ')[1] - a.split(' ')[1]);
    
    for (i = 0; i < myMatchesArray.length; i++) {
        matchValuesArray = myMatchesArray[i].split(' ');
        $('#tableMatches').append(`<tr><td class=text-right>${matchValuesArray[1]}</td><td>${matchValuesArray[2]}</td><td>${matchValuesArray[3].replace(/_/g, ' ')}</td><td class=text-right>${matchValuesArray[4]}</td></tr>`);
    }
}

//Update the profile of the admin or of a common user
function updateProfile() {
    newData = [];
    
    newData.push($("#email").val());
    
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    userArray[2] = newData[0];

    localStorage.setItem(currentUser, userArray);
}

//To an user logout
function logout() {
    sessionStorage.removeItem("currentUser");
    
    window.location.reload();
}

//Get info about the actual user
function getInfoActualUser() {
    currentUser = sessionStorage.getItem("currentUser");
    user = localStorage.getItem(currentUser);
}

//Verify if any user is loggedin
function verifyIfAnyUserIsLoggedin() {
    if (user === null) {
        userArray = [];
    } else {
        userArray = user.split(',');
    }
}

//Verify if the loggedin user is the admin. If not, then he's not allowed to view the page. So, this function leaves, automatically, that page and redirects to the initial page
function checkIfItIsAdmin() {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    if (currentUser !== "admin") {
        window.location.href = 'index.html';
    }
}

//To change the nav bar according to the type of user loggedin. Used in the index page
function toIndexPage() {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    if (currentUser !== null) {
        $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-dark bg-dark'><a class='navbar-brand' href='index.html'>Jogo da Forca</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item active'><a class='nav-link' href='index.html'>Página Inicial</a></li><li class='nav-item'><a class='nav-link' href='game.html' id='gameLink'>Jogar</a></li><li class='nav-item'><a class='nav-link' href='stats.html'>Estatísticas</a></li><li class='nav-item'><a class='nav-link' href='profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item'><a class='nav-link' href='rules.html'>Regras</a></li><li class='nav-item'><a class='nav-link' href='help.html'>Ajuda</a></li></ul></div></nav>");
    }
    
    verifyIfThemesExist();
    
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
        $('.content').append("<button class = 'btn btn-dark' id = addTheme onclick=window.location='themes/addTheme.html'><i class='fas fa-plus'></i> Adicionar tema</button>");
        $('.content').append("<button class = 'btn btn-dark' id = addWordToTheme onclick=window.location='themes/addWordToTheme.html'><i class='fas fa-plus'></i> Adicionar palavra a tema</button>");
    }
    
    if (!("themes" in localStorage)) {
        $('#addWordToTheme').prop("disabled", true);
    }
}

//To change the nav bar according to the type of user loggedin. Used in the help page
function toHelpPage() {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    if (currentUser !== null) {
        $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-dark bg-dark'><a class='navbar-brand' href='index.html'>Jogo da Forca</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item'><a class='nav-link' href='index.html'>Página Inicial</a></li><li class='nav-item'><a class='nav-link' href='game.html' id='gameLink'>Jogar</a></li><li class='nav-item'><a class='nav-link' href='stats.html'>Estatísticas</a></li><li class='nav-item'><a class='nav-link' href='profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item'><a class='nav-link' href='rules.html'>Regras</a></li><li class='nav-item active'><a class='nav-link' href='help.html'>Ajuda</a></li></ul></div></nav>");
    }
}

//To change the nav bar according to the type of user loggedin. Used in the play page
function toPlayPage() {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    if (currentUser !== null) {
        $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-dark bg-dark'><a class='navbar-brand' href='index.html'>Jogo da Forca</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item'><a class='nav-link' href='index.html'>Página Inicial</a></li><li class='nav-item active'><a class='nav-link' href='game.html' id='gameLink'>Jogar</a></li><li class='nav-item'><a class='nav-link' href='stats.html'>Estatísticas</a></li><li class='nav-item'><a class='nav-link' href='profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item'><a class='nav-link' href='rules.html'>Regras</a></li><li class='nav-item'><a class='nav-link' href='help.html'>Ajuda</a></li></ul></div></nav>");
    }
    
    verifyIfThemesExist();
    
    if (themes === null) {
        window.location.href = "index.html";
    }
    
    for (i = 0; i < themesArray.length; i++) {
        $('.themes').append(`<button class='btn' id='${themesArray[i]}' onclick = game('${themesArray[i]}')>${themesArray[i].replace(/_/g, ' ')}</button>`);
        
        //If the theme has no words, then his button change appearance
        if (localStorage.getItem(themesArray[i]) !== '') {
            $("#"+themesArray[i]).addClass("btn-dark");
        } else {
            $("#"+themesArray[i]).addClass("btn-danger");
            $("#"+themesArray[i]).click(function() {
                alert('Primeiro, inicie sessão como administrador e adicione palavras ao tema.');
            });
        }
    }
}

//To change the nav bar according to the type of user loggedin. Used in the rules page
function toRulesPage() {
    getInfoActualUser();
    verifyIfAnyUserIsLoggedin();
    
    if (currentUser !== null) {
        $('#changeNav').html("<nav class='navbar navbar-expand-lg navbar-dark bg-dark'><a class='navbar-brand' href='index.html'>Jogo da Forca</a><button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'><span class='navbar-toggler-icon'></span></button><div class='collapse navbar-collapse' id='navbarSupportedContent'><ul class='navbar-nav mr-auto'><li class='nav-item'><a class='nav-link' href='index.html'>Página Inicial</a></li><li class='nav-item'><a class='nav-link' href='game.html' id='gameLink'>Jogar</a></li><li class='nav-item'><a class='nav-link' href='stats.html'>Estatísticas</a></li><li class='nav-item'><a class='nav-link' href='profile.html'>Perfil</a></li><li class='nav-item'><a class='nav-link text-danger' style='cursor: pointer' onclick='logout();'>Logout</a></li><li class='nav-item active'><a class='nav-link' href='rules.html'>Regras</a></li><li class='nav-item'><a class='nav-link' href='help.html'>Ajuda</a></li></ul></div></nav>");
    }
}

//Function that creates the "Arriscar" and "Reiniciar" buttons, including the text box where the player will write a letter
function createTextBoxBtns(theme) {
    $('#textBoxBtns').empty();
    $('#textBoxBtns').append("<div class='form-group'><label>Digite uma letra</label><input class = 'form-control' type = 'text' id = 'letterBox' placeholder = 'e' maxlength = '1' onkeypress='return ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || (event.keyCode === 231))' onpaste='return false;' autocomplete=off required></div>");
    $( "#letterBox" ).keydown(function() {
      if (event.keyCode === 13) { askLetter(`${theme}`); return false; }
    });
    $('#textBoxBtns').append(`<button class='btn btn-dark' onclick=askLetter('${theme}')>Arriscar</button><button class='btn btn-dark' onclick='location.reload()'>Reiniciar</button>`);
    
    $('#listOfUnderscores').html(`<p>${listOfUnderscores.join(' ')}</p>`);
}

//Empty game divs after it's end
function emptyGameDivs() {
    $('#textBoxBtns').empty();
    $('#listOfUnderscores').empty();
    $('#bodyParts').empty();

    //To not show the time counter after the end of the game
    $('#timeCounter').css("display", "none");
    
    //To not show the choosed letters after the end
    $('#choosedLetters').css("display", "none");
};

//Create the matches item in the local storage
function pushMatches(theme) {
    verifyIfMatchesExist();

    matchesArray.push(`${currentUser} ${playerScore} ${theme} ${word} ${time}`);
    localStorage.setItem("matches", matchesArray);
}

//Verify if the player already guessed, or not, the whole word. If he has guessed, the text box disappears and a winner's message appears. If he not guessed the word yet, then the user is "asked" to enter a letter again
function verifyIfWordWasDiscovered(theme) {
    if (!(listOfUnderscores.indexOf('_') > -1)) {
        emptyGameDivs();
        
        currentUser = sessionStorage.getItem("currentUser");
        
        if (currentUser !== null) {
            userScore();
            
            //Add one point to the player's score
            if (playerScore !== null) {
                playerScore = parseInt(playerScore) + 1;
            //If the player has no score yet, then his score is set to one
            } else {
                playerScore = 1;
            }
            
            $('#textBoxBtns').append(`<p><b>Ganhou 1 ponto!</b></p><p><b>Minha pontuação até agora:</b> ${playerScore} </p><p><b>Palavra:</b> ${word} </p><p><b>Tempo:</b> ${time} s</p>`);
            
            localStorage.setItem(currentUserScore, playerScore);
            
            pushMatches(theme);
        } else {
            $('#textBoxBtns').append(`<p><b>Acertou!</b></p><p><b>Palavra:</b> ${word} </p><p><b>Tempo:</b> ${time} s</p>`);
        }
        
        $('#textBoxBtns').append("<button class='btn btn-dark' onclick='location.reload()'>Reiniciar</button>");
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
        //If the player has no score yet, the his score is set to 0
        } else {
            playerScore = 0;
        }
        
        $('#textBoxBtns').append(`<p><b>Perdeu!</b></p><p><b>Minha pontuação até agora:</b> ${playerScore} </p><p><b>Palavra:</b> ${word} </p><p><b>Tempo:</b> ${time} s</p>`);

        pushMatches(theme);
    } else {
        $('#textBoxBtns').append(`<p><b>Perdeu!</b></p><p><b>Palavra:</b> ${word} </p><p><b>Tempo:</b> ${time} s</p>`);
    }
    
    $('#textBoxBtns').append("<button class='btn btn-dark' onclick='location.reload()'>Reiniciar</button>");
    
    $('#textBoxBtns').append("<br><br><img src='style/skeleton.gif' class='img-fluid' alt='You losed!'>");
}

//Here, the word is declared and the time starts
function game(theme) {
    //Saves in a list the words of the theme
    let listOfWords = localStorage.getItem(theme).split(',');
    
    $('h1').html(`Tema: ${theme}`);
    
    if (listOfWords[0] !== "") {
        $('.themes').empty();
    
        //Choose one word randomly
        word = listOfWords[Math.floor(Math.random() * listOfWords.length)].toLowerCase();

        for (i = 0; i < word.length; i ++) {
            if (word[i] === ' ') {
                listOfUnderscores.push(' ');
            } else {
                listOfUnderscores.push('_');
            }
        }

        time = 0;
        //Count time
        setInterval(function () {
            time ++;
            $('#timeCounter').html(`<b>Tempo:</b> ${time} s`);
        }, 1000);
        
        indexOfAttempt = 0;

        createTextBoxBtns(theme);
        verifyIfWordWasDiscovered(theme);
    }
}

//Verify how many equal letters exist in the word and switch the "underscores" by the letters of the word
function switchUnderscoreByLetter() {
    i = 0;
    while (i < word.length) {
        if (word[i] === letter) {
            listOfUnderscores.splice(i, 1, letter);
        }
        i ++;
    }
}

//Increment attempts counter and verify if the word was already discovered
function toAskLetterFunction(theme) {
    indexOfAttempt += 1;
    $('#textBoxBtns').empty();
    verifyIfWordWasDiscovered(theme);
}

//Verify if the given letter is, in fact, in the word, call the function that switches the underscore by a letter, and call the function that verifies if the player has already guessed all letters. If not, a body part appears, and, if the attempts ended, a loser's message appears
function askLetter(theme) {
    letter = $('#letterBox').val().toLowerCase();
    
    if (letter !== '') {
        $("#choosedLetters").removeAttr("style");
    }
    
    if (word.indexOf(letter) > -1 && !(listOfUnderscores.indexOf(letter) > -1)) {
        switchUnderscoreByLetter();
        $('#listOfUnderscores').html(`<p>${listOfUnderscores.join(' ')}</p>`);
        $('#textBoxBtns').empty();
        verifyIfWordWasDiscovered(theme);
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