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

    getMyQuizzes (profileId){
        return new Promise((resolve, reject) => {
            zzish.listContent(profileId, 'quiz', function(err, resp){
                if (err) {
                    reject(err);
                } else {
                    resolve(resp);
                }
            });
        });
    }

    getQuizzes (profileId, quizIds){

        return new Promise((resolve, reject)=>{
            zzish.getContents(profileId, 'quiz', quizIds, (err, quizzes) => {
                console.log('quizzes', err, quizzes);
                if (err){
                    reject(err);
                } else {
                    resolve(quizzes);
                }
            });
        });

        let aLongTimeAgo = 1;

        var mongoQuery = {
            uuid: {$in: quizIds},
            updated: {
                $gt: aLongTimeAgo
            },
            published: "published"
        };

        console.log('query', mongoQuery);

        return performQuery(mongoQuery);
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
            console.log('answer', resp, err);
            if (resp) {
                resolve(resp);
            } else {
                reject(error);
            }
        });
    });

};


var quizzes = new Quizzes();
export default quizzes;
