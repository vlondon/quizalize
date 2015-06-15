//general zzish config
var zzish = require("zzishsdk");


var TRANSACTION_CONTENT_TYPE = "transaction";

exports.list = function(req, res){
    var profileId = req.params.profileId;


    zzish.listContent(profileId, TRANSACTION_CONTENT_TYPE, function(err, resp){
        res.send(resp);
    });
};



exports.get = function(req, res){
    var id = req.params.id;
    var profileId = req.params.profileId;

    zzish.getContent(profileId, TRANSACTION_CONTENT_TYPE, id, function(err, resp){
        if(!err){
            console.log("request for content, got: ", resp);
            res.send(resp);
        }else{
            console.log("request for content, error: ", err);
            res.status = 400;
        }
    });
};

exports.delete = function(req, res){
    var profileId = req.params.profileId;
    var id = req.params.id;

    zzish.deleteContent(profileId, TRANSACTION_CONTENT_TYPE, id, function(err, resp){
        res.send(err === undefined);
    });
};

exports.post = function(req, res){
    var profileId = req.params.profileId;
    var data = req.body;

    console.log("Console,", JSON.stringify(data.meta));

    zzish.postContent(profileId, TRANSACTION_CONTENT_TYPE, req.params.id, data.meta, data.payload, function(err, resp){
        if (!err) {
            res.status = 200;
        } else{
            res.status = 400;
        }
        res.send();
    });
};
