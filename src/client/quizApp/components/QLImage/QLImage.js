import React from 'react';

import imageUrlParser from './../../../createQuizApp/utils/imageUrlParser';

class QLImage extends React.Component {
    render () {
        var className = this.props.className || '';
        var src = imageUrlParser(this.props.src);
        return (
            <img src={src}  className={className} alt=""/>

        );
    }
}

QLImage.propTypes = {
    src: React.PropTypes.string.isRequired,
    className: React.PropTypes.string
};

export default QLImage;
