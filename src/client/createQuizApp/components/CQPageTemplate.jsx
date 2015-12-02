/* @flow */
var React          = require("react");
var CQViewHeader   = require("./views/CQViewHeader");

var CQPageTemplate = React.createClass({

    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.element,
            React.PropTypes.string,
            React.PropTypes.number,
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

    getDefaultProps: function() : Object {
        return {
            wrapperMainClassName: 'wrapper',
            wrapperStyleClassName: 'wrapper-style-dark'
        };
    },

    render: function () : any {
        let wrapperMainClassName = this.props.wrapperMainClassName || '';
        let wrapperStyleClassName = this.props.wrapperStyleClassName || '';

        return (
            <div className='cq'>
                <div className={wrapperMainClassName + ' ' + wrapperStyleClassName}>
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
