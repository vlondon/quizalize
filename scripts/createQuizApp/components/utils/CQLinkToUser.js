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

        var getUserSlug = () => {
            var user = UserStore.getPublicUser(uuid);
            if (user) {
                return user.attributes.profileUrl;
            }
        };


        var slug = getUserSlug();
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
            <CQLink href={this.state.url}>{this.props.children}</CQLink>
        );
    }

}

CQLinkToUser.propTypes = {
    uuid: PropTypes.string,
    children: PropTypes.element
};

export default CQLinkToUser;
