//general zzish config
var config = require('../config.js');
//for sending emails
var email = require("../email");
//initialized zzish
var zzish = require("../zzish");
//create encrypted password
var crypto = require('crypto'),algorithm = 'aes-256-ctr',password = '##34dsadfasdf££FE';
//uuid generator
var uuid = require('node-uuid');

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

exports.authenticate =  function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    //at least password or code is required
    zzish.authenticate(email,encrypt(password),function(err,data) {
        if (!err && typeof data == 'object') {
            res.status(200);
        }
        else {
            res.status(err);
        }
        res.send(data);
    })        
}

exports.register =  function(req, res) {
    var email1 = req.body.email;
    var password = req.body.password;
    zzish.registerUser(email1,encrypt(password),function(err,data) {
        if (!err) {
            res.status(200);
            var registerEmail = "Hi there\n\nQuizalize is an easy and fast way to create, share and set pupils quizzes. You can create your subject specific quizzes which can then be shared with other teachers as well as set as work for particular classes or pupils. Most importantly it saves you time from all that lengthy paperwork by providing a website that allows you to store and amend quizzes to suit you and your pupils needs. \n\nQuizalize plugs into the Zzish Learning Hub, which provides one dashboard with live data being recorded from pupils in the classroom.\n\nThe Quizalize Team\nwww.quizalize.com";
            email.sendEmail('team@zzish.com',[req.body.emailAddress],'Welcome to Quizalize',registerEmail);            
        }
        else {
            res.status(err);
        }
        res.send(data);
    })
}

exports.forget =  function(req, res) {
    var email1 = req.body.email;
    zzish.authenticate(email1,null,function(err,data) {
        if (!err) {
            res.status(200);
            var link = "http://www.quizalize.com/quiz#/account/reset/"+encrypt(data);
            var registerEmail = "Hi there\n\nClick on the following link to reset your password:\n\n" + link + "\n\nThe Quizalize Team\nwww.quizalize.com";
            email.sendEmail('team@zzish.com',[req.body.emailAddress],'Password Reset',registerEmail);                        
        }
        else {
            res.status(err);
        }
        res.send(data);
    })
}

//
exports.registerEmail = function(req, res){
    var profileId = req.params.profileId;
    var id = req.params.id;
    
    console.log("Will register",  req.body.emailAddress);

    zzish.registerUser( req.body.emailAddress,'', function(err, resp){        
        console.log("Result from Register User",err,resp);
        if (!err) {
            res.status(200);
            var link ="http://www.quizalize.com/quiz#/account/complete/"+encrypt(resp.uuid);
            var registerEmail = "Welcome to Quizalize\n\nThanks very much for entering your email address. Before you can log in and see your quizzes, you need to complete your registration. Just click on the following link:\n\n" + link + "\n\nThe Quizalize Team\nwww.quizalize.com";
            email.sendEmail('team@zzish.com',[req.body.emailAddress],'Welcome to Quizalize!',registerEmail);
        }
        else {
            res.status(err);
        }
        res.send(resp);
    });
};

exports.completeRegistration = function(req,res) {
    console.log("Will complete",  req.body.password, req.body.code);
    var uuid = decrypt(req.body.code);
    zzish.updatePassword(uuid,encrypt(req.body.password), function(err,resp) {
        console.log("Result from Verifying User",err,resp);
        if (!err) {
            zzish.user(uuid, function(err,resp) {
                res.send(resp);                
            });
        }
        else {
            res.status(err);
            res.send(resp);        
        }        
    })
}

exports.groups = function(req,res) {
    var profileId = req.params.profileId;
    zzish.listGroups(profileId,function(err,resp) {
        console.log("Result from List Groups",err,resp);
        if (!err) {
            res.status = 200;
        }
        else {
            res.status(err);
        }   
        res.send(resp);     
    })
}

exports.groupContents = function(req,res) {
    var profileId = req.params.profileId;
    zzish.listGroupContentForProfile(profileId,function(err,resp) {
        console.log("Result from List Groups Contents",err,resp);
        if (!err) {
            res.status = 200;
        }
        else {
            res.status(err);
        }   
        res.send(resp);     
    })
}