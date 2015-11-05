/* @flow */
var React = require('react');

var CQPagination = React.createClass({

    propTypes: {
        className: React.PropTypes.string,
        pages: React.PropTypes.number,
        currentPage: React.PropTypes.number.isRequired,
        onPagination: React.PropTypes.func.isRequired
    },

    getDefaultProps: function():Object {
        return {
            className: '',
            pages: 1
        };
    },

    handlePagination: function(pageNumber: number, ev: ?Object){
        if (ev){
            ev.preventDefault();
        }

        this.props.onPagination(pageNumber);
    },

    handlePrevious: function(ev: Object){

        if (this.props.currentPage > 1) {
            this.handlePagination(this.props.currentPage - 1);
        }
        ev.preventDefault();
    },

    handleNext: function(ev:Object){

        if (this.props.pages && this.props.currentPage < this.props.pages) {
            this.handlePagination(this.props.currentPage + 1);
        }
        ev.preventDefault();
    },

    render: function(): any {

        var first = this.props.currentPage === 1;
        var last = this.props.currentPage === this.props.pages;
        var pages = [];
        if (this.props.pages){
            for (var i = 0; i < this.props.pages; i++) {
                pages.push(i + 1);
            }
        }

        var previousElement, nextElement;

        if (!first) {
            previousElement = (
                <li>
                    <a href="#" aria-label="Previous" onClick={this.handlePrevious}>
                        <span aria-hidden="true">«</span>
                    </a>
                </li>
            );
        } else {
            previousElement = (
                <li className="disabled">
                    <span>
                        <span aria-hidden="true">&laquo;</span>
                    </span>
                </li>
            );
        }

        if (!last) {
            nextElement = (
                <li>
                    <a href="#" aria-label="Next" onClick={this.handleNext}>
                        <span aria-hidden="true">»</span>
                    </a>
                </li>
            );
        } else {
            nextElement = (
                <li className="disabled">
                    <span>
                        <span aria-hidden="true">»</span>
                    </span>
                </li>
            );
        }

        if(this.props.pages && this.props.pages > 1){

            return (
                <nav className={this.props.className}>
                    <ul className="pagination">
                        {previousElement}
                        {nextElement}
                    </ul>
                </nav>

            );
        } else {
            return null;
        }
    }

});

module.exports = CQPagination;
