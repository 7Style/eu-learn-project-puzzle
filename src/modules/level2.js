import {Game} from "./game";
import {Config} from "./config";

export class Level2 extends Game {
    constructor(storage, command) {
        super(storage, command);
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
            timerElement.textContent = timeLeft.toString();

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
        // Todo calculate path complexity based on the path cells
    }

    createRandomPath() {
        this.pathCells = Config.PATHS_LEVEL_2
    }

    setTimeLimitBasedOnComplexity(length) {
        this.timeLimit = length;
        this.startTimer();
    }

}
