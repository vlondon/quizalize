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
            res.status(200);
        }
        else {
            res.status(err);
        }
        res.send(data);
    });
};

exports.register =  function(req, res) {
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    zzish.registerUser(userEmail, encrypt(userPassword), function(err, data) {
        if (!err) {
            res.status(200);
            var registerEmail = "Hi there\n\nQuizalize is an easy and fast way to create, share and set pupils quizzes. You can create your subject specific quizzes which can then be shared with other teachers as well as set as work for particular classes or pupils. Most importantly it saves you time from all that lengthy paperwork by providing a website that allows you to store and amend quizzes to suit you and your pupils needs. \n\nQuizalize plugs into the Zzish Learning Hub, which provides one dashboard with live data being recorded from pupils in the classroom.\n\nThe Quizalize Team\nwww.quizalize.com";
            email.sendEmail('team@zzish.com', [userEmail], 'Welcome to Quizalize', registerEmail);
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
            var registerEmail = "Hi there\n\nClick on the following link to reset your password:\n\n" + link + "\n\nThe Quizalize Team\nwww.quizalize.com";
            email.sendEmail('team@zzish.com', [userEmail], 'Password Reset', registerEmail);
        }
        else {
            res.status(err);
        }
        res.send(data);
    });
};

//
exports.registerEmail = function(req, res){


    logger.info("Will register", req.body.emailAddress);

    zzish.registerUser( req.body.emailAddress, '', function(err, resp){
        logger.trace("Result from Register User", err, resp);
        if (!err) {
            res.status(200);
            var link = "http://www.quizalize.com/quiz#/account/complete/" + encrypt(resp.uuid);
            var registerEmail = "Welcome to Quizalize\n\nThanks very much for entering your email address. Before you can log in and see your quizzes, you need to complete your registration. Just click on the following link:\n\n" + link + "\n\nThe Quizalize Team\nwww.quizalize.com";
            email.sendEmail('team@zzish.com', [req.body.emailAddress], 'Welcome to Quizalize!', registerEmail);
        }
        else {
            res.status(err);
        }
        res.send(resp);
    });
};

exports.completeRegistration = function(req, res) {
    logger.info("Will complete", req.body.password, req.body.code);
    var userId = decrypt(req.body.code);
    zzish.updatePassword(userId, encrypt(req.body.password), function(err, resp) {
        logger.trace("Result from Verifying User", err, resp);
        if (!err) {
            zzish.user(uuid, function(err2, resp2) {
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
