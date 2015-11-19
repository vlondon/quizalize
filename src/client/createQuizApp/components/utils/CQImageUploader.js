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
        if (ev.target.files[0].size <= 1048576){
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
        else {
            window.swal("Oops...", "The image you are trying to upload it too large. The maximum size for your image is 1MB", "error");
        }


    }



    render () : any {
        return (
            <input type="file"
                ref="profilePicture"
                accept="image/*"
                id={this.props.id}
                onChange={this.handlePicture}
                className={`form-control ${this.props.className}`}
            />
        );
    }

}
CQImageUploader.propTypes = {
    onImageData: React.PropTypes.func,
    onImageFile: React.PropTypes.func,
    id: React.PropTypes.string.isRequired,
    className: React.PropTypes.string
};

CQImageUploader.defaultProps = {
    onImageData: function(){},
    onImageFile: function(){},
    className: ''
};


export default CQImageUploader;
