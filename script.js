// Tile constructor with coordinates
function Tile(x, y) {
    this.state = "empty";
    this.x = x;
    this.y = y;
}

// Creates a new game board with gameBoardTiles
function createGameBoard(name) {
    let gameBoardTiles = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            gameBoardTiles.push(new Tile(i, j));
        }
    }
    return {
        name: name,
        XScore: 0,
        OScore: 0,
        gameBoardTiles: gameBoardTiles
    };
}

// Creates a new player with a given playerFlag
function createPlayer(playerFlag) {
    return {
        playerFlag: playerFlag,
        score: 0
    };
}

// Updates the gameBoardTile's state if it's empty
function updateTile(board, x, y, playerFlag) {
    let gameBoardTile = board.gameBoardTiles.find(gameBoardTile => gameBoardTile.x === x && gameBoardTile.y === y);
    if (gameBoardTile && gameBoardTile.state === "empty") {
        gameBoardTile.state = playerFlag;
        return true;
    }
    return false;
}

// Checks if the current player has won
function checkWin(board, playerFlag) {
    const winPatterns = [
        // Rows
        [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}],
        [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}],
        // Columns
        [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}],
        [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}],
        [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}],
        // Diagonals
        [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}],
        [{x: 0, y: 2}, {x: 1, y: 1}, {x: 2, y: 0}]
    ];

    return winPatterns.some(pattern =>
        pattern.every(position => {
            let gameBoardTile = board.gameBoardTiles.find(gameBoardTile => gameBoardTile.x === position.x && gameBoardTile.y === position.y);
            return gameBoardTile && gameBoardTile.state === playerFlag;
        })
    );
}

// Checks if the game is a tie
function checkTie(board) {
    return board.gameBoardTiles.every(gameBoardTile => gameBoardTile.state !== "empty");
}

// Logs messages to the console and GUI
function logMessage(message) {
    const logContainer = document.getElementById('logMessages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    logContainer.appendChild(messageElement);
    console.log(message);
}

// Updates the score display
function updateScoreDisplay(playerTwo_flag_One_flag_X, playerTwo_flag_O) {
    document.getElementById('scoreX').textContent = `Player X: ${playerTwo_flag_One_flag_X.score}`;
    document.getElementById('scoreO').textContent = `Player O: ${playerTwo_flag_O.score}`;
}

// Updates the turn display
function updateTurnDisplay(currentPlayer) {
    document.getElementById('turnDisplay').textContent = currentPlayer.playerFlag;
}

// Toggles between light and dark mode
function toggleMode() {
    document.body.classList.toggle('light-mode');
}

// Main game loop, sets up the game and event listeners
function gameLoop() {
    let playerTwo_flag_One_flag_X = createPlayer("X");
    let playerTwo_flag_O = createPlayer("O");
    let board = createGameBoard("Board");
   

    let currentPlayer = playerTwo_flag_One_flag_X;
    let loop = true;

    updateScoreDisplay(playerTwo_flag_One_flag_X, playerTwo_flag_O);
    updateTurnDisplay(currentPlayer);

    document.querySelectorAll('.box').forEach((box, index) => {
        box.addEventListener('click', () => {
            if (loop) {
                let x = Math.floor(index / 3);
                let y = index % 3;

                if (updateTile(board, x, y, currentPlayer.playerFlag)) {
                    box.textContent = currentPlayer.playerFlag;
                    logMessage(`Player ${currentPlayer.playerFlag} placed on (${x}, ${y})`);

                    if (checkWin(board, currentPlayer.playerFlag)) {
                        logMessage(`${currentPlayer.playerFlag} wins!`);
                        currentPlayer.score++;
                        updateScoreDisplay(playerTwo_flag_One_flag_X, playerTwo_flag_O);
                        resetGame();
                        loop = false;
                    } else if (checkTie(board)) {
                        logMessage('It\'s a tie!');
                        resetGame();
                        loop = false;
                    } else {
                        currentPlayer = currentPlayer === playerTwo_flag_One_flag_X ? playerTwo_flag_O : playerTwo_flag_One_flag_X;
                        updateTurnDisplay(currentPlayer);
                    }
                } else {
                    logMessage(`Tile at (${x}, ${y}) is already taken.`);
                }
            }
        });
    });

    // Simulate a game loop with setInterval
    setInterval(() => {
        if (!loop) {
            resetGame();
            loop = true;
        }
    }, 500);

    // Resets the game for a new round
    function resetGame() {
        board = createGameBoard("Board");
        currentPlayer = playerTwo_flag_One_flag_X;
        document.querySelectorAll('.box').forEach(box => box.textContent = '');
        document.getElementById('logMessages').textContent = '';
        updateTurnDisplay(currentPlayer);
    }
}

// Correct the event listener for the start button

document.getElementById('startButton').addEventListener('click', gameLoop);
document.getElementById('toggleModeButton').addEventListener('click', toggleMode);