import schema from './graphql/schema';
import {graphql} from 'graphql';

var query = function(query, sessionId){
    return graphql(schema, query, sessionId);

}
exports.graphQlQuery = query;

exports.endpoint = function(req, res){
    console.log('req.session', req.body, req.session.userUUID);
    query(schema, req.body, req.session.userUUID)
        .then((result) => {
            console.log('we got', result);
            res.send(result);
        });

};
