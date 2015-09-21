/* @flow */
import {EventEmitter} from 'events';

var CHANGE_EVENT = 'change';

class Store extends EventEmitter {
    token: string;
    // setMaxListeners: Function;
    // getMaxListeners: Function;
    constructor() {
        super();
        console.trace('this', this);
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    addChangeListener(callback: Function) {
        // console.log('super', super);
        // var maxListeners = super.listenerCount;
        // var maxListeners = super.listeners().length;
        super.setMaxListeners(20);
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback: Function) {
        // var maxListeners = super.listenerCount;
        // super.setMaxListeners(Math.max(maxListeners - 1, 0));
        this.removeListener(CHANGE_EVENT, callback);
    }
}

// Store.dispatchToken = null;

export default Store;
