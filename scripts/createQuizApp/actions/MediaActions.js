/* @flow */
import MediaApi from './api/MediaApi';

var MediaActions = {

    uploadPicture (file: Object, folder : string = 'quiz', sizeX?: number, sizeY?: number) : Promise {

        return new Promise((resolve, reject)=>{
            MediaApi.uploadPicture(file, folder, sizeX, sizeY).then(resolve).catch(reject);
        });

    }

};

export default MediaActions;
