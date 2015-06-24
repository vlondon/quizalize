var React = require('react');

var priceFormat = require('createQuizApp/utils/priceFormat');

var CQViewQuizPrice = React.createClass({

    propTypes: {
        quiz: React.PropTypes.object.isRequired,
        className: React.PropTypes.string
    },

    render: function() {
        return (
            <span className={this.props.className}>
                {priceFormat(this.props.quiz.meta.price)}
            </span>
        );
    }

});

module.exports = CQViewQuizPrice;
