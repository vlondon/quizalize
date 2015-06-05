var React = require('react');

var CQQuizOfTheDay = require('./CQQuizOfTheDay');
var QuizStore = require('createQuizApp/stores/QuizStore');

var CQQuizOfTheDayWithInfo = React.createClass({

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
        this.setState(this.getState());
    },

    getState: function(){
        var quiz = QuizStore.getQuizOfTheDay();
        return {
            quiz
        };
    },
    render: function() {
        return (
            <CQQuizOfTheDay quiz={this.state.quiz} />
        );
    }

});

module.exports = CQQuizOfTheDayWithInfo;
