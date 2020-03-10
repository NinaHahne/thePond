import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {socket} from './socket.js';
import { useSelector } from "react-redux";

import OnlineUsers from './online-users';

export function Chat() {
    const chatMessages = useSelector(
        state => state && state.chatMessages
    );
    const userId = useSelector(
        state => state && state.userId
    );
    // console.log('chatMessages: ', chatMessages);

    const elemRef = useRef();

    useEffect(() => {
        console.log('chat mounted!!!!!!');
        console.log('userId: ', userId);

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
            socket.emit('post chat message', e.target.value);
            e.target.value = '';
        }
    };

    if (!chatMessages) {
        return null;
    }

    return (
        <div className='main chat-room'>
            <div className='chat'>
                <h2>Pondwide Chat</h2>
                <div className='chat-container users' ref={elemRef}>
                    {chatMessages.map(message => {
                        let msgClassName = 'message-left';
                        if (message.user_id == userId) {
                            msgClassName = 'message-right';
                        }
                        return (
                            <div key={message.id} className={`message other-user ${msgClassName}`}>
                                <div className="profile-pic">
                                    <Link to={`/user/${message.user_id}`}>
                                        <img
                                            src={message.img_url || "/images/duck-308733.png"}
                                            alt={`picture of ${message.first} ${message.last}`}
                                        ></img>
                                    </Link>
                                </div>
                                <div className="name-date-msg-box">
                                    <div className="name-date-box">
                                        <Link to={`/user/${message.user_id}`}>
                                            {message.first} {message.last}
                                        </Link>
                                        <span className="date-time">{message.prettyDate || message.created_at}</span>
                                    </div>
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
            
            <img className="reed" src="/images/jing.fm-pond-clipart-293509.png"></img>
        </div>
    );
}
