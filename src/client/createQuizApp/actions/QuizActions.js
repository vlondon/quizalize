/* @flow */
import uuid from 'node-uuid';

import AppDispatcher from './../dispatcher/CQDispatcher';
import { QuizConstants } from './../constants';
import { QuizApi } from './../actions/api';
import { router } from './../config';

import type {Quiz, QuizComplete} from './../../../types';
import {
    UserActions,
    AnalyticsActions,
    TopicActions
} from './../actions';

import {
    TopicStore,
    MeStore
} from './../stores';

import { debounce } from './../utils';


var createNewTopicsForQuiz = function(quiz){

    var questions = quiz.payload.questions;

    var createTopicForQuestion = function(question){
        var topic = TopicStore.getTopicById("subtopic", question.topicId);
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

    // loadQuizByCode: function(quizCode: string) : Promise{
    //     return new Promise((resolve, reject)=>{
    //
    //     QuizApi.getQuizByCode(quizCode)
    //         .then((quiz)=>{
    //             resolve(quiz);
    //         })
    //         .catch(reject);
    //     });
    // },

    loadQuiz: function(quizId : string) : Promise {
        return new Promise((resolve, reject)=>{

            var quizPromise = QuizApi.getQuiz(quizId);

            quizPromise
                .then((quiz) => {
                    if (quiz){
                        AppDispatcher.dispatch({
                            actionType: QuizConstants.QUIZ_LOADED,
                            payload: quiz
                        });
                        resolve(quiz);
                    } else {

                    }
                })
                .catch(function(){
                    console.log('QuizConstants.QUIZ_LOAD_ERROR', QuizConstants.QUIZ_LOAD_ERROR);
                    AppDispatcher.dispatch({
                        actionType: QuizConstants.QUIZ_LOAD_ERROR,
                        payload: quizId
                    });
                    reject();
                });
        });
    },

    loadPublicQuiz: function(quizId:string) : Promise {
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


    saveReview: function(purchased:QuizComplete) : Promise {

        return new Promise(function(resolve, reject){

            var savePurchased = QuizApi.putQuiz(purchased);
            if (purchased.meta.originalQuizId) {
                var getOriginal = QuizApi.getQuiz(purchased.meta.originalQuizId);
            }

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
                UserActions.getOwn();
                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZ_DELETED,
                    payload: quizId
                });
            });
    },


    searchPublicQuizzes: debounce((searchString = '', categoryId = '') => {

        QuizApi.searchQuizzes(searchString, categoryId)
            .then(function(quizzes){
                if (searchString !== '' || categoryId !== ''){
                    AnalyticsActions.sendEvent('marketplace_search_quiz', searchString, quizzes.length);
                    AnalyticsActions.sendIntercomEvent('marketplace_search_result', {keyword: searchString, quizzes: quizzes.length, categoryId: categoryId});
                }
                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZZES_PUBLIC_LOADED,
                    payload: quizzes
                });

            });
    }, 300),



    getPublicQuizzesForProfile: function(profileId: string) : Promise {

        return new Promise(function(resolve, reject){

            var searchPromise = QuizApi.searchQuizzes('', '', profileId);

            searchPromise
                .then((quizzes) => {

                    resolve(quizzes);

                }).catch(reject);
        });
    },


    newQuiz: function(quiz:QuizComplete) : Promise {

        var addOrCreateCategory = function(){
            var topicUuid;
            var topicFound = TopicStore.getTopicById("topic", quiz.meta.categoryId);
            if (quiz.meta.categoryId === undefined) {
                topicFound = TopicStore.getTopicByName("topic", '');
                if (!topicFound) {
                    //we have an empty topic
                    topicFound = {
                        uuid: '-1',
                        name: ''
                    };
                }
            }
            if (topicFound && topicFound.id === '-1'){
                topicFound.uuid = '-1';
            }
            if (topicFound && topicFound.uuid !== '-1') {
                topicUuid = topicFound.uuid;
            } else if (topicFound !== undefined){
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

            // if (quiz.meta.name === "") {
            //     quiz.meta.name = quiz.payload.questions[0].question;
            // }

            quiz.meta.categoryId = addOrCreateCategory();
            // we filter questions with no content
            if (quiz.payload.questions){
                quiz.payload.questions = quiz.payload.questions.filter( q => q.question.length > 0 && q.answer.length > 0);
                quiz.payload.questions.forEach(function(q) {
                    q.question = q.question.trim();
                    q.answer = q.answer.trim();
                });
            }

            quiz = createNewTopicsForQuiz(quiz);
            delete quiz._error;
            var promise = QuizApi.putQuiz(quiz);

            if (quiz._new) {
                delete quiz._new;
                AnalyticsActions.sendEvent('quiz', 'new', quiz.meta.name);
                AnalyticsActions.sendIntercomEvent('new_quiz', {uuid: quiz.uuid, name: quiz.meta.name});
            }

            promise.then((savedQuiz)=>{
                AppDispatcher.dispatch({
                    actionType: QuizConstants.QUIZ_ADDED,
                    payload: savedQuiz
                });


                setTimeout(()=> {
                    resolve(savedQuiz);
                }, 100);
            }, (error)=> {
                console.error(error);
                reject(error);
            });


        });

    },

    shareQuiz: function(quiz:Quiz, quizName:string, emailList:Array<string>, link?:string) : Promise {
        var user:Object = MeStore.state;
        var emails = emailList.join(';');
        var tokensSpace = emails.split(' ');
        var tokensColon = emails.split(';');
        var tokensComma = emails.split(',');
        var quizId = quiz.uuid;

        var data: {email: string; quiz: Quiz; emails?: Array<string>; link?: string } = {
            email: user.name,
            quiz
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

        AnalyticsActions.sendEvent('quiz', 'shared', quizName);
        AnalyticsActions.sendIntercomEvent('complete_share_quiz', {uuid: quizId, name:quizName});

        return QuizApi.shareQuiz(quizId, data);

    },

    publishQuiz: function(quiz:Quiz, settings:Object)  {
        quiz.meta.price = settings.price;
        quiz.meta.published = "pending";
        quiz.meta.updated = Date.now();
        QuizApi.publishQuiz(quiz);
        AnalyticsActions.sendEvent('quiz', 'publish', quiz.meta.name);
        AnalyticsActions.sendIntercomEvent('publish_quiz', {uuid: quiz.uuid, name: quiz.meta.name});
        swal({
            title: 'Thanks!',
            text: `Thanks for publishing your quiz! Our Quizalize team will get back to you within 24 hours!`,
            type: 'success'
        }, ()=>{
            router.setRoute(`/quiz/user`);
        });

        AppDispatcher.dispatch({
            actionType: QuizConstants.QUIZ_META_UPDATED,
            payload: quiz
        });

    },

    updateQuiz: function(quiz:Quiz){
        AppDispatcher.dispatch({
            actionType: QuizConstants.QUIZ_CHANGED,
            payload: quiz
        });
    }
};


module.exports = QuizActions;
