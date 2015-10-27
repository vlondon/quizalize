/* @flow */
import React, { PropTypes } from 'react';

import { CQPageTemplate } from './../../../components';


var CQNotFound = React.createClass({
    propTypes: {
        redirectUrl: PropTypes.string.isRequired
    },

    getInitialState: function() {
        return {};
    },


    render: function() {
        return (
            <CQPageTemplate className="container">
                <h2>
                    Redirecting… {this.props.redirectUrl}
                </h2>
            </CQPageTemplate>
        );
    }

});

module.exports = CQNotFound;
