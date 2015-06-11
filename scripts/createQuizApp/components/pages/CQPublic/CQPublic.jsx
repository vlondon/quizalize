var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQLink = require('createQuizApp/components/utils/CQLink');
var CQPublicList = require('./CQPublicList');
var CQPublicSort = require('./CQPublicSort');

var QuizActions = require('createQuizApp/actions/QuizActions');
var QuizStore  = require('createQuizApp/stores/QuizStore');

var moment = require('moment');

var router = require('createQuizApp/config/router');

require('./CQPublicStyles');

var CQPublic = React.createClass({

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {

        QuizStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
    },

    getState: function(){

        var quizzes = QuizStore.getPublicQuizzes();
        var newState = { quizzes };

        return newState;

    },

    onChange: function(){
        this.setState(this.getState());
    },

    handlePreview: function(quiz){
        sessionStorage.setItem('mode', 'teacher');
        window.location.href = `/app#/play/public/${quiz.uuid}`;

    },

    handleSet: function(quiz){
        router.setRoute(`/quiz/published/${quiz.uuid}`);
    },

    render: function() {

        return (
            <CQPageTemplate className="container cq-public">
                <h2>
                    Choose a quiz for your class
                </h2>
                <p>
                    Check out our pre-made quizzes. We're adding new ones all
                    the time! If you have any suggestions, tell us! Otherwise, you can <CQLink href='/quiz/create'>create your own in 60 seconds</CQLink>.
                </p>
                <CQPublicSort className="cq-public__sort"/>
                <CQPublicList quizzes={this.state.quizzes} className="cq-public__list" />
            </CQPageTemplate>
        );
    }

});

module.exports = CQPublic;
