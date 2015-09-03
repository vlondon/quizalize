/* @flow */
import type { Quiz, Question } from './../../../stores/QuizStore';

var React = require('react');

var CQLatexString = require('./../../../components/utils/CQLatexString');

import QuizStore from './../../../stores/QuizStore';
import CQAutofill from './../../../components/utils/CQAutofill';
import CQEditDurationPicker from './CQEditDurationPicker';
import TopicStore from './../../../stores/TopicStore';
import CQImageUploader from './../../../components/utils/CQImageUploader';

import MediaActions from './../../../actions/MediaActions';

import imageUrlParser from './../../../utils/imageUrlParser';


// TODO: Rename to a better name to describe editing questions
type Props = {
    quiz: Quiz;
    onChange: Function;
    onSave: Function;
    setSaveMode: Function;
    questionIndex: number;
}

type State = {
    question: Question;
    subtopics: Array<Object>;
}

// 5, 10, 20, 30, 45, 60

export default class CQEditNormal extends React.Component{

    static props : Props;
    constructor(props:Props) {
        super(props);

        this.getRefs = this.getRefs.bind(this);
        this.getState = this.getState.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.focusNext = this.focusNext.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.canBeSaved = this.canBeSaved.bind(this);
        this.handleTopic = this.handleTopic.bind(this);
        this.handlePopover = this.handlePopover.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.handleGetTopics = this.handleGetTopics.bind(this);
        this.handleDuration = this.handleDuration.bind(this);

        this.handleQuestionImageFile = this.handleQuestionImageFile.bind(this);

        this.state = this.getState();
    }

    componentDidMount() {
        this.focusNext(0);
        $('textarea').autogrow();
        this.handlePopover();
        this.props.onChange(this.state.question);
    }

    componentWillReceiveProps(nextProps : Props) {

        var newState = this.getState(nextProps);
        this.setState(newState);
    }

    getRefs() : Array<Object> {
        return  [
            this.refs.imageURL,
            this.refs.question,
            this.refs.answer,
            this.refs.alternatives0,
            this.refs.alternatives1,
            this.refs.alternatives2,
            this.refs.answerExplanation,
            this.refs.topicId
        ];
    }

    getState (props? : Props) : State {
        props = props || this.props;
        var question : Question = QuizStore.getQuestion(props.quiz.uuid, props.questionIndex);
        question.alternatives = question.alternatives || [];
        var subtopics = this.handleGetTopics();
        var newState = {
            question,
            subtopics
        };


        return newState;
    }

    handleNext(property : string, index? : number, event : Event) {
        var ref;
        var refs = this.getRefs();

        if (event.keyCode === 13 && !event.ctrlKey) {

            if (index !== undefined){
                ref = this.refs[property + index];
            } else {
                ref = this.refs[property];
            }

            var indexRef = refs.indexOf(ref);
            this.focusNext(indexRef);
            event.preventDefault();
        }

    }

    focusNext (i : number) {
        var refs = this.getRefs();

        var nextRef = i < (refs.length - 1) ? i + 1 : 0;
        var nextElement = refs[nextRef];
        var node = React.findDOMNode(nextElement);

        var gotoNext = ()=>{
            if (nextElement) {
                if (nextElement.onFocus){
                    nextElement.onFocus();
                } else {
                    node.focus();
                }
            } else {
                this.focusNext(nextRef);
            }
        };
        if (nextRef === 0) {
            if (this.canBeSaved()){
                setTimeout(()=>{ this.handleSave(); }, 20);
            } else {
                gotoNext();
            }
        } else {
            gotoNext();
        }


    }


    handleChange (property : string, index? : number, event : Object) {

        var newQuestionState = Object.assign({}, this.state.question);
        if (index !== undefined){
            newQuestionState[property][index] = event.target.value;
        } else {
            newQuestionState[property] = event.target.value;
        }

        var canBeSaved = this.canBeSaved(newQuestionState);

        this.setState({
            question: newQuestionState,
            canBeSaved
        });

        this.props.onChange(newQuestionState);
    }

    handleDuration(duration : number){
        var question = Object.assign({}, this.state.question);
        var canBeSaved = this.canBeSaved(question);
        question.duration = duration;
        console.log('handleDuration', question, duration);
        this.setState({question, canBeSaved});
        this.props.onChange(question);
    }

    canBeSaved (newQuestionState? : Question) : boolean {
        newQuestionState = newQuestionState || this.state.question;
        var canBeSaved = newQuestionState.question.length > 0 && newQuestionState.answer.length > 0;
        this.props.setSaveMode(canBeSaved);
        return canBeSaved;
    }

