    //general zzish config
var config = require('../config.js');
//for sending emails
var email = require("../email");
//initialized zzish
var zzish = require("../zzish");
//create encrypted password
var crypto = require('crypto');

var encrypt = function(pass) {
    if (pass!="") {
        return crypto.createHash('md5').update(pass).digest('hex');
    }
    return "";
}

exports.authenticate =  function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    zzish.authenticate(email,encrypt(password),function(err,data) {
        if (!err) {
            res.status(200);
        }
        else {
            res.status(err);
        }
        res.send(data);
    })
}

exports.register =  function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    zzish.registerUser(email,encrypt(password),function(err,data) {
        if (!err) {
            res.status(200);
        }
        else {
            res.status(err);
        }
        res.send(data);
    })
}

exports.forget =  function(req, res) {
    var email = req.body.email;
    zzish.authenticate(email,null,function(err,data) {
        if (!err) {
            res.status(200);
        }
        else {
            res.status(err);
        }
        res.send(data);
    })
}