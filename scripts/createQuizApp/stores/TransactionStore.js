/* @flow */
import Store from './Store';

import AppDispatcher from './../dispatcher/CQDispatcher';

var defaultCurrency = 'uk';

var us:Array<number> = [
    0,
    0.99,
    1.99,
    2.99,
    3.99,
    4.99,
    5.99,
    6.99,
    7.99,
    8.99,
    9.99,
    10.99,
    11.99,
    12.99,
    13.99,
    14.99
];

var uk:Array<number> = [
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

var _prices = { uk, us };

class TransactionStore extends Store {

    dispatchToken: ?number;
    constructor(){
        super();
    }

    getPrices():Array<number> {
        return _prices[defaultCurrency].slice();
    }

    getPriceInCurrency(amount : number, country : string) : number {
        var index = _prices[defaultCurrency].indexOf(amount);
        return _prices[country][index];
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
