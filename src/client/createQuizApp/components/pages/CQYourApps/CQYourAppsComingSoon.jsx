var React = require('react');

var CQYourAppsComingSoon = React.createClass({

    render: function() {
        return (
            <div>
                <div className="cq-yourapps__body">
                    <h3>
                        Coming soon!
                    </h3>
                    <p>
                        We're super excited that we'll shortly be launching our new
                        app creation feature. This will let you organise your quizzes
                        into your own collections or apps.
                    </p>
                    <p>
                        In the short term you'll be able to publish your apps to our
                        Quizalize Marketplace. You can see some example Quizalize Team apps there already.
                        In the longer term we aim to make it possible for you to publish these apps to
                        the Apple, Google and other mobile app stores.
                    </p>
                    <p>
                        Drop us an email at <a href="mailto:team@quizalize.com">team@quizalize.com</a> if
                        you would like to help test this upcoming feature. We'd love to hear from you!
                    </p>
                    <p>
                        The Quizalize Team.
                    </p>
                </div>
            </div>
        );
    }

});

module.exports = CQYourAppsComingSoon;
