var React = require('react');
var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var UserStore = require('createQuizApp/stores/UserStore');
var UserActions = require('createQuizApp/actions/UserActions');
var assign = require('object-assign');
var router = require('createQuizApp/config/router');

var CQSettings = React.createClass({
    getInitialState: function() {
        var user = UserStore.getUser();

        return {
            user: UserStore.getUser()
        };
    },

    handleSave: function(){
        UserActions.update(this.state.user)
            .then( ()=> router.setRoute('/quiz'));
    },
    handleChange: function(field, event){
        console.log('field', field, event);
        var user = assign({}, this.state.user);
        user.attributes[field] = event.target.value;
        this.setState({user});
    },
    render: function() {
        return (
            <CQPageTemplate className="container cq-settings">


                <h3>Settings</h3>

                <div className="cq-settings__profile">
                    <div className="cq-settings__profile-item">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name"
                            onChange={this.handleChange.bind(this, 'name')}
                            value={this.state.user.attributes.name}/>
                    </div>

                    <div className="cq-settings__profile-item">
                        <label htmlFor="school">School name / company</label>
                        <input type="text" id="school"
                            onChange={this.handleChange.bind(this, 'school')}
                            value={this.state.user.attributes.school}/>
                    </div>

                    <div className="cq-settings__profile-item">
                        <label htmlFor="location">Location</label>
                        <input type="text" id="location"
                            onChange={this.handleChange.bind(this, 'location')}
                            value={this.state.user.attributes.location}/>
                    </div>

                    <div className="cq-settings__profile-item">
                        <label htmlFor="url">URL</label>
                        <input type="url" id="url"
                            onChange={this.handleChange.bind(this, 'url')}
                            value={this.state.user.attributes.url}/>
                    </div>

                    <div className="cq-settings__profile-item">
                        Profile Picture
                    </div>

                    <button className="btn" onClick={this.handleSave}>Save</button>


                </div>
            </CQPageTemplate>
        );
    }

});

module.exports = CQSettings;
