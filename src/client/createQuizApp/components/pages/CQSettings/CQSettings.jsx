/* @flow */
var React = require('react');

import type {User} from './../../../stores/UserStore';
var CQPageTemplate = require('./../../../components/CQPageTemplate');
var CQViewProfilePicture = require('./../../../components/views/CQViewProfilePicture');
var UserActions = require('./../../../actions/UserActions');
var router = require('./../../../config/router');

var facebookSDK = require('./../../../config/facebookSDK');

import UserStore from './../../../stores/UserStore';
import MeStore from './../../../stores/MeStore';
import {urlParams} from './../../../utils';
import {sendEvent} from './../../../actions/AnalyticsActions';

import CQImageUploader from './../../../components/utils/CQImageUploader';
import MediaActions from './../../../actions/MediaActions';
import imageUrlParser from './../../../utils/imageUrlParser';



type Params = {
    redirect: string;
}
type State = {
    user: User;
    params: Params;
    canSave: boolean;
    errors: Array<boolean>;
    isNew: boolean;
    profileImageFile?: Object;
    profileImageData?: string;
}


export default class CQSettings extends React.Component {

    state: State;

    constructor (props: any) {
        super(props);

        var user:User = MeStore.getState();
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
        this.handleProfilePicture = this.handleProfilePicture.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.isFormValid = this.isFormValid.bind(this);

        this.handleProfileImageData = this.handleProfileImageData.bind(this);
        this.handleProfileImageFile = this.handleProfileImageFile.bind(this);
        this.handleBannerImageData = this.handleBannerImageData.bind(this);
        this.handleBannerImageFile = this.handleBannerImageFile.bind(this);
    }

    componentDidMount() {
        console.log("redirecting to after?", urlParams().redirect);
        facebookSDK.load();
    }

    isFormValid(): Object{
        //u?:User
        var canSave = true;
        console.log("errors", this);
        var errors = [false, false, false];
        // var user:User = u || this.state.user;
        return {canSave, errors};
        // if (!user.name || user.name.length < 2) {
        //     canSave = false;
        //     errors[0] = true;
        //
        // }
        //
        // if (!user.attributes.school || user.attributes.school.length < 2){
        //     canSave = false;
        //     errors[1] = true;
        // }
        //
        // if (!user.attributes.location || user.attributes.location.length < 2){
        //     canSave = false;
        //     errors[2] = true;
        // }
        //
        // if (!user.attributes.ageTaught || user.attributes.ageTaught.length < 2){
        //     canSave = false;
        //     errors[3] = true;
        // }
        //
        // if (!user.attributes.subjectTaught || user.attributes.subjectTaught.length < 2){
        //     canSave = false;
        //     errors[4] = true;
        // }
        //
        // return {canSave, errors};
    }

    handleSave(){

        var currentUserId = this.state.user.uuid;
        if (this.state.isNew) {
            sendEvent('register', 'details', 'filled');
        }
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
                    UserActions.update(this.state.user)
                        .then( ()=> {
                            var params = urlParams();
                            if (params.redirect){
                                router.setRoute(window.decodeURIComponent(params.redirect));
                            } else {
                                if (this.state.isNew) {
                                    router.setRoute('/quiz/marketplace');
                                }
                                else {
                                    router.setRoute('/quiz/user');
                                }
                            }
                    });
                }
        });
    }

    handleChange(field: string, event: Object){

        var user = Object.assign({}, this.state.user);

        user.attributes[field] = event.target.value;

        var {canSave, errors} = this.isFormValid(user);
        this.setState({user, canSave, errors});

    }

    handleNameChange(event: Object){

        var user = Object.assign({}, this.state.user);

        user.name = event.target.value;
        var {canSave, errors} = this.isFormValid(user);
        this.setState({user, canSave, errors});

    }

    handleProfilePicture(){
        facebookSDK.getProfilePicture()
            .then((profilePictureUrl) => {

                var user = Object.assign({}, this.state.user);

                user.avatar = profilePictureUrl;

                this.setState({user}, ()=>{
                    UserActions.update(this.state.user);
                });

            });
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
            router.setRoute("/quiz/marketplace");
        }
    }

    handleProfileImageData(profileImageData : string) {
        this.setState({profileImageData});
    }

    handleProfileImageFile(profileImageFile : Object) {
        console.log('image file', profileImageFile);
        this.setState({profileImageFile});
        MediaActions.uploadPicture(profileImageFile, 'profile').then((avatarUrl)=>{
            var user = this.state.user;
            user.avatar = avatarUrl;
            this.setState({user}, ()=>{
                UserActions.update(this.state.user);
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
                user.attributes.bannerUrl = bannerUrl;
                this.setState({user}, ()=>{
                    UserActions.update(this.state.user);
                });
            });
    }


    render() {

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
                    <div className=" cq-settings__facebook">
                        <button className="btn btn-danger" onClick={this.handleProfilePicture}>Get from facebook</button>
                    </div>
                    <div className="cq-settings__upload">
                        <CQImageUploader
                            id="imageUploader"
                            className="cq-settings__upload__input"
                            onImageData={this.handleProfileImageData}
                            onImageFile={this.handleProfileImageFile}
                        />
                        <button className="btn btn-danger " onClick={this.handleProfilePicture}>Upload a picture</button>
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

        message = this.state.isNew ? 'We need some extra information' : 'Settings';

        var editProfile = () => {
            if (!this.state.isNew) {
                return (
                    <div>
                        <div className={`cq-settings__profile-item${classNameError(5)} form-group`}>
                            <label htmlFor="url">Your personal Quizalize url www.quizalize.com/profile/…</label>

                            <input type="text" id="profileUrl"
                                className="form-control"
                                placeholder = "e.g. Your own personal Quizalize URL"
                                onChange={this.handleChange.bind(this, 'profileUrl')}
                                value={this.state.user.attributes.profileUrl}/>
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
            <CQPageTemplate className="cq-container cq-settings">

                <h3 className="cq-settings__header">
                    <div className="skip">
                        {skipButton}
                    </div>
                    {message}
                </h3>

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
            </CQPageTemplate>
        );

    }


}

CQSettings.propTypes = {
    isRegister: React.PropTypes.bool
};
