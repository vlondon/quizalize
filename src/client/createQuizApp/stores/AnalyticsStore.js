var AppDispatcher = require('createQuizApp/dispatcher/CQDispatcher');
var AnalyticsConstants = require('createQuizApp/constants/AnalyticsConstants');

var EventEmitter = require('events').EventEmitter;


var CHANGE_EVENT = 'change';

var _analyticsEnabled = false;

var AnalyticsStore = Object.assign({}, EventEmitter.prototype, {

    analyticsEnabled: function() {
        return _analyticsEnabled;
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
AnalyticsStore.dispatchToken = AppDispatcher.register(function(action) {
    // var text;

    switch(action.actionType) {
        case AnalyticsConstants.ANALYTICS_CONVERSION_ENABLED:
            _analyticsEnabled = true;
            AnalyticsStore.emitChange();
            break;

        case AnalyticsConstants.ANALYTICS_CONVERSION_DISABLED:
            _analyticsEnabled = false;
            AnalyticsStore.emitChange();
            break;



        default:
            // no op
    }
});

module.exports = AnalyticsStore;
