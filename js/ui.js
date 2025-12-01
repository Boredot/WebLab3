class UIManager {
    constructor(game) {
        this.game = game;
        this.container = null;
        this.gridContainer = null;
        this.gridElement = null;
        this.scoreElement = null;
        this.bestScoreElement = null;
        this.gameOverModal = null;
        this.leaderboardModal = null;
        this.leaderboardTable = null;
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

        const saveBtn = this.createElement('button', 'btn', 'Сохранить результат');
        saveBtn.onclick = () => this.saveScore(nameInput.value);
        gameOverContent.appendChild(saveBtn);

        const restartBtn = this.createElement('button', 'btn', 'New game');
        restartBtn.onclick = () => {
            this.gameOverModal.style.display = 'none';
            this.newGame();
        };
        gameOverContent.appendChild(restartBtn);

        this.gameOverModal.appendChild(gameOverContent);
        document.body.appendChild(this.gameOverModal);

        this.leaderboardModal = this.createElement('div', 'leaderboard-modal');
        const leaderboardContent = this.createElement('div', 'modal-content');
        
        const leaderboardTitle = this.createElement('h2', '', 'Leaderboard');
        leaderboardContent.appendChild(leaderboardTitle);

        this.leaderboardTable = this.createElement('div', 'leaderboard-table');
        leaderboardContent.appendChild(this.leaderboardTable);

        const closeBtn = this.createElement('button', 'btn', 'Close');
        closeBtn.onclick = () => this.leaderboardModal.style.display = 'none';
        leaderboardContent.appendChild(closeBtn);

        this.leaderboardModal.appendChild(leaderboardContent);
        document.body.appendChild(this.leaderboardModal);

        this.updateDisplay();

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
        const gameOverContent = this.gameOverModal.querySelector('.modal-content');
        const message = gameOverContent.querySelector('.message');
        message.textContent = `Game over! Score: ${this.game.score}`;
        message.style.display = 'block';
        
        const inputGroup = gameOverContent.querySelector('.input-group');
        inputGroup.style.display = 'block';

        const saveBtn = gameOverContent.querySelector('button[onclick*="saveScore"]');
        saveBtn.style.display = 'inline-block';

        this.gameOverModal.style.display = 'flex';
    }

    saveScore(name) {
        if (name.trim()) {
            storageManager.saveScore(name, this.game.score);
            
            const gameOverContent = this.gameOverModal.querySelector('.modal-content');
            const message = gameOverContent.querySelector('.message');
            message.textContent = 'Ваш рекорд сохранен!';
            
            const inputGroup = gameOverContent.querySelector('.input-group');
            inputGroup.style.display = 'none';
            
            const saveBtn = gameOverContent.querySelector('button[onclick*="saveScore"]');
            saveBtn.style.display = 'none';
            
            this.updateBestScore();
        }
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

    showLeaderboard() {
        const leaderboard = storageManager.getLeaderboard();
        this.updateLeaderboardTable(leaderboard);
        this.leaderboardModal.style.display = 'flex';
    }

    updateLeaderboardTable(leaderboard) {
        this.leaderboardTable.innerHTML = '';
        
        if (leaderboard.length === 0) {
            const noRecords = this.createElement('p', '', 'No records yet');
            this.leaderboardTable.appendChild(noRecords);
            return;
        }

        const table = this.createElement('table', 'leaderboard');
        const headerRow = this.createElement('tr', '');
        
        const positionHeader = this.createElement('th', '', '#');
        const nameHeader = this.createElement('th', '', 'Name');
        const scoreHeader = this.createElement('th', '', 'Score');
        const dateHeader = this.createElement('th', '', 'Date');
        
        headerRow.appendChild(positionHeader);
        headerRow.appendChild(nameHeader);
        headerRow.appendChild(scoreHeader);
        headerRow.appendChild(dateHeader);
        table.appendChild(headerRow);

        leaderboard.forEach((record, index) => {
            const row = this.createElement('tr', '');

            const positionCell = this.createElement('td', '', (index + 1).toString());
            const nameCell = this.createElement('td', '', record.name);
            const scoreCell = this.createElement('td', '', record.score.toString());
            const dateCell = this.createElement('td', '', record.date);
            
            row.appendChild(positionCell);
            row.appendChild(nameCell);
            row.appendChild(scoreCell);
            row.appendChild(dateCell);
            table.appendChild(row);
        });

        this.leaderboardTable.appendChild(table);
    }
}
