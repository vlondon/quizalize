/* @flow */
var React = require('react');

import type {User} from './../../../stores/UserStore';
var CQPageTemplate = require('./../../../components/CQPageTemplate');
var CQViewProfilePicture = require('./../../../components/views/CQViewProfilePicture');
var UserStore = require('./../../../stores/UserStore');
var UserActions = require('./../../../actions/UserActions');
var assign = require('object-assign');
var router = require('./../../../config/router');

var facebookSDK = require('./../../../config/facebookSDK');

import {urlParams} from './../../../utils';

type Params = {
    redirect: string;
}
type State = {
    user: User;
    params: Params;
}

var required = ['name', 'school', 'location'];
export default class CQSettings extends React.Component {

    state: State;

    constructor (props: any) {
        super(props);
        var user:User = UserStore.getUser();
        var params = urlParams();
        var canSave = false;
        this.state =  {
            user,
            params,
            canSave
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        facebookSDK.load();
    }

    handleSave(){
        UserActions.update(this.state.user)
            .then( ()=> {
                if (this.state.params.redirect){
                    router.setRoute(this.state.params.redirect);
                } else {
                    router.setRoute('/quiz/quizzes');
                }
            });
    }

    handleChange(field: string, event: Object){

        var user = assign({}, this.state.user);
        user.attributes[field] = event.target.value;
        this.setState({user});

    }

    handleNameChange(event: Object){

        var user = assign({}, this.state.user);

        user.name = event.target.value;
        this.setState({user});

    }

    handleProfilePicture(){
        facebookSDK.getProfilePicture()
            .then((profilePictureUrl) => {

                var user = assign({}, this.state.user);

                user.avatar = profilePictureUrl;

                this.setState({user}, ()=>{
                    UserActions.update(this.state.user);
                });

            });
    }

    render() {

        return (
            <CQPageTemplate className="cq-container cq-settings">

                <h3 className="cq-settings__header">
                    Settings
                </h3>

                <div className="cq-settings__profile ">
                    <div className="cq-settings__profile-item form-group">
                        <label htmlFor="name">Name <small>(required)</small></label>
                        <input type="text" id="name"
                            className="form-control"
                            placeholder = "e.g. John Smith"
                            onChange={this.handleNameChange}
                            value={this.state.user.name}/>
                    </div>

                    <div className="cq-settings__profile-item form-group">
                        <label htmlFor="school">School name / company <small>(required)</small></label>
                        <input type="text" id="school"
                            className="form-control"
                            placeholder = "e.g. City School Academy"
                            onChange={this.handleChange.bind(this, 'school')}
                            value={this.state.user.attributes.school}/>
                    </div>

                    <div className="cq-settings__profile-item form-group">
                       <label htmlFor="url">School Website</label>
                       <input type="url" id="url"
                           className="form-control"
                           placeholder="e.g. http://www.school.com"
                           onChange={this.handleChange.bind(this, 'url')}
                           value={this.state.user.attributes.url}/>
                    </div>

                    <div className="cq-settings__profile-item form-group">
                        <label htmlFor="location">Location <small>(required)</small></label>
                        <input type="text" id="location"
                            className="form-control"
                            placeholder = "e.g. London"
                            onChange={this.handleChange.bind(this, 'location')}
                            value={this.state.user.attributes.location}/>
                    </div>

                    <div className="cq-settings__profile-item form-group">
                        <label htmlFor="location">Age group taught</label>
                        <input type="text" id="location"
                            className="form-control"
                            placeholder = "e.g. Year 3 / Grade 3"
                            onChange={this.handleChange.bind(this, 'ageTaught')}
                            value={this.state.user.attributes.ageTaught}/>
                    </div>


                    <div className="cq-settings__profile-item form-group">
                        <label htmlFor="location">Subject taught</label>
                        <input type="text" id="location"
                            className="form-control"
                            placeholder = "e.g. Biology and Chemistry"
                            onChange={this.handleChange.bind(this, 'subjectTaught')}
                            value={this.state.user.attributes.subjectTaught}/>
                    </div>


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


                    <div className="cq-settings__save">
                        <button className="btn btn-danger" onClick={this.handleSave}>Save Profile</button>
                    </div>



                </div>
            </CQPageTemplate>
        );

    }


}
