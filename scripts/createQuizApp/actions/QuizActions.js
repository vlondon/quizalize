var AppDispatcher       = require('createQuizApp/dispatcher/CQDispatcher');
var QuizConstants       = require('createQuizApp/constants/QuizConstants');
var QuizApi             = require('createQuizApp/actions/api/QuizApi');
var Promise             = require('es6-promise').Promise;
var TopicStore          = require('createQuizApp/stores/TopicStore');
var TopicActions        = require('createQuizApp/actions/TopicActions');

var uuid                = require('node-uuid');
var UserStore           = require('createQuizApp/stores/UserStore');

var debounce            = require('createQuizApp/utils/debounce');


// var _questionsTopicIdToTopic = function(quiz){


//     var findTopicName = function(topicId){
//         var topic = TopicStore.getTopicById(topicId);
//         return topic ? topic.name : undefined;
//     };


//     // if (quiz.payload.questions && quiz.payload.questions.length > 0){
//     //     quiz.payload.questions = quiz.payload.questions.map(question => {
//     //         question._topic = findTopicName(question.topicId);
//     //         return question;
//     //     });
//     // }

//     return quiz;
// };

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

        var quizzes = QuizApi.getQuizzes();
        var topics = QuizApi.getTopics();
        var ptopics = QuizApi.getUserTopics();


        Promise.all([quizzes, topics, ptopics])
            .then(value => {

                // let's stitch quizzes to their topic
                var loadedQuizzes = value[0];
                var loadedTopics = value[1];
                var loadedUserTopics = value[2];


                var processedQuizzes = loadedQuizzes.map(function(quiz){
                    var topic;
                    topic = loadedTopics.pcategories.filter(function(t){
                        return t.uuid === quiz.meta.categoryId;
                    })[0];
                    if (!topic) {
                        topic = loadedTopics.categories.filter(function(t){
                            return t.uuid === quiz.meta.categoryId;
                        })[0];
                    }
                    if (!topic) {
                        topic = loadedUserTopics.filter(function(t){
                            return t.uuid === quiz.meta.categoryId;
                        })[0];
                    }

                    quiz.category = topic || {};

                    return quiz;
                });




                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZZES_LOADED,
                    payload: {
                        quizzes: processedQuizzes,
                        topics: loadedTopics,
                        utopics: loadedUserTopics
                    }
                });
            });

    },


    loadQuiz: function(quizId){

        var quizPromise = QuizApi.getQuiz(quizId);

        quizPromise
            .then((quiz) => {

                var getCategoryFormUuid = function(){


                    if (quiz.meta.categoryId) {
                        var topicFound = TopicStore.getTopicById(quiz.meta.categoryId);
                        console.log('looking for meta', quiz.meta.categoryId, topicFound);
                        return topicFound ? topicFound.name : '';
                    }
                    return '';

                };

                quiz.meta.category = getCategoryFormUuid();
                // settings property is assumed, so it should be present

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
            console.log("Savingg View");

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


    searchPublicQuizzes: debounce((searchString = '', categoryId, profileId) => {

        QuizApi.searchQuizzes(searchString, categoryId, profileId)
            .then(function(quizzes){

                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZZES_PUBLIC_LOADED,
                    payload: quizzes
                });

            });
    }, 300),


    newQuiz: function(quiz){

        var addOrCreateCategory = function(){
            var topicUuid;

            var topicFound = TopicStore.getTopicById(quiz.meta.categoryId);

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

    }

};


module.exports = QuizActions;
