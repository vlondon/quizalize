/* @flow */
var request = require('superagent');


var getGraphQLUserQuery = function(key, value){
    return `
        {
            user(${key}: ${value}) {
                name,
                avatar,
                uuid,
                attributes {
                    location,
                    profileUrl,
                    bannerUrl,
                    profileUrl,
                    school
                },
                quizzes {
                    uuid,
                    meta {
                        name,
                        categoryId,
                        imageUrl,
                        price,
                        publicCategoryId,
                        updated
                    }
                },
                apps {
                    uuid,
                    meta {
                        name,
                        iconURL,
                        created,
                        price,
                        description,
                        colour,
                        quizzes {
                            uuid,
                            meta {
                                name,
                                categoryId,
                                publicCategoryId,
                                imageUrl,
                                price,
                                updated
                            }
                        }
                    }
               }
            }
        }`;
};

var UserApi = {

    get: function() : Promise {

        return new Promise((resolve, reject) => {

            request.get(`/user`)
                .end(function(error, res){
                    if (error) {
                        reject('User not found');
                    } else {
                        resolve(res.body);
                    }

                });


        });
    },

    getOwn: function() : Promise {
        var query = `{
            user(me: true) {
                name,
                avatar,
                uuid,
                email
                attributes {
                    ageTaught,
                    bannerUrl,
                    imageUrl,
                    location,
                    profileUrl,
                    school,
                    subjectTaught,
                    url
                },
                quizzes(me:true) {
                    uuid,
                    meta {
                        name,
                        categoryId,
                        publicCategoryId,
                        originalQuizId,
                        imageUrl,
                        price,
                        updated,
                        published
                    }
                },
                apps(me: true) {
                    uuid,
                    meta {
                        name,
                        iconURL,
                        created,
                        price,
                        description,
                        colour,
                        quizzes {
                            uuid,
                            meta {
                                name,
                                categoryId,
                                originalQuizId,
                                imageUrl,
                                price,
                                updated,
                                published
                            }
                        }
                    }
               }
            }
        }`;
        return new Promise((resolve, reject)=>{
            request.post(`/graphql/`)
                .set('Content-Type', 'application/graphql')
                .send(query)
                .end(function(error, res){
                    if (error) {
                        reject('GraphQL: User not loaded');
                    // } else if (res.body) {
                        // reject();
                    } else {
                        console.log('res', res);
                        resolve(res.body.data.user);
                    }
                });

        });
    },

    getPublic: function(userId : string, key: string = 'uuid') : Promise {
        var query = getGraphQLUserQuery(key, `"${userId}"`);

        return new Promise((resolve, reject) => {

            if (!userId){
                reject('UserId Not defined');

            } else {
                request.post(`/graphql/`)
                    .set('Content-Type', 'application/graphql')
                    .send(query)
                    .end(function(error, res){
                        if (error) {
                            reject();
                        // } else if (res.body) {
                            // reject();
                        } else {
                            console.log('res', res);
                            resolve(res.body.data.user);
                        }
                    });

            }

        });
    },

    search: function(attributes : Object) : Promise {
        return new Promise((resolve, reject) => {

            request.post(`/user/search`)
                .send(attributes)
                .end(function(error, res){
                    if (error) {
                        reject();
                    } else {
                        resolve(res.body);
                    }
                });

        });
    },

    post: function(user : Object) : Promise {
        return new Promise((resolve, reject) => {
            request.post(`/user`)
                .send(user)
                .end(function(error, res){
                    if (error) {
                        reject();
                    } else {
                        resolve(res.body);
                    }

                });


        });
    },

    getZzishUser: function(token : string) : Promise {

        return new Promise(function(resolve, reject){
            request.get(`/quiz/token/${token}`)
                .end(function(error, res){
                    console.log('res', res);
                    if (error || (res.body && res.body.uuid === undefined)) {
                        reject();
                    } else {
                        if (res.text === 'Invalid Request'){
                            localStorage.removeItem('token');
                            reject();
                        } else {
                            var oneYear = new Date(new Date().setMonth(new Date().getMonth() + 24));

                            resolve(res.body);
                        }
                    }

                });
        });
    },

    login: function(data : Object) : Promise {
        return new Promise(function(resolve, reject){
            request.post('/user/authenticate')
                .send(data)
                .end(function(error, res){
                    if (error){
                        reject(error);
                    } else {
                        resolve(res.body);
                    }
                });
        });
    },

    loginWithToken: function(token : string) : Promise {
        return new Promise(function(resolve, reject){
            request.post('/user/token/')
                .send({token: token})
                .end(function(error, res){
                    if (error){
                        reject(error);
                    } else {
                        // TODO Move this to a more convenient place
                        resolve(res.body);
                    }
                });
        });
    },

    logout: function() : Promise {
        return new Promise(function(resolve, reject){
            request.post('/user/logout')
                .send()
                .end(function(error, res){
                    if (error){
                        reject(error);
                    } else {
                        resolve(res);
                    }
                });
        });
    },

    register: function(data : Object) : Promise {
        return new Promise(function(resolve, reject){
            request.post('/user/register')
                .send(data)
                .end(function(error, res){
                    console.log('res', res);
                    if (res.status === 409 || res.status === 412) {
                        reject(res.status);
                    } else if (error){
                        reject(error);
                    } else {
                        resolve(res.body);
                    }
                });
        });
    },

    recover: function(email : string) : Promise {
        return new Promise(function(resolve, reject){
            request.post('/user/forget')
                .send({email})
                .end(function(error, res){
                    if (error){
                        reject(error);
                    } else {
                        resolve(res.body);
                    }
                });
        });
    },

    reset: function(code : string, password : string) : Promise {
        return new Promise(function(resolve, reject){
            request.post('/users/complete')
                .send({
                    code,
                    password
                })
                .end(function(error, res){
                    localStorage.setItem('cqUuid', res.body.uuid);
                    if (error){
                        reject(error);
                    } else {
                        resolve(res.body);
                    }
                });
        });
    },

    trackEvent: function(name : string, meta: Object){

        request.post(`/user/events/${name}`)
            .send(meta)
            .end();

    }
};


module.exports = UserApi;
