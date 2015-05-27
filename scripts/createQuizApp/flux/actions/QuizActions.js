var AppDispatcher       = require('createQuizApp/flux/dispatcher/CQDispatcher');
var QuizConstants       = require('createQuizApp/flux/constants/QuizConstants');
var QuizApi             = require('createQuizApp/flux/actions/api/QuizApi');
var Promise             = require('es6-promise').Promise;
var TopicStore          = require('createQuizApp/flux/stores/TopicStore');
var TopicActions         = require('createQuizApp/flux/actions/TopicActions');
var uuid = require('node-uuid');

var QuizActions = {

    loadQuizzes: function(){
        var quizzes = QuizApi.getQuizzes();
        var topics = QuizApi.getTopics();
        Promise.all([quizzes, topics])
            .then(value => {

                // let's stitch quizzes to their topic
                var loadedQuizzes = value[0];
                var loadedTopics = value[1];


                var processedQuizzes = loadedQuizzes.map(function(quiz){
                    var topic = loadedTopics.filter(function(t){
                        return t.uuid === quiz.categoryId;
                    })[0];

                    quiz.category = topic;

                    return quiz;
                });




                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZZES_LOADED,
                    payload: {
                        quizzes: processedQuizzes,
                        topics: loadedTopics
                    }
                });
            });

    },

    loadQuiz: function(quizId){
        QuizApi.getQuiz(quizId)
            .then(function(quiz){
                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZ_LOADED,
                    payload: quiz
                });
            });
    },

    newQuiz: function(quiz){
        console.log('saving new quiz', quiz);


        var addOrCreateCategory = function(){
            var topicUuid;
            var topics = TopicStore.getTopics();
            var topicFound = topics.filter( t => t.name === quiz.category )[0];

            if (topicFound) {
                console.log('reusing topic');
                topicUuid = topicFound.uuid;
            } else {
                console.log('generating new topic');
                topicUuid = uuid.v4();
                TopicActions.createTopic({
                    subject: quiz.subject,
                    name: quiz.category,
                    parentCategoryId: '-1',
                    uuid: topicUuid,
                    subContent: false
                });
            }

            return topicUuid;
        };

        quiz.uuid = quiz.uuid || uuid.v4();
        quiz.categoryId = addOrCreateCategory();

        var promise = QuizApi.putQuiz(quiz);

        promise.then(function(){
            AppDispatcher.dispatch({
                actionType: QuizConstants.QUIZ_ADDED,
                payload: quiz
            });
        });

        return promise;


    }


};

console.log('QuizActions???', QuizActions.login);

module.exports = QuizActions;
