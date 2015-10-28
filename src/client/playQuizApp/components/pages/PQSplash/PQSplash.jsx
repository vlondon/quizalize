/* @flow */
import React from 'react';
import type {Question} from './../../../../../types';
import PQQuizStore from './../../../stores/PQQuizStore';
import PQLink from './../../utils/PQLink';
import PQPageTemplate from './../../PQPageTemplate';


type State = {
    question?: Question;
}

class PQSplash extends React.Component {

    state: State;
    constructor (props:Object){
        super(props);
        PQQuizStore.getQuiz('9b8f788f-7889-488e-ba33-a82c56f04c47');
        //c3c3880d-8981-4039-9f9f-b98149312c63
        this.state = {};
        this.onChange = this.onChange.bind(this);
    }

    onChange(){

        var quiz = PQQuizStore.getQuiz('9b8f788f-7889-488e-ba33-a82c56f04c47');
        if (quiz) {
            var question:Question = quiz.getQuestion(0).toObject();
            this.setState({
                quiz,
                question
            });
        }
    }

    componentWillMount() {

        PQQuizStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        PQQuizStore.removeChangeListener(this.onChange);
    }

    render (): any {

        return (
            <PQPageTemplate>
                <h1>Splash</h1>
                <p>
                    <PQLink href='/play/class'>Log in as a student</PQLink>
                </p>
            </PQPageTemplate>
        );
    }
}

export default PQSplash;
