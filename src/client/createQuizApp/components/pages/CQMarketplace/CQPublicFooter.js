/* @flow */
import React  from 'react';
import { CQLink } from './../../../components';
import { router } from './../../../config';


class CQPublicFooter extends React.Component {

    handleClick() {
        router.setRoute(`/quiz/create`);
    }

    render () : any {
        return (
            <div className="cq-public__footer">
                <div className="cq-public__footer__copy">

                    <h1 className="cq-public__footer__title">Can’t find the right game?</h1>
                    <p className="cq-public__footer__text">
                        This service is brand new, and you might be the first to use
                        it for your topic. Why not <CQLink href="/quiz/create">make one
                        for your class</CQLink> - it’s very easy, just type your
                        questions and play…
                    </p>
                    <h5>
                        Did you know -  <br/>
                        if you share it on the marketplace you can even set a price for others to use it
                    </h5>
                </div>
                <div className="cq-public__footer__cta">
                    <button type="button" className="cq-public__footer__cta__button" onClick={this.handleClick}>
                        Make a quiz game

                    </button>
                </div>
            </div>
        );
    }
}

export default CQPublicFooter;
