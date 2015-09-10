var zzish = require("../../zzish");

class Quiz  {
    constructor (obj){
        Object.assign(this, obj);
    }
    toJSON(){
        return this;
    }

}


class Quizzes {

    constructor(){
        this.quizzes = [];
    }

    getQuizById(quizId){
        var quiz = this.quizzes.filter(q=> quizId === q.uuid)[0];

        if (quiz === undefined){
            console.log('form zzish');
            return this.loadUser(userId);
        } else {
            console.log('form chache');
            return user.toJSON();
        }
    }

    loadQuiz(quizId){
        return new Promise(function(resolve, reject){

            zzish.getPublicContent('quiz', quizId, (err, resp) => {
                if (err) {
                    reject(err);
                } else {
                    var quiz = new Quiz(resp);
                    console.log('userquizzes', quiz);
                    this.quizzes.push(quiz);
                    resolve(quiz);
                }
            });

        });

    }

    getUserQuizzes (profileId){

        let now = Date.now();
        let lastYear = now - 365 * 7 * 24 * 60 * 60 * 1000;

        let mongoQuery = {
            updated: {
                $gt: lastYear
            },
            published: "published",
            name: {
                $regex: '', $options: 'i'
            },
            profileId

        };



        return performQuery(mongoQuery);
    }

}


var performQuery = function(mongoQuery) {

    return new Promise((resolve, reject)=>{
        zzish.searchPublicContent('quiz', mongoQuery, function(err, resp){
            if (resp) {
                resolve(resp);
            } else {
                reject(error);
            }
        });
    });
};

//
//
// var QuizActions = {
//     getQuizById: function(uuid) {
//         return new Promise(function(resolve, reject){
//
//             zzish.getPublicContent('quiz', uuid, function(err, resp){
//                 if (err) {
//                     reject(err);
//                 } else {
//                     var quiz = new Quiz(resp);
//                     resolve(quiz);
//                 }
//             });
//         });
//     },
//     getUserQuizzes: function(profileId){
//
//         let now = Date.now();
//         let lastYear = now - 365 * 7 * 24 * 60 * 60 * 1000;
//
//         let mongoQuery = {
//             updated: {
//                 $gt: lastYear
//             },
//             published: "published",
//             name: {
//                 $regex: '', $options: 'i'
//             },
//             profileId
//
//         };
//
//
//         return performQuery(mongoQuery);
//     }
// };

var quizzes = new Quizzes();
export default quizzes;
