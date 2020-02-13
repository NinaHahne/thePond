import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function OnlineUsers() {
    const onlineUsers = useSelector(
        state => state && state.onlineUsers
    );

    console.log('onlineUsers: ', onlineUsers);

    const elemRef = useRef();

    useEffect(() => {
        console.log("OnlineUsers mounted!");

    }, [onlineUsers]);

    if (!onlineUsers) {
        return null;
    }

    return (
        <div className="online-users">
            <h2>Online Users:</h2>
            <div className="online-users-container users" ref={elemRef}>
                {onlineUsers.map(user => {
                    return (
                        <Link to={`/user/${user.id}`} key={user.id}>
                            <div className="other-user" key={user.id}>
                                <div className="profile-pic">
                                    <img src={user.img_url || '/images/duck-308733.svg'} alt={`picture of ${user.first} ${user.last}`}></img>
                                </div>
                                <div >{user.first} {user.last}</div>
                            </div>
                        </Link>
                    );
                    // return (
                    //     <div key={user.id} className="user">
                    //         <div className="profile-pic">
                    //             <img
                    //                 src={
                    //                     user.img_url ||
                    //                     "/images/duck-308733.svg"
                    //                 }
                    //                 alt={`picture of ${user.first} ${user.last}`}
                    //             ></img>
                    //         </div>
                    //         <div className="name">
                    //             <Link to={`/user/${user.id}`}>
                    //                 {user.first} {user.last}
                    //             </Link>
                    //         </div>
                    //     </div>
                    // );
                })}
            </div>
        </div>
    );
}
