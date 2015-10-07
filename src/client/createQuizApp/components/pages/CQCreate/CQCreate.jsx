var React = require('react');
var router = require('createQuizApp/config/router');

var QuizActions = require('createQuizApp/actions/QuizActions');
var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQCreateMore = require('./CQCreateMore');


var CQLink = require('createQuizApp/components/utils/CQLink');
var QuizStore = require('createQuizApp/stores/QuizStore');
var CQAutofill = require('createQuizApp/components/utils/CQAutofill');

var TopicStore = require('createQuizApp/stores/TopicStore');
var UserStore = require('createQuizApp/stores/UserStore');

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
            canSave: false,
            category: undefined,
            quiz: this._getQuiz(),
            user: UserStore.getUser()
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

        newState.topics = TopicStore.getTopicTree();

        newState.topicsAutofill = [];

        var fillAutoFill = function(array, prefix){
            array.forEach( el => {
                // console.log('fi<!--  -->lling', el);

                var name = prefix ? `${prefix} > ${el.name}` : el.name;
                newState.topicsAutofill.push({
                    name: name,
                    uuid: el.uuid
                });
                if (el.categories && el.categories.length > 0){
                    fillAutoFill(el.categories, name);
                }
            });
        };

        fillAutoFill(newState.topics);

        newState.category = TopicStore.getTopicById("topic", quiz.meta.categoryId);


        if (this.props.quizId !== undefined){
            newState.title = 'Edit a quiz';
        }

        this.setState(newState);
    },

    componentDidMount: function() {
        $('[data-toggle="popover"]').popover();
        QuizStore.addChangeListener(this.onChange);
        TopicStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        TopicStore.removeChangeListener(this.onChange);
        QuizStore.removeChangeListener(this.onChange);
    },

    handleChange: function(property, event) {
        var newQuizState = Object.assign({}, this.state.quiz);
        newQuizState.meta[property] = event.target.value;
        var csave = false;
        if (property === 'name') {
            csave = event.target.value && event.target.value.length > 0;
        }
        this.setState({quiz: newQuizState, canSave: csave});
    },

    handleSettings: function(newSettings){
        var quiz = Object.assign({}, this.state.quiz);
        var meta = Object.assign({}, quiz.meta, newSettings);
        quiz.meta = meta;
        this.setState({quiz});
    },

    handleMoreClick: function(){
        this.setState({
            isMoreVisible: !this.state.isMoreVisible
        });
    },

    handleNewQuiz: function(){

        this.setState({canSave: false});

        QuizActions.newQuiz(this.state.quiz).then((quiz)=>{
            router.setRoute(`/quiz/create/${quiz.uuid}/0`);
        });
    },

    handleTopic: function(topicId){
        var quiz = Object.assign({}, this.state.quiz);
        var topic = TopicStore.getTopicById("topic", topicId);

        quiz.meta.categoryId = topicId;

        if (topic){
            quiz.meta.subjectId = topic.subjectId;
        } else {
            quiz.meta.subjectId = undefined;
        }

        var canSave = this.state.title.length > 0;
        console.log('topicid', topicId, topic, quiz);
        this.setState({quiz, canSave});
    },

    render: function() {

        var moreSettings;
        if (UserStore.isAdmin()){
            moreSettings = (<button type="button"
                onClick={this.handleMoreClick}
                className={this.state.isMoreVisible ? 'btn btn-block btn-info cq-create__moresettings' : 'btn btn-block cq-create__moresettings'}>
                More Settings
            </button>);
        }
        console.warn('getTopicTree', TopicStore.getTopicTree());
        return (
            <CQPageTemplate className="cq-container cq-create">
                <div className="cq-create__body">

                    <h2 className="cq-create__header">
                        {this.state.title}
                    </h2>

                    <div className="">
                        <label className="">
                            Let's start by giving the quiz a name

                        </label>
                        <div className="">
                            <input id="question"
                                type="text"
                                value={this.state.quiz.meta.name}
                                onChange={this.handleChange.bind(this, 'name')}
                                placeholder="e.g. Plate Boundaries"
                                autofocus="true"
                                tabIndex="1"
                                maxLength="200"
                                className="form-control cq-create__inputname"/>
                            <br/>
                        </div>

                        <label className="">
                            Unit/Topic:&nbsp;
                            <a data-toggle="popover" title="Quiz Topic" data-content="You can provide an optional topic to help organize your quizzes into different topic areas. This is optional." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="3" className="left-space glyphicon glyphicon-question-sign"></a>
                        </label>
                        <div className="">
                            <CQAutofill
                                value={this.state.quiz.meta.categoryId}
                                onChange={this.handleTopic}
                                data={TopicStore.getTopicTree}
                                placeholder="e.g. Mathematics > Addition and Subtraction (Optional)"
                                tabIndex="2"/>
                            <br/>
                        </div>


                        <div className="cq-create__cta">

                            <button
                                type="button"
                                onClick={this.handleNewQuiz}
                                disabled={!this.state.canSave}
                                tabIndex="4"
                                className="btn btn-primary btn-block">
                                Go!
                            </button>


                            <CQLink href="/quiz/user" className="cq-create__cancel">
                                Cancel and go back to your quizzes
                            </CQLink>

                            {moreSettings}

                        </div>
                    </div>
                </div>
                {this.state.isMoreVisible ? <CQCreateMore onSettings={this.handleSettings} settings={this.state.quiz.meta}/> : undefined }
            </CQPageTemplate>
        );

    }
});

module.exports = CQCreate;
