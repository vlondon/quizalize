/* @flow */
import Store from './Store';

import AppDispatcher from './../dispatcher/CQDispatcher';




var _prices:Array<number> = [
    0,
    0.79,
    1.49,
    2.29,
    2.99,
    3.99,
    4.49,
    4.99,
    5.99,
    6.99,
    7.99,
    8.49,
    8.99,
    9.99
];

class TransactionStore extends Store {

    dispatchToken: ?number;
    constructor(){
        super();
    }

    getPrices():Array<number> {
        return _prices.slice();
    }
}

var transactionStoreInstance = new TransactionStore();



// Register callback to handle all updates
transactionStoreInstance.dispatchToken = AppDispatcher.register(function(action) {
    // var text;

    switch(action.actionType) {

        default:
            // no op
    }
});

module.exports = transactionStoreInstance;
