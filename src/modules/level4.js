import { Level3 } from './level3'
import { Config } from './config'

export class Level4 extends Level3 {
  constructor (storage, command) {
    super(storage, command)
    this.command.domElements().generatePathButton.classList.add('hidden')
    this.pathCellCount = 0
  }

  create () {
    super.create()
    this.addCellEventListener()
    this.addContextMenuEventListener()
    this.showInfo()
  }

  fixCharacterPosition () {

  }

  setCurrentPosition () {
    const character = document.getElementById('character')
    if (!character) return
    const cell = character.closest('.cell')
    console.log('cell', cell)
    if (!cell) return

    console.log('setCurrentPosition', cell)
    console.log(' parseInt(cell.querySelector(\'.cell-id\').textContent)', parseInt(cell.querySelector('.cell-id').textContent))

    this.currentPosition = parseInt(cell.querySelector('.cell-id').textContent)
  }

  addCellEventListener () {
    const cells = document.querySelectorAll('.cell')
    cells.forEach((cell, index) => {
      cell.style.cursor = 'pointer'
      cell.addEventListener('click', (event) => {
        this.addToPathCell(event, index)
        this.hideContextMenu()
      })
    })
  }

  addContextMenuEventListener () {
    const cells = document.querySelectorAll('.cell')
    cells.forEach((cell, index) => {
      cell.addEventListener('contextmenu', (event) => {
        if (cell.classList.contains('path')) {
          event.preventDefault()
          this.showHelperContextMenu(event, index)
        }
      })
    })
  }

  addToPathCell (event, index) {
    console.log('addToPathCell', index)
    const element = event.currentTarget

    window.jupo_current_cell_element = element
    element.classList.contains('path') ? element.classList.remove('path') : element.classList.add('path')
    this.pathCellCount = document.querySelectorAll('.path').length
    // watch
    this.obServer()
  }

  showHelperContextMenu (element, index) {
    const contextMenu = document.createElement('div')
    contextMenu.id = 'context-menu'
    contextMenu.classList.add('context-menu')

    const ul = document.createElement('ul')
    const li = document.createElement('li')
    li.id = 'context-menu-reset'
    li.dataset.id = 'delete'
    li.textContent = 'Delete cell'

    const li2 = document.createElement('li')
    li2.id = 'context-menu-obstacle'
    li2.dataset.id = 'obstacle'
    li2.textContent = 'Add obstacle'

    const li3 = document.createElement('li')
    li3.id = 'context-menu-final'
    li3.dataset.id = 'final'
    li3.textContent = 'Mark as final'

    const li4 = document.createElement('li')
    li4.id = 'context-menu-start'
    li4.dataset.id = 'start'
    li4.textContent = 'Mark as start'

    ul.appendChild(li)
    ul.appendChild(li2)
    ul.appendChild(li3)
    ul.appendChild(li4)
    contextMenu.style.top = `${element.clientY}px`
    contextMenu.style.left = `${element.clientX}px`

    contextMenu.appendChild(ul)

    document.getElementById('board-wrapper').appendChild(contextMenu)

    this.addContextMenuItemEventListener(element, {
      deleteItem: li,
      addObstacle: li2,
      markAsFinish: li3,
      markAsStart: li4
    })
  }

  hideContextMenu = () => {
    const contextMenu = document.getElementById('context-menu')
    if (!contextMenu) return
    contextMenu.remove()
  }

  addContextMenuItemEventListener (domElement, contextMenuItems) {
    const deleteItemListener = (event) => {
      element.classList.remove('path')
      if (element.querySelectorAll('img').length > 0) {
        document.getElementById('character').remove()
      }

      if (element.classList.contains('finish')) {
        element.classList.remove('finish')
      }

      this.hideContextMenu()
    }

    const addObstacleListener = (event) => {
      element.classList.add('obstacle')
      this.hideContextMenu()
    }

    const markAsFinishListener = (event) => {
      if (element.classList.contains('start')) {
        this.showErrorMessage('Finish can not be start')
        return
      }

      element.classList.add('finish')
      element.classList.add('path')
      this.hideContextMenu()
    }

    const markAsStartListener = (event) => {
      //
      if (this.isCharakterOnPath()) {
        this.showErrorMessage('Start is already set')
        return
      }

      this.createCharacter(element)
      this.hideContextMenu()
    }

    const element = domElement.currentTarget

    contextMenuItems.deleteItem.addEventListener('click', deleteItemListener)
    contextMenuItems.addObstacle.addEventListener('click', addObstacleListener)
    contextMenuItems.markAsFinish.addEventListener('click', markAsFinishListener)
    contextMenuItems.markAsStart.addEventListener('click', markAsStartListener)
  }

  showInfo () {
    const element = document.getElementById('level4-info')
    if (!element) return
    element.classList.remove('hidden')
    const infoText = element.querySelector('p')
    infoText.innerHTML = infoText.innerText.replace('{minCellCount}', Config.LEVEL_4_MIN_CELL_TO_SELECT.toString())
  }

  isCharakterOnPath () {
    const character = document.getElementById('character')
    if (!character) return false
    const characterCell = character.parentElement
    return characterCell.classList.contains('path')
  }

  isFinishOnPath () {
    const finish = document.querySelector('.finish')
    if (!finish) return false
    return finish.classList.contains('path')
  }

  obServer () {
    if (this.pathCellCount >= Config.LEVEL_4_MIN_CELL_TO_SELECT) {
      document.getElementById('level4-info-label').classList.remove('disabled')
      document.getElementById('level4-start-button').addEventListener('click', () => {
        if (!this.isCharakterOnPath()) {
          console.log('Please select a start cell')
          this.showErrorMessage('Please select a start cell')
          return
        }

        if (!this.isFinishOnPath()) {
          console.log('Please select a finish cell')
          this.showErrorMessage('Please select a finish cell')
          return
        }

        const timeinput = document.getElementById('level4-info-timer')
        const time = timeinput.value

        if (isNaN(parseInt(time)) || parseInt(time) < 30) {
          console.log('Please enter a time greater than 30 seconds')
          this.showErrorMessage('Please enter a time greater than 30 seconds')
          return
        }

        // this.command.showCommandActionButtons()
        this.command.domElements().commandForm.classList.remove('hidden')
        this.command.domElements().commandList.classList.remove('flex-center')
        document.getElementById('level4-info').classList.add('hidden')

        this.setCurrentPosition()
        this.timeLimit = time
        this.startTimer()
      })
    } else {
      console.log('Please select at least 2 cells')
      document.getElementById('level4-info-label').classList.add('disabled')
    }
  }
}
