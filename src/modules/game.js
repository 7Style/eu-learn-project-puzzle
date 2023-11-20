import {Config} from "./config";

export class Game {
    constructor(storage, paths = []) {
        this.currentPosition = 0;
        this.currentInstructionIndex = 0;
        this.pathCells = Config.DEFAULT_PATHS_CELL
        this.store = storage

        if (paths.length > 0) {
            this.pathCells = paths;
        }
    }

    create() {
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.innerHTML = `<div class="cell-id">${i + 1}</div>`;
            console.log('Path Selected', this.pathCells, this.pathCells.includes(i));
            if (this.pathCells.includes(i)) {
                console.log('Path Selected', i);
                cell.classList.add('path');
                if (i === 0) {
                    const character = document.createElement('div');
                    character.id = 'character';
                    character.innerHTML = '<img width="35" src="../static/icon.png" />';
                    cell.appendChild(character);
                }
                if (i === this.pathCells[this.pathCells.length - 1]) {
                    cell.classList.add('finish');
                }
            }
            this._getBoardContainer().appendChild(cell);
        }
    }

    startGame() {
        const instructions = this.store.getCommands();
        const makeMove = (moveIndex) => {
            if (this.currentInstructionIndex < instructions.length) {
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
                        newPosition += (10 * instruction.count); // Assumption: 10 cells per row
                        break;
                    case "up":
                        newPosition -= (10 * instruction.count); // Assumption: 10 cells per row
                        break;
                }

                console.log('index',this.currentInstructionIndex);

                // Überprüfen Sie, ob der Charakter sich außerhalb des Pfades befindet
                if (!this.pathCells.includes(newPosition) || newPosition < 0 || newPosition >= 100) {
                    this.markCommendStepAsChecked(true);

                    this.currentPosition = 0;
                    this.currentInstructionIndex = 0;
                    this.gameOver()
                    this._moveCharacter(this.currentPosition);
                    return;
                }

                this.currentPosition = newPosition; // Aktualisieren Sie die aktuelle Position
                this._moveCharacter(this.currentPosition);


                this.markCommendStepAsChecked();

                if (this.currentPosition !== 0) {
                    this.currentInstructionIndex++;
                    setTimeout(() => makeMove(), 1000);
                }
            }
        };

        makeMove();
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
            this._startKonfetti();
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

    _startKonfetti() {

        // Canvas und Kontext initialisieren
        const canvas = document.createElement('canvas');
        canvas.style = 'position: fixed; top: 0; left: 0; pointer-events: none;';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        // Canvas an Fenstergröße anpassen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Konfetti-Eigenschaften
        const konfettiCount = 100;
        const konfetti = [];

        // Konfetti-Objekt-Klasse
        class Konfetti {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height - canvas.height;
                this.speed = Math.random() * 3 + 1;
                this.rotation = Math.random() * 360;
                const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'pink', 'purple', 'white'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.size = Math.random() * 10 + 5;
            }
        }

        // Konfetti initialisieren
        for (let i = 0; i < konfettiCount; i++) {
            konfetti.push(new Konfetti());
        }

        // Konfetti animieren
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            konfetti.forEach(k => {
                ctx.beginPath();
                ctx.arc(k.x, k.y, k.size, 0, 2 * Math.PI);
                ctx.fillStyle = k.color;
                ctx.fill();
                ctx.closePath();

                k.y += k.speed;
                k.x += Math.sin(k.rotation * Math.PI / 180) * 2;

                // Konfetti am unteren Rand wieder nach oben setzen
                if (k.y > canvas.height) {
                    k.y = -10;
                    k.x = Math.random() * canvas.width;
                }
            });

            requestAnimationFrame(draw);
        };

        draw();
    };


    _validateInstructions(instructions) {
        let position = 0;
        let isValid = true;
        let invalidStepIndex = -1; // Wir verwenden -1, um anzuzeigen, dass alle Schritte anfangs als gültig angenommen werden.

        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            let move = 0;

            switch (instruction.direction) {
                case "right":
                    move = instruction.count;
                    break;
                case "left":
                    move = -instruction.count;
                    break;
                case "down":
                    move = 10 * instruction.count;
                    break;
                case "up":
                    move = -10 * instruction.count;
                    break;
            }

            position += move;

            // Überprüfen, ob die Position außerhalb des Pfades liegt
            if (!this.pathCells.includes(position) || position < 0 || position >= 100) {
                isValid = false;
                invalidStepIndex = i;
                break; // Wenn eine ungültige Bewegung gefunden wird, brechen wir die Schleife ab.
            }
        }

        return {
            isValid: isValid,
            invalidStepIndex: invalidStepIndex
        };
    }


    gameOver() {
        // Färben Sie den gesamten Bildschirm rot und zeigen Sie den "Game Over" Text an.
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = 0;
        overlay.style.top = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';
        overlay.style.fontSize = '5rem';
        overlay.style.color = 'white';
        overlay.textContent = 'Game Over';
        overlay.id = 'gameOverOverlay'; // ID zum späteren Entfernen

        document.body.appendChild(overlay);
        setTimeout(() => {
            const overlayToRemove = document.getElementById('gameOverOverlay');
            if (overlayToRemove) {
                overlayToRemove.remove();
            }
        }, 5000);
    }

    markCommendStepAsChecked(error) {
        const commandList = document.getElementById('command-list');
        const commandListItems = commandList.querySelectorAll('li');
        const currentCommandListItem = commandListItems[this.currentInstructionIndex];
        currentCommandListItem.classList.add(error ? 'error' : 'checked');
    }
}
