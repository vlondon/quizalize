//general zzish config
var config = require('../config.js');
var zzish = require("zzishsdk");
var fs = require('fs');
var APP_CONTENT_TYPE = "app";
var AWS  = require('./../awssdk');



exports.list = function(req, res){
    var profileId = req.params.profileId;
    //res.send([{name: "Zzish Quiz", uuid: "ZQ"}]);

    zzish.listContent(profileId, APP_CONTENT_TYPE, function(err, resp){
        res.send(resp);
    });
};

exports.get = function(req, res){
    var id = req.params.id;
    var profileId = req.params.profileId;

    zzish.getContent(profileId, APP_CONTENT_TYPE, id, function(err, resp){
        if(!err){
            console.log("request for content, got: ", resp);
            res.send(resp);
        }else{
            console.log("request for content, error: ", err);
            res.status = 400;
        }
    });
};

exports.delete = function(req,res){
    var profileId = req.params.profileId;
    var id = req.params.id;

    zzish.deleteContent(profileId, APP_CONTENT_TYPE, id, function(err, resp){
        res.send(err == undefined);
    });
};

exports.post = function(req, res){
    var profileId = req.params.profileId;
    var data = req.body;

    console.log("Console,", JSON.stringify(data.meta));

    zzish.postContent(profileId, APP_CONTENT_TYPE, req.params.id, data.meta, data.payload, function(err, resp){
        if (!err) {
            res.status = 200;
        } else{
            res.status = 400;
        }
        res.send();
    });
};


exports.postIcon = function(req, res){
    var path = req.files.image.path;

    fs.readFile(path, function(err, fileBuffer){
        if (err){
            res.error(err);
        } else {

            var profileId = req.params.profileId;
            var id = req.params.id;
            var s3 = new AWS.S3();

            var params = {
                Bucket: 'zzish-upload-assets',
                Key: profileId + '/id_' + id + '.' + path.split('.')[1],
                Body: fileBuffer,
                ACL: 'public-read'
            };


            s3.putObject(params, function (perr, data) {
                if (perr) {
                    console.log('Error uploading data: ', perr);
                    res.json(false);
                } else {
                    console.log('Successfully uploaded data to myBucket/myKey', data);
                    res.json(params.Key);
                }
                fs.unlink(path);
            });
        }
    });
};
