/* @flow */
import React from 'react';

import PQViewHeader from './views/PQViewHeader';

export default class PQPageTemplate extends React.Component {

    componentDidMount() {
    }

    componentWillUnmount() {
    }


    render ():any {
        return (
            <div className='cq'>
                <div className={this.props.wrapperMainClassName + ' ' + this.props.wrapperStyleClassName}>
                    <PQViewHeader/>
                    <div className={this.props.className}>
                        {this.props.children}
                    </div>
                </div>

            </div>
        );
    }

}

PQPageTemplate.defaultProps = {
    wrapperMainClassName: 'wrapper',
    wrapperStyleClassName: 'wrapper-style-dark',
    className: 'page'
};

PQPageTemplate.propTypes = {
    children: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.element
    ]),
    className: React.PropTypes.string,
    wrapperMainClassName: React.PropTypes.string,
    wrapperStyleClassName: React.PropTypes.string
};
