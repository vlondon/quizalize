var React = require('react');

var AnalyticsStore = require('./../../stores/AnalyticsStore');
var MeStore = require('./../../stores/MeStore');


var CQAnalytics = React.createClass({

    getInitialState: function() {
        return {
            googleConversion: AnalyticsStore.analyticsEnabled(),
            twitterConversion: AnalyticsStore.analyticsEnabled(),
            facebookConversion: AnalyticsStore.analyticsEnabled(),
            user: MeStore.isLoggedIn(),
            currentUser: MeStore.status
        };
    },


    componentDidMount: function() {
        AnalyticsStore.addChangeListener(this.onChange);
        MeStore.addChangeListener(this.onChange);
        // var currentUser = UserStore.getUser();
        // console.log('MeStore.isLoggedIn()', MeStore.isLoggedIn());
        // if (MeStore.isLoggedIn()){
        //     window.intercomSettings = {
        //         name: (currentUser.name || currentUser.email),
        //         email: (currentUser.email),
        //         created_at: (currentUser.created / 1000),
        //         app_id: intercomId
        //     };
        //
        // }
        // else {
        //     window.intercomSettings = {
        //         app_id: intercomId
        //     };
        // }
        // window.Intercom('boot', window.intercomSettings);
        // console.log('TRIGGERING INTERCOM', window.intercomSettings);
    },

    componentWillUnmount: function() {
        AnalyticsStore.removeChangeListener(this.onChange);
        MeStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        console.warn('CHANGE ON ANALYTICS');
        var analyticsEnabled = AnalyticsStore.analyticsEnabled();
        // if (MeStore.isLoggedIn()){
        //     var currentUser = UserStore.getUser();
        //     window.intercomSettings = {
        //         name: (currentUser.name || currentUser.email),
        //         email: (currentUser.email),
        //         created_at: (currentUser.created / 1000),
        //         app_id: intercomId
        //     };
        //
        // }
        // else {
        //     window.intercomSettings = {
        //         app_id: intercomId
        //     };
        // }
        // console.log('Intercom updated', window.intercomSettings);
        // window.Intercom('update', window.intercomSettings);
        this.setState({
            googleConversion: analyticsEnabled,
            twitterConversion: analyticsEnabled,
            facebookConversion: analyticsEnabled,
            user: MeStore.isLoggedIn(),
            currentUser: MeStore.state
        });

    },

    render: function() {

        var googleConversion, twitterConversion, facebookConversion;

        if (this.state.googleConversion) {
            googleConversion = (
                <div>

                <span className="google-conversion">
                    <img height="1" width="1" style={{'bordeStyle': 'none'}} alt="" src="//www.googleadservices.com/pagead/conversion/1034680765/?value=1.00&amp;amp;current_code=GBP&amp;amp;label=FqfWCIWT-lwQvfOv7QM&amp;amp;guid=ON&amp;amp;script=0"/>
                </span>

                </div>
            );
        }

        if (this.state.twitterConversion) {
            twitterConversion = (
                <div>

                <span className="twitter-conversion">
                    <img height="1" width="1" style={{display: 'none'}} alt="" src="https://analytics.twitter.com/i/adsct?txn_id=l66kx&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />
                    <img height="1" width="1" style={{display: 'none'}} alt="" src="//t.co/i/adsct?txn_id=l66kx&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />


                    <img height={1} width={1} style={{display: 'none'}} alt src="https://analytics.twitter.com/i/adsct?txn_id=l67iw&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />
                    <img height={1} width={1} style={{display: 'none'}} alt src="//t.co/i/adsct?txn_id=l67iw&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0" />

                </span>

                </div>
            );
        }

        if (this.state.facebookConversion) {
            facebookConversion = (
                <div>
                <span className="facebook-conversion">
                    <img height="1" width="1" alt="" style={{display: 'none'}} src="https://www.facebook.com/tr?ev=6024319569179&amp;amp;cd[value]=0.01&amp;amp;cd[currency]=GBP&amp;amp;noscript=1"/>
                </span>

                </div>
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
