// set variables for environment
var express = require('express'),
	app = express(),
	path = require('path'),
	favicon = require('serve-favicon'),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	config = require('./config'),
  email = require('./email'),
	quiz = require("./routes/quiz"),
  user = require("./routes/user");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favcq.png'));
app.use(session({ secret: 'zzishdvsheep', cookie:{maxAge:1000*60*60}}));			// Session support
app.use(function(req,res,next){
	    res.locals.session = req.session;
	    res.locals.session.zzishsdkurl = config.zzishsdkurl;
	    next();
	});
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded());

//The static pages:
app.get('/quiz/view/:page', function(req, res){
  res.render('static/' + req.params.page);
});

app.get('/quiz/create', quiz.create);
app.get('/amazon-twitter-voucher', quiz.voucher);

//Endpoints for teachers TODO rename appropriately

app.post('/user/authenticate', user.authenticate);
app.post('/user/register', user.register);
app.post('/user/forget', user.forget);
app.post('/users/register', user.registerEmail);
app.post('/users/complete', user.completeRegistration);
app.get('/users/:profileId/groups', user.groups);
app.get('/users/:profileId/groups/contents', user.groupContents);


app.post('/create/profile', quiz.createProfile);

app.get('/quiz/token/:token', quiz.getProfileByToken);
app.get('/quiz/profile/:uuid', quiz.getProfileById);
app.get('/quiz/code/:code', quiz.getQuizByCode);
app.post('/quizzes/:id/load', quiz.getQuizzes);


app.get('/create/:profileId/topics/', quiz.getMyTopics);
app.post('/create/:profileId/topics/', quiz.postTopic);
app.post('/create/:profileId/topics/:id/delete', quiz.deleteTopic);

app.get('/create/:profileId/quizzes/', quiz.getMyQuizzes);
app.get('/create/:profileId/quizzes/:id', quiz.getQuiz);
app.post('/create/:profileId/quizzes/:id/delete', quiz.deleteQuiz);
app.post('/create/:profileId/quizzes/:id', quiz.postQuiz);

app.get('/create/:profileId/quizzes/:id/encrypt',quiz.encryptQuiz);
app.post('/create/:profileId/quizzes/:id/decrypt',quiz.decryptQuiz);

app.post('/create/:profileId/quizzes/:id/share', quiz.shareQuiz);
app.post('/create/:profileId/quizzes/:id/publish', quiz.publishQuiz);
app.post('/create/:profileId/quizzes/:id/:group/unpublish', quiz.unpublishQuiz);


app.get('/quizzes/public', quiz.getPublicQuizzes);
app.get('/quizzes/:profileId/public/assigned', quiz.getAssignedPublicQuizzes);

/*


Endpoints for students: actually we are making this client side
 */

app.get('/', checkForMobile, quiz.landingpage);
app.get('/mobile', quiz.landingpage2);
app.get('/ie', quiz.landingpage3);

app.get('/tool/', quiz.landingpage);
app.get('/quiz/', quiz.create);
app.get('/app/', quiz.index);
app.post('/quizHelp/', quiz.help);

app.get('/quiz/service', quiz.service);
app.get('/quiz/privacy', quiz.privacy);
app.get('/quiz/find-a-quiz', quiz.quizFinder);

//Things near top of list given priority
app.use(express.static('public'));

// Set server port
app.listen(process.env.port || 3001);
console.log('Server is running, with configuration:', config);
email.pingDevelopers();

// returns true if the caller is a mobile phone (not tablet)
// compares the user agent of the caller against a regex
// This regex comes from http://detectmobilebrowsers.com/
function isCallerMobile(req) {
  var ua = req.headers['user-agent'].toLowerCase(),
  isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));
  return !!isMobile;
}

function isIE(req) {
  var ua = req.headers['user-agent'].toLowerCase(),
  isIE = /MSIE 8.0/i.test(ua) || /MSIE 9.0/i.test(ua)
  return isIE;
}

 
// note: the next method param is passed as well
function checkForMobile(req, res, next) {
  // check to see if the caller is a mobile device
  var isMobile = isCallerMobile(req);
 
  if (isMobile) {
    console.log("Going mobile");
    res.redirect('/mobile');
  } else if (isIE(req)) {
    console.log("Going IE");
    res.redirect('/ie');
  } else {
    // if we didn't detect mobile, call the next method, which will eventually call the desktop route
    return next();
  }
}
