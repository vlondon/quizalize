/* @flow */
import React from 'react';

import PQQuizStore from './../../../stores/PQQuizStore';

import PQViewHeader from './../../views/PQViewHeader';

class PQSplash extends React.Component {

    constructor (props:Object){
        super(props);
        PQQuizStore.getQuiz('c3c3880d-8981-4039-9f9f-b98149312c63');
        //c3c3880d-8981-4039-9f9f-b98149312c63
    }

    render (): any {
        return (
            <PQViewHeader>
                Splash
            </PQViewHeader>
        );
    }
}

export default PQSplash;
