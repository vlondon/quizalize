/* @flow */
import type {Quiz, QuizComplete}        from './../stores/QuizStore';
var Promise             = require('es6-promise').Promise;
var uuid                = require('node-uuid');


var AppDispatcher       = require('./../dispatcher/CQDispatcher');
var QuizConstants       = require('./../constants/QuizConstants');
var QuizApi             = require('./../actions/api/QuizApi');
var TopicStore          = require('./../stores/TopicStore');
var TopicActions        = require('./../actions/TopicActions');
var router              = require('./../config/router');

var UserApi             = require('./../actions/api/UserApi');

import UserStore        from './../stores/UserStore';

var debounce            = require('./../utils/debounce');


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


    loadQuiz: function(quizId:string){

        var quizPromise = QuizApi.getQuiz(quizId);

        quizPromise
            .then((quiz) => {

                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZ_LOADED,
                    payload: quiz
                });

            });
    },

    loadPublicQuiz: function(quizId:string){
        return new Promise(function(resolve, reject){
            var quizPromise = QuizApi.getPublicQuiz(quizId);

            quizPromise
                .then((quiz) => {

                    AppDispatcher.dispatch({
                        actionType: QuizConstants.QUIZ_PUBLIC_LOADED,
                        payload: quiz
                    });
                    resolve(quiz);

                })
                .catch(reject);

        });
    },


    saveReview: function(purchased:Quiz){

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

    deleteQuiz: function(quizId:string){
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



    getPublicQuizzesForProfile: function(profileId: string){

        return new Promise(function(resolve, reject){

            var searchPromise = QuizApi.searchQuizzes('', '', profileId);

            searchPromise
                .then((quizzes) => {

                    resolve(quizzes);

                }).catch(reject);
        });
    },


    newQuiz: function(quiz:QuizComplete){


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
            var updatedQuiz = !!quiz.uuid;
            quiz.uuid = quiz.uuid || uuid.v4();
            quiz.meta.categoryId = addOrCreateCategory();
            // we filter questions with no content
            if (quiz.payload.questions){
                quiz.payload.questions = quiz.payload.questions.filter( q => q.question.length > 0 && q.answer.length > 0);
            }

            quiz = createNewTopicsForQuiz(quiz);

            var promise = QuizApi.putQuiz(quiz);
            if (!updatedQuiz) {
                UserApi.trackEvent('new_quiz', {uuid: quiz.uuid, name: quiz.meta.name});
            }

            resolve(quiz);
            promise.then(()=>{
                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZ_ADDED,
                    payload: quiz
                });

                // TODO: Call loadQuizzes only if the quiz is new
                this.loadQuizzes();
            });


        });

    },

    shareQuiz: function(quizId:string, quizName:string, emails:string, link:string){
        var user:Object = UserStore.getUser();
        var tokensSpace = emails.split(' ');
        var tokensColon = emails.split(';');
        var tokensComma = emails.split(',');

        var data: {email: string; quiz: string; emails?: Array<string>; link?: string } = {
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

    publishQuiz: function(quiz:Quiz, settings:Object) {
        quiz.meta.price = settings.price;
        quiz.meta.published = "pending";
        QuizApi.publishQuiz(quiz);
        UserApi.trackEvent('publish_quiz', {uuid: quiz.uuid, name: quiz.meta.name});
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
