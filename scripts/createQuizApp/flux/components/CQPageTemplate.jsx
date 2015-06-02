var React           = require('react');
var CQHeader   = require('./sections/CQHeader');
var CQModal   = require('./utils/CQModal');
// var FooterSection   = require('components/common/sections/FooterSection');

var CQPageTemplate = React.createClass({

    propTypes: {
        children: React.PropTypes.element,
        className: React.PropTypes.string,
        wrapperMainClassName: React.PropTypes.string,
        wrapperStyleClassName: React.PropTypes.string
    },

    componentDidMount: function() {
        $(document).on('mouseenter', '[data-toggle="popover"]', function(){
            $(this).popover('show');
        });

        $(document).on('mouseleave', '[data-toggle="popover"]', function(){
            $(this).popover('hide');
        });
    },

    componentWillUnmount: function() {
        $(document).off('mouseenter');
        $(document).off('mouseleave');
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
                    <CQModal/>
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
