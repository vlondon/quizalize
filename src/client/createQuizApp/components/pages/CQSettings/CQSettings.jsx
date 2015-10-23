/* @flow */
import React from 'react';

import { router } from './../../../config';
import {
    CQPageTemplate,
    CQViewProfilePicture,
    CQImageUploader,
} from './../../../components';

import {
    UserActions,
    MediaActions
} from './../../../actions';
import { sendEvent } from './../../../actions/AnalyticsActions';


import { MeStore } from './../../../stores';
import { urlParams } from './../../../utils';
import { imageUrlParser } from './../../../utils';

import CQSettingsSubscriptions from './CQSettingsSubscriptions';
import type {UserType} from './../../../../../types';


type Params = {
    redirect: string;
}
type State = {
    user: UserType;
    params: Params;
    canSave: boolean;
    errors: Array<boolean>;
    isNew: boolean;
    profileImageFile?: Object;
    profileImageData?: string;
}

const newUserPage = '/quiz/welcome';


export default class CQSettings extends React.Component {

    state: State;

    constructor (props: any) {
        super(props);

        var user:UserType = MeStore.state;
        var params = urlParams();
        var {canSave, errors} = this.isFormValid(user);
        var isNew = this.props.isRegister === true;

        this.state =  {
            user,
            params,
            canSave,
            errors,
            isNew
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.isFormValid = this.isFormValid.bind(this);

        this.handleProfileImageData = this.handleProfileImageData.bind(this);
        this.handleProfileImageFile = this.handleProfileImageFile.bind(this);
        this.handleBannerImageData = this.handleBannerImageData.bind(this);
        this.handleBannerImageFile = this.handleBannerImageFile.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    onChange(){
        var user:UserType = MeStore.state;
        this.setState({user});
        this.forceUpdate();
    }
    componentDidMount() {
        MeStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        MeStore.removeChangeListener(this.onChange);
    }


    isFormValid(): Object{
        //u?:User
        var canSave = true;
        var errors = [false, false, false];
        // var user:User = u || this.state.user;
        return {canSave, errors};

    }

    handleSave(){
        let {user} = this.state;
        // var user = this.state;

        var currentUserId = user.uuid;
        if (this.state.isNew) {
            sendEvent('register', 'details', 'filled');
        }
        var doSave = ()=>{
            UserActions.update(user.toJSON())
                .then( ()=> {
                    var params = urlParams();
                    if (params.redirect){
                        router.setRoute(window.decodeURIComponent(params.redirect));
                    } else {
                        if (this.state.isNew) {
                            router.setRoute(newUserPage);
                        }
                        else {
                            router.setRoute('/quiz/user');
                        }
                    }
            });
        };

        if (user.attributes.profileUrl === undefined || user.attributes.profileUrl === null || user.attributes.profileUrl.length === 0) {
            doSave();
        } else {
            UserActions.search({profileUrl: this.state.user.attributes.profileUrl})
                .then( (users) => {
                    //am i one of the bunch
                    var found = false;
                    users.forEach(function(user) {
                        if (user.uuid === currentUserId) {
                            found = true;
                        }
                    });
                    if (!found && users.length > 0) {
                        swal('Already Taken', 'Sorry that Quizalize URL is already taken. Please try again');
                    }
                    else {
                        doSave();
                    }
            });
        }
    }

    handleChange(field: string, event: Object){

        var {user} = this.state;
        var attributes = user.attributes.set(field, event.target.value);
        user = user.set('attributes', attributes);

        var {canSave, errors} = this.isFormValid(user);

        this.setState({user, canSave, errors});

    }

    handleNameChange(event: Object){

        var {user} = this.state;

        user = user.set('name', event.target.value);
        var {canSave, errors} = this.isFormValid(user);
        this.setState({user, canSave, errors});

    }


    handleSkip() {
        sendEvent('register', 'details', 'skipped');
        var params = urlParams();
        if (params.redirect){
            // window.location = window.decodeURIComponent(params.redirect);
            router.setRoute(window.decodeURIComponent(params.redirect));
            // return true;
        }
        else {
            router.setRoute(newUserPage);
        }
    }

    handleProfileImageData(profileImageData : string) {
        this.setState({profileImageData});
    }

    handleProfileImageFile(profileImageFile : Object) {
        this.setState({profileImageFile});
        MediaActions.uploadPicture(profileImageFile, 'profile').then((avatarUrl)=>{
            var user = this.state.user;
            user = user.set('avatar', avatarUrl);
            this.setState({user}, ()=>{
                UserActions.update(this.state.user.toJSON());
            });
        });
    }

    handleBannerImageData(bannerImageData : string) {
        this.setState({bannerImageData});
    }

    handleBannerImageFile(bannerImageFile : Object) {
        this.setState({bannerImageFile});
        MediaActions.uploadPicture(bannerImageFile, 'banner', 1070, 1070, false)
            .then((bannerUrl)=>{
                var user = this.state.user;
                var attributes = user.attributes.set('bannerUrl', bannerUrl);
                user = user.set('attributes', attributes);
                this.setState({user}, ()=>{
                    UserActions.update(this.state.user.toJSON());
                });
            });
    }


    render(): any {

        var message, profilePicture, schoolWebsite, skipButton;
        var classNameError = (index) => {
            return this.state.errors[index] ? '--error' : '';
        };

        if (!this.state.isNew) {
            profilePicture = (
                <div className="cq-settings__profile-item cq-settings__profilepicture form-group">
                    <label>Profile picture</label>
                    <div className="cq-settings__picture">

                        <CQViewProfilePicture
                            width="150"
                            height="150"
                            name={this.state.user.name}
                            picture={this.state.user.avatar}
                            pictureData={this.state.profileImageData}/>

                    </div>

                    <div className="cq-settings__upload">
                        <CQImageUploader
                            id="imageUploader"
                            className="cq-settings__upload__input"
                            onImageData={this.handleProfileImageData}
                            onImageFile={this.handleProfileImageFile}
                        />
                        <button className="btn btn-danger">Upload a picture</button>
                    </div>
                </div>
            );

            schoolWebsite = (
                <div className="cq-settings__profile-item form-group">
                   <label htmlFor="url">Your website</label>
                   <input type="url" id="url"
                       className="form-control"
                       placeholder="e.g. http://www.school.com"
                       onChange={this.handleChange.bind(this, 'url')}
                       value={this.state.user.attributes.url}/>
                </div>
            );
        } else {
            skipButton = (
                <button className="btn btn-danger btn-sm"
                    onClick={this.handleSkip}>
                    Skip
                </button>
            );
        }

        message = this.state.isNew ? 'Complete your registration' : 'Settings';
        var exampleUrlText = this.state.user.attributes.profileUrl ? "People will be able to access your profile at:" : "";
        var exampleUrl = this.state.user.attributes.profileUrl ? `www.quizalize.com/profile/${this.state.user.attributes.profileUrl}` : "";

        var editProfile = () => {
            if (!this.state.isNew) {
                return (
                    <div>
                        <div className={`cq-settings__profile-item${classNameError(5)} form-group`}>
                            <label htmlFor="url">Your personal Quizalize URL</label>

                            <input type="text" id="profileUrl"
                                className="form-control"
                                placeholder = "e.g. Your own personal Quizalize URL"
                                onChange={this.handleChange.bind(this, 'profileUrl')}
                                value={this.state.user.attributes.profileUrl}/>
                            {exampleUrlText}
                            <br/>
                            <label>
                                {exampleUrl}
                            </label>
                        </div>
                        <div className={`cq-settings__profile-item${classNameError(6)} form-group`}>
                            <label htmlFor="url">Quizalize Banner <i>(suggested size is 1070px x 300px)</i></label>

                            <img src={imageUrlParser(this.state.user.attributes.bannerUrl)} className="cq-settings__banner"/>
                            <div className="cq-settings__upload">
                                <CQImageUploader
                                    id="bannerUploader"
                                    className="cq-settings__upload__input"
                                    onImageData={this.handleBannerImageData}
                                    onImageFile={this.handleBannerImageFile}
                                />
                                <button className="btn btn-danger">Upload a banner</button>
                            </div>

                        </div>
                    </div>
                );
            }
        };

        return (
            <div className="cq-container cq-settings">
                <h3 className="cq-settings__header">
                    <div className="skip">
                        {skipButton}
                    </div>
                    {message}
                </h3>
                {/*<div className="cq-settings__cols">
                    <div className="cq-settings__col1">*/}

                        <div className={`cq-settings__profile`}>
                            <div className={`cq-settings__profile-item${classNameError(0)} form-group`}>
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name"
                                    className="form-control"
                                    placeholder = "e.g. John Smith"
                                    onChange={this.handleNameChange}
                                    value={this.state.user.name}/>
                            </div>

                            <div className={`cq-settings__profile-item${classNameError(1)} form-group`}>
                                <label htmlFor="school">School name / company</label>
                                <input type="text" id="school"
                                    className="form-control"
                                    placeholder = "e.g. City School Academy"
                                    onChange={this.handleChange.bind(this, 'school')}
                                    value={this.state.user.attributes.school}/>
                            </div>

                            {schoolWebsite}

                            <div className={`cq-settings__profile-item${classNameError(2)} form-group`}>
                                <label htmlFor="location">Location</label>
                                <input type="text" id="location"
                                    className="form-control"
                                    placeholder = "e.g. London, UK"
                                    onChange={this.handleChange.bind(this, 'location')}
                                    value={this.state.user.attributes.location}/>
                            </div>

                            <div className={`cq-settings__profile-item${classNameError(3)} form-group`}>
                                <label htmlFor="location">Age groups taught</label>
                                <input type="text" id="location"
                                    className="form-control"
                                    placeholder="e.g. Year 3 - Year 5 / Grade 3 - Grade 5"
                                    onChange={this.handleChange.bind(this, 'ageTaught')}
                                    value={this.state.user.attributes.ageTaught}/>
                            </div>


                            <div className={`cq-settings__profile-item${classNameError(4)} form-group`}>
                                <label htmlFor="location">Subjects taught</label>
                                <input type="text" id="location"
                                    className="form-control"
                                    placeholder = "e.g. Biology and Chemistry"
                                    onChange={this.handleChange.bind(this, 'subjectTaught')}
                                    value={this.state.user.attributes.subjectTaught}/>
                            </div>

                            {editProfile()}

                            {profilePicture}


                            <div className="cq-settings__save">
                                <button className="btn btn-danger"
                                    disabled={!this.state.canSave}
                                    onClick={this.handleSave}>
                                    Save Profile
                                </button>
                            </div>



                        </div>
                    {/*</div>

                    <div className="cq-settings__col2">
                        <div className="cq-settings__subscriptions">
                            <b>Your subscription</b>
                            <CQSettingsSubscriptions user={this.state.user}/>
                        </div>
                    </div>
                </div>*/}
            </div>
        );

    }


}

CQSettings.propTypes = {
    isRegister: React.PropTypes.bool
};
