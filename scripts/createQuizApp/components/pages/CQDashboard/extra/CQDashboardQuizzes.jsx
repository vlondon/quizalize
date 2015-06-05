var React = require('react');
var moment = require('moment');

var QuizActions = require('createQuizApp/actions/QuizActions');
var QuizStore = require('createQuizApp/stores/QuizStore');
var GroupStore = require('createQuizApp/stores/GroupStore');

var CQLink = require('createQuizApp/components/utils/CQLink');



var CQDashboardQuizzes = React.createClass({

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        QuizStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        console.log('onChange', QuizStore);
        this.setState(this.getState());
    },

    getState: function(){

        var quizzes = QuizStore.getQuizzes();
        console.log('quizzes', quizzes);
        quizzes = quizzes.sort((a, b)=> a.updated > b.updated ? -1 : 1 ).splice(0, 5);
        return { quizzes };
    },


    render: function() {

        var subject,
            category;


        subject = (quiz) => {
            if (quiz.subject) {
                return (
                    <span className="cq-label">
                        <b>
                            Subject:
                        </b>
                        {quiz.subject}
                    </span>
                );
            }
            return null;
        };


        category = (quiz) => {
            if (quiz.category && quiz.category.name) {

                return (
                    <span className="cq-label">
                        <i className="cq-icon fa fa-flag"></i>
                        {quiz.category.name}
                    </span>
                );
            }
            return null;
        };

        return (
            <div className="cq-dashboard__quizzes">
                <CQLink href="/quiz/create" className="cq-dashboard__createquiz">
                    Create Quiz
                </CQLink>

                <h3>Quizzes</h3>

                <ul className="cq-dashboard__quizlist">
                    {this.state.quizzes.map(function(quiz){
                        return (
                            <li className="cq-dashboard__quiz">
                                <CQLink href={`/quiz/create/${quiz.uuid}`}>
                                    <div className="cq-dashboard__quizup">
                                        <h4 className="cq-dashboard__quizname">
                                            <i className="cq-icon fa fa-th-large"></i>
                                            {quiz.name}
                                        </h4>
                                    </div>
                                    <div className="cq-dashboard__quizdown">
                                        <span className="updated">
                                            <div className="cq-icon fa fa-pencil-square"></div>
                                            Updated {moment(quiz.updated).fromNow()}
                                        </span>
                                        <span className="created">
                                            <div className="cq-icon fa fa-plus-square"></div>
                                            Created {moment(quiz.created).fromNow()}
                                        </span>
                                        {subject(quiz)}
                                        {category(quiz)}
                                    </div>
                                </CQLink>
                            </li>
                        );
                    })}

                </ul>
            </div>
        );
    }

});

module.exports = CQDashboardQuizzes;
