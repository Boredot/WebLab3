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
        const scoreLabel = this.createElement('p', '', 'СЧЕТ');
        this.scoreElement = this.createElement('span', '', '0');
        scoreBox.appendChild(scoreLabel);
        scoreBox.appendChild(this.scoreElement);
        scoresContainer.appendChild(scoreBox);

        const bestScoreBox = this.createElement('div', 'score-box');
        const bestScoreLabel = this.createElement('p', '', 'РЕКОРД');
        this.bestScoreElement = this.createElement('span', '', '0');
        bestScoreBox.appendChild(bestScoreLabel);
        bestScoreBox.appendChild(this.bestScoreElement);
        scoresContainer.appendChild(bestScoreBox);

        header.appendChild(scoresContainer);
        this.container.appendChild(header);

        const gameInfo = this.createElement('div', 'game-info');
        
        const controls = this.createElement('div', 'controls');
        const newGameBtn = this.createElement('button', 'btn', 'Новая игра');
        newGameBtn.onclick = () => this.newGame();
        controls.appendChild(newGameBtn);

        const undoBtn = this.createElement('button', 'btn', 'Отменить');
        undoBtn.onclick = () => this.undo();
        controls.appendChild(undoBtn);

        const leaderboardBtn = this.createElement('button', 'btn', 'Рекорды');
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

        this.updateDisplay(); 
    }

    updateDisplay() {
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

}
