var React = require('react');
var assign = require('object-assign');
var router = require('createQuizApp/config/router');

var QuizActions = require('createQuizApp/actions/QuizActions');
var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQCreateMore = require('./CQCreateMore');
var QuizStore = require('createQuizApp/stores/QuizStore');
var CQAutofill = require('createQuizApp/components/utils/CQAutofill');

var TopicStore = require('createQuizApp/stores/TopicStore');


var CQCreate = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
        };
    },

    getInitialState: function() {

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
        newState.topics = TopicStore.getPublicTopics();

        newState.topicsAutofill = [];

        var fillAutoFill = function(array, prefix){
            array.forEach( el => {
                // console.log('fi<!--  -->lling', el);

                var name = prefix ? `${prefix} > ${el.name}` : el.name;
                newState.topicsAutofill.push({
                    name: name,
                    id: el.uuid
                });
                if (el.categories && el.categories.length > 0){
                    fillAutoFill(el.categories, name);
                }
            });
        };

        fillAutoFill(newState.topics);

        if (this.props.quizId !== undefined){
            newState.title = 'Edit a quiz';
        }

        this.setState(newState);
    },

    componentDidMount: function() {
        QuizStore.addChangeListener(this.onChange);
        TopicStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
        TopicStore.removeChangeListener(this.onChange);
    },

    handleChange: function(property, event) {

        var newQuizState = assign({}, this.state.quiz);
        newQuizState.meta[property] = event.target.value;

        this.setState({quiz: newQuizState});
    },

    handleSettings: function(newSettings){
        var quiz = assign({}, this.state.quiz);
        var meta = assign(quiz.meta, newSettings);
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

    handleTopic: function(){
        console.log('handling topic');
        return ['aa', 'ab', 'ac', 'ad'];
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
                                                    tabIndex="1"
                                                    className="form-control"/><br/>
                                            </div>

                                            <label className="control-label col-sm-3">
                                            Unit/Topic:    <a data-toggle="popover" title="Quiz Topic" data-content="You can provide an optional topic to help organize your quizzes into different topic areas. This is optional." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="6" className="left-space glyphicon glyphicon-question-sign"></a>
                                    </label>
                                    <div className="col-sm-9">
                                        <CQAutofill value={this.state.quiz.meta.categoryId}/>
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
