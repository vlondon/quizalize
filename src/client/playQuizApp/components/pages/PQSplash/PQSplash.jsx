/* @flow */
import React from 'react';

import PQLink from './../../utils/PQLink';
import PQPageTemplate from './../../PQPageTemplate';

class PQSplash extends React.Component {

    state: State;
    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    render() : any {
        return (
            <PQPageTemplate>
                <h1>Splash</h1>
                <p>
                    <PQLink href='/play/class'>Log in as a student</PQLink>
                </p>
            </PQPageTemplate>
        );
    }
}

export default PQSplash;
