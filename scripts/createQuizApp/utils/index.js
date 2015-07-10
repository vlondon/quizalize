/* @flow */
export var urlParams = function() : Object {
    var search = window.location.search;
    return search.substring(1).split('&').reduce(function(result, value) {
        var parts = value.split('=');
        if (parts[0]){ result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]); }
        return result;
    }, {});
};
