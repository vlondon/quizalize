var React = require('react');

var CQPageTemplate  = require('createQuizApp/components/CQPageTemplate');
var CQLoginForm     = require('createQuizApp/components/pages/shared/CQLoginForm');
var CQLink          = require('createQuizApp/components/utils/CQLink');

var UserActions = require('createQuizApp/actions/UserActions');

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
            <CQPageTemplate className="cq-login">


                <div className="cq-login__inner">
                    <h2 id="title" className="cq-login__header">
                        Quizalize Login
                    </h2>
                    <CQLoginForm onSubmit={this.handleLogin}>

                        <div>
                            Don't have an account?&nbsp;
                            <CQLink href={`/quiz/register${window.location.search}`}>Sign Up</CQLink>
                        </div>
                        <div>
                            Forgotten Password? &nbsp;
                            <CQLink href="/quiz/recover">Reset</CQLink>
                        </div>


                    </CQLoginForm>

                </div>
            </CQPageTemplate>
        );
    }

});

module.exports = CQLogin;
