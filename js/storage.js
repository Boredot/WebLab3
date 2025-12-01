class StorageManager {
    constructor() {
        this.storage = window.localStorage;
    }

    saveGameState(gameState) {
        this.storage.setItem('2048_gameState', JSON.stringify(gameState));
    }

    loadGameState() {
        const saved = this.storage.getItem('2048_gameState');
        return saved ? JSON.parse(saved) : null;
    }

    clearGameState() {
        this.storage.removeItem('2048_gameState');
    }
}

const storageManager = new StorageManager();