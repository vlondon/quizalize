/* @flow */

import AppDispatcher  from './../dispatcher/PQDispatcher';
import PQQuizConstants from './../constants/PQQuizConstants';

class PQQuizActions  {

    loginUser(classCode:string, name:string){
        console.log('will log in user', classCode, name);
    }

    loadQuiz(quizId:string){

        window.zzish.getPublicContent('quiz', quizId, function (err, quiz) {
            console.log('err', PQQuizConstants.QUIZ_LOADED);
            console.log('message', quiz);

            if (err){
                console.error('Error', err);
            } else {

                AppDispatcher.dispatch({
                    type: PQQuizConstants.QUIZ_LOADED,
                    payload: quiz
                });
            }

        });
    }
}

var pqQuizActionsInstance = new PQQuizActions();
export default pqQuizActionsInstance;
