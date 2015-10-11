/* @flow */


var scriptInjected = false;

export var addYoutubeSdk = function(DOMId:string, videoId: string, begin: number, end: number, cb:?Function) : Promise {
    var onPlayerReady = function(ev){
        console.log('ev onPlayerReady', ev);

    };

    var onPlayerStateChange = function(ev){
        if (cb) cb(ev);
        console.log('onPlayerStateChange', ev);
    };
    var createPlayer = function(){
        var player = new window.YT.Player(DOMId, {
            height: '390',
            width: '640',
            videoId: videoId,
            playerVars: {
                start: begin,
                end: end,
                autoplay: true,
                autohide: 1,
                rel: 0,
                controls: 0,
                modestbranding: true
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
        return player;
    };

    return new Promise(function(resolve){

        if (scriptInjected) {
            resolve(createPlayer());
        } else {
            var tag = document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);



            window.onYouTubeIframeAPIReady = function (){
                scriptInjected = true;
                resolve(createPlayer());
            };
        }




    });

};
