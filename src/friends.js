import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unfriend
} from "./actions";

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
            {wannabes.length != 0 && (
                <h2>These pondlings want to be your friends:</h2>
            )}

            <div className="wannabes users">
                {wannabes.map(wannabe => {
                    let imgSrc = "/images/duck-308733.svg";
                    if (wannabe.img_url) {
                        imgSrc = wannabe.img_url;
                    }
                    return (
                        <React.Fragment key={wannabe.id}>
                            <div className="other-user">
                                <Link to={`/user/${wannabe.id}`}>
                                    <div className="profile-pic">
                                        <img
                                            src={imgSrc}
                                            alt={`picture of ${wannabe.first} ${wannabe.last}`}
                                        ></img>
                                    </div>
                                </Link>
                                <div className="name-btn-box">
                                    <Link to={`/user/${wannabe.id}`}>
                                        {wannabe.first} {wannabe.last}
                                    </Link>
                                    <button
                                        onClick={e =>
                                            dispatch(
                                                acceptFriendRequest(wannabe.id)
                                            )
                                        }
                                    >
                                        Accept Friend Request
                                    </button>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>

            {friends.length == 0 && (
                <div className="no-friends">
                    <p>
                        no friends yet?{" "}
                        <Link to="/users" className="link">
                            Find Pondlings
                        </Link>
                    </p>
                </div>
            )}
            {friends.length != 0 && <h2>Your are friends with:</h2>}
            <div className="friends users">
                {friends.map(friend => {
                    // console.log('friend: ', friend);
                    let imgSrc = "/images/duck-308733.svg";
                    if (friend.img_url) {
                        imgSrc = friend.img_url;
                    }
                    return (
                        <React.Fragment key={friend.id}>
                            <div className="other-user">
                                <Link to={`/user/${friend.id}`}>
                                    <div className="profile-pic">
                                        <img
                                            src={imgSrc}
                                            alt={`picture of ${friend.first} ${friend.last}`}
                                        ></img>
                                    </div>
                                </Link>
                                <div className="name-btn-box">
                                    <Link to={`/user/${friend.id}`}>
                                        {friend.first} {friend.last}
                                    </Link>
                                    <button
                                        onClick={e =>
                                            dispatch(unfriend(friend.id))
                                        }
                                    >
                                        Unfriend
                                    </button>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
