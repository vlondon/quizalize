/* @flow */
var React = require('react');

import type {User} from './../../../stores/UserStore';
import CQLink from './../../../components/utils/CQLink';
var CQPageTemplate = require('./../../../components/CQPageTemplate');
var CQViewProfilePicture = require('./../../../components/views/CQViewProfilePicture');
var UserStore = require('./../../../stores/UserStore');
var UserActions = require('./../../../actions/UserActions');
var router = require('./../../../config/router');

var facebookSDK = require('./../../../config/facebookSDK');

import {urlParams} from './../../../utils';
import {sendEvent} from './../../../actions/AnalyticsActions';

type Params = {
    redirect: string;
}
type State = {
    user: User;
    params: Params;
    canSave: boolean;
    errors: Array<boolean>;
    isNew: boolean;
}


export default class CQSettings extends React.Component {

    state: State;

    constructor (props: any) {
        super(props);

        var user:User = UserStore.getUser();
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

        if (this.state.isNew) {
            sendEvent('register', 'details', 'filled');
        }
        UserActions.update(this.state.user)
            .then( ()=> {
                router.setRoute('/quiz/quizzes');
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

    handleSkip(){
        console.log('registering', sendEvent);
        sendEvent('register', 'details', 'skipped');
        var params = urlParams();
        if (params.redirect && params.final){
            window.location = window.decodeURIComponent(params.redirect);
            return true;
        }
        return false;
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
                            picture={this.state.user.avatar}/>
                    </div>
                    <button className="btn btn-danger" onClick={this.handleProfilePicture}>Get from facebook</button>
                </div>
            );

            schoolWebsite = (
                <div className="cq-settings__profile-item form-group">
                   <label htmlFor="url">School Website</label>
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
