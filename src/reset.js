import React from 'react';
// axios copy including csrf token:
import axios from './axios';
import { Link } from 'react-router-dom';

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: "start"
        };
    }
    handleChange(e) {
        // this[e.target.name] = e.target.value;
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    getCurrentDisplay() {
        if (this.state.step == "start") {
            return (
                <div className="reset">
                    <h2>Reset Password</h2>
                    {this.state.error && <div className="error">Oops!  Please try again!</div>}
                    <input className="input" name="email" placeholder="email" onChange={e => this.handleChange(e)}/>
                    <button onClick={e => this.submit(e)}>submit</button>
                    <p>Actually remembering your password? <Link className="link" to="/login">hop in</Link></p>
                    <img className="reed" src="/images/jing.fm-pond-clipart-293509.png"></img>
                </div>
            );
        } else if (this.state.step == "verify") {
            return (
                <div className="reset">
                    <h2>Reset Password</h2>
                    {this.state.error && <div className="error">Oops!  Please try again!</div>}
                    <p>Please check your mails and enter the code we just sent you:</p>
                    <input className="input" key="code" name="code" placeholder="code" onChange={e => this.handleChange(e)}/>
                    <input className="input" type="password" name="password" placeholder="new password" onChange={e => this.handleChange(e)}/>
                    <button onClick={(e) => this.submit(e)}>submit</button>
                    <img className="reed" src="/images/jing.fm-pond-clipart-293509.png"></img>
                </div>
            );
        } else if (this.state.step == "confirmed") {
            return (
                <div className="reset">
                    <h2>Reset Password</h2>
                    <p>Success!</p>
                    <p>You can now <Link className="link" to="/login">hop in</Link> with your new password</p>
                    <img className="reed" src="/images/jing.fm-pond-clipart-293509.png"></img>
                </div>
            );
        }
    }
    submit(e) {
        e.preventDefault();
        if (this.state.step == "start") {
            axios.post('/reset/start', {
                email: this.state.email
            }).then(({data}) => {
                if (data.success) {
                    console.log('email found and we just sent you a secret code');
                    // it worked
                    this.setState({
                        step: "verify"
                    });
                } else {
                    // failure!
                    this.setState({
                        error: true
                    });
                }
            });
        } else if (this.state.step == "verify") {
            axios.post('/reset/verify', {
                email: this.state.email,
                code: this.state.code,
                password: this.state.password
            }).then(({data}) => {
                if (data.success) {
                    // it worked
                    this.setState({
                        step: "confirmed"
                    });
                } else {
                    // failure!
                    this.setState({
                        error: true
                    });
                }
            });
        }
    }
    render() {
        // console.log(this.state);
        return (
            this.getCurrentDisplay()
            // <div className="reset">
            //     <p>Reset Password</p>
            // </div>
        );
    }
}
