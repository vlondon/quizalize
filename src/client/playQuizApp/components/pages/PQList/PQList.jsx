/* @flow */
import React from 'react';

import PQUserStore from './../../../stores/PQUserStore';

export default class PQList extends React.Component {

    constructor(props:Object){
        super(props);
        var user = PQUserStore.getUser();
        console.log('--- user: ', user);
        this.state = {
            user,
            userIsLoggedIn: (user && user.uuid) ? true : false
        };
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        PQUserStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        PQUserStore.removeChangeListener(this.onChange);
    }

    onChange() {
        var user = PQUserStore.getUser();
        console.log('User changed: ', user);
        if (user && user.uuid) {
            this.setState({
                userIsLoggedIn: true,
                user
            });
        }
    }

    handleChange(field:string, ev:Object){
        var state = Object.assign({}, this.state);
        state[field] = ev.target.value;
        this.setState(state);
    }

    loading(): Object {
        return (
            <div>
                Loading
            </div>
        );
    }

    loggedIn(): Object {
        return (
            <div>List</div>
        );
    }

    render(): any {
        return (
            <div className="pq-login">
                { this.state.userIsLoggedIn ? this.loggedIn() : this.loading() }
            </div>
        );
    }
}
