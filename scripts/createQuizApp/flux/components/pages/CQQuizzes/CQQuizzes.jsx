var React = require('react');

var QuizStore = require('createQuizApp/flux/stores/QuizStore');

var CQPageTemplate = require('createQuizApp/flux/components/CQPageTemplate');
var CQLink = require('createQuizApp/flux/components/utils/CQLink');

require('./CQQuizzesStyles');

var CQQuizzes = React.createClass({

    getInitialState: function() {
        return {
            quizzes: QuizStore.getQuizzes()
        };
    },

    componentDidMount: function() {
        QuizStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        console.log('onChange', QuizStore);
        this.setState({quizzes: QuizStore.getQuizzes()});
    },


    render: function() {

        var introCopy = this.state.quizzes.length === 0 ? 'Here are the quizzes you have created so far…' : 'Why don\'t you create a quiz for your class.';
        return (
            <CQPageTemplate className="container cq-quizzes">
                <div className="container">
                    <h2>Your Quizzes
                        <div className="pull-right">
                            <CQLink href="/quiz/create" className="btn btn-primary btn-lg">
                                Create a new quiz
                            </CQLink>
                        </div>
                    </h2>

                    <p>{introCopy}</p>

                    <div ng-show="quizzes.hasOwnQuizzes" className="row">
                        <div className="col-sm-12">
                            <div className="row well">
                                <div className="row">
                                    <div className="col-xs-3"><strong>Quiz Title</strong></div>
                                    <div className="col-xs-4"><strong>Subject/Topic</strong></div>
                                    <div className="col-xs-5"></div>
                                </div>

                                {this.state.quizzes.map(function(quiz){
                                    return (
                                        <div ng-repeat="quiz in quizzes.quizzes track by $index" ng-style="padding-bottom: 10px" className="row">
                                            <div className="col-xs-3">
                                                <h4>{quiz.name}</h4>
                                            </div>
                                            <div className="col-xs-4">
                                                <h4>
                                                    <span ng-show="quiz.subject">
                                                        {quiz.subject}
                                                    </span>
                                                    <span ng-show="quiz.categoryId">
                                                        {quiz.category.name}
                                                    </span>

                                                </h4>
                                            </div>
                                            <div className="col-xs-5">

                                                <CQLink href={`/quiz/create/${quiz.uuid}`}>
                                                    <button type="button" className="btn btn-info">
                                                        <span className="glyphicon glyphicon-pencil"></span>
                                                    </button>
                                                </CQLink>

                                                <button ng-click="quizzes.deleteQuiz(quiz);" ng-style="margin: 4px" className="btn btn-danger">
                                                    <span className="glyphicon glyphicon-remove"></span>
                                                </button>
                                                <CQLink href={`/quiz/published/${quiz.uuid}`}>
                                                    <button className="btn btn-info">
                                                        Set Quiz
                                                    </button>
                                                </CQLink>
                                                <a ng-click="quizzes.shareQuiz(quiz)" ng-style="margin: 4px" className="btn btn-info">Share</a>
                                                <a ng-click="quizzes.showResults(quiz)" ng-style="margin: 4px" className="btn btn-info">Results</a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>
            </CQPageTemplate>
        );
    }

});

module.exports = CQQuizzes;
