
let state = "tick";

let winningSequences = [[1, 2, 3], [1, 5, 9], [1, 4, 7], [3, 5, 7], [3, 6, 9], [4, 5, 6], [7, 8, 9], [2, 5, 8]];
let player1Sequence = [];
let player2Sequence = [];

const gameTiles = document.querySelectorAll(".game-grid-item");
const player1Side = document.querySelector(".player1-side");
const player2Side = document.querySelector(".player2-side");

var clicks = 0;

clearGame();

var replayBtn = document.querySelector(".btn-replay");
replayBtn.onclick = startGame;

startGame();

function switchSides() {
    if (player1Side.style.opacity == 1) {
        player1Side.style.opacity = 0.5;
        player2Side.style.opacity = 1;

        for (var i = 0; i < gameTiles.length; i++) {
            if (gameTiles[i].hasChildNodes()) {
                if (gameTiles[i].firstChild.classList.contains("tick")) {
                    gameTiles[i].style.setProperty("--tick-opacity", "0.5");
                }
                else {
                    gameTiles[i].style.setProperty("--circle-opacity", "1");
                }
            }
        }
    }
    else {
        player1Side.style.opacity = 1;
        player2Side.style.opacity = 0.5;

        for (var i = 0; i < gameTiles.length; i++) {
            if (gameTiles[i].hasChildNodes()) {
                if (gameTiles[i].firstChild.classList.contains("circle")) {
                    gameTiles[i].style.setProperty("--circle-opacity", "0.5");
                }
                else {
                    gameTiles[i].style.setProperty("--tick-opacity", "1");
                }
            }
        }
    }
}

function checkTie() {
    if (clicks == 9) {
        if (!checkWinCondition(player1Sequence)[0] && !checkWinCondition(player2Sequence)[0]) {
            return true;
        }
    }
    return false;
}

function checkWinCondition(sequence) {
    for (var i = 0; i < winningSequences.length; i++) {
        if (checkIfEqual(winningSequences[i], sequence)) {
            return [true, winningSequences[i]];
        }
    }
    return [false, -1];
}

function checkIfEqual(array1, array2) {
    array1.sort();
    array2.sort();

    if (array2.length < 3) {
        return false;
    }

    for (var i = 0; i < array1.length; i++) {
        if (!array2.includes(array1[i])) {
            return false;
        }
    }
    return true;

}

function clearGame() {
    clicks = 0;

    document.getElementById("winning-line").style.visibility = "hidden";

    var mainH1 = document.getElementById("h1-main");
    mainH1.textContent = "Tic Tac Toe";

    player1Side.style.opacity = 1;
    player2Side.style.opacity = 0.5;

    for (var i = 0; i < gameTiles.length; i++) {
        if (gameTiles[i].hasChildNodes()) {
            gameTiles[i].removeChild(gameTiles[i].firstChild);
        }
    }

    var replayBtn = document.querySelector(".btn-replay");
    replayBtn.style.visibility = "hidden";

    var result1H2 = document.getElementById("result1");
    result1H2.textContent = "";

    var result2H2 = document.getElementById("result2");
    result2H2.textContent = "";

    state = "tick";

    player1Sequence = [];
    player2Sequence = [];
}

function holdGame() {
    for (var i = 0; i < gameTiles.length; i++) {
        gameTiles[i].classList.add("loading");
    }
}

