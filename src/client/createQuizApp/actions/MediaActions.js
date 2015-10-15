/* @flow */
import {MediaApi} from './api';

var MediaActions = {

    uploadPicture (file: Object, folder : string = 'quiz', sizeX?: number, sizeY?: number, crop: boolean = true) : Promise {
        console.log('about to call upload picture with crop', crop);
        return new Promise((resolve, reject)=>{
            MediaApi.uploadPicture(file, folder, sizeX, sizeY, crop).then(resolve).catch(reject);
        });

    }

};

export default MediaActions;
