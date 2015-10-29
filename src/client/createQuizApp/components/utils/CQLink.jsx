/* @flow */
import React from  'react';
import {Link} from 'react-router';

var CQLink = React.createClass({

    propTypes: {
        children: React.PropTypes.any,
        href: React.PropTypes.string,
        className: React.PropTypes.string,
        stopPropagation: React.PropTypes.bool,
        onClick: React.PropTypes.func
    },

    getDefaultProps: function() : {href: string; stopPropagation: boolean} {
        return {
            href: '',
            stopPropagation: false
        };
    },

    handleClick: function(ev: Event){
    //     ev.preventDefault();
    //
        if (this.props.stopPropagation){
            ev.stopPropagation();
            // ev.preventDefault();
        }
        if (this.props.onClick){
            this.props.onClick(ev);
        }

    },


    render: function() : any{
        return (
            <Link
                to={this.props.href}
                className={this.props.className}
                onClick={this.handleClick}
            >
                {this.props.children}
            </Link>
        );
    }
});

module.exports = CQLink;
