var React = require('react');

var AnalyticsStore = require('createQuizApp/stores/AnalyticsStore');
var UserStore = require('createQuizApp/stores/UserStore');

var intercomId = window.intercomId;
var CQAnalytics = React.createClass({

    getInitialState: function() {
        return {
            googleConversion: false,
            twitterConversion: false,
            facebookConversion: false,
            user: UserStore.isLoggedIn(),
            currentUser: UserStore.getUser()
        };
    },


    componentDidMount: function() {
        AnalyticsStore.addChangeListener(this.onChange);
        UserStore.addChangeListener(this.onChange);
        var currentUser = UserStore.getUser();
        console.log('UserStore.isLoggedIn()', UserStore.isLoggedIn());
        if (UserStore.isLoggedIn()){
            var intercomSettings = {
                name: (currentUser.name || currentUser.email),
                email: (currentUser.email),
                created_at: (this.state.currentUser.created / 1000),
                app_id: intercomId
            };

        }
        else {
            window.intercomSettings = {
                app_id: intercomId
            };
        }

        window.Intercom('boot', intercomSettings);
        console.log('TRIGGERING INTERCOM', intercomSettings);
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
            user: UserStore.isLoggedIn(),
            currentUser: UserStore.getUser()
        });

    },

    render: function() {

        var googleConversion, twitterConversion, facebookConversion;

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
