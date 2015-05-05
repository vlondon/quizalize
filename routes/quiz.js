//general zzish config
var config = require('../config.js');
var email = require("../email");
var querystring = require('querystring');
var zzish = require("zzishsdk");


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
    res.render('index', {zzishapi : getZzishParam()});
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
    var profileId = req.params.profileId;
    //res.send([{name: "Zzish Quiz", uuid: "ZQ"}]);

    zzish.listPublicContent(profileId, function(err, resp){
        res.send(resp);
    });
};

exports.deletePublicQuiz = function(req, res){
    var profileId = req.params.profileId;
    var groupCode = req.params.groupCode;
    var uuid = req.params.uuid;            

    zzish.unassignPublicContent(profileId,groupCode,uuid, function (err,resp) {
        res.send(resp);
    })
};

exports.getAssignedPublicQuizzes = function(req, res){
    var profileId = req.params.profileId;
    var groupCode = req.params.groupCode;

    zzish.getAssignedPublicContents(profileId,groupCode, function (err,resp) {
        res.send(resp);
    })
};




exports.getMyQuizzes = function(req, res){
    var profileId = req.params.profileId;
    //res.send([{name: "Zzish Quiz", uuid: "ZQ"}]);

    zzish.listContent(profileId, function(err, resp){
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

    zzish.postContent(profileId, data, function(err, resp){
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

    zzish.unpublishContent(profileId, id, groupId, function(err, resp){
        if(!err){
            res.send({status: 200});
        } else {
            res.send({status: err, message: resp});
        }
    });
};

exports.republishQuiz = function(req, res){
    var profileId = req.params.profileId;
    var id = req.params.id;
    var groupId = req.params.group;

    console.log("Will republish", profileId, id, groupId);

    zzish.republishContent(profileId, id, groupId, function(err, resp){
        if(!err){
            res.send({status: 200});
        } else {
            res.send({status: err, message: resp});
        }

    });
};

exports.publishQuiz = function(req, res){
    var profileId = req.params.profileId;
    var id = req.params.id;

    var data = {};
    if (req.body.code!=undefined && req.body.code!='') {
        data['code'] = req.body.code;
    }
    data['email'] = req.body.emailAddress;
    data['access'] = -1;

    console.log("Will publish", profileId, id, data);

    zzish.publishContentToGroup(profileId, id, data, function(err, resp){
        if(!err){
            console.log("Got publish result", resp);
            resp.status = 200;
            resp.link = querystring.escape(resp.link);
            resp.link = config.webUrl + "/learning-hub/tclassroom/" + replaceAll("/","-----",resp.link)+"/live";
            if (resp.complete!=undefined) {
                var registerEmail = "Welcome to Quizalize\n\nYou recently used Quizalize where you requested to save some information. Quizalize is an easy and fast way to create, share and set pupils quizzes. You can create your subject specific quizzes which can then be shared with other teachers as well as set as work for particular classes or pupils. Most importantly it saves you time from all that lengthy paperwork by providing a website that allows you to store and amend quizzes to suit you and your pupils needs. \n\nQuizalize plugs into the Zzish Learning Hub, which provides one dashboard with live data being recorded from pupils in the classroom. It can be used for multiple apps, including Quizalize. Our Zzish App Login allows you to record live data you gather using all the apps now on the Zzish Learning Hub and we securely save your data on our servers for you.You just need to complete your registration by clicking on the link below:\n\n" + resp.complete + "\n\nThe Zzish Team\nwww.zzish.com";
                email.sendEmail('team@zzish.com',[req.body.emailAddress],'Register with Quizalize Powered By Zzish',registerEmail);
            }
        } else {
            var errorMessage = resp;
            resp = {};
            resp.status = err;
            resp.message = errorMessage
        }
        res.send(resp);
    });
};


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
