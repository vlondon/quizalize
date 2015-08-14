var React = require('react');
var router = require('createQuizApp/config/router');

import UserStore from './../../stores/UserStore';

var priceFormat = require('createQuizApp/utils/priceFormat');
var TransactionActions = require('createQuizApp/actions/TransactionActions');

var CQViewQuizPrice = React.createClass({

    propTypes: {
        quiz: React.PropTypes.object,
        className: React.PropTypes.string
    },

    getInitialState: function() {
        return {
            user: UserStore.getUser()
        };
    },

    handleClick: function(ev){
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
    },

    render: function() {
        var price;
        if (this.props.quiz.meta.price === 0){
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

});

module.exports = CQViewQuizPrice;
