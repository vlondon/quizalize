/* @flow */
import React from 'react';

class CQImageUploader extends React.Component {

    constructor(props: Object){
        super(props);
        this.state = {};

        this.handlePicture = this.handlePicture.bind(this);
    }

    // when a file is passed to the input field, retrieve the contents as a
    // base64-encoded data URI and save it to the component's state
    handlePicture(ev:Object){

        var reader = new FileReader();
        reader.onload = (upload) =>{
            var imageData = upload.target.result;
            this.setState({ imageData });
            this.props.onImageData(imageData);
        };


        var imageFile = ev.target.files[0];

        this.setState({ imageFile });
        this.props.onImageFile(imageFile);
        reader.readAsDataURL(imageFile);

    }

    render () : any {
        return (
            <input type="file"
                className="form-control"
                ref="profilePicture"
                accept="image/*"
                onChange={this.handlePicture}
            />
        );
    }

}
CQImageUploader.propTypes = {
    onImageData: React.PropTypes.func,
    onImageFile: React.PropTypes.func
};

CQImageUploader.defaultProps = {
    onImageData: function(){},
    onImageFile: function(){}
};


export default CQImageUploader;
