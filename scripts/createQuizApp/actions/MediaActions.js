/* @flow */
import MediaApi from './api/MediaApi';

var MediaActions = {

    uploadPicture (quizId: string, file: Object) : Promise {

        return new Promise((resolve, reject)=>{
            MediaApi.uploadPicture(quizId, file).then(resolve).catch(reject);
        });

    }

};

export default MediaActions;
