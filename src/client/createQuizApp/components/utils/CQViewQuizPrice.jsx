/* @flow */
var React = require('react');
var router = require('./../../config/router');

import MeStore from './../../stores/MeStore';
import QuizStore from './../../stores/QuizStore';

import type {Quiz} from './../../../../types';

import priceFormat from './../../utils/priceFormat';
import TransactionActions from './../../actions/TransactionActions';
import AnalyticsActions from './../../actions/AnalyticsActions';

type Props = {
    className: string;
    quiz: Quiz;
}

export default class CQViewQuizPrice extends React.Component {

    props: Props;
    constructor(props : Props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
    }

    handleClick(owned: boolean, ev : Object){
        ev.stopPropagation();
        if (owned){
            let ownedQuiz = QuizStore.getOwnedQuizByOriginalQuizId(this.props.quiz.uuid);
            if (ownedQuiz){

                router.setRoute(`/quiz/published/${ownedQuiz.uuid}/assign`);
            }
        } else {
            if (!MeStore.isLoggedIn()) {
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
        AnalyticsActions.sendIntercomEvent('public_preview', {uuid: quiz.uuid, name: quiz.meta.name});
        AnalyticsActions.sendEvent('quiz','public_preview', quiz.meta.name);
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
                <span className='cq-public__button__main' onClick={this.handleClick.bind(this, owned)}>
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
