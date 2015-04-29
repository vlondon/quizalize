//general zzish config
var config = require('../config.js');
//for sending emails
var email = require("../email");
//initialized zzish
var zzish = require("../zzish");
//create encrypted password
var crypto = require('crypto');

exports.authenticate =  function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    zzish.authenticate(email,password,function(err,data) {
        res.send(err,data);
    })
}

exports.register =  function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    zzish.registerUser(email,password,function(err,data) {
        res.send(err,data);
    })
}

exports.forget =  function(req, res) {
    var email = req.body.email;
    zzish.authenticate(email,null,function(err,data) {
        res.send(err,data);
    })
}