var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQLoginForm = require('createQuizApp/components/pages/shared/CQLoginForm');
var CQLink = require('createQuizApp/components/utils/CQLink');


var UserActions = require('createQuizApp/actions/UserActions');
var urlParams  = require('createQuizApp/utils/urlParams');


var CQRegister = React.createClass({

    getInitialState: function() {
        console.log('window.location.search;,', window.location.search);
        return {
            isRedirect: urlParams().redirect ? true : false,
            redirectUrl: '',
            isEnabled: true,
            loginButtonLabel: 'Sign up'
        };
    },

    handleRegister: function(data){
        this.setState({
            isEnabled: false,
            loginButtonLabel: 'Working…'
        });
        UserActions.register(data)
            .catch((error) => {
                console.log('error AAA', typeof error);
                if (error === 'Duplicate Email address'){
                    swal('Register Error', 'This email has already been used.');
                } else {
                    swal('Register Error', 'Something went wrong, please try again later.');
                }
                this.setState({
                    isEnabled: true,
                    loginButtonLabel: 'Sign up'
                });
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
            <CQPageTemplate className="cq-login">

                <div className="cq-login__inner">
                    <h2 className="cq-login__header" id="title">
                        Quizalize Registration
                    </h2>

                    {moreInfo}

                    <CQLoginForm
                        enabled={this.state.isEnabled}
                        onSubmit={this.handleRegister}
                        buttonLabel={this.state.loginButtonLabel}>
                        <div>
                            Already registered?&nbsp;
                            <CQLink href={`/quiz/login${window.location.search}`}>Log in</CQLink>
                        </div>
                    </CQLoginForm>
                </div>
            </CQPageTemplate>
        );
    }

});

module.exports = CQRegister;
