document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-snake-app');
    if (!gameContainer) return;

    const canvas = gameContainer.querySelector('#snake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = gameContainer.querySelector('.score');
    const newGameButton = gameContainer.querySelector('.new-game-btn-snake');
    const gameOverModal = gameContainer.querySelector('.snake-modal-overlay');
    const finalScoreElement = gameContainer.querySelector('#final-score-snake');
    const playAgainButton = gameContainer.querySelector('.play-again-btn-snake');

    const gridSize = 20;
    let snake, food, score, direction, gameInterval;

    function initGame() {
        snake = [{ x: 10, y: 10 }];
        food = {};
        score = 0;
        direction = 'right';
        placeFood();
        updateScore();
        hideGameOverModal();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 150);
    }

    function gameLoop() {
        update();
        draw();
    }

    function update() {
        const head = { ...snake[0] };
        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (isGameOver(head)) {
            clearInterval(gameInterval);
            showGameOverModal();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            updateScore();
            placeFood();
        } else {
            snake.pop();
        }
    }

    function draw() {
        ctx.fillStyle = '#e2e8f0'; // bg-gray-300
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = '#4299e1'; // blue-500
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });

        // Draw food
        ctx.fillStyle = '#ed64a6'; // pink-500
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    function placeFood() {
        food.x = Math.floor(Math.random() * (canvas.width / gridSize));
        food.y = Math.floor(Math.random() * (canvas.height / gridSize));
    }

    function updateScore() {
        scoreElement.textContent = score;
    }

    function isGameOver(head) {
        if (head.x < 0 || head.x * gridSize >= canvas.width || head.y < 0 || head.y * gridSize >= canvas.height) {
            return true;
        }
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    }

    function showGameOverModal() {
        finalScoreElement.textContent = score;
        gameOverModal.classList.remove('hidden');
    }

    function hideGameOverModal() {
        gameOverModal.classList.add('hidden');
    }

    document.addEventListener('keydown', (e) => {
        const gameWindow = document.getElementById('game-snake-app');
        if(gameWindow && !gameWindow.classList.contains('hidden') && gameOverModal.classList.contains('hidden')) {
            e.preventDefault();
            switch (e.key) {
                case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
                case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
                case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
                case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
            }
        }
    });

    newGameButton.addEventListener('click', initGame);
    playAgainButton.addEventListener('click', initGame);

    // Initialize when the window is first shown
    const observer = new MutationObserver((mutations) => {
        for(let mutation of mutations) {
            if (mutation.attributeName === 'class' && !gameContainer.classList.contains('hidden')) {
                initGame();
                observer.disconnect(); // Run only once
            }
        }
    });
    observer.observe(gameContainer, { attributes: true });
});