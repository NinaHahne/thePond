
export default function reducer(state = {}, action) {
    if (action.type === 'ALL_CAPS_WITH_UNDERSCORES') {
        // cloning global redux state with spread operator:
        state = {
            ... state,
            friendsWannabes: []
        };
        // ***immutable methods for making changes to redux:***
        // map - good for changing item(s) in an array
        // filter - removes item(s) from an array
        // concat - combine two or more arrays into one array
        //  ... (spread operator) - copy arrays and objects and add properties to those copies
        // OR (instead of ...): Object.assign  - make copies of objects
    }

    // if (true) {
    //
    // }
    //
    // if (true) {
    //
    // }

    return state;
}
