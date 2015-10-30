//general zzish config
var marketplaceSearch = require('./helpers/marketplaceContent');


exports.getQuizzes = function(req, res){

    var searchString = req.body.search || '';
    var searches = [].concat.apply([], searchString.split(' ').map(marketplaceSearch.quiz));

    // logger.info('getQuizzes', searches);

    // var quizzes = marketplaceSearch.quiz(searchString);
    res.send(searches);

};



exports.getApps = function(req, res){
    var searchString = req.body.search || '';


    let apps = marketplaceSearch.app(searchString);
    res.send(apps);
    // if (categoryId) {
    //     mongoQuery.categoryId = categoryId;
    // }
    // // if (appId){
    // //     mongoQuery.uuid = appId;
    // // }
    // logger.trace('searching ', mongoQuery);
    //
    // performQuery(mongoQuery, APP_CONTENT_TYPE, function(err,result) {
    //     if (err === null) {
    //         res.send(result);
    //     }
    //     else {
    //         res.status(500).send(result);
    //     }
    // });
};
