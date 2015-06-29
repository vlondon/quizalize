var React = require('react');

var TransactionStore = require('createQuizApp/stores/TransactionStore');
var TransactionActions = require('createQuizApp/actions/TransactionActions');
var router = require('createQuizApp/config/router');
var QuizStore = require('createQuizApp/stores/QuizStore');
var QuizActions = require('createQuizApp/actions/QuizActions');

var priceFormat = require('createQuizApp/utils/priceFormat');

var CQViewQuizMarketplaceOptions = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string
    },

    getInitialState: function() {
        return this.getState();
    },

    getState: function(){
        return {
            quiz: this._getQuiz(),
            prices: TransactionStore.getPrices(),
            price: 0.79
        };
    },

    _getQuiz: function(props){
        props = props || this.props;

        var quiz = props.quizId ? QuizStore.getQuiz(props.quizId) : undefined;


        if (quiz === undefined){
            if (this.props.quizId) {
                QuizActions.loadQuiz(this.props.quizId);
            }
            quiz = {
                meta: {},
                payload: {}
            };
        }
        return quiz;
    },

    handleChange: function(ev){
        console.log('ev.target.value,', ev.target.value);
        var price = Number(ev.target.value);
        this.setState({price});
    },


    handleDone: function(ev){
        console.log("Publish at ",this.state.price, " for ",this.props.quizId);
        var settings = {
            price: this.state.price
        }
        TransactionActions.publishQuiz(this.state.quiz,settings)
        //QuizActions.publishQuiz()
    },


    render: function() {
        return (
            <div className='cq-quizmarketplace'>
                <h3>
                    Set pricing and marketplace options
                </h3>
                <div name="publish">
                    <p>
                        We’ll make your hard work available to teachers around the world in the Marketplace - set your price
                    </p>

                    <ul>
                        {this.state.prices.map( (price, key) =>{
                            var selected = this.state.price === price;
                            return (
                                <li>
                                    <input
                                        type="radio"
                                        name="price"
                                        id={`price-${key}`}
                                        value={price}
                                        onChange={this.handleChange}
                                        checked={selected}/>
                                    <label htmlFor={`price-${key}`}>
                                        &nbsp;{priceFormat(price)}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
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
