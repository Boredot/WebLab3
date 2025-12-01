class UIManager {
    constructor(game) {
        this.game = game;
        this.container = null;
        this.gridContainer = null;
        this.gridElement = null;
        this.scoreElement = null;
        this.bestScoreElement = null;
        this.gameOverModal = null;
        this.createUI();
        this.setupEventListeners();
    }

    createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    }

    createUI() {
        this.container = this.createElement('div', 'game-container');
        document.body.appendChild(this.container);

        const header = this.createElement('div', 'header');
        const title = this.createElement('h1', '', '2048');
        header.appendChild(title);

        const scoresContainer = this.createElement('div', 'scores-container');
        
        const scoreBox = this.createElement('div', 'score-box');
        const scoreLabel = this.createElement('p', '', 'SCORE');
        this.scoreElement = this.createElement('span', '', '0');
        scoreBox.appendChild(scoreLabel);
        scoreBox.appendChild(this.scoreElement);
        scoresContainer.appendChild(scoreBox);

        const bestScoreBox = this.createElement('div', 'score-box');
        const bestScoreLabel = this.createElement('p', '', 'HIGH SCORE');
        this.bestScoreElement = this.createElement('span', '', '0');
        bestScoreBox.appendChild(bestScoreLabel);
        bestScoreBox.appendChild(this.bestScoreElement);
        scoresContainer.appendChild(bestScoreBox);

        header.appendChild(scoresContainer);
        this.container.appendChild(header);

        const gameInfo = this.createElement('div', 'game-info');
        
        const controls = this.createElement('div', 'controls');
        const newGameBtn = this.createElement('button', 'btn', 'New Game');
        newGameBtn.onclick = () => this.newGame();
        controls.appendChild(newGameBtn);

        const undoBtn = this.createElement('button', 'btn', 'Undo Move');
        undoBtn.onclick = () => this.undo();
        controls.appendChild(undoBtn);

        const leaderboardBtn = this.createElement('button', 'btn', 'High Scores');
        leaderboardBtn.onclick = () => this.showLeaderboard();
        controls.appendChild(leaderboardBtn);

        gameInfo.appendChild(controls);
        this.container.appendChild(gameInfo);

        this.gridContainer = this.createElement('div', 'grid-container');
        this.gridElement = this.createElement('div', 'grid');
        
        for (let i = 0; i < 16; i++) {
            const cell = this.createElement('div', 'grid-cell');
            this.gridElement.appendChild(cell);
        }
        
        this.gridContainer.appendChild(this.gridElement);
        this.container.appendChild(this.gridContainer);

         this.gameOverModal = this.createElement('div', 'game-over-modal');
        const gameOverContent = this.createElement('div', 'modal-content');
        
        const gameOverTitle = this.createElement('h2', '', 'Game over!');
        gameOverContent.appendChild(gameOverTitle);

        const gameOverMessage = this.createElement('p', 'message', 'Score: ' + this.game.score);
        gameOverContent.appendChild(gameOverMessage);

        const inputGroup = this.createElement('div', 'input-group');
        const nameInput = this.createElement('input', 'name-input', '');
        nameInput.type = 'text';
        nameInput.placeholder = 'Input your username';
        inputGroup.appendChild(nameInput);
        gameOverContent.appendChild(inputGroup);

        const restartBtn = this.createElement('button', 'btn', 'New game');
        restartBtn.onclick = () => {
            this.gameOverModal.style.display = 'none';
            this.newGame();
        };
        gameOverContent.appendChild(restartBtn);

        this.gameOverModal.appendChild(gameOverContent);
        document.body.appendChild(this.gameOverModal);

        this.updateDisplay(); 
    }

    updateDisplay() {
        this.updateScore();
        this.updateGrid();
    }

    updateGrid() {
        const existingTiles = this.gridElement.querySelectorAll('.tile');
        existingTiles.forEach(tile => tile.remove());

        for (let i = 0; i < this.game.size; i++) {
            for (let j = 0; j < this.game.size; j++) {
                const value = this.game.grid[i][j];
                if (value !== 0) {
                    const tile = this.createElement('div', `tile tile-${value}`, value.toString());
                    
                    tile.style.gridColumn = j + 1;
                    tile.style.gridRow = i + 1;
                    this.gridElement.appendChild(tile);
                }
            }
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.game.score;
    }

    move(direction) {
        const moved = this.game.move(direction);
        if (moved) {
            this.updateDisplay();
            if (this.game.gameOver) {
                this.showGameOver();
            }
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.game.gameOver) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.move('left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.move('right');
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.move('up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.move('down');
                    break;
            }
        });
    }

    showGameOver() {
        const gameOverContent = this.gameOverModal.querySelector('.modal-content');
        const message = gameOverContent.querySelector('.message');
        message.textContent = `Game over! Score: ${this.game.score}`;
        message.style.display = 'block';
        
        const inputGroup = gameOverContent.querySelector('.input-group');
        inputGroup.style.display = 'block';
        this.gameOverModal.style.display = 'flex';
    }

    newGame() {
        this.game.reset();
        this.updateDisplay();
        this.gameOverModal.style.display = 'none';
    }

    undo() {
        if (this.game.undo()) {
            this.updateDisplay();
        }
    }
}
