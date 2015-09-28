/* @flow */
import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLFloat,
    GraphQLBoolean
} from 'graphql/type';

import graphQLUser from './graphQLUser';
import graphQLQuiz from './graphQLQuiz';
import graphQLApps from './graphQLApps';


var count = 0;

var appMeta = new GraphQLObjectType({
    name: 'AppMeta',
    fields: () => ({
        code: {
            type: GraphQLString,
            name: 'App internal code'
        },
        colour: {
            type: GraphQLString,
            name: 'App user defined colour'
        },
        created: {
            type: GraphQLInt,
            name: 'App creation timestamp'
        },
        description: {
            type: GraphQLString,
            name: 'App description'
        },
        iconURL: {
            type: GraphQLString,
            name: 'App icon url'
        },
        name: {
            type: GraphQLString,
            name: 'App name'
        },
        price: {
            type: GraphQLFloat,
            name: 'App price'
        },
        profileId: {
            type: GraphQLString,
            name: 'Author user id'
        },
        quizzes: {
            type: new GraphQLList(quizType),
            resolve: ({quizzes, profileId})=>{
                console.log('RESOLVING ', quizzes);
                if (typeof quizzes === 'string') {
                    var quizzesID = quizzes.split(',');
                    return graphQLQuiz.getQuizzes(profileId, quizzesID);
                } else {
                    return [];
                }
            }
        },
        updated: {
            type: GraphQLString,
            name: 'App updated'
        }
    })
});


var appType = new GraphQLObjectType({
    name: 'App',
    fields: {
        uuid: {
            type: GraphQLString,
            description: 'App id'
        },
        meta: {
            type: appMeta,
            descrition: 'App meta information'
        }
    }
});

var quizMeta = new GraphQLObjectType({
    name: 'QuizMeta',
    fields: {
        authorId: {
            type: GraphQLString,
            description: 'User name'
        },
        categoryId: {
            type: GraphQLString,
            description: 'User categoryId'
        },
        code: {
            type: GraphQLString,
            description: 'User categoryId'
        },
        created: {
            type: GraphQLInt,
            description: 'User categoryId'
        },
        name: {
            type: GraphQLString
        },
        imageUrl: {
            type: GraphQLString
        },
        price: {
            type: GraphQLFloat
        },
        updated: {
            type: GraphQLInt
        },
        published: {
            type: GraphQLString
        },
        originalQuizId: {
            type: GraphQLString
        }
    }
});


var quizType = new GraphQLObjectType({
    name: 'Quiz',
    description: 'A character in the Star Wars Trilogy',
    fields: ()=>({
        uuid: {
            type: GraphQLString
        },
        meta: {
            type: quizMeta,
            description: 'Quiz meta information'
        }
    })
});



var userAttributes = new GraphQLObjectType({
    name: 'UserAttributes',
    fields: {
        location: {
            type: GraphQLString,
            description: 'Location',

        },
        school: {
            type: GraphQLString,
            description: 'School',

        },
        url: {
            type: GraphQLString,
            description: 'Url',

        },
        subjectTaught: {
            type: GraphQLString,
            description: 'subjectTaught',

        },
        ageTaught: {
            type: GraphQLString,
            description: 'ageTaught',

        },
        profileUrl: {
            type: GraphQLString,
            description: 'profileUrl',

        },
        bannerUrl: {
            type: GraphQLString,
            description: 'bannerUrl',
            resolve: (obj) => obj.bannerUrl
        }
    }
});




var userType = new GraphQLObjectType({
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
            description: 'User email',
            resolve: ({uuid, email}, args, {rootValue})=>{
                if (uuid === rootValue) {
                    return email;
                }
            }
        },
        attributes: {
            type: userAttributes
        },

        // dynamic data
        quizzes: {
            type: new GraphQLList(quizType),
            resolve: ({uuid}, a, {rootValue})=>{
                // this has user
                console.log('uuid,', uuid, rootValue);
                if (uuid === rootValue) {
                    return graphQLQuiz.getMyQuizzes(uuid);
                } else {

                    return graphQLQuiz.getUserQuizzes(uuid);
                }
                // return [];
            }
        },

        apps: {
            type: new GraphQLList(appType),
            resolve: ({uuid}) => {
                console.log('getting apps', uuid);
                return graphQLApps.getUserApps(uuid);
            }
        }
    })


});


var schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            user: {
                type: userType,
                args: {
                    uuid: {
                        name: 'uuid',
                        type: GraphQLString
                    },
                    name: {
                        name: 'name',
                        type: GraphQLString
                    },
                    me: {
                        name: 'me',
                        type: GraphQLBoolean
                    }
                },
                resolve: (root, {uuid, name}) => {

                    if (name) {
                        return graphQLUser.getUserBySlug(name);
                    } else if (uuid) {
                        return graphQLUser.getUserByid(uuid);
                    } else {
                        return graphQLUser.getMyUser(root);
                    }
                }
            },
            app: {
                type: appType,
                args: {
                    uuid: {
                        name: 'uuid',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: (root, {uuid}) => {
                    console.log('graphQLApps',graphQLApps );
                    return graphQLApps.getApp(uuid);
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
