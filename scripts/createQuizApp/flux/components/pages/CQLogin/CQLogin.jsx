var React = require('react');



var CQPageTemplate  = require('createQuizApp/flux/components/CQPageTemplate');
var CQLoginForm     = require('createQuizApp/flux/components/pages/shared/CQLoginForm');
var CQLink          = require('createQuizApp/flux/components/utils/CQLink');

var UserActions = require('createQuizApp/flux/actions/UserActions');
var swal = require('sweetalert/dist/sweetalert-dev');
require('sweetalert/dev/sweetalert.scss');


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

        UserActions.login(data)
            .catch(function(){
                swal('Login Error', 'Invalid Details during login');
            });
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