function startGame() {
    clearGame();

    for (var i = 0; i < gameTiles.length; i++) {
        gameTiles[i].classList.remove("loading");

        gameTiles[i].onclick = function (e) {

            var rect = e.target.getBoundingClientRect();
            var left = rect.left;
            var top = rect.top;

            if (!e.target.classList.contains("tick") && !e.target.classList.contains("circle")) {
                if (state == "tick") {
                    var tick = document.createElement("div");
                    tick.classList.add("tick");
                    e.target.appendChild(tick);
                    tick.classList.add("come-in");
                    player1Sequence.push(parseInt(e.target.id));

                    if (checkWinCondition(player1Sequence)[0]) {
                        console.log(checkWinCondition(player1Sequence)[1]);
                        declareWinner(1, checkWinCondition(player1Sequence)[1]);

                        holdGame();
                        return;
                    }

                    state = "circle";
                    clicks++;
                }
                else {
                    var element = e.target;

                    var circle = document.createElement("div");
                    circle.classList.add("circle");
                    element.appendChild(circle);
                    //circle.classList.add("come-in");

                    player2Sequence.push(parseInt(element.id));

                    if (checkWinCondition(player2Sequence)[0]) {
                        console.log(checkWinCondition(player2Sequence)[1]);
                        declareWinner(2, checkWinCondition(player2Sequence)[1]);

                        holdGame();
                        return;
                    }

                    state = "tick";
                    clicks++;
                }
                if (checkTie()) {
                    console.log(checkWinCondition(player1Sequence)[1]);
                    console.log(checkWinCondition(player2Sequence)[1]);
                    declareWinner(0, -1);
                    return;
                }
                switchSides();
            }

        };
    }
}

function declareWinner(player, winningSequence) {
    player1Side.style.opacity = 1;
    player2Side.style.opacity = 1;

    if (player == 0) {
        var mainH1 = document.getElementById("h1-main");
        mainH1.textContent = "It's a Tie!";

        for (var i = 0; i < gameTiles.length; i++) {
            gameTiles[i].style.setProperty("--tick-opacity", "1");
            gameTiles[i].style.setProperty("--circle-opacity", "1");
        }

        replayBtn.style.visibility = "visible";
    }
    else if (player == 1) {
        var resultH2 = document.getElementById("result1");
        resultH2.textContent = "Player 1 WON!";

        for (var i = 0; i < gameTiles.length; i++) {
            gameTiles[i].style.setProperty("--tick-opacity", "1");
            gameTiles[i].style.setProperty("--circle-opacity", "0.5");
        }

        showWinnerLine(winningSequence);

        replayBtn.style.visibility = "visible";
    }
    else if (player == 2) {
        var resultH2 = document.getElementById("result2");
        resultH2.textContent = "Player 2 WON!";

        for (var i = 0; i < gameTiles.length; i++) {
            gameTiles[i].style.setProperty("--tick-opacity", "0.5");
            gameTiles[i].style.setProperty("--circle-opacity", "1");
        }

        showWinnerLine(winningSequence);

        replayBtn.style.visibility = "visible";
    }
}

function showWinnerLine(winningSequence) {

    var line = document.getElementById("winning-line");

    line.style.visibility = "visible";

    if (winningSequence[0] == 3 && winningSequence[1] == 5) {
        var startingElement = document.getElementById(winningSequence[2] + "");
    } else {
        var startingElement = document.getElementById(winningSequence[0] + "");
    }

    var rect = startingElement.getBoundingClientRect();

    var rotationAngle = getRotationAngle(winningSequence);

    line.style.setProperty("--winning-line-rotation-angle", rotationAngle + "deg");

    if (rotationAngle == 90) {
        var left = rect.left - (rect.right - rect.left) + 6;
    } else {
        left = rect.left;
    }

    if (rotationAngle == -45) {
        var y = rect.y - ((rect.right - rect.left) / 2 + 7.5);
    }
    else if (rotationAngle != 0) {
        var y = rect.y + (rect.right - rect.left) + 65;
    }
    else {
        var y = rect.top + (rect.right - rect.left) / 2 - 15;
    }
    line.style.setProperty("--winning-line-left", left + "px");
    line.style.setProperty("--winning-line-top", y + "px");

    var width = (rect.right - rect.left) * 3;
    line.style.setProperty("--winning-line-width", width + "px");
    line.style.setProperty("--winning-line-height", "5px");
}

function getRotationAngle(winningSequence) {
    var diff = 0;
    diff = winningSequence[1] - winningSequence[0];

    switch (diff) {
        case 1:
            return 0;
        case 2:
            return -45;
        case 3:
            return 90;
        case 4:
            return 45;
        default:
            return 0;
    }
}
