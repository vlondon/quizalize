var React = require('react');

var CQPageTemplate = require('createQuizApp/flux/components/CQPageTemplate');



var CQNotFound = React.createClass({

    getInitialState: function() {
        return {};
    },


    render: function() {
        return (
            <CQPageTemplate className="container">
                <div id="intro" ng-show="nctrl.showHelp">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xs-12 text-center">
                                <h1>Welcome to Quizalize</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4"><img src="/img/helpScreens/create.png" className="img-responsive bordered"/>
                            <h4 className="text-primary">1. Choose a name for your quiz</h4>
                            <p>The only thing you need to do to get started.</p>
                            <p>Quiz Topic is optional and allows you to organise your quizzes. You can also choose from one of our premade quizzes.</p>
                        </div>
                        <div className="col-sm-4"><img src="/img/helpScreens/add.png" className="img-responsive bordered"/>
                        <h4 className="text-primary">2. Add questions and answers</h4>
                        <p>Quickly add questions and answers using our streamlined interface.</p>
                        <p>You can (optionally) add incorrect answers for use in multiple choice format and a subtopic to group questions.</p>
                    </div>
                    <div className="col-sm-4"><img src="/img/helpScreens/publish.png" className="img-responsive bordered"/>
                    <h4 className="text-primary">3. Publish your quiz to your students</h4>
                    <p>Your students can access our quizalize quiz app at quizal.me and enter the class code you received when publishing.</p>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4 col-sm-offset-4"><br/><br/>
                <button ng-click="nctrl.dismiss();" className="btn btn-info btn-block">Get Started</button>
            </div>
        </div>
    </div>
</div>
</CQPageTemplate>
);
}

});

module.exports = CQNotFound;
