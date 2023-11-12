export class GameBoard {
    constructor(paths = []) {
        this.currentPosition = 0;
        this.pathCells = [
            0, 1, 2, 12, 22, 23, 24, 25, 26, 27, 37, 47, 57, 67, 68, 69, 79, 89, 88, 87, 86, 85, 75, 65, 55, 54, 53, 52, 62, 72, 82, 92, 91, 90
        ];

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

    createPath() {
        document.querySelector('.moveButton').addEventListener('click', () => {
            const diceRoll = Math.floor(Math.random() * 6) + 1;
            document.querySelector('.dice-result').textContent = ` ${diceRoll}`;

            let steps = diceRoll;

            const stepForward = () => {
                this.currentPosition++;
                if (this.currentPosition >= this.pathCells.length) {
                    this.currentPosition = 0;
                }

                this._moveCharacter(this.pathCells[this.currentPosition]);

                steps--;
                if (steps > 0) {
                    setTimeout(stepForward, 500);
                }
            };

            stepForward();
        });
    }

    _moveCharacter(targetIndex) {
        const character = document.getElementById('character');
        const targetCell = document.querySelectorAll('.cell')[targetIndex];
        const cellSize = targetCell.offsetWidth;
        const leftValue = (targetIndex % 10) * cellSize + 'px';
        const topValue = Math.floor(targetIndex / 10) * cellSize + 'px';

        character.style.left = leftValue;
        character.style.top = topValue;

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

}
