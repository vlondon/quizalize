/* @flow */
import React from 'react';
import router from './../../config/router';


type Props = {
    children: any;
    href: string;
    className: string;
    stopPropagation: boolean;
    onClick: Function;
}

export default class PQLink extends React.Component {

    props: Props;

    constructor(props:Props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        // window.addEventListener("keydown", onKeyDown);
        // window.addEventListener("keyup", onKeyUp);

    }

    componentWillUnmount() {
        // window.removeEventListener("keydown", onKeyDown);
        // window.removeEventListener("keyup", onKeyUp);

    }

    handleKeyDown(){

    }

    handleKeyUp(){

    }

    handleClick(ev:Object){
        ev.preventDefault();

        if (this.props.stopPropagation){
            ev.stopPropagation();
        }
        if (this.props.onClick){
            this.props.onClick(ev);
        }
        router.setRoute(this.props.href);

    }

    render(): any{
        return (
            <a onClick={this.handleClick}
                href={this.props.href}
                className={this.props.className}>
                {this.props.children}
            </a>
        );
    }
}

PQLink.propTypes = {
    children: React.PropTypes.any,
    href: React.PropTypes.string,
    className: React.PropTypes.string,
    stopPropagation: React.PropTypes.bool,
    onClick: React.PropTypes.func
};

PQLink.defaultProps = {
    href: '',
    stopPropagation: false
};
