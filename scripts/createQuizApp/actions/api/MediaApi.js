/* @flow */
import request from 'superagent';
import UserStore from './../../stores/UserStore';

var MediaApi = {

    uploadPicture (quizId: string, file: Object) : Promise {

        return new Promise((resolve, reject)=>{
            var uuid = UserStore.getUserId();

            request
                .post(`/create/${uuid}/media`)
                .field('id', quizId)
                .attach('image', file, file.name)
                .end(function(err, res){
                    if (err) {
                        reject();
                    } else {
                        resolve(res.body);
                    }
                }, reject);
        });

    }
};

export default MediaApi;
