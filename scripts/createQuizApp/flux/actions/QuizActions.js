var AppDispatcher       = require('createQuizApp/flux/dispatcher/CQDispatcher');
var QuizConstants       = require('createQuizApp/flux/constants/QuizConstants');
var QuizApi             = require('createQuizApp/flux/actions/api/QuizApi');
var Promise             = require('es6-promise').Promise;
var TopicStore          = require('createQuizApp/flux/stores/TopicStore');
var TopicActions        = require('createQuizApp/flux/actions/TopicActions');
var uuid                = require('node-uuid');


var _questionsTopicIdToTopic = function(quiz){

    var topics = TopicStore.getTopics();

    var findTopicName = function(topicId){
        var topic = topics.filter( t => t.uuid === topicId)[0];
        return topic ? topic.name : undefined;
    };


    if (quiz.questions.length > 0){
        quiz.questions = quiz.questions.map(question => {
            question._topic = findTopicName(question.topicId);
            return question;
        });
    }
    console.info('converting ', quiz, topics);

    return quiz;
};

var _questionsTopicToTopicId = function(quiz){

    var questions = quiz.questions;
    var topics = TopicStore.getTopics();

    var findTopicId = function(topicName){
        var topic = topics.filter( t => t.title === topicName)[0];

        if (topic === undefined){
            // we create a new topic and save it
            topic = {
                uudi: uuid.v4(),
                name: topicName,
                subContent: true,
                parentCategoryId: quiz.categoryId
            };
            TopicActions.createTopic(topic);
        }

        return topic ? topic.uuid : uuid.v4();
    };

    if (questions.length > 0) {
        questions = questions.map(function(question){
            if (question._topic){
                question.topicId = findTopicId(question._topic);
            }

            delete question._topic;

            return question;
        });
    }
    quiz.questions = questions;

    return quiz;
};


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
                    payload: _questionsTopicIdToTopic(quiz)
                });
            });
    },

    newQuiz: function(quiz){

        var addOrCreateCategory = function(){
            var topicUuid;
            var topics = TopicStore.getTopics();
            var topicFound = topics.filter( t => t.name === quiz.category )[0];

            if (topicFound) {
                topicUuid = topicFound.uuid;
            } else {
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

        quiz = _questionsTopicToTopicId(quiz);

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


module.exports = QuizActions;
