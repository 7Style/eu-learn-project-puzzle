import { Config } from './config'

export class Store {
  namespace = 'game'

  constructor (namespace) {
    this.namespace = namespace
  }

  storeCommands (commands) {
    console.log('storeCommands', commands)
    this._storage().setItem(this._getStorageKey(Config.COMMAND_STORAGE_KEY), JSON.stringify(commands))
  }

  getCommands () {
    return JSON.parse(this._storage().getItem(this._getStorageKey(Config.COMMAND_STORAGE_KEY)) || '[]')
  }

  storeLevel (level) {
    this._storage().setItem(this._getStorageKey(Config.LEVEL_STORAGE_KEY), level)
  }

  getLevel (level) {
    return this._storage().getItem(this._getStorageKey(Config.LEVEL_STORAGE_KEY))
  }

  clearLevel () {
    this._storage().removeItem(this._getStorageKey(Config.LEVEL_STORAGE_KEY))
  }

  clearCommands () {
    // this._storage().removeItem(this._getStorageKey(Config.COMMAND_STORAGE_KEY));
  }

  _getStorageKey (key) {
    return this.namespace + '_' + key
  }

  _storage () {
    return localStorage
  }
}
