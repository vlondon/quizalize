//general zzish config
var zzish               = require("zzishsdk");
var userHelper          = require('./helpers/userHelper');

exports.getQuiz = function(req, res){
    console.log('hahah');
    var id = req.params.id;


    zzish.getPublicContent('quiz', id, function(err, resp){
        console.log('err', err, res);
        res.send(resp);

    });
    // zzish.getContent(profileId, QUIZ_CONTENT_TYPE, id, function(err, resp){
    //     if (!err) {
    //         console.log("request for content, got: ", resp);
    //         res.send(resp);
    //     } else {
    //         console.log("request for content, error: ", err);
    //         res.status(400).send(err);
    //     }
    // });


}
