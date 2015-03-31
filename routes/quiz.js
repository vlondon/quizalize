//general zzish config
var config = require('../config.js');
var email = require("../email");
var querystring = require('querystring');
var zzish = require("zzishsdk");
zzish.debugState(config.local,config.wso2);
zzish.init(config.quizAppToken); //TODO broken

exports.index =  function(req, res) {    
    res.render('index', {zzishapi : config.quizAppToken, isLocal:  config.local, wso2Enabled: config.wso2});
};

exports.create =  function(req, res) {
    req.session.zzishweburl = config.webUrl;
    res.render('create',{zzishapi : config.quizAppToken, isLocal:  config.local, wso2Enabled: config.wso2});
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

exports.voucher =  function(req, res) {
    res.sendFile('cquiz/index4.html',{ root: 'public' });
};


exports.service =  function(req, res) {
    res.render('service');
};

exports.privacy =  function(req, res) {
    res.render('privacy');
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


exports.getMyQuizzes = function(req, res){
    var profileId = req.params.profileId;
    //res.send([{name: "Zzish Quiz", uuid: "ZQ"}]);

    zzish.listContent(profileId, function(err, resp){
        console.log("My Quizzes", resp);
        res.send(resp);
    });
};

exports.getMyTopics = function(req, res){
    var profileId = req.params.profileId;
    //res.send([{name: "Zzish Quiz", uuid: "ZQ"}]);

    zzish.listCategories(profileId, function(err, resp){
        console.log("My Topics", resp);
        res.send(resp);
    });
};

exports.postTopic = function(req,res){
    var profileId = req.params.profileId;
    var data = req.body;

    console.log("postQuiz", "Body: ", req.body, "Params: ", req.params);

    zzish.postCategory(profileId, data.uuid, data.name, function(err, resp){
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

    zzish.getContent(profileId, id, function(err, resp){
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

    zzish.deleteContent(profileId, id, function(err, resp){
        res.send(err==undefined);
    });
};

exports.postQuiz = function(req,res){
    var profileId = req.params.profileId;
    var id= req.params.id;
    var data = req.body;
    data.profileId = profileId;;

    console.log("postQuiz", "Body: ", req.body, "Params: ", req.params);

    zzish.postContent(profileId, id, req.body.name, data, function(err, resp){
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

exports.publishQuiz = function(req, res){
    var profileId = req.params.profileId;
    var id = req.params.id;

    var email = req.body.emailAddress;
    var code = req.body.code;

    console.log("Will publish", profileId, id, email, code);

    zzish.publishContentToGroup(profileId, email, id, code, function(err, resp){
        if(!err){
            console.log("Got publish result", resp);
            resp.status = 200;
            resp.link = querystring.escape(resp.link);
            resp.link = config.webUrl + "/learning-hub/tclassroom/" + replaceAll("/","-----",resp.link)+"/live";
        } else {
            resp.status = err;
            resp.message = resp
        }
        res.send(resp);
    });
};


exports.help = function(req, res){
    //TODO update for class quiz...!
    //should have req.body.email, req.body.subject, req.body.message and req.body.name
    email.sendEmail('team@zzish.com',[req.body.email],'Zzish Learning Hub Support','Thanks very much for getting in touch with us.  This is an automatically generated email to let you know we have received your message and will be in touch with you soon.\n\nBest wishes,\n\nThe Zzish team.');
	email.sendEmail('admin@zzish.com',['developers@zzish.com'],'Help From Classroom Quiz',"Name: " + req.body.name + "\n\nSubject: " + req.body.subject +"\n\nBody" + req.body.message);
    res.send(true);
};
