class GameOverModal {
    constructor(game, uiManager) {
        this.game = game;
        this.uiManager = uiManager;
        this.gameOverModal = null;
        this.createAndShowModal();
    }

    createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    }

    createAndShowModal() {
        this.gameOverModal = this.createElement('div', 'game-over-modal');
        const gameOverContent = this.createElement('div', 'modal-content');
        
        const gameOverTitle = this.createElement('h2', '', 'Game over!');
        gameOverContent.appendChild(gameOverTitle);

        const gameOverMessage = this.createElement('p', 'message', `Game over! Score: ${this.game.score}`);
        gameOverContent.appendChild(gameOverMessage);

        const inputGroup = this.createElement('div', 'input-group');
        const nameInput = this.createElement('input', 'name-input', '');
        nameInput.type = 'text';
        nameInput.placeholder = 'Input your username';
        inputGroup.appendChild(nameInput);
        gameOverContent.appendChild(inputGroup);

        const saveBtn = this.createElement('button', 'btn', 'Save Score');
        saveBtn.onclick = () => this.saveScore(nameInput.value, saveBtn, inputGroup);
        gameOverContent.appendChild(saveBtn);

        const restartBtn = this.createElement('button', 'btn', 'New game');
        restartBtn.onclick = () => {
            this.destroy();
            this.uiManager.newGame();
        };
        gameOverContent.appendChild(restartBtn);

        this.gameOverModal.appendChild(gameOverContent);
        document.body.appendChild(this.gameOverModal);

        this.gameOverModal.style.display = 'flex';
    }

    saveScore(name, saveBtn, inputGroup) {
        if (name.trim()) {
            storageManager.saveScore(name, this.game.score);
            
            const gameOverContent = this.gameOverModal.querySelector('.modal-content');
            const message = gameOverContent.querySelector('.message');
            message.textContent = 'High score saved!';
            
            inputGroup.style.display = 'none';
            saveBtn.style.display = 'none';
            
            this.uiManager.updateBestScore();
        }
    }

    destroy() {
        if (this.gameOverModal && this.gameOverModal.parentNode) {
            this.gameOverModal.parentNode.removeChild(this.gameOverModal);
        }
    }
}