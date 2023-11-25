import {Level3} from "./level3";

export class Level4 extends Level3 {

    constructor(storage, command) {
        super(storage, command);
        console.log('Level 4');
    }

    create() {
        super.create();

    }
}
