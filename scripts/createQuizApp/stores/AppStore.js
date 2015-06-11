var AppDispatcher = require('createQuizApp/dispatcher/CQDispatcher');
// var AnalyticsConstants = require('createQuizApp/constants/AnalyticsConstants');

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _apps = require('./AppData/Apps');

var AppStore = assign({}, EventEmitter.prototype, {

    getApps: function() {
        return _apps;
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
AppStore.dispatchToken = AppDispatcher.register(function(action) {
    // var text;

    switch(action.actionType) {
        // case AnalyticsConstants.ANALYTICS_CONVERSION_ENABLED:
        //     _analyticsEnabled = true;
        //     AppStore.emitChange();
        //     break;
        //
        // case AnalyticsConstants.ANALYTICS_CONVERSION_DISABLED:
        //     _analyticsEnabled = false;
        //     AppStore.emitChange();
        //     break;



        default:
            // no op
    }
});

module.exports = AppStore;
