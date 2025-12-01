class UIManager {
    constructor(game) {
        this.game = game;
        this.container = null;
        this.gridContainer = null;
        this.gridElement = null;
        this.scoreElement = null;
        this.bestScoreElement = null;
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

        const footer = this.createElement('footer', 'footer');
        const footerText1 = this.createElement('p', '', 'Semyon Shevchenko');
        const footerText2 = this.createElement('p', '', 'tg:@boredot');
        const footerText3 = this.createElement('p', '', '409886@niuitmo.ru');
        footer.appendChild(footerText1);
        footer.appendChild(footerText2);
        footer.appendChild(footerText3);
        document.body.appendChild(footer);

        this.updateDisplay(); 
    }

    updateDisplay() {
        this.updateScore();
        this.updateGrid();
        this.updateBestScore();
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

    updateBestScore() {
        const bestScore = storageManager.getBestScore();
        this.bestScoreElement.textContent = bestScore;
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
        const gameOverModal = new GameOverModal(this.game, this);
    }

    newGame() {
        this.game.reset();
        this.updateDisplay();
    }

    undo() {
        if (this.game.undo()) {
            this.updateDisplay();
        }
    }

    showLeaderboard() {
        const leaderboardModal = new LeaderboardModal(this);
    }
}