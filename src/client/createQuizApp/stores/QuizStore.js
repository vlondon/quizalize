/* @flow */
// import Store from './Store';
import uuid from 'node-uuid';
import Store from './Store';
import AppDispatcher from './../dispatcher/CQDispatcher';
import {
    MeStore
} from './../stores';


import {
    QuizConstants,
    UserConstants
} from './../constants';

import {
    UserActions,
    QuizActions
} from './../actions';

import type {Quiz, QuizComplete, Question } from './../../../types';

let _quizzes: Array<Quiz> = [];
let _publicQuizzes;
let _fullQuizzes = {};
let _fullPublicQuizzes = {};
let storeInit = false;
let storeInitPublic = false;
let storeLoaded = false;
let storePublicLoaded = false;

// Add user listener
// need to be debounced since MeStore is undefined at the moment this line is
// executed
setTimeout(()=>{
    MeStore.addChangeListener(function(){
        storeInit = false;
        storeInitPublic = false;
    });
});


var QuizObject = function() : QuizComplete {
    var quiz : QuizComplete = {
        uuid: uuid.v4(),
        _new: true,
        meta: {
            categoryId: undefined,
            featured: false,
            live: false,
            name: '',
            profileId: MeStore.getUserId() || '-1',
            price: 0,
            random: false,
            created: Date.now(),
            updated: Date.now()
        },
        payload: {
            questions: []
        }

    };
    return quiz;
};


var QuestionObject = function(quiz){

    var question : Question = {
        alternatives: ['', '', ''],
        question: '',
        answer: '',
        latexEnabled: false,
        imageEnabled: false,
        duration: 30,
        uuid: uuid.v4()
    };

    if (quiz && quiz.payload.questions.length > 0) {
        var lastQuestion = quiz.payload.questions[quiz.payload.questions.length - 1];
        question.latexEnabled = lastQuestion.latexEnabled || false;
        question.imageEnabled = lastQuestion.imageEnabled || false;
        question.duration = lastQuestion.duration || 30;
        question.topicId = lastQuestion.topicId;
    }

    return question;
};

class QuizStore extends Store {

    token: string;

    getQuizzes(): Array<Quiz> {
        return _quizzes.slice();
    }

    // this will return all user quizzes that are not bought
    getPersonalQuizzes(): Array<Quiz> {
        // var ordered = _quizzes.slice().filter( q => (q.meta.originalQuizId === undefined || q.meta.originalQuizId === null));
        //return _quizzes.slice().filter( q => q.meta.originalQuizId === undefined && q.meta.published === 'published');
        return _quizzes.slice().filter( q => q.meta.originalQuizId === undefined || q.meta.originalQuizId === null);
    }

    getPrivateQuizzes(): Array<Quiz> {
        return _quizzes.slice().filter(q=> q.meta.published === null && (q.meta.originalQuizId === null || q.meta.originalQuizId === undefined));
    }

    getQuizMeta(quizId): Quiz {
        var result = _quizzes.filter(t => t.uuid === quizId);
        return result.length === 1 ? result.slice()[0] : _fullQuizzes[quizId];

    }

    getQuiz(quizId?): QuizComplete {
        var fullQuiz;
        if (quizId){
            fullQuiz = _fullQuizzes[quizId];
            if (fullQuiz === undefined){
                QuizActions.loadQuiz(quizId)
                    .catch(()=>{
                        console.log('failed to load quiz');
                        fullQuiz = new QuizObject();
                        if (quizId){
                            fullQuiz.uuid = quizId;
                            fullQuiz._new = false;
                            fullQuiz._error = true;
                            _fullQuizzes[fullQuiz.uuid] = fullQuiz;
                        }
                        this.emitChange();
                    });
                //create empty quiz?
            } else {
                return fullQuiz;
            }

        } else {
            fullQuiz = new QuizObject();
            _fullQuizzes[fullQuiz.uuid] = fullQuiz;

        }
        console.info('QuizStore.getQuiz', fullQuiz);
        return fullQuiz;
    }

    getOwnedQuizByOriginalQuizId(quizId: string) : ?Quiz{
        var ownedQuiz = _quizzes.filter( q => q.meta.originalQuizId === quizId);
        if (ownedQuiz.length > 0){
            return ownedQuiz[0];
        }
    }

