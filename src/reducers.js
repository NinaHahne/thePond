export default function reducer(state = {}, action) {

    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        // cloning global redux state with spread operator:
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes
        };
    }

    if (action.type === "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map(user => {
                if (user.id == action.otherUserId) {
                    return {
                        ...user,
                        accepted: true
                    };
                }
                return user;
            })
        };
    }

    if (action.type === "UNFRIEND") {
        state = {
            ...state ,
            friendsWannabes: state.friendsWannabes.filter(user => {
                return user.id != action.otherUserId;
            })
        };
    }

    if (action.type === "CHAT_MESSAGES") {
        state = {
            ...state ,
            chatMessages: action.msgs
        };
    }

    if (action.type === "CHAT_MESSAGE") {
        // console.log('in reducer.js.. CHAT_MESSAGE: ', action.msg);
        state = {
            ...state ,
            chatMessages: state.chatMessages.concat(action.msg)
        };
    }

    if (action.type === "SHOW_ONLINE_USERS") {
        state = {
            ...state ,
            onlineUsers: action.onlineUsers
        };
    }

    if (action.type === "PASS_USER_ID") {
        state = {
            ...state ,
            userId: action.userId
        };
    }

    // if (action.type === 'ALL_CAPS_WITH_UNDERSCORES') {
    //
    // }
    return state;
}

// ***immutable methods for making changes to redux:***
// map - good for changing item(s) in an array
// filter - removes item(s) from an array
// concat - combine two or more arrays into one array
//  ... (spread operator) - copy arrays and objects and add properties to those copies
// OR (instead of ...): Object.assign  - make copies of objects
