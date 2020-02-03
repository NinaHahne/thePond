import React from "react";
import axios from './axios';

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editingMode: false,
            bio: this.props.bio
        };
    }
    handleChange(e) {
        // console.log('in BioEditor, e.target.value: ', e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        });
        // set state is async: so console log is always one character late, but the state is set correctly:
        // console.log('in BioEditor, this.state.bio: ', this.state.bio);
    }

    saveBio(e) {
        e.preventDefault();
        axios.post('/bio/edit', {
            userId: this.props.userId,
            bio: this.state.bio
        }).then(({data}) => {
            if (data.success) {
                this.props.setBio(this.state.bio);
                this.setState({editingMode: false});
            } else {
                this.setState({
                    error: true
                });
            }
        }).catch(err => {
            console.log('err in /bio/edit in bioeditor.js: ', err);
        });
    }

    render() {
        let editElem =
        <div className="editing-bio">
            <textarea id="edit-bio" name="bio" onChange={e => this.handleChange(e)} defaultValue={this.props.bio}></textarea>
            {/* <button onClick={this.props.setBio(this.state.bio)}>Save</button> */}
            <button className="save-btn" onClick={e => this.saveBio(e)}>Save</button>
        </div>;

        let noBioElem =
        <div>
            <p>{this.props.bio}</p>
            <button className="edit-or-add-btn" onClick={() => this.setState({editingMode: true})}>Add Bio</button>
        </div>;

        let bioElem =
        <div>
            <p>{this.props.bio}</p>
            <button className="edit-or-add-btn" onClick={() => this.setState({editingMode: true})}>Edit Bio</button>
        </div>;

        return (
            <div className="profile-text">
                <h2>{this.props.first} {this.props.last}</h2>
                {!this.state.editingMode && this.props.bio && bioElem}
                {!this.state.editingMode && !this.props.bio && noBioElem}
                {this.state.editingMode && editElem}
            </div>
        );
    }
}
