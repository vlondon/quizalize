var AppDispatcher       = require('createQuizApp/dispatcher/CQDispatcher');
var QuizConstants       = require('createQuizApp/constants/QuizConstants');
var QuizApi             = require('createQuizApp/actions/api/QuizApi');
var Promise             = require('es6-promise').Promise;
var TopicStore          = require('createQuizApp/stores/TopicStore');
var TopicActions        = require('createQuizApp/actions/TopicActions');
var uuid                = require('node-uuid');
var UserStore           = require('createQuizApp/stores/UserStore');


var _questionsTopicIdToTopic = function(quiz){

    var topics = TopicStore.getTopics();

    var findTopicName = function(topicId){
        var topic = topics.filter( t => t.uuid === topicId)[0];
        return topic ? topic.name : undefined;
    };


    if (quiz.questions && quiz.questions.length > 0){
        quiz.questions = quiz.questions.map(question => {
            question._topic = findTopicName(question.topicId);
            return question;
        });
    }

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
                uuid: uuid.v4(),
                name: topicName,
                subContent: true,
                parentCategoryId: quiz.categoryId
            };
            TopicActions.createTopic(topic);
        }

        return topic ? topic.uuid : uuid.v4();
    };

    if (questions && questions.length > 0) {
        questions = questions.map(function(question){
            if (question._topic){
                question.topicId = findTopicId(question._topic);
            }

            delete question._topic;

            return question;
        });
    }
    // quiz.questions = questions;

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

    deleteQuiz: function(quizId){
        QuizApi.deleteQuiz(quizId)
            .then(function(){

                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZ_DELETED,
                    payload: quizId
                });
            });
    },


    loadPublicQuizzes: function(){

        var processQuizList = function(result){

            var categories = [];
            var categoriesHash = {};
            for (var i in result.contents) {
                var quiz = result.contents[i];
                var cuuid = 'undefined';
                var category = { name: 'Other' };
                    if (quiz.categoryId !== undefined) {
                    cuuid = quiz.categoryId;
                    if (result.categories !== undefined) {
                        for (var o in result.categories) {
                            if (result.categories[o].uuid === quiz.categoryId) {
                                category = result.categories[o];
                            }
                        }
                    }
                }
                if (categoriesHash[cuuid] === undefined) {
                    var order = parseInt(category.index, 10) || 0;
                    /*eslint camelcase: 0*/
                    categoriesHash[cuuid] = { category: category, quizzes: [], order_index: order};
                }
                // console.log('category<!--  -->.name', quiz, category.name);
                if (category.name === '') {
                    category.homework = true;
                }
                if (category.homework) {
                    category.name = 'Quizzes (' + categoriesHash[cuuid].quizzes.length + ')';
                }
                categoriesHash[cuuid].quizzes.push(quiz);
            }
            for (var u in categoriesHash) {
                categories.push(categoriesHash[u]);
            }
            categories.sort(function(a, b){
                return a.order_index > b.order_index ? -1 : 1;
            });
            return categories;
        };

        QuizApi.getPublicQuizzes()
            .then(function(quizzes){
                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZZES_PUBLIC_LOADED,
                    payload: processQuizList(quizzes)
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

        return new Promise((resolve, reject) => {


            quiz.uuid = quiz.uuid || uuid.v4();
            quiz.categoryId = addOrCreateCategory();

            quiz = _questionsTopicToTopicId(quiz);

            var promise = QuizApi.putQuiz(quiz);

            promise.then(()=>{
                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZ_ADDED,
                    payload: _questionsTopicIdToTopic(quiz)
                });
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
