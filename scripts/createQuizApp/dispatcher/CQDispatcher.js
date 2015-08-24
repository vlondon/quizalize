var Dispatcher = require('flux').Dispatcher;

var vomitify = function(f) {
    return function() {
        try {
            f.apply(this, arguments);
        } catch(e) {
            console.error(e.stack);
        }
    };
};


var AppDispatcher = Object.assign(new Dispatcher(), {

    handleViewAction: function(action) {
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        });
    },

    handleServerAction: function(action) {
        this.dispatch({
            source: 'SERVER_ACTION',
            action: action
        });
    },

    register: function(f) {
        return Dispatcher.prototype.register.call(this, vomitify(f));
    }

});

module.exports = AppDispatcher;
