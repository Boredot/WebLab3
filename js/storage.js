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

    saveScore(name, score) {
        const leaderboard = this.getLeaderboard();
        leaderboard.push({
            name: name,
            score: score,
            date: new Date().toLocaleDateString('ru-RU')
        });
        
        leaderboard.sort((a, b) => b.score - a.score);
        const top10 = leaderboard.slice(0, 10);
        
        this.storage.setItem('2048_leaderboard', JSON.stringify(top10));
        return top10;
    }

    getLeaderboard() {
        const saved = this.storage.getItem('2048_leaderboard');
        return saved ? JSON.parse(saved) : [];
    }

    getBestScore() {
        const leaderboard = this.getLeaderboard();
        if (leaderboard.length === 0) return 0;
        return Math.max(...leaderboard.map(item => item.score));
    }
}

const storageManager = new StorageManager();