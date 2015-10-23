/* @flow */
import React from 'react';

import { CQPageTemplate } from './../../../components';
import {
    QuizStore,
    GroupStore
} from './../../../stores';

import { GroupActions } from './../../../actions';
import type { Quiz } from './../../../../../types';

type Props = {
    routeParams: {
        quizId: string;
    }
}
type State = {
    quiz: ?Quiz;
    init: boolean;
}

class CQAssignQuiz extends React.Component {

    props: Props;
    state: State;

    constructor(props: Props){
        super(props);
        var marketplaceQuizId = props.routeParams.quizId;
        var quiz = QuizStore.getOwnedQuizByOriginalQuizId(marketplaceQuizId);
        var init = false;
        this.state = { quiz, init };
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        QuizStore.addChangeListener(this.onChange);
        GroupStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        QuizStore.removeChangeListener(this.onChange);
        GroupStore.removeChangeListener(this.onChange);
    }

    onChange(){
        var marketplaceQuizId = this.props.routeParams.quizId;
        var quiz = QuizStore.getOwnedQuizByOriginalQuizId(marketplaceQuizId);
        var groupsLoaded = GroupStore.isLoaded();

        var {init} = this.state;
        if (quiz && init === false && groupsLoaded){
            init = true;
            GroupActions.createFirstAssignment(quiz.uuid);
            this.setState({init});
        }

    }

    render () {
        return (
            <CQPageTemplate/>
        );
    }
}

CQAssignQuiz.propTypes = {
    routeParams: React.PropTypes.object
};

export default CQAssignQuiz;
