import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsWannabes, acceptFriendRequest, unfriend } from "./actions";

import { FriendButton } from "./friend-button";

export default function Friends(props) {
    const dispatch = useDispatch();
    const friends = useSelector(
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(user => user.accepted == true)
    );
    const wannabes = useSelector(
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(user => user.accepted == false)
    );
    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    if (!friends) {
        return null;
    }

    return (
        <div className="friends-wannabes main">
            <h2>These pondlings want to be your friends:</h2>
            <div className="wannabes users">
                {wannabes.map(user => {
                    // console.log('user: ', user);
                    let imgSrc = "/images/duck-308733.svg";
                    if (user.img_url) {
                        imgSrc = user.img_url;
                    }
                    return (
                        <React.Fragment key={user.id}>
                            <Link to={`/user/${user.id}`} key={user.id}>
                                <div className="other-user" key={user.id}>
                                    <div className="profile-pic">
                                        <img
                                            src={imgSrc}
                                            alt={`picture of ${user.first} ${user.last}`}
                                        ></img>
                                    </div>
                                    <div>
                                        {user.first} {user.last}
                                    </div>
                                </div>
                            </Link>
                            <button key={user.id} onClick={e => dispatch(acceptFriendRequest(user.id))}>Accept Friend Request</button>
                        </React.Fragment>
                    );
                })}
            </div>
            <h2>These pondlings are currently your friends:</h2>
            <div className="friends users">
                {friends.map(user => {
                    // console.log('user: ', user);
                    let imgSrc = "/images/duck-308733.svg";
                    if (user.img_url) {
                        imgSrc = user.img_url;
                    }
                    return (
                        <React.Fragment key={user.id}>
                            <Link to={`/user/${user.id}`} key={user.id}>
                                <div className="other-user" key={user.id}>
                                    <div className="profile-pic">
                                        <img
                                            src={imgSrc}
                                            alt={`picture of ${user.first} ${user.last}`}
                                        ></img>
                                    </div>
                                    <div>
                                        {user.first} {user.last}
                                    </div>
                                </div>
                            </Link>
                            <button key={user.id} onClick={e => dispatch(unfriend(user.id))}>Unfriend</button>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
