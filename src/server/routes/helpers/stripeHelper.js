var config              = require('./../../config');
var stripe              = require('stripe')(config.stripeSecret);
var Promise             = require('es6-promise').Promise;

exports.processPayment = function(transaction, stripeToken){
    return new Promise(function(resolve, reject){

        console.log('stripe Token', config.stripeSecret, stripeToken);

        stripe.charges.create({
            amount: transaction.meta.price * 100, // amount in cents, again
            currency: "gbp",
            source: stripeToken,
            description: 'Quizalize transaction'
        }, function(err, charge) {
            console.log('stripe returns', err, charge);
            if (err && err.type === 'StripeCardError') {
                // The card has been declined
                reject(err);
            } else {
                resolve(charge);
            }

        });

    });
};