    getPublicQuiz(quizId): QuizComplete {
        var fullPublicQuiz = _fullPublicQuizzes[quizId];
        if (fullPublicQuiz === undefined){
            QuizActions.loadPublicQuiz(quizId);
        }
        return fullPublicQuiz;
    }

    getQuestion(quizId, questionIndex) : Question{
        var quiz = this.getQuiz(quizId);
        var question = quiz.payload.questions[questionIndex] || new QuestionObject(quiz);
        question.duration = question.duration || 60;
        return question;
    }

    getPublicQuizzes() : Array<Quiz>{
        if (_publicQuizzes) {

            let publicQuizzes = _publicQuizzes.slice();
            let {accountType} = MeStore.state.attributes;

            if (accountType === 10) {
                publicQuizzes = publicQuizzes.filter(q=> q.meta.price === 0);
            }
            return publicQuizzes.reverse();
        }
        return [];
    }

    getQuizzesForProfile(profileId) {
        if (_publicQuizzes){
            return _publicQuizzes.filter(quiz => quiz.meta.profileId === profileId).slice().reverse();
        }
    }

    addChangeListener(callback){
        if (!storeInitPublic) {
            QuizActions.searchPublicQuizzes();
            storeInitPublic = true;
        }
        super.addChangeListener(callback);
    }

    /**
     * is Quizzes Init
     */
    isInitData () {
        return storeInit;
    }

    isLoaded() {
        return storePublicLoaded;
    }

    isPublicLoaded (){
        return storeLoaded;
    }

    /**
     * is Quizzes Init
     */
    isInitPublicData () {
        return storeInitPublic;
    }
}

var quizStoreInstance = new QuizStore();
export default quizStoreInstance;
// Register callback to handle all updates
quizStoreInstance.token = AppDispatcher.register(function(action) {

    switch(action.actionType) {
        case UserConstants.USER_OWN_LOADED:
        case QuizConstants.QUIZZES_LOADED:
            // AppDispatcher.waitFor([
            //     TopicStore.token
            // ]);
            storeLoaded = true;
            _quizzes = action.payload.quizzes;

            _quizzes.sort((a, b)=> a.meta.updated > b.meta.updated ? 1 : -1 );
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZ_LOADED:
        case QuizConstants.QUIZ_CHANGED:
            let quiz = action.payload;
            _fullQuizzes[quiz.uuid] = quiz;
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZ_LOAD_ERROR:
            let quizId = action.payload;
            let quizError = new QuizObject();
            quizError.uuid = quizId;
            quizError._error = true;
            _fullQuizzes[quizId] = quizError;
            console.log('shoot', quizError);
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZ_PUBLIC_LOADED:
            let publicQuiz = action.payload;
            publicQuiz.meta.price = publicQuiz.meta.price || 0;
            _fullPublicQuizzes[publicQuiz.uuid] = publicQuiz;
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZZES_PUBLIC_LOADED:
            storePublicLoaded = true;
            _publicQuizzes = action.payload;
            _publicQuizzes.forEach(quiz => quiz.meta.price = quiz.meta.price || 0);
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZ_DELETED:
            UserActions.getOwn();
            let quizIdToBeDeleted = action.payload;
            let quizToBeDeleted = _quizzes.filter(q => q.uuid === quizIdToBeDeleted)[0];
            _quizzes.splice(_quizzes.indexOf(quizToBeDeleted), 1);
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZ_ADDED:
            let quizAdded = action.payload;
            _fullQuizzes[quizAdded.uuid] = quizAdded;
            quizStoreInstance.emitChange();
            break;


        case QuizConstants.QUIZ_META_UPDATED:
            UserActions.getOwn();
            let quizToBeUpdated = action.payload;
            let quizFromArray = _quizzes.filter(q => q.uuid === quizToBeUpdated.uuid)[0];
            if (quizFromArray){
                _quizzes[_quizzes.indexOf(quizFromArray)] = quizToBeUpdated;
            }

            quizStoreInstance.emitChange();
            break;

        default:
            // no op
    }
});