    handleTopic (topicId: string) {
        console.log('we got new topic', topicId);
        var newQuestionState = Object.assign({}, this.state.question);
        newQuestionState.topicId = topicId;

        this.props.onChange(newQuestionState);
        // if (ev.keyCode === 13){
        //     this.handleNext('topicId', undefined, ev);
        // }
    }

    handlePopover () {
        $('[data-toggle="popover"]').popover();
    }

    handleSave () {
        this.props.onSave(this.state.question);
    }

    handleCheckbox (property : string) {

        var question = Object.assign({}, this.state.question);
        question[property] = !this.state.question[property];

        var canBeSaved = this.canBeSaved(question);

        this.setState({question, canBeSaved}, this.handlePopover);
        this.props.onChange(question);
    }

    handleGetTopics () {
        return TopicStore.getTopicTreeForTopic(this.props.quiz.meta.categoryId);
    }

    handleQuestionImageFile(questionImageFile : File){
        this.setState({questionImageFile});
        MediaActions.uploadPicture(questionImageFile, 'question', 1200, 1200, false).then((imageURL)=>{

            var question = this.state.question;
            question.imageURL = imageURL;

            this.setState({question}, ()=>{
                this.props.onSave(this.state.question);
            });

        });
    }

    render() : any {

        var imageLink;

        if (this.state.question.imageEnabled) {
            imageLink = (
                <div className='block clearfix'>

                    <label className="left control-label">
                        Image Link&nbsp;
                        <a data-toggle="popover" title="Image Link" data-content="Provide an optional link to an image you would like to display."  data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="8" className="glyphicon glyphicon-question-sign"/>

                    </label>
                    <div className="right">

                        <div className="entry-input-full-width cq-questionlist__image">



                            <div className="cq-questionlist__image__img">
                                <img src={imageUrlParser(this.state.question.imageURL)} className="" alt=""/>
                            </div>

                            <button className="btn btn-default cq-questionlist__image__button">
                                <CQImageUploader
                                    id="imageUploader"
                                    className="cq-settings__upload__input"
                                    onImageData={this.handleQuestionImageData}
                                    onImageFile={this.handleQuestionImageFile}
                                />
                                Upload a picture
                            </button>

                        </div>

                    </div>
                </div>

            );
        }

        return (
            <div className={this.state.question.latexEnabled ? 'create-question latex-enabled' : 'create-question'}>

                <div className="quiz-extras">

                    <div className="math-mode">
                        <div>
                            Math mode &nbsp;
                            <a data-toggle="popover" title="Math mode" data-content="Use maths mode to enter equations in questions and answers. <br><a target=_blank href='http://blog.zzish.com/post/119033343859/math-mode-quizalize-classroom-quiz-response-system'>Learn more</a>" data-trigger="focus" data-placement="auto left" data-container="body" data-html="true" role="button" tabIndex="8" className="glyphicon glyphicon-question-sign"></a>
                        </div>
                        <label className="switch">
                            <input type="checkbox"  className="switch-input"
                                checked={this.state.question.latexEnabled}
                                onChange={this.handleCheckbox.bind(this, 'latexEnabled')}
                                />
                            <span className="switch-label" data-on="Yes" data-off="No"></span>
                            <span  id="switchMathMode" className="switch-handle"></span>
                        </label>
                    </div>

                    <div className="image-mode">
                        <div>
                            Use Images&nbsp;
                            <a data-toggle="popover" title="Use Images" data-content="Make your questions more engaging using images. <a target=_blank href='http://blog.zzish.com/post/119032391314/using-images-in-quizalize-classroom-quiz-response-system'>Learn more</a>" data-trigger="focus" data-placement="auto left" data-container="body" data-html="true" role="button" tabIndex="8" className="glyphicon glyphicon-question-sign"></a>
                        </div>
                        <label  className="switch">
                            <input type="checkbox"  className="switch-input"  checked={this.state.question.imageEnabled} onChange={this.handleCheckbox.bind(this, 'imageEnabled')}></input>
                            <span className="switch-label" data-on="Yes" data-off="No"></span>
                            <span id="switchImageMode" className="switch-handle"></span>
                        </label>
                    </div>

                    <div className="duration">
                        <div>
                            Duration&nbsp;
                            <a data-toggle="popover" title="Duration" data-content="Select the length of time students have to answer the question. " data-trigger="focus" data-placement="auto left" data-container="body" data-html="true" role="button" tabIndex="8" className="glyphicon glyphicon-question-sign"></a>
                            <CQEditDurationPicker
                                duration={this.state.question.duration}
                                onChange={this.handleDuration}
                            />
                        </div>
                    </div>
                </div>

                {imageLink}

                <div className='block clearfix'>

                    <label className="left control-label">
                        Question&nbsp;
                        <a data-toggle="popover" title="Question" data-content="The title of your question. E.g. “What is the capital of France?”." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="8" className="glyphicon glyphicon-question-sign"></a>
                    </label>
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
                            {this.state.question.latexEnabled ? <CQLatexString>{this.state.question.question}</CQLatexString> : null}
                        </div>
                    </div>
                </div>

                <div className="block clearfix">
                    <label className="left control-label">
                            Correct Answer&nbsp;
                            <a data-toggle="popover" title="Correct Answer" data-content="The answer to the above question. E.g. “Paris”." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="9" className="glyphicon glyphicon-question-sign"></a>
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
                            {this.state.question.latexEnabled ? <CQLatexString>{this.state.question.answer}</CQLatexString> : null}
                        </div>
                    </div>
                </div>


                <div className="block clearfix">
                    <label className="left control-label">
                        Incorrect Answers&nbsp;
                        <a data-toggle="popover" title="Incorrect Answers (Optional)" data-content="Enter incorrect answers if you want to create a multiple choice question. Leave them out and we'll do something smart. &lt;a  target=_blank href='http://blog.zzish.com/post/119035172944/question-types-in-quizalize-classroom-response-system'&gt;Learn more&lt;/a&gt;" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabIndex="10" data-html="true" className="glyphicon glyphicon-question-sign"/>
                        <div className="optional">Optional</div>
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
                                {this.state.question.latexEnabled ? <CQLatexString>{this.state.question.alternatives[0]}</CQLatexString> : null}
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
                                {this.state.question.latexEnabled ? <CQLatexString>{this.state.question.alternatives[1]}</CQLatexString> : null}
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
                                {this.state.question.latexEnabled ? <CQLatexString>{this.state.question.alternatives[2]}</CQLatexString> : null}
                            </div>
                        </div>
                    </div>
                </div>


                <div className="block clearfix">
                    <label className="left control-label">Answer explanation <a data-toggle="popover"
                        title="Answer explanation (Optional)"
                        data-content="A detailed reason provided for the correct answer"
                        data-trigger="focus"
                        data-placement="auto left"
                        data-container="body"
                        role="button"
                        tabIndex="11"
                        className="glyphicon glyphicon-question-sign"></a>
                        <div className="optional">Optional</div>
                    </label>
                    <div className="right">
                        <div className="entry-input-full-width">

                            <input
                                value={this.state.question.answerExplanation}
                                ref='answerExplanation'
                                onChange={this.handleChange.bind(this, 'answerExplanation', undefined)}
                                onKeyDown={this.handleNext.bind(this, 'answerExplanation', undefined)}
                                id="topic" type="text" placeholder="e.g. As the capital of France, Paris is the seat of France's national government" autofocus="true" tabIndex="6" className="form-control"/>
                        </div>
                    </div>
                </div>



                <div className="block clearfix">
                    <label className="left control-label">
                        Subtopic&nbsp;
                        <a data-toggle="popover"
                            title="Subtopic (Optional)"
                            data-content="Use sub-topics to group questions together and spot learning gaps more easily. &lt;a  target=_blank href='http://blog.zzish.com/post/118863520184/quizalize-classroom-quiz-response-system'&gt;Learn more&lt;/a&gt;"
                            data-html="true"
                            data-trigger="focus"
                            data-placement="auto left"
                            data-container="body"
                            role="button"
                            tabIndex="11"
                            className="glyphicon glyphicon-question-sign"/>
                        <div className="optional">Optional</div>
                    </label>
                    <div className="right">
                        <div className="entry-input-full-width">
                            <CQAutofill
                                id="subtopic"
                                value={this.state.question.topicId}
                                onChange={this.handleTopic}
                                data={this.state.subtopics}
                                ref='topicId'
                                onKeyDown={this.handleNext.bind(this, 'topicId', undefined)}
                                placeholder="e.g. European Capital Cities"
                                tabIndex="6"/>
                        </div>
                    </div>
                </div>



            </div>
        );
    }
}

CQEditNormal.propTypes = {
    onSave: React.PropTypes.func.isRequired,
    quiz: React.PropTypes.object,
    onChange: React.PropTypes.func,
    setSaveMode: React.PropTypes.func
};
