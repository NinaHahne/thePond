import React from "react";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset";
import { HashRouter, Route } from "react-router-dom";

// http://localhost:8080/#/
// http://localhost:8080/#/login

// login only appears if after #" is "/login"
// "exact" makes sure that the path must be exactly whats in the string (not just contains or start with it..)

export default function Welcome() {
    return (
        <HashRouter>
            <div className="welcome">
                <div className="logo-big">
                    <h1>welcome to</h1>
                    <img src="/images/thePond_3.svg" alt="thePond"></img>
                </div>
                <div className="auth">
                    <Route exact path="/" component={Registration} />
                    <Route exact path="/login" component={Login} />
                    <Route path="/reset" component={ResetPassword} />
                </div>
            </div>
        </HashRouter>
    );
}
