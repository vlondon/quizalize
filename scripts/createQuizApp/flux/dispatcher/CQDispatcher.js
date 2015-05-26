var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

var vomitify = function(f) {
    return function() {
        try {
            f.apply(this, arguments);
        } catch(e) {
            console.error(e.stack);
        }
    };
};


var AppDispatcher = assign(new Dispatcher(), {

    handleViewAction: function(action) {
        console.log(action);
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        });
    },

    handleServerAction: function(action) {
        console.log(action);
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
