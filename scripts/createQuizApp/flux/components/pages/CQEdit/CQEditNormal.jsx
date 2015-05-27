var React = require('react');

var CQEditNormal = React.createClass({

    getInitialState: function() {
        return {
            question: ''
        };
    },

    render: function() {
        return (
            <form role='form' className="form-horizontal">

                <div className="form-group">
                    <label className="col-sm-3 control-label">Question <a data-toggle="popover" title="Question" data-content="The title of your question. E.g. “What is the capital of France?”." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabindex="8" className="glyphicon glyphicon-question-sign">                         </a></label>
                    <div className="col-sm-8">
                        <textarea value={this.state.question} id="question" placeholder="e.g. What is the capital of France" autofocus="true" tabindex="1" rows="1" cols="40" ng-model="create.question" className="autogrow-short form-control"/>
                    </div>
                    <div ng-show="create.quiz.latexEnabled" className="col-xs-4"><span mathjax-bind="create.question" id="questionMath"></span></div>
                </div>

                <div className="form-group">
                    <label className="col-sm-3 control-label">
                            Correct Answer <a data-toggle="popover" title="Correct Answer" data-content="The answer to the above question. E.g. “Paris”." data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabindex="9" className="glyphicon glyphicon-question-sign"></a>
                    </label>
                    <div className="col-sm-8">
                        <textarea id="answer" type="text" on-enter="create.nextFromAnswer();" placeholder="e.g. Paris" ng-model="create.answerText" tabindex="2" rows="1" cols="44" className="autogrow-short form-control"></textarea>
                    </div>
                    <div ng-show="create.quiz.latexEnabled" className="col-xs-4"><span mathjax-bind="create.answerText" id="answerTextMath">            </span></div>
                </div>


                <div ng-hide="create.quiz.latexEnabled" className="form-group">
                    <label className="col-sm-3 control-label">
                        Incorrect Answers<a data-toggle="popover" title="Incorrect Answers (Optional)" data-content="Enter incorrect answers if you want to create a multiple choice question. Leave them out and we'll do something smart. &lt;a  target=_blank href='http://blog.zzish.com/post/119035172944/question-types-in-quizalize-classroom-response-system'&gt;Learn more&lt;/a&gt;" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabindex="10" data-html="true" className="glyphicon glyphicon-question-sign"></a>
                    </label>
                    <div className="col-sm-3">
                        <textarea id="alt1" type="text" placeholder="e.g. London" ng-model="create.alt1" on-enter="create.focusAlt('2');" tabindex="3" rows="1" cols="10" className="autogrow-short form-control"></textarea>
                        <script>$('#alt1').css('overflow', 'hidden').autogrow()</script>
                    </div>
                    <div className="col-sm-3">
                        <textarea id="alt2" type="text" placeholder="e.g. Toronto" ng-model="create.alt2" on-enter="create.focusAlt('3');" tabindex="4" rows="1" cols="10" className="autogrow-short form-control"></textarea>
                        <script>$('#alt2').css('overflow', 'hidden').autogrow()</script>
                    </div>
                    <div className="col-sm-3">
                        <textarea id="alt3" type="text" placeholder="e.g. Berlin" ng-model="create.alt3" on-enter="create.focusTopic();" tabindex="5" rows="1" cols="10" className="autogrow-short form-control"></textarea>
                        <script>$('#alt3').css('overflow', 'hidden').autogrow()</script>
                    </div>
                </div>


                <div className="form-group">
                    <label className="col-sm-3 control-label">Subtopic <a data-toggle="popover" title="Subtopic (Optional)" data-content="A subtopic is used to group similar questions together. E.g. “European Capital Cities”. Learn more" data-trigger="focus" data-placement="auto left" data-container="body" role="button" tabindex="11" className="glyphicon glyphicon-question-sign"></a></label>
                    <div className="col-sm-9">
                        <input id="topic" type="text" on-enter="create.addQuestion();" placeholder="e.g. European Capital Cities" autofocus="true" tabindex="6" ng-model="create.topic" className="form-control"/>
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-sm-6 col-sm-offset-3">
                        <br className="visible-xs"/>
                        <button type="button" className="btn btn-primary btn-block">
                            Save - Continue to Next Question
                        </button>
                    </div>
                </div>

            </form>
);
}

});

module.exports = CQEditNormal;
