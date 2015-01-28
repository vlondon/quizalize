// set variables for environment
var express = require('express'),
	app = express(),
	path = require('path'),
	favicon = require('serve-favicon'),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	config = require('./config'),
	quiz = require("./routes//quiz");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favcq.png'));
app.use(session({ secret: 'zzishdvsheep', cookie:{maxAge:1000*60*60}}));			// Session support
app.use(function(req,res,next){
	    res.locals.session = req.session;
	    res.locals.session.zzishurl = "http://zzish.github.io/zzishsdk-js/";
	    res.locals.session.zzishurl = "http://localhost:3000/dist/";
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

//Endpoints for teachers TODO rename appropriately

app.post('/create/profile', quiz.createProfile);

app.get('/quiz/token/:token', quiz.getProfileByToken);
app.get('/quiz/profile/:uuid', quiz.getProfileById);

app.get('/create/:profileId/quizzes/', quiz.getMyQuizzes);
app.get('/create/:profileId/quizzes/:id', quiz.getQuiz);
app.post('/create/:profileId/quizzes/:id/delete', quiz.deleteQuiz);
app.post('/create/:profileId/quizzes/:id', quiz.postQuiz);
app.post('/create/:profileId/quizzes/:id/publish', quiz.publishQuiz);

/*
Endpoints for students: actually we are making this client side
 */

app.get('/', quiz.landingpage);
app.get('/tool/', quiz.landingpage);
app.get('/quiz/', quiz.create);
app.get('/app/', quiz.index);
app.post('/quizHelp/', quiz.help);

app.get('/quiz/service', quiz.service);
app.get('/quiz/privacy', quiz.privacy);

//Things near top of list given priority
app.use(express.static('public'));

// Set server port
app.listen(3001);
console.log('Server is running, with configuration:', config);
