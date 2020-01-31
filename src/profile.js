import React from "react";
import ProfilePic from './profilepic';
import BioEditor from './bioeditor';

export default function Profile(props) {
    // console.log('props in profilepic.js: ', props);
    return (
        <div className="profile">
            <ProfilePic
                clickHandler={props.clickHandler}
                imageUrl={props.imageUrl}
                first={props.first}
                last={props.last}
            />
            <BioEditor
                userId={props.userId}
                first={props.first}
                last={props.last}
                bio={props.bio}
                setBio={props.setBio}
            />
        </div>
    );
}
