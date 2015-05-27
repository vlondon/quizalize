var React = require('react');
var assign = require('object-assign');

var QuizActions = require('createQuizApp/flux/actions/QuizActions');
var CQPageTemplate = require('createQuizApp/flux/components/CQPageTemplate');
var CQCreateMore = require('./CQCreateMore');
var QuizStore = require('createQuizApp/flux/stores/QuizStore');
var uuid = require('node-uuid');
require('./CQCreateStyles');

var CQCreate = React.createClass({

    getInitialState: function() {
        return {
            quiz: {
                subject: '',
                settings: {
                    numQuestions: '',
                    random: false
                }
            },
            isMoreVisible: true
        };

    },

    onChange: function(){
        console.log('onChange', QuizStore);
        this.setState({quizzes: QuizStore.getQuizzes()});
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
        console.log('handleMoreClick', this.state.isMoreVisible);
    },

    handleNewQuiz: function(){
        QuizActions.newQuiz(this.state.quiz).then(function(){
            console.log('quiz saved, fuck yeah!');
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
                                    {this.props.title}
                                </h2>
                                <form role="form" className="form-horizontal">
                                    <div className="form-group">
                                        <label className="control-label col-sm-3">
                                            Subject:    <a data-toggle="popover" title="Quiz Subject" data-content="You can provide an optional subject to help organize your quizzes into different subject areas. This is optional." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabindex="5" className="left-space glyphicon glyphicon-question-sign"></a>
                                    </label>
                                    <div className="col-sm-9">
                                        <input id="subject"
                                             type="text"
                                             value={this.state.quiz.subject}
                                             onChange={this.handleChange.bind(this, 'subject')}
                                             on-enter="ctrl.focusTopic();"
                                             ng-model="ctrl.quiz.subject"
                                             placeholder="e.g. Geography (Optional)"
                                             tabindex="1"
                                             className="form-control"/>
                                        <br/>
                                    </div>
                                    <label className="control-label col-sm-3">
                                        Unit/Topic:    <a data-toggle="popover" title="Quiz Topic" data-content="You can provide an optional topic to help organize your quizzes into different topic areas. This is optional." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabindex="6" className="left-space glyphicon glyphicon-question-sign"></a>
                                </label>
                                <div className="col-sm-9">
                                    <input id="category"
                                        type="text"
                                        value={this.state.category}
                                        onChange={this.handleChange.bind(this, 'category')}
                                        on-enter="ctrl.focusQuiz();"
                                        ng-model="ctrl.quiz.category"
                                        placeholder="e.g. Earthquakes (Optional)"
                                        tabindex="2"
                                        className="form-control"/>
                                    <br/>
                                </div>
                                <label className="col-sm-3 control-label">Quiz Title:<a data-toggle="popover" title="Quiz Title" data-content="Give your quiz a unique name so you can easily identify it." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabindex="7" className="left-space glyphicon glyphicon-question-sign"></a></label>
                                <div className="col-sm-9">
                                    <input id="question"
                                        type="text"
                                        value={this.state.name}
                                        onChange={this.handleChange.bind(this, 'name')}
                                        on-enter="ctrl.createQuiz();"
                                        ng-model="ctrl.quiz.name"
                                        placeholder="e.g. Plate Boundaries"
                                        autofocus="true"
                                        tabindex="3"
                                        className="form-control"/><br/>
                                </div>
                                <div className="col-sm-4 col-sm-offset-4">
                                    <button type="button"
                                        onClick={this.handleMoreClick}
                                        className={this.state.isMoreVisible ? 'btn btn-block btn-info' : 'btn btn-block'}>
                                        More Settings
                                    </button>
                                </div>
                                <div className="col-sm-4"><br className="visible-xs"/>
                                <button type="button" onClick={this.handleNewQuiz} tabindex="4" ng-disabled="ctrl.quiz.name==''" className="btn btn-primary btn-block">Save</button>
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
}

});

module.exports = CQCreate;
