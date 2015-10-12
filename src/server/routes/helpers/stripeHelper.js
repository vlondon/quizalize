/* @flow */
import logger from './../../logger';
var config = require('./../../config');
var stripe = require('stripe')(config.stripeSecret);
import type {UserType} from './../../../types/UserType';
import {saveUser} from './../user';

export let createStripeUser = function(user: UserType, stripeToken: string) : Promise {

    return new Promise((resolve, reject)=>{

        if (user.attributes.stripeId === undefined) {
            stripe.customers.create({
                description: `${user.name} <${user.email}>`,
                email: user.email,
                source: stripeToken,
                metadata: {
                    name: user.name,
                    quizalizeId: user.uuid,
                    school: user.attributes.school
                }
            }, function(err, customer) {
                // asynchronously called
                if (err){
                    logger.trace('STRIPE: Error when creating user', user.uuid, err);
                    reject(err);
                } else {
                    logger.trace('STRIPE: Successfully created new user', customer.id, user.uuid);
                    var stripeCustomerId = customer.id;
                    user.attributes.stripeId = stripeCustomerId;
                    saveUser(user)
                        .then(function(user){
                            resolve(user);
                            logger.trace('ZZISH saved user', user);
                        })
                        .catch(reject);
                }
            });
        } else {
            resolve(user);
        }
    });
};

export let processPayment = function(transaction: Object, stripeToken: string) : Promise {
    return new Promise(function(resolve, reject){

        stripe.charges.create({
            amount: transaction.meta.price * 100, // amount in cents, again
            currency: "gbp",
            source: stripeToken,
            description: 'Quizalize transaction'
        }, function(err, charge) {
            logger.debug('stripe returns', err, charge);
            if (err && err.type === 'StripeCardError') {
                // The card has been declined
                reject(err);
            } else {
                resolve(charge);
            }

        });

    });
};

export let processSubscription = function(transaction: Object, stripeToken: string, user: Object) : Promise {


    var addSubscription = function(){
        let plan = 'quizalize_tier1';
        return new Promise((resolve, reject)=>{
            logger.trace('CHARGING USER ', user.attributes.stripeId, 'with plan', plan);
            stripe.customers.createSubscription(user.attributes.stripeId, {plan}, function(err, charge) {
                logger.debug('stripe returns', err, charge);
                if (err && err.type === 'StripeCardError'){
                    reject(err);
                } else {
                    resolve(charge);
                }
            });
        });

    };

    if (user.attributes.stripeId === undefined){
        return new Promise((resolve, reject) => {
            createStripeUser(user, stripeToken).then((user)=>{
                logger.trace('SAVED NEW USER');
                addSubscription(user).then(resolve).catch(reject);
            });
        });
    } else {
        return addSubscription();
    }
};
