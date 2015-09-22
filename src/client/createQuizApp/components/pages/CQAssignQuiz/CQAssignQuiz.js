/* @flow */
import React from 'react';

import CQPageTemplate from './../../../components/CQPageTemplate';
import QuizStore from './../../../stores/QuizStore';
import GroupStore from './../../../stores/GroupStore';
import type { Quiz } from './../../../stores/QuizStore';
import GroupActions from './../../../actions/GroupActions';

type Props = {
    marketplaceQuizId: string;
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
        var quiz = QuizStore.getOwnedQuizByOriginalQuizId(props.marketplaceQuizId);
        var init = false;
        console.log('QUIZ', quiz);
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
        var quiz = QuizStore.getOwnedQuizByOriginalQuizId(this.props.marketplaceQuizId);
        var groupsLoaded = GroupStore.isLoaded();

        var init = this.state.init;
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
    marketplaceQuizId: React.PropTypes.string
};

export default CQAssignQuiz;
