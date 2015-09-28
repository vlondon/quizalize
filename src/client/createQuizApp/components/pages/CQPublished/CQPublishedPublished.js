import React from 'react';
import CQPublished from './CQPublished';

class CQPublishedPublished extends React.Component {
    render () {
        return (
            <CQPublished {...this.props} published={true}/>
        );
    }
}

export default CQPublishedPublished;
