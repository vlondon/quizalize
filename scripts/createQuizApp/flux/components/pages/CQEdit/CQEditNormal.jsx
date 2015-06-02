var React = require('react');
var assign = require('object-assign');
var uuid = require('node-uuid');

var CQLatexString = require('./CQLatexString');

var CQEditNormal = React.createClass({

    propTypes: {
        onSave: React.PropTypes.func.isRequired,
        quiz: React.PropTypes.object
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

    getRefs: function(){
        return  [
            this.refs.question,
            this.refs.answer,
            this.refs.alternatives0,
            this.refs.alternatives1,
            this.refs.alternatives2,
            this.refs._topic
        ];
    },

    getState: function(props) {
        props = props || this.props;

        var question = props.quiz.questions[props.questionIndex];
        var newState = {
            question: question || {
                alternatives: ['','',''],
                question: '',
                answer: ''
            }
        };

        console.log('newState', newState);


        return newState;
    },

    handleNext: function(property, index, event){
        var ref;
        var refs = this.getRefs();

        if (event.keyCode === 13) {

            if (index !== undefined){
                ref = this.refs[property + index];
            } else {
                ref = this.refs[property];
            }

            var indexRef = refs.indexOf(ref);

            var nextRef = indexRef < (refs.length - 1) ? indexRef + 1 : 0;

            var nextElement = refs[nextRef];
            var node = React.findDOMNode(nextElement);


            node.focus();
            // if (indexRef < (refs.length - 1)) {
            //
            // } else {
            //     this.handleSave();
            // }

            event.preventDefault();
        }

    },


    handleChange: function(property, index, event) {

        var newQuestionState = assign({}, this.state.question);
        if (index !== undefined){
            newQuestionState[property][index] = event.target.value;
        } else {
            newQuestionState[property] = event.target.value;
        }

        var canBeSaved = newQuestionState.question.length > 0 && newQuestionState.answer.length > 0;
        console.info('can be saved?', canBeSaved);
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

    handleCheckbox: function(property){
        var newState = {};
        newState[property] = !this.state[property];
        this.setState(newState);
    },


    render: function() {

        var imageLink;

        if (this.props.quiz.imageEnabled) {
            imageLink = (
                <div className='block clearfix'>

                    <label className="left control-label">Image Link <a data-toggle="popover" title="Question" data-content="The title of your question. E.g. “What is the capital of France?”." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="8" className="glyphicon glyphicon-question-sign">                         </a></label>
                    <div className="right">

                        <div className="entry-input-full-width">
                            <textarea
                                value={this.state.question.imageUrl}
                                onChange={this.handleChange.bind(this, 'imageUrl', undefined)}
                                onKeyDown={this.handleNext.bind(this, 'imageUrl', undefined)}
                                id="imageUrl"
                                ref='imageUrl'
                                placeholder="e.g. http://www.quizalize.com/graph.png"
                                autofocus="true"
                                tabIndex="1"
                                rows="1"
                                cols="40"

                                className="autogrow-short form-control"/>
                        </div>


                    </div>
                </div>

            );
        }

        return (
            <div className={this.props.quiz.latexEnabled ? 'create-question latex-enabled' : 'create-question'}>


                {imageLink}

                <div className='block clearfix'>

                    <label className="left control-label">Question <a data-toggle="popover" title="Question" data-content="The title of your question. E.g. “What is the capital of France?”." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="8" className="glyphicon glyphicon-question-sign">                         </a></label>
                    <div className="right">

                        <div className="entry-input">
                            <textarea
                                value={this.state.question.question}
                                onChange={this.handleChange.bind(this, 'question', undefined)}
                                onKeyDown={this.handleNext.bind(this, 'question', undefined)}
                                id="question"
                                ref='question'
                                placeholder="e.g. What is the capital of France"
                                autofocus="true"
                                tabIndex="1"
                                rows="1"
                                cols="40"
                                ng-model="create.question"
                                className="autogrow-short form-control"/>
                        </div>

                        <div className="latex-field">
                            {this.props.quiz.latexEnabled ? <CQLatexString string={this.state.question.question}/> : null}
                        </div>
                    </div>
                </div>

                <div className="block clearfix">
                    <label className="left control-label">
                            Correct Answer <a data-toggle="popover" title="Correct Answer" data-content="The answer to the above question. E.g. “Paris”." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="9" className="glyphicon glyphicon-question-sign"></a>
                    </label>
                    <div className="right">

                        <div className="entry-input">
                            <textarea
                                value={this.state.question.answer}
                                ref='answer'
                                onChange={this.handleChange.bind(this, 'answer', undefined)}
                                onKeyDown={this.handleNext.bind(this, 'answer', undefined)}
                                id="answer" type="text" on-enter="create.nextFromAnswer();" placeholder="e.g. Paris" ng-model="create.answerText" tabIndex="2" rows="1" cols="44" className="autogrow-short form-control"></textarea>
                        </div>
                        <div className="latex-field">
                            {this.props.quiz.latexEnabled ? <CQLatexString string={this.state.question.answer}/> : null}
                        </div>
                    </div>
                </div>


                <div className="block clearfix">
                    <label className="left control-label">
                        Incorrect Answers<a data-toggle="popover" title="Incorrect Answers (Optional)" data-content="Enter incorrect answers if you want to create a multiple choice question. Leave them out and we'll do something smart. &lt;a  target=_blank href='http://blog.zzish.com/post/119035172944/question-types-in-quizalize-classroom-response-system'&gt;Learn more&lt;/a&gt;" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="10" data-html="true" className="glyphicon glyphicon-question-sign"></a>
                    </label>
                    <div className="right no-left-margin">

                        <div className="field">
                            <div className="incorrect-answers">

                                <textarea
                                    value={this.state.question.alternatives[0]}
                                    ref='alternatives0'
                                    onChange={this.handleChange.bind(this, 'alternatives', 0)}
                                    onKeyDown={this.handleNext.bind(this, 'alternatives', 0)}
                                    id="alt1" type="text" placeholder="e.g. London" ng-model="create.alt1" on-enter="create.focusAlt('2');" tabIndex="3" rows="1" cols="10" className="autogrow-short form-control"></textarea>
                            </div>

                            <div className="latex-field">
                                {this.props.quiz.latexEnabled ? <CQLatexString string={this.state.question.alternatives[0]}/> : null}
                            </div>
                        </div>

                        <div className="field">
                            <div className="incorrect-answers">

                                <textarea
                                    value={this.state.question.alternatives[1]}
                                    ref='alternatives1'
                                    onChange={this.handleChange.bind(this, 'alternatives', 1)}
                                    onKeyDown={this.handleNext.bind(this, 'alternatives', 1)}
                                    id="alt2" type="text" placeholder="e.g. Toronto" ng-model="create.alt2" on-enter="create.focusAlt('3');" tabIndex="4" rows="1" cols="10" className="autogrow-short form-control"></textarea>
                            </div>

                            <div className="latex-field">
                                {this.props.quiz.latexEnabled ? <CQLatexString string={this.state.question.alternatives[1]}/> : null}
                            </div>
                        </div>

                        <div className="field">
                            <div className="incorrect-answers">

                                <textarea
                                    value={this.state.question.alternatives[2]}
                                    ref='alternatives2'
                                    onChange={this.handleChange.bind(this, 'alternatives', 2)}
                                    onKeyDown={this.handleNext.bind(this, 'alternatives', 2)}
                                    id="alt3" type="text" placeholder="e.g. Berlin" ng-model="create.alt3" on-enter="create.focusTopic();" tabIndex="5" rows="1" cols="10" className="autogrow-short form-control"></textarea>
                            </div>


                            <div className="latex-field">
                                {this.props.quiz.latexEnabled ? <CQLatexString string={this.state.question.alternatives[2]}/> : null}
                            </div>
                        </div>
                    </div>
                </div>


                <div className="block clearfix">
                    <label className="left control-label">Subtopic <a data-toggle="popover" title="Subtopic (Optional)" data-content="A subtopic is used to group similar questions together. E.g. “European Capital Cities”. Learn more" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="11" className="glyphicon glyphicon-question-sign"></a></label>
                    <div className="right">
                        <div className="entry-input-full-width">

                            <input
                                value={this.state.question._topic}
                                ref='_topic'
                                onChange={this.handleChange.bind(this, '_topic', undefined)}
                                onKeyDown={this.handleNext.bind(this, '_topic', undefined)}
                                id="topic" type="text" placeholder="e.g. European Capital Cities" autofocus="true" tabIndex="6" className="form-control"/>
                        </div>
                    </div>
                </div>

                <div className="block clearfix">
                    <div className="save">

                        <button type="button" className="btn btn-primary btn-block" disabled={!this.state.canBeSaved} onClick={this.handleSave}>
                            Save and add a new Question
                        </button>

                    </div>
                </div>

            </div>
);
}

});

module.exports = CQEditNormal;
