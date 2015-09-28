/* @flow */
import Store from './Store';
import MeStore from './MeStore';
import Immutable, {Record} from 'immutable';

var uuid            = require('node-uuid');

var AppDispatcher   = require('./../dispatcher/CQDispatcher');
var QuizConstants   = require('./../constants/QuizConstants');
var UserConstants = require('./../constants/UserConstants');
var QuizActions     = require('./../actions/QuizActions');
import TopicStore from './../stores/TopicStore';


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
    uuid: string;
    meta: QuizMeta;
    _category?: QuizCategory;
}

var _quizzes: Array<Quiz> = [];
var _publicQuizzes;
var _fullQuizzes = {};
var _fullPublicQuizzes = {};
var storeInit = false;
var storeInitPublic = false;

// Add user listener
MeStore.addChangeListener(function(){
    storeInit = false;
    storeInitPublic = false;

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

var quizRecord = Record(QuizObject());

var QuestionObject = function(quiz){

    var question : Question = {
        alternatives: ['', '', ''],
        question: '',
        answer: '',
        latexEnabled: false,
        imageEnabled: false,
        duration: 60,
        uuid: uuid.v4()
    };

    if (quiz && quiz.payload.questions.length > 0) {
        var lastQuestion = quiz.payload.questions[quiz.payload.questions.length - 1];
        question.latexEnabled = lastQuestion.latexEnabled || false;
        question.imageEnabled = lastQuestion.imageEnabled || false;
        question.topicId = lastQuestion.topicId;
        console.log('question', question, lastQuestion);
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
        console.log('working with', _quizzes);
        //return _quizzes.slice().filter( q => q.meta.originalQuizId === undefined && q.meta.published === 'published');
        return _quizzes.slice().filter( q => q.meta.originalQuizId === undefined || q.meta.originalQuizId === null);
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
                        console.log('new quiz');
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
        // case QuizConstants.QUIZZES_LOADED:
            // AppDispatcher.waitFor([
            //     TopicStore.token
            // ]);
            _quizzes = action.payload.quizzes;

            _quizzes.sort((a, b)=> a.meta.updated > b.meta.updated ? 1 : -1 );
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZ_LOADED:
            AppDispatcher.waitFor([
                TopicStore.token
            ]);
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
            _publicQuizzes = action.payload;
            _publicQuizzes.forEach(quiz => quiz.meta.price = quiz.meta.price || 0);
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZ_DELETED:
            var quizIdToBeDeleted = action.payload;
            var quizToBeDeleted = _quizzes.filter(q => q.uuid === quizIdToBeDeleted)[0];
            _quizzes.splice(_quizzes.indexOf(quizToBeDeleted), 1);
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZ_ADDED:
            var quizAdded = action.payload;
            _fullQuizzes[quizAdded.uuid] = quizAdded;
            quizStoreInstance.emitChange();
            break;


        case QuizConstants.QUIZ_META_UPDATED:
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
