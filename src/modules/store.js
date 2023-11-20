import {Config} from "./config";

export class Store {

    namespace = 'game';

    constructor(namespace) {
        this.namespace = namespace;
    }

    storeCommands(commands) {
        console.log('storeCommands', commands);
        this._storage().setItem(this.getCommandKey(), JSON.stringify(commands));
    }

    getCommands() {
        return JSON.parse(this._storage().getItem(this.getCommandKey()) || '[]');
    }

    getCommandKey() {
        return this.namespace + '_' + Config.COMMAND_STORAGE_KEY;
    }


    _storage() {
        return window.localStorage;
    }

}
