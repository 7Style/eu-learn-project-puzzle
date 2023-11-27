import {Level3} from "./level3";

export class Level4 extends Level3 {

    constructor(storage, command) {
        super(storage, command);
        console.log('Level 4');
        this.showNotices("Coming soon...");
        this.command.domElements().generatePathButton.classList.add('hidden');
    }

    create() {
        super.create();

    }
}
