import React, { PropTypes } from 'react';

var shuffle = function(array) {
    if (array.length==1) {
        return array;
    }
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};


class CQConversationQuestion extends React.Component {

    static propTypes = {
        question: PropTypes.object,
        onAnswer: PropTypes.func
    };

    constructor(props){
        super(props);
        this.handleAnswer = this.handleAnswer.bind(this);
    }

    handleAnswer(text){
        console.log('we got', text);
    }

    render () {
        let {question} = this.props;

        if (question){
            let options = question.alternatives;
            options.push(question.answer);
            options = options.filter(q=> q.length > 0);
            console.log('rendering', options);

            return (
                <div className="quiz-conversation">
                    <ul className="quiz-wrapper question">
                    {options.map( o => {
                        return (
                            <li className="option">
                                <p ng-if="option.type == 'text'" onClick={this.props.onAnswer.bind(this, this.props.question, o)}>
                                    {o}
                                </p>
                            </li>
                        );
                    })}
                    </ul>
                </div>
            );
        } else {
            return <div/>;
        }
    }
}

export default CQConversationQuestion;
