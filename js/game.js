class Game2048 {
    constructor() {
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.moves = [];
        this.gameOver = false;
        this.won = false;
        this.initGrid();
        this.addRandomTile();
        this.addRandomTile();
    }

    initGrid() {
        this.grid = [];
        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = 4;
            }
        }
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            this.grid[randomCell.row][randomCell.col] = value;
            return true;
        }
        return false;
    }

    move(direction) {
        if (this.gameOver) return false;

        this.moves.push({
            grid: this.grid.map(row => [...row]),
            score: this.score
        });

        let moved = false;
        let newScore = 0;

        switch (direction) {
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
        }

        if (moved) {
            this.addRandomTile();
            this.checkWin();
            this.checkGameOver();
        } else {
            this.moves.pop();
        }

        return moved;
    }

    moveLeft() {
        let moved = false;
        let newScore = 0;

        for (let i = 0; i < this.size; i++) {
            const row = this.grid[i].filter(val => val !== 0);
            const { row: mergedRow, score: rowScore } = this.mergeRow(row);
            
            newScore += rowScore;

            while (mergedRow.length < this.size) {
                mergedRow.push(0);
            }

            for (let k = 0; k < this.size; k++) {
                if (this.grid[i][k] !== mergedRow[k]) {
                    moved = true;
                }
                this.grid[i][k] = mergedRow[k];
            }
        }

        this.score += newScore;
        return moved;
    }

    mergeRow(row) {
        if (row.length <= 1) return { row: row, score: 0 };

        let totalScore = 0;
        let prevLength = row.length;
        let merged = true;
        
        while (merged) {
            merged = false;
            const newRow = [];
            let i = 0;
            
            while (i < row.length) {
                if (i + 1 < row.length && row[i] === row[i + 1]) {
                    const mergedValue = row[i] * 2;
                    newRow.push(mergedValue);
                    totalScore += mergedValue;
                    i += 2;
                    merged = true;
                } else {
                    newRow.push(row[i]);
                    i++;
                }
            }
            
            row = newRow;
            
            if (row.length === prevLength) {
                break;
            }
            prevLength = row.length;
        }
        
        return { row: row, score: totalScore };
    }

    moveRight() {
        this.reverseGrid();
        const moved = this.moveLeft();
        this.reverseGrid();
        return moved;
    }

    moveUp() {
        this.transposeGrid();
        const moved = this.moveLeft();
        this.transposeGrid();
        return moved;
    }

    moveDown() {
        this.transposeGrid();
        const moved = this.moveRight();
        this.transposeGrid();
        return moved;
    }

    reverseGrid() {
        for (let i = 0; i < this.size; i++) {
            this.grid[i].reverse();
        }
    }

    transposeGrid() {
        for (let i = 0; i < this.size; i++) {
            for (let j = i; j < this.size; j++) {
                if (i !== j) {
                    [this.grid[i][j], this.grid[j][i]] = [this.grid[j][i], this.grid[i][j]];
                }
            }
        }
    }

    checkWin() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 2048) {
                    this.won = true;
                    return;
                }
            }
        }
    }

    checkGameOver() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    return false;
                }
            }
        }

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size - 1; j++) {
                if (this.grid[i][j] === this.grid[i][j + 1]) {
                    return false;
                }
            }
        }

        for (let i = 0; i < this.size - 1; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === this.grid[i + 1][j]) {
                    return false;
                }
            }
        }

        this.gameOver = true;
        return true;
    }

    undo() {
        if (this.moves.length > 0 && !this.gameOver) {
            const lastState = this.moves.pop();
            this.grid = lastState.grid.map(row => [...row]);
            this.score = lastState.score;
            this.gameOver = false;
            this.won = false;
            return true;
        }
        return false;
    }

    reset() {
        this.initGrid();
        this.score = 0;
        this.moves = [];
        this.gameOver = false;
        this.won = false;
        this.addRandomTile();
        this.addRandomTile();
    }

    getState() {
        return {
            grid: this.grid.map(row => [...row]),
            score: this.score,
            gameOver: this.gameOver,
            won: this.won,
            moves: this.moves.map(move => ({
                grid: move.grid.map(row => [...row]),
                score: move.score
            }))
        };
    }

    setState(state) {
        this.grid = state.grid.map(row => [...row]);
        this.score = state.score;
        this.gameOver = state.gameOver;
        this.won = state.won;
        this.moves = state.moves ? state.moves.map(move => ({
            grid: move.grid.map(row => [...row]),
            score: move.score
        })) : [];
    }
}