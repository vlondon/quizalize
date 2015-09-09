var config = require('../config.js');

//general zzish config
var Intercom = require('intercom.io');

var options = {
    apiKey: process.env.intercomKey,
    appId: process.env.intercomAppId
};

var intercom;
if (process.env.intercom === "true") {
    intercom = new Intercom(options);
}

exports.createUser = function(user, callback){
    console.log("Intercom createUser", user);
    console.log("Intercom createUser ENV", process.env.intercom);
    if (process.env.intercom === "true") {
        intercom.createUser(user, function(err, resp) {
            console.log("Intercom createUser result", err, resp);

            if (callback) callback(err, resp);
        });
    }
};

exports.updateUser = function(user, callback) {
    console.log("Intercom updateUser", user);

    if (process.env.intercom === "true") {
        intercom.updateUser(user, function(err, resp) {
            console.log("Intercom updateUser err", err, "Intercom updateUser resp",resp);

            if (callback) callback(err, resp);
        });
    }
};


exports.trackEvent = function(userId, event_name, meta, callback){
    console.log("Intercom trackEvent ENV", process.env.intercom);

    if (process.env.intercom === "true") {
        var event = {};

        if (!event.created_at) event.created_at = parseInt(Date.now() / 1000, 10);
        console.log("Intercom trackEvent created_at", event.created_at);
        event.user_id = userId;
        event.event_name = event_name;
        console.log("Intercom trackEvent event", event);

        if (meta) event.meta_data = meta;
        console.log("event meta", meta);
        intercom.createEvent(event, function(err, resp) {
            console.log("Intercom trackEvent createEvent err, response", err, resp);

            if (callback) callback(err, resp);
        });
    }
};

exports.events = function(req, res){

    exports.trackEvent(req.params.uuid, req.params.name, req.body, function(err, resp) {
        console.log("Intercom events", req);
        if (!err) {
            res.send(resp);
        }
        else {
            res.send(err.message);
        }
    });
};
