/* @flow */
import React from 'react';
import {
    UserStore,
    MeStore,
} from './../../../../stores';
import CQViewProfilePicture from './../../../../components/views/CQViewProfilePicture';
import CQLink from './../../../../components/utils/CQLink';

import imageUrlParser from './../../../../utils/imageUrlParser';

import type {UserType} from './../../../../../../types';

type Props = {
    user: UserType;
}
type State = {
    user: ?UserType;
    isOwn: boolean;
}

class CQDashboardProfile extends React.Component {

    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = this.getState();

        this.onChange = this.onChange.bind(this);
        this.getState = this.getState.bind(this);

    }

    componentDidMount() {
        UserStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.onChange);
    }

    componentWillReceiveProps(nextProps : Props) {
        this.setState(this.getState(nextProps));
    }

    onChange(){
        this.setState(this.getState());
    }

    getState(props? : Props) : State {

        props = props || this.props;
        let isOwn = false;
        let user;
        if (props && props.user){
            user = props.user;

        }

        if (user && user.uuid === MeStore.state.uuid){
            isOwn = true;
        }

        return { user, isOwn };

    }

    render() : any {
        var profile, bannerStyles, school, profileUrl, returnToPrivate;

        if (this.props.user){

            if (this.props.user.attributes.bannerUrl){
                bannerStyles = {
                    backgroundImage: `url(${imageUrlParser(this.props.user.attributes.bannerUrl)})`,
                    height: 300
                };
            }

            if (this.props.user.attributes.profileUrl){
                profileUrl = '/profile/' + this.props.user.attributes.profileUrl;
            } else {
                profileUrl = '/quiz/user/'+ this.props.user.uuid;
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
            let editProfile;
            var className = this.props.user.attributes.bannerUrl ? 'banner' : 'no-banner';
            var name = this.props.user.name && this.props.user.name.length !== 0 ? this.props.user.name : 'Quizalize user';
            var publicUrl = this.props.user.attributes.profileUrl ? (
                <div className="cq-dashboard__profile__info__entry">
                    <small>Public URL</small>
                    <CQLink
                        href={`/profile/${this.props.user.attributes.profileUrl}`}>https://www.quizalize.com/profile/{this.props.user.attributes.profileUrl}
                    </CQLink>
                </div>
            ) : (
                <div className="cq-dashboard__profile__info__entry">
                    <small>Public URL</small>
                    <CQLink
                        href={`/quiz/user/${this.props.user.uuid}`}>https://www.quizalize.com/quiz/user/{this.props.user.uuid}
                    </CQLink>
                </div>
            );

            if (this.state.isOwn) {
                editProfile = (<CQLink href="/quiz/settings">Edit Profile</CQLink>);

            } else {
                publicUrl = undefined;
            }
            // WTF warning: This is used to check if the profile is the public
            // or the private mode
            if (this.props.own !== true){
                returnToPrivate = (<div style={{padding: '10px 40px'}}>
                    <CQLink
                        href="/quiz/user">
                            Return to your Private Profile
                    </CQLink>
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
                                {editProfile}
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

}

CQDashboardProfile.propTypes = {
    user: React.PropTypes.object,
    own: React.PropTypes.bool
};

module.exports = CQDashboardProfile;
