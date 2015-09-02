// set variables for environment
require('pmx').init();
var express     = require('express');
var app         = express();
var path        = require('path');
var favicon     = require('serve-favicon');
var session     = require('express-session');
var bodyParser  = require('body-parser');
var logger      = require('./logger');

var config      = require('./config');
var email       = require('./email');
var quiz        = require('./routes/quiz');
var appContent  = require('./routes/appContent');
var transaction = require('./routes/transaction');
var user        = require('./routes/user');
var search      = require('./routes/search');
var admin      = require('./routes/admin');
var marketplace      = require('./routes/marketplace');

var proxy       = require('express-http-proxy');
var multer      = require('multer');
var compression = require('compression');
var intercom = require('./routes/intercom');




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, '/public/favcq.png')));
app.use(
    session(
        {
            secret: 'zzishdvsheep',
            cookie: { maxAge: 1000 * 60 * 60 },
            resave: true,
            saveUninitialized: true
        }
    )
);            // Session support

app.use(function(req, res, next){
    res.locals.session = req.session;
    res.locals.session.zzishsdkurl = config.zzishsdkurl;
    next();
});


app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({dest: './uploads/'})); // Image uploads
app.use(compression());

//The static pages:
app.get('/quiz/view/:page', function(req, res){
  res.render('static/' + req.params.page);
});

app.get('/quiz/create', quiz.create);


//Endpoints for teachers TODO rename appropriately

app.post('/user/authenticate', user.authenticate);
app.post('/user/register', user.register);
app.post('/user/forget', user.forget);
app.post('/user/token', user.token);
app.post('/users/complete', user.completeRegistration);
app.get('/users/:profileId/groups', user.groups);
app.get('/users/:profileId/groups/contents', user.groupContents);
app.get('/user/:profileId', user.details);
app.post('/user/search', user.search);
app.post('/user/:profileId', user.saveUser);
app.post('/email/', email.sendDocumentEmail);

app.post('/user/:uuid/events/:name', intercom.events);

app.post('/create/profile', quiz.createProfile);

app.get('/quiz/token/:token', quiz.getProfileByToken);
app.get('/quiz/profile/:uuid', quiz.getProfileById);

app.get('/quiz/public', function(req, res){
    res.redirect(301, '/quiz/marketplace');
});
app.get('/quiz/*', checkForIE, quiz.create);
app.get('/profile/*', checkForIE, quiz.create);
app.get('/quiz', checkForIE, quiz.create);


app.get('/users/:id/quizzes/:quizId/results', quiz.getQuizResults);


app.get('/create/:profileId/topics/', quiz.getUserTopics);
app.get('/create/topics/', quiz.getTopics);
app.post('/create/:profileId/topics/', quiz.postTopic);
app.post('/create/:profileId/topics/:id/delete', quiz.deleteTopic);

app.get('/create/:profileId/quizzes/', quiz.getMyQuizzes);
app.get('/create/:profileId/quizzes/:id', quiz.getQuiz);
app.post('/create/:profileId/quizzes/:id/delete', quiz.deleteQuiz);
app.post('/create/:profileId/quizzes/:id', quiz.postQuiz);


app.get('/create/:profileId/apps/', appContent.list);
app.get('/create/:profileId/apps/:id', appContent.get);
app.post('/create/:profileId/apps/:id/delete', appContent.delete);
app.post('/create/:profileId/apps', appContent.post);
app.post('/create/:profileId/apps/:id', appContent.post);
app.post('/create/:profileId/apps/:id/icon', appContent.postIcon);
app.post('/create/:profileId/apps/:id/publishToMarketplace', appContent.publishToMarketplace);

if (process.env.admin === "true") {
    app.get('/admin/', admin.index);
    app.get('/admin/approved', admin.approved);
    app.get('/admin/pending', admin.pendingQuizzes);
    app.get('/admin/stats', admin.stats);
    app.get('/admin/metrics', admin.metrics);
    app.post('/admin/approve/:type/:id', admin.approve);
    app.post('/admin/approvefirst/:type/:id', admin.approvefirst);
}

