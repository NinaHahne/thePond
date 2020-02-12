import React from "react";
import axios from './axios';

import FriendButton from './friend-button';

export default class OtherProfile extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // here we want to make a request to the server to get all the info about the requested user...
        // returns object with info about the url:
        // console.log('this.props.match.params.id: ', this.props.match.params.id);
        let requestedId = this.props.match.params.id;
        this.setState({
            otherUserId: requestedId
        });
        // we want the server to send back all info about the requested user
        // AND the id of the currently logged in user
        // IF these are the same.. we need to redirect them back to the /
        if (requestedId == this.props.userId) {
            // we want to redirect them...
            this.props.history.push('/');
        } else {
            axios.get("/api/user/"+this.props.match.params.id).then(({ data }) => {
                // console.log('data after GET /api/user/:id: ', data);

                if (data.success) {
                    this.setState(data);
                } else {
                    this.setState({
                        error: true
                    });
                    // we also want to redirect if the user does not exist...
                    this.props.history.push('/');
                }
            }).catch(err => {
                console.log('err in GET /api/user/:id in other-profile.js', err);
            });
        }
    }

    render() {
        let noBioElem =
        <div>
            <p>no bio yet</p>
        </div>;

        let bioElem =
        <div>
            <p>{this.state.bio}</p>
        </div>;

        return (
            <div className="profile main">
                <div className="profile-left">
                    <div className="profile-pic">
                        <img src={this.state.imageUrl} alt="profile picture"></img>
                    </div>
                    <FriendButton
                        otherUserId={this.state.otherUserId}
                    />

                </div>
                <div className="profile-text">
                    <h2>{this.state.first} {this.state.last}</h2>
                    {this.state.bio && bioElem}
                    {!this.state.bio && noBioElem}
                </div>
            </div>
        );
    }

}
