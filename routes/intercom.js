//general zzish config
var Intercom = require('intercom.io');
var options = {
  apiKey: "2f83eafd4c62128e001ba6de9084277311ca726c",
  appId: "mnacdt52"
};

var intercom = new Intercom(options);

exports.createUser = function(user, callback){
  intercom.createUser(user, function(err, resp) {
    if (callback) callback(err, resp);
  });
};

exports.updateUser = function(user, callback) {
  intercom.updateUser(user, function(err, resp) {
    if (callback) callback(err, resp);
  });
};

exports.trackEvent = function(userId, event_name, meta, callback){
  var event = {};
  if (!event.created_at) event.created_at = parseInt(Date.now()/1000);

  event.user_id = userId;
  event.event_name = event_name;
  if (meta) event.meta_data = meta;
  intercom.createEvent(event, function(err, resp) {
    if (callback) callback(err, resp);
  });
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
