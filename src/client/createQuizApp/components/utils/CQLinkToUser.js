/* @flow */
import React, { PropTypes } from 'react';
import CQLink from './CQLink';

import UserStore from './../../stores/UserStore';

class CQLinkToUser extends React.Component {

    constructor (props: Object) {
        super(props);
        var url = this.getUrl(props.uuid);
        this.state = { url };
    }

    getUrl (uuid: string) : string {
        var slug = this.props.slug;
        var url;

        if (slug){
            url = `/profile/${slug}`;
        } else {
            url = `/quiz/user/${uuid}`;
        }

        return url;
    }

    render () {
        return (
            <CQLink {...this.props} href={this.state.url}>{this.props.children}</CQLink>
        );
    }

}

CQLinkToUser.propTypes = {
    uuid: PropTypes.string,
    children: PropTypes.element,
    slug: PropTypes.string,
};

export default CQLinkToUser;
