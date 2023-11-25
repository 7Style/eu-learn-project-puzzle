import {Config} from "./config";
import {Konfetti} from "./konfetti";
import {Commands} from "./commands";

export class Game {
    constructor(storage) {
        this.currentPosition = 0;
        this.currentInstructionIndex = 0;
        this.pathCells = Config.DEFAULT_PATHS_CELL
        this.store = storage
        this.command = new Commands(this, this.store);
        this.level = storage.getLevel();
        this.command.addButtonListener();
    }

    create() {
        let firstCell = 0;
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.innerHTML = `<div class="cell-id">${i + 1}</div>`;

            if (this.pathCells.includes(i)) {
                cell.classList.add('path');
                if (i === this.pathCells[this.pathCells.length - 1]) {
                    cell.classList.add('finish');
                }
                if (firstCell === 0) {
                    this.createCharacter(cell);
                }
                firstCell++;
            }
            this._getBoardContainer().appendChild(cell);
        }

        this.command.run();
        const levelSelector = this.level - 1;
        this.command.setGameInstructionsText(Config.LEVEL_INSTRUCTIONS[levelSelector].title, Config.LEVEL_INSTRUCTIONS[levelSelector].text);
    }

    createCharacter(cell) {
        const character = document.createElement('div');
        character.id = 'character';
        character.innerHTML = '<img alt="JupoRobo" width="35" src="../static/icon.png" />';
        cell.appendChild(character);
    }


    reloadGameBoard() {
        const gameBoard = document.getElementById('gameBoard');
        if (gameBoard) {
            gameBoard.querySelectorAll('.cell').forEach((cell) => {
                cell.remove();
            });
        }
        this.create();
    }

    startGame() {
        const instructions = this.store.getCommands();
        const makeMove = (moveIndex) => {
            if (this.currentInstructionIndex < instructions.length) {
                this._validateInstructions(instructions, makeMove)
            }
        };
        makeMove();
    }

    gameOver() {

        const gameOver = document.getElementById('gameOverOverlay');

        if(gameOver){
            return;
        }

        const overlay = document.createElement('div');
        overlay.textContent = 'Game Over';
        overlay.classList.add('game-over-overlay');
        overlay.id = 'gameOverOverlay';
        document.body.appendChild(overlay);
        setTimeout(() => {
            const overlayToRemove = document.getElementById('gameOverOverlay');
            if (overlayToRemove) {
                overlayToRemove.remove();
            }
            this.command.clearCommands()
        }, 3000);

        this.markCommandStepAsChecked(true);
        this.currentPosition = 0;
        this.currentInstructionIndex = 0;
        this._moveCharacter(this.currentPosition);
        this.command.hideCommandActionButtons();

    }

    markCommandStepAsChecked(error) {
        const commandList = document.getElementById('command-list');
        const commandListItems = commandList.querySelectorAll('li');
        const currentCommandListItem = commandListItems[this.currentInstructionIndex];
        currentCommandListItem.classList.add(error ? 'error' : 'checked');
    }

    _moveCharacter(targetIndex) {
        const character = document.getElementById('character');
        const targetCell = document.querySelectorAll('.cell')[targetIndex];
        const cellSize = targetCell.offsetWidth;
        const leftValue = (targetIndex % 10) * cellSize + 'px';
        const topValue = Math.floor(targetIndex / 10) * cellSize + 'px';

        character.style.left = leftValue;
        character.style.top = topValue;

        if (targetCell && targetCell.classList.contains('finish')) {
            Konfetti.pat()
            return;
        }

        if (!this._getBoardContainer().contains(character)) {
            this._getBoardContainer().appendChild(character);
        }
    }

    _getBoardContainer() {
        const gameBoard = document.getElementById('gameBoard');
        if (!gameBoard) {
            console.error('gameBoard not found');
            return null;
        }
        return gameBoard;
    }


    _validateInstructions(instructions, makeMove) {
        const instruction = instructions[this.currentInstructionIndex];
        let newPosition = this.currentPosition;

        switch (instruction.direction) {
            case "right":
                newPosition += instruction.count;
                break;
            case "left":
                newPosition -= instruction.count;
                break;
            case "down":
                newPosition += (10 * instruction.count);
                break;
            case "up":
                newPosition -= (10 * instruction.count);
                break;
        }

        // Check if the character is on the finish cell
        const targetCell = document.querySelectorAll('.cell')[this.currentPosition];
        if (instructions.length === (this.currentInstructionIndex + 1) && targetCell.classList.contains('finish')) {
            this.gameOver()
            return;
        }

        // Check if the character is out of the path
        if (!this.pathCells.includes(newPosition) || newPosition < 0 || newPosition >= 100) {
            this.gameOver()
            return;
        }

        this.currentPosition = newPosition;
        this._moveCharacter(this.currentPosition);
        this.markCommandStepAsChecked();

        if (this.currentPosition !== 0) {
            this.currentInstructionIndex++;
            setTimeout(() => makeMove(), 1000);
        }
    }
}
