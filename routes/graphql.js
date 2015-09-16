import schema from './graphql/schema';
import {graphql} from 'graphql';

var query = function(query, sessionId){
    return graphql(schema, query, sessionId);

}
exports.graphQlQuery = query;

exports.endpoint = function(req, res){
    graphql(schema, req.body, req.session.userUUID)
        .then((result) => {
            console.log('we got', result);
            res.send(result);
        });

};
