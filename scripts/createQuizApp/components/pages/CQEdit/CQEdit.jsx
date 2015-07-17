var React = require('react');
var assign = require('object-assign');
var router = require('createQuizApp/config/router');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQQuestionList = require('./CQQuestionList');
var CQLink = require('createQuizApp/components/utils/CQLink');

var QuizStore = require('createQuizApp/stores/QuizStore');
var QuizActions = require('createQuizApp/actions/QuizActions');

var TopicStore = require('createQuizApp/stores/TopicStore');
var UserApi             = require('createQuizApp/actions/api/UserApi');

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
                newState.questionIndex = undefined;
            }

            // Check if the questionIndex is in range
            if (newState.questionIndex > newState.quiz.payload.questions.length){
                console.warn('Trying to edit a question out of range');
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
        // trying to discover question value;
        console.log('about to save questions', newQuestion, this.state);
        var nextQuestion;
        if (this.state.questionIndex) {
            nextQuestion = this.state.questionIndex + 1;
        } else {
            nextQuestion = this.state.quiz.payload.questions.length;
        }
        QuizActions.newQuiz(this.state.quiz).then( ()=> {
            router.setRoute(`/quiz/create/${this.state.quiz.uuid}/${nextQuestion}`);
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
        UserApi.trackEvent('finish_quiz', {uuid: this.state.quiz.uuid, name: this.state.quiz.meta.name});
        QuizActions.newQuiz(this.state.quiz).then( ()=> {
            router.setRoute(`/quiz/published/${this.state.quiz.uuid}`);
        });
    },

    handleSaveButton: function(){
        QuizActions.newQuiz(this.state.quiz).then(()=>{
            router.setRoute(`/quiz/create/${this.state.quiz.uuid}`);
            this.setState({pristine: true, saveEnabled: true});
        });
    },

    handlePreview: function(){
        sessionStorage.setItem('mode', 'teacher');
        window.open(`/app#/preview/${this.state.quiz.meta.profileId}/${this.state.quiz.uuid}`, 'preview');
        QuizActions.newQuiz(this.state.quiz).then( ()=> {
            window.open(`/app#/preview/${this.state.quiz.meta.profileId}/${this.state.quiz.uuid}`, 'preview');
        });
    },

    enableDisableSave: function(saveEnabled){
        this.setState({saveEnabled});
    },

    render: function() {

        if (this.state.quiz){

            var previewEnabled = this.state.quiz.payload.questions && this.state.quiz.payload.questions.length > 0;

            return (
                <CQPageTemplate className="cq-container cq-edit">

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
                        isSaveEnabled={this.state.saveEnabled}
                        handleSave={this.handleSaveNewQuestion}/>

                    <div className="cq-edit__footer">
                        <div className="cq-edit__footer-inner">

                            <button onClick={this.handlePreview}
                                disabled={!previewEnabled}

                                target="zzishgame"
                                className="btn btn-info">
                                Preview
                            </button>

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