app.get('/create/:profileId/transaction/', transaction.list);
app.get('/create/:profileId/transaction/process', transaction.process);
app.get('/create/:profileId/transaction/:id', transaction.get);
// app.post('/create/:profileId/transaction/:id/delete', appContent.delete);
app.post('/create/:profileId/transaction', transaction.post);
app.post('/create/:profileId/transaction/:id', transaction.post);



app.get('/apps/', appContent.listPublicApps);
app.get('/apps/:id', appContent.getPublic);
// app.get('/create/:profileId/apps/:id', appContent.get);
// app.post('/create/:profileId/apps/:id/delete', appContent.delete);
// app.post('/create/:profileId/apps/:id', appContent.post);
// app.post('/create/:profileId/apps/:id/icon', appContent.postIcon);

app.get('/marketplace/quiz/:id', marketplace.getQuiz);



app.get('/search/quizzes', search.getQuizzes);
app.post('/search/quizzes', search.getQuizzes);
app.get('/search/apps', search.getApps);
app.post('/search/apps', search.getApps);

app.get('/create/:profileId/quizzes/:id/encrypt', quiz.encryptQuiz);
app.get('/create/:profileId/decrypt/:token', quiz.decryptQuiz);

app.post('/create/:profileId/quizzes/:id/share', quiz.shareQuiz);
app.post('/create/:profileId/quizzes/:id/publish', quiz.publishQuiz);
app.post('/create/:profileId/quizzes/:id/publishToMarketplace', quiz.publishToMarketplace);
app.post('/create/:profileId/quizzes/:id/:group/unpublish', quiz.unpublishQuiz);


app.get('/quizzes/public', quiz.getPublicQuizzes);
app.get('/quizzes/public/:id', quiz.getPublicQuiz);




///// QUIZ OF THE DAY PAGES ////

app.get('/quiz-of-the-day-1', quiz.quizOfTheDay1);
app.get('/packages', quiz.packages);
app.get('/faq', quiz.faq);
app.get('/terms', quiz.terms);
app.get('/privacy-policy', quiz.privacypolicy);
app.get('/COPPA-policy', quiz.coppa);
app.get('/landing', quiz.landing);

/*



Endpoints for students: actually we are making this client side
 */


app.get('/', quiz.landingpage);
app.get('/ie', quiz.landingpage3);
app.get('/ks4-gcse-maths', quiz.landingpage4);
app.get('/maths', quiz.maths);
app.get('/brighton', quiz.brightonlanding);


app.get('/tool/', quiz.landingpage);
app.get('/quiz/', quiz.create);
app.get('/app/', quiz.index);
app.get('/qapp/:id', quiz.indexQuiz);
app.post('/quizHelp/', quiz.help);

app.get('/quiz/service', quiz.service);
app.get('/quiz/privacy', quiz.privacy);
app.get('/quiz/find-a-quiz', quiz.quizFinder);

if (process.env.ZZISH_DEVMODE === 'true'){
    app.get('/js/*', proxy('http://localhost:7071', {
        forwardPath: function(req) {
            logger.debug('froward path', require('url').parse(req.url).path);
            return require('url').parse(req.url).path;
        }
    }));
}

//Things near top of list given priority
app.use(express.static('public'));

// Set server port
app.listen(process.env.PORT || 3001);
logger.info('Server is running, with configuration:', config);
email.pingDevelopers();


function isIE(req) {
    var ua = req.headers['user-agent'].toLowerCase(),
        isIECheck = /MSIE 8.0/i.test(ua) || /MSIE 9.0/i.test(ua);
    return isIECheck;
}


function checkForIE(req, res, next){
    if (isIE(req)){
        logger.info('Redirecting to IE');
        res.redirect('/ie');
    }
    else {
        return next();
    }
}
