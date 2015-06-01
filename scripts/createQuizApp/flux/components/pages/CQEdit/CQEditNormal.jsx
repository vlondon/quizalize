var React = require('react');
var assign = require('object-assign');
var uuid = require('node-uuid');

var TopicStore = require('createQuizApp/flux/stores/TopicStore');

var CQEditNormal = React.createClass({

    propTypes: {
        onChange: React.PropTypes.func,
        onSave: React.PropTypes.func.isRequired,
        question: React.PropTypes.object
    },

    getDefaultProps: function() {
        return {
            question: {
                uuid: uuid.v4(),
                question: '',
                answer: '',
                alternatives: []

            }
        };
    },

    getInitialState: function() {
        return this.getState();
    },

    componentWillReceiveProps: function(nextProps) {
        var newState = this.getState(nextProps);
        this.setState(newState);
    },

    getState: function(props) {
        props = props || this.props;
        var newState = {question: props.question};
        // // we need to get the topic
        // var topicList = TopicStore.getTopics();
        //
        // var topic = topicList.filter( t => t.uuid === newState.question.topicId)[0];
        // if (topic){
        //     newState.topic = topic.name;
        // }

        newState.question.alternatives = newState.question.alternatives || [];
        console.log('we got topics!', newState.question);
        return newState;
    },


    handleChange: function(property, index, event) {
        console.log('index', index);
        var newQuestionState = assign({}, this.state.question);

        if (index !== undefined){
            newQuestionState[property][index] = event.target.value;
        } else {
            newQuestionState[property] = event.target.value;
        }

        var canBeSaved = false;
        if (newQuestionState.question.length > 2 && newQuestionState.answer.length > 2) {
            canBeSaved = true;
        }
        this.setState({
            question: newQuestionState,
            canBeSaved
        });
        this.props.onChange(newQuestionState);
    },


    handleTopic: function(event){
        console.log('were changing topic for', event.target.value);
        this.setState({topic: event.target.value});
    },

    handleSave: function(){
        this.props.onSave(this.state.question);
    },


    render: function() {
        return (
            <form role='form' className="form-horizontal">

                <div className="form-group">
                    <label className="col-sm-3 control-label">Question <a data-toggle="popover" title="Question" data-content="The title of your question. E.g. “What is the capital of France?”." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="8" className="glyphicon glyphicon-question-sign">                         </a></label>
                    <div className="col-sm-8">
                        <textarea
                            value={this.state.question.question}
                            onChange={this.handleChange.bind(this, 'question', undefined)}
                            id="question"
                            placeholder="e.g. What is the capital of France"
                            autofocus="true"
                            tabIndex="1"
                            rows="1"
                            cols="40"
                            ng-model="create.question"
                            className="autogrow-short form-control"/>
                    </div>
                    <div ng-show="create.quiz.latexEnabled" className="col-xs-4"><span mathjax-bind="create.question" id="questionMath"></span></div>
                </div>

                <div className="form-group">
                    <label className="col-sm-3 control-label">
                            Correct Answer <a data-toggle="popover" title="Correct Answer" data-content="The answer to the above question. E.g. “Paris”." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="9" className="glyphicon glyphicon-question-sign"></a>
                    </label>
                    <div className="col-sm-8">
                        <textarea
                            value={this.state.question.answer}
                            onChange={this.handleChange.bind(this, 'answer', undefined)}
                            id="answer" type="text" on-enter="create.nextFromAnswer();" placeholder="e.g. Paris" ng-model="create.answerText" tabIndex="2" rows="1" cols="44" className="autogrow-short form-control"></textarea>
                    </div>
                    <div ng-show="create.quiz.latexEnabled" className="col-xs-4"><span mathjax-bind="create.answerText" id="answerTextMath">            </span></div>
                </div>


                <div ng-hide="create.quiz.latexEnabled" className="form-group">
                    <label className="col-sm-3 control-label">
                        Incorrect Answers<a data-toggle="popover" title="Incorrect Answers (Optional)" data-content="Enter incorrect answers if you want to create a multiple choice question. Leave them out and we'll do something smart. &lt;a  target=_blank href='http://blog.zzish.com/post/119035172944/question-types-in-quizalize-classroom-response-system'&gt;Learn more&lt;/a&gt;" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="10" data-html="true" className="glyphicon glyphicon-question-sign"></a>
                    </label>
                    <div className="col-sm-3">
                        <textarea
                            value={this.state.question.alternatives[0]}
                            onChange={this.handleChange.bind(this, 'alternatives', 0)}
                            id="alt1" type="text" placeholder="e.g. London" ng-model="create.alt1" on-enter="create.focusAlt('2');" tabIndex="3" rows="1" cols="10" className="autogrow-short form-control"></textarea>
                        <script>$('#alt1').css('overflow', 'hidden').autogrow()</script>
                    </div>
                    <div className="col-sm-3">
                        <textarea
                            value={this.state.question.alternatives[1]}
                            onChange={this.handleChange.bind(this, 'alternatives', 1)}
                            id="alt2" type="text" placeholder="e.g. Toronto" ng-model="create.alt2" on-enter="create.focusAlt('3');" tabIndex="4" rows="1" cols="10" className="autogrow-short form-control"></textarea>
                        <script>$('#alt2').css('overflow', 'hidden').autogrow()</script>
                    </div>
                    <div className="col-sm-3">
                        <textarea
                            value={this.state.question.alternatives[2]}
                            onChange={this.handleChange.bind(this, 'alternatives', 2)}
                            id="alt3" type="text" placeholder="e.g. Berlin" ng-model="create.alt3" on-enter="create.focusTopic();" tabIndex="5" rows="1" cols="10" className="autogrow-short form-control"></textarea>
                        <script>$('#alt3').css('overflow', 'hidden').autogrow()</script>
                    </div>
                </div>


                <div className="form-group">
                    <label className="col-sm-3 control-label">Subtopic <a data-toggle="popover" title="Subtopic (Optional)" data-content="A subtopic is used to group similar questions together. E.g. “European Capital Cities”. Learn more" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="11" className="glyphicon glyphicon-question-sign"></a></label>
                    <div className="col-sm-9">
                        <input
                            value={this.state.question._topic}
                            onChange={this.handleChange.bind(this, '_topic', undefined)}
                            id="topic" type="text" on-enter="create.addQuestion();" placeholder="e.g. European Capital Cities" autofocus="true" tabIndex="6" ng-model="create.topic" className="form-control"/>
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-sm-6 col-sm-offset-3">
                        <br className="visible-xs"/>
                        <button type="button" className="btn btn-primary btn-block" disabled={!this.state.canBeSaved} onClick={this.handleSave}>
                            Save - Continue to Next Question
                        </button>
                    </div>
                </div>

            </form>
);
}

});

module.exports = CQEditNormal;
