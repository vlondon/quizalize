var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQLoginForm = require('createQuizApp/components/pages/shared/CQLoginForm');
var CQLink = require('createQuizApp/components/utils/CQLink');

var UserActions = require('createQuizApp/actions/UserActions');


var CQRestorePassword = React.createClass({

    getInitialState: function() {
        return {
            email: '',
            password: ''
        };
    },

    handleSubmit: function(data) {

        // expects data as an object with
        // email and password
        console.log('form submitted with', data);
        UserActions.reset(this.props.code, data.password)
            .then(function(){
                console.log('yay');
                swal({
                    title: 'Reset Password',
                    text: 'Your password has been saved. You\'ll be redirected in a few seconds.',
                    timer: 3000,
                    showConfirmButton: false
                });

            })
            .catch(function(){
                console.log('nay');
                swal('Reset Password', 'We couldn\'t save your password.', 'error');
            });
        // swal('Reset Password', 'If you are registered, please check your email for instructions on how to reset your password', 'success');


    },


    render: function() {
        return (
            <CQPageTemplate className="cq-login">

                <div className="cq-login__inner">
                    <h2 id="title" className="cq-login__header">Password Reset</h2>
                        <CQLoginForm
                            showPasswordField={true}
                            showEmailField={false}
                            onSubmit={this.handleSubmit}
                            buttonLabel="Reset Password">

                            <div className="">
                                Don't have an account?&nbsp;
                                <CQLink href="/quiz/register">Sign Up</CQLink>
                            </div>
                            <div>
                                Already registered?&nbsp;
                                <CQLink href="/quiz/login">Log in</CQLink>
                            </div>


                        </CQLoginForm>
                </div>

            </CQPageTemplate>
        );
    }

});

module.exports = CQRestorePassword;
