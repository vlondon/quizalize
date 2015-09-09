import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLInterfaceType,
    GraphQLNonNull
} from 'graphql/type';

import graphQLUser from './graphql/graphQLUser';
//console.log('GraphQLObjectType', GraphQLObjectType);
let count = 0;

let GraphQLUserAttributes = new GraphQLObjectType({
    name: 'UserAttributes',
    fields: {
        location: {
            type: GraphQLString,
            description: 'Location',
            resolve: (obj) => obj.location
        },
        school: {
            type: GraphQLString,
            description: 'School',
            resolve: (obj) => obj.school
        },
        url: {
            type: GraphQLString,
            description: 'Url',
            resolve: (obj) => obj.url
        },
        subjectTaught: {
            type: GraphQLString,
            description: 'subjectTaught',
            resolve: (obj) => obj.subjectTaught
        },
        ageTaught: {
            type: GraphQLString,
            description: 'ageTaught',
            resolve: (obj) => obj.ageTaught
        },
        profileUrl: {
            type: GraphQLString,
            description: 'profileUrl',
            resolve: (obj) => obj.profileUrl
        },
        bannerUrl: {
            type: GraphQLString,
            description: 'bannerUrl',
            resolve: (obj) => obj.bannerUrl
        }
    }
});



let userType = new GraphQLObjectType({
    name: 'UserType',
    description: 'UserType test',
    fields: () => ({
        uuid: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'User unique id'
        },
        name: {
            type: GraphQLString,
            description: 'User name'
        },
        avatar: {
            type: GraphQLString,
            description: 'User avatar'
        },
        email: {
            type: GraphQLString,
            description: 'User email'
        }
    })


});


let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            user: {
                type: userType,
                args: {
                    uuid: {
                        name: 'uuid',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (root, {uuid}) => {
                    console.log('root, ', root, uuid);
                    var noUser = {
                        uuid: '-1',
                        avatar: 'a',
                        email: 'b',
                        name: 'c'
                    };
                    return graphQLUser.getUserByid(uuid);
                    // return new Promise(function(resolve){
                    //     setTimeout(()=>{
                    //         resolve(noUser);
                    //     }, 200);
                    // });
                    // console.log('returning ', noUser);
                    // return noUser;
                    // return 'a';
                }
            },
            count: {
                type: GraphQLInt,
                description: 'The count!',
                resolve: function() {
                    count += 1;
                    return count;
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutationType',
        fields: {
            updateCount: {
                type: GraphQLInt,
                description: 'Updates the count',
                resolve: function() {
                    count += 1;
                    return count;
                }
            }
        }
    })
});

export default schema;
