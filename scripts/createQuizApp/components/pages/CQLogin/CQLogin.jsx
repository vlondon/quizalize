/* @flow */
var React = require('react');
var router          = require('./../../../config/router');
var CQPageTemplate  = require('./../../../components/CQPageTemplate');
var CQLoginForm     = require('./../../../components/pages/shared/CQLoginForm');
var CQLink          = require('./../../../components/utils/CQLink');

var UserActions     = require('./../../../actions/UserActions');
var UserStore       = require('./../../../stores/UserStore');


var CQLogin = React.createClass({

    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        if (UserStore.isLoggedIn()){
            setTimeout(function(){
                router.setRoute('/quiz/quizzes');
            }, 100);
        }
    },

    handleChange: function(property:string, event:Object) {

        var newState = {};
        newState[property] = event.target.value;
        this.setState(newState);
    },

    handleLogin: function(data:Object){

        UserActions.login(data)
            .then(function(){
                router.setRoute('/quiz/quizzes');
            })
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
