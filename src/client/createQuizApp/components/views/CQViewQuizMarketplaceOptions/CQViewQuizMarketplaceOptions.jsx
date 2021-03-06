import React from 'react';

import {
    TransactionStore,
    QuizStore
} from 'createQuizApp/stores';


import QuizActions from 'createQuizApp/actions/QuizActions';

import { priceFormat } from 'createQuizApp/utils';

var CQViewQuizMarketplaceOptions = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string
    },

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        QuizStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
    },
    onChange: function(){
        this.setState({quiz: this._getQuiz()});
    },
    getState: function(){
        return {
            quiz: this._getQuiz(),
            prices: TransactionStore.getPrices(),
            price: 0
        };
    },

    _getQuiz: function(props){
        props = props || this.props;

        var quiz = props.quizId ? QuizStore.getQuiz(props.quizId) : undefined;

        return quiz;
    },

    handleChange: function(ev){
        var price = Number(ev.target.value);
        this.setState({price});
    },


    handleDone: function(){

        console.log('publishing to marketplace');
        var settings = {
            price: this.state.price
        };

        if (this.state.quiz) {
            QuizActions.publishQuiz(this.state.quiz, settings);
        }

    },


    render: function() {
        return (
            <div className='cq-quizmarketplace'>
                <h3>
                    <span className="cq-quizmarketplace__icon">
                        <i className="fa fa-tags"></i>
                    </span> Set pricing and marketplace options

                </h3>
                <div className="cq-quizmarketplace__list">
                    <p>
                        We’ll make your hard work available to teachers around the world in the Marketplace - set your price
                    </p>


                    {this.state.prices.map( (price, key) =>{
                        var selected = this.state.price === price;
                        return (
                            <div key={key}>
                                <input
                                    type="radio"
                                    name="price"
                                    id={`price-${key}`}
                                    value={price}
                                    onChange={this.handleChange}
                                    checked={selected}/>
                                <label htmlFor={`price-${key}`}>
                                    &nbsp;{priceFormat(price, '$', 'us')}
                                </label>
                            </div>
                        );
                    })}

                    <button className="btn btn-default"
                        onClick={this.handleDone}>
                        Publish to Marketplace
                    </button>

                </div>
            </div>
        );
    }

});

module.exports = CQViewQuizMarketplaceOptions;
