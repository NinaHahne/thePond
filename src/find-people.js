import React, { useState, useEffect } from 'react';
import axios from './axios';
import { Link } from "react-router-dom";

export default function FindPeople(props) {
    const [searchFor, setSearchFor] = useState(searchFor);
    const [users, setUsers] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);

    // only runs ONCE when component mounts (because of [] in the end of useEffect):
    useEffect(() => {
        let ignore = false;
        // console.log('props.userId: ', props.userId);
        (async () => {
            try {
                const { data } = await axios.get(`/users/recent/${props.userId}`);
                if (!ignore) {
                    if (data.success) {
                        // console.log('data in useEffect: ', data);
                        setRecentUsers(data.recentUsers);
                    } else {
                        // no users found??
                        // what to do in this case??
                    }
                }
            } catch (err) {
                console.log(err);
            }
        })();

        return () => {
            // clean up function (return in useEffect is always a cleanup function)
            // invoked before component is re-rendered
            // console.log('searchFor in cleanup: ', searchFor);
            ignore = true;
        };
    }, []);

    // runs when component mounts AND when searchFor changes (because of [searchFor] in the end of useEffect):
    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const { data } = await axios.get('/api/find/' + searchFor);
                if (!ignore) {
                    if (data.success) {
                        // console.log('data in useEffect: ', data);
                        setUsers(data.users);
                    } else {
                        // no users found??
                        // what to do in this case??
                    }
                }
            } catch (err) {
                console.log(err);
            }
        })();

        return () => {
            // clean up function (return in useEffect is always a cleanup function)
            // invoked before component is re-rendered
            // in this cleanup function, country is always previous input (1 step behind)
            // invalidate responses that don't come back in the right order

            // console.log('searchFor in cleanup: ', searchFor);
            ignore = true;
        };
    }, [searchFor]);

    const onSearchForChange = ({target}) => {
        // console.log('target.value: ', target.value);
        setSearchFor(target.value);
    };

    return (
        <div className="find-users main">
            <h2>Find Pondlings</h2>
            {!searchFor && (
                <div className="recently-joined">
                    <h3>Checkout who just joined!</h3>
                    <div className="users">
                        { recentUsers.map((user) => {
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
                        }) }
                    </div>
                </div>
            )}
            <div className="search-users">
                <h3>Are you looking for someone in particular?</h3>
                <input className="input" onChange={onSearchForChange} placeholder='Enter first name' />
                {searchFor && (
                    <div className="users">
                        { users.map((user) => {
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
                        }) }
                    </div>
                )}
            </div>
        </div>
    );
}
