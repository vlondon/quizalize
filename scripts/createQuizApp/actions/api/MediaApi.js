/* @flow */
import request from 'superagent';
import UserStore from './../../stores/UserStore';

var MediaApi = {

    uploadPicture (file: Object, folder: string, sizeX: number = 600, sizeY:number = 600) : Promise {

        return new Promise((resolve, reject)=>{
            var uuid = UserStore.getUserId();

            request
                .post(`/create/${uuid}/media`)
                .field('folder', folder)
                .field('sizeX', sizeX)
                .field('sizeY', sizeY)
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
