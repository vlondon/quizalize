var AppDispatcher   = require('createQuizApp/dispatcher/CQDispatcher');
var QuizConstants   = require('createQuizApp/constants/QuizConstants');
var TopicConstants  = require('createQuizApp/constants/TopicConstants');
var QuizActions     = require('createQuizApp/actions/QuizActions');
var TopicStore      = require('createQuizApp/stores/TopicStore');
var EventEmitter    = require('events').EventEmitter;
var assign          = require('object-assign');
var uuid            = require('node-uuid');




var CHANGE_EVENT = 'change';

var _quizzes;
var _publicQuizzes = [];
var _fullQuizzes = {};
var _topics = [];
var storeInit = false;
var storeInitPublic = false;

var QuestionObject = function(quiz){

    var question = {
        alternatives: ['', '', ''],
        question: '',
        answer: '',
        latexEnabled: false,
        imageEnabled: false,
        uuid: uuid.v4()
    };
    if (quiz && quiz.payload.questions.length > 0) {
        var lastQuestion = quiz.payload.questions[quiz.payload.questions.length - 1];
        question.latexEnabled = lastQuestion.latexEnabled || false;
        question.imageEnabled = lastQuestion.imageEnabled || false;
    }

    return question;
};

var findPublicQuiz = function(quizId){
    var quizFound;
    _publicQuizzes.forEach(category =>{
        category.quizzes.forEach(quiz =>{
            if (quiz.uuid === quizId) {
                quizFound = quiz;
            }
        });
    });

    return quizFound;
};


var QuizStore = assign({}, EventEmitter.prototype, {

    getQuizzes: function() {
        console.log('_quizzes', _quizzes);
        if (_quizzes){
            var quizzes = _quizzes.slice();
            quizzes = quizzes.map(quiz => {
                quiz._category = TopicStore.getTopicById(quiz.meta.categoryId);
                return quiz;
            });
            quizzes.sort((a, b)=> a.meta.updated > b.meta.updated ? 1 : -1 );
        }
        return quizzes;
    },

    getQuizMeta: function(quizId) {
        for (var i in _quizzes) {
            if (_quizzes[i].uuid === quizId) {
                return _quizzes[i];
            }
        }
        return _fullQuizzes[quizId];
    },

    getQuiz: function(quizId){
        var fullQuiz = _fullQuizzes[quizId];
        if (fullQuiz === undefined){
            QuizActions.loadQuiz(quizId);
        }
        return fullQuiz;
    },

    getQuestion: function(quizId, questionIndex){
        var quiz = this.getQuiz(quizId);
        var question = quiz.payload.questions[questionIndex] || new QuestionObject(quiz);
        return question;
    },

    getPublicQuizzes: function(){
        if (!storeInitPublic){
            storeInitPublic = true;
            QuizActions.searchPublicQuizzes();
        }
        var publicQuizzes = _publicQuizzes.slice();
        // find their category
        publicQuizzes = publicQuizzes.map(quiz=>{
            quiz._category = TopicStore.getTopicById(quiz.meta.categoryId);
            return quiz;

        });

        // return _publicQuizzes;
        return publicQuizzes.reverse();
    },

    getPublicProfileQuizzes: function(profileId){
        if (!storeInitPublic){
            storeInitPublic = true;
            QuizActions.searchPublicQuizzes('', '', profileId);
        }
        var publicQuizzes = _publicQuizzes.slice();
        // find their category
        publicQuizzes = publicQuizzes.map(quiz=>{
            quiz._category = TopicStore.getTopicById(quiz.meta.categoryId);
            return quiz;

        });

        // return _publicQuizzes;
        return publicQuizzes.reverse();
    },

    getQuizOfTheDay: function(){
        return findPublicQuiz('f2742669-b4ad-4da2-8ef5-0f6f9cf7d15b');
        // console.log('_publicQuizzes', _publicQuizzes);
        // if (_publicQuizzes.length === 0) {
        //     return [];
        // } else {
        //     var quizIndex = Math.round(Math.random() * _publicQuizzes.length);
        //     console.log('quizoftheday', quizIndex, _publicQuizzes[quizIndex]);
        //     return _publicQuizzes[quizIndex].quizzes[0];
        // }

    },

    getTopics: function() {
        return _topics;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        if (!storeInit) {
            QuizActions.loadQuizzes();
            storeInit = true;
        }
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});


// Register callback to handle all updates
AppDispatcher.register(function(action) {

    switch(action.actionType) {
        case QuizConstants.QUIZZES_LOADED:
            _quizzes = action.payload.quizzes;
            _topics = action.payload.topics;
            QuizStore.emitChange();
            break;



        case QuizConstants.QUIZ_LOADED:
            AppDispatcher.waitFor([
                TopicStore.dispatchToken
            ]);
            var quiz = action.payload;
            _fullQuizzes[quiz.uuid] = quiz;
            QuizStore.emitChange();
            break;

        case QuizConstants.QUIZZES_PUBLIC_LOADED:
            _publicQuizzes = action.payload;
            QuizStore.emitChange();
            break;

        case QuizConstants.QUIZ_DELETED:
            var quizIdToBeDeleted = action.payload;
            var quizToBeDeleted = _quizzes.filter(q => q.uuid === quizIdToBeDeleted)[0];
            _quizzes.splice(_quizzes.indexOf(quizToBeDeleted), 1);
            QuizStore.emitChange();
            break;

        case QuizConstants.QUIZ_ADDED:
            var quizAdded = action.payload;
            _fullQuizzes[quizAdded.uuid] = quizAdded;
            // I can't update quizzes yet because the category needs to be set up
            // var i = _quizzes.filter(q=> q.uuid === quizAdded.uuid);
            // if (i.length === 0){
            //     _quizzes.push(quizAdded);
            // }

            QuizStore.emitChange();
            break;

        case QuizConstants.QUIZ_META_UPDATED:
            var quizToBeUpdated = action.payload;
            var quizFromArray = _quizzes.filter(q => q.uuid === quizToBeUpdated.uuid)[0];
            console.log('updating meta for ', quizFromArray, quizToBeUpdated);
            _quizzes[_quizzes.indexOf(quizFromArray)] = quizToBeUpdated;
            QuizStore.emitChange();
            break;

        case TopicConstants.PUBLIC_TOPICS_LOADED:
            break;

        default:
            // no op
    }
});
module.exports = QuizStore;
