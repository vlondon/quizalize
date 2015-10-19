/* @flow */
import React from 'react';

import {
    MeStore
} from './../../../stores';


import {
    UserActions
} from './../../../actions';

import type {
    UserType
} from './../../../../../types';

import {
    CQSpinner
} from './../../../components';
type State = {
    user: UserType
};

class CQDiscoveryPerformUpgrade extends React.Component {
    state: State;
    constructor(props : Object) {
        super(props);
        this.state = {
            user: MeStore.state
        };
        this.onChange();

    }

    componentDidMount() {
        MeStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        MeStore.removeChangeListener(this.onChange);
    }

    onChange(){
        let user = MeStore.state;
        if (user.uuid !== '-1'){
            UserActions.discoveryPromotion()
                .then(()=> { window.location = '/quiz/welcome'; })
                .catch(()=>{
                    // TODO Francesco check the copy
                    window.swal({
                        title: 'Oops, something went wrong',
                        text: `We have had an issue upgrading your account, please try again later.
                            If the problem persist contact us.`,
                        type: 'error'
                    });
                });

        }
        console.log('onChange: we got user useruser', user.uuid);
    }
    render () : any {
        return (
            <div><CQSpinner/></div>
        );
    }
}

export default CQDiscoveryPerformUpgrade;
