/* @flow */
var React = require('react');

var CQPageTemplate  = require('./../../../components/CQPageTemplate');
var CQLoginForm     = require('./../../../components/pages/shared/CQLoginForm');
var CQLink          = require('./../../../components/utils/CQLink');
var CQZzishLogin    = require('./../../../components/pages/shared/CQZzishLogin');
var UserActions     = require('./../../../actions/UserActions');


var CQLogin = React.createClass({

    getInitialState: function() {
        return {};
    },


    handleChange: function(property:string, event:Object) {

        var newState = {};
        newState[property] = event.target.value;
        this.setState(newState);
    },

    handleLogin: function(data:Object){

        UserActions.login(data)
            .catch(function(err){
                if (err == "Error: Failed Dependency") {
                    swal('Zzish Login Error', 'It looks like you might be using your Zzish details to log into Quizalize. Click below to use Zzish instead');
                }
                else {
                    swal('Login Error', 'Invalid Details during login');
                }
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

                <CQZzishLogin/>

            </CQPageTemplate>
        );
    }

});

module.exports = CQLogin;
