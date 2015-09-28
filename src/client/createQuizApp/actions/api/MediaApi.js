/* @flow */
import request from 'superagent';
import MeStore from './../../stores/MeStore';

var MediaApi = {

    uploadPicture (file: Object, folder: string, sizeX: number = 600, sizeY:number = 600, crop:boolean = true) : Promise {

        return new Promise((resolve, reject)=>{
            var uuid = MeStore.getUserId();

            request
                .post(`/create/${uuid}/media`)
                .field('folder', folder)
                .field('sizeX', sizeX)
                .field('sizeY', sizeY)
                .field('crop', crop)
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
