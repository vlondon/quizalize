/* @flow */
import React from 'react';

import PQLink from './../../../components/utils/PQLink';

import PQQuizStore from './../../../stores/PQQuizStore';

import PQPageTemplate from './../../PQPageTemplate';

class PQList extends React.Component {

    constructor(props: Object){
        super(props);
        this.state = {
            quizzes: PQQuizStore.getQuizzes()
        };

        this.onChange = this.onChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        PQQuizStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        PQQuizStore.removeChangeListener(this.onChange);
    }

    onChange(){
        var quizzes = PQQuizStore.getQuizzes();
        this.setState({quizzes});
    }

    handleClick(){

    }

    render (): any {
        return (
            <PQPageTemplate className="pq-list">
                <div class="pq-list__header">
                    <h1>Your Quizzes</h1>
                </div>

                <div class="pq-list__quizzes">
                    <ul>
                        {this.state.quizzes.toArray().map((quiz, key)=> {
                            return (
                                <PQLink href={`/play/quiz/${quiz.uuid}`} key={key}>
                                    <li>
                                        {quiz.meta.name}
                                    </li>
                                </PQLink>
                            );
                        })}
                    </ul>
                </div>
                <div className="row">
                    <div ng-show="quizzes.quizzes.length" className="col-sm-6 col-sm-push-3">
                        <div className="well">
                            <div ng-repeat="quiz in quizzes.quizzes track by $index" style={{paddingBottom: 10}} className="row">
                                <div className="visible-sm visible-md visible-lg">
                                    <div className="col-sm-8">
                                        <h4>quiz.meta.name quiz.questions.length
                                                <ng-pluralize count="quiz.questions.length" when="{1: ' question', other: ' questions'}" />)
                                                </h4>
                                            </div>
                                            <div className="col-sm-4">
                                                <button ng-click="quizzes.startQuiz($index);" className="btn btn-info btn-block"><span className="glyphicon glyphicon-play" /></button>
                                            </div>
                                        </div>
                                        <div className="visible-xs">
                                            <div className="col-xs-12">
                                                <button ng-click="quizzes.startQuiz($index);" className="btn btn-info btn-block">quiz.meta.name (quiz.questions.length)</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div ng-hide="quizzes.quizzes.length && !quizzes.loading" className="col-sm-6 col-sm-offset-3">
                                <div className="well">
                                    <h3>No quizzes available.</h3>
                                    <p>Your Teacher has not assigned/re-published any quizzes.</p><br />
                                    <button ng-click="quizzes.reloadQuizzes();" className="btn btn-info btn-block"><span className="glyphicon glyphicon-refresh" />&nbsp;Check for new quizzes</button>
                                </div>
                            </div>
                            <div ng-hide="quizzes.loading" className="col-sm-6 col-sm-offset-3">
                                <div className="well">
                                    <h3>Finished?</h3><br /><a ng-click="quizzes.logout();" className="btn btn-default btn-block"><span className="glyphicon glyphicon-user" />&nbsp;Logout</a>
                                    <h3 className="text-center">Fetching Quizzes</h3>
                                </div>
                            </div>
                        </div>
                    </PQPageTemplate>

        );
    }
}

export default PQList;
