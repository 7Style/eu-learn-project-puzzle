import {Level2} from "./level2";

export class Level3 extends Level2 {

    constructor(storage, command) {
        super(storage, command);
        console.log('Level 3');
    }

    create() {
        super.create();
    }
}
