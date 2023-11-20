import {Game} from './modules/game.js';
import {Commands} from "./modules/commands";
import {Store} from "./modules/store";

// create a new instance of the Store class
const store = new Store('jupo_game');

// Create a new instance of the GameBoard class
const gameBoard = new Game(store);
gameBoard.create();

// Create a new instance of the LevelsLogic class
const levelLogic = new Commands(gameBoard, store);
levelLogic.run();










