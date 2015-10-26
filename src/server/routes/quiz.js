/* eslint no-extra-boolean-cast: 0 */

var crypto          = require('crypto');
//general zzish config
var config          = require('../config.js');
var email           = require("../email");
var querystring     = require('querystring');
var zzish           = require("zzishsdk");
var crypto          = require('crypto');
var logger          = require('../logger');
var uploadHelper    = require('./helpers/uploadHelper');

var algorithm = 'aes-256-ctr';
var password = '##34dsadfasdf££FE';

var QUIZ_CONTENT_TYPE = "quiz";

var handleError = function(err, res){
    if (err){
        logger.error(err);
        res.status(500).send(err);
    }
    return err;
};

var publicConfig = {
    stripeKey: config.stripeKey,
    zzishInit: config.zzishInit.replace(/[']/g, '"')
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

function getEncryptQuiz(profileId, id) {
    return encrypt(profileId + "----" + id);
}

function getDecryptQuiz(code) {
    var decrypted = decrypt(code).split("----");
    return {
        profileId: decrypted[0],
        uuid: decrypted[1]
    };
}

exports.encryptQuiz = function(req, res) {
    var profileId = req.params.profileId;
    var id = req.params.id;
    res.send(getEncryptQuiz(profileId, id));
};

exports.decryptQuiz = function(req, res) {
    res.send(getDecryptQuiz(req.params.token));
};

function getZzishParam(parse) {
    try {
        var x  = JSON.parse(config.zzishInit);
        if (!!parse) {
            return x;
        }
        else {
            return config.zzishInit;
        }
    }
    catch (err) {
        return "'" + config.zzishInit + "'";
    }
}
zzish.init(getZzishParam(true)); //TODO broken

exports.index =  function(req, res) {

    var params = {
        zzishapi: getZzishParam(),
        devServer: process.env.ZZISH_DEVMODE,
        publicConfig: publicConfig,
        intercomId: process.env.intercomAppId
    };

    if (req.query.uuid !== undefined) {
        zzish.getPublicContent('quiz', req.query.uuid, function(err, result) {

            if (!err) {
                params.quiz = result;
            }
            res.render('index', params);
        });
    }
    else {
        res.render('index', params);
    }

};

exports.indexQuiz =  function(req, res) {
    res.redirect(301, '/app?uuid=' + req.params.id + '#/play/public/' + req.params.id);
};

function loadUser(res, user) {
    res.render('create', {
        zzishapi: getZzishParam(),
        devServer: process.env.ZZISH_DEVMODE,
        publicConfig,
        intercomId: process.env.intercomAppId,
        user
    });
}

exports.create =  function(req, res) {
    var session = req.session;
    if (req.session.token) {
        //validate token
        zzish.getCurrentUser(req.session.token, function(err, data){
            var user = {};
            if (!err && typeof data === 'object') {
                user = data;
            }
            else {
                req.session.token = null;
                req.session.user = null;
            }
            loadUser(res, user);
        });
    }
    else {
        loadUser(res, session.user || {});
    }
};

exports.landingpage =  function(req, res) {
    var intercomId = process.env.intercomAppId || 'mnacdt52';
    res.render('home', {
        intercomId: intercomId,
        devServer: process.env.ZZISH_DEVMODE
    });
};


exports.landingpage3 =  function(req, res) {
    res.sendFile('cquiz/index3.html', { root: 'public' });
};

exports.landingpage4 =  function(req, res) {
    res.sendFile('cquiz/index5.html', { root: 'public' });
};


exports.brightonlanding =  function(req, res) {
    res.sendFile('cquiz/brighton.html', { root: 'public' });
};
exports.maths =  function(req, res) {
    res.sendFile('cquiz/maths.html', { root: 'public' });
};

exports.voucher =  function(req, res) {
    res.sendFile('cquiz/index4.html', { root: 'public' });
};

exports.service =  function(req, res) {
    res.render('service');
};

exports.privacy =  function(req, res) {
    res.render('privacy');
};

exports.quizFinder =  function(req, res) {
    res.render('quizFinder');
};


exports.quizOfTheDay1 = function(req, res){
    res.render('baseLayoutQuizOfTheDay1');
};

exports.packages = function (req, res){
    res.render('packages');
};

exports.faq = function(req, res){
    res.render('faq');
};
exports.landing = function(req, res){
    res.render('landing');
};
exports.publishers = function(req,res){
    res.render('publishers');
};

exports.publisher = function(req, res){
    res.render('publisher');
};

exports.terms = function(req, res){
    res.render('terms');
};
exports.privacypolicy = function(req, res){
    res.render('privacypolicy');
};
exports.coppa = function(req, res){
    res.render('coppa');
};

exports.createProfile = function(req, res){
    var id = req.body.uuid;
    var name = "";

    zzish.createUser(id, name, function(err){
        if(!handleError(err, res)){
           res.send(200);
        }
    });
};

/* For now only returns the first one */
function getClassCode(uuid, message, res) {
    zzish.listGroups(uuid, function(err, result) {
        if (!err) {
            if (result.length > 0)  {
                //we have at least one class
                message.code = result[0].code;
            }
        }
        res.send(message);
    });
}

exports.getProfileByToken = function(req, res) {
    var token = req.params.token;
    zzish.getCurrentUser(token, function(err, message) {
        if (!err) {
            getClassCode(message.uuid, message, res);
        }
        else {
            res.send(message);
        }
    });
};

exports.getProfileById = function(req, res) {
    var uuid = req.params.uuid;
    zzish.getUser(uuid, null, function(err, message) {
        if (!err) {
            getClassCode(uuid, message, res);
        }
        else {
            res.send(err);
        }
    });

};

//NB As necessary these functions map between this App's data model and the general purpose Zzish content models.


exports.getPublicQuizzes = function(req, res){
    zzish.listPublicContent(QUIZ_CONTENT_TYPE, function(err, resp){
        if (!handleError(err, res)) {
            logger.trace('Quiz categories?', resp.categories);
            if (resp.contents) {
                var contents = [];
                for (var i in resp.contents) {
                    var content = resp.contents[i];
                    if (content.meta && content.meta.live) {
                        contents.push(content);
                    }
                }
                resp.contents = contents;
            }
            res.send(resp);
        }
    });
};

exports.getPublicQuiz = function(req, res){
    zzish.getPublicContent(QUIZ_CONTENT_TYPE, req.params.id, function(err, resp){
        if (!handleError(err, res)) {
            res.send(resp);
        }
    });
};


exports.getMyQuizzes = function(req, res){
    var profileId = req.params.profileId;
    //res.send([{name: "Zzish Quiz", uuid: "ZQ"}]);

    zzish.listContent(profileId, QUIZ_CONTENT_TYPE, function(err, resp){
        if (!handleError(err, res)) {
            res.send(resp);
        }
    });
};

exports.getTopics = function(req, res){
    zzish.listPublicContent(QUIZ_CONTENT_TYPE, function(err, resp){
        if (!handleError(err, res)) {
            res.send(resp);
        }
    });
};

exports.getUserTopics = function(req, res){
    var profileId = req.params.profileId;
    zzish.listCategories(profileId, function(err, resp){
        if (!handleError(err, res)) {
            res.send(resp);
        }
    });
};

exports.postTopic = function(req, res){
    var profileId = req.params.profileId;
    var data = req.body;

    zzish.postCategory(profileId, data, function(err){
        if(!err){
            res.status = 200;
        }else{
            res.status = 400;
        }
        res.send();
    });
};

exports.deleteTopic = function(req, res){
    var profileId = req.params.profileId;
    var id = req.params.id;

    zzish.deleteCategory(profileId, id, function(err){
        if(!err){
            res.status = 200;
        }else{
            res.status = 400;
        }
        res.send();
    });
};

exports.getQuiz = function(req, res){
    var id = req.params.id;
    var profileId = req.session.user.uuid;

    // var profileId = req.params.profileId;
    logger.debug('Loading Quiz', id);
    zzish.getContent(profileId, QUIZ_CONTENT_TYPE, id, function(err, resp){
        logger.debug('Quiz loaded', id, err, resp);
        if (!handleError(err, res)) {
            res.send(resp);
        }
    });
};

exports.deleteQuiz = function(req, res){
    var profileId = req.params.profileId;
    var id = req.params.id;

    zzish.deleteContent(profileId, QUIZ_CONTENT_TYPE, id, function(err){
        if (!handleError(err, res)) {
            res.send(true);
        }
    });
};

exports.postQuiz = function(req, res){
    var profileId = req.params.profileId;
    var data = req.body;

    if (data.meta.created === undefined){
        data.meta.created = Date.now();
    }
    data.meta.updated = Date.now();
    logger.trace("data.meta", JSON.stringify(data.meta));

    zzish.postContent(profileId, QUIZ_CONTENT_TYPE, req.params.id, data.meta, data.payload, function(err){
        if (!err) {
            res.status = 200;

            zzish.getPublicContent(QUIZ_CONTENT_TYPE, req.params.id, function(err2, quiz){
                if (!handleError(err2, res)) {
                    res.send(quiz);
                }
            });

        } else{
            res.status = 400;
            res.send();
        }
    });
};

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

exports.unpublishQuiz = function(req, res){
    var profileId = req.params.profileId;
    var id = req.params.id;
    var groupId = req.params.group;

    logger.trace("Will unpublish", profileId, id, groupId);

    zzish.unpublishContent(profileId, QUIZ_CONTENT_TYPE, id, groupId, function(err, resp){
        if(!err){
            res.send({status: 200});
        } else {
            res.send({status: err, message: resp});
        }
    });
};

//we need to have a class code now
exports.publishQuiz = function(req, res){
    var profileId = req.params.profileId;
    var id = req.params.id;

    var data = req.body;

    logger.trace("Will publish", profileId, id, data);

    zzish.publishContent(profileId, QUIZ_CONTENT_TYPE, id, data, function(err, resp){
        if(!err){
            logger.trace("Got publish result", resp);
            res.status = 200;
            var link = querystring.escape(resp.link);
            link = replaceAll("/", "-----", link);
            link = replaceAll("\\\\", "=====", link);
            resp.link = config.webUrl + "/learning-hub/tclassroom/" + link + "/live";
            if (resp.content.meta && resp.content.meta.originalQuizId) {
                //getReviewForPurchasedQuiz(resp.content, res);
            }
            //resp.shareLink = resp.content.meta.code;
        } else {
            var errorMessage = resp;
            resp = {};
            resp.message = errorMessage;
            res.status = err;
        }
        res.send(resp);
    });
};

exports.publishToMarketplace = function(req,res) {
    var profileId = req.params.profileId;
    var id = req.params.id;
    var quiz = req.body;

    zzish.postContent(profileId, QUIZ_CONTENT_TYPE, id, quiz.meta, quiz.payload, function(err2, message) {
        zzish.getUser(profileId, null, function(err, user) {
            var name = "there";
            if (user.name) name = user.name;
            var params = {
                name: name
            };
            email.sendEmailTemplate("'Quizalize Team' <team@quizalize.com>", [user.email], 'Thanks for submitting your quiz to the Quizalize Marketplace', 'publishrequest', params);
            email.sendEmailTemplate("'Quizalize Team' <team@quizalize.com>", ['team@quizalize.com'], 'New Publish Request', 'publishrequestadmin', {
              profileId: profileId,
              id: id,
              type: 'quiz'
            });
            res.send();
        });
    });
};

//we need to have a class code now
exports.shareQuiz = function(req, res){

    var emails = req.body.emails;
    var quiz = req.body.quiz;
    var emailFrom = req.body.email;
    var link = req.body.link;

    if (link === undefined) {
        logger.info('quiz', quiz);
        var code = getEncryptQuiz(quiz.meta.profileId, quiz.uuid);
        link = "http://quizalize.com/quiz/quizzes/s/" + code;
    }
    if (emails !== undefined) {
        var params = {
            quiz: quiz.meta.name,
            from: emailFrom,
            link: link
        };
        logger.info('sending email', typeof emails, emails);
        email.sendEmailTemplate("'Quizalize Team' <team@quizalize.com>", emails, 'Someone shared a quiz with you on Quizalize!', 'shared', params);
    }
    res.send(true);
};

var getReviewForPurchasedQuiz = function(quiz, res){
    zzish.getUser(quiz.profileId, null, function(err, user) {
        if (!handleError(err, res)) {
            if (user && user.email) {
                //var code = encrypt
                if (!quiz.meta.askedForReview) {
                    quiz.meta.askedForReview = true;
                    zzish.postContent(quiz.profileId, QUIZ_CONTENT_TYPE, quiz.uuid, quiz.meta, quiz.content, function(err2, message) {
                        if (!handleError(err2, res)) {
                            var params = {
                                name: quiz.meta.name,
                                link: "http://www.quizalize.com/quiz/review/" + quiz.uuid
                            };
                            email.sendEmailTemplate("'Quizalize Team' <team@quizalize.com>", [user.email], 'What did you think of ' + quiz.meta.name + '?', 'feedback', params);
                        }
                    });
                }
            }
        }
    });
};

exports.getQuizByCode = function(req, res) {
    zzish.getContentByCode(QUIZ_CONTENT_TYPE, req.params.code, function (err, result) {
        if (!handleError(err, res)) {
            res.send(result);
        }
    });
};


exports.help = function(req, res){
    //TODO update for class quiz...!
    //should have req.body.email, req.body.subject, req.body.message and req.body.name
    var name = "Hi There, \n\n";
    if (req.body.name !== undefined && req.body.name !== "") {
        name = "Hi " + req.body.name + "\n\n";
    }
    var params = {
        name: name
    };
    email.sendEmailTemplate("'Quizalize Team' <team@quizalize.com>", [req.body.email], 'Quizalize Help', 'help', params);
    var params2 = {
        name: req.body.name,
        message: req.body.message,
        email: req.body.email
    };
    email.sendEmailTemplate('admin@zzish.com', ['developers@zzish.com'], 'Help from Quizalize', 'dhelp', params2);
    res.send(true);
};

exports.getQuizResults = function(req, res) {
    zzish.getContentResults(req.params.id, QUIZ_CONTENT_TYPE, req.params.quizId, function (err, result) {
        if (!handleError(err, res)) {
            res.send(result);
        }
    });
};

exports.quizoftheday = function(req, res) {
    res.render('quizoftheday', {quiz: { title: 'Space'}});
};


exports.uploadMedia = function(req, res){

    var path = req.files.image.path;

    var hash = crypto.randomBytes(20).toString('hex');
    var extension = path.split('.')[1];
    var newName =  hash + '.' + extension;
    var profileId = req.params.profileId;
    var sizeX = req.body.sizeX || 600;
    var sizeY = req.body.sizeY || 600;
    var crop = req.body.crop !== undefined ? req.body.crop : true;
    logger.trace('Image crop', crop);
    var folder = req.body.folder || 'quiz';

    uploadHelper.uploadPicture(profileId, path, newName, folder, 'original').then(function(){
        logger.trace('Image scaled start', path);

        uploadHelper.resizeImage(path, newName, sizeX, sizeY, crop).then(function(processedPath){
            logger.trace('Image scaled successfully', processedPath);

            uploadHelper.uploadPicture(profileId, processedPath, newName, folder).then(function(result){
                res.json(result);
                uploadHelper.deleteFile(path);
                uploadHelper.deleteFile(processedPath);
            });

        }).catch(function(){ res.json(false); });

    }).catch(function(){ res.json(false); });
};
