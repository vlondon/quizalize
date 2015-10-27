/* @flow */
import React, { PropTypes } from 'react';

import { CQViewSwitch } from './../../../components';

import type { QuizSettings } from './../../../../../types';


class CQViewQuizSettings extends React.Component {

    state: { settings: QuizSettings };
    props: { settings: QuizSettings; onChange: Function };

    static propTypes = {
        settings: PropTypes.object,
        onChange: PropTypes.func
    };

    constructor(props: Object){
        super(props);

    }

    handleCheckbox(property: string){
        const settings = this.props.settings.update(property, (v) => v === 1 ? 0 : 1 );
        this.props.onChange(settings);
    }

    handleInputValue(property: string, event: Object){
        const eventValue = parseInt(event.target.value, 10);
        const settings = this.props.settings.set(property, eventValue);
        this.props.onChange(settings);
    }

    render () : any {

        const toBoolean = value => value === 1;

        return (
            <div className="cq-quizsettings">
                <div className="cq-quizsettings__background">
                    <div className="cq-quizsettings__modal">
                        <h3>Adjust settings for your class game</h3>
                        <ul>
                            <li>
                                <h3>Random order</h3>
                                <p>Questions will show jubmled to your students</p>
                                <CQViewSwitch
                                    onChange={this.handleCheckbox.bind(this, 'random')}
                                    checked={toBoolean(this.props.settings.random)}
                                />

                            </li>
                            <li>
                                <h3>Show answers</h3>
                                <p>Questions will show jubmled to your students</p>
                                <CQViewSwitch
                                    onChange={this.handleCheckbox.bind(this, 'showAnswers')}
                                    checked={toBoolean(this.props.settings.showAnswers)}
                                />
                            </li>

                            <li>
                                <h3>Show timer</h3>
                                <p>Don't show the timer to your students. Correct answers always will score the maximum amount.</p>
                                <CQViewSwitch
                                    onChange={this.handleCheckbox.bind(this, 'showTimer')}
                                    checked={toBoolean(this.props.settings.showTimer)}
                                />
                            </li>


                            <li>
                                <h3>repeatUntilCorrect</h3>
                                <p>Questions will show jubmled to your students</p>
                                <CQViewSwitch
                                    onChange={this.handleCheckbox.bind(this, 'repeatUntilCorrect')}
                                    checked={toBoolean(this.props.settings.repeatUntilCorrect)}
                                />
                                <select
                                    value={this.props.settings.maxAttempts}
                                    onChange={this.handleInputValue.bind(this, 'maxAttempts')}
                                    >
                                    <option value={-1}>All</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </li>

                            <li>
                                <h3>Show how many questions</h3>
                                <p>Only show X questions. If random is set to true, then it
                                    will randomly select the questions every time you play. If
                                    random is set to false, it will use meta.updated as a seed
                                    to determine the order of the question so that all players
                                    get the same order of question
                                </p>
                                <select
                                    value={this.props.settings.numQuestions}
                                    onChange={this.handleInputValue.bind(this, 'numQuestions')}
                                    >
                                    <option value={-1}>All</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default CQViewQuizSettings;
