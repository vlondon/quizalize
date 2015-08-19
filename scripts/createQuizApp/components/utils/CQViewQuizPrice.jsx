/* @flow */
var React = require('react');
var router = require('./../../config/router');

import UserStore from './../../stores/UserStore';
import QuizStore from './../../stores/QuizStore';
import type {User} from './../../stores/UserStore';
import type {Quiz} from './../../stores/QuizStore';

import priceFormat from './../../utils/priceFormat';
var TransactionActions = require('./../../actions/TransactionActions');

type Props = {
    className: string;
    quiz: Quiz;
}
type State = {
    user: User;
}

export default class CQViewQuizPrice extends React.Component {

    props: Props;
    state: State;
    constructor(props : Props) {
        super(props);
        this.state = {
            user: UserStore.getUser()
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(owned: boolean, ev : Object){
        ev.stopPropagation();
        if (owned){
            router.setRoute(`/quiz/published/${this.props.quiz.uuid}/assign`);
        } else {
            if (!UserStore.isLoggedIn()) {
                swal({
                    title: 'You need to have an account to use this quiz in a class',
                    text: `In order to buy this item you need to log into Quizalize`,
                    type: 'info',
                    confirmButtonText: 'Create an account',
                    showCancelButton: true
                }, (isConfirm) => {
                    if (isConfirm){
                        router.setRoute(`/quiz/register?redirect=${window.encodeURIComponent('/quiz/marketplace?quid=' + this.props.quiz.uuid)}`);
                    }
                });
            } else {
                TransactionActions.buyQuiz(this.props.quiz);
            }
        }
    }

    render() : any {
        var price, owned = false;
        var OwnedQuiz = QuizStore.getOwnedQuizByOriginalQuizId(this.props.quiz.uuid);
        if (OwnedQuiz){
            price = 'Owned';
            owned = true;
        } else if (this.props.quiz.meta.price && this.props.quiz.meta.price > 0){
            price = 'Classroom version ' + priceFormat(this.props.quiz.meta.price, '$', 'us');
        } else {
            price = 'Play in class';
        }
        return (
            <span className={this.props.className} onClick={this.handleClick.bind(this, owned)}>
                {price}
            </span>
        );
    }

}

CQViewQuizPrice.propTypes = {
    quiz: React.PropTypes.object,
    className: React.PropTypes.string
};
