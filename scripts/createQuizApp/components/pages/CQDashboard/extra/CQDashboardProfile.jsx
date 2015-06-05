var React = require('react');
var UserStore = require('createQuizApp/stores/UserStore');
var md5 = require('blueimp-md5');
var CQDashboardProfile = React.createClass({

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState(this.getState());
    },

    getState: function(){
        var user = UserStore.getUser();

        return {
            user,
            profilePicture: `http://www.gravatar.com/avatar/${md5(user.name.trim())}?s=220&d=identicon`
        };
    },

    render: function() {
        return (

                <div className="cq-dashboard__profile">
                    <img src={this.state.profilePicture} alt="profile picture" className="cq-dashboard__profilepic"/>
                    <h3>Blai Pratdesaba</h3>
                    <ul className="cq-dashboard__details">
                        <li>School of Life</li>
                        <li>Billericay, Essex</li>
                    </ul>
                </div>


        );
    }

});

module.exports = CQDashboardProfile;
