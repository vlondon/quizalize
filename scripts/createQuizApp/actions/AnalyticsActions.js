/* @flow */
import AppDispatcher       from './../dispatcher/CQDispatcher';
import AnalyticsConstants  from './../constants/AnalyticsConstants';

export var sendEvent = function(category: string, action: string, label: string) {

    if (window.ga){
        window.ga('send', 'event', category, action, label);
    } else {
        console.warn('No GA object found');
    }
};

export var trackPageView = function() {
    if (window.ga){
        window.ga('send', 'pageview');
    } else {
        console.warn('No GA object found');
    }
};


class AnalyticsActions {




    sendEvent(category: string, action: string, label: string){

        if (window.ga){
            window.ga('send', 'event', category, action, label);
        } else {
            console.warn('No GA object found');
        }
    }


    addAll(){
        this.googleConversion();
        this.twitterConversion();
        this.facebookConversion();
    }


    triggerPixels() : Promise {
        return new Promise(function(resolve){

            AppDispatcher.dispatch({
                actionType: AnalyticsConstants.ANALYTICS_CONVERSION_ENABLED
            });

            setTimeout(function(){
                AppDispatcher.dispatch({
                    actionType: AnalyticsConstants.ANALYTICS_CONVERSION_DISABLED
                });
                resolve();
            }, 3000);
        });
    }

    googleConversion(){
        /*eslint-disable */
        var filename = 'http://www.googleadservices.com/pagead/conversion.js';
        window.google_conversion_id = 1034680765;
		window.google_conversion_language = "en";
		window.google_conversion_format = "3";
		window.google_conversion_color = "ffffff";
		window.google_conversion_label = "Tp2vCKeA3lcQvfOv7QM";
		window.google_remarketing_only = false;
		window.google_conversion_value = 1.00;
		window.google_conversion_currency = "GBP";

        var fileref = document.createElement('script')
        fileref.setAttribute('type','text/javascript')
        fileref.setAttribute('src', filename)
        document.getElementsByTagName('head')[0].appendChild(fileref);

    }

    twitterConversion() {
        var _twttr = window._twttr || (window._twttr = []);

			// Load Twitter script
		var _loadTwitter = function() {
		var interval = setInterval(function() {
		if (!_twttr.loaded) {
			var twitterScript = document.createElement('script');
			twitterScript.async = true;
			twitterScript.src = '//platform.twitter.com/oct.js';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(twitterScript, s);
			_twttr.loaded = true;
			} else {
			_twttr.conversion.trackPid('l66kx',{ tw_sale_amount: 0, tw_order_quantity: 0 }); // REPLACE PID WITH YOUR OWN
			clearInterval(interval);
			}
		}, 200);
		};
		_loadTwitter();
    }

    facebookConversion(){
        (function() {
				var _fbq = window._fbq || (window._fbq = []);
				if (!_fbq.loaded) {
				var fbds = document.createElement('script');
				fbds.async = true;
				fbds.src = '//connect.facebook.net/en_US/fbds.js';
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(fbds, s);
				_fbq.loaded = true;
				}
		})();
		window._fbq = window._fbq || [];
		window._fbq.push(['track', '6024319569179', {'value':'0.01','currency':'GBP'}]);
        /*eslint-enable */
    }
}
var instanceAnalyticsActions = new AnalyticsActions();

export default instanceAnalyticsActions;
