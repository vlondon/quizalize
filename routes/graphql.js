import schema from './graphql/schema';
import {graphql} from 'graphql';


exports.graphql = function(req, res){

    graphql(schema, req.body)
        .then((result) => {
            res.send(result);
        });

};
