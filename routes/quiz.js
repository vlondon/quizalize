//general zzish config
var config = require('../config.js');
var email = require("../email");
var querystring = require('querystring');
var zzish = require("zzishsdk");
var crypto = require('crypto'),algorithm = 'aes-256-ctr',password = '##34dsadfasdf££FE';
var QUIZ_CONTENT_TYPE = "quiz";

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

function getEncryptQuiz(profileId,id) {
    return encrypt(profileId+"----"+id);
}

function getDecryptQuiz(code) {    
    var decrypted = decrypt(code).split("----");
    return {
        profileId: decrypted[0],
        uuid: decrypted[1],
    }
}

exports.encryptQuiz = function(req,res) {
    var profileId = req.params.profileId;
    var id = req.params.id;
    res.send(getEncryptQuiz(profileId,id));
}

exports.decryptQuiz = function(req,res) {
    res.send(getDecryptQuiz(req.body.code));
}

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
        return "'"+config.zzishInit+"'";    
    }
}
zzish.init(getZzishParam(true)); //TODO broken

exports.index =  function(req, res) {
    if (req.session.quiz === undefined) {
        req.session.quiz = {};
    }
    console.log(req.session);
    res.render('index', {zzishapi : getZzishParam()});
};

exports.indexQuiz =  function(req, res) {
    zzish.getPublicContent('quiz', req.params.id, function(err, result) {
        if (!err) {
            req.session.quiz = result;
        }
        else {
            req.session.quiz = {};
        }
        res.redirect('/app#/play/public/' + req.params.id);
    });
};



exports.create =  function(req, res) {
    res.render('create',{zzishapi : getZzishParam()});
};

exports.landingpage =  function(req, res) {
    res.sendFile('cquiz/index.html',{ root: 'public' });
};

exports.landingpage2 =  function(req, res) {
    res.sendFile('cquiz/index2.html',{ root: 'public' });
};

exports.landingpage3 =  function(req, res) {
    res.sendFile('cquiz/index3.html',{ root: 'public' });
};

exports.landingpage4 =  function(req, res) {
    res.sendFile('cquiz/index5.html',{ root: 'public' });
};

exports.landingpage5 =  function(req, res) {
    res.sendFile('cquiz/landing11.html',{ root: 'public' });
};
exports.brightonlanding =  function(req, res) {
    res.sendFile('cquiz/brighton.html',{ root: 'public' });
};

