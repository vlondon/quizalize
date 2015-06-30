var React = require('react');
var assign = require('object-assign');
var router = require('createQuizApp/config/router');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQQuestionList = require('./CQQuestionList');
var CQLink = require('createQuizApp/components/utils/CQLink');

var QuizStore = require('createQuizApp/stores/QuizStore');
var QuizActions = require('createQuizApp/actions/QuizActions');

var TopicStore = require('createQuizApp/stores/TopicStore');
var TopicActions = require('createQuizApp/actions/TopicActions');


var CQEdit = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string.isRequired
    },


    getInitialState: function() {

        return {
            mode: 'Create',
            pristine: true,
            saveEnabled: true
        };
    },

    _getQuiz: function(props){
        props = props || this.props;
        var quiz = QuizStore.getQuiz(props.quizId);
        return quiz;
    },

    componentDidMount: function() {
        TopicStore.addChangeListener(this.onChange);
        QuizStore.addChangeListener(this.onChange);
        this.onChange();
    },

    componentWillUnmount: function() {
        TopicStore.removeChangeListener(this.onChange);
        QuizStore.removeChangeListener(this.onChange);
    },

    componentWillReceiveProps: function(nextProps) {
        this.onChange(nextProps);
    },

    onChange: function(props){
        props = props || this.props;
        // TODO: we need to load the quiz without having to worry about
        // if the quiz store have finished loading

        var newState = {
            quiz: this._getQuiz(props)
        };

        if (newState.quiz){
            newState.quiz.payload.questions = newState.quiz.payload.questions || [];
            if (props.questionIndex) {
                newState.questionIndex = parseInt(props.questionIndex, 10);
            } else {
                // newState.questionIndex = newState.quiz.questions.length;
                // newState.questionIndex = this.state.questionIndex;
            }

            // Check if the questionIndex is in range
            if (newState.questionIndex > newState.quiz.payload.questions.length){

                setTimeout(function(){
                    router.setRoute(`/quiz/create/${newState.quiz.uuid}`);
                }, 550);
            }
        }
        this.setState(newState);
    },

    handleQuestion: function(question){

        var updatedQuiz = assign({}, this.state.quiz);

        var index = this.state.questionIndex;

        if (index === undefined) {
            index = this.state.quiz.payload.questions.length;
        }


        updatedQuiz.payload.questions[index] = question;
        this.setState({
            quiz: updatedQuiz,
            pristine: false
        });
    },

    handleSaveNewQuestion: function(newQuestion){
        QuizActions.newQuiz(this.state.quiz).then( ()=> {
            router.setRoute(`/quiz/create/${this.state.quiz.uuid}/${this.state.quiz.payload.questions.length}`);
        });
    },

    handleRemoveQuestion: function(question, event){
        event.stopPropagation();
        swal({
                title: 'Confirm Delete',
                text: 'Are you sure you want to permanently delete this question?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }, (isConfirm) => {
            if (isConfirm){
                var questionIndex = this.state.quiz.payload.questions.indexOf(question);
                var quiz = assign({}, this.state.quiz);
                quiz.payload.questions = this.state.quiz.payload.questions;
                quiz.payload.questions.splice(questionIndex, 1);
                console.log('about to remove question', quiz.payload.questions);
                this.setState({quiz}, ()=> QuizActions.newQuiz(this.state.quiz) );
            }
        });
    },

    handleFinished: function(){
        QuizActions.newQuiz(this.state.quiz).then( ()=> {
            router.setRoute(`/quiz/published/${this.state.quiz.uuid}`);
        });
    },

    handleSaveButton: function(){
        QuizActions.newQuiz(this.state.quiz).then(()=>{
            this.setState({pristine: true});
        });
    },
  /*  handlePreview: function(){
        QuizActions.newQuiz(this.state.quiz).then( ()=> {
            window.open(`/app#/preview/${this.state.quiz.meta.profileId}/${this.state.quiz.uuid}`, '_blank');
        });
    },*/

    enableDisableSave: function(saveEnabled){
        this.setState({saveEnabled});
    },

    render: function() {

        if (this.state.quiz){

            var previewEnabled = this.state.quiz.payload.questions && this.state.quiz.payload.questions.length > 0;

            return (
                <CQPageTemplate className="container cq-edit">

                    <div className="cq-edit__header">
                        <h3>Now editing quiz&nbsp;
                            <span style={{color: 'red'}}>{this.state.quiz.meta.name}</span>
                            <CQLink href={`/quiz/edit/${this.state.quiz.uuid}`}>
                                <button className="btn btn-sm btn-info">
                                    <span className="glyphicon glyphicon-cog"> </span>
                                </button>
                            </CQLink>
                        </h3>
                        <p className="small">
                            Speed Tip: We found clicking is a pain - just hit enter to step through quickly
                        </p>
                    </div>


                    <h4>Your questions</h4>

                    <CQQuestionList
                        quiz={this.state.quiz}
                        questionIndex={this.state.questionIndex}
                        handleQuestion={this.handleQuestion}
                        handleRemoveQuestion={this.handleRemoveQuestion}
                        setSaveMode={this.enableDisableSave}
                        handleSave={this.handleSaveNewQuestion}/>

                    <div className="cq-edit__footer">
                        <div className="cq-edit__footer-inner">

                            <a
                                disabled={!previewEnabled}
                                href={`/app#/preview/${this.state.quiz.meta.profileId}/${this.state.quiz.uuid}`}
                                target="zzishgame"
                                className="btn btn-info">
                                Preview
                            </a>

                            <button
                                disabled={!previewEnabled || this.state.pristine || !this.state.saveEnabled}
                                className="btn btn-primary"
                                onClick={this.handleSaveButton}>
                                Save
                            </button>

                            <button
                                disabled={!previewEnabled}
                                className="btn btn-primary"
                                onClick={this.handleFinished}>
                                Let's finish!
                            </button>

                        </div>
                    </div>

                </CQPageTemplate>
                );
        } else {
            // add a loading animation
            return (<div>Loading</div>);
        }
    }

});

module.exports = CQEdit;
