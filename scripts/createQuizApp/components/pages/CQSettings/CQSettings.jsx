
var React = require('react');
var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQViewProfilePicture = require('createQuizApp/components/views/CQViewProfilePicture');
var UserStore = require('createQuizApp/stores/UserStore');
var UserActions = require('createQuizApp/actions/UserActions');
var assign = require('object-assign');
var router = require('createQuizApp/config/router');

var facebookSDK = require('createQuizApp/config/facebookSDK');

var CQSettings = React.createClass({

    getInitialState: function() {
        var user = UserStore.getUser();
        return {
            user
        };
    },
    componentDidMount: function() {
        facebookSDK.load();
    },

    handleSave: function(){
        UserActions.update(this.state.user)
            .then( ()=> router.setRoute('/quiz/quizzes'));
    },
    handleChange: function(field, event){

        var user = assign({}, this.state.user);
        user.attributes[field] = event.target.value;
        this.setState({user});

    },

    handleNameChange: function(event){

        var user = assign({}, this.state.user);
        user.name = event.target.value;
        this.setState({user});

    },

    handleProfilePicture: function(){
        facebookSDK.getProfilePicture()
            .then((profilePictureUrl) => {
                console.log('we got', profilePictureUrl);
                var user = assign({}, this.state.user);
                user.avatar = profilePictureUrl;
                this.setState({user}, ()=>{
                    UserActions.update(this.state.user);
                });
            });
    },

    render: function() {
        return (
            <CQPageTemplate className="cq-container cq-settings">

                <h3 className="cq-settings__header">
                    Settings
                </h3>

                <div className="cq-settings__profile ">
                    <div className="cq-settings__profile-item form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name"
                            className="form-control"
                            placeholder = "e.g. Mr Smith"
                            onChange={this.handleNameChange}
                            value={this.state.user.name}/>
                    </div>

                    <div className="cq-settings__profile-item form-group">
                        <label htmlFor="school">School name / company</label>
                        <input type="text" id="school"
                            className="form-control"
                            placeholder = "e.g. City School Academy"
                            onChange={this.handleChange.bind(this, 'school')}
                            value={this.state.user.attributes.school}/>
                    </div>

                    <div className="cq-settings__profile-item form-group">
                       <label htmlFor="url">URL</label>
                       <input type="url" id="url"
                           className="form-control"
                           onChange={this.handleChange.bind(this, 'url')}
                           value={this.state.user.attributes.url}/>
                    </div>

                    <div className="cq-settings__profile-item form-group">
                        <label htmlFor="location">Location</label>
                        <input type="text" id="location"
                            className="form-control"
                            placeholder = "e.g. London"
                            onChange={this.handleChange.bind(this, 'location')}
                            value={this.state.user.attributes.location}/>
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


});

module.exports = CQSettings;