exports.voucher =  function(req, res) {
    res.sendFile('cquiz/index4.html',{ root: 'public' });
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


exports.createProfile = function(req, res){
    var id = req.body.uuid;
    var name = "";

    zzish.createUser(id, name, function(err, resp){
       if(!err){
            res.send(200);
       } else{
            res.send(400);
       }
    });
};

/* For now only returns the first one */
function getClassCode(uuid,message,res) {
    zzish.listGroups(uuid,function(err,result) {
        if (!err) {
            if (result.length>0)  {
                //we have at least one class
                message.code = result[0].code;
            }
        }
        res.send(message)
    });    
}

exports.getProfileByToken = function(req,res) {
    var token = req.params.token;
    zzish.getCurrentUser(token,function(err,message) {
        if (!err) {
            getClassCode(message.uuid,message,res);
        }
        else {
            res.send(message);    
        }        
    })
};

exports.getProfileById = function(req,res) {
    var uuid = req.params.uuid;
    zzish.getUser(uuid,null,function(err,message) {
        if (!err) {
            getClassCode(uuid,message,res);            
        }
        else {
            res.send(err);
        }
    });

};

//NB As necessary these functions map between this App's data model and the general purpose Zzish content models.


exports.getPublicQuizzes = function(req, res){
    zzish.listPublicContent(QUIZ_CONTENT_TYPE,function(err, resp){
        res.send(resp);
    });
};

exports.getPublicQuiz = function(req, res){
    zzish.getPublicContent(QUIZ_CONTENT_TYPE,req.params.id, function(err, resp){
        res.send(resp);
    });
};


exports.getQuizzes = function(req,res) {
    var profileId = req.params.id;
    var ids = req.body.uuids;
    zzish.getContents(profileId,QUIZ_CONTENT_TYPE,ids,function(err,resp) {
        res.send(resp);
    })
}


exports.getMyQuizzes = function(req, res){
    var profileId = req.params.profileId;
    //res.send([{name: "Zzish Quiz", uuid: "ZQ"}]);

    zzish.listContent(profileId, QUIZ_CONTENT_TYPE,function(err, resp){
        res.send(resp);
    });
};

exports.getMyTopics = function(req, res){
    var profileId = req.params.profileId;
    //res.send([{name: "Zzish Quiz", uuid: "ZQ"}]);

    zzish.listCategories(profileId, function(err, resp){
        res.send(resp);
    });
};

exports.postTopic = function(req,res){
    var profileId = req.params.profileId;
    var data = req.body;

    zzish.postCategory(profileId, data, function(err, resp){
        if(!err){
            res.status = 200
        }else{
            res.status = 400
        }
        res.send();
    });
};

exports.deleteTopic = function(req,res){
    var profileId = req.params.profileId;
    var id = req.params.id;

    zzish.deleteCategory(profileId, id, function(err, resp){
        if(!err){
            res.status = 200
        }else{
            res.status = 400
        }
        res.send();
    });
};

exports.getQuiz = function(req, res){
    var id = req.params.id;
    var profileId = req.params.profileId;

    zzish.getContent(profileId, QUIZ_CONTENT_TYPE,id, function(err, resp){
        if(!err){
            console.log("request for content, got: ", resp);
            res.send(resp);
        }else{
            console.log("request for content, error: ", err);
            res.status = 400;
        }
    });
};

exports.deleteQuiz = function(req,res){
    var profileId = req.params.profileId;
    var id= req.params.id;

    zzish.deleteContent(profileId, QUIZ_CONTENT_TYPE,id, function(err, resp){
        res.send(err==undefined);
    });
};

exports.postQuiz = function(req,res){
    var profileId = req.params.profileId;
    var id= req.params.id;
    var data = req.body;
    data.profileId = profileId;;

    console.log("postQuiz", "Body: ", req.body, "Params: ", req.params);

    zzish.postContent(profileId, QUIZ_CONTENT_TYPE,data, function(err, resp){
        if(!err){
            res.status = 200
        }else{
            res.status = 400
        }
        res.send();
    });
};

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

exports.unpublishQuiz = function(req, res){
    var profileId = req.params.profileId;
    var id = req.params.id;
    var groupId = req.params.group;

    console.log("Will unpublish", profileId, id, groupId);

    zzish.unpublishContent(profileId, QUIZ_CONTENT_TYPE,id, groupId, function(err, resp){
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

    console.log("Will publish", profileId, id, data);

    zzish.publishContent(profileId, QUIZ_CONTENT_TYPE,id, data, function(err, resp){
        if(!err){
            console.log("Got publish result", resp);
            res.status = 200;
            var link = querystring.escape(resp.link);
            link = replaceAll("/","-----",link);
            link = replaceAll("\\\\","=====",link);
            resp.link = config.webUrl + "/learning-hub/tclassroom/" + link +"/live";
            resp.shareLink = resp.qcode;
        } else {
            var errorMessage = resp;
            resp = {};
            resp.message = errorMessage
            res.status = err;
        }
        res.send(resp);
    });
};

//we need to have a class code now
exports.shareQuiz = function(req, res){
    var profileId = req.params.profileId;
    var id = req.params.id;
    var emails = req.body.emails;
    var quiz = req.body.quiz;
    var emailFrom = req.body.email;
    var link = req.body.link;

    if (link==undefined) {
        link = "http://quizalize.com/quiz#/share/" + quiz.code;
    }
    if (emails!=undefined) {
        email.sendEmail('team@zzish.com',emails,'You have been shared a quiz!','Hi there, you have been shared the quiz ' + quiz + ' by ' + emailFrom + '. Click on the following link to access this quiz:\n\n' + link + '\n\nBest wishes,\n\nThe Quizalize team.');
    }
};

exports.getQuizByCode = function(req,res) {
    zzish.getContentByCode(QUIZ_CONTENT_TYPE,req.params.code,function (err,result) {
        res.send(result);
    })
}


exports.help = function(req, res){
    //TODO update for class quiz...!
    //should have req.body.email, req.body.subject, req.body.message and req.body.name
    var name = "Hi There,\n\n";
    if (req.body.name!=undefined && req.body.name!="") {
        name = "Hi " + req.body.name + "\n\n"; 
    }
    email.sendEmail('team@zzish.com',[req.body.email],'Quizalize Help',name + 'Thanks very much for getting in touch with us.  This is an automatically generated email to let you know we have received your message and will be in touch with you soon.\n\nBest wishes,\n\nThe Quizalize team.');
	email.sendEmail('admin@zzish.com',['developers@zzish.com'],'Help From Classroom Quiz',"Name: " + req.body.name + "\n\nBody" + req.body.message+"\n\nEmail\n\n" + req.body.email);
    res.send(true);
};

exports.getQuizResults = function(req,res) {
    zzish.getContentResults(req.params.id,QUIZ_CONTENT_TYPE,req.params.quizId,function (err,result) {
        res.send(result);
    })    
}

exports.quizoftheday = function(req,res) {
    res.render('quizoftheday',{quiz: { title: 'Space'}});
}