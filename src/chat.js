import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {socket} from './socket.js';
import { useSelector } from "react-redux";

import OnlineUsers from './online-users';

export function Chat() {
    const chatMessages = useSelector(
        state => state && state.chatMessages
    );
    // console.log('chatMessages: ', chatMessages);

    const elemRef = useRef();

    useEffect(() => {
        console.log('chat mounted!!!!!!');

        if (chatMessages) {
            // console.log('elemRef: ', elemRef);
            let {clientHeight, scrollTop, scrollHeight} = elemRef.current;
            // console.log('scroll top: ', scrollTop);
            // console.log('client height: ', clientHeight);
            // console.log('scroll height: ', scrollHeight);
            elemRef.current.scrollTop = scrollHeight - clientHeight;
        }

    }, [chatMessages]);

    const keyCheck = e => {
        if (e.key == 'Enter'){
            e.preventDefault(); // stops the annoying moving to a new line when pressing enter
            // console.log('which key user pressed...', e.keyCode);
            // console.log('which key user pressed...', e.key);
            // console.log('what the user is typing: ', e.target.value);
            socket.emit('My amazing chat message', e.target.value);
            e.target.value = '';
        }
    };

    if (!chatMessages) {
        return null;
    }

    return (
        <div className='main chat-room'>
            <div className='chat'>
                <h2>Chat</h2>
                <div className='chat-container users' ref={elemRef}>
                    {chatMessages.map(message => {
                        return (
                            <div key={message.id} className="message other-user">
                                <div className="profile-pic">
                                    <Link to={`/user/${message.user_id}`}>
                                        <img
                                            src={message.img_url || "/images/duck-308733.svg"}
                                            alt={`picture of ${message.first} ${message.last}`}
                                        ></img>
                                    </Link>
                                </div>
                                <div className="name-date-msg-box">
                                    <Link to={`/user/${message.user_id}`}>
                                        {message.first} {message.last}
                                    </Link>
                                    <span className="date-time">{message.prettyDate || message.created_at}</span>
                                    <p>{message.msg}</p>
                                </div>
                            </div>

                        );
                    }) }
                </div>
                <textarea
                    rows="3"
                    className="new-message"
                    placeholder = 'add your message here'
                    onKeyDown = {keyCheck}>
                </textarea>
            </div>
            <OnlineUsers />

        </div>
    );
}
