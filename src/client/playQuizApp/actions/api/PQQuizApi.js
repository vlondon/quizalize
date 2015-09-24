/* @flow */
var zzish = window.zzish;

class PQQuizApi {
    loadUserQuizzes(): Promise {
        return new Promise((resolve, reject)=>{
            var userId = localStorage.getItem('pqUuid');
            var classCode = localStorage.getItem('pqClassCode');
            zzish.listContentForGroup(userId, classCode, (err, resp) => {
                console.log('getUserQuizzes', err, resp);
                if (!err) {
                    resolve(resp);
                } else {
                    reject(err);
                }
            });
        });
    }
}

var pqQuizApiInstance = new PQQuizApi();

export default pqQuizApiInstance;
