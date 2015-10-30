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

import marketplaceContent from './../helpers/marketplaceContent';

import logger from './../../logger';



// const transactionMeta = new GraphQLObjectType({
//     name: 'transactionMeta',
//     fields: () => ({
//         type: {
//             type: GraphQLString,
//             name: 'Type of transaction (quiz, app, subscription)',
//         },
//         created: {
//             type: GraphQLInt,
//             name: 'When the transaction was created',
//         },
//         price: {
//             type: GraphQLInt
//         }
//     })
// });

const appMeta = new GraphQLObjectType({
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
                if (typeof quizzes === 'string' && quizzes.length > 0) {
                    let quizzesID = quizzes.split(',');
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


let appType = new GraphQLObjectType({
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

let quizMeta = new GraphQLObjectType({
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
        publicCategoryId: {
            type: GraphQLString
        },
        published: {
            type: GraphQLString
        },
        originalQuizId: {
            type: GraphQLString
        }
    }
});


const quizType = new GraphQLObjectType({
    name: 'Quiz',
    description: 'A character in the Star Wars Trilogy',
    fields: ()=>({
        uuid: {
            type: GraphQLString,
        },
        meta: {
            type: quizMeta,
            description: 'Quiz meta information',
        }
    }),
});



const userAttributes = new GraphQLObjectType({
    name: 'UserAttributes',
    fields: {
        ageTaught: {
            type: GraphQLString,
            description: 'ageTaught',
        },
        bannerUrl: {
            type: GraphQLString,
            description: 'bannerUrl'
        },
        imageUrl: {
            type: GraphQLString,
            description: 'imageUrl',
        },
        location: {
            type: GraphQLString,
            description: 'Location',

        },
        profileUrl: {
            type: GraphQLString,
            description: 'profileUrl',
        },
        school: {
            type: GraphQLString,
            description: 'School',

        },
        subjectTaught: {
            type: GraphQLString,
            description: 'subjectTaught',
        },
        url: {
            type: GraphQLString,
            description: 'Url',
        },
        accountType: {
            type: GraphQLInt,
            description: 'Quizalize user type (Free / Premium / School)'
        },
        accountTypeUpdated: {
            type: GraphQLInt,
            description: 'Quizalize user type last updated'
        },
        accountTypeExpiration: {
            type: GraphQLInt,
            description: 'Quizalize user expires'
        }
    }
});




const userType = new GraphQLObjectType({
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
        created: {
            type: GraphQLInt,
            resolve: ({uuid, created}, args, {rootValue})=>{
                if (uuid === rootValue) {
                    return created;
                }
            }
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
            args: {
                me: {
                    name: 'me',
                    type: GraphQLBoolean
                }
            },
            resolve: ({uuid}, {me})=>{
                // this has user
                console.log('uuid,', uuid, me);
                if (me === true) {
                    return graphQLQuiz.getMyQuizzes(uuid);
                } else {

                    return graphQLQuiz.getUserQuizzes(uuid);
                }
                // return [];
            }
        },

        apps: {
            type: new GraphQLList(appType),
            args: {
                me: {
                    name: 'me',
                    type: GraphQLBoolean
                }
            },
            resolve: ({uuid}, {me}, {rootValue}) => {
                console.log('getting apps', uuid, rootValue, me);
                return graphQLApps.getUserApps(uuid, me);
            }
        }
    })


});


const schema = new GraphQLSchema({
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
                        console.log('getting user by id', uuid);
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
                    },
                    me: {
                        name: 'me',
                        type: GraphQLBoolean
                    }
                },
                resolve: (root, {uuid}) => {
                    console.log('graphQLApps',graphQLApps );

                    return graphQLApps.getApp(uuid);
                }
            },
            quizzes: {
                type: new GraphQLList(quizType),
                args: {
                    search: {
                        name: 'search',
                        type: GraphQLString
                    }
                },
                resolve: (root, {search})=>{
                    // result needs to be converted from immutable to normal object
                    const result = marketplaceContent.quiz(search).map(r=> {
                        r = r.toObject();
                        r.meta = r.meta.toObject();
                        return r;
                    });
                    logger.debug('searching for quizzes', search, result[0]);
                    return result;
                }
            }
        }
    }),
    // mutation: new GraphQLObjectType({
    //     name: 'RootMutationType',
    //     fields: {
    //         updateCount: {
    //             type: GraphQLInt,
    //             description: 'Updates the count',
    //             resolve: function() {
    //
    //                 return count;
    //             }
    //         }
    //     }
    // })
});

export default schema;
