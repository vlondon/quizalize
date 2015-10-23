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


type QuizCategory = {
    name: string;
    title: string;
}
type QuizMeta = {
    authorId?: string;
    categoryId?: string;
    code?: string;
    comment?: any;
    created: number;
    imageUrl?: string;
    name: string;
    originalQuizId?: string;
    price: number;
    profileId: string;
    published?: string;
    random: boolean;
    review?: any;
    subject?: string;
    updated: number;
};

export type Question = {
    uuid: string;
    question: string;
    answer: string;
    alternatives?: Array<string>;
    topicId?: string;
    latexEnabled: boolean;
    imageEnabled: boolean;
    duration: number;
    alternatives: Array<string>
}

type QuizPayload = {
    questions: Array<Question>;
}

export type QuizComplete = {
    _temp?: boolean;
    _new?: boolean;
    uuid: string;
    meta: QuizMeta;
    payload: QuizPayload;
}

export type Quiz = {
    _category?: QuizCategory;
    uuid: string;
    meta: QuizMeta;
}

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

                        fullQuiz = new QuizObject();
                        if (quizId){
                            fullQuiz.uuid = quizId;
                            fullQuiz._new = false;
                            fullQuiz._temp = true;
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
        return fullQuiz;
    }

    getOwnedQuizByOriginalQuizId(quizId: string) : ?Quiz{
        var ownedQuiz = _quizzes.filter( q => q.meta.originalQuizId === quizId);
        if (ownedQuiz.length > 0){
            return ownedQuiz[0];
        }
    }

    getPublicQuiz(quizId): QuizComplete{
        var fullPublicQuiz = _fullPublicQuizzes[quizId];
        if (fullPublicQuiz === undefined){
            QuizActions.loadPublicQuiz(quizId);
        }
        return fullPublicQuiz;
    }

    getQuestion(quizId, questionIndex) : Question{
        var quiz = this.getQuiz(quizId);
        var question = quiz.payload.questions[questionIndex] || new QuestionObject(quiz);
        // adding new properties to the object
        question.duration = question.duration || 60;
        console.info('QuizStore getQuestion', question);
        return question;
    }

    getPublicQuizzes(){
        if (_publicQuizzes) {
            return _publicQuizzes.slice().reverse();
        }
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

            var quiz = action.payload;
            _fullQuizzes[quiz.uuid] = quiz;
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZ_PUBLIC_LOADED:
            var publicQuiz = action.payload;
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
            var quizIdToBeDeleted = action.payload;
            var quizToBeDeleted = _quizzes.filter(q => q.uuid === quizIdToBeDeleted)[0];
            _quizzes.splice(_quizzes.indexOf(quizToBeDeleted), 1);
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZ_ADDED:
            UserActions.getOwn();
            var quizAdded = action.payload;
            _fullQuizzes[quizAdded.uuid] = quizAdded;
            quizStoreInstance.emitChange();
            break;


        case QuizConstants.QUIZ_META_UPDATED:
            UserActions.getOwn();
            var quizToBeUpdated = action.payload;
            var quizFromArray = _quizzes.filter(q => q.uuid === quizToBeUpdated.uuid)[0];
            if (quizFromArray){
                _quizzes[_quizzes.indexOf(quizFromArray)] = quizToBeUpdated;
            }

            quizStoreInstance.emitChange();
            break;

        default:
            // no op
    }
});
