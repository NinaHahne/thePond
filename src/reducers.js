
export default function reducer(state = {}, action) {
    if (action.type === 'RECEIVE_FRIENDS_WANNABES') {
        // cloning global redux state with spread operator:
        state = {
            ... state,
            friendsWannabes: action.friendsWannabes
        };
    }

    if (action.type === 'ACCEPT_FRIEND_REQUEST') {

        state = {
            ... state,
            acceptedUserId: action.acceptedUserId
        };
    }

    if (action.type === 'UNFRIEND') {

        state = {
            ... state,
            unfriendedUserId: action.unfriendedUserId
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
