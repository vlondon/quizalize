var AppDispatcher       = require('createQuizApp/dispatcher/CQDispatcher');
var QuizConstants       = require('createQuizApp/constants/QuizConstants');
var QuizApi             = require('createQuizApp/actions/api/QuizApi');
var Promise             = require('es6-promise').Promise;
var TopicStore          = require('createQuizApp/stores/TopicStore');
var TopicActions        = require('createQuizApp/actions/TopicActions');
var router                  = require('createQuizApp/config/router');
var uuid                = require('node-uuid');
var UserStore           = require('createQuizApp/stores/UserStore');

var debounce            = require('createQuizApp/utils/debounce');


var createNewTopicsForQuiz = function(quiz){

    var questions = quiz.payload.questions;

    var createTopicForQuestion = function(question){
        var topic = TopicStore.getTopicById(question.topicId);
        console.log("Creating new topic for", topic);
        // we create a new topic and save it
        topic = {
            uuid: uuid.v4(),
            name: topic.name,
            subContent: true,
            parentCategoryId: quiz.meta.categoryId
        };
        TopicActions.createTopic(topic);
        return topic.uuid;
    };

    if (questions && questions.length > 0) {
        questions = questions.map(function(question){
            if (question.topicId === "-1") {
                question.topicId = createTopicForQuestion(question);
            }
            return question;
        });
    }

    return quiz;
};


var QuizActions = {

    loadQuizzes: function(){

        var quizzesPromise = QuizApi.getQuizzes();

        quizzesPromise
            .then(quizzes => {

                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZZES_LOADED,
                    payload: {
                        quizzes: quizzes
                    }
                });
            });
    },


    loadQuiz: function(quizId){

        var quizPromise = QuizApi.getQuiz(quizId);

        quizPromise
            .then((quiz) => {

                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZ_LOADED,
                    payload: quiz
                });

            });
    },


    saveReview: function(purchased){

        return new Promise(function(resolve, reject){

            var savePurchased = QuizApi.putQuiz(purchased);
            var getOriginal = QuizApi.getQuiz(purchased.meta.originalQuizId);

            Promise.all([savePurchased, getOriginal])
                .then((value) => {
                    var quiz = value[1];

                    quiz.payload.reviews = quiz.payload.reviews ||  {};

                    quiz.payload.reviews[purchased.uuid] = {
                        review: purchased.meta.review,
                        comment: purchased.meta.comment
                    };

                    QuizApi.putQuiz(quiz);
                    resolve();
                }).catch(reject);
        });
    },

    deleteQuiz: function(quizId){
        QuizApi.deleteQuiz(quizId)
            .then(function(){

                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZ_DELETED,
                    payload: quizId
                });
            });
    },


    searchPublicQuizzes: debounce((searchString = '', categoryId) => {

        QuizApi.searchQuizzes(searchString, categoryId)
            .then(function(quizzes){

                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZZES_PUBLIC_LOADED,
                    payload: quizzes
                });

            });
    }, 300),


    getPublicQuizzesForProfile: function(profileId){

        return new Promise(function(resolve, reject){

            var searchPromise = QuizApi.searchQuizzes('', '', profileId);

            searchPromise
                .then((quizzes) => {

                    resolve(quizzes);

                }).catch(reject);
        });
    },

    newQuiz: function(quiz){

        var addOrCreateCategory = function(){
            var topicUuid;
            var topicFound = TopicStore.getTopicById(quiz.meta.categoryId);
            if (quiz.meta.categoryId === undefined) {
                topicFound = TopicStore.getTopicByName("");
                if (!topicFound) {
                    //we have an empty topic
                    topicFound = {
                        uuid: "-1",
                        name: ""
                    };
                }
            }
            if (topicFound && topicFound.uuid !== "-1") {
                topicUuid = topicFound.uuid;
            } else {
                topicUuid = uuid.v4();
                TopicActions.createTopic({
                    name: topicFound.name,
                    parentCategoryId: '-1',
                    uuid: topicUuid,
                    subContent: false
                });
            }

            return topicUuid;
        };

        return new Promise((resolve, reject) => {

            quiz.uuid = quiz.uuid || uuid.v4();
            quiz.meta.categoryId = addOrCreateCategory();

            quiz = createNewTopicsForQuiz(quiz);

            var promise = QuizApi.putQuiz(quiz);

            promise.then(()=>{
                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZ_ADDED,
                    payload: quiz
                });

                // TODO: Call loadQuizzes only if the quiz is new
                this.loadQuizzes();
                resolve(quiz);
            }, ()=> {
                reject();
            });


        });

    },

    shareQuiz: function(quizId, quizName, emails, link){
        var user = UserStore.getUser();
        var tokensSpace = emails.split(' ');
        var tokensColon = emails.split(';');
        var tokensComma = emails.split(',');

        var data = {
            email: user.name,
            quiz: quizName
        };
        if (tokensSpace.length > 1) {
            data.emails = tokensSpace;
        }
        else if (tokensColon.length > 1) {
            data.emails = tokensColon;
        }
        else if (tokensComma.length > 1) {
            data.emails = tokensComma;
        }
        else {
            data.emails = [emails];
        }
        if (link !== undefined) {
            data.link = link;
        }

        QuizApi.shareQuiz(quizId, data);

    },



    publishQuiz: function(quiz, settings) {
        quiz.meta.price = settings.price;
        quiz.meta.published = "pending";
        QuizApi.publishQuiz(quiz);
        swal({
            title: 'Thanks!',
            text: `Thanks for publishing your quiz! Our Quizalize team will get back to you within 24 hours!`,
            type: 'success'
        }, ()=>{
            router.setRoute(`/quiz/quizzes`);
        });

        AppDispatcher.dispatch({
            actionType: QuizConstants.QUIZ_META_UPDATED,
            payload: quiz
        });

    }



};


module.exports = QuizActions;
