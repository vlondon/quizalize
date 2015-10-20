/* global StripeCheckout */

var loadStripeAsync = function(u, c){
    
    var d = document, t = 'script',
        o = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
        o.src = u;
        if (c) { o.addEventListener('load', function (e) { c(null, e); }, false); }
        s.parentNode.insertBefore(o, s);
};

var stripeCheckout = function(amount, email){

    return new Promise(function(resolve){

        console.log('loading stripe', amount, email);
        loadStripeAsync('https://checkout.stripe.com/checkout.js', function(){
            var handler = StripeCheckout.configure({
                key: window.publicConfig.stripeKey,
                amount: amount * 100,
                email: email,
                currency: 'USD',
                token: function(token) {
                    resolve(token);
                    // Use the token to create the charge with a server-side script.
                    // You can access the token ID with `token.id`
                }
            });

            handler.open();

        });
    });
};


module.exports = { stripeCheckout };
