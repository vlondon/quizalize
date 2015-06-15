var React = require('react');
var assign = require('object-assign');
var router = require('createQuizApp/config/router');

var QuizActions = require('createQuizApp/actions/QuizActions');
var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQCreateMore = require('./CQCreateMore');
var QuizStore = require('createQuizApp/stores/QuizStore');


var CQCreate = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
        };
    },

    getInitialState: function() {
        console.log('do we have props', this.props);

        var initialState = {
            isMoreVisible: false,
            title: 'Create a Quiz',
            isSaving: false,
            quiz: this._getQuiz()
        };


        return initialState;

    },

    _getQuiz: function(props){
        props = props || this.props;

        var quiz = props.quizId ? QuizStore.getQuiz(props.quizId) : undefined;


        if (quiz === undefined){
            if (this.props.quizId) {
                QuizActions.loadQuiz(this.props.quizId);
            }
            quiz = {
                meta: {
                    name: "",
                    subject: "",
                    category: "",
                    description: undefined,
                    imageUrl: undefined,
                    imageAttribution: undefined,
                    live: false,
                    featured: false,
                    featureDate: undefined,
                    numQuestions: undefined,
                    random: false
                },
                payload: {}
            };

        }


        return quiz;
    },

    onChange: function(){

        var newState = {};

        var quiz = this._getQuiz();
        newState.quiz = quiz;



        if (this.props.quizId !== undefined){
            newState.title = 'Edit a quiz';
        }

        this.setState(newState);
    },

    componentDidMount: function() {
        // TODO Remove jQuery!!
        QuizStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
    },

    handleChange: function(property, event) {

        var newQuizState = assign({}, this.state.quiz);
        newQuizState.meta[property] = event.target.value;

        this.setState({quiz: newQuizState});
    },

    handleSettings: function(newSettings){
        var quiz = assign({}, this.state.quiz);
        var meta = assign(quiz.meta,newSettings);
        quiz.meta = meta;
        this.setState({quiz});
    },

    handleMoreClick: function(){
        this.setState({
            isMoreVisible: !this.state.isMoreVisible
        });
    },

    handleNewQuiz: function(){
        this.setState({isSaving: true});
        QuizActions.newQuiz(this.state.quiz).then(function(quiz){
            console.log('we got new quiz', quiz);
            router.setRoute(`/quiz/create/${quiz.uuid}/0`);
        });
    },

    render: function() {


            return (
                <CQPageTemplate className="container">
                    <div className="container">
                        <div className="row well">
                            <div className="col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                                <div className="well">
                                    <h2>
                                        {this.state.title}
                                    </h2>
                                    <form role="form" className="form-horizontal">
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Quiz Title:<a data-toggle="popover" title="Quiz Title" data-content="Give your quiz a unique name so you can easily identify it." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="7" className="left-space glyphicon glyphicon-question-sign"></a></label>
                                            <div className="col-sm-9">
                                                <input id="question"
                                                    type="text"
                                                    value={this.state.quiz.meta.name}
                                                    onChange={this.handleChange.bind(this, 'name')}
                                                    on-enter="ctrl.createQuiz();"
                                                    ng-model="ctrl.quiz.name"
                                                    placeholder="e.g. Plate Boundaries"
                                                    autofocus="true"
                                                    tabIndex="3"
                                                    className="form-control"/><br/>
                                            </div>
                                            <label className="control-label col-sm-3">
                                                Subject:    <a data-toggle="popover" title="Quiz Subject" data-content="You can provide an optional subject to help organize your quizzes into different subject areas. This is optional." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="5" className="left-space glyphicon glyphicon-question-sign"></a>
                                        </label>
                                        <div className="col-sm-9">
                                            <input id="subject"
                                                 type="text"
                                                 value={this.state.quiz.meta.subject}
                                                 onChange={this.handleChange.bind(this, 'subject')}
                                                 on-enter="ctrl.focusTopic();"
                                                 placeholder="e.g. Geography (Optional)"
                                                 tabIndex="1"
                                                 className="form-control"/>
                                            <br/>
                                        </div>
                                        <label className="control-label col-sm-3">
                                            Unit/Topic:    <a data-toggle="popover" title="Quiz Topic" data-content="You can provide an optional topic to help organize your quizzes into different topic areas. This is optional." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="6" className="left-space glyphicon glyphicon-question-sign"></a>
                                    </label>
                                    <div className="col-sm-9">
                                        <input id="category"
                                            type="text"
                                            value={this.state.quiz.meta.category}
                                            onChange={this.handleChange.bind(this, 'category')}
                                            on-enter="ctrl.focusQuiz();"
                                            placeholder="e.g. Earthquakes (Optional)"
                                            tabIndex="2"
                                            className="form-control"/>
                                        <br/>
                                    </div>
                                    <div className="col-sm-4 col-sm-offset-4">
                                        <button type="button"

                                            onClick={this.handleMoreClick}
                                            className={this.state.isMoreVisible ? 'btn btn-block btn-info' : 'btn btn-block'}>
                                            More Settings
                                        </button>
                                    </div>
                                    <div className="col-sm-4"><br className="visible-xs"/>
                                    <button type="button"
                                        onClick={this.handleNewQuiz}
                                        disabled={this.state.isSaving}
                                        tabIndex="4" className="btn btn-primary btn-block">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                    </div>
                    {this.state.isMoreVisible ? <CQCreateMore onSettings={this.handleSettings} settings={this.state.quiz.meta}/> : undefined }
                </div>
            </CQPageTemplate>
        );

    }
});

module.exports = CQCreate;
