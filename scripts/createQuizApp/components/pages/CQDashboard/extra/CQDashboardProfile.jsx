var React = require('react');
var UserStore = require('createQuizApp/stores/UserStore');
var CQLink = require('createQuizApp/components/utils/CQLink');
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
                    <CQLink href="/quiz/settings">
                        <img src={this.state.profilePicture} alt="profile picture" className="cq-dashboard__profilepic"/>
                        <h3>{this.state.user.attributes.name}</h3>
                        <ul className="cq-dashboard__details">
                            <li>{this.state.user.attributes.school}</li>
                            <li>{this.state.user.attributes.location}</li>
                        </ul>
                    </CQLink>
                </div>


        );
    }

});

module.exports = CQDashboardProfile;
