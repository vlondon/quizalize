//general zzish config
var uuid                = require('node-uuid');
var zzish               = require("zzishsdk");
var fs                  = require('fs');
var APP_CONTENT_TYPE    = "app";
var QUIZ_CONTENT_TYPE   = "quiz";
var AWS                 = require('./../awssdk');
var userHelper          = require('./helpers/userHelper');
var Promise             = require('es6-promise').Promise;
var logger              = require('../logger');
var email           = require("../email");

exports.list = function(req, res){
    var profileId = req.params.profileId;
    //res.send([{name: "Zzish Quiz", uuid: "ZQ"}]);

    zzish.listContent(profileId, APP_CONTENT_TYPE, function(err, resp){
        res.send(resp);
    });
};

exports.listPublicApps = function(req, res){
    var profileId = '44ddfbd4-7bec-4691-8089-9bde07766111';
    //res.send([{name: "Zzish Quiz", uuid: "ZQ"}]);
    var now = Date.now();
    var lastWeek = now - 7 * 24 * 60 * 60 * 1000;
    var mongoQuery = {
        $gt: lastWeek
    };

    zzish.searchContent(profileId, 'quiz', {updated: mongoQuery}, function(err, resp){
        res.send(resp);
    });

};


exports.get = function(req, res){
    var id = req.params.id;
    var profileId = req.params.profileId;
    logger.info('id', id);
    logger.info('profileId', profileId);

    zzish.getContent(profileId, APP_CONTENT_TYPE, id, function(err, resp){
        if(!err){
            logger.trace("request for content, got: ", resp);
            res.send(resp);

        }else{
            logger.error("request for content, error: ", err);
            res.status(400).send(err);
        }
    });
};

exports.getPublic = function(req, res){
    var id = req.params.id;
    logger.info('id', id === 'undefined');
    // logger.info('profileId', profileId);

    var getQuiz = function(quizId){
        return new Promise(function(resolve, reject){
            logger.trace('trying to load', quizId);
            zzish.getPublicContent(QUIZ_CONTENT_TYPE, quizId, function(err, resp){
                if (!err) {
                    delete resp.payload;
                    resolve(resp);
                } else {
                    reject();
                }
            });
        });
    };


    zzish.getPublicContent(APP_CONTENT_TYPE, id, function(err, resp){
        logger.info('resp', resp);
        if(!err){
            // res.send(resp);
            if (resp.payload && resp.payload.quizzes) {
                logger.info('Payload', res.payload);
                var promises = resp.payload.quizzes.map(function(quiz){ return getQuiz(quiz); });
                Promise.all(promises)
                    .then(function(values){
                        resp.extra = {
                            quizzes: values
                        };
                        userHelper.addUserToExtra(resp)
                            .then(function(respWithUser){
                                res.send(respWithUser);
                            })
                            .catch(function(error){
                                res.status(500).send(error);
                            });
                        // res.send(resp);
                    });

            } else {
                res.status(400).send();
            }
        }else{
            res.status(400).send();
        }
    });
};


exports.delete = function(req, res){
    var profileId = req.params.profileId;
    var id = req.params.id;

    zzish.deleteContent(profileId, APP_CONTENT_TYPE, id, function(err, resp){
        res.send(err === undefined);
    });
};

exports.post = function(req, res){
    var profileId = req.params.profileId;
    var data = req.body;

    data.uuid = data.uuid || uuid.v4();
    data.meta.profileId = data.meta.profileId || profileId;
    data.meta.created = data.meta.created || Date.now();

    data.meta.updated = Date.now();
    data.meta.quizzes = data.payload.quizzes.join(',');

    zzish.postContent(profileId, APP_CONTENT_TYPE, req.params.id, data.meta, data.payload, function(err, resp){
        if (!err) {
            res.status = 200;
        } else{
            res.status = 400;
        }
        res.send();
    });
};


exports.postIcon = function(req, res){
    var path = req.files.image.path;

    fs.readFile(path, function(err, fileBuffer){
        if (err){
            res.error(err);
        } else {

            var profileId = req.params.profileId;
            var id = req.params.id;
            var s3 = new AWS.S3();

            var params = {
                Bucket: 'zzish-upload-assets',
                Key: profileId + '/id_' + id + '.' + path.split('.')[1],
                Body: fileBuffer,
                ACL: 'public-read'
            };


            s3.putObject(params, function (perr, data) {
                if (perr) {
                    logger.error('Error uploading data: ', perr);
                    res.json(false);
                } else {
                    logger.trace('Successfully uploaded data to myBucket/myKey', data);
                    res.json(params.Key);
                }
                fs.unlink(path);
            });
        }
    });
};

exports.publishToMarketplace = function(req, res) {
    var profileId = req.params.profileId;
    var id = req.params.id;
    var app = req.body;

    zzish.postContent(profileId, APP_CONTENT_TYPE, id, app.meta, app.payload, function(err2, message) {
        zzish.getUser(profileId, null, function(err, user) {
            var name = "there";
            if (user.name) name = user.name;
            var params = {
                name: name
            };
            email.sendEmailTemplate('team@quizalize.com', [user.email], 'Thanks for submitting your app to the Quizalize Marketplace', 'publishrequest', params);
            email.sendEmailTemplate('team@quizalize.com', ['team@quizalize.com'], 'New Publish Request', 'publishrequestadmin', {
              profileId: profileId,
              type: 'app',
              id: id
            });
            res.send();
        });
    });
}
