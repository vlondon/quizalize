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

    handleClick(ev : Object){
        ev.stopPropagation();
        if (!UserStore.isLoggedIn()) {
            swal({
                title: 'You need to be logged in',
                text: `In order to buy this item you need to log into Quizalize`,
                type: 'info',
                confirmButtonText: 'Log in',
                showCancelButton: true
            }, function(isConfirm){
                if (isConfirm){
                    router.setRoute(`/quiz/login?redirect=${window.encodeURIComponent('/quiz/marketplace')}`);
                }
            });
        } else {
                TransactionActions.buyQuiz(this.props.quiz);
        }
    }

    render() : any {
        var price;
        var OwnedQuiz = QuizStore.getOwnedQuizByOriginalQuizId(this.props.quiz.uuid);
        console.log('OwnedQuiz', OwnedQuiz);
        if (OwnedQuiz){
            price = 'Owned';
        } else if (this.props.quiz.meta.price === 0){
            price = 'Play in class';
        } else {
            price = 'Classroom version ' + priceFormat(this.props.quiz.meta.price, '$', 'us');
        }
        return (
            <span className={this.props.className} onClick={this.handleClick}>
                {price}
            </span>
        );
    }

}

CQViewQuizPrice.propTypes = {
    quiz: React.PropTypes.object,
    className: React.PropTypes.string
};
