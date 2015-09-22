import schema from './graphql/schema';
import {graphql} from 'graphql';


exports.graphql = function(req, res){
    console.log('req.session', req.session.user.uuid);
    graphql(schema, req.body, req.session.user.uuid)
        .then((result) => {
            res.send(result);
        });

};
