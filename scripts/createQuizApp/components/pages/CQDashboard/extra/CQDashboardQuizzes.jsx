var React = require('react');


var QuizActions = require('createQuizApp/actions/QuizActions');
var QuizStore = require('createQuizApp/stores/QuizStore');
var GroupStore = require('createQuizApp/stores/GroupStore');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
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
        quizzes = quizzes.sort((a, b)=> a.timestamp > b.timestamp ? -1 : 1 );
        return { quizzes };
    },


    render: function() {
        return (
            <div className="cq-dashboard__quizzes">
                quizzes
                <ul>
                    {this.state.quizzes.map(function(quiz){
                        return (
                            <li>
                                <div className="cq-dashboard__quiz">

                                    {quiz.name}
                                </div>
                                <span>
                                    {quiz.subject}
                                </span>
                                <span>
                                    {quiz.category.name}
                                </span>
                            </li>
                        );
                    })}

                </ul>
            </div>
        );
    }

});

module.exports = CQDashboardQuizzes;
