var React = require('react');
var assign = require('object-assign');
var router = require('createQuizApp/config/router');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');

var CQQuestionList = require('./CQQuestionList');
var CQLink = require('createQuizApp/components/utils/CQLink');

var QuizStore = require('createQuizApp/stores/QuizStore');
var QuizActions = require('createQuizApp/actions/QuizActions');

var swal = require('sweetalert/dist/sweetalert-dev');
require('sweetalert/dev/sweetalert.scss');


require('./CQEditStyles');

var CQEdit = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string.isRequired
    },


    getInitialState: function() {

        return {
            mode: 'Create'
        };
    },

    _getQuiz: function(props){
        props = props || this.props;
        var quiz = QuizStore.getQuiz(props.quizId);
        return quiz;
    },

    componentDidMount: function() {

        // QuizActions.loadQuizzes();
        QuizStore.addChangeListener(this.onChange);
        this.onChange();


    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
    },

    componentWillReceiveProps: function(nextProps) {
        this.onChange(nextProps);
    },

    onChange: function(props){
        props = props || this.props;
        // TODO: we need to load the quiz without having to worry about
        // if the quiz store have finished loading
        if (QuizStore.getQuizzes().length !== 0 && QuizStore.getQuiz(props.quizId) === undefined) {
            QuizActions.loadQuiz(this.props.quizId);
        }

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
                console.warn('Index out of range', newState.quiz.questions);
                setTimeout(function(){
                    router.setRoute(`/quiz/create/${newState.quiz.uuid}`);
                }, 550);
            }
        }
        this.setState(newState);
    },

    handleQuestion: function(question){
        console.log('saving quiestion?????', question);
        var updatedQuiz = assign({}, this.state.quiz);

        var index = this.state.questionIndex;

        if (index === undefined) {
            index = this.state.quiz.payload.questions.length;
        }


        updatedQuiz.payload.questions[index] = question;
        this.setState({quiz: updatedQuiz});
    },

    handleSave: function(newQuestion){
        console.log('about to save', newQuestion);
        var quiz = this.state.quiz;
        quiz.payload.questions[this.state.questionIndex] = newQuestion;
        var questionIndex = quiz.payload.questions.length;

        this.setState({quiz, questionIndex}, ()=>{
            QuizActions.newQuiz(this.state.quiz).then( ()=> {
                router.setRoute(`/quiz/create/${quiz.uuid}/${quiz.payload.questions.length}`);
            });

        });
    },



    handleRemoveQuestion: function(question){
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


    render: function() {


        if (this.state.quiz){

            return (
                <CQPageTemplate className="container cq-edit">
                    <div className="container">
                        <div className="row ">
                            <div className="col-xs-12">
                                <div >



                                    <h3>Now editing quiz &nbsp;
                                        <span style={{color: 'red'}}>{this.state.quiz.meta.name}</span>
                                        <CQLink href={`/quiz/edit/${this.state.quiz.uuid}`}>
                                            <button ng-click="create.editQuiz();" style={{margin: '8px'}} className="btn btn-sm btn-info">
                                                <span className="glyphicon glyphicon-cog"> </span>
                                            </button>
                                        </CQLink>
                                    </h3>
                                    <p className="small">
                                        Speed Tip: We found clicking is a pain - just hit enter to step through quickly
                                    </p>



                                </div>

                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className="row">
                                                <div className="col-sm-7">
                                                    <h2 ng-show="create.quiz.payload.questions.length&gt;1">Your questions</h2><br/>
                                                </div>
                                                <div ol-style="margin-top:21px" className="col-sm-2">
                                                    <a href={`/app#/preview/${this.state.quiz.uuid}`} target="zzishgame" className="btn btn-block btn-info">
                                                        Preview
                                                    </a>

                                                    </div>
                                                <div ol-style="margin-top:21px" className="col-sm-3">
                                                    <CQLink href={`/quiz/published/${this.state.quiz.uuid}`}>

                                                        <button className="btn btn-block btn-primary">
                                                            I'm Finished, let's play!
                                                        </button>
                                                    </CQLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <CQQuestionList
                                        quiz={this.state.quiz}
                                        questionIndex={this.state.questionIndex}
                                        handleQuestion={this.handleQuestion}
                                        handleRemoveQuestion={this.handleRemoveQuestion}
                                        handleSave={this.handleSave}/>
                                </div>
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
