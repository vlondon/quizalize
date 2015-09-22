var React           = require('react');

var CQViewHeader   = require('./views/CQViewHeader');

var CQPageTemplate = React.createClass({

    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.element
        ]),
        className: React.PropTypes.string,
        wrapperMainClassName: React.PropTypes.string,
        wrapperStyleClassName: React.PropTypes.string,
        showBanner: React.PropTypes.bool
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
            <div className='cq'>
                <div className={this.props.wrapperMainClassName + ' ' + this.props.wrapperStyleClassName}>
                    <CQViewHeader/>

                    <div className={this.props.className}>
                        {this.props.children}
                    </div>
                </div>

            </div>
        );
    }

});

module.exports = CQPageTemplate;