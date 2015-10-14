var logger = require('../logger.js');  // logger
var email = require("../email"); //for sending emails
var zzish = require("../zzish"); //initialized zzish
var crypto = require('crypto'); //create encrypted password
var intercom = require("./intercom");

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
    if (req.session.user === undefined) {
        res.status(401).send('Not authorized');
    } else {
        var profileId = req.session.user.uuid;
        zzish.saveUser(profileId, req.body, function(err, data){
            if (!err && typeof data === 'object') {
                req.session.user = data;
                var user = {
                    'user_id': data.uuid,
                    'name': req.body.name,
                    'custom_attributes': req.body.attributes,
                    'created_at': Math.round(data.created / 1000)
                };
                logger.info('INTERCOM USER', user);
                intercom.updateUser(user);
                res.status(200);
            }
            else {
                res.status(err);
            }
            res.send(data);
        });
    }
};

exports.details = function(req, res) {
    if (req.session && req.session.user){
        var profileId = req.session.user.uuid;
        zzish.user(profileId, function(err, data){
            if (!err && typeof data === 'object') {
                console.log('we got user', data);
                var uuid = data.uuid;
                req.session.userUUID = uuid;
                res.status(200);
            }
            else {
                req.session.userUUID = undefined;
                res.status(err);
            }
            res.send(data);
        });
    } else {
        res.status(404).send(JSON.stringify('user not found'));
    }
};

exports.search = function(req, res) {
    zzish.userByAttributes(req.body, function(err, data){
        if (!err && typeof data === 'object') {
            res.status(200);
        }
        else {
            res.status(err);
        }
        res.send(data);
    });
};

exports.token =  function(req, res) {
    var token = req.body.token;
    zzish.getCurrentUser(token, function(err, data) {
        if (!err && typeof data === 'object') {
            data.token = token;
            req.session.token = token;
            req.session.user = data;
            intercom.trackEvent(data.uuid, 'logged_in');
            res.status(200).send(data);
        }
        else {
            res.status(500).send(err);
        }
    });
};

exports.authenticate =  function(req, res) {
    var userEmail = req.body.email;
    var userPassword = req.body.password;

    //at least password or code is required
    zzish.authenticate(userEmail, encrypt(userPassword), function(err, data) {
        if (!err && typeof data === 'object') {

            req.session.user = data;
            intercom.trackEvent(data.uuid, 'logged_in');
            res.status(200).send(data);
        }
        else {
            res.status(500).send(err);
        }
    });
};

exports.logout = function(req, res){
    req.session.destroy();
    res.status(200).send();
};

exports.register =  function(req, res) {
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    zzish.registerUser(userEmail, encrypt(userPassword), function(err, data) {
        if (!err) {
            req.session.user = data;
            res.status(200);
            intercom.createUser({
                'email': userEmail,
                'user_id': data.uuid,
                'created_at': Date.now() / 1000
            });
            email.sendEmailTemplate("'Quizalize Team' <team@quizalize.com>", [userEmail], 'Welcome to Quizalize', 'welcome', {name: "there"});
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
            email.sendEmailTemplate("'Quizalize Team' <team@quizalize.com>", [userEmail], 'Password Reset', 'passwordreset', {link: link});
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
