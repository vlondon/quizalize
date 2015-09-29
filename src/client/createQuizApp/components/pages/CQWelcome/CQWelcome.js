/* @flow */
import React from 'react';
import CQPageTemplate from './../../../components/CQPageTemplate';
import MeStore from './../../../stores/MeStore';

class CQWelcome extends React.Component {

    constructor(props: Object){
        super(props);
        this.state = {
            user: MeStore.state
        };
    }
    render () {
        var name = this.state.user.name ? ` ${this.state.user.name}` : '';
        return (
            <CQPageTemplate className="cq-welcome">
                <img src="/cquiz/img/logo 2.png"/>
                <h1>Welcome{name}! What are you teaching this week?</h1>
                <ul className="cq-welcome__actions">
                    <li>Play a demo quiz</li>
                    <li>Watch the video</li>
                    <li>Printable guide</li>
                    <li>Preview a dashboard</li>
                </ul>
            </CQPageTemplate>
        );
    }
}

export default CQWelcome;
