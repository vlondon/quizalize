var React = require('react');

var CQPageTemplate = require('createQuizApp/flux/components/CQPageTemplate');
var CQLoginForm = require('createQuizApp/flux/components/pages/shared/CQLoginForm');
var CQLink = require('createQuizApp/flux/components/utils/CQLink');

require('./CQRegister');

var CQRegister = React.createClass({

    render: function() {
        return (
            <CQPageTemplate className="container cq-login">
                <div className="row">
                    <div className="col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                        <div className="well">
                            <h2 id="title">Quizalize Registration</h2>

                            <CQLoginForm>
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
