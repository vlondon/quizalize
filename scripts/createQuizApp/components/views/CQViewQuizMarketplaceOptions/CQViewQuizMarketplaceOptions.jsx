var React = require('react');

var TransactionStore = require('createQuizApp/stores/TransactionStore');

var priceFormat = require('createQuizApp/utils/priceFormat');

var CQViewQuizMarketplaceOptions = React.createClass({

    getInitialState: function() {
        return {
            prices: TransactionStore.getPrices(),
            price: 0.79
        };
    },

    handleChange: function(ev){
        console.log('ev.target.value,', ev.target.value);
        var price = Number(ev.target.value);
        this.setState({price});
    },

    render: function() {
        return (
            <div className='cq-quizmarketplace'>
                <h3>
                    Set pricing and marketplace options
                </h3>
                <p>
                    We’ll make your hard work available to teachers around the world in the MarketPlace - set your price
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


            </div>
        );
    }

});

module.exports = CQViewQuizMarketplaceOptions;
