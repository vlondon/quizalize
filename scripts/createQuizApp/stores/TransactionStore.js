var AppDispatcher = require('createQuizApp/dispatcher/CQDispatcher');

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var CHANGE_EVENT = 'change';


var _prices = [
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

var TransactionStore = assign({}, EventEmitter.prototype, {

    getPrices: function(){
        return _prices.slice();
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});


// Register callback to handle all updates
TransactionStore.dispatchToken = AppDispatcher.register(function(action) {
    // var text;

    switch(action.actionType) {

        default:
            // no op
    }
});

module.exports = TransactionStore;
