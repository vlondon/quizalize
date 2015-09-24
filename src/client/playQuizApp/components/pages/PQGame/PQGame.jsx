/* @flow */
import React from 'react';

import PQQuizStore from './../../../stores/PQQuizStore';
import PQPageTemplate from './../../PQPageTemplate';

type Props = {
    quizId: string;
}
class PQGame extends React.Component {

    constructor(props:Props){
        super(props);
        this.state = {
            quiz: PQQuizStore.getQuiz(props.quizId)
        };
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        PQQuizStore.addChangeListener(this.onChange);
    }
    componentWillUnmount() {
        PQQuizStore.removeChangeListener(this.onChange);
    }

    onChange(){
        this.setState({
            quiz: PQQuizStore.getQuiz(this.props.quizId)
        });
    }

    render () {
        return (<PQPageTemplate>
            PQGame
        </PQPageTemplate>);
    }
}

PQGame.propTypes = {
    quizId: React.PropTypes.string.isRequired
};

export default PQGame;
