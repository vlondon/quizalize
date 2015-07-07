/* @flow */
import {EventEmitter} from 'events';

var CHANGE_EVENT = 'change';

class Store extends EventEmitter {
    token: string;
    constructor() {
        super();
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    addChangeListener(callback: Function) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback: Function) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}

// Store.dispatchToken = null;

export default Store;
