import { Level2 } from './level2'
import { Config } from './config'
import { Konfetti } from './konfetti'

export class Level3 extends Level2 {
  constructor (storage, command) {
    super(storage, command)
    this.timeLimit = Config.LEVEL_3_TIME_LIMIT
    this.timer = null
  }

  startGame () {
    const instructions = this.store.getCommands()
    const makeMove = () => {
      if (this.currentInstructionIndex < instructions.length) {
        this._validateInstructions(instructions, makeMove)
      }
    }
    makeMove()
    this.fixCharacterPosition()
  }

  gameOver () {
    super.gameOver()
    setTimeout(() => {
      // make hard reload to generate new path
      window.location.reload()
    }, 3000)
  }

  create () {
    super.create()
    this.fixCharacterPosition()
    this.addObstacles()
    this.setCurrentPosition()
  }

  fixCharacterPosition () {
    console.log('fixCharacterPosition called in level3.js')

    const character = document.querySelector('.cell #character')
    if (!character) {
      console.log('Kein Charakter gefunden')
      return
    }
    ;

    const copyCharacter = character.cloneNode(true)
    character.remove()

    const cells = document.querySelectorAll('.cell')
    cells[10].appendChild(copyCharacter)
  }

  addObstacles () {
    Config.PATHS_LEVEL_3_OBSTACLE.forEach((index) => {
      const cell = document.querySelector(`.path_id_${index}`)
      if (!cell) return
      cell.classList.add('obstacle')
    })
  }

  setCurrentPosition () {
    console.log('setCurrentPosition called in level3.js')
    const character = document.getElementById('character')
    if (!character) return
    const cell = character.closest('.cell')
    if (!cell) return
    this.currentPosition = parseInt(cell.querySelector('.cell-id').textContent)
  }

  _validateInstructions (instructions, makeMove) {
    const instruction = instructions[this.currentInstructionIndex]
    switch (instruction.direction) {
      case 'right':
        this.currentPosition += instruction.count
        break
      case 'left':
        this.currentPosition -= instruction.count
        break
      case 'down':
        this.currentPosition += (10 * instruction.count)
        break
      case 'up':
        this.currentPosition -= (10 * instruction.count)
        break
    }

    this._moveCharacter(this.currentPosition)
    this.markCommandStepAsChecked()

    if (this.currentPosition !== 0) {
      this.currentInstructionIndex++
      setTimeout(() => makeMove(), 1000)
    }
  }

  _moveCharacter (targetIndex) {
    const character = document.getElementById('character')
    const targetCell = document.querySelectorAll('.cell')[targetIndex]
    if (!targetCell) return // Sicherstellen, dass die Zelle existiert

    setTimeout(() => {
      targetCell.classList.add('show-character')
    }, 0)

    targetCell.appendChild(character)

    if (targetCell.classList.contains('obstacle')) {
      console.log('Der Charakter hat den unerlaubten Bereich eingetreten.')
      this.gameOver()
      return
    }

    if (!targetCell.classList.contains('path')) {
      console.log('Der Charakter hat den bereits geprüften Bereich betreten.')
      this.gameOver()
      return
    }

    if (targetCell.classList.contains('finish')) {
      console.log('Der Charakter hat das Ziel erreicht.')
      Konfetti.pat()
    }
  }

  createRandomPath () {
    this.pathCells = Config.PATHS_LEVEL_3
  }
}
