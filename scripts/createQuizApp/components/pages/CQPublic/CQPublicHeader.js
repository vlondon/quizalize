/* @flow */
import React from 'react';
import CQLink from './../../utils/CQLink';

var image = require('assets/qz-mkt-header-cta-bggraphic.png');

class CQPublicHeader extends React.Component {
    handleClick () {
        /*eslint-disable */
        if (window.Intercom){
            window.Intercom('showNewMessage');
        }
        /*eslint-enable */
    }
    render () : any {
        return (
            <div className="cq-public__headercta">
                <h1><b>Marketplace</b> Where teachers share classroom quizzes</h1>
                <div className="cq-public__headercta__box">
                    <h5>Quick start</h5>
                    <ul>
                        <li>
                            <div className="cq-public__headercta__info">
                                Choose your topic
                            </div>
                        </li>
                        <li>
                            <div className="cq-public__headercta__info">
                                Write questions
                            </div>
                        </li>
                        <li>
                            <div className="cq-public__headercta__info">
                                Set your price
                            </div>
                            <h5>or share for free</h5>
                        </li>
                        <li>
                            <div className="cq-public__headercta__info">
                                <CQLink href="/quiz/create">
                                    <button type="button">
                                        Start
                                    </button>
                                </CQLink>
                            </div>
                            <h5>Not sure? <a onClick={this.handleClick}>Let us help you make your quiz</a></h5>
                        </li>
                    </ul>
                </div>
                <img src={image} className="cq-public__headercta__background"/>
            </div>
        );
    }
}

export default CQPublicHeader;
