var config = require('../config.js');
var zzish = require("../zzish"); //initialized zzish

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

        if (meta) event.metadata = meta;
        console.log("event meta", meta);
        intercom.createEvent(event, function(err, resp) {
            console.log("Intercom trackEvent createEvent err, response");
            var result = "" + err;
            try {
                if (err) {
                    if (result.indexOf("IntercomError") !== -1) {
                        result = "{\"IntercomError\"" + result.substring(13)  + "}";
                    }
                    result = JSON.parse(result);
                    if (result.IntercomError.errors.length > 0 && result.IntercomError.errors[0].code === "not_found") {
                        console.log("USER doesnt exist on intercom");
                        zzish.user(userId, function(err, data){
                            if (!err && typeof data === 'object') {
                                console.log("USER", data);
                                var user = {
                                    user_id: data.uuid,
                                    name: data.name,
                                    email: data.email,
                                    custom_attributes: data.attributes
                                };
                                exports.createUser(user, function(err) {
                                    if (!err) {
                                        intercom.createEvent(event, function(err, resp) {
                                            if (callback) callback(err, resp);
                                        });
                                    }
                                });
                            }
                            else {
                                if (callback) callback(err, resp);
                            }
                        });
                    }
                }
                else {
                    if (callback) callback(err, resp);
                }
            }
            catch (e) {
                if (callback) callback(e);
            }
        });
    }
};

exports.events = function(req, res){
    if (req.session.user) {
        var profileId = req.session.user.uuid;
        exports.trackEvent(profileId, req.params.name, req.body, function(err, resp) {
            console.log("Intercom events respones");
            if (!err) {
                res.send(resp);
            }
            else {
                res.send(err.message);
            }
        });
    }
};
