import React from "react";
import axios from './axios';

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    }
    uploadImage(e) {
        e.preventDefault();
        var formData = new FormData();
        console.log('this.state.file: ', this.state.file);
        formData.append("file", this.state.file);
        this.file = null;
        axios.post('/upload', formData).then(({data}) => {
            if (data.success) {
                // it worked
                // console.log('data.imageUrl after POST upload:', data.imageUrl);
                this.props.setImageUrl(data.imageUrl);
            } else {
                // failure!
                this.setState({
                    error: true
                });
            }
        }).catch(err => {
            console.log('err in uploadImage() in upload.js: ', err);
        });
    }
    render() {
        return (
            <div className="uploader-box">
                <div className="uploader">
                    <div className="closeX" onClick={() => this.props.closeUploader()}>X</div>
                    <p>Want to change your profile picture?</p>
                    <input id="file" type="file" onChange={e => this.handleChange(e)} name="file" accept='image/*'/>
                    <button onClick={e => this.uploadImage(e)}>Upload</button>
                </div>
            </div>
        );
    }
}
