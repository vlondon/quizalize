var React = require('react');

var AnalyticsStore = require('createQuizApp/stores/AnalyticsStore');
var UserStore = require('createQuizApp/stores/UserStore');

var CQAnalytics = React.createClass({

    getInitialState: function() {
        return {
            googleConversion: false,
            twitterConversion: false,
            facebookConversion: false,
            user: UserStore.getUser().uuid !== undefined
        };
    },


    componentDidMount: function() {
        AnalyticsStore.addChangeListener(this.onChange);
        UserStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        AnalyticsStore.removeChangeListener(this.onChange);
        UserStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        var analyticsEnabled = AnalyticsStore.analyticsEnabled();
        this.setState({
            googleConversion: analyticsEnabled,
            twitterConversion: analyticsEnabled,
            facebookConversion: analyticsEnabled,
            user: UserStore.getUser().uuid !== undefined
        });

    },

    render: function() {

        var googleConversion, twitterConversion, facebookConversion;
        if (this.state.user){
            window.intercomSettings = {
              name: (this.state.user && this.state.user.name),
              email: (this.state.user && this.state.user.email),
              created_at: (this.state.user && this.state.user.created),
              app_id: 'mnacdt52'
            };
            (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/mnacdt52';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()
        }
        eles {
            window.intercomSettings = {
              app_id: 'mnacdt52'
            };
            (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/mnacdt52';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()
        }

        if (this.state.googleConversion) {
            googleConversion = (
                <span className="google-conversion">
                    <img height="1" width="1" style={{'border-style': 'none'}} alt="" src="//www.googleadservices.com/pagead/conversion/1034680765/?value=1.00&amp;amp;current_code=GBP&amp;amp;label=FqfWCIWT-lwQvfOv7QM&amp;amp;guid=ON&amp;amp;script=0"/>
                </span>
            );
        }

        if (this.state.twitterConversion) {
            twitterConversion = (
                <span className="twitter-conversion">
                    <img height="1" width="1" style={{display: 'none'}} alt="" src="https://analytics.twitter.com/i/adsct?txn_id=l66kx&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />
                    <img height="1" width="1" style={{display: 'none'}} alt="" src="//t.co/i/adsct?txn_id=l66kx&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />


                    <img height={1} width={1} style={{display: 'none'}} alt src="https://analytics.twitter.com/i/adsct?txn_id=l67iw&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />
                    <img height={1} width={1} style={{display: 'none'}} alt src="//t.co/i/adsct?txn_id=l67iw&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />

                </span>
            );
        }

        if (this.state.facebookConversion) {
            facebookConversion = (
                <span className="facebook-conversion">
                    <img height="1" width="1" alt="" style={{display: 'none'}} src="https://www.facebook.com/tr?ev=6024319569179&amp;amp;cd[value]=0.01&amp;amp;cd[currency]=GBP&amp;amp;noscript=1"/>
                </span>
            );
        }

        return (
            <span className='analyticsActions'>
                {googleConversion}
                {twitterConversion}
                {facebookConversion}
            </span>
        );
    }

});

module.exports = CQAnalytics;
