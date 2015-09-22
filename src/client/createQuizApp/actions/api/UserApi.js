/* @flow */
var request = require('superagent');

import UserIdStore from './../../stores/UserIdStore';
import cookies from './../../utils/cookies';

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
        console.info('local UUIDA', UserIdStore);
        return new Promise((resolve, reject) => {
            var localUuid = UserIdStore ? UserIdStore.getUserId() : undefined;
            console.info('local UUID', localUuid);
            var uuid = localUuid ? localUuid : cookies.getItem('cqUuid');
            var token = localStorage.getItem('token');

            if (!uuid && !token){
                reject();
            // } else if (uuid && token) {
            //     localStorage.clean();
            //     reject();
            } else if(uuid) {
                request.get(`/user/${uuid}`)
                    .end(function(error, res){
                        if (error) {
                            reject();
                        } else {
                            resolve(res.body);
                        }

                    });
            } else if (token){
                this.getZzishUser(token).then(resolve).catch(reject);
            }

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
                        updated,
                        published
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
                        reject();
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
                reject();

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
            var uuid = UserIdStore.getUserId();
            if (!uuid){
                reject();
            } else {
                request.post(`/user/${uuid}`)
                    .send(user)
                    .end(function(error, res){
                        if (error) {
                            reject();
                        } else {
                            resolve(res.body);
                        }

                    });
            }

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
                            cookies.setItem('cqUuid', res.body.uuid, oneYear);
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
                        // TODO Move this to a more convenient place
                        // localStorage.setItem('cqUuid', res.body.uuid);
                        var oneYear = new Date(new Date().setMonth(new Date().getMonth() + 24));
                        cookies.setItem('cqUuid', res.body.uuid, oneYear);
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
                        localStorage.setItem('cqUuid', res.body.uuid);
                        resolve(res.body);
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

                        var oneYear = new Date(new Date().setMonth(new Date().getMonth() + 24));
                        cookies.setItem('cqUuid', res.body.uuid, oneYear);

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
        var uuid = UserIdStore.getUserId();
        if (uuid) {
            console.log(`/user/${uuid}/events/${name}`);
            request.post(`/user/${uuid}/events/${name}`)
                .send(meta)
                .end();
        }
    }
};


module.exports = UserApi;