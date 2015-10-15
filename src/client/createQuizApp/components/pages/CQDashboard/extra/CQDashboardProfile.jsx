var React = require('react');
var UserStore = require('createQuizApp/stores/UserStore');
var UserIdStore = require('createQuizApp/stores/UserIdStore');
var CQViewProfilePicture = require('createQuizApp/components/views/CQViewProfilePicture');


import imageUrlParser from './../../../../utils/imageUrlParser';


var CQDashboardProfile = React.createClass({

    propTypes: {
        user: React.PropTypes.object,
        own: React.PropTypes.bool
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
        var profile, bannerStyles, school, profileUrl, returnToPrivate;

        if (this.props.user){
            console.log('this.props.user.attributes', this.props.user.attributes);
            if (this.props.user.attributes.bannerUrl){
                bannerStyles = {
                    backgroundImage: `url(${imageUrlParser(this.props.user.attributes.bannerUrl)})`,
                    height: 300
                };
            }

            if (this.props.user.attributes.profileUrl){
                profileUrl = 'https://www.quizalize.com/profile/' + this.props.user.attributes.profileUrl;
            } else {
                profileUrl = 'https://www.quizalize.com/quiz/user/'+ this.props.user.uuid;
            }

            if (this.props.user.attributes.url) {
                var url = this.props.user.attributes.url.indexOf("http") === 0 ? this.props.user.attributes.url : "http://" + this.props.user.attributes.url;
                school = (
                    <a href={url}
                        target="_blank"
                        rel="nofollow">
                        {this.props.user.attributes.school}
                    </a>
                );
            } else {
                school = this.props.user.attributes.school;
            }
            var className = this.props.user.attributes.bannerUrl ? 'banner' : 'no-banner';
            var name = this.props.user.name && this.props.user.name.length !== 0 ? this.props.user.name : 'Quizalize user';
            var publicUrl = this.props.user.attributes.profileUrl ? (
                                                        <div  className="cq-dashboard__profile__info__entry">
                                                            <small>Public URL</small>
                                                            <a
                                                                target="_blank"
                                                                href={`https://www.quizalize.com/profile/${this.props.user.attributes.profileUrl}`}>https://www.quizalize.com/profile/{this.props.user.attributes.profileUrl}
                                                            </a>
                                                        </div>) : (
                                                                    <div  className="cq-dashboard__profile__info__entry">
                                                                        <small>Public URL</small>
                                                                        <a
                                                                            target="_blank"
                                                                            href={`https://www.quizalize.com/quiz/user/${this.props.user.uuid}`}>https://www.quizalize.com/quiz/user/{this.props.user.uuid}
                                                                        </a>
                                                                    </div>);
            if (UserIdStore.getUserId() === this.props.user.uuid && !this.props.own) {
                returnToPrivate = (<div>
                    <a
                        href="/quiz/user">
                            Return to your Private Profile
                    </a>
                </div>);
            }
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
                                picture={this.props.user.avatar}/>
                        </div>

                        <div className="cq-dashboard__profile__info">

                            <div className="cq-dashboard__profile__info__entry">
                                <h3>{name}</h3>
                                <a href="/quiz/settings">Edit Profile</a>
                            </div>

                            <div className="cq-dashboard__profile__info__entry">
                                <small>
                                    Affiliation
                                </small>
                                {school}
                            </div>
                            <div  className="cq-dashboard__profile__info__entry">
                                <small>Location</small>
                                {this.props.user.attributes.location}
                            </div>
                            {publicUrl}
                        </div>


                    </div>
                </div>
            );
        }
        return (
            <div>
                <div className="cq-dashboard__profile">
                    {profile}
                </div>
                <br/><br/>
                <div>
                    {returnToPrivate}
                </div>
            </div>
        );
    }

});

module.exports = CQDashboardProfile;
