import schema from './graphql/schema';
import {graphql} from 'graphql';


exports.graphql = function(req, res){
    var sessionUserId = req.session.user ? req.session.user.uuid : undefined;
    // console.log('req.session', req.session.user.uuid);
    graphql(schema, req.body, sessionUserId)
        .then((result) => {
            res.send(result);
        });

};
