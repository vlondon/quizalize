/* @flow */
import React, { PropTypes } from 'react';

import { CQViewSwitch } from './../../../components';

import type { QuizSettings } from './../../../../../types';


class CQViewQuizSettings extends React.Component {

    state: { open: boolean };
    props: { settings: QuizSettings; onChange: Function };

    static propTypes = {
        settings: PropTypes.object,
        onChange: PropTypes.func
    };

    constructor(props: Object){
        super(props);
        this.state = {
            open: false
        };

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
        const className = this.state.isOpen ? 'cq-quizsettings--open' : 'cq-quizsettings--close';
        return (
            <div className={`cq-quizsettings ${className}`}>
                <div className="cq-quizsettings__background">
                    <div className="cq-quizsettings__modal">
                        <h3 className="cq-quizsettings__header">Adjust settings for your class game</h3>
                        <ul>
                            <li>
                                <h4>Random order</h4>
                                <p>Questions will be shown in random order for each student</p>
                                <div className="cq-quizsettings__switch">
                                    <CQViewSwitch
                                        onChange={this.handleCheckbox.bind(this, 'random')}
                                        checked={toBoolean(this.props.settings.random)}
                                    />
                                </div>

                            </li>
                            <li>
                                <h4>Show answers</h4>
                                <p>Students will be shown the correct answer if they get it wrong</p>
                                <div className="cq-quizsettings__switch">
                                    <CQViewSwitch
                                        onChange={this.handleCheckbox.bind(this, 'showAnswers')}
                                        checked={toBoolean(this.props.settings.showAnswers)}
                                    />
                                </div>
                            </li>

                            <li>
                                <h4>Show timer</h4>
                                <p>Don't show the question timer to students. Correct answers always will score the maximum amount.</p>
                                <div className="cq-quizsettings__switch">
                                    <CQViewSwitch
                                        onChange={this.handleCheckbox.bind(this, 'showTimer')}
                                        checked={toBoolean(this.props.settings.showTimer)}
                                    />
                                </div>
                            </li>


                            <li>
                                <h4>Repeat Until Correct</h4>
                                <p>The questions will be asked again and again until the student answers it correctly.</p>
                                <div className="cq-quizsettings__switch">
                                    <div>

                                        <CQViewSwitch
                                            onChange={this.handleCheckbox.bind(this, 'repeatUntilCorrect')}
                                            checked={toBoolean(this.props.settings.repeatUntilCorrect)}
                                        />
                                        retries:
                                        <select
                                            value={this.props.settings.maxAttempts}
                                            onChange={this.handleInputValue.bind(this, 'maxAttempts')}
                                            >
                                            <option value={-1}>Until right</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                        </select>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <h4>Number of questions</h4>
                                <p> If your quiz has lots of questions you can select to only set a specific number of them. The selection of these quistions is random.
                                </p>
                                <div className="cq-quizsettings__switch">
                                    <div>
                                        <select
                                            value={this.props.settings.numQuestions}
                                            onChange={this.handleInputValue.bind(this, 'numQuestions')}
                                            >
                                            <option value={-1}>All</option>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={30}>30</option>
                                        </select>
                                    </div>

                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default CQViewQuizSettings;
