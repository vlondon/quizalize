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
        this.handlePreview = this.handlePreview.bind(this);
    }

    handleClick(owned: boolean, ev : Object){
        ev.stopPropagation();
        if (owned){
            router.setRoute(`/quiz/published/${this.props.quiz.uuid}/assign`);
        } else {
            if (!UserStore.isLoggedIn()) {
                swal({
                    title: 'You need to have an account to use this quiz in a class',
                    text: `It takes seconds to create an account`,
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
    handlePreview(){
        var quiz = this.props.quiz;
        sessionStorage.setItem('mode', 'preview');
        window.open(`/app#/play/public/${quiz.uuid}`);
    }

    render() : any {
        var price, owned = false;
        var OwnedQuiz = QuizStore.getOwnedQuizByOriginalQuizId(this.props.quiz.uuid);
        if (OwnedQuiz){
            price = 'Play in class';
            owned = true;
        } else if (this.props.quiz.meta.price && this.props.quiz.meta.price > 0){
            price = 'Play in class for '  + priceFormat(this.props.quiz.meta.price, '$', 'us');
        } else {
            price = 'Play in class';
        }
        return (
            <div>

                <span className='cq-public__button' onClick={this.handlePreview}>
                    Play
                </span>
                <span className='cq-public__button' onClick={this.handleClick.bind(this, owned)}>
                    {price}
                </span>
            </div>
        );
    }

}

CQViewQuizPrice.propTypes = {
    quiz: React.PropTypes.object,
    className: React.PropTypes.string
};
