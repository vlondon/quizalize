var React = require('react');
var UserStore = require('createQuizApp/stores/UserStore');
var CQLink = require('createQuizApp/components/utils/CQLink');
var CQViewProfilePicture = require('createQuizApp/components/views/CQViewProfilePicture');
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
                    <div className="cq-dashboard__profilepicture">

                        <CQViewProfilePicture
                            width="200"
                            height="200"
                            name={this.state.user.name}

                            picture={this.state.user.avatar}/>
                    </div>
                    <h3>{this.state.user.name}</h3>

                    <div>
                        <small>
                            School
                        </small>
                        <a href={this.state.user.attributes.url}
                            target="_blank"
                            rel="nofollow">
                            {this.state.user.attributes.school}
                        </a>
                    </div>
                    <div>
                        <small>City</small>
                        {this.state.user.attributes.location}
                    </div>

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
