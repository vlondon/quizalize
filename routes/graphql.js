import schema from './graphql/schema';
import {graphql} from 'graphql';


exports.graphql = function(req, res){
    // console.log('req.session', req.session);
    graphql(schema, req.body, req.session.userUUID)
        .then((result) => {
            res.send(result);
        });

};
