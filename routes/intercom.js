var config = require('../config.js');

//general zzish config
var Intercom = require('intercom.io');

var options = {
  apiKey: process.env.intercomKey,
  appId: process.env.intercomAppId
};


var intercom = new Intercom(options);

exports.createUser = function(user, callback){
  if (process.env.intercom == "true") {
    intercom.createUser(user, function(err, resp) {
      if (callback) callback(err, resp);
    });
  }
};

exports.updateUser = function(user, callback) {
  if (process.env.intercom == "true") {
    intercom.updateUser(user, function(err, resp) {
      if (callback) callback(err, resp);
    });
  }
};


exports.trackEvent = function(userId, event_name, meta, callback){
  if (config.webUrl === "https://www.zzish.com/") {
    var event = {};
    if (!event.created_at) event.created_at = parseInt(Date.now() / 1000);

    event.user_id = userId;
    event.event_name = event_name;
    if (meta) event.meta_data = meta;
    intercom.createEvent(event, function(err, resp) {
      if (callback) callback(err, resp);
    });
  }
};

exports.events = function(req, res){
  exports.trackEvent(req.params.uuid, req.params.name, req.body, function(err, resp) {
    if (!err) {
      res.send(resp);
    }
    else {
      res.send(err.message);
    }
  });
};
