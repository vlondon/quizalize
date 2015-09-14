var React = require('react');
var UserStore = require('createQuizApp/stores/UserStore');
var CQLink = require('createQuizApp/components/utils/CQLink');
var CQViewProfilePicture = require('createQuizApp/components/views/CQViewProfilePicture');

import imageUrlParser from './../../../../utils/imageUrlParser';


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
            return { user };
        }

        return {};

    },

    render: function() {
        var profile, bannerStyles, school, profileUrl;
        console.log('this.state.user.attributes', this.state.user.attributes);

        if (this.state.user){
            if (this.state.user.attributes.bannerUrl){
                bannerStyles = {
                    backgroundImage: `url(${imageUrlParser(this.state.user.attributes.bannerUrl)})`,
                    height: 300
                };
            }

            if (this.state.user.attributes.profileUrl){
                profileUrl = 'https://www.quizalize.com/profile/' + this.state.user.attributes.profileUrl;
            } else {
                profileUrl = 'https://www.quizalize.com/quiz/user/'+ this.state.user.uuid;
            }

            if (this.state.user.attributes.url) {
                school = (
                    <a href={this.state.user.attributes.url}
                        target="_blank"
                        rel="nofollow">
                        {this.state.user.attributes.school}
                    </a>
                );
            } else {
                school = this.state.user.attributes.school;
            }
            var className = this.state.user.attributes.bannerUrl ? 'banner' : 'no-banner';
            var name = this.state.user.name && this.state.user.name.length !== 0 ? this.state.user.name : 'Quizalize user';

            profile = (
                <div className='cq-dashboard__profile__wrapper'>
                    <div className={`cq-dashboard__bannerpicture ${className}`} style={bannerStyles}>
                    </div>
                    <div className="cq-dashboard__profile__extra">

                        <div className="cq-dashboard__profile__picture">
                            <CQViewProfilePicture
                                width="200"
                                height="200"
                                name={name}

                                picture={this.state.user.avatar}/>
                        </div>
                        <div className="cq-dashboard__profile__info">

                            <div className="cq-dashboard__profile__info__entry">
                                <h3>{name}</h3>
                            </div>

                            <div className="cq-dashboard__profile__info__entry">
                                <small>
                                    School
                                </small>
                                {school}
                            </div>
                            <div  className="cq-dashboard__profile__info__entry">
                                <small>City</small>
                                {this.state.user.attributes.location}
                            </div>
                            <div className="cq-dashboard__profile__info__entry">
                                <a href={profileUrl}>
                                    <small>Link to Quizalize Profile</small>
                                </a>
                            </div>
                        </div>


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
