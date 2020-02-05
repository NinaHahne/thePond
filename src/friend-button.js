import React, { useState, useEffect } from 'react';
import axios from './axios';

// import {useFriendSubmit} from './hooks/useFriendSubmit';

export default function FriendButton(props) {

    // const [error, handleSubmit] = useFriendSubmit(props.otherUserId, buttonText);
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        // props.otherUserId is undefined when component is loaded for the first time.. WHY???
        if (props.otherUserId) {
            let ignore = false;
            (async () => {
                try {
                    const { data } = await axios.get(`/friends-status/${props.otherUserId}`);
                    if (!ignore) {
                        // existing friend request?
                        if (data.friendsStatus) {
                            // console.log('data.friendsStatus: ', data.friendsStatus);
                            // is the request accepted?
                            if (data.friendsStatus.accepted) {
                                setButtonText('Unfriend');
                            } else {
                                // request not acccepted
                                // is the profile owner (other User) the recipient?
                                if (props.otherUserId == data.friendsStatus.recipient_id) {
                                    setButtonText('Cancel Friend Request');
                                } else {
                                    setButtonText('Accept Friend Request');
                                }
                            }

                        } else {
                            // no friendship/request found
                            setButtonText('Make Friend Request');
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            })();

            return () => {
                ignore = true;
            };

        }
    });

    const handleSubmit = () => {
        let url;
        if (buttonText == "Make Friend Request") {
            url = "/make-friend-request/" + props.otherUserId;
        } else if (buttonText == "Accept Friend Request") {
            url = "/accept-friend-request/" + props.otherUserId;
        } else if (
            buttonText == "Cancel Friend Request" ||
            buttonText == "Unfriend"
        ) {
            url = "/end-friendship/" + props.otherUserId;
        }
        axios
            .post(url)
            .then(({ data }) => {
                if (data.success) {
                    // change the buttonText:
                    if (buttonText == "Make Friend Request") {
                        setButtonText("Cancel Friend Request");
                    } else if (buttonText == "Accept Friend Request") {
                        setButtonText("Unfriend");
                    } else if (
                        buttonText == "Cancel Friend Request" ||
                        buttonText == "Unfriend"
                    ) {
                        setButtonText("Make Friend Request");
                    }

                } else {
                    // // what to do in this case??
                }
            })
            .catch(err => {
                console.log("err in handleSubmit in FriendButton: ", err);
            });
    };

    return (
        <div className="friend">
            <button onClick={e => handleSubmit(e)}>{buttonText}</button>
        </div>
    );

}
