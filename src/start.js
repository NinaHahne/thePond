import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

// for socket.io:
import {init} from './socket';

// for redux *************************************************
import { Provider } from "react-redux";

import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducers";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
// /for redux *************************************************

let elem;
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    // for socket.io:
    init(store);
    // happens if user is isLoggedIn:
    // elem =
    // <div className="logo-small">
    //     <img src="/images/thePond_2.svg" alt="thePond"/>
    //     <p><a href="/logout">hop out</a></p>
    // </div>;
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

// const isLoggedIn = location.pathname != 'welcome';
// let elem = <Welcome />;
// if (isLoggedIn) {
//     elem = <img src="/logo.gif"/>;
// }

ReactDOM.render(elem, document.querySelector("main"));
