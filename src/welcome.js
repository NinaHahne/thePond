import React from 'react';
import Registration from './registration';

export default function Welcome() {

    return (
        <div>
            <div className="welcome">
                <img src="/images/welcome-to_2.svg" alt="welcome to"></img>
                <img src="/images/thePond.svg" alt="thePond"></img>
            </div>
            <div>
                <Registration />
            </div>
        </div>
    );
}
