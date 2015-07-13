/* @flow */
import React from 'react';

import type {Question} from './../../../../createQuizApp/stores/QuizStore';

import PQQuizStore from './../../../stores/PQQuizStore';

import PQPageTemplate from './../../PQPageTemplate';
import PQViewVideo from './../../views/PQViewVideo';
import QLMultiple from './../../../../quizApp/components/QLMultiple';

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
        console.log('onChange called', this);
        var quiz = PQQuizStore.getQuiz('9b8f788f-7889-488e-ba33-a82c56f04c47');
        if (quiz) {
            var question:Question = quiz.getQuestion(0);
            this.setState({question});
        }
    }

    componentWillMount() {

        PQQuizStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        PQQuizStore.removeChangeListener(this.onChange);
    }

    render (): any {

        var question;
        if (this.state.question) {
            question = (
                <div>
                    <PQViewVideo/>
                    <QLMultiple
                        question={this.state.question.question}
                        alternatives={this.state.question.alternatives}
                        questionData={this.state.question}
                    />
                </div>
            );
        }
        console.log('this.state', this.state, question);
        return (
            <PQPageTemplate>
                Splash
                {question}
            </PQPageTemplate>
        );
    }
}

export default PQSplash;
