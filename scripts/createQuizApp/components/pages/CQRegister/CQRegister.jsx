var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQLoginForm = require('createQuizApp/components/pages/shared/CQLoginForm');
var CQLink = require('createQuizApp/components/utils/CQLink');


var UserActions = require('createQuizApp/actions/UserActions');
var swal = require('sweetalert/dist/sweetalert-dev');
require('sweetalert/dev/sweetalert.scss');



var CQRegister = React.createClass({

    handleRegister: function(data){

        UserActions.register(data)
            .catch(function(){
                swal('Register Error', 'Something went wrong, please try again later.');
            });
    },
    render: function() {
        return (
            <CQPageTemplate className="container cq-login">
                <div className="row">
                    <div className="col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                        <div className="well">
                            <h2 id="title">Quizalize Registration</h2>

                            <CQLoginForm onSubmit={this.handleRegister}
                                buttonLabel='Sing up'>
                                <div>
                                    Already registered?&nbsp;
                                    <CQLink href="/quiz/login">Log in</CQLink>
                                </div>
                            </CQLoginForm>
                        </div>
                    </div>
                </div>
            </CQPageTemplate>
        );
    }

});

module.exports = CQRegister;
