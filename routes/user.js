var logger = require('../logger.js');  // logger
var email = require("../email"); //for sending emails
var zzish = require("../zzish"); //initialized zzish
var crypto = require('crypto'); //create encrypted password
var uuid = require('node-uuid'); //uuid generator

var algorithm = 'aes-256-ctr';
var password = '##34dsadfasdf££FE';

var handleError = function(err, res){
    if (err){
        logger.error(err);
        res.status(500).send(err);
    }
    return err;
};

function encrypt(text){
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}


exports.saveUser = function(req, res) {
    var profileId = req.params.profileId;
    zzish.saveUser(profileId, req.body, function(err, data){
        if (!err && typeof data === 'object') {
            res.status(200);
        }
        else {
            res.status(err);
        }
        res.send(data);
    });
};

exports.details = function(req, res) {
    var profileId = req.params.profileId;
    zzish.user(profileId, function(err, data){
        if (!err && typeof data === 'object') {
            res.status(200);
        }
        else {
            res.status(err);
        }
        res.send(data);
    });
};

exports.authenticate =  function(req, res) {
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    //at least password or code is required

    zzish.authenticate(userEmail, encrypt(userPassword), function(err, data) {
        if (!err && typeof data === 'object') {
            res.status(200).send(data);
        }
        else {
            res.status(500).send(err);
        }
    });
};

exports.register =  function(req, res) {
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    zzish.registerUser(userEmail, encrypt(userPassword), function(err, data) {
        if (!err) {
            res.status(200);
            email.sendEmailTemplate('team@zzish.com', [userEmail], 'Welcome to Quizalize', 'welcome', {name: "there"});
        }
        else {
            res.status(err);
        }
        res.send(data);
    });
};

exports.forget =  function(req, res) {
    var userEmail = req.body.email;
    zzish.authenticate(userEmail, null, function(err, data) {
        if (!err) {
            res.status(200);
            var link = "http://www.quizalize.com/quiz/reset/" + encrypt(data);
            email.sendEmailTemplate('team@zzish.com', [userEmail], 'Password Reset', 'passwordreset', {link: link});
        }
        else {
            res.status(err);
        }
        res.send(data);
    });
};

exports.completeRegistration = function(req, res) {
    logger.info("Will complete", req.body.password, req.body.code);
    var userId = decrypt(req.body.code);
    zzish.updatePassword(userId, encrypt(req.body.password), function(err, resp) {
        logger.trace("Result from Verifying User", err, resp);
        if (!err) {
            zzish.user(userId, function(err2, resp2) {
                if (!handleError(err2, res)){
                    res.send(resp2);
                }
            });
        }
        else {
            logger.error('Verify user error', err);
            res.status(err);
            res.send(resp);
        }
    });
};

exports.groups = function(req, res) {
    var profileId = req.params.profileId;
    zzish.listGroups(profileId, function(err, resp) {
        logger.trace("Result from List Groups", err, resp);
        if (!err) {
            res.status = 200;
        }
        else {
            logger.error('groups', err);
            res.status(err);
        }
        res.send(resp);
    });
};

exports.groupContents = function(req, res) {
    var profileId = req.params.profileId;
    zzish.listGroupContentForProfile(profileId, function(err, resp) {
        logger.trace("Result from List Groups Contents", err, resp);
        if (!err) {
            res.status = 200;
        }
        else {
            logger.error('groupContents', err);
            res.status(err);
        }
        res.send(resp);
    });
};
