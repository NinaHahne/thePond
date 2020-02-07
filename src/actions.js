import axios from './axios';

export async function receiveFriendsWannabes() {
    const { data } = await axios.get('/friends-wannabes');
    return {
        type: 'RECEIVE_FRIENDS_WANNABES',
        friendsWannabes: data.friendsWannabes
    };
}

export async function acceptFriendRequest(otherUserId) {
    const { data } = await axios.post("/accept-friend-request/" + otherUserId);
    return {
        type: 'ACCEPT_FRIEND_REQUEST',
        acceptedUserId: otherUserId
    };
}

export async function unfriend(otherUserId) {
    const { data } = await axios.post("/end-friendship/" + otherUserId);
    return {
        type: 'UNFRIEND',
        unfriendedUserId: otherUserId
    };
}

// export function fn1() {
//     // axios requests to server
//     // ALL action creators will return objects that have a type property
//     // all types should be written ALL_CAPS_WITH_UNDERSCORES
//
// }
