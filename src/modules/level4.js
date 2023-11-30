import { Level3 } from './level3'

export class Level4 extends Level3 {
  constructor (storage, command) {
    super(storage, command)
    this.command.domElements().generatePathButton.classList.add('hidden')
    this.pathCells = []
  }

  create () {
    super.create()
    this.addCellEventListener()
    this.addContextMenuEventListener()
  }

  addCellEventListener () {
    const cells = document.querySelectorAll('.cell')
    cells.forEach((cell, index) => {
      cell.style.cursor = 'pointer'
      cell.addEventListener('click', (event) => {
        this.addToPathCell(event, index)
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
    element.classList.contains('path') ? element.classList.remove('path') : element.classList.add('path')
    this.pathCells.push(index)

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
    contextMenu.appendChild(ul)

    document.getElementById('board-wrapper').appendChild(contextMenu)
    this.addContextMenuItemEventListener(element, {
      deleteItem: li,
      addObstacle: li2,
      markAsFinish: li3,
      markAsStart: li4
    })
  }

  addContextMenuItemEventListener (domElement, contextMenuItems) {
    const hideContextMenu = () => {
      const contextMenu = document.getElementById('context-menu')
      if (!contextMenu) return
      contextMenu.remove()
    }
    const deleteItemListener = (event) => {
      console.log('deleteItem', event)
      element.classList.remove('path')
      hideContextMenu()
    }

    const addObstacleListener = (event) => {
      element.classList.add('obstacle')
      hideContextMenu()
    }

    const markAsFinishListener = (event) => {
      element.classList.add('finish')
      hideContextMenu()
    }

    const markAsStartListener = (event) => {
      //
      this.createCharacter(element)
      hideContextMenu()
    }

    const element = domElement.currentTarget

    contextMenuItems.deleteItem.addEventListener('click', deleteItemListener)
    contextMenuItems.addObstacle.addEventListener('click', addObstacleListener)
    contextMenuItems.markAsFinish.addEventListener('click', markAsFinishListener)
    contextMenuItems.markAsStart.addEventListener('click', markAsStartListener)
  }

  obServer () {
    if (this.pathCells > 5) {
      this.command.domElements().generatePathButton.classList.remove('hidden')
    }
  }
}
