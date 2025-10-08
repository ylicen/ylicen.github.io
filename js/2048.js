document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-2048-app');
    if (!gameContainer) return;

    const gridContainer = gameContainer.querySelector('.grid-container');
    const scoreElement = gameContainer.querySelector('.score');
    const newGameButton = gameContainer.querySelector('.new-game-btn');
    const gameOverModal = gameContainer.querySelector('.game-2048-modal-overlay');
    const finalScoreElement = gameContainer.querySelector('#final-score-2048');
    const playAgainButton = gameContainer.querySelector('.play-again-btn-2048');
    let board = [];
    let score = 0;
    const gridSize = 4;

    function initGame() {
        board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
        score = 0;
        updateScore();
        hideGameOverModal();
        addNewTile();
        addNewTile();
        renderBoard();
    }

    function renderBoard() {
        gridContainer.innerHTML = '';
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const tileValue = board[r][c];
                const tile = document.createElement('div');
                tile.className = 'tile';
                if (tileValue > 0) {
                    tile.textContent = tileValue;
                    tile.dataset.value = tileValue;
                }
                gridContainer.appendChild(tile);
            }
        }
    }

    function addNewTile() {
        const emptyTiles = [];
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (board[r][c] === 0) {
                    emptyTiles.push({ r, c });
                }
            }
        }
        if (emptyTiles.length > 0) {
            const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function updateScore() {
        scoreElement.textContent = score;
    }

    function move(direction) {
        let moved = false;
        let tempBoard = JSON.parse(JSON.stringify(board));

        if (direction === 'ArrowUp' || direction === 'ArrowDown') {
            for (let c = 0; c < gridSize; c++) {
                const col = tempBoard.map(row => row[c]);
                const newCol = transformLine(col, direction === 'ArrowUp');
                for (let r = 0; r < gridSize; r++) {
                    if (tempBoard[r][c] !== newCol[r]) moved = true;
                    tempBoard[r][c] = newCol[r];
                }
            }
        } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
            for (let r = 0; r < gridSize; r++) {
                const row = tempBoard[r];
                const newRow = transformLine(row, direction === 'ArrowLeft');
                if (tempBoard[r].join(',') !== newRow.join(',')) moved = true;
                tempBoard[r] = newRow;
            }
        }
        
        if (moved) {
            board = tempBoard;
            addNewTile();
            renderBoard();
            checkGameOver();
        }
    }

    function transformLine(line, toStart) {
        let newLine = line.filter(v => v > 0);
        if (!toStart) newLine.reverse();

        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                score += newLine[i];
                newLine.splice(i + 1, 1);
            }
        }

        while (newLine.length < gridSize) {
            newLine.push(0);
        }

        if (!toStart) newLine.reverse();
        updateScore();
        return newLine;
    }

    function checkGameOver() {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (board[r][c] === 0) return; // Can still move
                if (r < gridSize - 1 && board[r][c] === board[r + 1][c]) return;
                if (c < gridSize - 1 && board[r][c] === board[r][c + 1]) return;
            }
        }
        showGameOverModal();
    }

    function showGameOverModal() {
        finalScoreElement.textContent = score;
        gameOverModal.classList.remove('hidden');
    }

    function hideGameOverModal() {
        gameOverModal.classList.add('hidden');
    }

    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            const gameWindow = document.getElementById('game-2048-app');
            if(gameWindow && !gameWindow.classList.contains('hidden') && gameOverModal.classList.contains('hidden')) {
                e.preventDefault();
                move(e.key);
            }
        }
    });

    newGameButton.addEventListener('click', initGame);
    playAgainButton.addEventListener('click', initGame);

    initGame();
});