var React = require('react');


var UserActions = require('createQuizApp/flux/actions/UserActions');

var CQPageTemplate = require('createQuizApp/flux/components/CQPageTemplate');
var CQLoginForm = require('createQuizApp/flux/components/pages/shared/CQLoginForm');
var CQLink = require('createQuizApp/flux/components/utils/CQLink');

require('./CQLoginStyles');


var CQLogin = React.createClass({

    getInitialState: function() {
        return {
            email: '',
            password: ''
        };
    },

    handleChange: function(property, event) {

        var newState = {};
        newState[property] = event.target.value;
        this.setState(newState);
    },

    handleLogin: function(data){

        UserActions.login(data);
    },


    render: function() {
        return (
            <CQPageTemplate className="container cq-login">
                <div className="row">
                    <div className="col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                        <div className="well">
                            <h2 id="title">
                                Quizalize Login
                            </h2>
                            <CQLoginForm onSubmit={this.handleLogin}>

                                <div className="">
                                    Don't have an account?&nbsp;
                                    <CQLink href="/quiz/register"> Sign Up</CQLink>
                                </div>
                                <div ng-show="login.mode=='login'" className="">
                                    Forgotten Password? &nbsp;
                                    <CQLink href="/quiz/recover">Reset</CQLink>

                                </div>


                            </CQLoginForm>
                        </div>
                    </div>
                </div>
            </CQPageTemplate>
        );
    }

});

module.exports = CQLogin;
