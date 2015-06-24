var React = require('react');
var UserStore = require('createQuizApp/stores/UserStore');
var CQLink = require('createQuizApp/components/utils/CQLink');
var CQDashboardProfile = React.createClass({

    propTypes: {
        user: React.PropTypes.object
    },

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this.onChange);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getState(nextProps));
    },

    onChange: function(){
        this.setState(this.getState());
    },

    getState: function(props){
        props = props || this.props;
        console.log('get state', props);
        if (props && props.user){
            var user = props.user;
            return {
                user
            };
        }

        return {};

    },

    render: function() {
        var profile;

        if (this.state.user){
            profile = (
                <div>
                    <img src={this.state.profilePicture} alt="profile picture" className="cq-dashboard__profilepic"/>
                    <h3>{this.state.user.name}</h3>
                    <ul className="cq-dashboard__details">
                        <li>{this.state.user.attributes.school}</li>
                        <li>{this.state.user.attributes.location}</li>
                    </ul>
                </div>
            );
        }
        return (
                <div className="cq-dashboard__profile">
                    {profile}
                </div>


        );
    }

});

module.exports = CQDashboardProfile;
