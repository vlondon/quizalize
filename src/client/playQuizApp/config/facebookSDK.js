var Promise = require('es6-promise').Promise;
var loaded = false;


var load = function(){
    if (loaded) { return; }
    window.fbAsyncInit = function() {
        FB.init({
            appId: '992375314140273',
            xfbml: true,
            version: 'v2.3'
        });
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return; }
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    loaded = true;
};

var getProfilePicture = function(){

    return new Promise(function(resolve, reject){
        console.log('trying to load facebook profile pciture');



        FB.login(function(response){
            if (response.authResponse){

                FB.api('/me', {
                    fields: 'picture.type(large).redirect(false)'
                }, function(responsePicture){
                    console.log('response', responsePicture);
                    if (responsePicture.error){
                        reject(responsePicture.error);
                    } else {
                        if (!responsePicture.picture.data.is_silhouette){

                            resolve(responsePicture.picture.data.url);
                        } else {
                            reject('No profile picture');
                        }
                    }
                });
            } else {
                reject('User cancelled operation');
                console.log('User cancelled operation');
            }
        });



    });
};

module.exports = {
    load,
    getProfilePicture
};
