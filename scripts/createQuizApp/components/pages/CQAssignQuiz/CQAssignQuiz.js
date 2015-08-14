/* @flow */
import React from 'react';

import CQPageTemplate from './../../../components/CQPageTemplate';
import QuizStore from './../../../stores/QuizStore';
import GroupStore from './../../../stores/GroupStore';
import type { Quiz } from './../../../stores/QuizStore';

type Props = {
    marketplaceQuizId: string;
}
type State = {
    quiz: ?Quiz;
}

class CQAssignQuiz extends React.Component {

    props: Props;
    state: State;

    constructor(props: Props){
        super(props);
        var quiz = QuizStore.getOwnedQuizByOriginalQuizId(props.marketplaceQuizId);
        console.log('QUIZ', quiz);
        this.state = { quiz };
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
        var groups = GroupStore.getGroups();
        console.log('Groups', groups);


        this.setState({quiz});
    }

    render () {
        return (
            <CQPageTemplate>
                Yo
            </CQPageTemplate>
        );
    }
}

CQAssignQuiz.propTypes = {
    marketplaceQuizId: React.PropTypes.stirng
};

export default CQAssignQuiz;
