var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQLoginForm = require('createQuizApp/components/pages/shared/CQLoginForm');
var CQLink = require('createQuizApp/components/utils/CQLink');


var UserActions = require('createQuizApp/actions/UserActions');
var swal = require('sweetalert/dist/sweetalert-dev');
var urlParams  = require('createQuizApp/utils/urlParams');
require('sweetalert/dev/sweetalert.scss');



var CQRegister = React.createClass({

    getInitialState: function() {
        console.log('window.location.search;,', window.location.search);
        return {
            isRedirect: urlParams().redirect ? true : false,
            redirectUrl: ''
        };
    },

    handleRegister: function(data){

        UserActions.register(data)
            .catch(function(){
                swal('Register Error', 'Something went wrong, please try again later.');
            });
    },
    render: function() {

        var moreInfo;
        if (this.state.isRedirect){
            moreInfo = (<p style={{'text-align': 'center'}}>
                Before we can continue you'll need to create a new Quizalize account.
                <br/>
                <br/>
            </p>);
        }
        return (
            <CQPageTemplate className="container cq-login">
                <div className="row">
                    <div className="col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                        <div className="well">
                            <h2 id="title" style={{'text-align': 'center'}}>
                                Quizalize Registration
                            </h2>

                            {moreInfo}

                            <CQLoginForm onSubmit={this.handleRegister}
                                buttonLabel='Sign up'>
                                <div>
                                    Already registered?&nbsp;
                                    <CQLink href={`/quiz/login${window.location.search}`}>Log in</CQLink>
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
