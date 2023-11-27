import {Config} from "./config";

export class Commands {

    maxCommands = 100;
    maxSteps = 100;
    storeInstance = null;
    _commands = [];

    constructor(gameBoardInstance, storeInstance) {
        this.storeInstance = storeInstance
        this.gameBoardInstance = gameBoardInstance;
        this.getStoredCommands();
        this._commands = [];

    }

    // it is a function because we want to get the latest version of dom elements
    domElements() {
        return {
            addButton: document.getElementById('add-button'),
            startGameButton: document.getElementById('start-game-btn'),
            resetButton: document.getElementById('reset-button'),
            count: document.getElementById('count'),
            direction: document.getElementById('direction'),
            commandList: document.getElementById('command-list'),
            levelSelector: document.getElementById('level-selector'),
            levelHeadline: document.getElementById('level-headline'),
            gameInfoBox: document.getElementById('game-info-box'),
            generatePathButton: document.getElementById('generate-path-btn'),
            commandForm: document.getElementById('command-form')
        }
    }

    run() {
        this.renderCommands()
        this.resetButtonListener()
        this.addLevelSelectorListener()
        this.addGeneratePathButtonListener()
    }

    addGeneratePathButtonListener() {
        const generatePathButton = this.domElements().generatePathButton;
        if (!generatePathButton) {
            console.error('generate-path-btn nicht gefunden');
            return;
        }
        generatePathButton.addEventListener('click', () => {
            this.gameBoardInstance.generateRandomPath();
        });
    }

    addButtonListener() {
        const element = this.domElements().addButton;

        if (!element) {
            console.error('add-button not found');
            return;
        }
        console.log('add button evented');
        element.addEventListener('click', () => {
            console.log('add button clicked');
            this.addCommand();
        })
    }

    resetButtonListener() {
        const element = this.domElements().resetButton;

        if (!element) {
            console.error('reset-button not found');
            return;
        }

        element.addEventListener('click', () => {
            window.location.reload();
        })
    }

    addLevelSelectorListener() {
        const element = this.domElements().levelSelector;

        if (!element) {
            console.error('level-selector not found');
            return;
        }

        const currentLevel = this.storeInstance.getLevel();
        element.value = currentLevel;
        this.domElements().levelHeadline.innerHTML = `Level ${currentLevel}`;

        element.addEventListener('change', () => {
            const level = element.value;

            this.storeInstance.storeLevel(level);
            window.location.reload();
        })
    }

    startGameButtonListener() {
        const element = this.domElements().startGameButton;

        if (!element) {
            console.error('start-game-button not found');
            return;
        }

        element.addEventListener('click', () => {
            this.saveCommands();
            this.gameBoardInstance.startGame();
        })
    }
    addCommand() {
        if (this.gameBoardInstance.level > 1 && this.gameBoardInstance.isTimeUp()) {
            console.log('Zeit ist abgelaufen, keine weiteren Befehle erlaubt.');
            return;
        }

        console.log('add command');

        const direction = this.getDirectionValue()
        const count = this.getCountValue()
        this.commands.push({
            count,
            direction
        });

        this.renderCommands()
    }

    renderCommands() {
        const element = this.domElements().commandList?.querySelector('ul');
        element.innerHTML = "";
        this.commands.forEach((command, id) => {
            const commandElement = document.createElement('li');
            commandElement.classList.add('position-relative');
            commandElement.innerHTML = `<span class="command-count">#${id + 1}</span>
                             <span class="command-direction"> ${command.direction.toUpperCase()} Move ${command.count}x</span>
                            <span class="command-remove" data-id="${id}">
                                <img src="../static/delete.png" alt="Delete" width="16" />
                            </span>
`
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
            this.showCommandActionButtons();
        }
    }

    clearCommands() {
        this.commands = [];
        this.renderCommands();
        this.storeInstance.clearCommands();
    }

    getCountValue() {
        const count = this.domElements().count;
        if (!count) {
            console.error('count not found');
            return;
        }
        const value = parseInt(count.value);
        return isNaN(value) || value < 1 ? 1 : (value > this.maxSteps ? this.maxSteps : value);
    }

    getDirectionValue() {
        const direction = this.domElements().direction
        if (!direction) {
            console.error('direction not found');
            return;
        }
        return direction.value;
    }

    disableAddButton() {
        const element = this.domElements().addButton

        if (!element) {
            console.error('add-button not found');
            return;
        }

        element.disabled = true;
    }

    showStartGameButton() {
        const element = this.domElements().startGameButton
        if (!element) {
            console.error('start-game-btn not found');
            return;
        }
        element.style.display = 'block'
    }

    showResetButton() {
        const element = this.domElements().resetButton
        if (!element) {
            console.error('reset-button not found');
            return;
        }
        element.style.display = 'block'
    }

    hideResetButton() {
        const element = this.domElements().resetButton
        if (!element) {
            console.error('reset-button not found');
            return;
        }
        element.style.display = 'none'
    }

    hideCommandActionButtons() {
        this.hideResetButton()
        this.hideStartGameButton()
    }
    showCommandActionButtons() {
        this.showStartGameButton()
        this.showResetButton()
    }

    hideStartGameButton() {
        this.domElements().startGameButton.style.display = 'none'
    }

    getCommandCount() {
        const element = this.domElements().commandList;
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
        this.commands = this.storeInstance.getCommands();
    }

    reset() {
        this.commands = [];
        this.renderCommands();
        this.storeInstance.storeCommands([]);
    }

    setGameInstructionsText(title, text) {
        this.domElements().gameInfoBox.innerHTML = `<h3>${title}</h3><span>${text}</span>`;
    }

    setCommands(commands) {
        this.commands = commands;
    }

    get commands() {
        return this._commands;
    }

    set commands(commands) {
        this._commands = commands;
    }
}
