import { Config } from './config'
import { Konfetti } from './konfetti'
import { Commands } from './commands'

export class Game {
  constructor (storage) {
    this.currentPosition = 0
    this.currentInstructionIndex = 0
    this.pathCells = Config.DEFAULT_PATHS_CELL
    this.store = storage
    this.command = new Commands(this, this.store)
    this.level = storage.getLevel() || 1
    this.command.addButtonListener()
    this.command.startGameButtonListener()
    this.command.resetButtonListener()
    // todo: remove this
    // this.__debug();
  }

  create () {
    let firstCell = 0
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.innerHTML = `<div class="cell-id">${i}</div>`

      if (this.pathCells.includes(i)) {
        cell.classList.add('path')
        cell.classList.add('path_id_' + i)
        if (i === this.pathCells[this.pathCells.length - 1]) {
          cell.classList.add('finish')
        }
        if (firstCell === 0) {
          this.createCharacter(cell)
        }
        firstCell++
      }
      this._getBoardContainer().appendChild(cell)
    }

    this.command.run()
    const levelSelector = this.level - 1
    console.log('levelSelector', this.level, levelSelector)
    this.command.setGameInstructionsText(Config.LEVEL_INSTRUCTIONS[levelSelector].title, Config.LEVEL_INSTRUCTIONS[levelSelector].text)
  }

  createCharacter (cell) {
    const character = document.createElement('div')
    character.id = 'character'
    character.innerHTML = '<img alt="JupoRobo" width="35" src="../static/icon.png" />'
    cell.appendChild(character)
  }

  reloadGameBoard () {
    const gameBoard = document.getElementById('gameBoard')
    if (gameBoard) {
      gameBoard.querySelectorAll('.cell').forEach((cell) => {
        cell.remove()
      })
    }
    this.create()
  }

  startGame () {
    const instructions = this.store.getCommands()
    const makeMove = (moveIndex) => {
      if (this.currentInstructionIndex < instructions.length) {
        this._validateInstructions(instructions, makeMove)
      }
    }
    makeMove()
  }

  gameOver () {
    const gameOver = document.getElementById('gameOverOverlay')

    if (gameOver) {
      return
    }

    const overlay = document.createElement('div')
    overlay.innerHTML = '<div class="game-over"><h2>Game Over</h2><p>Game over. Thank you for playing!</p></div>'
    overlay.classList.add('game-over-overlay')
    overlay.id = 'gameOverOverlay'
    this._getBoardContainer().appendChild(overlay)
    setTimeout(() => {
      const overlayToRemove = document.getElementById('gameOverOverlay')
      if (overlayToRemove) {
        overlayToRemove.remove()
      }
      this.command.clearCommands()
    }, 3000)

    this.markCommandStepAsChecked(true)
    this.reset()
  }

  reset () {
    this.currentPosition = 0
    this.currentInstructionIndex = 0
    this.command.clearCommands()
    this.command.hideCommandActionButtons()
    this.command.renderCommands()
    this._moveCharacter(this.currentPosition)
  }

  markCommandStepAsChecked (error) {
    const commandList = document.getElementById('command-list')
    if (!commandList) {
      console.log('command-list not found')
      return
    }
    const commandListItems = commandList.querySelectorAll('li')
    const currentCommandListItem = commandListItems[this.currentInstructionIndex]
    if (!currentCommandListItem) {
      console.log('currentCommandListItem not found')
      return
    }
    currentCommandListItem.classList.add(error ? 'error' : 'checked')
  }

  _moveCharacter (targetIndex) {
    const character = document.getElementById('character')
    const targetCell = document.querySelectorAll('.cell')[targetIndex]
    const cellSize = targetCell.offsetWidth
    const leftValue = (targetIndex % 10) * cellSize + 'px'
    const topValue = Math.floor(targetIndex / 10) * cellSize + 'px'

    character.style.left = leftValue
    character.style.top = topValue

    if (targetCell && targetCell.classList.contains('finish')) {
      Konfetti.pat()
      return
    }

    if (!this._getBoardContainer().contains(character)) {
      this._getBoardContainer().appendChild(character)
    }

    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  generateCommandsFromPath (path) {
    const commands = []
    let currentDirection = ''
    let stepCount = 0

    for (let i = 1; i < path.length; i++) {
      const currentPos = path[i - 1]
      const nextPos = path[i]
      const currentX = currentPos % 10
      const currentY = Math.floor(currentPos / 10)
      const nextX = nextPos % 10
      const nextY = Math.floor(nextPos / 10)

      let direction = ''
      if (nextX > currentX) direction = 'right'
      else if (nextX < currentX) direction = 'left'
      else if (nextY > currentY) direction = 'down'
      else if (nextY < currentY) direction = 'up'

      if (direction !== currentDirection) {
        if (stepCount > 0) {
          commands.push({ direction: currentDirection, count: stepCount })
        }
        currentDirection = direction
        stepCount = 1
      } else {
        stepCount++
      }
    }

    // Fügen Sie den letzten Befehl hinzu, wenn Schritte vorhanden sind
    if (stepCount > 0) {
      commands.push({ direction: currentDirection, count: stepCount })
    }
    return commands
  }

  _getBoardContainer () {
    const gameBoard = document.getElementById('gameBoard')
    if (!gameBoard) {
      console.error('gameBoard not found')
      return null
    }
    return gameBoard
  }

  _validateInstructions (instructions, makeMove) {
    const instruction = instructions[this.currentInstructionIndex]
    let newPosition = this.currentPosition

    switch (instruction.direction) {
      case 'right':
        newPosition += instruction.count
        break
      case 'left':
        newPosition -= instruction.count
        break
      case 'down':
        newPosition += (10 * instruction.count)
        break
      case 'up':
        newPosition -= (10 * instruction.count)
        break
    }

    // Check if the character is on the finish cell
    const targetCell = document.querySelectorAll('.cell')[this.currentPosition]
    console.log('targetCell', document.querySelectorAll('.cell')[this.currentPosition])

    console.log('instructions.length === (this.currentInstructionIndex + 1)', instructions.length, (this.currentInstructionIndex + 1))

    if (instructions.length === (this.currentInstructionIndex) && !targetCell.classList.contains('finish')) {
      console.log('You have not reached the finish cell')

      if (this.level === 1) {
        this.gameOver()
      }
      return
    }

    // Check if the character is out of the path
    if (!this.pathCells.includes(newPosition) || newPosition < 0 || newPosition >= 100) {
      this.gameOver()
      return
    }

    this.currentPosition = newPosition
    this._moveCharacter(this.currentPosition)
    this.markCommandStepAsChecked()

    if (this.currentPosition !== 0) {
      this.currentInstructionIndex++
      setTimeout(() => makeMove(), 1000)
    }
  }

  showNotices (content = '') {
    const notice = document.createElement('div')
    notice.innerHTML = `<div class="notice-content">${content}</div>`
    notice.classList.add('notice-overlay')
    this._getBoardContainer().appendChild(notice)
  }

  showErrorMessage (content = '') {
    if (document.querySelector('.error-overlay')) {
      return
    }

    const errorMessage = document.createElement('div')
    errorMessage.innerHTML = `<div class="error-content">${content}</div>`
    errorMessage.classList.add('error-overlay')
    const closeButton = document.createElement('button')
    closeButton.classList.add('close-button')
    closeButton.textContent = 'X'
    closeButton.addEventListener('click', () => {
      errorMessage.remove()
    })
    errorMessage.appendChild(closeButton)
    this._getBoardContainer().appendChild(errorMessage)
  }

  removeErrorMessage () {
    const notice = document.querySelector('.error-overlay')
    if (notice) {
      notice.remove()
    }
  }

  __debug () {
    const element = document.getElementById('debug-button')
    if (!element) {
      return
    }
    element.addEventListener('click', () => {
      this.store._storage().removeItem(this.store._getStorageKey(Config.COMMAND_STORAGE_KEY))
      const commands = this.generateCommandsFromPath(this.pathCells)
      this.command.setCommands(commands)
      this.store.storeCommands(commands)
      this.generateCommandsFromPath(this.pathCells)
      this.command.renderCommands()
      // this.startGame()
    })
  }
}
