/* @flow */
import React, { PropTypes, Component } from 'react';
import type, { Quiz } from './../../../../../types';

import PQQuizStore from './../../../stores/PQQuizStore';
import PQQuiz from './../../../stores/extra/PQQuizClass';

type Props = {
    quizId: String;
}

class PQFeedback extends Component {

    constructor(props: Object) {
        super(props);
    }

    componentWillMount() {
        let quiz = PQQuizStore.getQuiz(this.props.quizId);
        this.state = {
            quiz: quiz.toObject()
        };
    }

    reportItems(): Array<Object> {
        var answerNum = 0; // For now, to get question text (It should probably be by the ID)
        var items = [];

        var quiz = this.state.quiz;
        quiz.report.map((item) => {
            items.push((
                <div className="row cssFade" key={ item.id }>
                    <div className="col-md-8 col-md-offset-2">
                        <div className="well">
                            <div className="row">

                                <div className="col-md-4">
                                    <h4 className="wrapword">
                                        <strong id={ 'quizQuestion' + item.questionId }>{ quiz.payload.questions[answerNum].question }</strong>
                                    </h4>
                                </div>

                                <div className="col-md-3 wrapword">
                                    <h4>Your answer</h4>
                                    <strong id={ 'response' + item.id }
                                            className={(item.correct ? 'text-success' : 'text-danger')}>{ item.response }</strong>
                                </div>

                                { (quiz.meta.showAnswers || quiz.meta.showAnswers == 1) ? (
                                <div className="col-md-3 wrapword">
                                    <h4>Correct answer</h4>
                                    <strong id={'cresponse' + item.questionId}>{ item.answer }</strong>
                                </div>
                                    ) : null }

                                { (quiz.meta.showAnswers !== undefined && quiz.meta.showAnswers == 0) ? (
                                <div className="col-md-3 wrapword"></div>
                                    ) : null}

                                <div className="col-md-2">
                                    <h4>Score: { item.score }</h4>
                                    { item.correct ? (<p>({item.seconds} seconds)</p>) : null }
                                    { item.attempts > 1 ? (<p>({ item.attempts } attempts)</p>) : null }
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ));
            answerNum++;
        });
        return items;
    }

    quizResult() {
        var result = null;
        //if (!this.state.quiz.noResultMode && this.state.quiz.hasTopics) {
        result = (
            <div className="well well--complete col-md-8 col-md-offset-2">
                <div className="col-sm-4">
                    <div className="complete-info">
                        <div className="score-value rag2">
                            <div>{this.state.quiz.totalScore}</div>
                            <div className="score-points">Points</div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-4"><br/><br/>
                    <div className="complete-info">
                        <div className="score-fraction">
                            <div className="fraction-top">{this.state.quiz.correct}</div>
                            <div className="fraction-bottom">{this.state.quiz.payload.questions.length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-4"><br/><br/>
                    <div className="complete-info">
                        <div className="score-time">
                            <span className="glyphicon glyphicon-time"/>32 Seconds
                        </div>
                    </div>
                </div>
            </div>
        );
        //}
        return result;
    }

    feedbackContent(): Object {
        return (
            <div className="pq-feedback">

                <div className="wrapper-complete">

                    <div className="row inverse-text">
                        <div className="col-xs-12 text-center">
                            <h2 className="congratulations-text">Congratulations</h2>
                        </div>
                    </div>

                    { this.quizResult() }

                    { this.reportItems() }

                </div>
            </div>
        );
    }

    render(): any {
        return this.state.quiz ? this.feedbackContent() : (<div>Generating feedback..</div>);
    }
}

PQFeedback.propTypes = {
    quiz: PropTypes.object
};

export default PQFeedback;
