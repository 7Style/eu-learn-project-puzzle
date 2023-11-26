import {Game} from "./game";
import {Config} from "./config";

export class Level2 extends Game {
    constructor(storage, command) {
        super(storage, command);
        this.level = 2;
        this.timeLimit = Config.LEVEL_TIME_LIMIT; // Zeitlimit aus der Konfiguration
        this.timer = null;
        this.pathCells = [];
        this.init();
    }

    init() {
        this.showTimer();
        this.showPathGenerator();
        this.command.hideCommandActionButtons();
        this.store.clearCommands()
        this.command.commands = [];
        this.command.domElements().commandList.classList.add('flex-center');
        this.command.domElements().commandForm.classList.add('hidden');
    }


    showPathGenerator() {
        const pathGenerator = document.getElementById('generate-path-btn');
        if (pathGenerator) {
            pathGenerator.classList.remove('hidden');
        }
    }


    showTimer() {
        const timer = document.getElementById('timer-container');
        if (timer) {
            timer.classList.remove('hidden');
        }
    }

    startTimer() {
        let timeLeft = this.timeLimit;
        const timerElement = document.getElementById('timer');

        this.timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.gameOver();
            }
        }, 1000);
    }

    gameOver() {
        super.gameOver();
        if (this.timer) {
            clearInterval(this.timer);

            console.log('game over in level 2');

            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.textContent = this.timeLimit.toString();
            }
        }
    }

    isTimeUp() {
        return this.timer === null;
    }


    generateRandomPath() {
        const pathLength = this.calculatePathComplexity();
        this.setTimeLimitBasedOnComplexity(pathLength);
        this.createRandomPath();
        this.reloadGameBoard();

        this.command.domElements().generatePathButton.style.display = 'none';
        this.command.domElements().commandList.classList.remove('flex-center');
        this.command.domElements().commandForm.classList.remove('hidden');
    }

    calculatePathComplexity() {
        return Config.LEVEL_TIME_LIMIT
        const baseComplexity = 10;
        const complexityFactor = Math.random();
        return baseComplexity + Math.floor(complexityFactor * 20);
    }

    createRandomPath() {

        this.pathCells = Config.PATHS_LEVEL_2
        return;

        const boardSize = 10;
        let board = Array.from({length: boardSize}, () => Array(boardSize).fill(false));
        let path = [];
        let currentCell = {x: 0, y: 0};
        board[currentCell.y][currentCell.x] = true; // Mark the start cell as visited

        while (!(currentCell.x === boardSize - 1 && currentCell.y === boardSize - 1)) {
            let possibleMoves = this.getPossibleMoves(currentCell, board, boardSize);
            if (possibleMoves.length === 0) {
                // No possible moves from current cell, reset path and board
                path = [];
                board = Array.from({length: boardSize}, () => Array(boardSize).fill(false));
                currentCell = {x: 0, y: 0};
                board[currentCell.y][currentCell.x] = true;
                continue; // Restart path generation
            }
            // Choose a random move from the possible moves
            let nextCell = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            path.push(nextCell);
            board[nextCell.y][nextCell.x] = true; // Mark the cell as visited
            currentCell = nextCell;
        }

        // Convert path to the format expected by the game
        this.pathCells = path.map(cell => cell.y * boardSize + cell.x).sort((a, b) => a - b);
        console.log(this.pathCells);

    }


    getPossibleMoves(cell, board, boardSize) {
        const directions = [
            {x: 1, y: 0},  // right
            {x: 0, y: 1},  // down
            {x: -1, y: 0}, // left
            {x: 0, y: -1}  // up
        ];
        return directions
            .map(dir => ({x: cell.x + dir.x, y: cell.y + dir.y}))
            .filter(newCell => newCell.x >= 0 && newCell.x < boardSize &&
                newCell.y >= 0 && newCell.y < boardSize &&
                !board[newCell.y][newCell.x]); // Check if the cell has not been visited
    }


    setTimeLimitBasedOnComplexity(length) {
        this.timeLimit = length;
        this.startTimer();
    }

}
