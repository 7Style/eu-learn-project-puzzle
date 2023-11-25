import {Store} from "./modules/store";
import {Game} from "./modules/game";
import {Level2} from "./modules/level2";
import {Level4} from "./modules/level4";
import {Level3} from "./modules/level3";

// create a new instance of the Store class
const store = new Store('jupo_game');
// Create a new instance of the GameBoard class

const level = store.getLevel();
let gameBoard = null;

console.log('level =>', level)

switch (parseInt(level)) {
    case 1:
        gameBoard = new Game(store);
        break;
    case 2:
        gameBoard = new Level2(store);
        break;
    case 3:
        gameBoard = new Level3(store);
        break;
    case 4:
        gameBoard = new Level4(store);
        break;
    default:
        gameBoard = new Game(store);
        break;
}

if (gameBoard) {
    gameBoard.create();
}











