var React = require('react');
var assign = require('object-assign');
var router = require('createQuizApp/flux/config/router');

var QuizActions = require('createQuizApp/flux/actions/QuizActions');
var CQPageTemplate = require('createQuizApp/flux/components/CQPageTemplate');
var CQCreateMore = require('./CQCreateMore');
var QuizStore = require('createQuizApp/flux/stores/QuizStore');


var CQCreate = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string
    },

    getInitialState: function() {
        console.log('do we have props', this.props);

        return {
            isMoreVisible: false,
            isSaving: false,
            quiz: {

            }
        };

    },
    _getQuiz: function(props){
        props = props || this.props;
        var quiz = QuizStore.getQuiz(props.quizId);
        console.log("QUIAAA", quiz, props);
        if (quiz === undefined){
            QuizActions.loadQuiz(this.props.quizId);
            return {};
        }

        return quiz;
    },

    onChange: function(){

        var quizzes = QuizStore.getQuizzes();
        var newState = {};
        if (this.props.quizId){
            var quiz = this._getQuiz();
            newState.quiz = quiz;

        }
        this.setState(newState);
    },

    componentDidMount: function() {
        // TODO Remove jQuery!!
        QuizStore.addChangeListener(this.onChange);

        $(document).on('mouseenter', '[data-toggle="popover"]', function(){
            $(this).popover('show');
        });

        $(document).on('mouseleave', '[data-toggle="popover"]', function(){
            $(this).popover('hide');
        });


    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
        $(document).off('mouseenter');
        $(document).off('mouseleave');
    },

    getDefaultProps: function() {
        return {
            title: 'Create a Quiz'
        };
    },

    handleChange: function(property, event) {

        var newQuizState = assign({}, this.state.quiz);
        newQuizState[property] = event.target.value;

        this.setState({quiz: newQuizState});
    },

    handleMoreClick: function(){
        this.setState({
            isMoreVisible: !this.state.isMoreVisible
        });
    },

    handleNewQuiz: function(){
        this.setState({isSaving: true});
        QuizActions.newQuiz(this.state.quiz).then(function(){
            router.setRoute(`/quiz/quizzes`);
        });
    },

    render: function() {

        if (true){

            return (
                <CQPageTemplate className="container">
                    <div className="container">
                        <div className="row well">
                            <div className="col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                                <div className="well">
                                    <h2>
                                        {this.props.title}
                                    </h2>
                                    <form role="form" className="form-horizontal">
                                        <div className="form-group">
                                            <label className="control-label col-sm-3">
                                                Subject:    <a data-toggle="popover" title="Quiz Subject" data-content="You can provide an optional subject to help organize your quizzes into different subject areas. This is optional." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="5" className="left-space glyphicon glyphicon-question-sign"></a>
                                        </label>
                                        <div className="col-sm-9">
                                            <input id="subject"
                                                 type="text"
                                                 value={this.state.quiz.subject}
                                                 onChange={this.handleChange.bind(this, 'subject')}
                                                 on-enter="ctrl.focusTopic();"
                                                 ng-model="ctrl.quiz.subject"
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
                                            value={this.state.quiz.category}
                                            onChange={this.handleChange.bind(this, 'category')}
                                            on-enter="ctrl.focusQuiz();"
                                            ng-model="ctrl.quiz.category"
                                            placeholder="e.g. Earthquakes (Optional)"
                                            tabIndex="2"
                                            className="form-control"/>
                                        <br/>
                                    </div>
                                    <label className="col-sm-3 control-label">Quiz Title:<a data-toggle="popover" title="Quiz Title" data-content="Give your quiz a unique name so you can easily identify it." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="7" className="left-space glyphicon glyphicon-question-sign"></a></label>
                                    <div className="col-sm-9">
                                        <input id="question"
                                            type="text"
                                            value={this.state.quiz.name}
                                            onChange={this.handleChange.bind(this, 'name')}
                                            on-enter="ctrl.createQuiz();"
                                            ng-model="ctrl.quiz.name"
                                            placeholder="e.g. Plate Boundaries"
                                            autofocus="true"
                                            tabIndex="3"
                                            className="form-control"/><br/>
                                    </div>
                                    <div className="col-sm-4 col-sm-offset-4">
                                        <button type="button"
                                            disabled
                                            onClick={this.handleMoreClick}
                                            className={this.state.isMoreVisible ? 'btn btn-block btn-info' : 'btn btn-block'}>
                                            More Settings
                                        </button>
                                    </div>
                                    <div className="col-sm-4"><br className="visible-xs"/>
                                    <button type="button"
                                        onClick={this.handleNewQuiz}
                                        disabled={this.isSaving}
                                        tabIndex="4" ng-disabled="ctrl.quiz.name==''" className="btn btn-primary btn-block">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                    </div>
                    {this.state.isMoreVisible ? <CQCreateMore/> : undefined }
                </div>
            </CQPageTemplate>
        );
        } else {
            return <div>Loading</div>;
        }
    }
});

module.exports = CQCreate;
