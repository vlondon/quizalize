var React           = require('react');

var CQHeader   = require('./sections/CQHeader');

var CQPageTemplate = React.createClass({

    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.element
        ]),
        className: React.PropTypes.string,
        wrapperMainClassName: React.PropTypes.string,
        wrapperStyleClassName: React.PropTypes.string
    },

    componentDidMount: function() {
        // enable Bootstrap popovers
        $('[data-toggle="popover"]').popover();
    },

    componentWillUnmount: function() {
    },

    getDefaultProps: function(){
        return {
            wrapperMainClassName: 'wrapper',
            wrapperStyleClassName: 'wrapper-style-dark'
        };
    },

    render: function () {
        return (
            <div>
                <div className={this.props.wrapperMainClassName + ' ' + this.props.wrapperStyleClassName}>
                    <CQHeader/>
                    <div className={this.props.className}>
                        {this.props.children}
                    </div>
                </div>

            </div>
        );
    }

});

module.exports = CQPageTemplate;
