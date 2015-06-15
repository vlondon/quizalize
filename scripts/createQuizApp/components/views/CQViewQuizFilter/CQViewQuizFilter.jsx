var React = require('react');

var CQviewQuizFilter = React.createClass({

    propTypes: {
        onSearchInput: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            searchString: undefined
        };
    },

    handleSearch: function(ev){
        this.props.onSearchInput(ev.target.value);
    },

    render: function() {
        return (
            <div className='row'>
                <div className='col-md-1'>
                    Filter
                </div>
                <div className='col-md-2'>
                    Search by name:
                    <input type="text" value={this.state.searchString}
                        onChange={this.handleSearch}/>
                </div>
                <div className="col-md-2">
                    Order by
                    
                </div>
            </div>
        );
    }

});

module.exports = CQviewQuizFilter;
