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


exports.saveUser = function(user){
    return new Promise(function(resolve, reject){
        var profileId = user.uuid;
        zzish.saveUser(profileId, user, function(err, data){
            if (!err && typeof data === 'object') {
                var interomUser = {
                    'user_id': data.uuid,
                    'name': data.name,
                    'custom_attributes': data.attributes,
                    'created_at': Math.round(data.created / 1000)
                };
                logger.info('INTERCOM USER', interomUser);
                intercom.updateUser(interomUser);
                resolve(data);
            }
            else {
                reject({err, data});
            }
        });
    });

};
exports.saveUserRequest = function(req, res) {
    if (req.session.user === undefined) {
        res.status(401).send('Not authorized');
    } else {
        exports.saveUser(req.body)
            .then((data) => {
                req.session.user = data;
                res.status(200).send(data);
            })
            .catch(({err, data}) => {
                res.status(err).send(data);
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
    logger.info('Creating new user for', userEmail);
    zzish.registerUser(userEmail, encrypt(userPassword), function(err, user) {
        if (!err) {

            // user.attributes.accountType = 0;
            // user.attributes.accountTypeUpdated = Date.now();

            req.session.user = user;
            logger.info('Setting account type for', userEmail);
            exports.saveUser(user)
                .then(()=>{
                    logger.info('saving session');
                    res.send(user);
                })
                .catch(()=>{
                    res.status(err).send();
                });
            email.sendEmailTemplate("'Quizalize Team' <team@quizalize.com>", [userEmail], 'Welcome to Quizalize', 'welcome', {name: "there"});
        }
        else {
            res.status(err);
        }
        res.send(user);
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

exports.discoveryPromotion = function(req, res){
    console.log('session?', req.session.user);
    var profileId = req.session.user.uuid;
    zzish.user(profileId, function(err, user){
        console.log('user.attributes.accountType', user.attributes.accountType);
        if(parseInt(user.attributes.accountType, 10) === 1) {
            res.status(200).send();
        } else {
            if (!err && parseInt(user.attributes.accountType, 10) === 0 ) {

                user.attributes.accountType = 1;
                user.attributes.accountTypeUpdated = Date.now();

                exports.saveUser(user)
                    .then((data) => {
                        req.session.user = user;
                        res.status(200).send(data);
                    })
                    .catch(({err, data}) => {
                        res.status(err).send(data);
                    });


            } else {
                res.status(500).send(err);
            }
        }
    // console.log('user', user);
    });
};
