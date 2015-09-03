var fs              = require('fs');
var AWS             = require('./../../awssdk');
var gm              = require('gm');
var Promise         = require('es6-promise').Promise;

var logger          = require('../../logger');


exports.resizeImage = function(path, processed, sizeX, sizeY, crop){
    return new Promise(function(resolve, reject){
        logger.trace('resizeImage options', path, processed, sizeX, sizeY, crop);
        if (crop === true) {

            gm(path)
                .options({imageMagick: true})
                .geometry(sizeX, sizeY, '^')
                .gravity('Center')
                .crop(sizeX, sizeY)
                .noProfile()
                .quality(80)
                .write(processed, function(errImageProcessed){
                    console.log('success?', errImageProcessed);
                    if (errImageProcessed) {
                        reject(errImageProcessed);
                    } else {
                        resolve(processed);
                    }

                });
        } else {
            logger.trace('resizing');
            gm(path)
                .options({imageMagick: true})
                .resize(sizeX, sizeY, '>')
                .noProfile()
                .quality(80)
                .write(processed, function(errImageProcessed){
                    console.log('success?', errImageProcessed);
                    if (errImageProcessed) {
                        reject(errImageProcessed);
                    } else {
                        resolve(processed);
                    }

                });
        }
    });
};

exports.uploadPicture = function(profileId, pathToUpload, newName, folder, nameSuffix){

    return new Promise(function(resolve, reject){
        fs.readFile(pathToUpload, function(err, fileBuffer){
            if (err){
                reject(err);
            } else {

                var s3 = new AWS.S3();

                nameSuffix = nameSuffix ? '_' + nameSuffix : '';
                logger.trace('about to upload to s3 using', newName, nameSuffix, pathToUpload, profileId + '/' + folder + '/' + newName + nameSuffix + '.' + newName.split('.')[1]);
                var params = {
                    Bucket: 'zzish-upload-assets',
                    Key: profileId + '/' + folder + '/' + newName.split('.')[0] + nameSuffix + '.' + newName.split('.')[1],
                    Body: fileBuffer,
                    ACL: 'public-read'
                };

                s3.putObject(params, function (perr, data) {
                    if (perr) {
                        logger.error('Error uploading data: ', perr);
                        reject();
                    } else {
                        logger.trace('Successfully uploaded data to myBucket/myKey', data);
                        resolve(params.Key);
                    }
                });
            }
        });
    });
};
exports.deleteFile = function(path){
    fs.unlink(path);
};
