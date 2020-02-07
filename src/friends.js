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

    if (!friends && !wannabes) {
        return null;
    }

    return (
        <div className="friends-wannabes main">
            <h2>These pondlings want to be your friends:</h2>
            <div className="wannabes users">
                {wannabes.map(wannabe => {
                    // console.log('wannabe: ', wannabe);
                    let imgSrc = "/images/duck-308733.svg";
                    if (wannabe.img_url) {
                        imgSrc = wannabe.img_url;
                    }
                    return (
                        <React.Fragment key={wannabe.id}>
                            <Link to={`/wannabe/${wannabe.id}`}>
                                <div className="other-wannabe">
                                    <div className="profile-pic">
                                        <img
                                            src={imgSrc}
                                            alt={`picture of ${wannabe.first} ${wannabe.last}`}
                                        ></img>
                                    </div>
                                    <div>
                                        {wannabe.first} {wannabe.last}
                                    </div>
                                </div>
                            </Link>
                            <button onClick={e => dispatch(acceptFriendRequest(wannabe.id))}>Accept Friend Request</button>
                        </React.Fragment>
                    );
                })}
            </div>
            <h2>These pondlings are currently your friends:</h2>
            <div className="friends friends">
                {friends.map(friend => {
                    // console.log('friend: ', friend);
                    let imgSrc = "/images/duck-308733.svg";
                    if (friend.img_url) {
                        imgSrc = friend.img_url;
                    }
                    return (
                        <React.Fragment key={friend.id}>
                            <Link to={`/friend/${friend.id}`}>
                                <div className="other-friend">
                                    <div className="profile-pic">
                                        <img
                                            src={imgSrc}
                                            alt={`picture of ${friend.first} ${friend.last}`}
                                        ></img>
                                    </div>
                                    <div>
                                        {friend.first} {friend.last}
                                    </div>
                                </div>
                            </Link>
                            <button onClick={e => dispatch(unfriend(friend.id))}>Unfriend</button>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
