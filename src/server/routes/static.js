function loadUser(res, user) {
    res.render('create', {
        zzishapi: getZzishParam(),
        devServer: process.env.ZZISH_DEVMODE,
        publicConfig,
        intercomId: process.env.intercomAppId,
        user
    });
}

exports.base =  function(req, res) {
    var session = req.session;
    if (req.session.token) {
        //validate token
        zzish.getCurrentUser(req.session.token, function(err, data){
            var user = {};
            if (!err && typeof data === 'object') {
                user = data;
            }
            else {
                req.session.token = null;
                req.session.user = null;
            }
            loadUser(res, user);
        });
    }
    else {
        loadUser(res, session.user || {});
    }
};
