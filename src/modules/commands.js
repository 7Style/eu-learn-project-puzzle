import {Config} from "./config";

export class Commands {

    maxCommands = 100;
    maxSteps = 100;
    gameBoardInstance = null;
    storeInstance = null;
    commands = [];

    constructor(gameBoardInstance, storeInstance) {
        this.gameBoardInstance = gameBoardInstance
        this.storeInstance = storeInstance
        this.getStoredCommands();

    }

    run() {
        this.addButtonListener();
        this.startGameButtonListener()
        this.renderCommands()
        this.resetButtonListener()
    }

    addButtonListener() {
        const element = document.getElementById('add-button');

        if (!element) {
            console.error('add-button not found');
            return;
        }

        element.addEventListener('click', () => {
            this.addCommand();
        })
    }

    startGameButtonListener() {
        const element = document.getElementById('start-game-btn');

        if (!element) {
            console.error('start-game-button not found');
            return;
        }

        element.addEventListener('click', () => {
            this.saveCommands();
            this.gameBoardInstance.startGame();
        })
    }

    resetButtonListener() {
        const element = document.getElementById('reset-button');

        if (!element) {
            console.error('reset-button not found');
            return;
        }

        element.addEventListener('click', () => {
            this.reset();
        })
    }

    addCommand() {
        const direction = this.getDirectionValue()
        const count = this.getCountValue()
        this.commands.push({
            count,
            direction
        });

        this.renderCommands()
    }

    renderCommands() {
        const element = document.getElementById('command-list').querySelector('ul');
        element.innerHTML = "";
        this.commands.forEach((command, id) => {
            const commandElement = document.createElement('li');
            commandElement.innerHTML = `<span class="command-count">#${id + 1}</span>
                             <span class="command-direction"> ${command.direction.toUpperCase()} Move ${command.count}x</span>`
            commandElement.classList.add('step');
            if (this.getCommandCount() >= this.maxCommands) {
                console.log('max commands reached');
                this.disableAddButton();
                return;
            }
            element.appendChild(commandElement);
        })

        // Show start game button
        if (this.getCommandCount() >= Config.minCommandsCountToStartGame) {
            this.showStartGameButton();
        }

    }

    getCountValue() {
        const count = document.getElementById('count')
        if (!count) {
            console.error('count not found');
            return;
        }
        const value = parseInt(count.value);
        return isNaN(value) || value < 1 ? 1 : (value > this.maxSteps ? this.maxSteps : value);
    }

    getDirectionValue() {
        const direction = document.getElementById('direction')
        if (!direction) {
            console.error('direction not found');
            return;
        }
        return direction.value;
    }

    disableAddButton() {
        const element = document.getElementById('add-button');

        if (!element) {
            console.error('add-button not found');
            return;
        }

        element.disabled = true;
    }

    showStartGameButton() {
        const element = document.getElementById('start-game-btn');
        if (!element) {
            console.error('start-game-btn not found');
            return;
        }
        element.style.display = 'block'
    }

    getCommandCount() {
        const element = document.getElementById('command-list').querySelector('ul');
        if (!element) {
            console.error('command-list not found')
        }
        return element.querySelectorAll('li').length
    }

    saveCommands() {
        this.storeInstance.storeCommands(this.commands);
        return this.commands;
    }

    getStoredCommands() {
        console.log("das sollte nur ein mal am anfang ausgeführt werden")
        this.commands = this.storeInstance.getCommands();
    }

    reset() {
        this.commands = [];
        this.renderCommands();
        this.storeInstance.storeCommands([]);
    }
}
