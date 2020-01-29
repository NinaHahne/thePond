import React from 'react';
import ReactDOM from 'react-dom';
// import Hello from './hello';
import Welcome from './welcome';

// console.log('hi!');

// const elem = <Hello />;
//
// ReactDOM.render(
//     elem,
//     document.querySelector('main')
// );

let elem;
if (location.pathname == '/welcome') {
    elem = <Welcome />;
} else {
    // happens if user is isLoggedIn:
    elem =
    <div className="logo-small">
        <img src="/images/thePond.svg" alt="thePond"/>
        <p><a href="/logout">hop out</a></p>
    </div>;
}

// const isLoggedIn = location.pathname != 'welcome';
// let elem = <Welcome />;
// if (isLoggedIn) {
//     elem = <img src="/logo.gif"/>;
// }

ReactDOM.render(
    elem,
    document.querySelector('main')
);
