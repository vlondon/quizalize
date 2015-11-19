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
                                    <strong id={ 'response' + item.id } className={(item.correct ? 'text-success' : 'text-danger')}>{ item.response }</strong>
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

    feedbackContent(): Object {
        return (
            <div className="pq-feedback">
                <h1 className="pq-feedback__title">Congratulations!</h1>

                <p>Total score: {this.state.quiz.totalScore} ({this.state.quiz.correct} out of {this.state.quiz.payload.questions.length})</p>

                { this.reportItems() }
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
