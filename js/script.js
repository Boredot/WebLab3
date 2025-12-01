document.addEventListener('DOMContentLoaded', () => {
    const savedState = storageManager.loadGameState()
    const game = new Game2048();
    if (savedState) {
        game.setState(savedState);
    }
    const uiManager = new UIManager(game);
    window.addEventListener('beforeunload', () => {
        storageManager.saveGameState(game.getState());
    });

    setInterval(() => {
        storageManager.saveGameState(game.getState());
    }, 5000);
});